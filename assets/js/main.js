const username = "Nksan-0101";  // 你的 GitHub 用户名
const repo = "Blog";       // 你的 GitHub 仓库名
const token = "BLOG_ACCESS";  // 这里要填入 GitHub Token ⚠️ 不能直接暴露在前端，推荐用 GitHub Actions

// ✅ 获取博客文章并加载到页面
async function loadPosts() {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/main/posts.json`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const posts = await response.json();
        let html = "";
        posts.slice(0, 5).forEach(post => {
            html += `<div class="post">
                        <h2>${post.title}</h2>
                        <p>${post.date}</p>
                        <p>${post.content.substring(0, 100)}...</p>
                     </div>`;
        });

        document.getElementById('latest-posts').innerHTML = html;
    } catch (error) {
        console.error("加载文章失败:", error);
    }
}

// ✅ 发布新博客文章
async function addPost() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    if (!title || !content) return alert("请输入标题和内容");

    const date = new Date().toISOString().split("T")[0];
    const newPost = { title, date, content };

    try {
        // 获取 GitHub 上的 `posts.json`
        const getRes = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/posts.json`, {
            headers: { "Authorization": `token ${token}` }
        });
        if (!getRes.ok) throw new Error(`HTTP Error: ${getRes.status}`);

        const getData = await getRes.json();
        const decodedContent = JSON.parse(atob(getData.content));  // 解码 base64 JSON

        // 添加新文章
        decodedContent.unshift(newPost);
        const updatedContent = btoa(JSON.stringify(decodedContent, null, 2));  // 转回 base64

        // 提交到 GitHub
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/posts.json`, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Add new post: ${title}`,
                content: updatedContent,
                sha: getData.sha  // GitHub 需要原文件的 sha 值才能修改
            })
        });

        if (response.ok) {
            alert("文章已发布！");
            location.reload();  // 重新加载页面，显示新文章
        } else {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    } catch (error) {
        console.error("发布文章失败:", error);
        alert("发布失败，请检查 Token 是否正确");
    }
}

// ✅ 页面加载时获取文章
window.onload = loadPosts;

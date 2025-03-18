async function loadPosts() {
    const response = await fetch(`https://api.github.com/repos/Nksan-0101/Blog/contents/posts.json`, {
        method: "GET",
        headers: {
            "Authorization": `token YOUR_GITHUB_TOKEN`,  // ⚠️ 这里要改成你的 Token（安全起见，前端不应该暴露 Token！）
            "Accept": "application/vnd.github.v3+json"
        }
    });

    if (!response.ok) {
        console.error("获取文章失败:", response.status, await response.text());
        return;
    }

    const data = await response.json();
    const posts = JSON.parse(atob(data.content));  // GitHub API 返回 base64 编码的内容，需要解码

    let html = "";
    posts.forEach(post => {
        html += `<div class="post">
                    <h2><a href="log.html#${post.id}">${post.title}</a></h2>
                    <p>${post.date}</p>
                 </div>`;
    });

    document.getElementById('latest-posts').innerHTML = html;
}

// 当页面加载时自动运行
window.onload = loadPosts;

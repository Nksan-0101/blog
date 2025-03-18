async function loadPosts() {
    const response = await fetch('https://raw.githubusercontent.com/Nksan-0101/Myownroom/main/posts.json');
    const posts = await response.json();
    let html = "";
    posts.forEach(post => {
        html += `<div class="post">
                    <h2><a href="log.html#${post.id}">${post.title}</a></h2>
                    <p>${post.date}</p>
                 </div>`;
    });
    document.getElementById('posts').innerHTML = html;
}
window.onload = loadPosts;

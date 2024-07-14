$(document).ready(function () {
    const posts = ['post1.md', 'post2.md']; // List your Markdown files here

    fetchMarkdownFiles(posts);

    async function fetchMarkdownFiles(posts) {
        for (let post of posts) {
            const response = await fetch(`posts/${post}`);
            if (response.ok) {
                const text = await response.text();
                const title = extractTitle(text);
                const postElement = createPostElement(post, title);
                $('#posts').append(postElement);
            } else {
                console.error(`Failed to load ${post}: ${response.statusText}`);
            }
        }
    }

    function extractTitle(markdown) {
        // Extract the first line as the title
        const lines = markdown.split('\n');
        return lines[0].replace(/^#\s*/, ''); // Remove the markdown header symbol
    }

    function createPostElement(post, title) {
        const postDiv = $('<div>').addClass('post card mb-4');

        postDiv.html(`
            <div class="card-body">
                <h5 class="card-title"><a href="post.html?post=${post}">${title}</a></h5>
            </div>
        `);

        return postDiv;
    }
});

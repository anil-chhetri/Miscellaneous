document.addEventListener('DOMContentLoaded', () => {
    const posts = document.querySelectorAll('.post-item');
    posts.forEach(post => {
        post.addEventListener('mouseenter', () => {
            post.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.2)';
        });
        post.addEventListener('mouseleave', () => {
            post.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        });
    });
});

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postName = urlParams.get('post');

    fetchPost(postName);

    async function fetchPost(post) {
        const response = await fetch(`posts/${post}`);
        if (response.ok) {
            const text = await response.text();
            const hasTOC = text.includes('## Table of Contents');
            const toc = hasTOC ? '' : generateTOC(text);
            $('#post-content').append(formatContent(toc));
            const title = extractTitle(text);
            $('#post-title').text(title);
            $('#post-content').append(formatContent(text));
        } else {
            console.error(`Failed to load post: ${response.statusText}`);
        }
    }

    function generateTOC(markdown) {
        const toc = [];
        const headings = markdown.match(/^(#{1,6})\s+(.*)$/gm);
    
        if (headings) {
            headings.forEach(heading => {
                const level = heading.match(/#/g).length; // Count the number of '#' for heading level
                const title = heading.replace(/^(#{1,6})\s+/, '').trim();
                const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                toc.push(`${' '.repeat((level - 1) * 2)}- [${title}](#${slug})`);
            });
        }
    
        return toc.length ? ['## Table of Contents', '', ...toc.map(item => `${item}`), ''].join('\n') : '';
    }

    function extractTitle(markdown) {
        const lines = markdown.split('\n');
        return lines[0].replace(/^#\s*/, ''); // Remove the markdown header symbol
    }

    function formatContent(markdown) {
        const sections = markdown.split(/^(#|##)\s+(.*)/gm); // Split by headers

        let content = '';
        for (let i = 1; i < sections.length; i += 3) {
            const headerLevel = sections[i].length; // Header level
            const header = sections[i + 1]; // Header text
            const paragraph = sections[i + 2] ? sections[i + 2].trim() : ''; // Associated content
            
            const hasTOC = content.includes('## Table of Contents');
            const toc = hasTOC ? '' : generateTOC(content);
            
            console.log(hasTOC)

            if (header) {
                content += `
                    <div class="card mb-3">
                        <div class="card-header">
                            <h${headerLevel} id=${header.toLowerCase().replace(/\s+/g, '-')} class="m-0">${header}</h${headerLevel}>
                        </div>
                        <div class="card-body">
                            ${marked.parse(paragraph)}
                        </div>
                    </div>`;
            }
        }

        return content;
    }

});

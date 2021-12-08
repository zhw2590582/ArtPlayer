document.addEventListener('click', (event) => {
    if (event.target.className === 'run-code') {
        event.preventDefault();
        const codeElement = event.target.nextElementSibling.querySelector('pre code');
        if (codeElement) {
            const libs = event.target.dataset.libs || '';
            const code = encodeURIComponent(codeElement.innerText);
            const env = window.location.host.includes('localhost') ? 'http://localhost:8080' : 'https://artplayer.org';
            const url = env + '/?libs=' + libs + '&code=' + code;
            window.open(url);
        }
    }
});

document.addEventListener('click', (event) => {
    if (event.target.className === 'run-code') {
        event.preventDefault();
        const codeElement = event.target.nextElementSibling.querySelector('pre code');
        if (codeElement) {
            const libs = event.target.dataset.libs || '';
            const code = encodeURIComponent(codeElement.innerText);
            const url = 'https://artplayer.org/?libs=' + libs + '&code=' + code;
            window.open(url);
        }
    }
});

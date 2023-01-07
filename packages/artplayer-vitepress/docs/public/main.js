(function () {
    if (window['run-code-init']) return;
    window['run-code-init'] = true;
    document.addEventListener('click', (event) => {
        if (event.target.className === 'run-code') {
            event.preventDefault();
            const codeElement = event.target.nextElementSibling.querySelector('pre code');
            if (codeElement) {
                const libs = event.target.dataset.libs || '';
                const code = encodeURIComponent(codeElement.innerText);
                const env = 'https://artplayer.org';
                const url = env + '/?libs=' + libs + '&code=' + code;
                window.open(url);
            }
        }
    });
})();



(function () {
    if (window['run-code-init']) return;
    window['run-code-init'] = true;
    document.addEventListener('click', (event) => {
        if (event.target.className === 'run-code' || event.target.getAttribute('classname') === 'run-code') {
            event.preventDefault();
            const codeElement = event.target.nextElementSibling.querySelector('pre code');
            if (codeElement) {
                const libs = event.target.dataset.libs || '';
                const code = encodeURIComponent(codeElement.innerText);
                const isDev = location.hostname === 'localhost';
                const env = isDev ? 'http://localhost:8082' : 'https://artplayer.org';
                const url = env + '/?libs=' + libs + '&code=' + code;
                window.open(url);
            }
        }
    });
})();



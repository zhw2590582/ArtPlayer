window.runCode = function(hook) {
  hook.ready(function() {
    Array.from(document.querySelectorAll('.markdown-section a'))
      .filter(function(item) {
        return item.innerHTML === 'Run Code';
      })
      .forEach(function(item) {
        item.addEventListener('click', function(event) {
          event.preventDefault();
          var codeElement = item.parentElement.nextElementSibling;
          if (
            codeElement.tagName === 'PRE' &&
            codeElement.dataset.lang === 'js'
          ) {
            var libs = item.href.split('/lib=')[1] || '';
            var code = encodeURIComponent(codeElement.innerText);
            var url = 'https://artplayer.org/lab/?libs=' + libs + '&code=' + code;
            window.open(url);
          }
        });
      });
  });
};

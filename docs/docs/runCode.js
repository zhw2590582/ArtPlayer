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
            var code = window.encodeURIComponent(codeElement.innerText);
            window.open(
              'https://blog.zhw-island.com/ArtPlayer/lab/?code=' + code
            );
          }
        });
      });
  });
};

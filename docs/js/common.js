(function(win) {
  var $code = document.querySelector('.code');
  var $run = document.querySelector('.run');

  consola.creat({
    target: '.console',
    size: '100%',
    zIndex: 99
  });

  var mirror = CodeMirror($code, {
    lineNumbers: true,
    mode: 'javascript',
    matchBrackets: true,
    value: ''
  });

  function initApp(app) {
    consola.clean();
    Artplayer.config.video.events.forEach(item => {
      app.on('video:' + item, event => {
        console.log('video: ' + event.type);
      });
    });
  }

  function getURLParameters(url) {
    return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
      (a, v) => (
        (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
      ),
      {}
    );
  }

  function loadCode(url) {
    const { code } = getURLParameters(window.location.href);
    if (code) {
      mirror.setValue(decodeURIComponent(code).trim());
      runCode();
    } else {
      fetch(url)
        .then(response => {
          return response.text();
        })
        .then(text => {
          mirror.setValue(text.trim());
          runCode();
          return text;
        })
        .catch(err => {
          console.error(err.message);
        });
    }
  }

  function runCode() {
    Artplayer.instances.forEach(ins => {
      ins.destroy(true);
    });
    var code = mirror.getValue();
    eval(code);
    initApp(Artplayer.instances[0]);
  }

  $run.addEventListener('click', function(e) {
    runCode();
    const code = encodeURIComponent(mirror.getValue());
    const url = window.location.origin + window.location.pathname + '?code=' + code;
    history.pushState(null, null, url);
  });

  win.addEventListener('error', err => {
    console.error(err.message);
  });

  win.loadCode = loadCode;
})(window);

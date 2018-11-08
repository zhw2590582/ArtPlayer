(function (win) {
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
  });;

  function initApp(app) {
    consola.clean();
    Artplayer.config.video.events.forEach(item => {
      app.on('video:' + item, event => {
        console.log('video: ' + event.type);
      });
    });
  }

  function loadCode(url) {
    return fetch(url)
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

  function runCode() {
    try {
      Artplayer.instances.forEach(ins => {
        ins.destroy(true)
      });;
      eval(mirror.getValue());
      initApp(Artplayer.instances[0]);
    } catch (error) {
      console.error('Error：' + error.message.trim());
    }
  }

  $run.addEventListener('click', function (e) {
    runCode();
  });

  win.addEventListener('error', err => {
    console.error(err.message);
  });

  win.loadCode = loadCode;
})(window);

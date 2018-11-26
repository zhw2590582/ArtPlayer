(function(win) {
    var $code = document.querySelector('.code');
    var $run = document.querySelector('.run');
    var $lib = document.querySelector('.lib');
    var defaultLib = './js/artplayer-plugin-subtitle.js';
    var loaddLib = [];

    consola.creat({
        target: '.console',
        size: '100%',
        zIndex: 99,
    });

    var mirror = CodeMirror($code, {
        lineNumbers: true,
        mode: 'javascript',
        matchBrackets: true,
        value: '',
    });

    function initArt(art) {
        Artplayer.config.video.events.forEach(item => {
            art.on('video:' + item, event => {
                console.log('video: ' + event.type);
            });
        });
    }

    function getURLParameters(url) {
        return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
            (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
            {},
        );
    }

    function getExt(url) {
        if (url.includes('?')) {
            return getExt(url.split('?')[0]);
        }

        if (url.includes('#')) {
            return getExt(url.split('#')[0]);
        }

        return url
            .trim()
            .toLowerCase()
            .split('.')
            .pop();
    }

    function loadScript(url) {
        return new Promise(function(resolve, reject) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = function() {
                resolve(url);
            };
            document.querySelector('head').appendChild(script);
        });
    }

    function loadStyle(url) {
        return new Promise(function(resolve) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.src = url;
            document.querySelector('head').appendChild(style);
            resolve(url);
        });
    }

    function loadLib(libs = defaultLib) {
        var libPromise = [];
        libs.split(',')
            .filter(function(url) {
                return !loaddLib.includes(url);
            })
            .forEach(function(url) {
                var ext = getExt(url);
                if (ext === 'js') {
                    libPromise.push(loadScript(url));
                } else if (ext === 'css') {
                    libPromise.push(loadStyle(url));
                }
            });
        $lib.value = decodeURIComponent(libs);
        return Promise.all(libPromise);
    }

    function loadCode(code) {
        return new Promise(function(resolve, reject) {
            if (code) {
                mirror.setValue(decodeURIComponent(code).trim());
                runCode();
                resolve(code);
            } else {
                fetch('./js/example.js')
                    .then(response => {
                        return response.text();
                    })
                    .then(text => {
                        mirror.setValue(text);
                        runCode();
                        resolve(text);
                    })
                    .catch(err => {
                        console.error(err.message);
                    });
            }
        });
    }

    function initApp() {
        const { code, libs } = getURLParameters(window.location.href);
        loadLib(libs)
            .then(function(result) {
                loaddLib = loaddLib.concat(result);
                loadCode(code).then(() => {
                    console.info('App initialization completed');
                });
            })
            .catch(err => {
                console.error(err.message);
            });
    }

    function runCode() {
        Artplayer.instances.forEach(art => {
            art.destroy(true);
        });
        var code = mirror.getValue();
        eval(code);
        initArt(Artplayer.instances[0]);
    }

    $run.addEventListener('click', function(e) {
        runCode();
        const libs = encodeURIComponent($lib.value);
        const code = encodeURIComponent(mirror.getValue());
        const url = window.location.origin + window.location.pathname + '?libs=' + libs + '&code=' + code;
        history.pushState(null, null, url);
    });

    win.addEventListener('error', err => {
        console.error(err.message);
    });

    initApp();
})(window);

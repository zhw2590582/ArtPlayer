(function () {
    var userAgent = window.navigator.userAgent;
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    var isIE = /MSIE|Trident/.test(userAgent);

    if (isMobile) {
        window.location.href = './mobile.html';
        return;
    }

    if (isIE) {
        new VConsole();
    }

    var $codeMirror = document.querySelector('.codeMirrorWrap');
    var $lib = document.querySelector('.libsInput');
    var $run = document.querySelector('.run');
    var $popups = document.querySelector('.popups');
    var loaddLib = [];

    window.consoleLog(document.querySelector('.console'));

    var editor = null;
    require.config({ paths: { vs: './assets/js/vs' } });
    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create($codeMirror, {
            theme: 'vs-dark',
            model: monaco.editor.createModel(
                ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
                'javascript',
            ),
        });
        initApp();
    });

    function initArt(art) {
        Artplayer.config.events.forEach(function (item) {
            art &&
                art.on('video:' + item, function (event) {
                    console.log('video: ' + event.type);
                });
        });
    }

    function getURLParameters(url) {
        return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(function (a, v) {
            return (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a;
        }, {});
    }

    function getExt(url) {
        if (url.includes('?')) {
            return getExt(url.split('?')[0]);
        }

        if (url.includes('#')) {
            return getExt(url.split('#')[0]);
        }

        return url.trim().toLowerCase().split('.').pop();
    }

    function loadScript(url) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = function () {
                resolve(url);
            };
            script.onerror = function () {
                reject(new Error('Loading script failed:' + url));
            };
            document.querySelector('head').appendChild(script);
        });
    }

    function loadStyle(url) {
        return new Promise(function (resolve, reject) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = function () {
                resolve(url);
            };
            link.onerror = function () {
                reject(new Error('Loading style failed:' + url));
            };
            document.querySelector('head').appendChild(link);
        });
    }

    function loadLib(libs) {
        var libPromise = [];
        var libsDecode = decodeURIComponent(libs || '');
        libsDecode
            .split(/\r?\n/)
            .filter(function (url) {
                return !loaddLib.includes(url);
            })
            .forEach(function (url) {
                var ext = getExt(url);
                if (ext === 'js') {
                    libPromise.push(loadScript(url));
                } else if (ext === 'css') {
                    libPromise.push(loadStyle(url));
                }
            });
        $lib.value = libsDecode;
        return Promise.all(libPromise);
    }

    function runExample(name) {
        fetch('./assets/example/' + name + '.js')
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                editor.setValue(text);
                runCode();
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    function loadCode(code, example) {
        if (example) {
            runExample(example);
        } else if (code) {
            editor.setValue(decodeURIComponent(code).trim());
            runCode();
        } else {
            runExample('index');
        }
    }

    function formatDate(date) {
        var date = new Date(Number(date));
        var YY = date.getFullYear() + '-';
        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return YY + MM + DD + ' ' + hh + mm + ss;
    }

    function runCode() {
        Artplayer.instances.forEach(function (art) {
            art.destroy(true);
        });
        var code = editor.getValue();
        eval(code);
        initArt(Artplayer.instances[0]);
        console.debug('Artplayer@' + Artplayer.version);
        console.debug('Env@' + Artplayer.env);
        console.debug('Build@' + formatDate(Artplayer.build));
    }

    function initApp() {
        var _getURLParameters = getURLParameters(window.location.href),
            code = _getURLParameters.code,
            libs = _getURLParameters.libs;
        example = _getURLParameters.example;

        loadLib(libs)
            .then(function (result) {
                loaddLib = loaddLib.concat(result);
                loadCode(code, example);
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    window.addEventListener('error', function (err) {
        console.error(err);
    });

    window.addEventListener('unhandledrejection', function (err) {
        console.error(err);
    });

    $run.addEventListener('click', function (e) {
        var libs = encodeURIComponent($lib.value);
        var code = encodeURIComponent(editor.getValue());
        var url = window.location.origin + window.location.pathname + '?libs=' + libs + '&code=' + code;
        history.pushState(null, null, url);
        initApp();
    });

    $popups.addEventListener('click', function (e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
})();

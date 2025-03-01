(function () {
    Artplayer.DEBUG = true;

    if (Artplayer.utils.isMobile) {
        window.location.href = './mobile.html' + location.search;
    }

    var $codeMirror = document.querySelector('.codeMirrorWrap');
    var $lib = document.querySelector('.libsInput');
    var $run = document.querySelector('.run');
    var $popups = document.querySelector('.popups');
    var $console = document.querySelector('.console');
    var $prod = document.querySelector('#prod');
    var $ts = document.querySelector('#ts');
    var $code = document.querySelector('#code');
    var $log = document.querySelector('#log');
    var $file = document.querySelector('#file');
    var $editor = document.querySelector('#editor');

    window['consoleLog']($console);

    $prod.checked = localStorage.getItem('prod') === 'true';
    $ts.checked = localStorage.getItem('ts') === 'true';
    $code.checked = localStorage.getItem('code') === 'true';
    $log.checked = localStorage.getItem('log') === 'true';

    if ($code.checked) {
        $editor.style.display = 'none';
    }

    if ($log.checked) {
        $console.style.display = 'none';
    }

    var editor = null;
    var loadedLibs = [];
    require.config({ paths: { vs: './assets/js/vs' } });
    require(['vs/editor/editor.main'], async function () {
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false,
        });

        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES6,
            allowNonTsExtensions: true,
        });

        var libUris = [
            './assets/ts/artplayer-plugin-ads.d.ts',
            './assets/ts/artplayer-plugin-ambilight.d.ts',
            './assets/ts/artplayer-plugin-auto-thumbnail.d.ts',
            './assets/ts/artplayer-plugin-chapter.d.ts',
            './assets/ts/artplayer-plugin-chromecast.d.ts',
            './assets/ts/artplayer-plugin-danmuku-mask.d.ts',
            './assets/ts/artplayer-plugin-danmuku.d.ts',
            './assets/ts/artplayer-plugin-dash-control.d.ts',
            './assets/ts/artplayer-plugin-hls-control.d.ts',
            './assets/ts/artplayer-plugin-iframe.d.ts',
            './assets/ts/artplayer-plugin-libass.d.ts',
            './assets/ts/artplayer-plugin-multiple-subtitles.d.ts',
            './assets/ts/artplayer-plugin-vast.d.ts',
            './assets/ts/artplayer-plugin-vtt-thumbnail.d.ts',
            './assets/ts/artplayer.d.ts',
        ];
        
        for (let index = 0; index < libUris.length; index++) {
            var libUri = libUris[index];
            var libSource = await (await fetch(libUri)).text();
            monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
            monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));
        }

        var disposable = monaco.editor.onDidCreateEditor(function () {
            disposable.dispose();
            setTimeout(initApp, 1000);
        });

        editor = monaco.editor.create($codeMirror, {
            theme: 'vs-dark',
            folding: true,
            automaticLayout: true,
            quickSuggestions: {
                other: true,
                comments: true,
                strings: true,
            },
            model: monaco.editor.createModel(
                [
                    'var art = new Artplayer({',
                    "\tcontainer: '.artplayer-app',",
                    "\turl: '/assets/sample/video.mp4',",
                    '});',
                ].join('\n'),
                $ts.checked ? 'typescript' : 'javascript',
            ),
        });
    });

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
            var define2 = window.define;
            window.define = undefined;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = function () {
                window.define = define2;
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
                return !loadedLibs.includes(url);
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

    function runCode() {
        [...Artplayer.instances].forEach(function (art) {
            art.destroy(true);
        });
        const value = editor.getValue();
        eval(value);
        window.art = Artplayer.instances[0];
    }

    function initApp() {
        var _getURLParameters = getURLParameters(window.location.href),
            code = _getURLParameters.code,
            libs = _getURLParameters.libs;
        example = _getURLParameters.example;

        loadLib(libs)
            .then(function (result) {
                loadedLibs = loadedLibs.concat(result);
                loadCode(code, example);
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    function restart() {
        var libs = encodeURIComponent($lib.value);
        var code = encodeURIComponent(editor.getValue());
        var url = window.location.origin + window.location.pathname + '?libs=' + libs + '&code=' + code;
        history.pushState(null, null, url);
        initApp();
    }

    function readFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsText(file);
        })
    }

    $run.addEventListener('click', function () {
        restart();
    });

    $popups.addEventListener('click', function (event) {
        if (event.target === this) {
            this.style.display = 'none';
        }
    });

    $prod.addEventListener('change', function () {
        localStorage.setItem('prod', $prod.checked ? 'true' : 'false');
        window.location.reload();
    });

    $ts.addEventListener('change', function () {
        localStorage.setItem('ts', $ts.checked ? 'true' : 'false');
        window.location.reload();
    });

    $code.addEventListener('change', function () {
        localStorage.setItem('code', $code.checked ? 'true' : 'false');
        window.location.reload();
    });

    $log.addEventListener('change', function () {
        localStorage.setItem('log', $log.checked ? 'true' : 'false');
        window.location.reload();
    });

    $file.addEventListener('change', async function () {
        for (let index = 0; index < $file.files.length; index++) {
            const file = $file.files[index];
            const name = file.name.toLowerCase().trim()
            if (name.endsWith('.css')) {
                const text = await readFile(file);
                const $style = document.createElement('style');
                $style.textContent = text;
                document.body.appendChild($style);
                $lib.value = `\n[${name}]`;
                $lib.value = $lib.value.trim();
            }
            if (name.endsWith('.js')) {
                const text = await readFile(file);
                const $script = document.createElement('script');
                $script.textContent = text;
                document.body.appendChild($script);
                $lib.value = `\n[${name}]`;
                $lib.value = $lib.value.trim();
            }
        }
    });

    window.addEventListener('error', function (err) {
        console.error(err);
    });

    window.addEventListener('unhandledrejection', function (err) {
        console.error(err);
    });

    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            restart();
        }
    });
})();
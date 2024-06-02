(() => {
    Artplayer.DEBUG = true;

    if (Artplayer.utils.isMobile) {
        window.location.href = './mobile.html' + location.search;
    }

    const $codeMirror = document.querySelector('.codeMirrorWrap');
    const $lib = document.querySelector('.libsInput');
    const $run = document.querySelector('.run');
    const $popups = document.querySelector('.popups');
    const $console = document.querySelector('.console');
    const $prod = document.querySelector('#prod');
    const $ts = document.querySelector('#ts');
    const $code = document.querySelector('#code');
    const $log = document.querySelector('#log');
    const $file = document.querySelector('#file');
    const $editor = document.querySelector('#editor');

    window.consoleLog($console);

    // Initialize checkboxes from localStorage
    const initCheckbox = ($element, key) => {
        $element.checked = localStorage.getItem(key) === 'true';
        if ($element.checked) {
            $element.style.display = 'none';
        }
    };

    initCheckbox($prod, 'prod');
    initCheckbox($ts, 'ts');
    initCheckbox($code, 'code');
    initCheckbox($log, 'log');

    let editor = null;
    let loadedLibs = [];

    require.config({ paths: { vs: './assets/js/vs' } });

    require(['vs/editor/editor.main'], async () => {
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false,
        });

        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES6,
            allowNonTsExtensions: true,
        });

        const libUris = [
            './assets/ts/artplayer.d.ts',
            './assets/ts/artplayer-plugin-ads.d.ts',
            './assets/ts/artplayer-plugin-control.d.ts',
            './assets/ts/artplayer-plugin-danmuku.d.ts',
            './assets/ts/artplayer-plugin-dash-quality.d.ts',
            './assets/ts/artplayer-plugin-hls-quality.d.ts',
            './assets/ts/artplayer-plugin-iframe.d.ts',
            './assets/ts/artplayer-plugin-chromecast.d.ts',
            './assets/ts/artplayer-plugin-libass.d.ts',
            './assets/ts/artplayer-plugin-multiple-subtitles.d.ts',
            './assets/ts/artplayer-plugin-vtt-thumbnail.d.ts',
        ];

        for (const libUri of libUris) {
            const libSource = await (await fetch(libUri)).text();
            monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
            monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));
        }

        const disposable = monaco.editor.onDidCreateEditor(() => {
            disposable.dispose();
            setTimeout(initApp, 1000);
        });

        editor = monaco.editor.create($codeMirror, {
            theme: 'vs-dark',
            automaticLayout: true,
            quickSuggestions: { other: true, comments: true, strings: true },
            model: monaco.editor.createModel(
`var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});`,
                $ts.checked ? 'typescript' : 'javascript'
            ),
        });
    });

    const getURLParameters = (url) => (
        (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce((a, v) => {
            a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1);
            return a;
        }, {})
    );

    const getExt = (url) => {
        const cleanUrl = url.split(/[?#]/)[0];
        return cleanUrl.trim().toLowerCase().split('.').pop();
    };

    const loadScript = (url) => new Promise((resolve, reject) => {
        const originalDefine = window.define;
        window.define = undefined;
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = () => {
            window.define = originalDefine;
            resolve(url);
        };
        script.onerror = () => reject(new Error(`Loading script failed: ${url}`));
        document.head.appendChild(script);
    });

    const loadStyle = (url) => new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => resolve(url);
        link.onerror = () => reject(new Error(`Loading style failed: ${url}`));
        document.head.appendChild(link);
    });

    const loadLib = (libs) => {
        const libPromises = [];
        const libsDecode = decodeURIComponent(libs || '');

        libsDecode
            .split(/\r?\n/)
            .filter(url => !loadedLibs.includes(url))
            .forEach(url => {
                const ext = getExt(url);
                if (ext === 'js') {
                    libPromises.push(loadScript(url));
                } else if (ext === 'css') {
                    libPromises.push(loadStyle(url));
                }
            });

        $lib.value = libsDecode;
        return Promise.all(libPromises);
    };

    const runExample = async (name) => {
        try {
            const response = await fetch(`./assets/example/${name}.js`);
            const text = await response.text();
            editor.setValue(text);
            runCode();
        } catch (err) {
            console.error(err);
        }
    };

    const loadCode = (code, example) => {
        if (example) {
            runExample(example);
        } else if (code) {
            editor.setValue(decodeURIComponent(code).trim());
            runCode();
        } else {
            runExample('index');
        }
    };

    const runCode = () => {
        Artplayer.instances.forEach(art => art.destroy(true));
        eval(editor.getValue());
        window.art = Artplayer.instances[0];
    };

    const initApp = () => {
        const { code, libs, example } = getURLParameters(window.location.href);
        loadLib(libs)
            .then(result => {
                loadedLibs = loadedLibs.concat(result);
                loadCode(code, example);
            })
            .catch(console.error);
    };

    const restart = () => {
        const libs = encodeURIComponent($lib.value);
        const code = encodeURIComponent(editor.getValue());
        const url = `${window.location.origin}${window.location.pathname}?libs=${libs}&code=${code}`;
        history.pushState(null, null, url);
        initApp();
    };

    const readFile = (file) => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsText(file);
    });

    $run.addEventListener('click', restart);

    $popups.addEventListener('click', (event) => {
        if (event.target === $popups) {
            $popups.style.display = 'none';
        }
    });

    $prod.addEventListener('change', () => {
        localStorage.setItem('prod', $prod.checked);
        window.location.reload();
    });

    $ts.addEventListener('change', () => {
        localStorage.setItem('ts', $ts.checked);
        window.location.reload();
    });

    $code.addEventListener('change', () => {
        localStorage.setItem('code', $code.checked);
        window.location.reload();
    });

    $log.addEventListener('change', () => {
        localStorage.setItem('log', $log.checked);
        window.location.reload();
    });

    $file.addEventListener('change', async () => {
        for (const file of $file.files) {
            const name = file.name.toLowerCase().trim();
            const text = await readFile(file);
            if (name.endsWith('.css')) {
                const $style = document.createElement('style');
                $style.textContent = text;
                document.body.appendChild($style);
            } else if (name.endsWith('.js')) {
                const $script = document.createElement('script');
                $script.textContent = text;
                document.body.appendChild($script);
            }
            $lib.value += `\n[${name}]`.trim();
        }
    });

    window.addEventListener('error', console.error);
    window.addEventListener('unhandledrejection', console.error);

    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            restart();
        }
    });
})();

/* global Artplayer, monaco */
(function () {
  Artplayer.DEBUG = true

  if (Artplayer.utils.isMobile) {
    window.location.href = `./mobile.html${location.search}`
  }

  const $codeMirror = document.querySelector('.codeMirrorWrap')
  const $lib = document.querySelector('.libsInput')
  const $run = document.querySelector('.run')
  const $popups = document.querySelector('.popups')
  const $console = document.querySelector('.console')
  const $prod = document.querySelector('#prod')
  const $ts = document.querySelector('#ts')
  const $code = document.querySelector('#code')
  const $log = document.querySelector('#log')
  const $file = document.querySelector('#file')
  const $editor = document.querySelector('#editor')

  window.consoleLog($console)

  // Helper functions for localStorage
  const getStorageBoolean = key => localStorage.getItem(key) === 'true'
  const setStorageBoolean = (key, value) => localStorage.setItem(key, value ? 'true' : 'false')

  $prod.checked = getStorageBoolean('prod')
  $ts.checked = getStorageBoolean('ts')
  $code.checked = getStorageBoolean('code')
  $log.checked = getStorageBoolean('log')

  if ($code.checked) {
    $editor.style.display = 'none'
  }

  if ($log.checked) {
    $console.style.display = 'none'
  }

  let editor = null
  let initialization = 0
  require.config({ paths: { vs: './assets/js/vs' } })
  require(['vs/editor/editor.main'], async () => {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    })

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES6,
      allowNonTsExtensions: true,
    })

    const libUris = [
      './assets/ts/artplayer-plugin-ads.d.ts',
      './assets/ts/artplayer-plugin-ambilight.d.ts',
      './assets/ts/artplayer-plugin-asr.d.ts',
      './assets/ts/artplayer-plugin-audio-track.d.ts',
      './assets/ts/artplayer-plugin-auto-thumbnail.d.ts',
      './assets/ts/artplayer-plugin-chapter.d.ts',
      './assets/ts/artplayer-plugin-chromecast.d.ts',
      './assets/ts/artplayer-plugin-danmuku-mask.d.ts',
      './assets/ts/artplayer-plugin-danmuku.d.ts',
      './assets/ts/artplayer-plugin-dash-control.d.ts',
      './assets/ts/artplayer-plugin-document-pip.d.ts',
      './assets/ts/artplayer-plugin-hls-control.d.ts',
      './assets/ts/artplayer-plugin-jassub.d.ts',
      './assets/ts/artplayer-plugin-multiple-subtitles.d.ts',
      './assets/ts/artplayer-plugin-vast.d.ts',
      './assets/ts/artplayer-plugin-vtt-thumbnail.d.ts',
      './assets/ts/artplayer-proxy-canvas.d.ts',
      './assets/ts/artplayer-proxy-mediabunny.d.ts',
      './assets/ts/artplayer-tool-iframe.d.ts',
      './assets/ts/artplayer-tool-thumbnail.d.ts',
      './assets/ts/artplayer.d.ts',
      './assets/ts/artplayer-i18n.d.ts',
    ]

    for (let index = 0; index < libUris.length; index++) {
      const libUri = libUris[index]
      const libSource = await (await fetch(libUri)).text()
      monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri)
      monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri))
    }

    const disposable = monaco.editor.onDidCreateEditor(() => {
      disposable.dispose()
      setTimeout(initApp, 1000)
    })

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
          '\tcontainer: \'.artplayer-app\',',
          '\turl: \'/assets/sample/video.mp4\',',
          '});',
        ].join('\n'),
        $ts.checked ? 'typescript' : 'javascript',
      ),
    })
  })

  async function loadLib(libs) {
    $lib.value = decodeURIComponent(libs || '')
    return window.ArtplayerDocsLoader.loadLibraries(libs)
  }

  async function runExample(name, current) {
    const text = await window.ArtplayerDocsLoader.exampleSource(name)
    if (current !== initialization)
      return
    editor.setValue(text)
    runCode()
  }

  function loadCode(code, example, current) {
    if (current !== initialization)
      return
    if (example)
      return runExample(example, current)
    if (code) {
      editor.setValue(decodeURIComponent(code).trim())
      runCode()
    }
    else {
      return runExample('index', current)
    }
  }

  function runCode() {
    window.dispatchEvent(new Event('artplayer:example:cleanup'))
    // Destroy all existing instances
    Artplayer.instances.slice().forEach(art => art.destroy(true))

    const value = editor.getValue()
    // eslint-disable-next-line no-eval -- Preserve the editor's classic-script Run scope for user-provided examples.
    eval(value)
    window.art = Artplayer.instances[0]
  }

  function initApp() {
    const current = ++initialization
    const urlParams = window.ArtplayerDocsLoader.parameters(window.location.href)
    const { code, libs, example } = urlParams

    loadLib(libs)
      .then(() => loadCode(code, example, current))
      .catch((err) => {
        console.error('Failed to initialize app:', err)
      })
  }

  function restart() {
    const libs = encodeURIComponent($lib.value)
    const code = encodeURIComponent(editor.getValue())
    const url = `${window.location.origin}${window.location.pathname}?libs=${libs}&code=${code}`
    history.pushState(null, null, url)
    initApp()
  }

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsText(file)
    })
  }

  $run.addEventListener('click', () => {
    restart()
  })

  $popups.addEventListener('click', function (event) {
    if (event.target === this) {
      this.style.display = 'none'
    }
  })

  $prod.addEventListener('change', () => {
    setStorageBoolean('prod', $prod.checked)
    window.location.reload()
  })

  $ts.addEventListener('change', () => {
    setStorageBoolean('ts', $ts.checked)
    window.location.reload()
  })

  $code.addEventListener('change', () => {
    setStorageBoolean('code', $code.checked)
    window.location.reload()
  })

  $log.addEventListener('change', () => {
    setStorageBoolean('log', $log.checked)
    window.location.reload()
  })

  $file.addEventListener('change', async () => {
    for (let index = 0; index < $file.files.length; index++) {
      const file = $file.files[index]
      const name = file.name.toLowerCase().trim()
      if (name.endsWith('.css')) {
        const text = await readFile(file)
        const $style = document.createElement('style')
        $style.textContent = text
        document.body.appendChild($style)
        $lib.value = `\n[${name}]`
        $lib.value = $lib.value.trim()
      }
      if (name.endsWith('.js')) {
        const text = await readFile(file)
        const $script = document.createElement('script')
        $script.textContent = text
        document.body.appendChild($script)
        $lib.value = `\n[${name}]`
        $lib.value = $lib.value.trim()
      }
    }
  })

  window.addEventListener('error', (err) => {
    console.error(err)
  })

  window.addEventListener('unhandledrejection', (err) => {
    console.error(err)
  })

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault()
      restart()
    }
  })
})()

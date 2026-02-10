(function () {
  Artplayer.DEBUG = true

  if (Artplayer.utils.isMobile) {
    window.location.href = `./mobile.html${location.search}`
  }

  let $codeMirror = document.querySelector('.codeMirrorWrap')
  let $lib = document.querySelector('.libsInput')
  let $run = document.querySelector('.run')
  let $popups = document.querySelector('.popups')
  let $console = document.querySelector('.console')
  let $prod = document.querySelector('#prod')
  let $ts = document.querySelector('#ts')
  let $code = document.querySelector('#code')
  let $log = document.querySelector('#log')
  let $file = document.querySelector('#file')
  let $editor = document.querySelector('#editor')

  window.consoleLog($console)

  // Helper functions for localStorage
  const getStorageBoolean = (key) => localStorage.getItem(key) === 'true'
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
  let loadedLibs = []
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

    let libUris = [
      './assets/ts/packages\artplayer-plugin-ads\types\artplayer-plugin-ads.d.ts',
      './assets/ts/packages\artplayer-plugin-ambilight\types\artplayer-plugin-ambilight.d.ts',
      './assets/ts/packages\artplayer-plugin-asr\types\artplayer-plugin-asr.d.ts',
      './assets/ts/packages\artplayer-plugin-audio-track\types\artplayer-plugin-audio-track.d.ts',
      './assets/ts/packages\artplayer-plugin-auto-thumbnail\types\artplayer-plugin-auto-thumbnail.d.ts',
      './assets/ts/packages\artplayer-plugin-chapter\types\artplayer-plugin-chapter.d.ts',
      './assets/ts/packages\artplayer-plugin-chromecast\types\artplayer-plugin-chromecast.d.ts',
      './assets/ts/packages\artplayer-plugin-danmuku-mask\types\artplayer-plugin-danmuku-mask.d.ts',
      './assets/ts/packages\artplayer-plugin-danmuku\types\artplayer-plugin-danmuku.d.ts',
      './assets/ts/packages\artplayer-plugin-dash-control\types\artplayer-plugin-dash-control.d.ts',
      './assets/ts/packages\artplayer-plugin-document-pip\types\artplayer-plugin-document-pip.d.ts',
      './assets/ts/packages\artplayer-plugin-hls-control\types\artplayer-plugin-hls-control.d.ts',
      './assets/ts/packages\artplayer-plugin-iframe\types\artplayer-plugin-iframe.d.ts',
      './assets/ts/packages\artplayer-plugin-jassub\types\artplayer-plugin-jassub.d.ts',
      './assets/ts/packages\artplayer-plugin-multiple-subtitles\types\artplayer-plugin-multiple-subtitles.d.ts',
      './assets/ts/packages\artplayer-plugin-vast\types\artplayer-plugin-vast.d.ts',
      './assets/ts/packages\artplayer-plugin-vtt-thumbnail\types\artplayer-plugin-vtt-thumbnail.d.ts',
      './assets/ts/packages\artplayer-plugin-websr\types\artplayer-plugin-websr.d.ts',
      './assets/ts/packages\artplayer-proxy-canvas\types\artplayer-proxy-canvas.d.ts',
      './assets/ts/packages\artplayer-proxy-mediabunny\types\artplayer-proxy-mediabunny.d.ts',
      './assets/ts/artplayer.d.ts',
    ]

    for (let index = 0; index < libUris.length; index++) {
      let libUri = libUris[index]
      let libSource = await (await fetch(libUri)).text()
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

  function getURLParameters(url) {
    return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce((params, pair) => {
      const index = pair.indexOf('=')
      params[pair.slice(0, index)] = pair.slice(index + 1)
      return params
    }, {})
  }

  function getExt(url) {
    if (url.includes('?')) {
      return getExt(url.split('?')[0])
    }

    if (url.includes('#')) {
      return getExt(url.split('#')[0])
    }

    return url.trim().toLowerCase().split('.').pop()
  }

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const originalDefine = window.define
      window.define = undefined
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = url
      script.onload = () => {
        window.define = originalDefine
        resolve(url)
      }
      script.onerror = () => {
        window.define = originalDefine
        reject(new Error(`Loading script failed: ${url}`))
      }
      document.head.appendChild(script)
    })
  }

  function loadStyle(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = url
      link.onload = () => resolve(url)
      link.onerror = () => reject(new Error(`Loading style failed: ${url}`))
      document.head.appendChild(link)
    })
  }

  function loadLib(libs) {
    const libPromises = []
    const libsDecoded = decodeURIComponent(libs || '')
    const urls = libsDecoded
      .split(/\r?\n/)
      .filter((url) => url.trim() && !loadedLibs.includes(url))
    
    urls.forEach((url) => {
      const ext = getExt(url)
      if (ext === 'js') {
        libPromises.push(loadScript(url))
      } else if (ext === 'css') {
        libPromises.push(loadStyle(url))
      }
    })
    
    $lib.value = libsDecoded
    return Promise.all(libPromises)
  }

  function runExample(name) {
    fetch(`./assets/example/${name}.js`)
      .then((response) => {
        return response.text()
      })
      .then((text) => {
        editor.setValue(text)
        runCode()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  function loadCode(code, example) {
    if (example) {
      runExample(example)
    }
    else if (code) {
      editor.setValue(decodeURIComponent(code).trim())
      runCode()
    }
    else {
      runExample('index')
    }
  }

  function runCode() {
    // Destroy all existing instances
    Artplayer.instances.forEach((art) => art.destroy(true))
    
    const value = editor.getValue()
    eval(value)
    window.art = Artplayer.instances[0]
  }

  function initApp() {
    const urlParams = getURLParameters(window.location.href)
    const { code, libs, example } = urlParams

    loadLib(libs)
      .then((result) => {
        loadedLibs.push(...result)
        loadCode(code, example)
      })
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

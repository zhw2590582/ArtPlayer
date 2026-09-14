import { expect, test } from './fixtures.js'

test('docs Monaco worker consumes generated core and published VAST types and runs a typed player example', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  const result = await page.evaluate(async () => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    await new Promise((resolve, reject) => window.require(['vs/editor/editor.main'], resolve, reject))
    const api = window.monaco
    const types = api.languages.typescript
    types.typescriptDefaults.setCompilerOptions({ target: types.ScriptTarget.ES2020, strict: true, skipLibCheck: false, noEmit: false, types: [], allowNonTsExtensions: true })
    const source = await (await fetch('/assets/ts/artplayer.d.ts')).text()
    const libraryUri = 'file:///artplayer.d.ts'
    const library = types.typescriptDefaults.addExtraLib(source, libraryUri)
    const vastSource = await (await fetch('/assets/ts/artplayer-plugin-vast.d.ts')).text()
    const vastLibraryUri = 'file:///artplayer-plugin-vast.d.ts'
    const vastLibrary = types.typescriptDefaults.addExtraLib(vastSource, vastLibraryUri)
    const model = api.editor.createModel(`
const editorOption: Artplayer.OptionInput = { container: '.player', url: '/test/pattern.mp4', muted: true }
const editorArt: Artplayer = new Artplayer(editorOption)
const editorEvents: Artplayer.Emitter<{ value: [number] }> = new Artplayer.Emitter()
editorEvents.emit('value', 1)
const editorVastCallback: Parameters<typeof artplayerPluginVast>[0] = ({id, $container, imaPlayer}) => {
  const identifier: string = id
  const container: HTMLDivElement = $container
  imaPlayer.addEventListener('AdStarted', () => {})
  void [identifier, container]
}
const editorVastFactory: typeof artplayerPluginVast = (_callback) => (_art) => ({name: 'artplayerPluginVast'})
`, 'typescript', api.Uri.parse('file:///consumer.ts'))
    const invalid = api.editor.createModel('new Artplayer({ container: 123, url: "" })', 'typescript', api.Uri.parse('file:///invalid.ts'))
    const vastInvalid = api.editor.createModel('artplayerPluginVast();\nartplayerPluginVast(({id}) => { const wrong: number = id })', 'typescript', api.Uri.parse('file:///vast-invalid.ts'))
    try {
      const getWorker = await types.getTypeScriptWorker()
      const worker = await getWorker(model.uri, invalid.uri, vastInvalid.uri)
      const syntax = await worker.getSyntacticDiagnostics(model.uri.toString())
      const semantic = await worker.getSemanticDiagnostics(model.uri.toString())
      const declaration = await worker.getSemanticDiagnostics(libraryUri)
      const vastDeclaration = await worker.getSemanticDiagnostics(vastLibraryUri)
      const vastBad = (await worker.getSemanticDiagnostics(vastInvalid.uri.toString())).map(item => item.code)
      const bad = await worker.getSemanticDiagnostics(invalid.uri.toString())
      const output = await worker.getEmitOutput(model.uri.toString())
      if (syntax.length || semantic.length || declaration.length)
        return { syntax, semantic, declaration, vastDeclaration, vastBad, vastSource, invalid: bad.map(item => item.code), ready: false }
      const script = output.outputFiles.find(file => file.name.endsWith('.js'))
      if (!script)
        throw new Error('Monaco did not emit the typed example')
      // eslint-disable-next-line no-new-func -- Execute the locally compiled editor fixture, as the demo's Run action does.
      const art = new Function(`${script.text}\nreturn editorArt`)()
      try {
        if (!art.isReady)
          await new Promise(resolve => art.on('ready', resolve))
        return { syntax, semantic, declaration, vastDeclaration, vastBad, vastSource, invalid: bad.map(item => item.code), ready: art.isReady && art.video.videoWidth > 0 }
      }
      finally {
        art.destroy()
      }
    }
    finally {
      model.dispose()
      invalid.dispose()
      vastInvalid.dispose()
      library.dispose()
      vastLibrary.dispose()
    }
  })
  expect(result.syntax).toEqual([])
  expect(result.semantic).toEqual([])
  expect(result.declaration).toEqual([])
  expect(result.vastDeclaration).toEqual([])
  expect(result.vastBad).toEqual([2554, 2322])
  await testInfo.attach('vast-editor-declaration', { contentType: 'text/plain', body: result.vastSource })
  expect(result.invalid.length).toBeGreaterThan(0)
  expect(result.ready).toBe(true)
})

import { expect, test } from './fixtures.js'

test('docs Monaco worker consumes generated core types and runs a typed player example', async ({ page }) => {
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
    const model = api.editor.createModel(`
const editorOption: Artplayer.OptionInput = { container: '.player', url: '/test/pattern.mp4', muted: true }
const editorArt: Artplayer = new Artplayer(editorOption)
const editorEvents: Artplayer.Emitter<{ value: [number] }> = new Artplayer.Emitter()
editorEvents.emit('value', 1)
`, 'typescript', api.Uri.parse('file:///consumer.ts'))
    const invalid = api.editor.createModel('new Artplayer({ container: 123, url: "" })', 'typescript', api.Uri.parse('file:///invalid.ts'))
    try {
      const getWorker = await types.getTypeScriptWorker()
      const worker = await getWorker(model.uri, invalid.uri)
      const syntax = await worker.getSyntacticDiagnostics(model.uri.toString())
      const semantic = await worker.getSemanticDiagnostics(model.uri.toString())
      const declaration = await worker.getSemanticDiagnostics(libraryUri)
      const bad = await worker.getSemanticDiagnostics(invalid.uri.toString())
      const output = await worker.getEmitOutput(model.uri.toString())
      if (syntax.length || semantic.length || declaration.length)
        return { syntax, semantic, declaration, invalid: bad.map(item => item.code), ready: false }
      const script = output.outputFiles.find(file => file.name.endsWith('.js'))
      if (!script)
        throw new Error('Monaco did not emit the typed example')
      // eslint-disable-next-line no-new-func -- Execute the locally compiled editor fixture, as the demo's Run action does.
      const art = new Function(`${script.text}\nreturn editorArt`)()
      try {
        if (!art.isReady)
          await new Promise(resolve => art.on('ready', resolve))
        return { syntax, semantic, declaration, invalid: bad.map(item => item.code), ready: art.isReady && art.video.videoWidth > 0 }
      }
      finally {
        art.destroy()
      }
    }
    finally {
      model.dispose()
      invalid.dispose()
      library.dispose()
    }
  })
  expect(result.syntax).toEqual([])
  expect(result.semantic).toEqual([])
  expect(result.declaration).toEqual([])
  expect(result.invalid.length).toBeGreaterThan(0)
  expect(result.ready).toBe(true)
})

import { expect, test } from './fixtures.js'

test('docs Monaco CSS, HTML and JSON workers validate, complete and format real models', async ({ page }, testInfo) => {
  const startedWorkers = []
  page.on('worker', worker => startedWorkers.push(worker.url()))
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  const result = await page.evaluate(async () => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    await new Promise((resolve, reject) => window.require(['vs/editor/editor.main'], resolve, reject))
    const api = window.monaco
    const models = []
    const workers = []
    const model = (text, language, name) => {
      const value = api.editor.createModel(text, language, api.Uri.parse(`file:///${name}`))
      models.push(value)
      return value
    }
    const connect = async (language, createData, resources) => {
      // Monaco 0.30.1 exposes getTypeScriptWorker but no CSS/HTML/JSON accessor.
      // Use the same public worker constructor and createData as its mode managers.
      const worker = api.editor.createWebWorker({ moduleId: `vs/language/${language}/${language}Worker`, label: language, createData })
      workers.push(worker)
      await worker.withSyncedResources(resources.map(model => model.uri))
      return worker.getProxy()
    }
    try {
      const css = model('a { color: red; }', 'css', 'valid.css')
      const badCss = model('a { color: ; }', 'css', 'invalid.css')
      const json = model('{"value":1}', 'json', 'valid.json')
      const badJson = model('{"value":}', 'json', 'invalid.json')
      const html = model('<div><p>hello</p><p>world</p></div>', 'html', 'valid.html')
      const htmlCompletion = model('<di', 'html', 'completion.html')
      const cssWorker = await connect('css', { languageId: 'css', options: api.languages.css.cssDefaults.options }, [css, badCss])
      const jsonWorker = await connect('json', { languageId: 'json', languageSettings: api.languages.json.jsonDefaults.diagnosticsOptions, enableSchemaRequest: false }, [json, badJson])
      const htmlWorker = await connect('html', { languageId: 'html', languageSettings: api.languages.html.htmlDefaults.options }, [html, htmlCompletion])
      const completion = await htmlWorker.doComplete(htmlCompletion.uri.toString(), { line: 0, character: 3 })
      const symbols = await htmlWorker.findDocumentSymbols(html.uri.toString())
      const edits = await htmlWorker.format(html.uri.toString(), null, { tabSize: 2, insertSpaces: true, wrapLineLength: 120 })
      const jsonEdits = await jsonWorker.format(json.uri.toString(), null, { tabSize: 2, insertSpaces: true })
      return {
        cssValid: await cssWorker.doValidation(css.uri.toString()),
        cssInvalid: await cssWorker.doValidation(badCss.uri.toString()),
        jsonValid: await jsonWorker.doValidation(json.uri.toString()),
        jsonInvalid: await jsonWorker.doValidation(badJson.uri.toString()),
        completionLabels: completion.items.map(item => item.label),
        htmlSymbols: symbols.map(item => item.name),
        htmlEdits: edits,
        jsonEdits,
      }
    }
    finally {
      workers.forEach(worker => worker.dispose())
      models.forEach(model => model.dispose())
    }
  })
  await testInfo.attach('monaco-language-results', { contentType: 'application/json', body: JSON.stringify({ ...result, startedWorkers }, null, 2) })
  expect(startedWorkers.length).toBeGreaterThanOrEqual(3)
  expect(result.cssValid).toEqual([])
  expect(result.cssInvalid.some(item => item.severity === 1 && item.message)).toBe(true)
  expect(result.jsonValid).toEqual([])
  expect(result.jsonInvalid.some(item => item.severity === 1 && item.message)).toBe(true)
  expect(result.completionLabels).toContain('div')
  expect(result.htmlSymbols).toEqual(['div', 'p', 'p'])
  expect(result.htmlEdits.some(item => item.newText.includes('\n') && item.newText.includes('hello'))).toBe(true)
  expect(result.jsonEdits.some(item => item.newText.includes('\n'))).toBe(true)
})

import { expect, test } from './fixtures.js'

test('docs Monaco mode registrations update editor diagnostics and formatting across languages', async ({ page }, testInfo) => {
  const loadedModes = []
  page.on('response', (response) => {
    if (/\/language\/(?:css|html|json|typescript)\/\w+Mode\.js$/.test(response.url()))
      loadedModes.push({ url: response.url(), status: response.status() })
  })
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  await page.evaluate(async () => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    await new Promise((resolve, reject) => window.require(['vs/editor/editor.main'], resolve, reject))
    const host = document.createElement('div')
    host.style.cssText = 'width:800px;height:400px'
    document.body.appendChild(host)
    const editor = window.monaco.editor.create(host, { model: null, minimap: { enabled: false } })
    window.modeProbe = { editor, host, models: [] }
  })
  const evidence = []
  try {
    for (const phase of [
      { language: 'css', invalid: 'a { color: ; }', valid: 'a { color: red; }' },
      { language: 'json', invalid: '{"value":}', valid: '{"value":1}' },
      { language: 'typescript', invalid: 'const value: number = "wrong";', valid: 'const value: number = 1;' },
    ]) {
      await page.evaluate((phase) => {
        const api = window.monaco
        const model = api.editor.createModel(phase.invalid, phase.language, api.Uri.parse(`file:///mode-probe-${phase.language}`))
        model.updateOptions({ tabSize: 2, insertSpaces: true })
        window.modeProbe.models.push(model)
        window.modeProbe.editor.setModel(model)
      }, phase)
      await expect.poll(() => page.evaluate(() => window.monaco.editor.getModelMarkers({ resource: window.modeProbe.editor.getModel().uri }).filter(marker => marker.severity === window.monaco.MarkerSeverity.Error).length)).toBeGreaterThan(0)
      evidence.push(await page.evaluate(() => ({ language: window.modeProbe.editor.getModel().getLanguageId(), markers: window.monaco.editor.getModelMarkers({ resource: window.modeProbe.editor.getModel().uri }) })))
      await page.evaluate(value => window.modeProbe.editor.getModel().setValue(value), phase.valid)
      await expect.poll(() => page.evaluate(() => window.monaco.editor.getModelMarkers({ resource: window.modeProbe.editor.getModel().uri }).length)).toBe(0)
      if (phase.language === 'json') {
        await expect.poll(() => page.evaluate(() => window.modeProbe.editor.getAction('editor.action.formatDocument').isSupported())).toBe(true)
        await page.evaluate(() => window.modeProbe.editor.getAction('editor.action.formatDocument').run())
        const formatted = await page.evaluate(() => window.modeProbe.editor.getValue())
        expect(formatted).toContain('\n')
        expect(JSON.parse(formatted)).toEqual({ value: 1 })
        evidence.push({ language: 'json', formatted })
      }
    }
    await page.evaluate(() => {
      const api = window.monaco
      const model = api.editor.createModel('<div><p>hello</p><p>world</p></div>', 'html', api.Uri.parse('file:///mode-probe-html'))
      model.updateOptions({ tabSize: 2, insertSpaces: true })
      window.modeProbe.models.push(model)
      window.modeProbe.editor.setModel(model)
    })
    await expect.poll(() => page.evaluate(() => window.modeProbe.editor.getAction('editor.action.formatDocument').isSupported())).toBe(true)
    await page.evaluate(() => window.modeProbe.editor.getAction('editor.action.formatDocument').run())
    const formatted = await page.evaluate(() => window.modeProbe.editor.getValue())
    expect(formatted).toContain('\n')
    expect(formatted.replace(/\s+/g, '')).toBe('<div><p>hello</p><p>world</p></div>')
    evidence.push({ language: 'html', formatted })
    expect(loadedModes.map(item => item.url.split('/').pop()).sort()).toEqual(['cssMode.js', 'htmlMode.js', 'jsonMode.js', 'tsMode.js'])
    expect(loadedModes.every(item => item.status === 200)).toBe(true)
    await testInfo.attach('monaco-mode-results', { contentType: 'application/json', body: JSON.stringify({ evidence, loadedModes }, null, 2) })
  }
  finally {
    await page.evaluate(() => {
      window.modeProbe.editor.dispose()
      window.modeProbe.models.forEach(model => model.dispose())
      window.modeProbe.host.remove()
    })
  }
  await expect.poll(() => page.evaluate(() => window.modeProbe.models.flatMap(model => window.monaco.editor.getModelMarkers({ resource: model.uri })).length)).toBe(0)
})

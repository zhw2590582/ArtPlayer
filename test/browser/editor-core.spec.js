import fs from 'node:fs'
import { expect, test } from './fixtures.js'

const locales = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/monaco-core-locales.json', import.meta.url)))

test('docs Monaco core diff worker computes changes and updates after edits', async ({ page }, testInfo) => {
  const workers = []
  page.on('worker', worker => workers.push(worker.url()))
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  await page.evaluate(async () => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    await new Promise((resolve, reject) => window.require(['vs/editor/editor.main'], resolve, reject))
    const host = document.createElement('div')
    host.style.cssText = 'width:800px;height:400px'
    document.body.appendChild(host)
    const api = window.monaco.editor
    const original = api.createModel('first\nsecond\nthird', 'plaintext')
    const modified = api.createModel('first\nchanged\nthird', 'plaintext')
    const editor = api.createDiffEditor(host)
    editor.setModel({ original, modified })
    window.diffProbe = { host, editor, original, modified }
  })
  try {
    await expect.poll(() => page.evaluate(() => window.diffProbe.editor.getLineChanges()?.map(change => [change.originalStartLineNumber, change.originalEndLineNumber, change.modifiedStartLineNumber, change.modifiedEndLineNumber]))).toEqual([[2, 2, 2, 2]])
    expect(workers.length).toBeGreaterThan(0)
    await page.evaluate(() => window.diffProbe.modified.setValue(window.diffProbe.original.getValue()))
    await expect.poll(() => page.evaluate(() => window.diffProbe.editor.getLineChanges())).toEqual([])
    await testInfo.attach('monaco-core-worker', { contentType: 'application/json', body: JSON.stringify({ workers, initialChangedLines: [2, 2, 2, 2], finalChanges: [] }) })
  }
  finally {
    await page.evaluate(() => {
      const { host, editor, original, modified } = window.diffProbe
      editor.dispose()
      original.dispose()
      modified.dispose()
      host.remove()
    })
  }
  expect(await page.evaluate(() => window.monaco.editor.getModels().length)).toBe(0)
})

for (const locale of locales) {
  test(`docs Monaco core editing and localized find: ${locale.locale}`, async ({ page }, testInfo) => {
    const responses = []
    page.on('response', (response) => {
      if (/editor\.main\.nls/.test(response.url()))
        responses.push({ url: response.url(), status: response.status() })
    })
    await page.goto('/test/player.html?core=candidate&chapter=published')
    await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
    const modifier = await page.evaluate(async (locale) => {
      window.require.config({ 'paths': { vs: '/assets/js/vs' }, 'vs/nls': { availableLanguages: locale === 'en' ? {} : { '*': locale } } })
      const load = ids => new Promise((resolve, reject) => window.require(ids, (...modules) => resolve(modules), reject))
      await load(['vs/editor/editor.main'])
      const [platform] = await load(['vs/base/common/platform'])
      const host = document.createElement('div')
      host.style.cssText = 'width:800px;height:400px'
      document.body.appendChild(host)
      const editor = window.monaco.editor.create(host, { value: 'first\nsecond\nfirst', language: 'plaintext', minimap: { enabled: false } })
      editor.setPosition({ lineNumber: 1, column: 6 })
      editor.focus()
      window.coreProbe = { editor, host }
      return platform.isMacintosh ? 'Meta' : 'Control'
    }, locale.locale)
    try {
      await page.keyboard.insertText(' beta')
      await expect.poll(() => page.evaluate(() => window.coreProbe.editor.getValue())).toBe('first beta\nsecond\nfirst')
      await page.keyboard.press(`${modifier}+z`)
      await expect.poll(() => page.evaluate(() => window.coreProbe.editor.getValue())).toBe('first\nsecond\nfirst')
      await page.keyboard.press(modifier === 'Meta' ? 'Meta+Shift+z' : 'Control+y')
      await expect.poll(() => page.evaluate(() => window.coreProbe.editor.getValue())).toBe('first beta\nsecond\nfirst')
      await page.evaluate(() => {
        window.coreProbe.editor.setPosition({ lineNumber: 1, column: 1 })
        return window.coreProbe.editor.getAction('actions.find').run()
      })
      const input = page.getByRole('textbox', { name: locale.find, exact: true })
      await expect(input).toBeVisible()
      await expect(input).toHaveAttribute('aria-label', locale.find)
      await input.fill('st')
      await expect.poll(() => page.evaluate(() => {
        const selection = window.coreProbe.editor.getSelection()
        return [selection.startLineNumber, selection.startColumn, selection.endColumn]
      })).toEqual([1, 4, 6])
      await input.press('Enter')
      await expect.poll(() => page.evaluate(() => window.coreProbe.editor.getSelection().startLineNumber)).toBe(3)
      await input.press('Escape')
      await expect(input).not.toBeVisible()
      expect(responses).toHaveLength(1)
      expect(responses[0].status).toBe(200)
      expect(responses[0].url).toContain(`editor.main.nls${locale.locale === 'en' ? '' : `.${locale.locale}`}.js`)
      await testInfo.attach('monaco-core-editing', { contentType: 'application/json', body: JSON.stringify({ locale, modifier, responses }) })
    }
    finally {
      await page.evaluate(() => {
        const { editor, host } = window.coreProbe
        const model = editor.getModel()
        editor.dispose()
        model.dispose()
        host.remove()
      })
    }
    expect(await page.evaluate(() => window.monaco.editor.getModels().length)).toBe(0)
  })
}

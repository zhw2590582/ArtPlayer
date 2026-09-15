import { expect, test } from './fixtures.js'

test('docs Monaco retains historical RTL, emoji and grapheme data during model edits', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  const observed = await page.evaluate(async () => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    const load = ids => new Promise((resolve, reject) => window.require(ids, (...modules) => resolve(modules), reject))
    await load(['vs/editor/editor.main'])
    const [strings] = await load(['vs/base/common/strings'])
    const text = 'Hello שלום مرحبا 😀 e\u0301 👩\u200D💻'
    const host = document.createElement('div')
    host.style.cssText = 'height:200px;width:600px'
    document.body.append(host)
    const editor = window.monaco.editor.create(host, { value: text, language: 'plaintext', minimap: { enabled: false } })
    try {
      const model = editor.getModel()
      const initial = model.getValue()
      model.pushEditOperations([], [{ range: new window.monaco.Range(1, 1, 1, 1), text: '前缀 ' }], () => null)
      const edited = model.getValue()
      model.undo()
      return {
        initial,
        edited,
        restored: model.getValue(),
        rtl: ['ascii', 'שלום', 'مرحبا', '😀'].map(value => strings.containsRTL(value)),
        emoji: ['ascii', '😀', '🌍', '🫠'].map(value => strings.containsEmoji(value)),
        imprecise: [0x41, 0x1F600, 0x1FAE0].map(value => strings.isEmojiImprecise(value)),
        grapheme: [0x41, 0x0D, 0x0A, 0x0301, 0x200D, 0x1F1E6, 0x1F469].map(value => strings.getGraphemeBreakType(value)),
        breaks: [[0x0D, 0x0A], [0x41, 0x0301], [0x41, 0x42], [0x200D, 0x1F469]].map(([a, b]) => strings.breakBetweenGraphemeBreakType(strings.getGraphemeBreakType(a), strings.getGraphemeBreakType(b))),
      }
    }
    finally {
      const model = editor.getModel()
      editor.dispose()
      model.dispose()
      host.remove()
    }
  })
  expect(observed.initial).toBe('Hello שלום مرحبا 😀 e\u0301 👩\u200D💻')
  expect(observed.edited).toBe(`前缀 ${observed.initial}`)
  expect(observed.restored).toBe(observed.initial)
  expect(observed.rtl).toEqual([false, true, true, false])
  // Keep the historical approximate predicate; this is not a current Unicode conformance test.
  expect(observed.emoji).toEqual([false, true, true, false])
  expect(observed.imprecise).toEqual([false, true, false])
  expect(observed.grapheme).toEqual([0, 2, 3, 5, 13, 6, 14])
  expect(observed.breaks).toEqual([false, false, true, false])
  await testInfo.attach('monaco-unicode-observations', { contentType: 'application/json', body: JSON.stringify(observed) })
})

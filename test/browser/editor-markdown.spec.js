import { expect, test } from './fixtures.js'

test('docs Monaco renders Markdown with its bundled parser and sanitizer', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  const result = await page.evaluate(async () => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    const load = ids => new Promise((resolve, reject) => window.require(ids, (...modules) => resolve(modules), reject))
    await load(['vs/editor/editor.main'])
    const [renderer, purify] = await load(['vs/base/browser/markdownRenderer', 'vs/base/browser/dompurify/dompurify'])
    const rendered = renderer.renderMarkdown({
      value: '**Player** and `art.play()`\n\n| API | Result |\n| --- | --- |\n| play | Promise |\n\n[Docs](https://artplayer.org/document/)\n\n<span onclick="window.markdownExecuted=true">safe text</span><script>window.markdownExecuted=true</script>',
      supportHtml: true,
      isTrusted: false,
    })
    document.body.appendChild(rendered.element)
    const element = rendered.element
    const output = {
      version: purify.version,
      strong: element.querySelector('strong')?.textContent,
      code: element.querySelector('code')?.textContent,
      cells: [...element.querySelectorAll('td')].map(cell => cell.textContent),
      link: element.querySelector('a')?.getAttribute('data-href'),
      text: element.textContent,
      scripts: element.querySelectorAll('script').length,
      handlers: element.querySelectorAll('[onclick]').length,
      executed: window.markdownExecuted === true,
    }
    rendered.dispose()
    element.remove()
    // Renderer hooks must not leak into a later consumer of the same singleton.
    output.afterDispose = purify.sanitize('<div style="color:red">next</div>')
    return output
  })
  await testInfo.attach('monaco-markdown-result', { contentType: 'application/json', body: JSON.stringify(result, null, 2) })
  expect(result.version).toBe('2.3.1')
  expect(result.strong).toBe('Player')
  expect(result.code).toBe('art.play()')
  expect(result.cells).toEqual(['play', 'Promise'])
  expect(result.link).toBe('https://artplayer.org/document/')
  expect(result.text).toContain('safe text')
  expect(result.scripts).toBe(0)
  expect(result.handlers).toBe(0)
  expect(result.executed).toBe(false)
  expect(result.afterDispose).toBe('<div style="color:red">next</div>')
})

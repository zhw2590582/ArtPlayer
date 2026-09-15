import { expect, test } from './fixtures.js'

test('docs Monaco styles retain layout, themes and loaded codicon glyphs', async ({ page }, testInfo) => {
  const assets = []
  page.on('response', (response) => {
    if (/\/(?:editor\.main\.css|codicon\.ttf)$/.test(response.url()))
      assets.push({ url: response.url(), status: response.status() })
  })
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  await page.evaluate(async () => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    await new Promise((resolve, reject) => window.require(['vs/editor/editor.main'], resolve, reject))
    const host = document.createElement('div')
    host.style.cssText = 'width:640px;height:320px'
    document.body.appendChild(host)
    const editor = window.monaco.editor.create(host, { value: 'first\nsecond\nfirst', language: 'plaintext', theme: 'vs-dark', minimap: { enabled: false } })
    window.styleProbe = { host, editor, model: editor.getModel() }
  })
  const editor = page.locator('.monaco-editor').first()
  const evidence = []
  try {
    await expect(editor).toBeVisible()
    await expect(editor).toHaveCSS('position', 'relative')
    // The pinned colorRegistry deliberately uses #fffffe for the light theme.
    for (const [theme, color] of [['vs-dark', 'rgb(30, 30, 30)'], ['vs', 'rgb(255, 255, 254)']]) {
      await page.evaluate(theme => window.monaco.editor.setTheme(theme), theme)
      await expect(editor).toHaveCSS('background-color', color)
      evidence.push({ theme, color })
    }
    await page.evaluate(() => window.styleProbe.editor.getAction('actions.find').run())
    const find = page.locator('.find-widget')
    await expect(find).toBeVisible()
    const font = await page.evaluate(async () => {
      const loaded = await document.fonts.load('16px codicon')
      const icon = window.styleProbe.host.querySelector('.find-widget .codicon')
      const style = getComputedStyle(icon, '::before')
      return { loaded: loaded.map(font => ({ family: font.family, status: font.status })), family: style.fontFamily, content: style.content }
    })
    expect(font.loaded.length).toBeGreaterThan(0)
    expect(font.loaded.every(item => item.status === 'loaded')).toBe(true)
    expect(font.family).toContain('codicon')
    expect(['none', 'normal', '""']).not.toContain(font.content)
    const hostBox = await editor.boundingBox()
    const findBox = await find.boundingBox()
    expect(findBox.x).toBeGreaterThanOrEqual(hostBox.x)
    expect(findBox.x + findBox.width).toBeLessThanOrEqual(hostBox.x + hostBox.width + 1)
    await page.evaluate(() => {
      window.styleProbe.host.style.cssText = 'width:420px;height:240px'
      window.styleProbe.editor.layout()
    })
    await expect(editor).toHaveCSS('width', '420px')
    await expect(editor).toHaveCSS('height', '240px')
    expect(assets.filter(asset => asset.url.endsWith('/editor.main.css'))).toHaveLength(1)
    expect(assets.some(asset => asset.url.endsWith('/codicon.ttf'))).toBe(true)
    expect(assets.every(asset => asset.status === 200)).toBe(true)
    await testInfo.attach('monaco-style-results', { contentType: 'application/json', body: JSON.stringify({ themes: evidence, font, hostBox, findBox, assets, resized: { width: 420, height: 240 } }) })
  }
  finally {
    await page.evaluate(() => {
      const { host, editor, model } = window.styleProbe
      editor.dispose()
      model.dispose()
      host.remove()
    })
  }
  expect(await page.evaluate(() => window.monaco.editor.getModels().length)).toBe(0)
})

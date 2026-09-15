import { expect, test } from './fixtures.js'

for (const language of ['zh', 'en']) {
  test(`built documentation loads ${language} deep pages and opens Run Code with encoded source`, async ({
    page,
    context,
  }) => {
    await page.route('https://**/*', route =>
      route.fulfill({ status: 200, body: '' }))
    await context.route('http://127.0.0.1:8082/**', route =>
      route.fulfill({
        contentType: 'text/html',
        body: '<title>Run Code destination</title>',
      }))
    await page.addInitScript(() => localStorage.setItem('lang-init', 'true'))
    const failedAssets = []
    page.on('response', (response) => {
      if (response.url().includes('/document/') && response.status() >= 400)
        failedAssets.push(response.url())
    })
    const prefix = language === 'en' ? '/document/en' : '/document'
    await page.goto(`${prefix}/start/option.html`, {
      waitUntil: 'networkidle',
    })
    await expect(page.locator('h1')).toContainText(
      language === 'en' ? 'Basic Options' : '基础选项',
    )
    const button = page.locator('.run-code, [classname="run-code"]').first()
    await expect(button).toBeVisible()
    const popupPromise = context.waitForEvent('page')
    await button.click()
    const popup = await popupPromise
    await popup.waitForLoadState('domcontentloaded')
    const target = new URL(popup.url())
    expect(target.hostname).toBe('127.0.0.1')
    expect(target.port).toBe('8082')
    expect(target.searchParams.get('code')).toContain('new Artplayer')
    await popup.close()
    await page.goto(`${prefix}/advanced/event.html`, {
      waitUntil: 'networkidle',
    })
    await expect(page.locator('h1')).toContainText(
      language === 'en' ? 'Instance Events' : '实例事件',
    )
    expect(failedAssets).toEqual([])
    await page.goto(`${prefix}/`, { waitUntil: 'networkidle' })
    const group = page.locator('.vp-code-group').first()
    await group.locator('.tabs label').nth(1).click()
    await expect(group.locator('input[type="radio"]').nth(1)).toBeChecked()
    await expect(group.locator('.blocks > div').nth(1)).toBeVisible()
    await expect(group.locator('.blocks > div').first()).toBeHidden()
    const danmukuLink = page.locator(`.VPSidebar a[href="${prefix}/plugin/danmuku.html"]`)
    await danmukuLink.click()
    await expect(page.locator('h1')).toContainText(language === 'en' ? 'Danmuku' : '弹幕库')
    const examplePopup = context.waitForEvent('page')
    await page.locator('.run-code, [classname="run-code"]').first().click()
    const example = await examplePopup
    await example.waitForLoadState('domcontentloaded')
    const exampleUrl = new URL(example.url())
    expect(exampleUrl.searchParams.get('libs')).toBe('./uncompiled/artplayer-plugin-danmuku/index.js')
    expect(exampleUrl.searchParams.get('code')).toContain('artplayerPluginDanmuku({')
    expect(failedAssets).toEqual([])
    await example.close()
    await page.locator(`.VPSidebar a[href="${prefix}/plugin/hls-control.html"]`).click()
    await expect(page.locator('h1')).toContainText(language === 'en' ? 'HLS Control' : 'HLS 控制')
    const hlsPopup = context.waitForEvent('page')
    await page.locator('.run-code, [classname="run-code"]').first().click()
    const hlsExample = await hlsPopup
    await hlsExample.waitForLoadState('domcontentloaded')
    const hlsTarget = new URL(hlsExample.url())
    expect(hlsTarget.searchParams.get('libs').split('\n')).toEqual([
      'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js',
      './uncompiled/artplayer-plugin-hls-control/index.js',
    ])
    expect(hlsTarget.searchParams.get('code')).toContain('art.on(\'destroy\', destroyHls)')
    expect(failedAssets).toEqual([])
    await hlsExample.close()
    await page.locator(`.VPSidebar a[href="${prefix}/plugin/dash-control.html"]`).click()
    await expect(page.locator('h1')).toContainText(language === 'en' ? 'DASH Control' : 'DASH 控制')
    const dashPopup = context.waitForEvent('page')
    await page.locator('.run-code, [classname="run-code"]').first().click()
    const dashExample = await dashPopup
    await dashExample.waitForLoadState('domcontentloaded')
    const dashTarget = new URL(dashExample.url())
    expect(dashTarget.searchParams.get('libs').split('\n')).toEqual([
      'https://cdnjs.cloudflare.com/ajax/libs/dashjs/5.2.1/modern/umd/dash.all.min.js',
      './uncompiled/artplayer-plugin-dash-control/index.js',
    ])
    expect(dashTarget.searchParams.get('code')).toContain('art.on(\'destroy\', destroyDash)')
    expect(failedAssets).toEqual([])
    await dashExample.close()
  })
}

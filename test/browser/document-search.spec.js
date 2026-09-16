import { expect, test } from './fixtures.js'

for (const language of ['zh', 'en']) {
  test(`documentation search supports mouse and keyboard without reloading (${language})`, async ({ page }) => {
    await page.route('https://**/*', route => route.fulfill({ status: 200, body: '' }))
    await page.addInitScript(() => localStorage.setItem('lang-init', 'true'))
    const prefix = language === 'en' ? '/document/en' : '/document'
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`${prefix}/start/option.html`, { waitUntil: 'domcontentloaded' })
    const button = page.locator('#docsearch button')
    const input = page.locator('#docsearch-input')
    const modal = page.locator('.VPPluginSearch-modal-back')
    const links = page.locator('.search-group a')
    await button.click()
    await expect(input).toBeFocused()
    await input.fill('switchQuality')
    await expect(links.first()).toBeVisible()
    // Select the exact language URL; the shared search includes both languages.
    const ownLink = page.locator(`.search-group a[href$="${prefix}/advanced/property.html#switchquality"]`)
    await expect(ownLink).toHaveCount(1)
    await ownLink.click()
    await expect(page).toHaveURL(new RegExp(`${prefix}/advanced/property.html#switchquality$`))
    await expect(page.locator('#switchquality')).toBeVisible()
    await expect(modal).toBeHidden()

    await button.click()
    await input.fill('switchQuality')
    await expect(links.first()).toBeVisible()
    await input.press('ArrowDown')
    const target = await page.locator('.search-group a.link-focused').getAttribute('href')
    await page.evaluate(() => {
      window.__searchDocumentIdentity = 'retained'
    })
    await input.press('Enter')
    await expect(page).toHaveURL(target)
    await expect(modal).toBeHidden()
    expect(await page.evaluate(() => window.__searchDocumentIdentity)).toBe('retained')
    expect(await page.evaluate(() => Boolean(document.getElementById(decodeURIComponent(location.hash.slice(1)))))).toBe(true)

    await button.click()
    await input.fill('生命周期')
    await expect(links.first()).toBeVisible()
    await input.press('Escape')
    await expect(modal).toBeHidden()
    await expect(button).toBeFocused()
    await page.keyboard.press('Control+k')
    await expect(input).toBeFocused()
    await input.fill('switchQuality')
    await expect(links.first()).toHaveClass(/link-focused/)
    await input.press('ArrowUp')
    await expect(links.last()).toHaveClass(/link-focused/)
    await input.fill('definitely-no-artplayer-search-result-958')
    await expect(links).toHaveCount(0)
    const current = page.url()
    await input.press('Enter')
    await input.press('Escape')
    await expect(modal).toBeHidden()
    expect(page.url()).toBe(current)
    expect(await page.evaluate(() => window.__searchDocumentIdentity)).toBe('retained')
    expect(errors).toEqual([])
  })
}

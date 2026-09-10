import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: native setting keyboard and pointer actions retain range and switch callbacks`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => {
      window.actions = []
      const range = { name: 'range', html: 'Range', tooltip: 'Initial', range: [5, 0, 10, 1] }
      const toggle = { name: 'toggle', html: 'Switch', switch: false }
      const record = function (type, item, element, event) {
        window.actions.push({ type, value: item.range?.[0] ?? item.switch, receiver: this === window.art, element: element === item.$item, trusted: event.isTrusted })
      }
      range.onChange = function (item, element, event) {
        record.call(this, 'input', item, element, event)
        return `input:${item.range[0]}`
      }
      range.onRange = function (item, element, event) {
        record.call(this, 'change', item, element, event)
        return `change:${item.range[0]}`
      }
      toggle.onSwitch = function (item, element, event) {
        record.call(this, 'switch', item, element, event)
        return !item.switch
      }
      window.art = new window.Artplayer({ container: '.player', url: '', setting: true, settings: [range, toggle] })
      window.art.setting.show = true
    })
    const range = page.locator('[data-name="range"] input')
    await range.focus()
    for (let index = 0; index < 3; index++)
      await range.press('ArrowRight')
    await page.locator('[data-name="toggle"]').click()
    await expect.poll(() => page.evaluate(() => ({ range: window.art.setting.find('range').range[0], tooltip: window.art.setting.find('range').tooltip, switch: window.art.setting.find('toggle').switch }))).toEqual({ range: 8, tooltip: 'change:8', switch: true })
    expect(await page.evaluate(() => window.actions)).toEqual([
      ...[6, 7, 8].flatMap(value => ['input', 'change'].map(type => ({ type, value, receiver: true, element: true, trusted: true }))),
      { type: 'switch', value: false, receiver: true, element: true, trusted: true },
    ])
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: long setting labels leave native controls inside the row`, async ({ page }, testInfo) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => {
      const container = document.querySelector('.player')
      container.style.width = '320px'
      container.style.height = '240px'
      window.longLabel = 'Long setting label '.repeat(20)
      window.longTooltip = 'Detailed value '.repeat(20)
      window.art = new window.Artplayer({ container, url: '', setting: true, settings: [
        { name: 'range', html: window.longLabel, tooltip: window.longTooltip, range: [5, 0, 10, 1], onRange() {
          return window.longTooltip
        } },
        { name: 'switch', html: window.longLabel, tooltip: window.longTooltip, switch: false, onSwitch(item) {
          return !item.switch
        } },
      ] })
      window.art.setting.show = true
      window.art.setting.render()
    })
    await expect(page.locator('.art-settings')).toBeVisible()
    const result = await page.evaluate(() => ['range', 'switch'].map((name) => {
      const item = window.art.setting.find(name)
      const row = item.$item.getBoundingClientRect()
      const control = (item.$range || item.$switch).getBoundingClientRect()
      return { name, inside: control.left >= row.left && control.right <= row.right && control.top >= row.top && control.bottom <= row.bottom, fullLabel: item.$html.textContent === window.longLabel, fullTooltip: item.$tooltip.textContent === window.longTooltip }
    }))
    await testInfo.attach('setting-long-labels', { contentType: 'image/png', body: await page.locator('.player').screenshot() })
    expect(result).toEqual(['range', 'switch'].map(name => ({ name, inside: core === 'candidate', fullLabel: true, fullTooltip: true })))
    if (core === 'candidate') {
      await page.locator('[data-name="range"] input').focus()
      await page.locator('[data-name="range"] input').press('ArrowRight')
      await page.locator('[data-name="switch"]').click()
      await expect.poll(() => page.evaluate(() => [window.art.setting.find('range').range[0], window.art.setting.find('switch').switch])).toEqual([6, true])
    }
    await page.evaluate(() => window.art.destroy())
  })
}

test.describe('mobile UA and real touch events (not physical-device validation)', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36' })
  for (const rotate of [false, true]) {
    test(`candidate: nested settings remain selectable with autoOrientation=${rotate}`, async ({ page }, testInfo) => {
      await page.goto('/test/player.html?core=candidate&chapter=published')
      await page.evaluate(() => {
        const container = document.querySelector('.player')
        container.style.width = '320px'
        container.style.height = '240px'
        window.selected = null
        const choices = Array.from({ length: 12 }, (_, index) => ({ name: `choice-${index}`, html: `Choice ${index}`, value: index }))
        window.Artplayer.AUTO_ORIENTATION_TIME = 0
        window.art = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true, setting: true, autoOrientation: true, fullscreenWeb: true, settings: [{ name: 'group', html: 'Choices', width: 420, selector: choices, onSelect(item, element, event) {
          window.selected = { value: item.value, receiver: this === window.art, element: element === item.$item, trusted: event.isTrusted }
          return item.html
        } }] })
      })
      await expect.poll(() => page.evaluate(() => window.art.video.videoWidth)).toBeGreaterThan(0)
      if (rotate) {
        await page.evaluate(() => {
          window.art.fullscreenWeb = true
        })
        await expect.poll(() => page.evaluate(() => window.art.isRotate)).toBe(true)
      }
      await page.evaluate(() => {
        window.art.setting.show = true
      })
      await page.locator('[data-name="group"]').tap()
      const last = page.locator('[data-name="choice-11"]')
      await last.scrollIntoViewIfNeeded()
      await last.tap()
      await expect.poll(() => page.evaluate(() => window.selected)).toEqual({ value: 11, receiver: true, element: true, trusted: true })
      const bounds = await page.evaluate(() => {
        const { $player, $setting } = window.art.template
        const player = $player.getBoundingClientRect()
        const panel = $setting.getBoundingClientRect()
        return { mobile: $player.classList.contains('art-mobile'), rotated: window.art.isRotate, inside: panel.left >= player.left - 1 && panel.top >= player.top - 1 && panel.right <= player.right + 1 && panel.bottom <= player.bottom + 1 }
      })
      expect(bounds).toEqual({ mobile: true, rotated: rotate, inside: true })
      await testInfo.attach('setting-mobile-layout', { contentType: 'image/png', body: await page.screenshot() })
      await page.evaluate(() => {
        window.art.fullscreenWeb = false
        window.art.destroy()
      })
    })
  }
})

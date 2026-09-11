import { expect, test } from './fixtures.js'

async function setup(page) {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => {
    window.miniCalls = []
    const outside = document.createElement('button')
    outside.id = 'mini-outside'
    outside.textContent = 'Outside'
    document.body.append(outside)
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/pattern.mp4',
      muted: true,
      hotkey: true,
      controls: [{ name: 'mini-trigger', position: 'right', html: 'Mini', click() { this.mini = true } }],
    })
    window.art.on('mini', value => window.miniCalls.push(['mini', value]))
    window.art.on('play', () => window.miniCalls.push(['play']))
    window.art.on('pause', () => window.miniCalls.push(['pause']))
    window.art.on('hotkey', event => window.miniCalls.push(['hotkey', event.code]))
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

test('candidate: mini keyboard entry reaches close and stable playback controls and Escape returns focus', async ({ page }, testInfo) => {
  await setup(page)
  const trigger = page.locator('.art-control-mini-trigger')
  await trigger.focus()
  await page.keyboard.press('Enter')
  const popup = page.locator('.art-mini-popup')
  await expect(popup.locator('.art-mini-close')).toBeFocused()
  await expect(popup.locator('.art-mini-close')).toHaveAttribute('aria-label', 'Close')
  await page.keyboard.press('Tab')
  await expect(popup.locator('.art-mini-state')).toBeFocused()
  await expect(popup.locator('.art-mini-state')).toHaveAttribute('aria-label', 'Play')
  await page.keyboard.press('Space')
  await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(true)
  await expect(popup.locator('.art-mini-state')).toBeFocused()
  await expect(popup.locator('.art-mini-state')).toHaveAttribute('aria-label', 'Pause')
  await page.keyboard.press('Enter')
  await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(false)
  await popup.screenshot({ path: testInfo.outputPath('mini-keyboard.png') })
  await page.keyboard.press('Escape')
  await expect(popup).toBeHidden()
  await expect(trigger).toBeFocused()
  expect(await page.evaluate(() => window.miniCalls)).toEqual([['mini', true], ['play'], ['pause'], ['mini', false]])
})

test('candidate: mini pointer entry preserves focus and Space closes after keyboard navigation', async ({ page }) => {
  await setup(page)
  await page.locator('#mini-outside').focus()
  await page.locator('.art-control-mini-trigger').click()
  await expect(page.locator('.art-mini-close')).not.toBeFocused()
  await page.locator('.art-mini-close').focus()
  await page.keyboard.press('Space')
  await expect(page.locator('.art-mini-popup')).toBeHidden()
  await expect(page.locator('.art-control-mini-trigger')).toBeFocused()
  expect(await page.evaluate(() => window.miniCalls)).toEqual([['mini', true], ['mini', false]])
})

test('candidate: programmatic mini exit preserves external focus and removed return targets use the player', async ({ page }) => {
  await setup(page)
  await page.locator('.art-control-mini-trigger').focus()
  await page.keyboard.press('Enter')
  await page.locator('#mini-outside').focus()
  await page.evaluate(() => {
    window.art.mini = false
  })
  await expect(page.locator('#mini-outside')).toBeFocused()
  await page.locator('.art-control-mini-trigger').focus()
  await page.keyboard.press('Enter')
  await page.evaluate(() => window.art.controls.remove('mini-trigger'))
  await page.keyboard.press('Escape')
  await expect(page.locator('.art-video-player')).toBeFocused()
  await expect(page.locator('.art-mini-popup')).toBeHidden()
})

test('candidate: destroying from mini return focus cancels late notifications and retained controls', async ({ page }) => {
  await setup(page)
  await page.locator('.art-control-mini-trigger').focus()
  await page.keyboard.press('Enter')
  await page.evaluate(() => {
    window.retainedMini = window.art.template.$mini
    window.art.controls['mini-trigger'].addEventListener('focus', () => window.art.destroy(false), { once: true })
    window.miniCalls.length = 0
  })
  await page.keyboard.press('Escape')
  expect(await page.evaluate(() => window.art.isDestroy)).toBe(true)
  await page.evaluate(() => {
    window.retainedMini.querySelector('.art-mini-close').click()
    window.retainedMini.querySelector('.art-icon-play').click()
  })
  expect(await page.evaluate(() => window.miniCalls)).toEqual([])
})

test('candidate: mini reuse keeps keyboard entry and never returns to a stale or hidden origin', async ({ page }) => {
  await setup(page)
  const trigger = page.locator('.art-control-mini-trigger')
  await trigger.focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Escape')
  await page.keyboard.press('Enter')
  await expect(page.locator('.art-mini-close')).toBeFocused()
  await page.evaluate(() => {
    window.art.controls['mini-trigger'].style.visibility = 'hidden'
  })
  await page.keyboard.press('Escape')
  await expect(page.locator('.art-video-player')).toBeFocused()
  await page.evaluate(() => {
    window.art.controls['mini-trigger'].style.visibility = ''
  })
  await page.locator('#mini-outside').focus()
  await page.evaluate(() => {
    window.art.mini = true
  })
  await expect(page.locator('#mini-outside')).toBeFocused()
  await page.locator('.art-mini-close').focus()
  await page.keyboard.press('Escape')
  await expect(page.locator('.art-video-player')).toBeFocused()
})

test('candidate: mini names use existing i18n keys and hidden controls cannot reactivate the mode', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    const get = window.art.i18n.get.bind(window.art.i18n)
    const names = { 'Close': 'Localized close', 'Play': 'Localized play', 'Pause': 'Localized pause', 'Mini Player': 'Localized mini' }
    window.art.i18n.get = key => names[key] || get(key)
  })
  await page.locator('.art-control-mini-trigger').focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.art-mini-popup')).toHaveAttribute('aria-label', 'Localized mini')
  await expect(page.locator('.art-mini-close')).toHaveAttribute('aria-label', 'Localized close')
  await expect(page.locator('.art-mini-state')).toHaveAttribute('aria-label', 'Localized play')
  await page.keyboard.press('Escape')
  await page.evaluate(() => {
    window.miniCalls.length = 0
    for (const selector of ['.art-mini-close', '.art-mini-state'])
      document.querySelector(selector).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
  })
  expect(await page.evaluate(() => window.miniCalls)).toEqual([])
})

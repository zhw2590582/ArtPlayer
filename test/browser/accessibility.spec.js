import { expect, test } from './fixtures.js'

async function setup(page, core = 'candidate') {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => {
    const before = document.createElement('button')
    before.id = 'before-player'
    before.textContent = 'Before player'
    document.body.prepend(before)
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, hotkey: true, setting: true, fullscreenWeb: true, screenshot: true })
    window.keyboardHits = []
    window.art.on('hotkey', event => window.keyboardHits.push(event.code))
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.locator('#before-player').focus()
}

async function tabPastNativeVideo(page) {
  await page.keyboard.press('Tab')
  // Firefox includes the native video in its existing sequential focus order.
  if (await page.locator('.art-video').evaluate(element => element.ownerDocument.activeElement === element))
    await page.keyboard.press('Tab')
}

async function tabToPlay(page) {
  await tabPastNativeVideo(page)
  await expect(page.locator('.art-control-progress')).toBeFocused()
  await page.keyboard.press('Tab')
}

test('published: Tab skips the non-interactive main controls', async ({ page }) => {
  await setup(page, 'published')
  await tabPastNativeVideo(page)
  await expect(page.locator('#play')).toBeFocused()
  expect(await page.locator('.art-controls [tabindex="0"]').count()).toBe(0)
})

test('candidate: keyboard reaches stable play control and toggles once with focus retained', async ({ page }) => {
  await setup(page)
  await tabToPlay(page)
  const play = page.locator('.art-control-playAndPause')
  await expect(play).toBeFocused()
  await expect(play).toHaveAttribute('role', 'button')
  await expect(play).toHaveAttribute('aria-label', 'Play')
  await page.keyboard.press('Enter')
  await expect.poll(() => page.evaluate(() => window.art.playing && window.art.currentTime > 0.1)).toBe(true)
  await expect(play).toBeFocused()
  await expect(play).toHaveAttribute('aria-label', 'Pause')
  await page.keyboard.down('Space')
  expect(await page.evaluate(() => window.art.playing)).toBe(true)
  await page.keyboard.up('Space')
  await expect.poll(() => page.evaluate(() => window.art.video.paused)).toBe(true)
  await expect(play).toBeFocused()
  expect(await page.evaluate(() => window.keyboardHits)).toEqual([])
  await page.keyboard.press('Tab')
  await expect(page.locator('.art-control-volume .art-icon-volumeClose')).toBeFocused()
})

test('candidate: mute state, focus visibility and automatic hiding follow keyboard focus', async ({ page }) => {
  await setup(page)
  await tabToPlay(page)
  await page.keyboard.press('Enter')
  await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(true)
  await page.evaluate(() => {
    window.Artplayer.CONTROL_HIDE_TIME = 0
  })
  await page.keyboard.press('Tab')
  const muted = page.locator('.art-control-volume .art-icon-volumeClose')
  const audible = page.locator('.art-control-volume .art-icon-volume')
  await expect(muted).toBeFocused()
  await expect(muted).toHaveAttribute('aria-label', 'Mute')
  await expect(muted).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('Space')
  await expect(audible).toBeFocused()
  await expect(audible).toHaveAttribute('aria-pressed', 'false')
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.5)
  expect(await page.evaluate(() => window.art.controls.show)).toBe(true)
  expect(await audible.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none')
  expect(await page.evaluate(() => window.keyboardHits)).toEqual([])
  await page.locator('#before-player').focus()
  await expect.poll(() => page.evaluate(() => window.art.controls.show)).toBe(false)
  expect(await page.evaluate(() => window.art.isFocus)).toBe(false)
})

test('candidate: custom control keyboard clicks retain the callback and release on replacement', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    const art = window.art
    window.customHits = []
    art.controls.add({ name: 'keyboard-custom', position: 'right', html: 'Custom', click(component, event) {
      window.customHits.push({ same: this === art, component: component === art.controls, type: event.type })
    } })
  })
  const control = page.locator('.art-control-keyboard-custom')
  await control.focus()
  await page.keyboard.press('Enter')
  await page.keyboard.down('Space')
  await page.keyboard.down('Space')
  await page.keyboard.up('Space')
  expect(await page.evaluate(() => window.customHits)).toEqual([
    { same: true, component: true, type: 'click' },
    { same: true, component: true, type: 'click' },
  ])
  await page.keyboard.down('Space')
  await page.evaluate(() => {
    const art = window.art
    window.oldControl = art.controls['keyboard-custom']
    art.controls.update({ name: 'keyboard-custom', html: 'Replaced' })
  })
  await page.keyboard.up('Space')
  await page.evaluate(() => {
    window.oldControl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
  })
  expect(await page.evaluate(() => window.customHits.length)).toBe(2)
  await control.focus()
  await page.keyboard.press('Enter')
  expect(await page.evaluate(() => window.customHits.length)).toBe(3)
  await page.evaluate(() => window.art.destroy(false))
  expect(await page.evaluate(() => {
    window.oldControl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    return window.customHits.length
  })).toBe(3)
})

test('candidate: native buttons inside custom controls retain activation without player hotkeys', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    const art = window.art
    window.nativeButtonHits = 0
    window.parentButtonHits = 0
    const button = document.createElement('button')
    button.textContent = 'Native action'
    button.addEventListener('click', () => window.nativeButtonHits++)
    art.controls.add({ name: 'native-action', position: 'right', html: button, click() {
      window.parentButtonHits++
    } })
    art.hotkey.add('KeyK', () => window.keyboardHits.push('custom-k'))
  })
  const parent = page.locator('.art-control-native-action')
  const button = parent.locator('button')
  await expect(parent).not.toHaveAttribute('role', 'button')
  await button.focus()
  await page.keyboard.press('Space')
  await page.keyboard.press('Enter')
  expect(await page.evaluate(() => ({ native: window.nativeButtonHits, parent: window.parentButtonHits, paused: window.art.video.paused, hotkeys: window.keyboardHits }))).toEqual({ native: 2, parent: 2, paused: true, hotkeys: [] })
  await page.keyboard.press('k')
  expect(await page.evaluate(() => window.keyboardHits)).toEqual(['custom-k', 'KeyK'])
})

test('candidate: pointer focus does not prevent the existing automatic control hiding', async ({ page }) => {
  await setup(page)
  // Start a pointer interaction after setup's programmatic focus.
  await page.locator('.art-control-playAndPause .art-icon-play').click()
  await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(true)
  await page.evaluate(() => {
    window.Artplayer.CONTROL_HIDE_TIME = 0
  })
  await page.mouse.move(900, 650)
  await expect.poll(() => page.evaluate(() => window.art.controls.show)).toBe(false)
  await expect.poll(() => page.locator('.art-bottom').evaluate(element => getComputedStyle(element).opacity)).toBe('0')
})

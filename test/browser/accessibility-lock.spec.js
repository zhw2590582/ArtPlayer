import { expect, test } from './fixtures.js'

async function setup(page) {
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { configurable: true, value: 'ArtPlayer Android keyboard fixture' }))
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => {
    const outside = document.createElement('button')
    outside.id = 'lock-outside'
    outside.textContent = 'Outside'
    document.body.append(outside)
    window.lockEvents = []
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, lock: true, hotkey: true })
    window.art.on('lock', value => window.lockEvents.push([value, window.art.isLock, window.art.plugins.lock.state]))
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

test('candidate: lock uses one stable keyboard button, Escape unlocks and hidden controls leave Tab order', async ({ page }) => {
  await setup(page)
  const lock = page.locator('.art-layer-lock')
  await lock.focus()
  await expect(lock).toBeFocused()
  await expect(lock).toHaveAttribute('aria-label', 'Lock')
  await page.keyboard.press('Space')
  await expect(lock).toHaveAttribute('aria-pressed', 'true')
  await expect(lock).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('#play')).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(lock).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(lock).toHaveAttribute('aria-pressed', 'false')
  await expect(lock).toBeFocused()
  expect(await page.evaluate(() => window.lockEvents)).toEqual([[true, true, true], [false, false, false]])
  await page.keyboard.press('Tab')
  await expect(page.locator('.art-control-progress')).toBeFocused()
})

test('candidate: programmatic lock moves hidden control focus to unlock and caller tabindex survives', async ({ page }) => {
  await setup(page)
  await page.locator('.art-control-progress').focus()
  await page.evaluate(() => {
    window.art.controls.add({ name: 'custom', position: 'right', html: '<button tabindex="3">Custom</button>' })
    window.art.plugins.lock.state = true
  })
  await expect(page.locator('.art-layer-lock')).toBeFocused()
  await expect(page.locator('.art-bottom')).toHaveAttribute('inert')
  await expect(page.locator('.art-control-custom button')).toHaveAttribute('tabindex', '-1')
  await page.keyboard.press('Enter')
  await expect(page.locator('.art-bottom')).not.toHaveAttribute('inert')
  await expect(page.locator('.art-control-custom button')).toHaveAttribute('tabindex', '3')
})

test('candidate: locked additions stay out of Tab order and removal or destruction releases focus attributes', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    window.art.plugins.lock.state = true
    window.art.controls.add({ name: 'late', position: 'right', html: '<button>Late</button>' })
  })
  await expect(page.locator('.art-control-late button')).toHaveAttribute('tabindex', '-1')
  await page.evaluate(() => {
    window.retainedLock = window.art.layers.lock
    window.art.layers.remove('lock')
  })
  await expect(page.locator('.art-bottom')).not.toHaveAttribute('inert')
  await expect(page.locator('.art-control-late button')).not.toHaveAttribute('tabindex')
  await page.evaluate(() => {
    window.lockEvents.length = 0
    window.retainedLock.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    window.art.destroy(false)
  })
  expect(await page.evaluate(() => window.lockEvents)).toEqual([])
})

test('candidate: lock Tab fallback works without native inert and preserves caller focus attributes', async ({ page }) => {
  await setup(page)
  await page.locator('.art-layer-lock').focus()
  await page.keyboard.press('Enter')
  await page.evaluate(() => window.art.template.$bottom.removeAttribute('inert'))
  await page.keyboard.press('Tab')
  await expect(page.locator('#play')).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(page.locator('.art-layer-lock')).toBeFocused()
  await page.keyboard.press('Escape')
  await page.evaluate(() => {
    window.art.template.$bottom.setAttribute('inert', 'caller-owned')
    window.art.template.$bottom.setAttribute('aria-hidden', 'false')
    window.art.plugins.lock.state = true
    window.art.plugins.lock.state = false
  })
  await expect(page.locator('.art-bottom')).toHaveAttribute('inert', 'caller-owned')
  await expect(page.locator('.art-bottom')).toHaveAttribute('aria-hidden', 'false')
})

test('candidate: moving a control outside a locked region restores its tabindex and cleanup preserves later caller edits', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    window.art.controls.add({ name: 'borrowed', position: 'right', html: '<button id="borrowed-focus" tabindex="2">Borrowed</button>' })
    window.art.plugins.lock.state = true
  })
  await expect(page.locator('#borrowed-focus')).toHaveAttribute('tabindex', '-1')
  await page.evaluate(() => document.body.append(document.querySelector('#borrowed-focus')))
  await expect(page.locator('#borrowed-focus')).toHaveAttribute('tabindex', '2')
  await page.evaluate(() => {
    window.art.controls.progress.setAttribute('tabindex', '4')
    window.art.plugins.lock.state = false
  })
  await expect(page.locator('.art-control-progress')).toHaveAttribute('tabindex', '4')
})

test('candidate: remounting an already locked layer reflects actual state and replaces its keyboard scope', async ({ page }) => {
  await setup(page)
  await page.evaluate(() => {
    window.art.plugins.lock.state = true
    window.art.layers.update({ name: 'lock' })
    window.lockEvents.length = 0
  })
  const lock = page.locator('.art-layer-lock')
  await expect(lock).toHaveAttribute('aria-pressed', 'true')
  await expect(lock.locator('.art-icon-lock')).toBeVisible()
  expect(await lock.locator('.art-icon-lock').evaluate(element => element.style.display)).toBe('inline-flex')
  await expect(lock.locator('.art-icon-unlock')).toHaveCSS('display', 'none')
  await lock.focus()
  await page.keyboard.press('Space')
  await expect(page.locator('.art-bottom')).not.toHaveAttribute('inert')
  expect(await page.evaluate(() => window.lockEvents)).toEqual([[false, false, false]])
})

import { expect, test } from './fixtures.js'

async function setup(page) {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => {
    window.infoEvents = []
    const outside = document.createElement('button')
    outside.id = 'info-outside'
    outside.textContent = 'Outside'
    document.body.append(outside)
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/pattern.mp4',
      muted: true,
      fullscreenWeb: true,
      controls: [{ name: 'info-trigger', position: 'right', html: 'Info', click() { this.info.show = true } }],
    })
    window.art.on('info', value => window.infoEvents.push(value))
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

test('candidate: info keyboard entry, Space close and Escape preserve the opening control', async ({ page }) => {
  await setup(page)
  const trigger = page.locator('.art-control-info-trigger')
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.art-info-close')).toBeFocused()
  await expect(page.locator('.art-info-close')).toHaveAttribute('aria-label', 'Close')
  await expect(page.locator('.art-info')).toHaveAttribute('aria-label', 'Video Info')
  await page.keyboard.press('Space')
  await expect(page.locator('.art-info')).toBeHidden()
  await expect(trigger).toBeFocused()
  await page.evaluate(() => {
    window.art.fullscreenWeb = true
  })
  await page.keyboard.press('Enter')
  await expect(page.locator('.art-info-close')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('.art-info')).toBeHidden()
  await expect(trigger).toBeFocused()
  expect(await page.evaluate(() => window.art.fullscreenWeb)).toBe(true)
  await page.keyboard.press('Escape')
  expect(await page.evaluate(() => window.art.fullscreenWeb)).toBe(false)
  expect(await page.evaluate(() => window.infoEvents)).toEqual([true, false, true, false])
})

test('candidate: info pointer and programmatic visibility preserve unrelated focus', async ({ page }) => {
  await setup(page)
  await page.locator('.art-control-info-trigger').click()
  await expect(page.locator('.art-info-close')).not.toBeFocused()
  await page.locator('#info-outside').focus()
  await page.evaluate(() => {
    window.art.info.show = false
    window.art.info.show = true
    window.art.info.show = false
  })
  await expect(page.locator('#info-outside')).toBeFocused()
})

test('candidate: repeated info init replaces keyboard bindings and retains the current return target', async ({ page }) => {
  await setup(page)
  await page.locator('.art-control-info-trigger').focus()
  await page.keyboard.press('Enter')
  await page.evaluate(() => {
    window.art.info.init()
    window.art.info.init()
    window.infoEvents.length = 0
  })
  await page.keyboard.press('Enter')
  await expect(page.locator('.art-info')).toBeHidden()
  await expect(page.locator('.art-control-info-trigger')).toBeFocused()
  expect(await page.evaluate(() => window.infoEvents)).toEqual([false])
})

test('candidate: info with a removed origin returns to the player and destruction disables retained controls', async ({ page }) => {
  await setup(page)
  await page.locator('.art-control-info-trigger').focus()
  await page.keyboard.press('Enter')
  await page.evaluate(() => window.art.controls.remove('info-trigger'))
  await page.keyboard.press('Escape')
  await expect(page.locator('.art-video-player')).toBeFocused()
  await page.evaluate(() => {
    window.retainedInfo = window.art.template.$infoClose
    window.art.destroy(false)
    window.infoEvents.length = 0
    window.retainedInfo.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    window.retainedInfo.click()
  })
  expect(await page.evaluate(() => window.infoEvents)).toEqual([])
})

for (const core of ['published', 'candidate']) {
  test(`${core}: optional SSR info wrapper may be absent without preventing polling and close`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    expect(await page.evaluate(() => {
      const container = document.querySelector('.player')
      container.innerHTML = window.Artplayer.html
      container.querySelector('.art-info').className = 'caller-info'
      const close = container.querySelector('.art-info-close')
      const panel = container.querySelector('.art-info-panel')
      const art = new window.Artplayer({ container, url: '', useSSR: true })
      art.info.show = true
      close.click()
      const result = { absent: art.template.$info === null, retained: art.template.$infoClose === close && art.template.$infoPanel === panel, closed: !art.info.show }
      art.destroy()
      return result
    })).toEqual({ absent: true, retained: true, closed: true })
  })
}

test('candidate: failed info name initialization releases its handlers and permits a clean retry', async ({ page }) => {
  await setup(page)
  expect(await page.evaluate(() => {
    const get = window.art.i18n.get
    const count = window.art.e.info.length
    const failure = new Error('name failed')
    window.art.i18n.get = () => {
      throw failure
    }
    let same = false
    try {
      window.art.info.init()
    }
    catch (error) { same = error === failure }
    window.art.i18n.get = get
    const released = window.art.e.info.length === count - 1
    window.art.info.init()
    return { same, released }
  })).toEqual({ same: true, released: true })
  await page.locator('.art-control-info-trigger').focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.art-info-close')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('.art-control-info-trigger')).toBeFocused()
})

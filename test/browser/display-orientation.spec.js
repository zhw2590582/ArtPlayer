import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.setViewportSize({ width: 400, height: 800 })
  await page.addInitScript(() => Object.defineProperty(navigator, 'userAgent', { configurable: true, value: 'ArtPlayer Android orientation fixture' }))
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => {
    window.Artplayer.AUTO_ORIENTATION_TIME = 10
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, autoOrientation: true })
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

test('candidate: a cancelled rotation timer cannot rotate a later fullscreen session early', async ({ page }) => {
  await setup(page, 'candidate')
  await page.clock.install({ time: new Date('2026-09-11T00:00:00Z') })
  await page.clock.pauseAt(new Date('2026-09-11T00:00:01Z'))
  await page.evaluate(() => {
    window.Artplayer.AUTO_ORIENTATION_TIME = 1000
    window.art.fullscreenWeb = true
  })
  await page.clock.runFor(700)
  await page.evaluate(() => {
    window.art.fullscreenWeb = false
    window.art.fullscreenWeb = true
  })
  await page.clock.runFor(400)
  expect(await page.evaluate(() => window.art.plugins.autoOrientation.state)).toBe(false)
  await page.clock.runFor(600)
  expect(await page.evaluate(() => window.art.plugins.autoOrientation.state)).toBe(true)
  await page.evaluate(() => window.art.destroy())
})

for (const removeHtml of [false, true]) {
  test(`candidate: rotation destruction restores styles and cancels subscriptions removeHtml=${removeHtml}`, async ({ page }) => {
    await setup(page, 'candidate')
    await page.evaluate(() => {
      const art = window.art
      art.constructor.FULLSCREEN_WEB_IN_BODY = true
      art.template.$player.style.cssText = 'width:75%;height:80%;transform:scale(0.9);transform-origin:center;'
      window.beforeRotation = art.template.$player.getAttribute('style')
      art.fullscreenWeb = true
    })
    await expect.poll(() => page.evaluate(() => window.art.plugins.autoOrientation.state)).toBe(true)
    expect(await page.evaluate((remove) => {
      const art = window.art
      const player = art.template.$player
      art.destroy(remove)
      const style = player.getAttribute('style')
      art.emit('fullscreenWeb', true)
      art.emit('fullscreen', true)
      return { restored: style === window.beforeRotation, rotated: art.isRotate, state: art.plugins.autoOrientation.state, retained: player.isConnected, changed: style !== player.getAttribute('style') }
    }, removeHtml)).toEqual({ restored: true, rotated: false, state: false, retained: !removeHtml, changed: false })
  })
}

test('candidate: destroying a pending rotation removes its timer and produces no late resize', async ({ page }) => {
  await setup(page, 'candidate')
  await page.clock.install({ time: new Date('2026-09-11T00:00:00Z') })
  await page.clock.pauseAt(new Date('2026-09-11T00:00:01Z'))
  await page.evaluate(() => {
    const art = window.art
    art.constructor.AUTO_ORIENTATION_TIME = 1000
    art.fullscreenWeb = true
    art.destroy(false)
    window.lateRotations = []
    art.on('resize', () => window.lateRotations.push(art.isRotate))
  })
  await page.clock.runFor(2000)
  expect(await page.evaluate(() => ({ rotated: window.art.plugins.autoOrientation.state, events: window.lateRotations }))).toEqual({ rotated: false, events: [] })
})

test('candidate: rotated playback supports ratio and flip changes before restoring normal layout', async ({ page }) => {
  await setup(page, 'candidate')
  await page.evaluate(async () => {
    await window.art.play()
    window.art.fullscreenWeb = true
  })
  await expect.poll(() => page.evaluate(() => window.art.plugins.autoOrientation.state && window.art.currentTime > 0.1)).toBe(true)
  expect(await page.evaluate(() => {
    const art = window.art
    art.aspectRatio = '4:3'
    art.flip = 'horizontal'
    const video = art.template.$video
    const ratio = video.clientWidth / video.clientHeight
    const flipped = art.flip
    art.fullscreenWeb = false
    art.aspectRatio = 'default'
    art.flip = 'normal'
    const result = { ratioClose: Math.abs(ratio - 4 / 3) < 0.01, flipped, playing: art.playing, rotate: art.isRotate, cleared: video.style.width === '' && video.style.height === '' }
    art.destroy()
    return result
  })).toEqual({ ratioClose: true, flipped: 'horizontal', playing: true, rotate: false, cleared: true })
})

test('candidate: repeated web fullscreen retains rotated dimensions and final styles', async ({ page }) => {
  await setup(page, 'candidate')
  await page.evaluate(() => {
    window.art.fullscreenWeb = true
  })
  await expect.poll(() => page.evaluate(() => window.art.plugins.autoOrientation.state)).toBe(true)
  expect(await page.evaluate(() => {
    const art = window.art
    art.fullscreenWeb = true
    const result = { width: art.template.$player.style.width, height: art.template.$player.style.height, state: art.plugins.autoOrientation.state }
    art.destroy()
    return result
  })).toEqual({ width: '800px', height: '400px', state: true })
})

for (const core of ['published', 'candidate']) {
  test(`${core}: rotated web fullscreen restores original inline geometry`, async ({ page }) => {
    await setup(page, core)
    await page.evaluate(() => {
      const art = window.art
      art.template.$player.style.cssText = 'width:75%;height:80%;transform:scale(0.9);transform-origin:center;'
      window.beforeRotation = art.template.$player.getAttribute('style')
      art.fullscreenWeb = true
    })
    await expect.poll(() => page.evaluate(() => window.art.isRotate)).toBe(true)
    expect(await page.evaluate(() => {
      const art = window.art
      const rotated = { state: art.plugins.autoOrientation.state, width: art.template.$player.style.width, height: art.template.$player.style.height }
      art.fullscreenWeb = false
      const original = document.createElement('div')
      original.setAttribute('style', window.beforeRotation)
      const restored = ['width', 'height', 'transform', 'transform-origin'].every(name => art.template.$player.style.getPropertyValue(name) === original.style.getPropertyValue(name))
      const result = { rotated, restored, state: art.plugins.autoOrientation.state, isRotate: art.isRotate }
      art.destroy()
      return result
    })).toEqual({ rotated: { state: true, width: '800px', height: '400px' }, restored: core === 'candidate', state: false, isRotate: false })
  })

  test(`${core}: late orientation lock after fullscreen exit does not reactivate the player`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(async () => {
      const art = window.art
      const calls = []
      let resolveLock
      Object.defineProperty(screen, 'orientation', { configurable: true, value: {
        type: 'portrait-primary',
        lock(mode) {
          calls.push(mode)
          return new Promise((resolve) => {
            resolveLock = resolve
          })
        },
        unlock() {
          calls.push('unlock')
        },
      } })
      art.emit('fullscreen', true)
      art.emit('fullscreen', false)
      resolveLock()
      await new Promise(resolve => setTimeout(resolve, 0))
      const result = { requested: calls[0], unlocked: calls.includes('unlock'), active: art.template.$player.classList.contains('art-auto-orientation-fullscreen') }
      art.destroy()
      return result
    })).toEqual({ requested: 'landscape', unlocked: core === 'candidate', active: core !== 'candidate' })
  })
}

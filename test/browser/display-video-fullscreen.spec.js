import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.addInitScript(() => {
    // Exercise the video-only branch without claiming an iOS device test.
    for (const name of ['fullscreenEnabled', 'webkitFullscreenEnabled', 'webkitFullScreenEnabled', 'mozFullScreenEnabled', 'msFullscreenEnabled'])
      Object.defineProperty(document, name, { configurable: true, value: false })
    const state = new WeakMap()
    Object.defineProperties(HTMLVideoElement.prototype, {
      webkitSupportsFullscreen: { configurable: true, get: () => true },
      webkitDisplayingFullscreen: { configurable: true, get() { return state.get(this) === true } },
      webkitPresentationMode: { configurable: true, get() { return state.get(this) ? 'fullscreen' : 'inline' } },
      webkitEnterFullscreen: { configurable: true, writable: true, value() {
        state.set(this, true)
        this.dispatchEvent(new Event('webkitbeginfullscreen'))
        this.dispatchEvent(new Event('webkitpresentationmodechanged'))
      } },
      webkitExitFullscreen: { configurable: true, writable: true, value() {
        state.set(this, false)
        this.dispatchEvent(new Event('webkitendfullscreen'))
        this.dispatchEvent(new Event('webkitpresentationmodechanged'))
      } },
    })
    window.videoFullscreenState = state
  })
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => {
    window.createPlayer('/test/pattern.mp4')
    window.modeEvents = []
    window.art.on('fullscreen', value => window.modeEvents.push(value))
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  test(`${core}: video-only fullscreen reads its native video state and deduplicates signals`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      art.fullscreen = true
      const entered = art.fullscreen
      art.emit('document:webkitfullscreenchange')
      art.fullscreen = false
      const result = { entered, exited: art.fullscreen, events: [...window.modeEvents] }
      art.destroy()
      return result
    })).toEqual({ entered: core === 'candidate', exited: false, events: core === 'candidate' ? [true, false] : [false] })
  })

  test(`${core}: destroying video-only fullscreen releases native presentation`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      art.fullscreen = true
      window.modeEvents.length = 0
      art.destroy(false)
      return { native: art.template.$video.webkitDisplayingFullscreen, events: window.modeEvents }
    })).toEqual({ native: core === 'published', events: [] })
  })
}

test('candidate: cancelled video-only entry after destroy is released without late player events', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const video = art.template.$video
    video.webkitEnterFullscreen = () => {}
    art.fullscreen = true
    art.destroy(false)
    window.videoFullscreenState.set(video, true)
    video.dispatchEvent(new Event('webkitbeginfullscreen'))
    return { native: video.webkitDisplayingFullscreen, events: window.modeEvents }
  })).toEqual({ native: false, events: [] })
})

test('candidate: video-only fullscreen preserves synchronous errors and supports exit retry', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const video = art.template.$video
    art.fullscreen = true
    const exit = video.webkitExitFullscreen
    const failure = new Error('controlled video exit denial')
    video.webkitExitFullscreen = () => {
      throw failure
    }
    let rejected = false
    try {
      art.fullscreen = false
    }
    catch (error) { rejected = error === failure }
    const active = art.fullscreen
    video.webkitExitFullscreen = exit
    art.fullscreen = false
    const result = { rejected, active, exited: art.fullscreen, events: window.modeEvents }
    art.destroy()
    return result
  })).toEqual({ rejected: true, active: true, exited: false, events: [true, false] })
})

import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.addInitScript(() => {
    window.pipElement = null
    window.pipExits = 0
    Object.defineProperties(document, {
      pictureInPictureEnabled: { configurable: true, value: true },
      pictureInPictureElement: { configurable: true, get: () => window.pipElement },
      exitPictureInPicture: { configurable: true, writable: true, value() {
        window.pipExits++
        const previous = window.pipElement
        window.pipElement = null
        previous?.dispatchEvent(new Event('leavepictureinpicture'))
        return Promise.resolve()
      } },
    })
    Object.defineProperty(HTMLVideoElement.prototype, 'requestPictureInPicture', {
      configurable: true,
      writable: true,
      value() {
        window.pipElement = this
        this.dispatchEvent(new Event('enterpictureinpicture'))
        return Promise.resolve({ width: 320, height: 180 })
      },
    })
  })
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => {
    window.createPlayer('/test/pattern.mp4')
    window.pipEvents = []
    window.art.on('pip', value => window.pipEvents.push(value))
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  test(`${core}: native PiP preserves element/null getter, void setter and boolean events`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const setter = Object.getOwnPropertyDescriptor(art, 'pip').set
      const entered = setter.call(art, true)
      const ownElement = art.pip === art.template.$video
      const exited = setter.call(art, false)
      const result = { ownElement, empty: art.pip === null, entered: typeof entered, exited: typeof exited, events: [...window.pipEvents] }
      art.destroy()
      return result
    })).toEqual({ ownElement: true, empty: true, entered: 'undefined', exited: 'undefined', events: [true, false] })
  })

  test(`${core}: a player cannot report or exit another video's PiP`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const other = document.createElement('video')
      window.pipElement = other
      const reported = window.art.pip === other
      window.art.pip = false
      const result = { reported, stillOther: window.pipElement === other, exits: window.pipExits }
      window.pipElement = null
      window.art.destroy()
      return result
    })).toEqual({ reported: core === 'published', stillOther: core === 'candidate', exits: core === 'published' ? 1 : 0 })
  })

  test(`${core}: destroy releases active PiP without a late player event`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(async () => {
      window.art.pip = true
      await Promise.resolve()
      window.pipEvents.length = 0
      window.art.destroy(false)
      await Promise.resolve()
      return { active: Boolean(window.pipElement), events: window.pipEvents }
    })).toEqual({ active: core === 'published', events: [] })
  })
}

for (const action of ['cancel', 'destroy']) {
  test(`candidate: pending PiP ${action} releases late native entry`, async ({ page }) => {
    await setup(page, 'candidate')
    expect(await page.evaluate(async (action) => {
      const art = window.art
      const video = art.template.$video
      let complete
      video.requestPictureInPicture = () => new Promise(resolve => complete = resolve)
      art.pip = true
      if (action === 'destroy')
        art.destroy(false)
      else
        art.pip = false
      window.pipElement = video
      video.dispatchEvent(new Event('enterpictureinpicture'))
      complete({ width: 320, height: 180 })
      await new Promise(resolve => setTimeout(resolve, 0))
      const result = { active: Boolean(window.pipElement), events: [...window.pipEvents] }
      art.destroy()
      return result
    }, action)).toEqual({ active: false, events: [] })
  })
}

test('candidate: rejected PiP assignment shows notice without an unhandled rejection', async ({ page }) => {
  await setup(page, 'candidate')
  await page.evaluate(() => {
    window.art.template.$video.requestPictureInPicture = () => Promise.reject(new Error('controlled PiP denial'))
    window.art.pip = true
  })
  await expect(page.locator('.art-notice')).toContainText('controlled PiP denial')
  await page.evaluate(() => window.art.destroy())
})

test('candidate: actual native PiP gesture and playback or explicit unsupported capability', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  const capability = await page.evaluate(() => ({
    enabled: document.pictureInPictureEnabled === true,
    request: typeof window.art.template.$video.requestPictureInPicture === 'function',
    exit: typeof document.exitPictureInPicture === 'function',
  }))
  await testInfo.attach('native-pip-capability', { contentType: 'application/json', body: JSON.stringify(capability) })
  if (!capability.enabled || !capability.request || !capability.exit) {
    expect(await page.evaluate(() => window.art.pip)).toBe(false)
    await page.evaluate(() => window.art.destroy())
    return
  }
  await page.evaluate(() => {
    const video = window.art.template.$video
    const request = video.requestPictureInPicture.bind(video)
    video.requestPictureInPicture = () => {
      const result = request()
      void result.then(pipWindow => window.actualPipWindow = { width: pipWindow.width, height: pipWindow.height })
      return result
    }
    document.querySelector('#play').onclick = () => {
      void window.art.play()
      window.art.pip = true
    }
  })
  await page.evaluate(() => window.art.mini = true)
  await page.click('#play')
  await expect.poll(() => page.evaluate(() => window.art.pip === window.art.template.$video)).toBe(true)
  expect(await page.evaluate(() => window.art.mini)).toBe(false)
  await expect.poll(() => page.evaluate(() => window.actualPipWindow?.width > 0 && window.art.currentTime > 0 && !window.art.template.$video.paused)).toBe(true)
  await testInfo.attach('native-pip-playback', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ window: window.actualPipWindow, currentTime: window.art.currentTime, events: window.events }))) })
  await page.evaluate(() => window.art.fullscreenWeb = true)
  await expect.poll(() => page.evaluate(() => document.pictureInPictureElement)).toBe(null)
  expect(await page.evaluate(() => window.art.fullscreenWeb)).toBe(true)
  await page.evaluate(() => window.art.fullscreenWeb = false)
  await page.click('#play')
  await expect.poll(() => page.evaluate(() => window.art.pip === window.art.template.$video)).toBe(true)
  await page.evaluate(() => {
    document.querySelector('#play').onclick = () => window.art.fullscreen = true
  })
  await page.click('#play')
  await expect.poll(() => page.evaluate(() => window.art.fullscreen && !document.pictureInPictureElement)).toBe(true)
  await page.evaluate(() => window.art.fullscreen = false)
  await expect.poll(() => page.evaluate(() => window.art.fullscreen)).toBe(false)
  await page.evaluate(() => window.art.destroy())
})

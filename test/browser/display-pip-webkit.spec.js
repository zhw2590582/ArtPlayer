import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.addInitScript(() => {
    Object.defineProperty(document, 'pictureInPictureEnabled', { configurable: true, value: false })
    const modes = new WeakMap()
    Object.defineProperties(HTMLVideoElement.prototype, {
      webkitSupportsPresentationMode: { configurable: true, writable: true, value: () => true },
      webkitPresentationMode: { configurable: true, get() { return modes.get(this) || 'inline' } },
      webkitSetPresentationMode: { configurable: true, writable: true, value(mode) {
        modes.set(this, mode)
        this.dispatchEvent(new Event('webkitpresentationmodechanged'))
        this.dispatchEvent(new Event(mode === 'picture-in-picture' ? 'enterpictureinpicture' : 'leavepictureinpicture'))
      } },
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
  test(`${core}: WebKit PiP keeps boolean state and repeated synchronous setter events`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      art.pip = true
      art.pip = true
      const entered = art.pip
      art.pip = false
      const result = { entered, exited: art.pip, events: [...window.pipEvents] }
      art.destroy()
      return result
    })).toEqual({ entered: true, exited: false, events: [true, true, false] })
  })

  test(`${core}: WebKit PiP follows native UI transitions`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const video = window.art.template.$video
      video.webkitSetPresentationMode('picture-in-picture')
      video.webkitSetPresentationMode('inline')
      const result = [...window.pipEvents]
      window.art.destroy()
      return result
    })).toEqual(core === 'candidate' ? [true, false] : [])
  })

  test(`${core}: destroying WebKit PiP returns presentation to inline`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      window.art.pip = true
      window.pipEvents.length = 0
      window.art.destroy(false)
      return { mode: window.art.template.$video.webkitPresentationMode, events: window.pipEvents }
    })).toEqual({ mode: core === 'candidate' ? 'inline' : 'picture-in-picture', events: [] })
  })
}

test('candidate: WebKit PiP pending entry is cleaned up after destruction', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const video = art.template.$video
    const setMode = video.webkitSetPresentationMode.bind(video)
    video.webkitSetPresentationMode = () => {}
    art.pip = true
    art.destroy(false)
    video.webkitSetPresentationMode = setMode
    setMode('picture-in-picture')
    return { mode: video.webkitPresentationMode, events: window.pipEvents }
  })).toEqual({ mode: 'inline', events: [] })
})

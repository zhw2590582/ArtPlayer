import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: historical JS option forms remain accepted despite declaration gaps`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const container = document.createElement('div')
      document.body.append(container)
      const art = new window.Artplayer({ container, controls: [{ name: 'numeric', html: 42, position: 'left' }] })
      const result = { url: art.option.url, html: art.controls.numeric.textContent }
      art.destroy()
      return result
    })
    expect(result).toEqual({ url: '', html: '42' })
  })

  test(`${core}: configuration errors occur before mounting and preserve allocation timing`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const { Artplayer } = window
      const container = document.createElement('div')
      container.innerHTML = '<span>before</span>'
      document.body.append(container)
      let proxyCalls = 0
      let error
      try {
        void new Artplayer({ container, url: '', volume: 'loud', proxy() {
          proxyCalls++
          return document.createElement('video')
        } })
      }
      catch (actual) { error = { name: actual.name, message: actual.message } }
      const untouched = {
        html: container.innerHTML,
        id: container.getAttribute('data-art-id'),
        proxyCalls,
        count: Artplayer.instances.length,
      }
      const art = new Artplayer({ container, url: '' })
      const allocatedId = art.id
      art.destroy()
      return { error, untouched, allocatedId }
    })
    expect(result).toEqual({ error: { name: 'Error', message: '[Type Error]: \'option.volume\' require \'number\' type, but got \'string\'' }, untouched: { html: '<span>before</span>', id: null, proxyCalls: 0, count: 0 }, allocatedId: 2 })
  })

  test(`${core}: container identity, partial defaults, custom fields and normal callbacks`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(async () => {
      const { Artplayer } = window
      const container = document.createElement('div')
      document.body.append(container)
      const extension = { custom: true }
      let customCalls = 0
      let callbackShape = false
      let readyShape = false
      const customType = function (video, url, art) {
        customCalls++
        callbackShape = this === art && video === art.video
        video.src = url
      }
      const input = { container, url: '/test/pattern.mp4', subtitle: { style: { color: 'red' } }, customType: { mp4: customType }, extension, muted: true }
      let art
      await new Promise((resolve) => {
        art = new Artplayer(input, function (player) {
          readyShape = this === player && player === art
          resolve()
        })
      })
      const defaults = Artplayer.option
      const result = {
        sameContainer: art.option.container === container,
        sameExtension: art.option.extension === extension,
        customCallback: art.option.customType.mp4 === customType,
        customCalls,
        callbackShape,
        readyShape,
        encoding: art.option.subtitle.encoding,
        color: art.option.subtitle.style.color,
        columns: art.option.thumbnails.column,
        inputSubtitleKeys: Object.keys(input.subtitle),
        freshDefaults: defaults !== Artplayer.option,
        preload: Artplayer.option.moreVideoAttr.preload,
        expectedPreload: Artplayer.utils.isSafari ? 'auto' : 'metadata',
      }
      art.destroy()
      return result
    })
    const { preload, expectedPreload, ...behavior } = result
    expect(preload).toBe(expectedPreload)
    expect(behavior).toEqual({ sameContainer: true, sameExtension: true, customCallback: true, customCalls: 1, callbackShape: true, readyShape: true, encoding: 'utf-8', color: 'red', columns: 10, inputSubtitleKeys: ['style'], freshDefaults: true })
  })
}

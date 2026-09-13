import { hash } from '../../refactor/scripts/releases.mjs'
import { vttThumbnailCandidate } from '../helpers/vtt-thumbnail.js'
import { expect, test } from './fixtures.js'

const implementation = await vttThumbnailCandidate()
const cues = 'WEBVTT\n\n00:00.000 --> 00:04.000\nvtt-sprite.svg#xywh=0,0,80,45\n\n00:04.000 --> 00:08.000\nvtt-sprite.svg#xywh=80,0,80,45\n'
const sprite = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="45"><path fill="red" d="M0 0h80v45H0z"/><path fill="blue" d="M80 0h80v45H80z"/></svg>'

for (const core of ['published', 'candidate']) {
  test(`VTT native ${core} core: real progress hover selects sprite regions and destroy removes owned UI`, async ({ page }, testInfo) => {
    await page.route('**/test/vtt-cues.vtt', route => route.fulfill({ contentType: 'text/vtt', body: cues }))
    await page.route('**/test/vtt-sprite.svg', route => route.fulfill({ contentType: 'image/svg+xml', body: sprite }))
    await page.goto(`/test/player.html?core=${core}`)
    await page.addScriptTag({ content: implementation.code })
    await page.evaluate(async () => {
      window.createPlayer('/test/pattern.mp4')
      await window.art.plugins.add(window.artplayerPluginVttThumbnail({ vtt: '/test/vtt-cues.vtt' }))
    })
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const progress = page.locator('.art-control-progress')
    const preview = page.locator('.art-control-vtt-thumbnail')
    const bounds = await progress.boundingBox()
    await page.mouse.move(bounds.x + bounds.width * 0.25, bounds.y + bounds.height / 2)
    await expect(preview).toHaveCSS('display', 'flex')
    await expect(preview).toHaveCSS('width', '80px')
    await expect(preview).toHaveCSS('height', '45px')
    await expect(preview).toHaveCSS('background-position', '0px 0px')
    await page.mouse.move(bounds.x + bounds.width * 0.75, bounds.y + bounds.height / 2)
    await expect(preview).toHaveCSS('background-position', '-80px 0px')
    const pixels = await page.evaluate(async () => {
      const image = new Image()
      image.src = '/test/vtt-sprite.svg'
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = 160
      canvas.height = 45
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)
      return [Array.from(context.getImageData(40, 20, 1, 1).data), Array.from(context.getImageData(120, 20, 1, 1).data)]
    })
    expect(pixels).toEqual([[255, 0, 0, 255], [0, 0, 255, 255]])
    await testInfo.attach('selected-sprite', { body: await preview.screenshot(), contentType: 'image/png' })
    await page.evaluate(() => window.art.destroy(false))
    await expect(preview).toHaveCount(0)
    await testInfo.attach('vtt-candidate', { body: JSON.stringify({ core, implementation: hash(implementation.code), pixels }), contentType: 'application/json' })
  })

  test(`VTT native ${core} core: destroy aborts a pending native fetch and settles registration`, async ({ page }, testInfo) => {
    let release
    let requested
    const started = new Promise((resolve) => {
      requested = resolve
    })
    const pending = new Promise((resolve) => {
      release = resolve
    })
    await page.route('**/test/vtt-held.vtt', async (route) => {
      requested()
      await pending
      await route.fulfill({ contentType: 'text/vtt', body: cues }).catch(() => {})
    })
    try {
      await page.goto(`/test/player.html?core=${core}`)
      await page.addScriptTag({ content: implementation.code })
      await page.evaluate(() => {
        window.createPlayer('/test/pattern.mp4')
        const fetch = window.fetch.bind(window)
        window.fetch = (url, options) => {
          if (url === '/test/vtt-held.vtt')
            window.vttSignal = options?.signal
          return fetch(url, options)
        }
        window.vttSettled = false
        window.vttPending = window.artplayerPluginVttThumbnail({ vtt: '/test/vtt-held.vtt' })(window.art).then((result) => {
          window.vttSettled = true
          window.vttResult = result
        })
      })
      await started
      await page.evaluate(() => window.art.destroy(false))
      await expect.poll(() => page.evaluate(() => window.vttSettled)).toBe(true)
      expect(await page.evaluate(() => window.vttSignal.aborted)).toBe(true)
      release()
      await page.evaluate(() => window.vttPending)
      await expect(page.locator('.art-control-vtt-thumbnail')).toHaveCount(0)
      expect(await page.evaluate(() => window.vttResult)).toEqual({ name: 'artplayerPluginVttThumbnail' })
      await testInfo.attach('vtt-candidate', { body: JSON.stringify({ core, implementation: hash(implementation.code), nativeAbort: true }), contentType: 'application/json' })
    }
    finally { release() }
  })
}

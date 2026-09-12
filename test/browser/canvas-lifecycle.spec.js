import { hash } from '../../refactor/scripts/releases.mjs'
import { canvasCandidate } from '../helpers/canvas.js'
import { expect, test } from './fixtures.js'

const candidate = await canvasCandidate()

async function setup(page, core, testInfo) {
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: `(() => {
    const pending = new Set();
    const state = { requested: 0, fired: 0, cancelled: 0 };
    const requestAnimationFrame = callback => {
      const id = window.requestAnimationFrame(time => { pending.delete(id); state.fired++; callback(time); });
      pending.add(id); state.requested++; return id;
    };
    const cancelAnimationFrame = id => { pending.delete(id); state.cancelled++; window.cancelAnimationFrame(id); };
    const module = { exports: {} }; const exports = module.exports;
    ${candidate.source};
    window.canvasFactory = module.exports.default || module.exports;
    window.canvasFrames = { pending, state };
  })();` })
  await page.evaluate(() => {
    window.proxyDraws = 0
    window.proxyErrors = []
    window.proxyErrorStates = []
    window.proxyEvents = []
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/pattern.mp4',
      muted: true,
      loop: true,
      proxy: window.canvasFactory((context, video) => {
        window.proxyContext = context
        window.proxyVideo = video
        window.proxyDraws++
        if (window.destroyNextDraw) {
          window.destroyNextDraw = false
          window.art.destroy(false)
          window.destroyedInCallback = true
        }
      }),
    })
    for (const name of ['video:loadedmetadata', 'video:loadeddata', 'video:canplay', 'video:seeked', 'artplayerProxyCanvas:draw', 'destroy'])
      window.art.on(name, () => window.proxyEvents.push(name))
    window.art.on('artplayerProxyCanvas:error', (error) => {
      window.proxyErrors.push({ name: error.name, message: error.message })
      const video = window.proxyVideo || window.art?.template.$player.querySelector('video')
      let direct
      if (video) {
        const canvas = document.createElement('canvas')
        try {
          const context = canvas.getContext('2d')
          context.drawImage(video, 0, 0, 300, 150)
          direct = [...context.getImageData(0, 0, 1, 1).data]
        }
        catch (failure) { direct = failure.name }
      }
      window.proxyErrorStates.push({ readyState: video?.readyState, seeking: video?.seeking, paused: video?.paused, currentTime: video?.currentTime, source: video?.currentSrc, dimensions: [video?.videoWidth, video?.videoHeight], frames: video?.getVideoPlaybackQuality?.().totalVideoFrames, direct })
    })
    document.querySelector('#play').onclick = () => window.art.play()
    document.querySelector('#pause').onclick = () => window.art.pause()
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.click('#play')
  await expect.poll(() => page.evaluate(() => window.proxyDraws)).toBeGreaterThan(1)
  await expect.poll(() => page.evaluate(() => window.proxyVideo.currentTime)).toBeGreaterThan(0)
  await testInfo.attach('canvas-candidate-input', { contentType: 'application/json', body: JSON.stringify({ core, sha256: hash(candidate.source), scope: 'actual candidate source bundle, native media/Canvas/bitmap; lexical RAF observer delegates native scheduling' }) })
}

test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('canvas-candidate-error-states', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => window.proxyErrorStates)) })
  await testInfo.attach('canvas-candidate-state', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ version: window.Artplayer?.version, destroyed: window.art?.isDestroy, connected: window.proxyVideo?.isConnected, currentSrc: window.proxyVideo?.currentSrc, currentTime: window.proxyVideo?.currentTime, frames: window.canvasFrames?.state, pending: window.canvasFrames?.pending.size, draws: window.proxyDraws, errors: window.proxyErrors, events: window.proxyEvents }))) })
  await page.evaluate(() => {
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
  })
})

for (const core of ['published', 'candidate']) {
  test(`${core}: candidate canvas paints native pixels, resizes and switches media`, async ({ page }, testInfo) => {
    await setup(page, core, testInfo)
    expect(await page.evaluate(() => window.art.template.$video.nodeName)).toBe('CANVAS')
    expect(await page.evaluate(() => window.proxyVideo.isConnected)).toBe(true)
    expect(await page.evaluate(() => [window.proxyVideo.videoWidth, window.proxyVideo.videoHeight])).toEqual([320, 180])
    await expect.poll(() => page.evaluate(() => window.proxyContext.getImageData(0, 0, 1, 1).data[3])).toBe(255)
    expect(await page.evaluate(() => {
      const { canvas } = window.proxyContext
      const values = [0.2, 0.5, 0.8].map(ratio => [...window.proxyContext.getImageData(Math.floor(canvas.width * ratio), Math.floor(canvas.height / 2), 1, 1).data].join(','))
      return new Set(values).size
    })).toBeGreaterThan(1)
    await page.evaluate(() => {
      window.art.template.$player.style.width = '320px'
      window.art.template.$player.style.height = '480px'
      window.art.emit('resize')
    })
    await testInfo.attach('canvas-resize-dimensions', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ media: [window.proxyVideo.videoWidth, window.proxyVideo.videoHeight], css: [window.proxyVideo.clientWidth, window.proxyVideo.clientHeight], player: [window.art.template.$player.clientWidth, window.art.template.$player.clientHeight], canvas: [window.proxyContext.canvas.width, window.proxyContext.canvas.height], padding: window.proxyContext.canvas.style.padding }))) })
    expect(await page.evaluate(() => window.art.template.$video.style.padding)).toBe('150px 0px')
    await expect.poll(() => page.evaluate(() => window.proxyContext.getImageData(0, 0, 1, 1).data[3])).toBe(255)
    await page.evaluate(() => window.art.switchUrl('/assets/sample/video.mp4'))
    await page.click('#play')
    await expect.poll(() => page.evaluate(() => window.proxyVideo.currentSrc.endsWith('/assets/sample/video.mp4') && window.proxyVideo.currentTime > 0)).toBe(true)
    await expect.poll(() => page.evaluate(() => window.proxyContext.getImageData(0, 0, 1, 1).data[3])).toBe(255)
    expect(await page.evaluate(() => window.proxyErrors)).toEqual([])
  })

  test(`${core}: candidate paused seek draws the new video frame without restarting RAF`, async ({ page }, testInfo) => {
    await setup(page, core, testInfo)
    await page.click('#pause')
    await expect.poll(() => page.evaluate(() => window.canvasFrames.pending.size)).toBe(0)
    const count = await page.evaluate(() => window.proxyDraws)
    await page.evaluate(() => window.art.currentTime = 0.5)
    await expect.poll(() => page.evaluate(() => window.proxyDraws)).toBeGreaterThan(count)
    await expect.poll(() => page.evaluate(() => window.proxyContext.getImageData(0, 0, 1, 1).data[3])).toBe(255)
    expect(await page.evaluate(() => ({ paused: window.proxyVideo.paused, pending: window.canvasFrames.pending.size }))).toEqual({ paused: true, pending: 0 })
  })

  test(`${core}: candidate destroy inside callback leaves no media or native RAF and escaped play is inert`, async ({ page }, testInfo) => {
    await setup(page, core, testInfo)
    await page.evaluate(() => {
      window.escapedCanvas = window.art.template.$video
      window.escapedPlay = window.escapedCanvas.play
      window.destroyNextDraw = true
    })
    await expect.poll(() => page.evaluate(() => window.destroyedInCallback && window.art.isDestroy)).toBe(true)
    expect(await page.evaluate(() => window.canvasFrames.pending.size)).toBe(0)
    const before = await page.evaluate(() => window.canvasFrames.state.fired)
    await page.evaluate(async () => {
      window.escapedCanvas.src = '/assets/sample/video.mp4'
      await window.escapedPlay()
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    })
    expect(await page.evaluate(() => ({ connected: window.proxyVideo.isConnected, paused: window.proxyVideo.paused, source: window.proxyVideo.getAttribute('src'), pending: window.canvasFrames.pending.size, fired: window.canvasFrames.state.fired, last: window.proxyEvents.at(-1) }))).toEqual({ connected: false, paused: true, source: null, pending: 0, fired: before, last: 'destroy' })
  })
}

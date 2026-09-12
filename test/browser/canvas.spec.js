import { transform } from 'esbuild'
import { hash } from '../../refactor/scripts/releases.mjs'
import { canvasHistorical } from '../helpers/canvas.js'
import { expect, test } from './fixtures.js'

const implementations = await Promise.all((await canvasHistorical()).map(async item => ({ ...item, code: item.format === 'source' ? (await transform(item.source, { format: 'cjs', target: 'es2020' })).code : item.source })))

async function setup(page, core, implementation, testInfo) {
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
    ${implementation.code};
    window.canvasFactory = module.exports.default || module.exports;
    window.canvasFrames = { state, pending, stopAll() { for (const id of pending) window.cancelAnimationFrame(id); pending.clear(); } };
  })();` })
  await page.evaluate(() => {
    window.proxyDraws = 0
    window.proxyEvents = []
    window.proxyErrors = []
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/pattern.mp4',
      muted: true,
      loop: true,
      proxy: window.canvasFactory((context, video) => {
        window.proxyContext = context
        window.proxyVideo = video
        window.proxyDraws++
        if (window.destroyInNextCallback) {
          window.destroyInNextCallback = false
          window.art.destroy(false)
          window.destroyedInCallback = true
        }
      }),
    })
    for (const name of ['video:loadedmetadata', 'video:loadeddata', 'video:canplay', 'video:play', 'video:pause', 'video:seeked', 'artplayerProxyCanvas:draw', 'destroy'])
      window.art.on(name, () => window.proxyEvents.push(name))
    window.art.on('artplayerProxyCanvas:error', error => window.proxyErrors.push({ name: error.name, message: error.message }))
    document.querySelector('#play').onclick = () => window.art.play()
    document.querySelector('#pause').onclick = () => window.art.pause()
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.click('#play')
  await expect.poll(() => page.evaluate(() => window.proxyDraws)).toBeGreaterThan(1)
  await expect.poll(() => page.evaluate(() => window.proxyVideo.currentTime)).toBeGreaterThan(0)
  await testInfo.attach('canvas-historical-inputs', { contentType: 'application/json', body: JSON.stringify({ core, implementation: implementation.name, sha256: hash(implementation.code), nativeBitmapAPI: await page.evaluate(() => typeof createImageBitmap), scope: 'actual archived proxy or frozen workspace, native video/Canvas/bitmap and lexical native RAF observer' }) })
}

test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('canvas-native-pixel-control', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(async () => {
    const video = window.proxyVideo
    const output = window.proxyContext
    if (!video || !output)
      return null
    const pixel = (context, x, y) => [...context.getImageData(x, y, 1, 1).data]
    const probe = document.createElement('canvas')
    probe.width = video.videoWidth || 320
    probe.height = video.videoHeight || 180
    const context = probe.getContext('2d')
    const state = { output: { width: output.canvas.width, height: output.canvas.height, corner: pixel(output, 0, 0), center: pixel(output, Math.floor(output.canvas.width / 2), Math.floor(output.canvas.height / 2)) } }
    try {
      context.drawImage(video, 0, 0, probe.width, probe.height)
      state.direct = { corner: pixel(context, 0, 0), center: pixel(context, Math.floor(probe.width / 2), Math.floor(probe.height / 2)) }
      if (typeof createImageBitmap === 'function') {
        const bitmap = await createImageBitmap(video)
        try {
          context.clearRect(0, 0, probe.width, probe.height)
          context.drawImage(bitmap, 0, 0, probe.width, probe.height)
          state.bitmap = { width: bitmap.width, height: bitmap.height, corner: pixel(context, 0, 0), center: pixel(context, Math.floor(probe.width / 2), Math.floor(probe.height / 2)) }
        }
        finally { bitmap.close() }
      }
    }
    catch (error) { state.error = { name: error.name, message: error.message } }
    return state
  })) })
  await testInfo.attach('canvas-historical-state', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ version: window.Artplayer?.version, host: window.art?.template.$video.nodeName, source: window.proxyVideo?.currentSrc, width: window.proxyVideo?.videoWidth, currentTime: window.proxyVideo?.currentTime, destroyed: window.art?.isDestroy, frames: window.canvasFrames?.state, pending: window.canvasFrames?.pending.size, draws: window.proxyDraws, errors: window.proxyErrors, events: window.proxyEvents }))) })
  await page.evaluate(() => {
    window.proxyVideo?.pause()
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
    window.canvasFrames?.stopAll()
  })
})

for (const core of ['published', 'candidate']) {
  for (const implementation of implementations) {
    const label = `${core} / ${implementation.name}`
    test(`${label}: native proxy control flow and detached-video pixel boundary`, async ({ page, browserName }, testInfo) => {
      await setup(page, core, implementation, testInfo)
      expect(await page.evaluate(() => window.art.template.$video.nodeName)).toBe('CANVAS')
      await expect.poll(() => page.evaluate(() => window.proxyEvents.includes('video:canplay'))).toBe(true)
      const readiness = await page.evaluate(() => ['video:loadedmetadata', 'video:loadeddata', 'video:canplay'].map(name => window.proxyEvents.indexOf(name)))
      expect(readiness[0]).toBeGreaterThanOrEqual(0)
      expect(readiness[1]).toBeGreaterThan(readiness[0])
      expect(readiness[2]).toBeGreaterThan(readiness[1])
      if (browserName === 'webkit') {
        const detached = await page.evaluate(() => ({ connected: window.proxyVideo.isConnected, alpha: window.proxyContext.getImageData(0, 0, 1, 1).data[3], currentTime: window.proxyVideo.currentTime }))
        expect(detached.connected).toBe(false)
        expect(detached.alpha).toBe(0)
        await testInfo.attach('webkit-historical-pixel-failure', { contentType: 'application/json', body: JSON.stringify({ state: detached, scope: 'expected historical transparent output, not successful rendering; independent attached and detached native controls run separately' }) })
      }
      else {
        await expect.poll(() => page.evaluate(() => window.proxyContext.getImageData(0, 0, 1, 1).data[3])).toBe(255)
      }
      await page.click('#pause')
      await expect.poll(() => page.evaluate(() => window.proxyVideo.paused)).toBe(true)
      await page.evaluate(() => window.art.currentTime = 0.5)
      await expect.poll(() => page.evaluate(() => window.proxyEvents.filter(name => name === 'video:seeked').length)).toBeGreaterThan(0)
      await page.evaluate(() => {
        const player = window.art.template.$player
        player.style.width = '320px'
        player.style.height = '480px'
        window.art.emit('resize')
      })
      await expect.poll(() => page.evaluate(() => window.art.template.$video.width)).toBe(320)
      expect(await page.evaluate(() => window.art.template.$video.style.padding)).toBe('150px 0px')
      await page.evaluate(() => window.art.switchUrl('/assets/sample/video.mp4'))
      await page.click('#play')
      await expect.poll(() => page.evaluate(() => window.proxyVideo.currentSrc.endsWith('/assets/sample/video.mp4') && !window.proxyVideo.paused && window.proxyVideo.currentTime > 0)).toBe(true)
      expect(await page.evaluate(() => window.proxyEvents.filter(name => name === 'video:loadedmetadata').length)).toBeGreaterThan(1)
    })

    test(`${label}: historical destroy inside the real draw callback leaves native RAF work running`, async ({ page }, testInfo) => {
      await setup(page, core, implementation, testInfo)
      await page.evaluate(() => window.destroyInNextCallback = true)
      await expect.poll(() => page.evaluate(() => window.destroyedInCallback && window.art.isDestroy)).toBe(true)
      await expect.poll(() => page.evaluate(() => window.canvasFrames.pending.size)).toBeGreaterThan(0)
      const fired = await page.evaluate(() => window.canvasFrames.state.fired)
      await expect.poll(() => page.evaluate(() => window.canvasFrames.state.fired)).toBeGreaterThan(fired)
    })
  }
}

for (const attached of [true, false]) {
  test(`native video pixel control without proxy: attached=${attached}`, async ({ page, browserName }, testInfo) => {
    await page.goto('/test/player.html')
    await page.evaluate(async (attached) => {
      const video = document.createElement('video')
      video.src = '/test/pattern.mp4'
      video.muted = true
      video.loop = true
      if (attached)
        document.body.appendChild(video)
      window.proxyVideo = video
      window.proxyContext = document.createElement('canvas').getContext('2d')
      await video.play()
    }, attached)
    await expect.poll(() => page.evaluate(() => window.proxyVideo.currentTime)).toBeGreaterThan(0)
    await expect.poll(() => page.evaluate(() => {
      window.proxyContext.drawImage(window.proxyVideo, 0, 0, 300, 150)
      return window.proxyContext.getImageData(0, 0, 1, 1).data[3]
    })).toBe(browserName === 'webkit' && !attached ? 0 : 255)
    await testInfo.attach('native-control', { contentType: 'application/json', body: JSON.stringify({ attached, scope: 'native video, direct drawImage, no proxy or bitmap before assertion; detached WebKit transparency is a historical environment observation, not rendering acceptance' }) })
  })
}

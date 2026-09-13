import process from 'node:process'
import { expect, test } from './fixtures.js'

const bitmap = process.env.ARTPLAYER_JASSUB_CONTROL_BITMAP === 'true'
const idleReadback = process.env.ARTPLAYER_JASSUB_CONTROL_IDLE_READBACK === 'true'

for (const host of ['candidate', 'published', 'native']) {
  test(`Native canvas and video control through seek/layout without JASSUB: ${host}`, async ({ page }, testInfo) => {
    if (host === 'native') {
      await page.route('**/test/native-canvas.html', route => route.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><html><head><title>Native canvas control</title></head><body></body></html>',
      }))
      await page.goto('/test/native-canvas.html')
    }
    else {
      await page.goto(`/test/player.html?core=${host}`)
    }
    await page.evaluate(async ({ host, bitmap, idleReadback }) => {
      let video
      if (host === 'native') {
        video = document.createElement('video')
        video.src = '/assets/sample/steve-jobs.mp4'
        video.muted = true
        video.style.width = '640px'
        video.style.height = '360px'
        document.body.append(video)
      }
      else {
        window.createPlayer('/assets/sample/steve-jobs.mp4')
        video = window.art.video
      }
      const canvas = document.createElement('canvas')
      document.body.append(canvas)
      const readback = document.createElement('canvas')
      const probe = window.nativeCanvasProbe = { video, canvas, received: 0, frames: 0, sent: 0, bitmap, idleReadback, reading: false, stages: [], errors: [], pixel: null, offscreen: 'transferControlToOffscreen' in canvas, closed: false }
      const draw = (ctx, canvas, message) => {
        if (canvas.width !== message.width)
          canvas.width = message.width
        if (canvas.height !== message.height)
          canvas.height = message.height
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = message.time < 5 ? 'red' : 'blue'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      if (probe.offscreen) {
        const source = `let canvas, ctx; const draw = ${draw.toString()}; onmessage = async ({data}) => {
          if (data.canvas) { canvas = data.canvas; ctx = canvas.getContext('2d'); return; }
          if (${bitmap}) {
            const pixels = new Uint8ClampedArray(data.width * data.height * 4);
            for (let i = 0; i < pixels.length; i += 4) { pixels[i + (data.time < 5 ? 0 : 2)] = 255; pixels[i + 3] = 255; }
            postMessage({stage: 'bitmap-start', time: data.time, at: performance.now()});
            const image = await createImageBitmap(new ImageData(pixels, data.width, data.height));
            postMessage({stage: 'bitmap-ready', time: data.time, at: performance.now()});
            if (canvas.width !== data.width) canvas.width = data.width;
            if (canvas.height !== data.height) canvas.height = data.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0); image.close();
          } else { draw(ctx, canvas, data); }
          postMessage({stage: 'drawn', time: data.time, at: performance.now()});
        };`
        probe.workerUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }))
        probe.worker = new Worker(probe.workerUrl)
        const transferred = canvas.transferControlToOffscreen()
        probe.worker.postMessage({ canvas: transferred }, [transferred])
        probe.worker.onmessage = ({ data }) => {
          probe.stages.push(data)
          if (data.stage === 'drawn')
            probe.received++
          if (probe.received === probe.sent)
            probe.drain?.()
        }
        probe.worker.onerror = event => probe.errors.push(event.message)
        probe.post = message => probe.worker.postMessage(message)
      }
      else {
        const ctx = canvas.getContext('2d')
        probe.post = (message) => {
          draw(ctx, canvas, message)
          probe.received++
        }
      }
      const render = () => {
        if (probe.closed)
          return
        probe.frames++
        if (!probe.reading) {
          const rect = video.getBoundingClientRect()
          probe.post({ width: Math.round(rect.width), height: Math.round(rect.height), time: video.currentTime })
          probe.sent++
        }
        if (video.requestVideoFrameCallback)
          probe.handle = video.requestVideoFrameCallback(render)
        else
          probe.handle = requestAnimationFrame(render)
      }
      probe.state = () => ({ pixel: probe.pixel, width: canvas.width, height: canvas.height, time: video.currentTime, frames: probe.frames, sent: probe.sent, received: probe.received, quality: video.getVideoPlaybackQuality?.().totalVideoFrames })
      probe.sample = async () => {
        if (idleReadback) {
          probe.reading = true
          if (probe.received < probe.sent)
            await new Promise(resolve => probe.drain = resolve)
        }
        readback.width = canvas.width
        readback.height = canvas.height
        const ctx = readback.getContext('2d')
        ctx.drawImage(canvas, 0, 0)
        probe.pixel = [...ctx.getImageData(0, 0, 1, 1).data]
        probe.reading = false
        return probe.state()
      }
      await video.play()
      render()
    }, { host, bitmap, idleReadback })
    try {
      await expect.poll(async () => (await page.evaluate(() => window.nativeCanvasProbe.sample())).pixel).toEqual([255, 0, 0, 255])
      const before = await page.evaluate(() => window.nativeCanvasProbe.sample())
      await page.evaluate(async () => {
        const video = window.nativeCanvasProbe.video
        video.pause()
        const seeked = new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }))
        video.currentTime = 10
        await seeked
        await video.play()
      })
      await expect.poll(async () => (await page.evaluate(() => window.nativeCanvasProbe.sample())).pixel).toEqual([0, 0, 255, 255])
      await page.evaluate((host) => {
        if (host === 'native') {
          Object.assign(window.nativeCanvasProbe.video.style, { position: 'fixed', inset: '0', width: '100vw', height: '100vh' })
        }
        else {
          window.art.fullscreenWeb = true
        }
      }, host)
      await expect.poll(async () => (await page.evaluate(() => window.nativeCanvasProbe.sample())).width).toBeGreaterThan(before.width)
      await expect.poll(async () => (await page.evaluate(() => window.nativeCanvasProbe.sample())).time).toBeGreaterThan(10.2)
      await expect.poll(async () => (await page.evaluate(() => window.nativeCanvasProbe.sample())).pixel).toEqual([0, 0, 255, 255])
    }
    finally {
      const evidence = await page.evaluate(() => {
        const probe = window.nativeCanvasProbe
        const state = { offscreen: probe.offscreen, bitmap: probe.bitmap, idleReadback: probe.idleReadback, stages: probe.stages, errors: probe.errors, coreLoaded: typeof window.Artplayer !== 'undefined', ...probe.state() }
        probe.closed = true
        if (probe.video.cancelVideoFrameCallback)
          probe.video.cancelVideoFrameCallback(probe.handle)
        else
          cancelAnimationFrame(probe.handle)
        probe.video.pause()
        probe.worker?.terminate()
        if (probe.workerUrl)
          URL.revokeObjectURL(probe.workerUrl)
        probe.canvas.remove()
        if (window.art)
          window.art.destroy(false)
        else
          probe.video.remove()
        return state
      })
      await testInfo.attach('native-canvas-control', { body: JSON.stringify({ host, evidence, limitation: 'Native video/frame callbacks and a minimal Worker painting opaque colors. Bitmap mode uses createImageBitmap/drawImage/close; otherwise fillRect. JASSUB wrapper, WASM and fonts are absent. The native host loads no ArtPlayer scripts. Capability fallback without transfer is main-thread fillRect, not offscreen or ImageBitmap verification.' }), contentType: 'application/json' })
    }
  })
}

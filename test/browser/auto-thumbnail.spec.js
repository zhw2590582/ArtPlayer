import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { autoThumbnailHistorical } from '../helpers/auto-thumbnail.js'
import { expect, test } from './fixtures.js'

const implementations = (await autoThumbnailHistorical()).filter(item => ['published-1.0.1-main', 'published-1.1.0-main', 'frozen-workspace-js'].includes(item.name))

for (const implementation of implementations) {
  test(`Auto-thumbnail ${implementation.name}: native JPEG callbacks outlive destroy and can restore the blank sheet`, async ({ page, browserName }, testInfo) => {
    await page.goto('/test/player.html?core=published')
    await page.setContent('<!doctype html><div id="probe"></div>')
    await page.addScriptTag({ content: implementation.code })
    await page.evaluate(async () => {
      const createElement = document.createElement.bind(document)
      const createUrl = URL.createObjectURL.bind(URL)
      const revokeUrl = URL.revokeObjectURL.bind(URL)
      const toBlob = HTMLCanvasElement.prototype.toBlob
      const probe = window.probe = { videos: [], canvases: [], encodes: [], updates: [], urls: new Map(), revoked: [], seeks: [], destroyed: false }
      document.createElement = function (name, ...args) {
        const element = createElement(name, ...args)
        if (name === 'video') {
          probe.videos.push(element)
          element.addEventListener('seeked', () => probe.seeks.push(element.currentTime))
        }
        if (name === 'canvas')
          probe.canvases.push(element)
        return element
      }
      HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
        const index = probe.encodes.length
        const record = { index, blob: null, callback, type, width: this.width, height: this.height }
        probe.encodes.push(record)
        return toBlob.call(this, blob => record.blob = blob, type, quality)
      }
      URL.createObjectURL = (blob) => {
        const url = createUrl(blob)
        probe.urls.set(url, blob)
        return url
      }
      URL.revokeObjectURL = (url) => {
        probe.revoked.push(url)
        probe.urls.delete(url)
        revokeUrl(url)
      }
      const listeners = new Map()
      const art = {
        option: { url: '/test/pattern.mp4' },
        on(name, callback) {
          if (!listeners.has(name))
            listeners.set(name, new Set())
          listeners.get(name).add(callback)
        },
        emit(name) {
          for (const callback of listeners.get(name) || []) callback()
        },
        get thumbnails() { return probe.updates.at(-1) },
        set thumbnails(value) { probe.updates.push({ ...value, afterDestroy: probe.destroyed }) },
      }
      probe.art = art
      probe.nativeToBlob = toBlob
      probe.restore = () => {
        document.createElement = createElement
        HTMLCanvasElement.prototype.toBlob = toBlob
        URL.createObjectURL = createUrl
        URL.revokeObjectURL = revokeUrl
      }
      probe.result = await window.artplayerPluginAutoThumbnail({ width: 80, number: 4 })(art)
      art.emit('video:loadedmetadata')
    })
    await expect.poll(() => page.evaluate(() => window.probe.encodes.filter(item => item.blob).length)).toBe(5)
    const evidence = await page.evaluate(async () => {
      const probe = window.probe
      async function pixels(blob) {
        const image = document.createElement('img')
        const url = URL.createObjectURL(blob)
        image.src = url
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0)
        const samples = Array.from({ length: 4 }, (_, index) => [...ctx.getImageData(40 + index * 80, 22, 1, 1).data])
        URL.revokeObjectURL(url)
        return { width: canvas.width, height: canvas.height, pixel: samples[0], samples, type: blob.type }
      }
      const blanks = await pixels(probe.encodes[0].blob)
      const final = await pixels(probe.encodes[4].blob)
      const controlVideo = document.createElement('video')
      controlVideo.crossOrigin = 'anonymous'
      controlVideo.muted = true
      document.body.append(controlVideo)
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Native control did not load')), 5000)
        controlVideo.onloadeddata = () => {
          clearTimeout(timeout)
          resolve()
        }
        controlVideo.onerror = () => {
          clearTimeout(timeout)
          reject(new Error(`Native control media error ${controlVideo.error?.code}`))
        }
        controlVideo.src = '/test/pattern.mp4'
      })
      await controlVideo.play()
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Native control playback did not advance')), 5000)
        const check = () => {
          if (controlVideo.currentTime >= 0.25) {
            clearTimeout(timeout)
            resolve()
          }
          else {
            requestAnimationFrame(check)
          }
        }
        check()
      })
      controlVideo.pause()
      const controlCanvas = document.createElement('canvas')
      controlCanvas.width = 800
      controlCanvas.height = 45
      const controlContext = controlCanvas.getContext('2d')
      controlContext.drawImage(controlVideo, 0, 0, 80, 45)
      const rawPixel = [...controlContext.getImageData(40, 22, 1, 1).data]
      const controlBlob = await new Promise(resolve => probe.nativeToBlob.call(controlCanvas, resolve, 'image/jpeg'))
      const native = { readyState: controlVideo.readyState, currentTime: controlVideo.currentTime, rawPixel, ...await pixels(controlBlob) }
      controlContext.fillStyle = 'red'
      controlContext.fillRect(0, 0, 80, 45)
      const staticBlob = await new Promise(resolve => probe.nativeToBlob.call(controlCanvas, resolve, 'image/jpeg'))
      const staticControl = await pixels(staticBlob)
      probe.encodes[4].callback(probe.encodes[4].blob)
      const good = probe.updates.at(-1).url
      probe.destroyed = true
      probe.art.emit('destroy')
      const outstandingAfterDestroy = probe.urls.size
      probe.encodes[0].callback(probe.encodes[0].blob)
      const bad = probe.updates.at(-1).url
      const result = {
        blanks,
        final,
        native,
        staticControl,
        seeks: probe.seeks,
        updates: probe.updates.map(({ url, ...rest }) => rest),
        outstandingAfterDestroy,
        goodRevoked: !probe.urls.has(good),
        staleUrlLive: probe.urls.has(bad),
        result: probe.result,
        videoState: { src: probe.videos[0].getAttribute('src'), readyState: probe.videos[0].readyState, width: probe.videos[0].videoWidth, seekHandler: typeof probe.videos[0].onseeked, metadataHandler: typeof probe.videos[0].onloadedmetadata },
      }
      // The test owns the cleanup because the historical plugin does not.
      for (const video of probe.videos) {
        video.pause()
        video.removeAttribute('src')
        video.load()
        video.remove()
      }
      for (const url of [...probe.urls.keys()]) URL.revokeObjectURL(url)
      probe.restore()
      return result
    })
    await testInfo.attach('auto-thumbnail-native-historical', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), scope: 'Native HTTP video, seeking and JPEG pixels with controlled delivery of native toBlob results; player-facing host is a stub, not a core integration result.', ...evidence }) })
    expect(evidence.result).toEqual({ name: 'artplayerPluginAutoThumbnail' })
    expect(evidence.blanks.type).toBe('image/jpeg')
    expect(evidence.final.width).toBe(800)
    expect(evidence.final.height).toBe(45)
    expect(evidence.blanks.pixel.slice(0, 3).every(value => value < 5)).toBe(true)
    expect(evidence.staticControl.pixel[0]).toBeGreaterThan(240)
    expect(evidence.staticControl.pixel[1]).toBeLessThan(10)
    expect(evidence.staticControl.pixel[2]).toBeLessThan(10)
    expect(evidence.native.currentTime).toBeGreaterThanOrEqual(0.25)
    expect(evidence.native.rawPixel.slice(0, 3).some(value => value > 30)).toBe(true)
    expect(evidence.native.pixel.slice(0, 3).some(value => value > 30)).toBe(true)
    const blackSamples = evidence.final.samples.every(pixel => pixel.slice(0, 3).every(value => value < 5))
    if (browserName === 'webkit' && process.platform === 'win32')
      expect(blackSamples).toBe(true)
    if (blackSamples) {
      expect(browserName).toBe('webkit')
      testInfo.annotations.push({ type: 'historical-media-defect', description: 'Historical plugin JPEG samples are black, while independent played HTTP video and static red canvas yield colored JPEGs. This is an extraction-path defect, not a waived browser capability.' })
    }
    else {
      expect(evidence.final.samples.every(pixel => pixel.slice(0, 3).some(value => value > 30))).toBe(true)
    }
    expect(evidence.seeks).toHaveLength(4)
    expect(evidence.outstandingAfterDestroy).toBe(1)
    expect(evidence.updates.map(item => item.afterDestroy)).toEqual([false, true])
    expect(evidence.goodRevoked).toBe(true)
    expect(evidence.staleUrlLive).toBe(true)
    expect(evidence.videoState.src).toBe('/test/pattern.mp4')
    expect(evidence.videoState.width).toBeGreaterThan(0)
    expect(evidence.videoState.seekHandler).toBe('function')
    expect(evidence.videoState.metadataHandler).toBe('function')
  })
}

import { hash } from '../../refactor/scripts/releases.mjs'
import { autoThumbnailCandidate } from '../helpers/auto-thumbnail.js'
import { expect, test } from './fixtures.js'

const implementation = await autoThumbnailCandidate()
for (const scenario of ['timeout', 'destroy', 'restart']) {
  test(`Auto-thumbnail candidate native pending metadata releases on ${scenario}`, async ({ page, request }, testInfo) => {
    await page.goto('/test/player.html?core=published')
    await page.setContent('<!doctype html><div></div>')
    const caseId = `${testInfo.testId}-${testInfo.retry}`
    await page.addScriptTag({ content: implementation.code })
    await page.evaluate(async (caseId) => {
      const schedule = window.setTimeout
      const clear = window.clearTimeout
      const warn = console.warn
      const probe = window.metadataProbe = { timers: new Map(), warnings: [], updates: [], listeners: new Map() }
      window.setTimeout = (callback, delay, ...args) => {
        const id = schedule(callback, delay, ...args)
        if (delay === 30000)
          probe.timers.set(id, callback)
        return id
      }
      window.clearTimeout = (id) => {
        probe.timers.delete(id)
        clear(id)
      }
      console.warn = (...args) => probe.warnings.push(args.map(String))
      probe.restore = () => {
        window.setTimeout = schedule
        window.clearTimeout = clear
        console.warn = warn
      }
      probe.art = {
        option: { url: `/test/pending-thumbnail-metadata.mp4?case=${encodeURIComponent(caseId)}` },
        on(name, callback) { probe.listeners.set(name, callback) },
        off(name) { probe.listeners.delete(name) },
        get thumbnails() { return probe.updates.at(-1) },
        set thumbnails(value) { probe.updates.push(value) },
      }
      probe.result = await window.artplayerPluginAutoThumbnail({ width: 80, number: 1 })(probe.art)
      probe.listeners.get('video:loadedmetadata')()
      probe.video = document.querySelector('video')
    }, caseId)
    const requestLog = `/test/requests.json?case=${encodeURIComponent(caseId)}`
    await expect.poll(async () => (await (await request.get(requestLog)).json()).length).toBeGreaterThan(0)
    const mediaRequests = await (await request.get(requestLog)).json()
    const evidence = await page.evaluate((scenario) => {
      const probe = window.metadataProbe
      const video = probe.video
      const before = { connected: video.isConnected, readyState: video.readyState, source: video.getAttribute('src'), timers: probe.timers.size }
      const deadline = [...probe.timers.values()][0]
      if (scenario === 'timeout')
        deadline?.()
      else probe.listeners.get(scenario)()
      const after = { connected: video.isConnected, readyState: video.readyState, source: video.getAttribute('src'), metadataHandler: video.onloadedmetadata, errorHandler: video.onerror, timers: probe.timers.size, canvases: document.querySelectorAll('canvas').length }
      deadline?.()
      probe.listeners.get('destroy')?.()
      probe.restore()
      return { before, after, result: probe.result, warnings: probe.warnings, updates: probe.updates.length }
    }, scenario)
    await testInfo.attach('auto-thumbnail-metadata-deadline', { contentType: 'application/json', body: JSON.stringify({ provenance: implementation.provenance, sha256: hash(implementation.code), scenario, mediaRequests, virtualDeadline: true, ...evidence }) })
    expect(evidence.result).toEqual({ name: 'artplayerPluginAutoThumbnail' })
    expect(evidence.before).toMatchObject({ connected: true, readyState: 0, timers: 1 })
    expect(evidence.before.source).toContain('pending-thumbnail-metadata.mp4')
    expect(evidence.after).toEqual({ connected: false, readyState: 0, source: null, metadataHandler: null, errorHandler: null, timers: 0, canvases: 0 })
    expect(evidence.updates).toBe(0)
    expect(evidence.warnings).toHaveLength(scenario === 'timeout' ? 1 : 0)
    if (scenario === 'timeout')
      expect(evidence.warnings[0].join(' ')).toContain('metadata timed out')
  })
}

for (const variant of ['destroy', 'restart', 'complete', 'frame-destroy', 'frame-restart', 'alias-complete', 'encoding-timeout']) {
  const useDefault = variant === 'alias-complete'
  const scenario = useDefault ? 'complete' : variant
  test(`Auto-thumbnail candidate native ${variant} owns decoder and encoded URLs`, async ({ page }, testInfo) => {
    await page.goto('/test/player.html?core=published')
    await page.setContent('<!doctype html><div></div>')
    await page.addScriptTag({ content: implementation.code })
    await page.evaluate(async ({ scenario, useDefault }) => {
      const probe = window.probe = { videos: [], canvases: [], updates: [], urls: new Set(), blobs: [], frames: [], timers: new Map(), warnings: [], frameSupport: false, listeners: new Map(), hold: scenario !== 'complete' }
      const createElement = document.createElement.bind(document)
      const createUrl = URL.createObjectURL.bind(URL)
      const revokeUrl = URL.revokeObjectURL.bind(URL)
      const toBlob = HTMLCanvasElement.prototype.toBlob
      const schedule = window.setTimeout
      const clear = window.clearTimeout
      const warn = console.warn
      window.setTimeout = (callback, delay, ...args) => {
        const id = schedule(callback, delay, ...args)
        if (delay === 30000)
          probe.timers.set(id, { callback, delay })
        return id
      }
      window.clearTimeout = (id) => {
        probe.timers.delete(id)
        clear(id)
      }
      console.warn = (...args) => probe.warnings.push(args.map(String))
      document.createElement = function (name, ...args) {
        const element = createElement(name, ...args)
        if (name === 'canvas')
          probe.canvases.push(element)
        if (name === 'video') {
          probe.videos.push(element)
          const request = element.requestVideoFrameCallback?.bind(element)
          probe.frameSupport = Boolean(request && element.cancelVideoFrameCallback)
          if (probe.frameSupport && scenario.startsWith('frame-')) {
            element.requestVideoFrameCallback = callback => request((...args) => {
              probe.frames.push({ callback, args })
            })
          }
        }
        return element
      }
      HTMLCanvasElement.prototype.toBlob = function (callback, type) {
        probe.encodingDeadline = [...probe.timers.values()][0]
        return toBlob.call(this, (blob) => {
          const record = { blob, callback }
          probe.blobs.push(record)
          if (!probe.hold)
            callback(blob)
        }, type)
      }
      URL.createObjectURL = (blob) => {
        const url = createUrl(blob)
        probe.urls.add(url)
        return url
      }
      URL.revokeObjectURL = (url) => {
        probe.urls.delete(url)
        revokeUrl(url)
      }
      probe.restore = () => {
        document.createElement = createElement
        HTMLCanvasElement.prototype.toBlob = toBlob
        URL.createObjectURL = createUrl
        URL.revokeObjectURL = revokeUrl
        window.setTimeout = schedule
        window.clearTimeout = clear
        console.warn = warn
      }
      probe.art = {
        option: { url: '/test/pattern.mp4' },
        on(name, callback) {
          if (!probe.listeners.has(name))
            probe.listeners.set(name, new Set())
          probe.listeners.get(name).add(callback)
          return this
        },
        off(name, callback) {
          probe.listeners.get(name)?.delete(callback)
          return this
        },
        emit(name) {
          for (const callback of [...(probe.listeners.get(name) || [])]) callback()
        },
        get thumbnails() { return probe.updates.at(-1) },
        set thumbnails(value) { probe.updates.push(value) },
      }
      const factory = window.artplayerPluginAutoThumbnail
      if (useDefault && factory.default !== factory)
        throw new Error('The default alias must be the original factory')
      probe.result = await (useDefault ? factory.default : factory)({ width: 80, number: 2 })(probe.art)
      probe.art.emit('video:loadedmetadata')
    }, { scenario, useDefault })
    const holdFrame = scenario.startsWith('frame-') && await page.evaluate(() => window.probe.frameSupport)
    await expect.poll(() => page.evaluate(holdFrame => holdFrame ? window.probe.frames.length : window.probe.blobs.length, holdFrame)).toBe(scenario === 'complete' ? 2 : 1)
    const state = await page.evaluate(async (scenario) => {
      const probe = window.probe
      const before = { urls: probe.urls.size, updates: probe.updates.length }
      if (scenario !== 'complete') {
        if (scenario === 'encoding-timeout') {
          if (!probe.encodingDeadline || probe.encodingDeadline.delay !== 30000)
            throw new Error('No owned encoding deadline')
          probe.encodingDeadline.callback()
        }
        else {
          probe.art.emit(scenario.replace('frame-', ''))
        }
        if (probe.blobs[0]) {
          probe.blobs[0].callback(probe.blobs[0].blob)
          probe.blobs[0].callback(probe.blobs[0].blob)
        }
        if (probe.frames[0]) {
          probe.frames[0].callback(...probe.frames[0].args)
          probe.frames[0].callback(...probe.frames[0].args)
        }
      }
      const after = { urls: probe.urls.size, updates: probe.updates.length }
      const decoder = probe.videos[0]
      const video = { connected: decoder.isConnected, src: decoder.getAttribute('src'), readyState: decoder.readyState, paused: decoder.paused, handlers: ['onloadedmetadata', 'onloadeddata', 'onseeked', 'onerror'].map(key => decoder[key] === null) }
      const canvasDimensions = probe.canvases.map(canvas => [canvas.width, canvas.height])
      let publishedImage = null
      if (scenario === 'complete') {
        const image = new Image()
        image.src = probe.updates.at(-1).url
        await image.decode()
        publishedImage = { width: image.naturalWidth, height: image.naturalHeight }
      }
      probe.art.emit('destroy')
      probe.art.emit('destroy')
      const final = { urls: probe.urls.size, listeners: [...probe.listeners.values()].reduce((sum, set) => sum + set.size, 0), updates: probe.updates.length }
      const blobs = probe.blobs.map(({ blob }) => ({ type: blob.type, bytes: blob.size }))
      probe.restore()
      return { before, after, video, canvasDimensions, publishedImage, final, blobs, pendingDeadlines: probe.timers.size, warnings: probe.warnings, heldFrames: probe.frames.length, frameSupport: probe.frameSupport, result: probe.result }
    }, scenario)
    await testInfo.attach('auto-thumbnail-candidate-native-lifecycle', { contentType: 'application/json', body: JSON.stringify({ scenario, useDefault, sha256: hash(implementation.code), provenance: implementation.provenance, scope: 'Actual HTTP decoding/seek/JPEG and held native presentation callback lifecycle with a stub player host. Frame scenarios use a held Blob fallback only when native frame callbacks are absent. Pixel acceptance is separate; AUTO-THUMB-PIXEL-01 remains open.', ...state }) })
    expect(state.result).toEqual({ name: 'artplayerPluginAutoThumbnail' })
    expect(state.pendingDeadlines).toBe(0)
    if (scenario === 'encoding-timeout') {
      expect(state.warnings).toHaveLength(1)
      expect(state.warnings[0][1]).toContain('encoding timed out')
    }
    else {
      expect(state.warnings).toEqual([])
    }
    expect(state.before).toEqual(scenario === 'complete' ? { urls: 1, updates: 2 } : { urls: 0, updates: 0 })
    expect(state.after).toEqual(state.before)
    expect(state.video).toEqual({ connected: false, src: null, readyState: 0, paused: true, handlers: [true, true, true, true] })
    expect(state.canvasDimensions).toEqual([[0, 0]])
    expect(state.publishedImage).toEqual(scenario === 'complete' ? { width: 800, height: 45 } : null)
    expect(state.final).toEqual({ urls: 0, listeners: 0, updates: scenario === 'complete' ? 2 : 0 })
    expect(state.blobs.every(blob => blob.type === 'image/jpeg' && blob.bytes > 0)).toBe(true)
    expect(state.heldFrames).toBe(holdFrame ? 1 : 0)
    expect(state.blobs).toHaveLength(holdFrame ? 0 : scenario === 'complete' ? 2 : 1)
  })
}

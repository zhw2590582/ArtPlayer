import { hash } from '../../refactor/scripts/releases.mjs'
import { autoThumbnailCandidate } from '../helpers/auto-thumbnail.js'
import { expect, test } from './fixtures.js'

const implementation = await autoThumbnailCandidate()
for (const scenario of ['destroy', 'restart', 'complete']) {
  test(`Auto-thumbnail candidate native ${scenario} owns decoder and encoded URLs`, async ({ page }, testInfo) => {
    await page.goto('/test/player.html?core=published')
    await page.setContent('<!doctype html><div></div>')
    await page.addScriptTag({ content: implementation.code })
    await page.evaluate(async (hold) => {
      const probe = window.probe = { videos: [], updates: [], urls: new Set(), blobs: [], listeners: new Map(), hold }
      const createElement = document.createElement.bind(document)
      const createUrl = URL.createObjectURL.bind(URL)
      const revokeUrl = URL.revokeObjectURL.bind(URL)
      const toBlob = HTMLCanvasElement.prototype.toBlob
      document.createElement = function (name, ...args) {
        const element = createElement(name, ...args)
        if (name === 'video')
          probe.videos.push(element)
        return element
      }
      HTMLCanvasElement.prototype.toBlob = function (callback, type) {
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
      probe.result = await window.artplayerPluginAutoThumbnail({ width: 80, number: 2 })(probe.art)
      probe.art.emit('video:loadedmetadata')
    }, scenario !== 'complete')
    await expect.poll(() => page.evaluate(() => window.probe.blobs.length)).toBe(scenario === 'complete' ? 2 : 1)
    const state = await page.evaluate((scenario) => {
      const probe = window.probe
      const before = { urls: probe.urls.size, updates: probe.updates.length }
      if (scenario !== 'complete') {
        probe.art.emit(scenario)
        probe.blobs[0].callback(probe.blobs[0].blob)
        probe.blobs[0].callback(probe.blobs[0].blob)
      }
      const after = { urls: probe.urls.size, updates: probe.updates.length }
      const decoder = probe.videos[0]
      const video = { connected: decoder.isConnected, src: decoder.getAttribute('src'), readyState: decoder.readyState, paused: decoder.paused, handlers: ['onloadedmetadata', 'onseeked', 'onerror'].map(key => decoder[key] === null) }
      probe.art.emit('destroy')
      probe.art.emit('destroy')
      const final = { urls: probe.urls.size, listeners: [...probe.listeners.values()].reduce((sum, set) => sum + set.size, 0), updates: probe.updates.length }
      const blobs = probe.blobs.map(({ blob }) => ({ type: blob.type, bytes: blob.size }))
      probe.restore()
      return { before, after, video, final, blobs, result: probe.result }
    }, scenario)
    await testInfo.attach('auto-thumbnail-candidate-native-lifecycle', { contentType: 'application/json', body: JSON.stringify({ scenario, sha256: hash(implementation.code), scope: 'Actual HTTP decoding/seek/JPEG lifecycle with a stub player host. This checkpoint does not establish accurate extracted pixels; AUTO-THUMB-PIXEL-01 remains open.', ...state }) })
    expect(state.result).toEqual({ name: 'artplayerPluginAutoThumbnail' })
    expect(state.before).toEqual(scenario === 'complete' ? { urls: 1, updates: 2 } : { urls: 0, updates: 0 })
    expect(state.after).toEqual(state.before)
    expect(state.video).toEqual({ connected: false, src: null, readyState: 0, paused: true, handlers: [true, true, true] })
    expect(state.final).toEqual({ urls: 0, listeners: 0, updates: scenario === 'complete' ? 2 : 0 })
    expect(state.blobs.every(blob => blob.type === 'image/jpeg' && blob.bytes > 0)).toBe(true)
  })
}

import { hash } from '../../refactor/scripts/releases.mjs'
import { autoThumbnailCandidate } from '../helpers/auto-thumbnail.js'
import { expect, test } from './fixtures.js'

const implementation = await autoThumbnailCandidate()

for (const media of ['auto-thumbnail-timeline', 'pattern']) {
  test(`Auto-thumbnail candidate verifies presented ${media} pixels and records fallback limits`, async ({ page, browserName }, testInfo) => {
    await page.goto('/test/player.html?core=published')
    await page.setContent('<!doctype html><style>video { width: 1px; height: 1px; max-width: 1px; max-height: 1px; display: none }</style>')
    await page.addScriptTag({ content: implementation.code })
    await page.evaluate(async (media) => {
      const createElement = document.createElement.bind(document)
      const drawImage = CanvasRenderingContext2D.prototype.drawImage
      const probe = window.probe = { videos: [], updates: [], draws: [], presented: [], playing: 0, warnings: [] }
      const warn = console.warn
      console.warn = (...args) => probe.warnings.push(args.map(String))
      document.createElement = function (tag, ...args) {
        const element = createElement(tag, ...args)
        if (tag === 'video') {
          probe.videos.push(element)
          element.addEventListener('playing', () => probe.playing++)
          const request = element.requestVideoFrameCallback?.bind(element)
          if (request) {
            element.requestVideoFrameCallback = callback => request((now, metadata) => {
              probe.presented.push({ mediaTime: metadata.mediaTime, currentTime: element.currentTime })
              callback(now, metadata)
            })
          }
        }
        return element
      }
      CanvasRenderingContext2D.prototype.drawImage = function (source, ...args) {
        const result = drawImage.call(this, source, ...args)
        if (source instanceof HTMLVideoElement) {
          const [x, y, width, height] = args
          const style = getComputedStyle(source)
          const box = source.getBoundingClientRect()
          probe.draws.push({
            time: source.currentTime,
            duration: source.duration,
            connected: source.isConnected,
            visibility: style.visibility,
            display: style.display,
            width: box.width,
            height: box.height,
            raw: [...this.getImageData(x + Math.floor(width / 2), y + Math.floor(height / 2), 1, 1).data],
          })
        }
        return result
      }
      const listeners = new Map()
      probe.art = {
        option: { url: `/test/${media}.mp4` },
        on(name, callback) {
          if (!listeners.has(name))
            listeners.set(name, new Set())
          listeners.get(name).add(callback)
        },
        off(name, callback) { listeners.get(name)?.delete(callback) },
        emit(name) { for (const callback of [...(listeners.get(name) || [])]) callback() },
        get thumbnails() { return probe.updates.at(-1) },
        set thumbnails(value) { probe.updates.push(value) },
      }
      probe.restore = () => {
        document.createElement = createElement
        CanvasRenderingContext2D.prototype.drawImage = drawImage
        console.warn = warn
      }
      await window.artplayerPluginAutoThumbnail({ width: 80, number: 5 })(probe.art)
      probe.art.emit('video:loadedmetadata')
    }, media)
    await expect.poll(() => page.evaluate(() => window.probe.updates.length)).toBe(5)
    const state = await page.evaluate(async () => {
      const probe = window.probe
      const image = document.createElement('img')
      image.src = probe.updates.at(-1).url
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0)
      const cells = Array.from({ length: 5 }, (_, index) => [...ctx.getImageData(index * 80 + 40, 22, 1, 1).data])
      const spatial = [10, 20, 40, 60, 70].map(x => [...ctx.getImageData(160 + x, 22, 1, 1).data])
      const final = probe.videos.map(video => ({ connected: video.isConnected, src: video.getAttribute('src'), paused: video.paused }))
      probe.art.emit('destroy')
      probe.restore()
      const supportsPresentation = typeof probe.videos[0].requestVideoFrameCallback === 'function' && typeof probe.videos[0].cancelVideoFrameCallback === 'function'
      return { cells, spatial, draws: probe.draws, presented: probe.presented, supportsPresentation, final, playing: probe.playing, warnings: probe.warnings }
    })
    await testInfo.attach('auto-thumbnail-candidate-hidden-pixels', { contentType: 'application/json', body: JSON.stringify({
      sha256: hash(implementation.code),
      media,
      scope: 'All five cells are asserted where native frame presentation callbacks are available. Without that capability only cells 2-4 are asserted, with cells 0-1 recorded as unresolved diagnostics under AUTO-THUMB-PIXEL-01. Native HTTP/JPEG and a stub player host, not a core integration.',
      ...state,
    }) })
    if (!state.supportsPresentation)
      testInfo.annotations.push({ type: 'remaining-initial-frame-risk', description: `${browserName}: no native presentation callback; cells 0-1 remain evidence only and cannot close AUTO-THUMB-PIXEL-01 or PKG-AUTO-THUMB-03.` })
    expect(state.warnings).toEqual([])
    expect(state.playing).toBe(0)
    expect(state.final).toEqual([{ connected: false, src: null, paused: true }])
    expect(state.draws).toHaveLength(5)
    for (const [index, draw] of state.draws.entries()) {
      expect(draw.connected).toBe(true)
      expect(draw.visibility).toBe('hidden')
      expect(draw.display).toBe('block')
      expect(draw.width).toBeGreaterThanOrEqual(80)
      expect(draw.height).toBeGreaterThanOrEqual(45)
      if (state.supportsPresentation || index > 1) {
        expect(Math.abs(draw.time - draw.duration * index / 5)).toBeLessThan(0.05)
        expect(draw.raw[3]).toBe(255)
      }
    }
    if (state.supportsPresentation) {
      expect(state.presented).toHaveLength(5)
      for (const [index, frame] of state.presented.entries())
        expect(Math.abs(frame.mediaTime - state.draws[index].duration * index / 5)).toBeLessThan(0.06)
    }
    if (media === 'auto-thumbnail-timeline') {
      if (state.supportsPresentation) {
        const [purple, red] = state.cells
        expect(Math.min(purple[0], purple[2])).toBeGreaterThan(100)
        expect(Math.abs(purple[0] - purple[2])).toBeLessThan(30)
        expect(purple[1]).toBeLessThan(40)
        expect(red[0]).toBeGreaterThan(200)
        expect(Math.max(red[1], red[2])).toBeLessThan(40)
      }
      const [black, blue, yellow] = state.cells.slice(2)
      expect(Math.max(...black.slice(0, 3))).toBeLessThan(30)
      expect(blue[2]).toBeGreaterThan(200)
      expect(Math.max(blue[0], blue[1])).toBeLessThan(40)
      expect(Math.min(yellow[0], yellow[1])).toBeGreaterThan(200)
      expect(yellow[2]).toBeLessThan(40)
    }
    else {
      for (const pixel of state.cells.slice(state.supportsPresentation ? 0 : 2, 4)) {
        expect(pixel[2] - Math.max(pixel[0], pixel[1])).toBeGreaterThan(80)
      }
      expect(state.cells[4][0] - Math.max(state.cells[4][1], state.cells[4][2])).toBeGreaterThan(80)
      expect(new Set(state.spatial.map(pixel => pixel.slice(0, 3).join(','))).size).toBeGreaterThan(2)
    }
  })
}

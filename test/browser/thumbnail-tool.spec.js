import { Buffer } from 'node:buffer'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { hash } from '../../refactor/scripts/releases.mjs'
import { thumbnailHistorical } from '../helpers/thumbnail.js'
import { expect, test } from './fixtures.js'

const sample = fileURLToPath(new URL('./media/thumbnail-pattern.mp4', import.meta.url))

async function capabilityControl(page, testInfo) {
  const native = await page.evaluate(() => window.thumbnailNative)
  if (native.blob === 'loaded')
    return false
  expect(testInfo.project.name).toBe('webkit')
  expect(native).toEqual({ http: 'loaded', blob: 'error', error: 4 })
  await page.locator('#input').setInputFiles(sample)
  await expect.poll(() => page.evaluate(() => tool.video.error?.code || 0)).toBe(4)
  const state = await page.evaluate(() => {
    const state = { errors: observed.filter(item => item.event === 'error').length, processing: tool.processing, duration: Number.isNaN(tool.video.duration) ? null : tool.video.duration }
    tool.destroy()
    return state
  })
  expect(state).toEqual({ errors: 0, processing: false, duration: null })
  testInfo.annotations.push({ type: 'capability-control', description: 'Native HTTP succeeds but native Blob and tool Blob return media error 4. Extraction scenario unavailable; no successful extraction claimed.' })
  await testInfo.attach('thumbnail-blob-unavailable', { contentType: 'application/json', body: JSON.stringify({ native, tool: state }) })
  return true
}

for (const implementation of thumbnailHistorical()) {
  test.describe(`Thumbnail tool ${implementation.name}`, () => {
    test.beforeEach(async ({ page }, testInfo) => {
      await page.goto('/test/player.html?core=published')
      await page.setContent('<!doctype html><input id="input" type="file"><div id="wrapper"></div>')
      await page.addScriptTag({ content: implementation.code })
      await page.evaluate(async () => {
        const blob = await (await fetch('/test/thumbnail-pattern.mp4')).blob()
        const blobUrl = URL.createObjectURL(blob)
        window.thumbnailNative = {}
        for (const [kind, src] of [['http', '/test/thumbnail-pattern.mp4'], ['blob', blobUrl]]) {
          const video = document.createElement('video')
          video.muted = true
          document.body.append(video)
          window.thumbnailNative[kind] = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Native media control did not settle')), 5000)
            video.onloadeddata = () => {
              clearTimeout(timeout)
              resolve('loaded')
            }
            video.onerror = () => {
              clearTimeout(timeout)
              window.thumbnailNative.error = video.error.code
              resolve('error')
            }
            video.src = src
          })
          video.removeAttribute('src')
          video.load()
          video.remove()
        }
        URL.revokeObjectURL(blobUrl)
      })
      await page.evaluate(() => {
        window.created = []
        window.revoked = []
        const create = URL.createObjectURL.bind(URL)
        const revoke = URL.revokeObjectURL.bind(URL)
        URL.createObjectURL = (value) => {
          const url = create(value)
          created.push(url)
          return url
        }
        URL.revokeObjectURL = (url) => {
          revoked.push(url)
          revoke(url)
        }
        window.tool = new ArtplayerToolThumbnail({ fileInput: document.querySelector('#input'), number: 10, width: 80, height: 30, column: 3, begin: 0, end: 20 })
        window.observed = []
        for (const event of ['file', 'video', 'canvas', 'update', 'done', 'error', 'destroy'])
          tool.on(event, (...args) => observed.push({ event, progress: event === 'update' ? args[1] : null, processing: tool.processing }))
      })
      await testInfo.attach('thumbnail-runtime', { contentType: 'application/json', body: JSON.stringify({ name: implementation.name, sha256: hash(implementation.code), recoveredIndividualFile: implementation.legacy, originalNpmArchive: false, media: path.relative(process.cwd(), sample) }) })
    })

    test('native file selection, seek extraction, PNG pixels and repeat generation', async ({ page }, testInfo) => {
      test.setTimeout(60000)
      if (await capabilityControl(page, testInfo))
        return
      await page.locator('#input').setInputFiles(sample)
      await expect.poll(() => page.evaluate(() => tool.video.readyState)).toBeGreaterThanOrEqual(2)
      await expect.poll(() => page.evaluate(() => observed.some(item => item.event === 'video'))).toBe(true)
      const result = await page.evaluate(async () => {
        await tool.start()
        const first = tool.thumbnailUrl
        const blob = await (await fetch(first)).blob()
        const image = new Image()
        image.src = first
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0)
        const pixels = context.getImageData(0, 0, 80, tool.option.height).data
        let nonBlack = 0
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i] + pixels[i + 1] + pixels[i + 2] > 30 && pixels[i + 3] === 255)
            nonBlack++
        }
        const initialEvents = observed.slice()
        await tool.start()
        const second = tool.thumbnailUrl
        tool.destroy()
        return { width: image.width, height: image.height, sourceWidth: tool.video.videoWidth, sourceHeight: tool.video.videoHeight, cellHeight: tool.option.height, mime: blob.type, bytes: blob.size, nonBlack, initialEvents, events: observed, first, second, created, revoked, connected: tool.video.isConnected }
      })
      expect(result.width).toBe(240)
      expect(result.cellHeight).toBe(implementation.legacy ? 30 : result.sourceHeight / result.sourceWidth * 80)
      expect(result.height).toBe(Math.trunc(result.cellHeight * 4 + 30))
      expect(result.mime).toBe('image/png')
      expect(result.bytes).toBeGreaterThan(100)
      expect(result.nonBlack).toBeGreaterThan(100)
      expect(result.initialEvents.filter(item => item.event === 'update').map(item => item.progress)).toEqual(Array.from({ length: 10 }, (_, i) => (i + 1) / 10))
      expect(result.events.filter(item => item.event === 'done')).toHaveLength(2)
      expect(result.first).not.toBe(result.second)
      expect([...result.created].sort()).toEqual([...result.revoked].sort())
      expect(result.connected).toBe(false)
      await testInfo.attach('thumbnail-extraction', { contentType: 'application/json', body: JSON.stringify(result) })
    })

    test('DOM drop dispatch exposes missing listener while callable ondrop works', async ({ page }, testInfo) => {
      if (await capabilityControl(page, testInfo))
        return
      const result = await page.evaluate(async () => {
        const bytes = await (await fetch('/test/thumbnail-pattern.mp4')).blob()
        const file = new File([bytes], 'dropped.mp4', { type: 'video/mp4' })
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        const event = new Event('drop', { cancelable: true })
        Object.defineProperty(event, 'dataTransfer', { value: dataTransfer })
        tool.option.fileInput.dispatchEvent(event)
        const fromListener = { files: observed.filter(item => item.event === 'file').length, prevented: event.defaultPrevented }
        tool.ondrop(event)
        return { fromListener, afterDirect: observed.filter(item => item.event === 'file').length, prevented: event.defaultPrevented }
      })
      expect(result).toEqual({ fromListener: { files: 0, prevented: false }, afterDirect: 1, prevented: true })
      await expect.poll(() => page.evaluate(() => tool.video.readyState)).toBeGreaterThanOrEqual(2)
      await page.evaluate(() => tool.destroy())
    })

    test('corrupt media, replacement URLs and repeated destroy reproduce baseline gaps', async ({ page }, testInfo) => {
      if (await capabilityControl(page, testInfo))
        return
      await page.locator('#input').setInputFiles({ name: 'corrupt.mp4', mimeType: 'video/mp4', buffer: Buffer.from('not a media container') })
      await expect.poll(() => page.evaluate(() => tool.video.error?.code || 0)).toBeGreaterThan(0)
      const failed = await page.evaluate(() => ({ code: tool.video.error.code, toolErrors: observed.filter(item => item.event === 'error').length, first: tool.videoUrl }))
      expect(failed.toolErrors).toBe(0)
      await page.locator('#input').setInputFiles(sample)
      await expect.poll(() => page.evaluate(() => tool.video.readyState)).toBeGreaterThanOrEqual(2)
      const result = await page.evaluate(() => {
        const value = tool.option.fileInput.value
        tool.destroy()
        let repeated
        try {
          tool.destroy()
        }
        catch (error) { repeated = error.name }
        return { value, created, revoked, repeated }
      })
      expect(result.created).toHaveLength(2)
      expect(result.revoked).toEqual([result.created[1]])
      expect(result.revoked).not.toContain(failed.first)
      expect(result.repeated).toBe('NotFoundError')
      expect(result.value === '').toBe(!implementation.legacy)
      await testInfo.attach('thumbnail-media-failure', { contentType: 'application/json', body: JSON.stringify({ failed, result }) })
    })

    test('native PNG callback delivered after destroy still emits update and creates a URL', async ({ page }, testInfo) => {
      if (await capabilityControl(page, testInfo))
        return
      await page.locator('#input').setInputFiles(sample)
      await expect.poll(() => page.evaluate(() => tool.video.readyState)).toBeGreaterThanOrEqual(2)
      await page.evaluate(() => {
        const original = HTMLCanvasElement.prototype.toBlob
        HTMLCanvasElement.prototype.toBlob = function (callback, ...args) {
          original.call(this, (blob) => {
            window.nativeBlob = blob
            window.releaseBlob = () => callback(blob)
          }, ...args)
        }
        window.pendingState = 'pending'
        tool.start().then(() => {
          window.pendingState = 'resolved'
        }, () => {
          window.pendingState = 'rejected'
        })
      })
      await expect.poll(() => page.evaluate(() => typeof window.releaseBlob)).toBe('function')
      const result = await page.evaluate(async () => {
        tool.destroy()
        const count = created.length
        releaseBlob()
        await new Promise(resolve => setTimeout(resolve, 0))
        return { count, created, revoked, pendingState, events: observed.map(item => item.event), connected: tool.video.isConnected, bytes: nativeBlob.size }
      })
      expect(result.bytes).toBeGreaterThan(100)
      expect(result.created).toHaveLength(result.count + 1)
      expect(result.revoked).not.toContain(result.created.at(-1))
      expect(result.events.indexOf('update')).toBeGreaterThan(result.events.indexOf('destroy'))
      expect(result.pendingState).toBe('pending')
      expect(result.connected).toBe(false)
      await testInfo.attach('thumbnail-late-native-blob', { contentType: 'application/json', body: JSON.stringify(result) })
    })
  })
}
/* global created, revoked, ArtplayerToolThumbnail, tool, observed, releaseBlob, pendingState, nativeBlob */

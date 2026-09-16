import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { thumbnailCandidate, thumbnailHistorical } from '../helpers/thumbnail.js'
import { expect, test } from './fixtures.js'

const sample = fileURLToPath(new URL('./media/thumbnail-pattern.mp4', import.meta.url))
const candidate = await thumbnailCandidate()
const implementations = [
  ...thumbnailHistorical().filter(item => item.name !== 'workspace.legacy.js'),
  { ...candidate, lifecycle: true },
  { ...candidate, name: `${candidate.name}-workspace-policy`, compatibility: 'workspace-4.4', lifecycle: true },
]

for (const core of ['published-3.5.31', 'published', 'candidate']) {
  for (const implementation of implementations) {
    test(`Thumbnail ${implementation.name} sheets display and refresh in ${core} core`, async ({ page, browserName }, testInfo) => {
      test.setTimeout(45000)
      await page.goto(`/test/player.html?core=${core}`)
      await page.addScriptTag({ content: implementation.code })
      const native = await page.evaluate(async () => {
        const bytes = await (await fetch('/test/thumbnail-pattern.mp4')).blob()
        const source = URL.createObjectURL(bytes)
        const result = {}
        for (const [transport, url] of [['http', '/test/thumbnail-pattern.mp4'], ['blob', source]]) {
          const video = document.createElement('video')
          video.muted = true
          document.body.append(video)
          result[transport] = await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Native media control did not settle')), 5000)
            video.onloadeddata = () => {
              clearTimeout(timer)
              resolve({ loaded: true, width: video.videoWidth })
            }
            video.onerror = () => {
              clearTimeout(timer)
              resolve({ loaded: false, code: video.error.code })
            }
            video.src = url
          })
          video.removeAttribute('src')
          video.load()
          video.remove()
        }
        URL.revokeObjectURL(source)
        return result
      })
      const delay = implementation.legacy ? 300 : 20
      await page.evaluate(({ compatibility, delay }) => {
        const input = document.createElement('input')
        input.id = 'thumbnail-file'
        input.type = 'file'
        document.body.append(input)
        window.createdThumbnailUrls = []
        window.revokedThumbnailUrls = []
        const create = URL.createObjectURL.bind(URL)
        const revoke = URL.revokeObjectURL.bind(URL)
        URL.createObjectURL = (blob) => {
          const url = create(blob)
          window.createdThumbnailUrls.push(url)
          return url
        }
        URL.revokeObjectURL = (url) => {
          window.revokedThumbnailUrls.push(url)
          revoke(url)
        }
        window.tool = new window.ArtplayerToolThumbnail({ fileInput: input, number: 12, column: 4, width: 160, height: 90, delay, compatibility })
        window.toolErrors = []
        window.tool.on('error', error => window.toolErrors.push(String(error)))
      }, { compatibility: implementation.compatibility, delay })
      await page.locator('#thumbnail-file').setInputFiles(sample)
      await testInfo.attach('thumbnail-core-inputs', { contentType: 'application/json', body: JSON.stringify({ core, implementation: implementation.name, delay, toolSha256: hash(implementation.code), mediaSha256: hash(fs.readFileSync(sample)), native, originalToolArchiveAvailable: false }) })
      if (!native.blob.loaded) {
        expect(browserName).toBe('webkit')
        expect(native).toEqual({ http: { loaded: true, width: 320 }, blob: { loaded: false, code: 4 } })
        await expect.poll(() => page.evaluate(() => window.tool.video.error?.code)).toBe(4)
        // Native error state can be set before the queued error event is dispatched.
        await expect.poll(() => page.evaluate(() => window.toolErrors.length)).toBe(implementation.lifecycle ? 1 : 0)
        await page.evaluate(() => window.tool.destroy())
        testInfo.annotations.push({ type: 'capability-control', description: 'Native HTTP works; native Blob and tool Blob fail with media error 4. This case does not validate extraction or core thumbnail display.' })
        return
      }
      await expect.poll(() => page.evaluate(() => window.tool.video.readyState)).toBeGreaterThanOrEqual(2)
      const generations = []
      for (let generation = 0; generation < 2; generation++) {
        const sheet = await page.evaluate(async () => {
          await window.tool.start()
          const image = new Image()
          image.src = window.tool.thumbnailUrl
          await image.decode()
          const canvas = document.createElement('canvas')
          canvas.width = image.width
          canvas.height = image.height
          const context = canvas.getContext('2d')
          context.drawImage(image, 0, 0)
          const cells = Array.from({ length: 12 }, (_, index) => [...context.getImageData(index % 4 * 160 + 80, Math.floor(index / 4) * 90 + 45, 1, 1).data])
          window.art = new window.Artplayer({
            container: '.player',
            url: window.tool.videoUrl,
            muted: true,
            thumbnails: { url: window.tool.thumbnailUrl, number: 12, column: 4, width: 160, height: 90, scale: 1 },
          })
          return { url: window.tool.thumbnailUrl, width: image.width, height: image.height, cells, png: canvas.toDataURL('image/png').split(',')[1] }
        })
        const sheetPng = PNG.sync.read(Buffer.from(sheet.png, 'base64'))
        await testInfo.attach(`sheet-${generation}`, { contentType: 'image/png', body: Buffer.from(sheet.png, 'base64') })
        delete sheet.png
        expect([sheet.width, sheet.height]).toEqual([640, 300])
        // Independent FFmpeg decoding confirms all twelve sample centers are blue.
        for (const pixel of sheet.cells)
          expect(pixel[2] - Math.max(pixel[0], pixel[1])).toBeGreaterThan(80)
        await expect.poll(() => page.evaluate(() => window.art.template.$video.readyState)).toBeGreaterThanOrEqual(2)
        const progress = page.locator('.art-control-progress')
        const preview = page.locator('.art-control-thumbnails')
        const bounds = await progress.boundingBox()
        const observed = []
        // The old core's first-cell/row-boundary defect is independently characterized.
        for (const [index, oldIndex] of [[1, 1], [4, 3], [5, 5], [0, 5], [11, 11]]) {
          const x = bounds.x + bounds.width * (index + 0.5) / 12
          const y = bounds.y + bounds.height / 2
          await page.mouse.move(x, y)
          await expect.poll(async () => {
            await page.mouse.move(x, y)
            return preview.evaluate(element => element.style.backgroundImage)
          }).toContain('blob:')
          const cell = core === 'candidate' ? index : oldIndex
          await expect(preview).toHaveCSS('background-position', `${-(cell % 4) * 160}px ${-Math.floor(cell / 4) * 90}px`)
          await expect(preview).toBeVisible()
          let screenshot
          await expect.poll(async () => {
            screenshot = await preview.screenshot()
            const png = PNG.sync.read(screenshot)
            expect([png.width, png.height]).toEqual([160, 90])
            let difference = 0
            let channels = 0
            // The progress time tooltip covers the lower part of the preview.
            // Compare the unobscured interior, excluding rounded border pixels.
            for (let py = 8; py < 60; py++) {
              for (let px = 8; px < 152; px++) {
                const actual = (py * png.width + px) * 4
                const expected = ((Math.floor(cell / 4) * 90 + py) * sheetPng.width + cell % 4 * 160 + px) * 4
                for (let channel = 0; channel < 3; channel++) {
                  difference += Math.abs(png.data[actual + channel] - sheetPng.data[expected + channel])
                  channels++
                }
              }
            }
            return difference / channels
          }).toBeLessThanOrEqual(3)
          observed.push({ requestedIndex: index, displayedIndex: cell })
          await testInfo.attach(`sheet-${generation}-cell-${index}`, { contentType: 'image/png', body: screenshot })
        }
        const beforeDestroy = await page.evaluate(() => window.revokedThumbnailUrls.slice())
        await page.evaluate(() => window.art.destroy(true))
        expect(await page.evaluate(() => window.revokedThumbnailUrls)).toEqual(beforeDestroy)
        expect(await page.evaluate(() => window.tool.video.isConnected)).toBe(true)
        generations.push({ ...sheet, observed })
      }
      expect(generations[0].url).not.toBe(generations[1].url)
      const cleanup = await page.evaluate(() => {
        window.tool.destroy()
        return { created: window.createdThumbnailUrls, revoked: window.revokedThumbnailUrls, videoConnected: window.tool.video.isConnected, players: window.Artplayer.instances.length, errors: window.toolErrors }
      })
      expect(cleanup.revoked.filter(url => url === '')).toHaveLength(core === 'published' ? 2 : 0)
      expect([...cleanup.created].sort()).toEqual(cleanup.revoked.filter(url => url !== '').sort())
      expect(cleanup).toMatchObject({ videoConnected: false, players: 0, errors: [] })
      await testInfo.attach('thumbnail-core-results', { contentType: 'application/json', body: JSON.stringify({ core, implementation: implementation.name, generations, cleanup, scope: 'Native local file extraction, real hover and screenshot pixels on two generations; historical core defects asserted separately; no physical device claim' }) })
    })
  }
}

import assert from 'node:assert/strict'
import fs from 'node:fs'
import { PNG } from 'pngjs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { extractExamples } from '../../scripts/docs-smoke/parser.ts'
import { expect, test } from './fixtures.js'

const exampleSource = fs.readFileSync('docs/assets/example/vtt.thumbnail.js', 'utf8').trim()
const plugin = fs.readFileSync('packages/artplayer-plugin-vtt-thumbnail/dist/artplayer-plugin-vtt-thumbnail.js')
const videoSHA256 = hash(fs.readFileSync('docs/assets/sample/bbb-video.mp4'))
const documents = ['plugin/vtt-thumbnail.md', 'en/plugin/vtt-thumbnail.md']
// Whole-second boundaries and a final gap are deliberate public-contract cases.
const cues = 'WEBVTT\n\n00:00.000 --> 05:00.000\nvtt-doc-sprite.svg#xywh=0,0,80,45\n\n05:00.000 --> 08:20.000\nvtt-doc-sprite.svg#xywh=80,0,80,45\n'
const sprite = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="45"><path fill="red" d="M0 0h80v45H0z"/><path fill="blue" d="M80 0h80v45H80z"/></svg>'
for (const document of documents) {
  const examples = extractExamples(fs.readFileSync(`packages/artplayer-vitepress/docs/${document}`, 'utf8'), document)
  assert.equal(examples.length, 1)
  assert.equal(examples[0].code, exampleSource, 'Both VTT guides must execute the actual demo source')
}

for (const core of ['published', 'candidate']) {
  test(`documented VTT: visible sprite crops, boundaries, gaps and cleanup with ${core} core`, async ({ page }, testInfo) => {
    await page.route('**/assets/sample/bbb-thumbnails.vtt', route => route.fulfill({ contentType: 'text/vtt', body: cues }))
    const imageRequests = []
    await page.route('**/assets/sample/vtt-doc-sprite.svg', (route) => {
      imageRequests.push(route.request().url())
      return route.fulfill({ contentType: 'image/svg+xml', body: sprite })
    })
    await page.goto(`/test/player.html?core=${core}`)
    await page.evaluate(() => document.querySelector('.player').classList.add('artplayer-app'))
    await page.addScriptTag({ content: plugin.toString() })
    await page.addScriptTag({ content: `${exampleSource}\nwindow.art = art;` })
    const preview = page.locator('.art-control-vtt-thumbnail')
    const observed = []
    try {
      await expect.poll(() => page.evaluate(() => window.art.isReady && window.art.plugins.artplayerPluginVttThumbnail?.name)).toBe('artplayerPluginVttThumbnail')
      await expect.poll(() => page.evaluate(() => window.art.duration)).toBeCloseTo(596.458, 2)
      const progress = page.locator('.art-control-progress')
      const bounds = await progress.boundingBox()
      async function verifyPixels(name, color) {
        await expect(preview).toHaveCSS('display', 'flex')
        await expect(preview).toHaveCSS('width', '80px')
        await expect(preview).toHaveCSS('height', '45px')
        let screenshot
        let pixel
        await expect.poll(async () => {
          screenshot = await preview.screenshot()
          const png = PNG.sync.read(screenshot)
          const offset = (Math.floor(png.height / 2) * png.width + Math.floor(png.width / 2)) * 4
          pixel = [...png.data.subarray(offset, offset + 4)]
          return pixel
        }).toEqual(color)
        observed.push({ name, pixel })
        await testInfo.attach(name, { contentType: 'image/png', body: screenshot })
      }
      await page.mouse.move(bounds.x + bounds.width * 0.25, bounds.y + bounds.height / 2)
      await verifyPixels('first-red-crop', [255, 0, 0, 255])
      await page.mouse.move(bounds.x + bounds.width * 0.625, bounds.y + bounds.height / 2)
      await verifyPixels('second-blue-crop', [0, 0, 255, 255])
      expect(imageRequests.length).toBeGreaterThan(0)
      // Exact endpoints use the public event: mouse coordinates round to device pixels.
      await page.evaluate(() => window.art.emit('setBar', 'hover', 300 / window.art.duration, new MouseEvent('mousemove')))
      await verifyPixels('shared-boundary-first-crop', [255, 0, 0, 255])
      await page.mouse.move(bounds.x + bounds.width * 0.875, bounds.y + bounds.height / 2)
      await expect(preview).toHaveCSS('display', 'none')
      await page.evaluate(() => window.art.destroy(false))
      await expect(preview).toHaveCount(0)
      await page.evaluate(() => window.art.emit('setBar', 'hover', 0.25, new MouseEvent('mousemove')))
      await expect(preview).toHaveCount(0)
    }
    finally {
      await testInfo.attach('documented-vtt-evidence', { contentType: 'application/json', body: JSON.stringify({ documents, core, pluginSHA256: hash(plugin), sourceSHA256: hash(exampleSource), videoSHA256, cuesSHA256: hash(cues), spriteSHA256: hash(sprite), imageRequests, observed, scope: 'Original demo code and video with controlled local VTT/SVG; real mouse and screenshot pixels, exact endpoint via public setBar with MouseEvent; not physical touch or full video playback acceptance' }) })
      await page.evaluate(() => {
        if (!window.art.isDestroy)
          window.art.destroy()
      })
    }
  })
}

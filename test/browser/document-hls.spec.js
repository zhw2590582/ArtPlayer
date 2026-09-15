import assert from 'node:assert/strict'
import fs from 'node:fs'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { extractExamples } from '../../scripts/docs-smoke/parser.ts'
import { expect, test } from './fixtures.js'

const matrix = JSON.parse(fs.readFileSync('refactor/baselines/hls-sdk-matrix.json'))
const plugin = fs.readFileSync('packages/artplayer-plugin-hls-control/dist/artplayer-plugin-hls-control.js')
const exampleSource = fs.readFileSync('docs/assets/example/hls.control.js', 'utf8').trim()
const media = new Map()
const sdks = new Map()

test.beforeAll(async () => {
  for (const release of matrix.releases) {
    const bytes = readMember(await ensureArchive(release), 'package/dist/hls.min.js')
    assert.equal(hash(bytes), release.files['package/dist/hls.min.js'])
    sdks.set(release.version, bytes)
  }
  const manifest = JSON.parse(fs.readFileSync('test/browser/media/hls/manifest.json'))
  for (const [name, expected] of Object.entries(manifest.files)) {
    const bytes = fs.readFileSync(`test/browser/media/hls/${name}`)
    assert.equal(hash(bytes), expected.sha256)
    media.set(name, bytes)
  }
})

for (const document of ['plugin/hls-control.md', 'en/plugin/hls-control.md']) {
  const examples = extractExamples(fs.readFileSync(`packages/artplayer-vitepress/docs/${document}`, 'utf8'), document)
  assert.equal(examples.length, 1)
  assert.equal(examples[0].code, exampleSource, 'Documented setup must remain identical to the actual demo')
  for (const release of matrix.releases) {
    for (const core of ['published', 'candidate']) {
      test(`documented HLS setup and source lifecycle: ${document}, SDK ${release.version}, ${core} core`, async ({ page }, testInfo) => {
        await page.route('https://playertest.longtailvideo.com/adaptive/elephants_dream_v4/**', async (route) => {
          const filename = new URL(route.request().url()).pathname.split('/').at(-1)
          const name = filename === 'index.m3u8' ? 'master.m3u8' : filename
          const bytes = media.get(name)
          await route.fulfill({ status: bytes ? 200 : 404, body: bytes || 'Missing HLS fixture', contentType: name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t', headers: { 'Access-Control-Allow-Origin': '*' } })
        })
        await page.goto(`/test/player.html?core=${core}`)
        await page.addScriptTag({ content: sdks.get(release.version).toString() })
        await page.addScriptTag({ content: plugin.toString() })
        await page.evaluate(() => {
          document.querySelector('.player').classList.add('artplayer-app')
          window.exampleEngines = []
          const destroy = window.Hls.prototype.destroy
          const attach = window.Hls.prototype.attachMedia
          window.Hls.prototype.attachMedia = function (...args) {
            window.exampleEngines.push({ engine: this, destroyed: 0 })
            return attach.apply(this, args)
          }
          window.Hls.prototype.destroy = function (...args) {
            window.exampleEngines.find(item => item.engine === this).destroyed++
            return destroy.apply(this, args)
          }
        })
        await page.addScriptTag({ content: `${examples[0].code}\nwindow.art = art;` })
        const supported = await page.evaluate(() => window.Hls.isSupported())
        await testInfo.attach('documented-hls-inputs', { contentType: 'application/json', body: JSON.stringify({ document, core, sdk: release, sdkSHA256: hash(sdks.get(release.version)), pluginSHA256: hash(plugin), sourceSHA256: hash(exampleSource), supported, scope: supported ? 'real SDK default worker, local routed stream, playback and replacement cleanup' : 'actual unsupported setup; native fallback is only unit-tested' }) })
        if (!supported) {
          expect(await page.evaluate(() => window.exampleEngines.length)).toBe(0)
          expect(await page.evaluate(() => Boolean(window.art.plugins.artplayerPluginHlsControl))).toBe(false)
          // Windows WebKit has neither the tested MSE path nor native HLS support.
          expect(await page.evaluate(() => window.art.video.canPlayType('application/vnd.apple.mpegurl'))).toBe('')
          await expect(page.locator('.art-notice')).toContainText('Unsupported playback format: m3u8')
          await page.evaluate(() => window.art.destroy())
          return
        }
        await expect.poll(() => page.evaluate(() => window.art.video.readyState >= 2)).toBe(true)
        await page.evaluate(() => {
          window.art.muted = true
        })
        await page.evaluate(() => window.art.play())
        await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
        expect(await page.evaluate(() => window.art.video.getVideoPlaybackQuality().totalVideoFrames)).toBeGreaterThan(2)
        expect(await page.evaluate(() => window.art.hls.config.enableWorker)).toBe(true)
        await expect(page.locator('.art-control-hls-quality')).toBeVisible()
        await expect(page.locator('.art-control-hls-audio')).toBeVisible()
        await page.evaluate(() => window.art.switchUrl(`${window.art.option.url}?reload=1`))
        await expect.poll(() => page.evaluate(() => window.art.video.readyState >= 2)).toBe(true)
        await page.evaluate(() => window.art.play())
        const start = await page.evaluate(() => ({ time: window.art.currentTime, frames: window.art.video.getVideoPlaybackQuality().totalVideoFrames }))
        await expect.poll(() => page.evaluate(start => window.art.currentTime > start.time + 0.3 && window.art.video.getVideoPlaybackQuality().totalVideoFrames > start.frames + 2, start)).toBe(true)
        expect(await page.evaluate(() => window.exampleEngines.map(item => item.destroyed))).toEqual([1, 0])
        await page.evaluate(() => window.art.destroy())
        expect(await page.evaluate(() => window.exampleEngines.map(item => item.destroyed))).toEqual([1, 1])
        expect(await page.locator('.player').evaluate(element => element.childElementCount)).toBe(0)
      })
    }
  }
}

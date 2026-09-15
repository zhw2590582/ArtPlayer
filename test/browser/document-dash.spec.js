import assert from 'node:assert/strict'
import fs from 'node:fs'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { extractExamples } from '../../scripts/docs-smoke/parser.ts'
import { expect, test } from './fixtures.js'

const matrix = JSON.parse(fs.readFileSync('refactor/baselines/dash-sdk.json')).sdks
const plugin = fs.readFileSync('packages/artplayer-plugin-dash-control/dist/artplayer-plugin-dash-control.js')
const exampleSource = fs.readFileSync('docs/assets/example/dash.control.js', 'utf8').trim()
const documents = ['plugin/dash-control.md', 'en/plugin/dash-control.md']
for (const document of documents) {
  const examples = extractExamples(fs.readFileSync(`packages/artplayer-vitepress/docs/${document}`, 'utf8'), document)
  assert.equal(examples.length, 1)
  assert.equal(examples[0].code, exampleSource, 'Both documented examples must match the actual demo')
}
const media = new Map()
const sdks = new Map()

test.beforeAll(async () => {
  for (const sdk of matrix) {
    const bytes = readMember(await ensureArchive(sdk.release), sdk.codeMember)
    assert.equal(hash(bytes), sdk.release.files[sdk.codeMember])
    sdks.set(sdk.release.version, bytes)
  }
  const manifest = JSON.parse(fs.readFileSync('test/browser/media/dash/manifest.json'))
  for (const [name, expected] of Object.entries(manifest.files)) {
    const bytes = fs.readFileSync(`test/browser/media/dash/${name}`)
    assert.equal(hash(bytes), expected.sha256)
    media.set(name, bytes)
  }
})

for (const sdk of matrix) {
  for (const core of ['published', 'candidate']) {
    test(`documented DASH setup and source lifecycle: SDK ${sdk.release.version}, ${core} core`, async ({ page }, testInfo) => {
      await page.route('https://media.axprod.net/TestVectors/v7-Clear/**', async (route) => {
        const filename = new URL(route.request().url()).pathname.split('/').at(-1)
        const name = filename === 'Manifest_1080p.mpd' ? 'master.mpd' : filename
        const bytes = media.get(name)
        await route.fulfill({ status: bytes ? 200 : 404, body: bytes || 'Missing DASH fixture', contentType: name.endsWith('.mpd') ? 'application/dash+xml' : 'video/mp4', headers: { 'Access-Control-Allow-Origin': '*' } })
      })
      await page.goto(`/test/player.html?core=${core}`)
      await page.addScriptTag({ content: sdks.get(sdk.release.version).toString() })
      await page.addScriptTag({ content: plugin.toString() })
      await page.evaluate(() => {
        document.querySelector('.player').classList.add('artplayer-app')
        window.exampleEngines = []
        const mediaPlayer = window.dashjs.MediaPlayer
        window.dashjs.MediaPlayer = Object.assign(function (...args) {
          const factory = mediaPlayer.apply(this, args)
          const create = factory.create
          factory.create = function (...args) {
            const engine = create.apply(this, args)
            const entry = { engine, destroyed: 0 }
            window.exampleEngines.push(entry)
            const destroy = engine.destroy
            engine.destroy = function (...args) {
              entry.destroyed++
              return destroy.apply(this, args)
            }
            return engine
          }
          return factory
        }, mediaPlayer)
      })
      await page.addScriptTag({ content: `${exampleSource}\nwindow.art = art;` })
      const supported = await page.evaluate(() => window.dashjs.supportsMediaSource())
      await testInfo.attach('documented-dash-inputs', { contentType: 'application/json', body: JSON.stringify({ documents, core, sdk, sdkSHA256: hash(sdks.get(sdk.release.version)), pluginSHA256: hash(plugin), sourceSHA256: hash(exampleSource), supported, scope: supported ? 'real SDK with original settings, local routed MPD, playback and replacement cleanup' : 'actual unsupported setup only' }) })
      if (!supported) {
        expect(await page.evaluate(() => window.exampleEngines.length)).toBe(0)
        expect(await page.evaluate(() => Boolean(window.art.plugins.artplayerPluginDashControl))).toBe(false)
        await expect(page.locator('.art-notice')).toContainText('Unsupported playback format: mpd')
        await page.evaluate(() => window.art.destroy())
        return
      }
      await expect.poll(() => page.evaluate(() => window.art.video.readyState >= 2)).toBe(true)
      expect(await page.evaluate(() => window.art.dash.getVersion())).toBe(sdk.release.version)
      await page.evaluate(() => {
        window.art.muted = true
      })
      await page.evaluate(() => window.art.play())
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.3)
      expect(await page.evaluate(() => window.art.video.getVideoPlaybackQuality().totalVideoFrames)).toBeGreaterThan(2)
      await expect(page.locator('.art-control-dash-quality')).toBeVisible()
      await expect(page.locator('.art-control-dash-audio')).toBeVisible()
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

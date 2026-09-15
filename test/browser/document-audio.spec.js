import assert from 'node:assert/strict'
import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { extractExamples } from '../../scripts/docs-smoke/parser.ts'
import { expect, test } from './fixtures.js'

const exampleSource = fs.readFileSync('docs/assets/example/audio.track.js', 'utf8').trim()
const plugin = fs.readFileSync('packages/artplayer-plugin-audio-track/dist/artplayer-plugin-audio-track.js')
const documents = ['plugin/audio-track.md', 'en/plugin/audio-track.md']
const audio = fs.readFileSync('test/browser/media/audio-tone.m4a')
const audioManifest = JSON.parse(fs.readFileSync('test/browser/media/audio-tone.json'))
assert.equal(hash(audio), audioManifest.sha256)
for (const document of documents) {
  const examples = extractExamples(fs.readFileSync(`packages/artplayer-vitepress/docs/${document}`, 'utf8'), document)
  assert.equal(examples.length, 1)
  assert.equal(examples[0].code, exampleSource, 'Both audio guides must execute the actual demo source')
}

for (const core of ['published', 'candidate']) {
  test(`documented independent audio: playback, seek, updates and cleanup with ${core} core`, async ({ page }, testInfo) => {
    for (const [original, fixture] of [['sprite-fight.mp4', '/test/pattern.mp4'], ['sprite-fight.aac', '/test/audio-tone.m4a']]) {
      await page.route(`**/assets/sample/${original}*`, (route) => {
        const url = new URL(route.request().url())
        url.pathname = fixture
        return route.continue({ url: url.href })
      })
    }
    await page.goto(`/test/player.html?core=${core}`)
    await page.evaluate(() => document.querySelector('.player').classList.add('artplayer-app'))
    await page.addScriptTag({ content: plugin.toString() })
    await page.addScriptTag({ content: `${exampleSource}\nwindow.art = art;` })
    await page.evaluate(() => {
      window.documentedTrack = window.art.plugins.artplayerPluginAudioTrack
      window.documentedAudio = window.documentedTrack.audio
      window.art.muted = true
      document.querySelector('#play').onclick = () => window.art.play()
    })
    await testInfo.attach('documented-audio-inputs', { contentType: 'application/json', body: JSON.stringify({ documents, core, pluginSHA256: hash(plugin), sourceSHA256: hash(exampleSource), audio: audioManifest, scope: 'Original example code with local Range-served H264 pattern and AAC/MP4 tone substituted for demo URLs; native media timing, not physical audibility or full device acceptance' }) })
    try {
      await expect.poll(() => page.evaluate(() => window.art.isReady && window.documentedAudio.readyState >= 2)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime > 0.3 && window.documentedAudio.currentTime > 0.3 && !window.documentedAudio.paused)).toBe(true)
      await expect.poll(() => page.evaluate(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 8
        canvas.height = 8
        const ctx = canvas.getContext('2d')
        ctx.drawImage(window.art.video, 0, 0, 8, 8)
        return [...ctx.getImageData(0, 0, 8, 8).data].some((value, index) => index % 4 !== 3 && value > 20)
      })).toBe(true)
      await page.evaluate(() => window.art.video.pause())
      await expect.poll(() => page.evaluate(() => window.documentedAudio.paused)).toBe(true)
      expect(await page.evaluate(() => window.documentedTrack.update({ offset: 0.25, sync: 0.1 }) === undefined)).toBe(true)
      await page.evaluate(() => {
        window.art.seek = 4
        window.art.volume = 0.4
        window.art.playbackRate = 1.25
      })
      await expect.poll(() => page.evaluate(() => Math.abs(window.documentedAudio.currentTime - window.art.currentTime - 0.25) < 0.1)).toBe(true)
      await expect.poll(() => page.evaluate(() => window.documentedAudio.volume)).toBeCloseTo(0.4)
      await expect.poll(() => page.evaluate(() => window.documentedAudio.playbackRate)).toBe(1.25)
      expect(await page.evaluate(() => window.documentedAudio.muted)).toBe(true)
      expect(await page.evaluate(() => window.documentedAudio.paused)).toBe(true)
      await page.evaluate(() => window.documentedTrack.update({ url: '/assets/sample/sprite-fight.aac?track=second' }))
      await expect.poll(() => page.evaluate(() => window.documentedAudio.readyState >= 2 && window.documentedAudio.currentSrc.includes('track=second'))).toBe(true)
      expect(await page.evaluate(() => window.documentedTrack.audio === window.documentedAudio)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime > 4.2 && window.documentedAudio.currentTime > 4.2 && !window.documentedAudio.paused)).toBe(true)
      await page.evaluate(() => window.art.destroy())
      await expect.poll(() => page.evaluate(() => window.documentedAudio.networkState)).toBe(0)
      expect(await page.evaluate(() => window.documentedAudio.getAttribute('src'))).toBeNull()
      expect(await page.evaluate(() => window.documentedAudio.paused)).toBe(true)
      expect(await page.evaluate(() => window.documentedTrack.update({ url: '/assets/sample/sprite-fight.aac?track=late' }) === undefined)).toBe(true)
      expect(await page.evaluate(() => window.documentedAudio.getAttribute('src'))).toBeNull()
      expect(await page.locator('.player').evaluate(element => element.childElementCount)).toBe(0)
    }
    finally {
      await testInfo.attach('documented-audio-state', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ time: window.documentedAudio.currentTime, paused: window.documentedAudio.paused, source: window.documentedAudio.getAttribute('src'), error: window.documentedAudio.error?.code, videoTime: window.art.currentTime, destroyed: window.art.isDestroy }))) })
      await page.evaluate(() => {
        if (!window.art.isDestroy)
          window.art.destroy()
      })
    }
  })
}

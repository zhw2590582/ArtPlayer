import { hash } from '../../refactor/scripts/releases.mjs'
import { multipleSubtitlesCandidate } from '../helpers/multiple-subtitles.js'
import { expect, test } from './fixtures.js'

const implementation = await multipleSubtitlesCandidate()
const literal = 'A & < > \u200E \u200F \u00A0 | <b>literal</b> | &lt;'
const vtt = text => `WEBVTT\n\n00:00.000 --> 00:08.000\n${text}\n`

for (const core of ['published', 'candidate']) {
  test(`Multiple subtitles ${core} core decodes entities once and preserves literal and semantic tags`, async ({ page, browser }, testInfo) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.route('**/test/entities-a.vtt', route => route.fulfill({ body: vtt('A &amp; &lt; &gt; &lrm; &rlm; &nbsp; | &lt;b&gt;literal&lt;/b&gt; | &amp;lt;'), contentType: 'text/vtt' }))
    await page.route('**/test/entities-b.vtt', route => route.fulfill({ body: vtt('<b>bold &amp; safe</b> tail &lt;i&gt;'), contentType: 'text/vtt' }))
    await page.goto(`/test/player.html?core=${core}`)
    await page.addScriptTag({ content: implementation.code })
    await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    await page.evaluate(async () => {
      await window.art.plugins.add(window.artplayerPluginMultipleSubtitles({ subtitles: [{ name: 'a', url: '/test/entities-a.vtt' }, { name: 'b', url: '/test/entities-b.vtt' }] }))
    })
    await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(2)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
    await page.locator('#pause').click()
    await expect.poll(() => page.locator('.art-subtitle-a').textContent()).toBe(literal)
    await expect(page.locator('.art-subtitle-a b')).toHaveCount(0)
    await expect(page.locator('.art-subtitle-b b')).toHaveText('bold & safe')
    await expect(page.locator('.art-subtitle-b i')).toHaveCount(0)
    expect(await page.locator('.art-subtitle-b').allTextContents()).toEqual(['bold & safe', ' tail <i>'])
    const native = await page.evaluate(() => window.art.subtitle.cues.map(cue => cue.getCueAsHTML().textContent))
    expect(native).toEqual([literal, 'bold & safe tail <i>'])
    await page.evaluate(() => window.art.plugins.multipleSubtitles.tracks(['a']))
    await expect(page.locator('.art-subtitle-b')).toHaveCount(0)
    await expect.poll(() => page.locator('.art-subtitle-a').textContent()).toBe(literal)
    await page.evaluate(() => window.art.plugins.multipleSubtitles.reset())
    await expect(page.locator('.art-subtitle-b b')).toHaveText('bold & safe')
    await testInfo.attach('entities.json', { contentType: 'application/json', body: JSON.stringify({ core, browser: browser.version(), pluginSha256: hash(implementation.code), native, literal, scope: 'Actual native VTT and HTML caption display, playback, selection/reset; desktop browser engines only' }) })
    await page.evaluate(() => window.art.destroy(false))
    expect(errors).toEqual([])
  })
}

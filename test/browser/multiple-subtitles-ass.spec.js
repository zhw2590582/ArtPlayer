import { Buffer } from 'node:buffer'
import { hash } from '../../refactor/scripts/releases.mjs'
import { multipleSubtitlesCandidate } from '../helpers/multiple-subtitles.js'
import { expect, test } from './fixtures.js'

const candidate = await multipleSubtitlesCandidate()
const ass = '[Events]\r\nDialogue: 0,0:00:01.25,0:00:03.75,Default,,0,0,0,,漢字 café, comma <b>bold</b>\\NSecond line\r\nDialogue: 0,0:00:04.25,0:00:06.75,Default,,0,0,0,,Later cue'

for (const core of ['published-5.1.2', 'published-5.1.7', 'published-5.3.0', 'published', 'candidate']) {
  test(`Multiple subtitles ASS / ${core}: encoded multiline cues, overlapping translation and selection`, async ({ page, browser }, testInfo) => {
    await page.route('**/test/ass-data.bin', route => route.fulfill({ contentType: 'application/octet-stream', body: Buffer.from(ass, 'utf16le') }))
    await page.route('**/test/ass-translation.vtt', route => route.fulfill({ contentType: 'text/vtt', body: 'WEBVTT\n\n00:02.000 --> 00:04.000\nTranslation\n' }))
    await page.goto(`/test/player.html?core=${core}`)
    await page.addScriptTag({ content: candidate.code })
    await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    await page.evaluate(async () => {
      await window.art.plugins.add(window.artplayerPluginMultipleSubtitles({ subtitles: [
        { name: 'ass', url: '/test/ass-data.bin', type: 'ass', encoding: 'utf-16le' },
        { name: 'translation', url: '/test/ass-translation.vtt' },
      ] }))
    })
    await expect.poll(() => page.evaluate(() => window.art.template.$track.track.cues?.length)).toBe(3)
    const native = await page.evaluate(() => Array.from(window.art.template.$track.track.cues, cue => ({ start: cue.startTime, end: cue.endTime, text: cue.getCueAsHTML().textContent })))
    expect(native.map(cue => [cue.start, cue.end])).toEqual([[1.25, 3.75], [2, 4], [4.25, 6.75]])
    expect(native[0].text).toContain('漢字 café, comma bold')
    expect(native[0].text).toContain('Second line')
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
    await page.locator('#pause').click()
    async function seek(time) {
      await page.evaluate(time => new Promise((resolve) => {
        window.art.once('video:seeked', resolve)
        window.art.seek = time
      }), time)
    }
    await seek(1.5)
    await expect(page.locator('.art-subtitle-ass b')).toHaveText('bold')
    await expect(page.locator('.art-subtitle')).toContainText('Second line')
    await expect(page.locator('.art-subtitle-translation')).toHaveCount(0)
    await seek(2.5)
    await expect(page.locator('.art-subtitle-ass b')).toBeVisible()
    await expect(page.locator('.art-subtitle-translation')).toHaveText('Translation')
    await page.evaluate(() => window.art.plugins.multipleSubtitles.tracks(['translation']))
    await expect(page.locator('.art-subtitle-ass')).toHaveCount(0)
    await expect(page.locator('.art-subtitle-translation')).toHaveText('Translation')
    await page.evaluate(() => window.art.plugins.multipleSubtitles.reset())
    await expect(page.locator('.art-subtitle-ass b')).toBeVisible()
    await seek(5)
    await expect(page.locator('.art-subtitle-ass')).toHaveText('Later cue')
    await expect(page.locator('.art-subtitle-translation')).toHaveCount(0)
    await seek(7.5)
    await expect(page.locator('.art-subtitle-ass, .art-subtitle-translation')).toHaveCount(0)
    const rawHostOutput = await page.evaluate(ass => window.Artplayer.utils.assToVtt(ass), ass)
    await testInfo.attach('ass-conversion', { contentType: 'application/json', body: JSON.stringify({ core, browser: browser.version(), pluginSha256: hash(candidate.code), sourceSha256: hash(Buffer.from(ass, 'utf16le')), rawHostOutput, native, scope: 'Desktop native playback with UTF16 ASS, explicit type override, independently timed multiline/semantic captions, overlap, selection/reset and clearing; original core converter is unchanged.' }) })
    await page.evaluate(() => window.art.destroy())
  })
}

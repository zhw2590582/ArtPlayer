import { hash } from '../../refactor/scripts/releases.mjs'
import { multipleSubtitlesCandidate } from '../helpers/multiple-subtitles.js'
import { expect, test } from './fixtures.js'

const candidate = await multipleSubtitlesCandidate()

for (const core of ['published-5.1.2', 'published-5.1.7']) {
  test(`Multiple subtitles legacy host ${core}: independently timed captions overlap and clear`, async ({ page, browser }, testInfo) => {
    await page.route('**/test/legacy-a.vtt', route => route.fulfill({ contentType: 'text/vtt', body: 'WEBVTT\n\n00:01.000 --> 00:03.000\n<b>A &amp; safe</b>\n' }))
    await page.route('**/test/legacy-b.srt', route => route.fulfill({ contentType: 'text/plain', body: '1\n00:00:02,000 --> 00:00:04,000\nB\n' }))
    await page.route('**/test/legacy-c.ass', route => route.fulfill({ contentType: 'text/plain', body: 'Dialogue: 0,0:00:02.25,0:00:02.75,Default,,0,0,0,,C' }))
    await page.route('**/test/legacy-c.vtt', route => route.fulfill({ contentType: 'text/vtt', body: 'WEBVTT\n\n00:02.250 --> 00:02.750\nC\n' }))
    await page.goto(`/test/player.html?core=${core}`)
    await page.addScriptTag({ content: candidate.code })
    await page.addStyleTag({ content: '.art-subtitle-a { color: rgb(255, 0, 0); } .art-subtitle-b { color: rgb(0, 0, 255); }' })
    await page.evaluate(() => {
      window.createPlayer('/test/pattern.mp4')
      window.originalSubtitleUpdate = window.art.subtitle.update
      window.legacyPayloads = []
      window.art.on('subtitleUpdate', text => window.legacyPayloads.push(text))
    })
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const thirdFormat = core === 'published-5.1.2' ? 'vtt' : 'ass'
    await page.evaluate(async (thirdFormat) => {
      await window.art.plugins.add(window.artplayerPluginMultipleSubtitles({ subtitles: [{ name: 'a', url: '/test/legacy-a.vtt' }, { name: 'b', url: '/test/legacy-b.srt' }, { name: 'c', url: `/test/legacy-c.${thirdFormat}` }] }))
    }, thirdFormat)
    await expect.poll(() => page.evaluate(() => window.art.template.$track.track.cues?.length)).toBe(3)
    await page.evaluate(() => {
      window.cueIdentities = Array.from(window.art.template.$track.track.cues)
    })
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
    await expect(page.locator('.art-subtitle-a b')).toHaveText('A & safe')
    await expect(page.locator('.art-subtitle-b')).toHaveCount(0)
    await seek(2.5)
    await expect(page.locator('.art-subtitle-a b')).toHaveText('A & safe')
    await expect(page.locator('.art-subtitle-b')).toHaveText('B')
    await expect(page.locator('.art-subtitle-c')).toHaveText('C')
    await expect(page.locator('.art-subtitle-a')).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect(page.locator('.art-subtitle-b')).toHaveCSS('color', 'rgb(0, 0, 255)')
    const state = await page.evaluate(() => {
      const art = window.art
      art.subtitle.update()
      art.subtitle.update()
      const cues = Array.from(art.template.$track.track.cues)
      return { sameUpdate: art.subtitle.update === window.originalSubtitleUpdate, sameCues: cues.every((cue, index) => cue === window.cueIdentities[index]), times: cues.map(cue => [cue.startTime, cue.endTime]), legacyPayload: window.legacyPayloads.at(-1), firstText: art.template.$track.track.activeCues[0].text, counts: ['a', 'b', 'c'].map(name => art.template.$subtitle.querySelectorAll(`.art-subtitle-${name}`).length) }
    })
    expect(state.sameUpdate).toBe(true)
    expect(state.sameCues).toBe(true)
    expect(state.times).toEqual([[1, 3], [2, 4], [2.25, 2.75]])
    expect(state.legacyPayload).toBe(state.firstText)
    expect(state.counts).toEqual([1, 1, 1])
    await seek(3.5)
    await expect(page.locator('.art-subtitle-a')).toHaveCount(0)
    await expect(page.locator('.art-subtitle-b')).toHaveText('B')
    await expect(page.locator('.art-subtitle-c')).toHaveCount(0)
    await page.evaluate(() => window.art.plugins.multipleSubtitles.tracks([]))
    await expect(page.locator('.art-subtitle-b')).toHaveCount(0)
    await page.evaluate(() => window.art.plugins.multipleSubtitles.reset())
    await expect(page.locator('.art-subtitle-b')).toHaveText('B')
    await seek(2.5)
    await expect(page.locator('.art-subtitle-c')).toHaveText('C')
    await seek(4.5)
    await expect(page.locator('.art-subtitle-a, .art-subtitle-b, .art-subtitle-c')).toHaveCount(0)
    await testInfo.attach('legacy-captions', { contentType: 'application/json', body: JSON.stringify({ core, browser: browser.version(), pluginSha256: hash(candidate.code), thirdFormat, state, scope: 'Native VTT/SRT overlaps (ASS additionally on 5.1.7), semantic HTML/CSS, legacy scalar event payload, original host method and cue identities, repeated update/selection/reset/empty intervals', limitation: '5.1.2 published ASS converter loses required VTT line breaks; tracked separately in PKG-MULTI-SUB-11.' }) })
    await page.evaluate(() => window.art.destroy())
  })
}

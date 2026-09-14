import { expect, test } from './fixtures.js'

const vtt = 'WEBVTT\n\n00:01.000 --> 00:03.000\nFirst\n\n00:01.000 --> 00:03.000\nOverlap\n\n00:04.000 --> 00:06.000\nLater\n'

for (const core of ['candidate', 'published']) {
  test(`${core}: ${core === 'candidate' ? 'paused subtitle offsets refresh native membership without moving media' : 'historical paused subtitle offset behavior'}`, async ({ page, browserName }, testInfo) => {
    await page.route('**/test/offset.vtt', route => route.fulfill({ contentType: 'text/vtt', body: vtt }))
    await page.goto(`/test/player.html?core=${core}`)
    await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    await page.evaluate(() => window.art.subtitle.switch('/test/offset.vtt'))
    await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(3)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
    await page.locator('#pause').click()
    await page.evaluate(() => new Promise((resolve) => {
      window.art.once('video:seeked', resolve)
      window.art.seek = 1.5
    }))
    await expect(page.locator('.art-subtitle-line')).toHaveCount(2)
    const records = await page.evaluate(() => {
      const art = window.art
      const track = art.template.$track.track
      const cues = Array.from(track.cues)
      const events = []
      art.on('subtitleOffset', value => events.push(value))
      const states = []
      const time = art.currentTime
      for (const offset of [1, -1, 0, -3, 0]) {
        art.subtitleOffset = offset
        states.push({ offset, time: art.currentTime, paused: art.video.paused, native: Array.from(track.activeCues, cue => cue.text), public: art.subtitle.activeCues.map(cue => cue.text), rendered: Array.from(art.template.$subtitle.querySelectorAll('.art-subtitle-line'), line => line.textContent.trim()), sameCues: cues.every(cue => Array.from(track.cues).includes(cue)), mode: track.mode })
      }
      return { states, events, time }
    })
    await testInfo.attach('paused-offset', { contentType: 'application/json', body: JSON.stringify({ core, records }) })
    expect(records.events).toEqual([1, -1, 0, -3, 0])
    const texts = core === 'published' && browserName === 'firefox'
      ? [['First', 'Overlap'], ['First', 'Overlap'], ['First', 'Overlap'], ['First', 'Overlap', 'Later'], ['First', 'Overlap', 'Later']]
      : [[], ['First', 'Overlap'], ['First', 'Overlap'], ['Later'], ['First', 'Overlap']]
    expect(records.time).toBeCloseTo(1.5, 2)
    for (const [index, state] of records.states.entries()) {
      expect(state).toEqual({ offset: [1, -1, 0, -3, 0][index], time: records.time, paused: true, native: texts[index], public: texts[index], rendered: texts[index], sameCues: true, mode: 'hidden' })
    }
    if (core === 'candidate') {
      const disabled = await page.evaluate(() => {
        const track = window.art.template.$track.track
        track.mode = 'disabled'
        window.art.subtitleOffset = 2
        return { mode: track.mode, active: window.art.subtitle.activeCues.length, offset: window.art.subtitleOffset }
      })
      expect(disabled).toEqual({ mode: 'disabled', active: 0, offset: 0 })
      await page.evaluate(() => {
        window.art.template.$track.track.mode = 'hidden'
      })
      await page.locator('#play').click()
      await page.evaluate(() => {
        window.art.subtitleOffset = 1
      })
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(2.25)
      await expect(page.locator('.art-subtitle-line')).toHaveCount(2)
      await page.locator('#pause').click()
    }
    await page.evaluate(() => window.art.destroy())
  })
}

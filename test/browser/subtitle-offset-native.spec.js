import { expect, test } from './fixtures.js'

for (const invalidation of ['time-only', 'remove-add', 'mode-toggle']) {
  test(`Native paused cue timing probe: ${invalidation}`, async ({ page, browser }, testInfo) => {
    await page.route('**/test/native-offset.vtt', route => route.fulfill({ contentType: 'text/vtt', body: 'WEBVTT\n\n00:01.000 --> 00:03.000\ncaption\n' }))
    await page.goto('/test/player.html')
    await page.evaluate(async () => {
      const video = document.createElement('video')
      video.muted = true
      video.src = '/test/pattern.mp4'
      document.body.append(video)
      window.probeVideo = video
      await new Promise(resolve => video.addEventListener('loadedmetadata', resolve, { once: true }))
      const element = document.createElement('track')
      element.kind = 'metadata'
      element.src = '/test/native-offset.vtt'
      const loaded = new Promise(resolve => element.addEventListener('load', resolve, { once: true }))
      video.append(element)
      const track = element.track
      track.mode = 'hidden'
      await loaded
      window.probeTrack = track
      window.probeCue = track.cues[0]
      await video.play()
      video.pause()
      const sought = new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }))
      video.currentTime = 1.5
      await sought
    })
    await expect.poll(() => page.evaluate(() => window.probeTrack.activeCues.length)).toBe(1)
    const state = await page.evaluate(async (invalidation) => {
      const track = window.probeTrack
      const cue = window.probeCue
      const read = () => ({ time: window.probeVideo.currentTime, paused: window.probeVideo.paused, active: Array.from(track.activeCues || [], cue => [cue.startTime, cue.endTime]), sameCue: track.cues[0] === cue })
      const before = read()
      cue.startTime = 2
      cue.endTime = 4
      const changed = read()
      if (invalidation === 'remove-add') {
        track.removeCue(cue)
        track.addCue(cue)
      }
      if (invalidation === 'mode-toggle') {
        track.mode = 'disabled'
        track.mode = 'hidden'
      }
      const immediate = read()
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const painted = read()
      window.probeVideo.remove()
      return { before, changed, immediate, painted }
    }, invalidation)
    await testInfo.attach('native-offset-probe', { contentType: 'application/json', body: JSON.stringify({ invalidation, browser: browser.version(), state, scope: 'Native video/TextTrack only, no Artplayer instance; two paint callbacks observe invalidation without moving playback time' }) })
    expect(state.before.time).toBeGreaterThanOrEqual(1)
    expect(state.before.time).toBeLessThan(2)
    expect(state.before).toMatchObject({ paused: true, active: [[1, 3]], sameCue: true })
  })
}

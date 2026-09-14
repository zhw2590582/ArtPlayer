import { hash } from '../../refactor/scripts/releases.mjs'
import { multipleSubtitlesCandidate, multipleSubtitlesHistorical } from '../helpers/multiple-subtitles.js'
import { expect, test } from './fixtures.js'

const candidate = await multipleSubtitlesCandidate()
const historical = (await multipleSubtitlesHistorical()).filter(item => /^published-.*-main$/.test(item.name))
const cores = ['published-5.1.2', 'published-5.1.7', 'published-5.3.0', 'published', 'candidate']
const vtt = 'WEBVTT\n\n00:01.000 --> 00:03.000\nFirst\n\n00:04.000 --> 00:06.000\nSecond\n'
const srt = '1\n00:00:01,000 --> 00:00:03,000\nTranslation\n'

test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => {
    const art = window.art
    if (!art)
      return null
    const track = art.template.$track?.track
    const read = cue => ({ start: cue.startTime, end: cue.endTime, text: cue.text })
    return { destroyed: art.isDestroy, paused: art.video.paused, time: art.currentTime, offset: art.subtitleOffset, cues: Array.from(track?.cues || [], read), active: Array.from(track?.activeCues || [], read), displayed: art.template.$subtitle?.textContent }
  })
  await testInfo.attach('multiple-combination-final-state', { contentType: 'application/json', body: JSON.stringify(state) })
})

async function prepare(page, core, implementation, browser, testInfo) {
  await page.route('**/test/combination.vtt', route => route.fulfill({ contentType: 'text/vtt', body: vtt }))
  await page.route('**/test/combination.srt', route => route.fulfill({ contentType: 'text/plain', body: srt }))
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${implementation.code}; window.multipleFactory = module.exports.default || module.exports; })();` })
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await testInfo.attach('multiple-combination-inputs', { contentType: 'application/json', body: JSON.stringify({ core, plugin: implementation.name, pluginSha256: hash(implementation.code), browser: browser.version(), scope: 'Desktop engines; 5.3.0 is adjacent stable, not the unavailable 5.3.1 release; no minimum-version or physical-device claim' }) })
}

async function seek(page, time) {
  await page.evaluate(time => new Promise((resolve) => {
    window.art.once('video:seeked', resolve)
    window.art.seek = time
  }), time)
}

for (const core of cores.filter(core => !['published-5.1.2', 'published-5.1.7'].includes(core))) {
  test(`Multiple subtitles candidate / ${core}: timed VTT and SRT, offsets, fullscreen and source change`, async ({ page, browser, browserName }, testInfo) => {
    await prepare(page, core, candidate, browser, testInfo)
    await page.evaluate(async () => {
      await window.art.plugins.add(window.multipleFactory({ subtitles: [{ name: 'a', url: '/test/combination.vtt' }, { name: 'b', url: '/test/combination.srt' }] }))
    })
    await expect.poll(() => page.evaluate(() => window.art.template.$track.track.cues?.length)).toBe(3)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
    await page.locator('#pause').click()
    await seek(page, 1.5)
    await expect(page.locator('.art-subtitle-a')).toHaveText('First')
    await expect(page.locator('.art-subtitle-b')).toHaveText('Translation')
    await page.evaluate(() => {
      window.art.subtitleOffset = 1
    })
    expect(await page.evaluate(() => Array.from(window.art.template.$track.track.cues, cue => [cue.startTime, cue.endTime]))).toEqual([[2, 4], [2, 4], [5, 7]])
    const staleHistoricalOffset = core !== 'candidate' && browserName === 'firefox'
    await expect(page.locator('.art-subtitle-a')).toHaveCount(staleHistoricalOffset ? 1 : 0)
    await seek(page, 2.5)
    await expect(page.locator('.art-subtitle-a')).toHaveText('First')
    await page.evaluate(() => {
      window.art.subtitleOffset = -1
    })
    expect(await page.evaluate(() => Array.from(window.art.template.$track.track.cues, cue => [cue.startTime, cue.endTime]))).toEqual([[0, 2], [0, 2], [3, 5]])
    await expect(page.locator('.art-subtitle-a')).toHaveCount(staleHistoricalOffset ? 1 : 0)
    if (staleHistoricalOffset)
      await testInfo.attach('historical-paused-offset-defect', { contentType: 'application/json', body: JSON.stringify({ core, browser: browser.version(), acceptedAsCorrect: false, observation: 'Published core keeps a stale active caption after paused offsets; candidate must clear it. Dedicated native/offset probes retain exact state.' }) })
    await page.evaluate(() => {
      window.art.subtitleOffset = 0
    })
    await expect(page.locator('.art-subtitle-a')).toHaveText('First')
    await page.evaluate(() => {
      window.art.fullscreenWeb = true
    })
    await expect.poll(() => page.evaluate(() => window.art.fullscreenWeb)).toBe(true)
    await expect(page.locator('.art-subtitle-a')).toBeVisible()
    await page.evaluate(() => {
      window.art.fullscreenWeb = false
      window.fullscreenEvents = []
      window.art.on('fullscreen', value => window.fullscreenEvents.push(value))
      document.querySelector('#play').onclick = () => {
        window.art.fullscreen = true
      }
    })
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => (document.fullscreenElement || document.webkitFullscreenElement) === window.art.template.$player)).toBe(true)
    await expect.poll(() => page.evaluate(() => window.fullscreenEvents)).toEqual([true])
    await expect(page.locator('.art-subtitle-a')).toBeVisible()
    expect(await page.evaluate(() => (document.fullscreenElement || document.webkitFullscreenElement).contains(window.art.template.$subtitle))).toBe(true)
    await page.evaluate(() => {
      window.art.fullscreen = false
    })
    await expect.poll(() => page.evaluate(() => window.fullscreenEvents)).toEqual([true, false])
    await page.evaluate(() => window.art.plugins.multipleSubtitles.tracks(['b']))
    await expect(page.locator('.art-subtitle-a')).toHaveCount(0)
    await expect(page.locator('.art-subtitle-b')).toHaveText('Translation')
    await page.evaluate(() => window.art.switchUrl('/test/pattern.mp4?subtitles-combination'))
    // Old core promises can settle during their native restoration seek.
    // The immediate-seek path is retained separately in multiple-subtitles-switch.spec.js.
    await expect.poll(() => page.evaluate(() => window.art.video.seeking)).toBe(false)
    await seek(page, 1.5)
    await expect(page.locator('.art-subtitle-b')).toHaveText('Translation')
    await page.evaluate(() => window.art.plugins.multipleSubtitles.reset())
    await expect(page.locator('.art-subtitle-a')).toHaveText('First')
    await seek(page, 4.5)
    await expect(page.locator('.art-subtitle-a')).toHaveText('Second')
    await expect(page.locator('.art-subtitle-b')).toHaveCount(0)
    await page.evaluate(() => window.art.destroy())
    await expect(page.locator('.art-subtitle-a')).toHaveCount(0)
  })
}

for (const core of cores) {
  test(`Multiple subtitles candidate / ${core}: destroying one player preserves another player's captions and URLs`, async ({ page, browser }, testInfo) => {
    await prepare(page, core, candidate, browser, testInfo)
    await page.evaluate(async () => {
      const container = document.createElement('div')
      container.style.cssText = 'width:320px;height:180px'
      document.body.append(container)
      window.other = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true, mutex: false })
      window.owned = [[], []]
      window.revoked = []
      const revoke = URL.revokeObjectURL.bind(URL)
      URL.revokeObjectURL = (url) => {
        window.revoked.push(url)
        revoke(url)
      }
      for (const [index, art] of [window.art, window.other].entries()) {
        const init = art.subtitle.init.bind(art.subtitle)
        art.subtitle.init = (option) => {
          window.owned[index].push(option.url)
          return init(option)
        }
        await art.plugins.add(window.multipleFactory({ subtitles: [{ name: `p${index}`, url: '/test/combination.vtt' }] }))
      }
    })
    await expect.poll(() => page.evaluate(() => window.other.isReady && window.other.template.$track.track.cues?.length === 2 && window.art.template.$track.track.cues?.length === 2)).toBe(true)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
    await page.locator('#pause').click()
    await seek(page, 1.5)
    await expect(page.locator('.art-subtitle-p0')).toHaveText('First')
    await page.evaluate(() => {
      window.art.destroy(false)
      document.querySelector('#play').onclick = () => window.other.play()
      document.querySelector('#pause').onclick = () => window.other.pause()
    })
    expect(await page.evaluate(() => window.owned[0].every(url => window.revoked.includes(url)))).toBe(true)
    expect(await page.evaluate(() => window.owned[1].some(url => window.revoked.includes(url)))).toBe(false)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.other.currentTime)).toBeGreaterThan(0.1)
    await page.locator('#pause').click()
    await page.evaluate(() => {
      window.other.seek = 1.5
    })
    await expect(page.locator('.art-subtitle-p1')).toHaveText('First')
    await page.evaluate(() => window.other.plugins.multipleSubtitles.tracks([]))
    await expect(page.locator('.art-subtitle-p1')).toHaveCount(0)
    await page.evaluate(() => window.other.plugins.multipleSubtitles.reset())
    await expect(page.locator('.art-subtitle-p1')).toHaveText('First')
    await page.evaluate(() => window.other.destroy(false))
    expect(await page.evaluate(() => window.owned.flat().every(url => window.revoked.includes(url)))).toBe(true)
  })
}

for (const core of ['published-5.1.2', 'published-5.1.7']) {
  for (const implementation of [...historical, candidate]) {
    test(`Multiple subtitles ${implementation.name} / ${core}: record single-active-cue overlap boundary`, async ({ page, browser }, testInfo) => {
      await prepare(page, core, implementation, browser, testInfo)
      await page.route('**/test/combination.vtt', route => route.fulfill({ contentType: 'text/vtt', body: 'WEBVTT\n\n00:01.000 --> 00:03.000\nFirst\n' }))
      await page.evaluate(async () => {
        await window.art.plugins.add(window.multipleFactory({ subtitles: [{ name: 'a', url: '/test/combination.vtt' }, { name: 'b', url: '/test/combination.srt' }] }))
      })
      const indexMerge = implementation.version === '1.0.0'
      await expect.poll(() => page.evaluate(() => window.art.template.$track.track.cues?.length)).toBe(indexMerge ? 1 : 2)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
      await page.locator('#pause').click()
      await seek(page, 1.5)
      await expect(page.locator('.art-subtitle-a')).toHaveText('First')
      // This is a deficiency probe, not successful simultaneous-caption acceptance.
      await expect(page.locator('.art-subtitle-b')).toHaveCount(indexMerge ? 1 : 0)
      const state = await page.evaluate(() => ({ native: Array.from(window.art.template.$track.track.activeCues, cue => cue.getCueAsHTML().textContent), displayed: window.art.template.$subtitle.textContent }))
      expect(state.native).toEqual(indexMerge ? ['FirstTranslation'] : ['First', 'Translation'])
      expect(state.displayed).toBe(indexMerge ? 'FirstTranslation' : 'First')
      await testInfo.attach('single-active-cue-boundary', { contentType: 'application/json', body: JSON.stringify({ core, implementation: implementation.name, state, simultaneousCaptionsAccepted: indexMerge, unresolvedCandidateGap: !indexMerge, explanation: '1.0.0 combines by array index; 1.1.0 onward retains separately timed cues. Old core displays only its first active cue. Candidate gap remains open, even when this observation test passes.' }) })
      await page.evaluate(() => window.art.plugins.multipleSubtitles.tracks(['b']))
      await expect(page.locator('.art-subtitle-b')).toHaveText('Translation')
      await expect(page.locator('.art-subtitle-a')).toHaveCount(0)
      await page.evaluate(() => window.art.destroy())
    })
  }
}

for (const implementation of historical) {
  test(`Multiple subtitles ${implementation.name} / candidate core: unchanged old factory and selection calls`, async ({ page, browser }, testInfo) => {
    await prepare(page, 'candidate', implementation, browser, testInfo)
    await page.evaluate(async () => {
      await window.art.plugins.add(window.multipleFactory({ subtitles: [{ name: 'old', url: '/test/combination.vtt' }] }))
    })
    await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(2)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
    await page.locator('#pause').click()
    await seek(page, 1.5)
    await expect(page.locator('.art-subtitle-old')).toHaveText('First')
    expect(await page.evaluate(() => window.art.plugins.multipleSubtitles.tracks([]) === undefined)).toBe(true)
    await expect(page.locator('.art-subtitle-old')).toHaveCount(0)
    expect(await page.evaluate(() => window.art.plugins.multipleSubtitles.reset() === undefined)).toBe(true)
    await expect(page.locator('.art-subtitle-old')).toHaveText('First')
    await seek(page, 4.5)
    await expect(page.locator('.art-subtitle-old')).toHaveText('Second')
    await page.evaluate(() => window.art.destroy(false))
  })
}

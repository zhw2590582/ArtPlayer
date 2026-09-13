import { hash } from '../../refactor/scripts/releases.mjs'
import { multipleSubtitlesHistorical } from '../helpers/multiple-subtitles.js'
import { expect, test } from './fixtures.js'

const implementation = (await multipleSubtitlesHistorical()).find(item => item.name === 'published-1.2.0-main')
const srt = text => `1\n00:00:00,000 --> 00:00:08,000\n${text}\n`
const vtt = 'WEBVTT\n\n00:00.000 --> 00:08.000\nCached caption\n'

async function prepare(page, core) {
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: implementation.code })
  await page.evaluate(() => {
    window.createPlayer('/test/pattern.mp4')
    window.multipleProbe = { initialized: [], revoked: [], errors: [], signal: false, settled: false }
    window.multipleNativeFetch = window.fetch.bind(window)
    window.fetch = (url, options) => {
      if (url === '/test/multiple-held.vtt')
        window.multipleProbe.signal = Boolean(options?.signal)
      return window.multipleNativeFetch(url, options)
    }
    const revoke = URL.revokeObjectURL.bind(URL)
    URL.revokeObjectURL = (url) => {
      window.multipleProbe.revoked.push(url)
      revoke(url)
    }
    const init = window.art.subtitle.init.bind(window.art.subtitle)
    window.art.subtitle.init = (option) => {
      window.multipleProbe.initialized.push({ url: option.url, destroyed: window.art.isDestroy })
      const pending = init(option)
      // Observe the real host rejection without replacing its behavior or return value.
      Promise.resolve(pending).catch(error => window.multipleProbe.errors.push({ name: error.name, message: error.message }))
      return pending
    }
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

async function evidence(page, testInfo, core, observation) {
  const probe = await page.evaluate(() => window.multipleProbe)
  expect(probe.errors).toEqual([])
  await testInfo.attach('multiple-subtitles-history', { body: JSON.stringify({ core, implementation: { name: implementation.name, sha256: hash(implementation.code) }, observation, probe }), contentType: 'application/json' })
}

for (const core of ['published', 'candidate']) {
  test(`Multiple subtitles historical ${core} core: real SRT captions select, clear and reset`, async ({ page }, testInfo) => {
    await page.route('**/test/multiple-en.srt', route => route.fulfill({ body: srt('English'), contentType: 'text/plain' }))
    await page.route('**/test/multiple-jp.srt', route => route.fulfill({ body: srt('日本語'), contentType: 'text/plain' }))
    await prepare(page, core)
    await page.evaluate(async () => {
      window.multipleResult = await window.art.plugins.add(window.artplayerPluginMultipleSubtitles({ subtitles: [{ name: 'en', url: '/test/multiple-en.srt' }, { name: 'jp', url: '/test/multiple-jp.srt' }] }))
    })
    await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(2)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
    await page.locator('#pause').click()
    await expect(page.locator('.art-subtitle-en')).toHaveText('English')
    await expect(page.locator('.art-subtitle-jp')).toHaveText('日本語')
    await page.evaluate(() => window.art.plugins.multipleSubtitles.tracks(['jp']))
    await expect(page.locator('.art-subtitle-en')).toHaveCount(0)
    await expect(page.locator('.art-subtitle-jp')).toHaveText('日本語')
    await page.evaluate(() => window.art.plugins.multipleSubtitles.tracks([]))
    await expect(page.locator('.art-subtitle-jp')).toHaveCount(0)
    await page.evaluate(() => window.art.plugins.multipleSubtitles.reset())
    await expect(page.locator('.art-subtitle-en')).toHaveText('English')
    await expect(page.locator('.art-subtitle-jp')).toHaveText('日本語')
    await page.evaluate(() => window.art.destroy(false))
    await evidence(page, testInfo, core, 'Native SRT conversion, track cue loading, real playback and DOM text selection/reset passed; this does not verify all CSS/device combinations.')
  })

  test(`Multiple subtitles historical ${core} core: pending native fetch survives destroy and creates a retained Blob URL`, async ({ page }, testInfo) => {
    let release
    let requested
    const started = new Promise((resolve) => {
      requested = resolve
    })
    const pending = new Promise((resolve) => {
      release = resolve
    })
    await page.route('**/test/multiple-held.vtt', async (route) => {
      requested()
      await pending
      await route.fulfill({ body: vtt, contentType: 'text/vtt' })
    })
    try {
      await prepare(page, core)
      await page.evaluate(() => {
        window.multiplePending = window.artplayerPluginMultipleSubtitles({ subtitles: [{ url: '/test/multiple-held.vtt', name: 'held' }] })(window.art).then((result) => {
          window.multipleResult = result
          window.multipleProbe.settled = true
        })
      })
      await started
      await page.evaluate(() => window.art.destroy(false))
      expect(await page.evaluate(() => ({ settled: window.multipleProbe.settled, signal: window.multipleProbe.signal, initialized: window.multipleProbe.initialized.length }))).toEqual({ settled: false, signal: false, initialized: 0 })
      release()
      await page.evaluate(() => window.multiplePending)
      const state = await page.evaluate(async () => {
        const [late] = window.multipleProbe.initialized
        const text = await (await window.multipleNativeFetch(late.url)).text()
        return { destroyedAtInit: late.destroyed, retained: !window.multipleProbe.revoked.includes(late.url), text }
      })
      expect(state.destroyedAtInit).toBe(true)
      expect(state.retained).toBe(true)
      expect(state.text).toContain('Cached caption')
      await evidence(page, testInfo, core, state)
    }
    finally { release() }
  })

  test(`Multiple subtitles historical ${core} core: destroy retains the plugin URL and reset allocates another one`, async ({ page }, testInfo) => {
    await page.route('**/test/multiple-ready.vtt', route => route.fulfill({ body: vtt, contentType: 'text/vtt' }))
    await prepare(page, core)
    await page.evaluate(async () => {
      window.multipleResult = await window.artplayerPluginMultipleSubtitles({ subtitles: [{ url: '/test/multiple-ready.vtt', name: 'ready' }] })(window.art)
    })
    await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(1)
    const state = await page.evaluate(async () => {
      const first = window.multipleProbe.initialized[0].url
      window.art.destroy(false)
      const retainedText = await (await window.multipleNativeFetch(first)).text()
      const beforeReset = !window.multipleProbe.revoked.includes(first)
      const result = window.multipleResult.reset()
      const late = window.multipleProbe.initialized.at(-1)
      const lateText = await (await window.multipleNativeFetch(late.url)).text()
      return { beforeReset, retainedText, returnsUndefined: result === undefined, lateAfterDestroy: late.destroyed, newURL: late.url !== first, priorRevokedByReset: window.multipleProbe.revoked.includes(first), lateText }
    })
    expect(state.beforeReset).toBe(true)
    expect(state.retainedText).toContain('Cached caption')
    expect(state.returnsUndefined).toBe(true)
    expect(state.lateAfterDestroy).toBe(true)
    expect(state.newURL).toBe(true)
    expect(state.priorRevokedByReset).toBe(true)
    expect(state.lateText).toContain('Cached caption')
    await evidence(page, testInfo, core, state)
  })
}

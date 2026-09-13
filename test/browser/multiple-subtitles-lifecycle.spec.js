import { hash } from '../../refactor/scripts/releases.mjs'
import { multipleSubtitlesCandidate } from '../helpers/multiple-subtitles.js'
import { expect, test } from './fixtures.js'

const implementation = await multipleSubtitlesCandidate()
const vtt = 'WEBVTT\n\n00:00.000 --> 00:08.000\nCached caption\n'
const srt = text => `1\n00:00:00,000 --> 00:00:08,000\n${text}\n`

async function prepare(page, core) {
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: implementation.code })
  await page.evaluate(() => {
    window.createPlayer('/test/pattern.mp4')
    window.multipleProbe = { initialized: [], revoked: [], signal: null, errors: [], requests: [] }
    const fetch = window.fetch.bind(window)
    window.multipleNativeFetch = fetch
    window.fetch = (url, options) => {
      if (typeof url === 'string' && url.startsWith('/test/multiple-'))
        window.multipleProbe.requests.push(url)
      if (url === '/test/multiple-held.vtt')
        window.multipleProbe.signal = options?.signal
      return fetch(url, options)
    }
    const revoke = URL.revokeObjectURL.bind(URL)
    URL.revokeObjectURL = (url) => {
      window.multipleProbe.revoked.push(url)
      revoke(url)
    }
    const init = window.art.subtitle.init.bind(window.art.subtitle)
    window.art.subtitle.init = (option) => {
      window.multipleProbe.initialized.push({ url: option.url, destroyed: window.art.isDestroy })
      const result = init(option)
      Promise.resolve(result).catch(error => window.multipleProbe.errors.push({ name: error.name, message: error.message }))
      return result
    }
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

async function evidence(page, testInfo, core, observation) {
  const probe = await page.evaluate(() => ({ ...window.multipleProbe, signal: window.multipleProbe.signal ? { aborted: window.multipleProbe.signal.aborted } : null }))
  expect(probe.errors).toEqual([])
  await testInfo.attach('multiple-subtitles-lifecycle', { body: JSON.stringify({ core, implementation: { name: implementation.name, sha256: hash(implementation.code) }, observation, probe }), contentType: 'application/json' })
}

for (const core of ['published', 'candidate']) {
  test(`Multiple subtitles candidate ${core} core: SRT display and selectors survive the resource refactor`, async ({ page }, testInfo) => {
    await page.route('**/test/multiple-en.srt', route => route.fulfill({ body: srt('English'), contentType: 'text/plain' }))
    await page.route('**/test/multiple-jp.srt', route => route.fulfill({ body: srt('日本語'), contentType: 'text/plain' }))
    await prepare(page, core)
    await page.evaluate(async () => {
      await window.art.plugins.add(window.artplayerPluginMultipleSubtitles({ subtitles: [{ name: 'en', url: '/test/multiple-en.srt' }, { name: 'jp', url: '/test/multiple-jp.srt' }] }))
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
    const released = await page.evaluate(() => {
      window.art.destroy(false)
      return window.multipleProbe.initialized.every(item => window.multipleProbe.revoked.includes(item.url))
    })
    expect(released).toBe(true)
    await evidence(page, testInfo, core, { nativeSrtDisplay: true, released })
  })

  test(`Multiple subtitles candidate ${core} core: destroy settles a pending native request before it responds`, async ({ page }, testInfo) => {
    let requested
    let release
    const started = new Promise((resolve) => {
      requested = resolve
    })
    const held = new Promise((resolve) => {
      release = resolve
    })
    await page.route('**/test/multiple-held.vtt', async (route) => {
      requested()
      await held
      await route.fulfill({ body: vtt, contentType: 'text/vtt' })
    })
    try {
      await prepare(page, core)
      await page.evaluate(() => {
        window.multiplePending = window.artplayerPluginMultipleSubtitles({ subtitles: [{ url: '/test/multiple-held.vtt', name: 'held' }] })(window.art)
      })
      await started
      const state = await page.evaluate(async () => {
        window.art.destroy(false)
        const result = await window.multiplePending
        return { name: result.name, voidReset: result.reset() === undefined, initialized: window.multipleProbe.initialized.length, aborted: window.multipleProbe.signal.aborted }
      })
      expect(state).toEqual({ name: 'multipleSubtitles', voidReset: true, initialized: 0, aborted: true })
      release()
      await evidence(page, testInfo, core, state)
    }
    finally { release() }
  })

  test(`Multiple subtitles candidate ${core} core: destroy revokes the Blob and retained reset stays inert`, async ({ page }, testInfo) => {
    await page.route('**/test/multiple-ready.vtt', route => route.fulfill({ body: vtt, contentType: 'text/vtt' }))
    await prepare(page, core)
    await page.evaluate(async () => {
      window.multipleResult = await window.artplayerPluginMultipleSubtitles({ subtitles: [{ url: '/test/multiple-ready.vtt', name: 'ready' }] })(window.art)
    })
    await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(1)
    const state = await page.evaluate(async () => {
      const url = window.multipleProbe.initialized[0].url
      window.art.destroy(false)
      const voidReset = window.multipleResult.reset() === undefined
      let inaccessible = false
      try {
        await window.multipleNativeFetch(url)
      }
      catch (error) {
        inaccessible = error.name === 'TypeError'
      }
      return { voidReset, inaccessible, initialized: window.multipleProbe.initialized.length, revoked: window.multipleProbe.revoked.includes(url) }
    })
    expect(state).toEqual({ voidReset: true, inaccessible: true, initialized: 1, revoked: true })
    await evidence(page, testInfo, core, state)
  })

  test(`Multiple subtitles candidate ${core} core: native HTTP error rejects without installing subtitles`, async ({ page }, testInfo) => {
    await page.route('**/test/multiple-error.vtt', route => route.fulfill({ status: 404, body: vtt, contentType: 'text/vtt' }))
    await prepare(page, core)
    const state = await page.evaluate(async () => {
      let message
      try {
        await window.artplayerPluginMultipleSubtitles({ subtitles: [{ url: '/test/multiple-error.vtt', name: 'error' }] })(window.art)
      }
      catch (error) {
        message = error.message
      }
      window.art.destroy(false)
      return { message, initialized: window.multipleProbe.initialized.length }
    })
    expect(state).toEqual({ message: 'Failed to fetch multiple subtitles: HTTP 404', initialized: 0 })
    await evidence(page, testInfo, core, state)
  })

  test(`Multiple subtitles candidate ${core} core: video source switching retains cached subtitle selection`, async ({ page }, testInfo) => {
    await page.route('**/test/multiple-restart.vtt', route => route.fulfill({ body: vtt, contentType: 'text/vtt' }))
    await prepare(page, core)
    await page.evaluate(async () => {
      await window.art.plugins.add(window.artplayerPluginMultipleSubtitles({ subtitles: [{ url: '/test/multiple-restart.vtt', name: 'restart' }] }))
    })
    await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(1)
    await page.evaluate(() => window.art.switchUrl('/test/pattern.mp4?multiple-restart=1'))
    await page.evaluate(() => window.art.plugins.multipleSubtitles.reset())
    await expect.poll(() => page.evaluate(() => window.art.subtitle.cues.length)).toBe(1)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
    await page.locator('#pause').click()
    await expect(page.locator('.art-subtitle-restart')).toHaveText('Cached caption')
    const requests = await page.evaluate(() => window.multipleProbe.requests)
    expect(requests).toEqual(['/test/multiple-restart.vtt'])
    await page.evaluate(() => window.art.destroy(false))
    await evidence(page, testInfo, core, { requests, nativeSourceSwitch: true })
  })
}

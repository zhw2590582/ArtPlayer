import { hash } from '../../refactor/scripts/releases.mjs'
import { mbBrowserImplementations } from '../helpers/mediabunny.js'
import { expect, test } from './fixtures.js'

const implementations = await mbBrowserImplementations()

for (const implementation of implementations) {
  test(`MediaBunny ${implementation.name}: native MP4 playback or exact Windows WebKit capability failure`, async ({ page, browserName }, testInfo) => {
    await page.goto('/test/player.html?core=published')
    await page.addScriptTag({ content: `(() => {
      const module = { exports: {} }; const exports = module.exports;
      ${implementation.code};
      window.mbFactory = module.exports.default || module.exports;
    })();` })
    await page.evaluate(() => {
      window.mbEvents = []
      window.mbActions = []
      window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, proxy: window.mbFactory() })
      for (const name of window.Artplayer.config.events) {
        window.art.on(`video:${name}`, () => window.mbEvents.push({ name, time: performance.now(), currentTime: window.art.video.currentTime, readyState: window.art.video.readyState }))
      }
      document.querySelector('#play').onclick = () => window.art.play().catch(error => window.mbActions.push({ name: error.name, message: error.message }))
    })
    const capabilities = await page.evaluate(() => ({
      secure: isSecureContext,
      VideoDecoder: typeof VideoDecoder,
      AudioDecoder: typeof AudioDecoder,
      AudioContext: typeof AudioContext,
      webkitAudioContext: typeof window.webkitAudioContext,
      coreVersion: window.Artplayer.version,
    }))
    let outcome = 'unverified'
    try {
      expect(capabilities.secure).toBe(true)
      expect(capabilities.coreVersion).toBe('5.4.0')
      if (capabilities.VideoDecoder === 'undefined' || (capabilities.AudioContext === 'undefined' && capabilities.webkitAudioContext === 'undefined')) {
        expect(browserName).toBe('webkit')
        expect(capabilities).toMatchObject({ VideoDecoder: 'undefined', AudioDecoder: 'undefined', AudioContext: 'undefined', webkitAudioContext: 'undefined' })
        await expect.poll(() => page.evaluate(() => window.art.video.error?.code)).toBe(4)
        expect(await page.evaluate(() => window.art.video.error.message)).toMatch(/not a constructor/)
        expect(await page.evaluate(() => ({ ready: window.art.isReady, width: window.art.video.videoWidth, height: window.art.video.videoHeight }))).toEqual({ ready: false, width: 0, height: 0 })
        outcome = 'verified-unsupported-capability-control'
      }
      else {
        await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => window.art.video.currentTime)).toBeGreaterThan(0.15)
        const pixels = await page.evaluate(() => {
          const canvas = window.art.video
          const context = canvas.getContext('2d')
          return { size: [canvas.width, canvas.height, canvas.videoWidth, canvas.videoHeight], corner: [...context.getImageData(0, 0, 1, 1).data], center: [...context.getImageData(160, 90, 1, 1).data] }
        })
        expect(pixels.size).toEqual([320, 180, 320, 180])
        expect(pixels.corner[0]).toBeGreaterThan(200)
        expect(pixels.center[2]).toBeGreaterThan(200)
        expect([pixels.corner[3], pixels.center[3]]).toEqual([255, 255])
        await page.evaluate(() => window.art.video.pause())
        expect(await page.evaluate(() => window.art.video.paused)).toBe(true)
        expect(await page.evaluate(() => window.mbActions)).toEqual([])
        outcome = 'native-mp4-playback-observed'
      }
    }
    finally {
      const state = await page.evaluate(() => {
        const canvas = window.art.video
        return { events: window.mbEvents, actions: window.mbActions, ready: window.art.isReady, dimensions: [canvas.width, canvas.height, canvas.videoWidth, canvas.videoHeight], paused: canvas.paused, currentTime: canvas.currentTime, error: canvas.error, readyState: canvas.readyState, audioState: canvas.engine?.audio?.audioContext?.state }
      })
      await testInfo.attach('mediabunny-input', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), capabilities, outcome, state, scope: 'Two actual published proxies with actual core5.4.0; native MP4 pixels/clock or explicitly unsupported Windows WebKit APIs. No candidate, HLS or AV-sync acceptance.' }) })
      await page.evaluate(() => window.art.destroy(false))
    }
  })
}

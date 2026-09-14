import fs from 'node:fs'
import { hash, readMember } from '../../refactor/scripts/releases.mjs'
import { verifyVastContract } from '../../refactor/scripts/vast-contract.mjs'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { expect, test } from './fixtures.js'

// eslint-disable-next-line antfu/no-top-level-await -- Select the complete source or installed SDK bundle before discovery.
const { code, provenance } = await browserCandidate('artplayer-plugin-vast')
// eslint-disable-next-line antfu/no-top-level-await -- Verify immutable published bytes before native test discovery.
const contract = await verifyVastContract()
const historicalCode = readMember(contract.archives.get('artplayer-plugin-vast@1.0.0'), 'package/dist/artplayer-plugin-vast.js').toString()
const mediaFile = 'docs/assets/vast/linear-video.mp4'

test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => ({
    registration: window.nativeVastRegistration,
    error: window.nativeVastError,
    imaVersion: window.google?.ima?.VERSION,
    events: window.nativeVastEvents,
    mediaSamples: window.nativeVastMediaSamples,
    videos: [...document.querySelectorAll('video')].map(video => ({ src: video.currentSrc, time: video.currentTime, duration: video.duration, width: video.videoWidth, height: video.videoHeight, paused: video.paused, ended: video.ended })),
    containerConnected: window.nativeVastContext?.container?.isConnected,
    coreVersion: window.Artplayer?.version,
  }))
  await testInfo.attach('native-vast-state', { contentType: 'application/json', body: JSON.stringify(state) })
  await page.evaluate(() => window.art?.destroy())
  await page.evaluate(() => {
    if (window.nativeVastHistorical)
      window.nativeVastContext?.imaPlayer?.destroy()
  })
})

for (const core of ['published-5.1.7', 'published', 'candidate']) {
  for (const implementation of ['npm-default', 'workspace-1.2', 'published-1.0.0']) {
    const compatibility = implementation === 'workspace-1.2' ? implementation : undefined
    const historical = implementation === 'published-1.0.0'
    const bundle = historical ? historicalCode : code
    test(`real IMA ${core} / ${implementation} plays local VAST media and resumes content`, async ({ page }, testInfo) => {
      await page.goto(`/test/player.html?core=${core}`)
      await page.addScriptTag({ content: bundle })
      await testInfo.attach('native-vast-inputs', { contentType: 'application/json', body: JSON.stringify({ sourceSha256: hash(bundle), provenance: historical ? { kind: 'published', name: 'artplayer-plugin-vast', version: '1.0.0' } : provenance, sdk: historical ? 'immutable npm1.0.0 bundled SDK; real remote Google IMA' : '@glomex/vast-ima-player@1.21.2 bundled; real remote Google IMA', media: { file: mediaFile, sha256: hash(fs.readFileSync(mediaFile)), contentFile: 'docs/assets/sample/video.mp4', contentSha256: hash(fs.readFileSync('docs/assets/sample/video.mp4')) }, implementation, core, compatibility: compatibility || 'npm-default' }) })
      await page.evaluate(({ compatibility, historical }) => {
        window.nativeVastHistorical = historical
        window.nativeVastEvents = []
        window.nativeVastMediaSamples = []
        window.nativeVastRegistration = 'pending'
        window.createPlayer('/assets/sample/video.mp4')
        const factory = window.artplayerPluginVast.default || window.artplayerPluginVast
        window.art.plugins.add(factory((context) => {
          window.nativeVastContext = context
          const player = context.init?.() || context.imaPlayer
          for (const type of ['AdStarted', 'AdComplete', 'AdAllAdsCompleted', 'AdContentPauseRequested', 'AdContentResumeRequested', 'AdError', 'MediaResumed']) {
            player.addEventListener(type, (event) => {
              window.nativeVastEvents.push({ type, at: performance.now(), contentTime: window.art.currentTime, contentPaused: window.art.template.$video.paused, error: event.detail?.error && { code: event.detail.error.errorCode, vastCode: event.detail.error.vastErrorCode, message: event.detail.error.message } })
            })
          }
        }, compatibility ? { compatibility } : undefined)).then(() => {
          window.nativeVastRegistration = 'ready'
        }).catch((error) => {
          window.nativeVastRegistration = 'failed'
          window.nativeVastError = String(error)
        })
      }, { compatibility, historical })
      await expect.poll(() => page.evaluate(() => window.nativeVastRegistration)).not.toBe('pending')
      expect(await page.evaluate(() => window.nativeVastRegistration)).toBe('ready')
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.5)
      await page.evaluate(() => {
        const origin = location.origin
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<VAST version="3.0"><Ad id="artplayer-local"><InLine>
<AdSystem version="1">ArtPlayer test fixture</AdSystem><AdTitle>Local SDK validation</AdTitle>
<Impression><![CDATA[${origin}/assets/vast/nonlinear-320x50.png?tracking=impression]]></Impression>
<Creatives><Creative><Linear><Duration>00:00:04</Duration><MediaFiles>
<MediaFile delivery="progressive" type="video/mp4" width="640" height="360"><![CDATA[${origin}/assets/vast/linear-video.mp4]]></MediaFile>
</MediaFiles></Linear></Creative></Creatives></InLine></Ad></VAST>`
        window.nativeVastXml = xml
        document.querySelector('#play').onclick = () => window.nativeVastContext.playRes(xml)
      })
      const beforeAd = await page.evaluate(() => window.art.currentTime)
      await testInfo.attach('native-vast-response.xml', { contentType: 'application/xml', body: await page.evaluate(() => window.nativeVastXml) })
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.nativeVastEvents.some(event => event.type === 'AdStarted'))).toBe(true)
      await expect(page.locator('[id^="art-"]')).toBeVisible()
      await expect.poll(() => page.evaluate(() => {
        const videos = [...document.querySelectorAll('video')].map(video => ({ src: video.currentSrc, declaredSrc: video.src, width: video.videoWidth, height: video.videoHeight, time: video.currentTime, readyState: video.readyState, paused: video.paused }))
        window.nativeVastMediaSamples.push({ at: performance.now(), videos })
        return videos.some(video => video.src.includes('/assets/vast/linear-video.mp4') && video.width > 0 && video.height > 0 && video.time > 0)
      })).toBe(true)
      const decodedAd = await page.evaluate(() => [...document.querySelectorAll('video')].map(video => ({ src: video.currentSrc, width: video.videoWidth, height: video.videoHeight, time: video.currentTime })).filter(video => video.src.includes('/assets/vast/linear-video.mp4')))
      expect(decodedAd.some(video => video.width > 0 && video.height > 0)).toBe(true)
      expect(await page.evaluate(() => window.art.template.$video.paused)).toBe(true)
      await testInfo.attach('native-vast-ad.png', { contentType: 'image/png', body: await page.screenshot() })
      await expect.poll(() => page.evaluate(() => window.nativeVastEvents.some(event => event.type === 'AdComplete'))).toBe(true)
      await expect.poll(() => page.evaluate(() => window.nativeVastEvents.some(event => event.type === 'AdContentResumeRequested'))).toBe(true)
      await expect(page.locator('[id^="art-"]')).toBeHidden()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(beforeAd + 0.2)
      expect(await page.evaluate(() => window.nativeVastEvents.filter(event => event.type === 'AdError'))).toEqual([])
      const resumed = await page.evaluate(() => ({ time: window.art.currentTime, paused: window.art.template.$video.paused, width: window.art.template.$video.videoWidth, events: window.nativeVastEvents }))
      expect(resumed.paused).toBe(false)
      expect(resumed.width).toBeGreaterThan(0)
      expect(resumed.events.filter(event => event.type === 'AdStarted')).toHaveLength(1)
      expect(resumed.events.filter(event => event.type === 'AdComplete')).toHaveLength(1)
      expect(resumed.events.findIndex(event => event.type === 'AdStarted')).toBeLessThan(resumed.events.findIndex(event => event.type === 'AdComplete'))
      await testInfo.attach('native-vast-resumed', { contentType: 'application/json', body: JSON.stringify({ beforeAd, decodedAd, ...resumed }) })
      await page.evaluate(() => window.art.destroy())
      await expect(page.locator('[id^="art-"]')).toHaveCount(0)
    })
  }
}

import { hash } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

// eslint-disable-next-line antfu/no-top-level-await -- Bundle the real SDK once before test discovery.
const code = await compilePackage('artplayer-plugin-vast', 'umd')

for (const compatibility of [undefined, 'workspace-1.2']) {
  test(`real IMA ${compatibility || 'npm-default'} recovers from empty VAST, recreates and destroys an active ad`, async ({ page }, testInfo) => {
    await page.goto('/test/player.html?core=candidate')
    await page.addScriptTag({ content: code })
    await page.evaluate(async (compatibility) => {
      window.createPlayer('/assets/sample/video.mp4')
      window.recoveryEvents = []
      window.observeRecoveryPlayer = (player) => {
        for (const type of ['AdError', 'AdStarted', 'AdContentPauseRequested', 'AdContentResumeRequested', 'MediaResumed']) {
          player.addEventListener(type, event => window.recoveryEvents.push({ type, at: performance.now(), time: window.art.currentTime, paused: window.art.template.$video.paused, code: event.detail?.error?.errorCode, message: event.detail?.error?.message }))
        }
      }
      await window.art.plugins.add(window.artplayerPluginVast((context) => {
        window.recoveryContext = context
        window.observeRecoveryPlayer(context.init())
      }, compatibility ? { compatibility } : undefined))
    }, compatibility)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.5)
    await page.evaluate(() => {
      document.querySelector('#play').onclick = () => window.recoveryContext.playRes('<VAST version="3.0"></VAST>')
    })
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.recoveryEvents.filter(event => event.type === 'AdError').length)).toBe(1)
    const failure = await page.evaluate(() => ({ events: window.recoveryEvents, time: window.art.currentTime }))
    expect(failure.events.find(event => event.type === 'AdError').code).toBe(303)
    await expect(page.locator('[id^="art-"]')).toBeHidden()
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(failure.time + 0.2)
    expect(await page.evaluate(() => window.art.template.$video.paused)).toBe(false)
    await page.evaluate(() => {
      const context = window.recoveryContext
      window.firstRecoveryContainer = context.container
      window.art.plugins.artplayerPluginVast.destroy()
      window.observeRecoveryPlayer(context.init())
      const origin = location.origin
      window.recoveryXml = `<?xml version="1.0"?><VAST version="3.0"><Ad id="recovery"><InLine>
<AdSystem version="1">ArtPlayer test fixture</AdSystem><AdTitle>Recovery validation</AdTitle>
<Impression><![CDATA[${origin}/assets/vast/nonlinear-320x50.png?tracking=recovery]]></Impression>
<Creatives><Creative><Linear><Duration>00:00:04</Duration><MediaFiles>
<MediaFile delivery="progressive" type="video/mp4" width="640" height="360"><![CDATA[${origin}/assets/vast/linear-video.mp4]]></MediaFile>
</MediaFiles></Linear></Creative></Creatives></InLine></Ad></VAST>`
      document.querySelector('#play').onclick = () => context.playRes(window.recoveryXml)
    })
    expect(await page.evaluate(() => window.firstRecoveryContainer.isConnected)).toBe(false)
    await page.locator('#play').click()
    await expect.poll(() => page.evaluate(() => window.recoveryEvents.filter(event => event.type === 'AdStarted').length)).toBe(1)
    await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('video')].some(video => video.currentSrc.includes('/assets/vast/linear-video.mp4') && video.videoWidth > 0 && video.currentTime > 0))).toBe(true)
    await expect(page.locator('[id^="art-"]')).toBeVisible()
    await testInfo.attach('native-vast-recovery-ad.png', { contentType: 'image/png', body: await page.screenshot() })
    const state = await page.evaluate(() => {
      const container = window.recoveryContext.container
      window.art.destroy()
      return { oldConnected: window.firstRecoveryContainer.isConnected, activeConnected: container.isConnected, container: window.recoveryContext.container, terminalInit: window.recoveryContext.init(), events: window.recoveryEvents, imaVersion: window.google.ima.VERSION }
    })
    expect(state.oldConnected).toBe(false)
    expect(state.activeConnected).toBe(false)
    expect(state.container).toBeNull()
    expect(state.terminalInit).toBeNull()
    expect(state.events.filter(event => event.type === 'AdError')).toHaveLength(1)
    await expect(page.locator('[id^="art-"]')).toHaveCount(0)
    await testInfo.attach('native-vast-recovery', { contentType: 'application/json', body: JSON.stringify({ sourceSha256: hash(code), compatibility: compatibility || 'npm-default', failure, ...state }) })
    await testInfo.attach('native-vast-recovery.xml', { contentType: 'application/xml', body: await page.evaluate(() => window.recoveryXml) })
  })
}

test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => ({ events: window.recoveryEvents, imaVersion: window.google?.ima?.VERSION, time: window.art?.currentTime, paused: window.art?.template.$video.paused }))
  await testInfo.attach('native-vast-recovery-final', { contentType: 'application/json', body: JSON.stringify(state) })
  await page.evaluate(() => window.art?.destroy())
})

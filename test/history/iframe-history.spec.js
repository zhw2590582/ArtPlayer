import { expect, initialize, test } from './fixtures.js'

for (const core of ['4.5.9', '5.4.0', 'candidate']) {
  for (const relation of ['same', 'cross']) {
    for (const mode of ['paused', 'playing']) {
      test(`Iframe cached history ${core}/${relation}/${mode}`, async ({ page, browserName }, testInfo) => {
        await initialize(page, core, relation, testInfo)
        await page.evaluate(() => window.tool.commit((resolve) => {
          const art = window.art
          art.currentTime = 1
          art.playbackRate = 1.25
          if (art.video.seeking)
            art.video.addEventListener('seeked', () => resolve(true), { once: true })
          else resolve(true)
        }))
        if (mode === 'playing') {
          await page.evaluate(() => window.tool.commit((resolve) => {
            window.art.play().then(() => resolve(true))
          }))
          await expect.poll(() => page.evaluate(() => window.tool.commit(() => {
            return window.art.currentTime
          }))).toBeGreaterThan(1.05)
        }
        const before = await page.evaluate(async () => ({
          parent: window.documentWitness,
          child: await window.tool.commit(() => {
            return { witness: window.documentWitness, version: window.Artplayer.version, currentTime: window.art.currentTime, rate: window.art.playbackRate }
          }),
          document: window.timeline.find(packet => packet.type === 'inject').__artplayerIframe.document,
        }))
        await page.goto('/away.html')
        await page.goBack({ waitUntil: 'commit' })
        await expect.poll(() => page.evaluate(() => window.lifecycle?.some(event => event.type === 'pageshow'))).toBe(true)
        const parent = await page.evaluate(() => ({ witness: window.documentWitness, lifecycle: window.lifecycle }))
        const restored = parent.lifecycle.some(event => event.type === 'pageshow' && event.persisted)
        if (browserName === 'chromium')
          expect(restored, 'The full Chromium channel must actually restore BFCache').toBe(true)
        await expect.poll(() => page.evaluate(() => window.tool.injected)).toBe(true)
        const child = await page.evaluate(() => window.tool.commit(() => {
          return { witness: window.documentWitness, lifecycle: window.lifecycle, version: window.Artplayer.version, currentTime: window.art.currentTime, rate: window.art.playbackRate, held: typeof window.finishHeld, errors: window.fixtureErrors }
        }))
        expect(child.errors).toEqual([])
        if (restored) {
          expect(parent.witness).toBe(before.parent)
          expect(child.witness).toBe(before.child.witness)
          expect(child.lifecycle.some(event => event.type === 'pageshow' && event.persisted)).toBe(true)
          expect(child.rate).toBe(1.25)
          expect(child.currentTime).toBeGreaterThanOrEqual(1)
          expect(child.held).toBe('function')
          await expect.poll(() => page.evaluate(() => window.timeline.some(packet => packet.__artplayerIframe?.phase === 'resume'))).toBe(true)
          const continuity = await page.evaluate(() => ({ old: window.states.old, phases: window.timeline.filter(packet => packet.__artplayerIframe).map(packet => packet.__artplayerIframe.phase), ids: window.timeline.filter(packet => packet.__artplayerIframe).map(packet => packet.__artplayerIframe.document), injects: window.callbacks.filter(packet => packet.type === 'inject').length, privateCallbacks: window.callbacks.filter(packet => packet.type === 'artplayer-tool-iframe:session').length }))
          expect(continuity.ids.every(id => id === before.document)).toBe(true)
          expect(continuity.injects).toBe(1)
          expect(continuity.privateCallbacks).toBe(0)
          expect(continuity.old.status).toBe(continuity.phases.includes('leave') ? 'rejected' : 'pending')
          await page.evaluate(() => window.tool.commit(() => {
            window.finishHeld()
          }))
          await expect.poll(() => page.evaluate(() => window.states.old.status)).not.toBe('pending')
          if (continuity.old.status === 'pending')
            expect(await page.evaluate(() => window.states.old)).toEqual({ status: 'resolved', value: 9 })
          else
            expect(continuity.old).toEqual({ status: 'rejected', error: 'The iframe document has changed' })
        }
        else {
          expect(parent.witness).not.toBe(before.parent)
          expect(child.witness).not.toBe(before.child.witness)
          expect(child.lifecycle.some(event => event.persisted)).toBe(false)
        }
        const playback = await page.evaluate(() => window.tool.commit((resolve) => {
          window.art.play().then(() => {
            const result = { playing: !window.art.video.paused, width: window.art.video.videoWidth }
            resolve(result)
          })
        }))
        expect(playback.playing).toBe(true)
        expect(playback.width).toBeGreaterThan(0)
        await page.evaluate(() => window.tool.commit(() => {
          window.art.destroy()
        }))
        const final = await page.evaluate(() => ({ pending: Object.keys(window.tool.promises).length, errors: window.fixtureErrors }))
        expect(final).toEqual({ pending: 0, errors: [] })
        await testInfo.attach('iframe-history', { contentType: 'application/json', body: JSON.stringify({ outcome: restored ? 'actual-bfcache' : 'reload-control', core, relation, mode, before, parent, child, playback, final, scope: 'Real top-level history with embedded player. Reload controls do not satisfy BFCache acceptance. No simulated pageshow events or document recreation is counted as cached restoration.' }) })
        await page.evaluate(() => window.tool.destroy())
      })
    }
  }
}

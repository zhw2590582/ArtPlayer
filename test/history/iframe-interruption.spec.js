import { expect, initialize, test } from './fixtures.js'

for (const core of ['4.5.9', '5.4.0', 'candidate']) {
  for (const relation of ['same', 'cross']) {
    for (const mode of ['stop', '204', 'reset']) {
      test(`Iframe interrupted navigation ${core}/${relation}/${mode}`, async ({ page, request, diagnostics }, testInfo) => {
        const id = await initialize(page, core, relation, testInfo)
        const original = await page.evaluate(() => ({ source: window.targetFrame.src, document: window.timeline.find(packet => packet.type === 'inject').__artplayerIframe.document }))
        const witness = await page.evaluate(() => window.tool.commit(() => {
          return window.documentWitness
        }))
        const stall = new URL(`/stall?case=${id}`, original.source).href
        await page.evaluate((stall) => {
          window.targetFrame.src = stall
          window.track('queued', window.tool.commit(() => {
            window.executions = (window.executions || 0) + 1
            return new URL(location.href).searchParams.get('epoch')
          }))
        }, stall)
        await expect.poll(async () => (await (await request.get(`/status?case=${id}`)).json()).pending).toBe(true)
        expect(await page.evaluate(() => window.tool.injected)).toBe(false)
        expect(await page.evaluate(() => window.states.queued.status)).toBe('pending')
        if (mode === 'stop')
          await diagnostics.stopLoading()
        else
          expect((await request.get(`/release?case=${id}&mode=${mode}`)).ok()).toBe(true)
        await expect.poll(async () => (await (await request.get(`/status?case=${id}`)).json()).pending).toBe(false)
        if (mode === 'reset') {
          await expect.poll(() => page.evaluate(() => window.states.old.status)).toBe('rejected')
          expect(await page.evaluate(() => window.states.old.error)).toBe('The iframe document has changed')
        }
        else {
          await page.evaluate(() => window.targetFrame.contentWindow.postMessage({ type: 'history-fixture-finish' }, '*'))
          await expect.poll(() => page.evaluate(() => window.timeline.some(packet => packet.type === 'history-fixture-old-document'))).toBe(true)
          expect(await page.evaluate(() => window.timeline.find(packet => packet.type === 'history-fixture-old-document').data)).toEqual({ witness, executions: 0 })
          await expect.poll(() => page.evaluate(() => window.states.old.status)).toBe('resolved')
          expect(await page.evaluate(() => window.states.old.value)).toBe(9)
        }
        expect(await page.evaluate(() => window.states.queued.status)).toBe('pending')
        const finalUrl = new URL(original.source)
        finalUrl.searchParams.set('epoch', '2')
        await page.evaluate(url => window.targetFrame.src = url, finalUrl.href)
        await expect.poll(() => page.evaluate(() => window.states.queued.status)).toBe('resolved')
        expect(await page.evaluate(() => window.states.queued.value)).toBe('2')
        await expect.poll(() => page.evaluate(() => window.tool.commit(() => {
          return window.art.video.readyState >= 2
        }))).toBe(true)
        const recovered = await page.evaluate(() => ({ states: window.states, pending: Object.keys(window.tool.promises).length, document: window.timeline.filter(packet => packet.type === 'inject').at(-1).__artplayerIframe.document }))
        expect(recovered.document).not.toBe(original.document)
        expect(recovered.pending).toBe(0)
        await page.evaluate((stall) => {
          window.targetFrame.src = stall
          window.track('cleanup', window.tool.commit(() => {
            return 'must not execute'
          }))
        }, stall)
        await expect.poll(async () => (await (await request.get(`/status?case=${id}`)).json()).pending).toBe(true)
        await page.evaluate(() => {
          window.tool.destroy()
          window.targetFrame.remove()
        })
        await expect.poll(() => page.evaluate(() => window.states.cleanup.status)).toBe('rejected')
        expect(await page.evaluate(() => window.states.cleanup.error)).toBe('The instance has been destroyed')
        await expect.poll(async () => (await (await request.get(`/status?case=${id}`)).json()).pending).toBe(false)
        await testInfo.attach('iframe-interruption', { contentType: 'application/json', body: JSON.stringify({ outcome: 'recovered-and-cleaned', core, relation, mode, original, recovered, scope: 'Native browser stop (Chromium Page.stopLoading; other engines top window.stop), HTTP 204 without document replacement, or truncated committed HTTP response. New requests wait for actual injection; applications resume through a later valid navigation or destroy. No implicit timeout or automatic failed-navigation recovery is claimed.' }) })
      })
    }
  }
}

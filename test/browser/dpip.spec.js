import { dpipHistorical } from '../helpers/dpip.js'
import { setupDpip as setup } from './dpip-helpers.js'
import { expect, test } from './fixtures.js'

const implementations = await dpipHistorical()

for (const implementation of implementations) {
  for (const core of ['published', 'candidate']) {
    test(`Document PiP ${implementation.name}/${core}: real DOM migration and pagehide restore preserve media and controls`, async ({ page }, testInfo) => {
      await setup(page, core, implementation, testInfo)
      await page.evaluate(() => {
        window.dpipOpening = window.dpip.open()
        window.resolveDpip(0)
      })
      await page.evaluate(() => window.dpipOpening)
      await expect.poll(() => page.evaluate(() => window.dpipVideo.videoWidth)).toBe(testInfo.project.name === 'webkit' ? 640 : 320)
      expect(await page.evaluate(() => ({ active: window.dpip.isActive, adopted: window.dpipPlayer.ownerDocument === window.dpipEvidence.windows[0].popup.document, videoIdentity: window.dpipVideo === window.art.video, placeholder: window.dpipParent.querySelectorAll('.artplayer-document-pip-placeholder').length, width: window.dpipVideo.videoWidth }))).toEqual({ active: true, adopted: true, videoIdentity: true, placeholder: 1, width: testInfo.project.name === 'webkit' ? 640 : 320 })
      await page.evaluate(() => {
        const popup = window.dpipEvidence.windows[0].popup
        popup.dispatchEvent(new popup.Event('pagehide'))
        popup.dispatchEvent(new popup.Event('unload'))
      })
      await expect.poll(() => page.evaluate(() => window.dpip.isActive)).toBe(false)
      expect(await page.evaluate(() => ({ restored: window.dpipPlayer.parentNode === window.dpipParent && window.dpipPlayer.ownerDocument === document, videoIdentity: window.art.video === window.dpipVideo, placeholders: document.querySelectorAll('.artplayer-document-pip-placeholder').length, closed: window.dpipEvidence.windows[0].closed, events: window.dpipEvidence.events }))).toEqual({ restored: true, videoIdentity: true, placeholders: 0, closed: true, events: [true, false] })
      await page.evaluate(() => window.art.destroy())
    })

    test(`Document PiP ${implementation.name}/${core}: historical pending close and moved placeholder fail in real DOM`, async ({ page }, testInfo) => {
      await setup(page, core, implementation, testInfo)
      await page.evaluate(async () => {
        window.dpipOpening = window.dpip.open()
        await window.dpip.close()
        window.resolveDpip(0)
        await window.dpipOpening
      })
      expect(await page.evaluate(() => window.dpip.isActive)).toBe(true)
      await page.evaluate(async () => {
        document.body.appendChild(document.querySelector('.artplayer-document-pip-placeholder'))
        const closing = window.dpip.close()
        window.dpipFailureSnapshot = { active: window.dpip.isActive, detached: window.dpipPlayer.parentNode === null, closed: window.dpipEvidence.windows[0].closed, notice: window.art.template.$noticeInner.textContent }
        await closing
      })
      expect(await page.evaluate(() => window.dpipFailureSnapshot)).toEqual({ active: true, detached: true, closed: false, notice: 'Document Picture-in-Picture close failed' })
      await page.evaluate(async () => {
        window.dpipParent.appendChild(document.querySelector('.artplayer-document-pip-placeholder'))
        await window.dpip.close()
        window.art.destroy()
      })
    })
  }
}

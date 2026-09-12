import { dpipCandidate } from '../helpers/dpip.js'
import { setupDpip } from './dpip-helpers.js'
import { expect, test } from './fixtures.js'

const implementation = await dpipCandidate()

for (const core of ['published', 'candidate']) {
  test(`Document PiP candidate/${core}: concurrent opens coalesce and a moved placeholder restores the native node`, async ({ page }, testInfo) => {
    await setupDpip(page, core, implementation, testInfo)
    await page.evaluate(() => {
      window.firstDpipOpen = window.dpip.open()
      window.secondDpipOpen = window.dpip.open()
    })
    expect(await page.evaluate(() => window.dpipEvidence.requests.length)).toBe(1)
    await page.evaluate(async () => {
      window.resolveDpip(0)
      await Promise.all([window.firstDpipOpen, window.secondDpipOpen])
    })
    expect(await page.evaluate(() => ({ active: window.dpip.isActive, adopted: window.dpipPlayer.ownerDocument === window.dpipEvidence.windows[0].popup.document, sameVideo: window.art.video === window.dpipVideo }))).toEqual({ active: true, adopted: true, sameVideo: true })
    await page.evaluate(async () => {
      document.body.appendChild(document.querySelector('.artplayer-document-pip-placeholder'))
      await window.dpip.close()
    })
    expect(await page.evaluate(() => ({ active: window.dpip.isActive, restored: window.dpipPlayer.parentNode === window.dpipParent && window.dpipPlayer.ownerDocument === document, closed: window.dpipEvidence.windows[0].closed, placeholder: document.querySelectorAll('.artplayer-document-pip-placeholder').length, styles: window.dpipEvidence.windows[0].popup.document.head.children.length, events: window.dpipEvidence.events }))).toEqual({ active: false, restored: true, closed: true, placeholder: 0, styles: 0, events: [true, false] })
    await page.evaluate(() => window.art.destroy())
  })

  test(`Document PiP candidate/${core}: close and destroy revoke pending window requests before they resolve`, async ({ page }, testInfo) => {
    await setupDpip(page, core, implementation, testInfo)
    await page.evaluate(async () => {
      const opening = window.dpip.open()
      await window.dpip.close()
      await opening
      window.resolveDpip(0)
    })
    await expect.poll(() => page.evaluate(() => window.dpipEvidence.windows[0].closed)).toBe(true)
    expect(await page.evaluate(() => ({ active: window.dpip.isActive, restored: window.dpipPlayer.parentNode === window.dpipParent, events: window.dpipEvidence.events }))).toEqual({ active: false, restored: true, events: [] })
    await page.evaluate(async () => {
      const opening = window.dpip.open()
      window.art.destroy()
      await opening
      window.resolveDpip(1)
    })
    await expect.poll(() => page.evaluate(() => window.dpipEvidence.windows[1].closed)).toBe(true)
    await page.evaluate(async () => {
      await window.dpip.open()
      window.dpip.toggle()
    })
    expect(await page.evaluate(() => ({ active: window.dpip.isActive, requests: window.dpipEvidence.requests.length, placeholders: document.querySelectorAll('.artplayer-document-pip-placeholder').length }))).toEqual({ active: false, requests: 2, placeholders: 0 })
  })

  test(`Document PiP candidate/${core}: interrupted native adoption rolls back without leaving a root or style nodes`, async ({ page }, testInfo) => {
    await setupDpip(page, core, implementation, testInfo)
    await page.evaluate(async () => {
      const opening = window.dpip.open()
      window.resolveDpip(0)
      window.dpipEvidence.windows[0].popup.document.adoptNode = () => {
        throw new DOMException('controlled adoption failure', 'NotSupportedError')
      }
      await opening
    })
    expect(await page.evaluate(() => ({ active: window.dpip.isActive, restored: window.dpipPlayer.parentNode === window.dpipParent, closed: window.dpipEvidence.windows[0].closed, placeholder: document.querySelectorAll('.artplayer-document-pip-placeholder').length, roots: window.dpipEvidence.windows[0].popup.document.body.children.length, styles: window.dpipEvidence.windows[0].popup.document.head.children.length }))).toEqual({ active: false, restored: true, closed: true, placeholder: 0, roots: 0, styles: 0 })
    await page.evaluate(() => window.art.destroy())
  })
}

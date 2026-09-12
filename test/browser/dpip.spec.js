import { hash } from '../../refactor/scripts/releases.mjs'
import { dpipHistorical } from '../helpers/dpip.js'
import { expect, test } from './fixtures.js'

const implementations = await dpipHistorical()

async function setup(page, core, implementation, testInfo) {
  await page.goto(`/test/player.html?core=${core}`)
  await page.evaluate(() => {
    window.dpipEvidence = { nativeCapability: typeof window.documentPictureInPicture?.requestWindow === 'function', scope: 'real DOM iframe with controlled requestWindow; not native Document PiP', windows: [], requests: [], events: [] }
    Object.defineProperty(window, 'documentPictureInPicture', { configurable: true, value: {
      requestWindow(option) {
        return new Promise((resolve) => {
          window.dpipEvidence.requests.push({ option, resolve })
        })
      },
    } })
    window.resolveDpip = (index) => {
      const frame = document.createElement('iframe')
      frame.width = '640'
      frame.height = '360'
      frame.style.cssText = 'display:block;border:0;width:640px;height:360px'
      document.body.appendChild(frame)
      const popup = frame.contentWindow
      const record = { frame, popup, closed: false }
      Object.defineProperty(popup, 'close', { configurable: true, value: () => {
        record.closed = true
      } })
      window.dpipEvidence.windows.push(record)
      window.dpipEvidence.requests[index].resolve(popup)
    }
  })
  await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${implementation.code}; window.dpipFactory = module.exports.default || module.exports; })();` })
  await page.evaluate(() => {
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, plugins: [window.dpipFactory()] })
    window.dpip = window.art.plugins.artplayerPluginDocumentPip
    window.dpipPlayer = window.art.template.$player
    window.dpipVideo = window.art.video
    window.dpipParent = window.dpipPlayer.parentNode
    window.art.on('document-pip', active => window.dpipEvidence.events.push(active))
  })
  await expect.poll(() => page.evaluate(() => window.art.video.readyState)).toBeGreaterThanOrEqual(2)
  await testInfo.attach('dpip-input', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), core, ...(await page.evaluate(() => ({ capability: window.dpipEvidence.nativeCapability, scope: window.dpipEvidence.scope }))) }) })
}

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

import { hash } from '../../refactor/scripts/releases.mjs'
import { expect } from './fixtures.js'

export async function setupDpip(page, core, implementation, testInfo) {
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

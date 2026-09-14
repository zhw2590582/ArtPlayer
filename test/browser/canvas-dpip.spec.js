import assert from 'node:assert/strict'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { canvasCandidate } from '../helpers/canvas.js'
import { dpipCandidate } from '../helpers/dpip.js'
import { expect, test } from './fixtures.js'

const canvas = await canvasCandidate()
const dpip = await dpipCandidate()
if (process.env.ARTPLAYER_BROWSER_ARTIFACTS)
  assert(canvas.name === 'candidate-installed' && dpip.name === 'candidate-installed', 'Installed Canvas PiP requires both verified packages')

for (const core of ['published', 'candidate']) {
  for (const ending of ['close', 'native-close', 'destroy']) {
    test(`${core}: canvas and subtitles survive native Document PiP ${ending}`, async ({ page, context, browserName }, testInfo) => {
      await page.route('**/canvas-pip.vtt', route => route.fulfill({ contentType: 'text/vtt', body: 'WEBVTT\n\n00:00:00.000 --> 00:00:03.000\nOpening caption\n\n00:00:03.000 --> 00:00:08.000\nPiP caption\n' }))
      await page.goto(`/test/player.html?core=${core}`)
      const supported = await page.evaluate(() => typeof window.documentPictureInPicture?.requestWindow === 'function')
      const evidence = { core, ending, browserName, supported, canvas: { name: canvas.name, sha256: hash(canvas.source) }, dpip: { name: dpip.name, sha256: hash(dpip.code) }, outcome: 'incomplete' }
      if (!supported) {
        evidence.outcome = 'native-document-pip-unavailable'
        await testInfo.attach('canvas-dpip', { contentType: 'application/json', body: JSON.stringify(evidence) })
        return
      }
      await page.addScriptTag({ content: `(() => {
        const pending = new Set();
        const requestAnimationFrame = callback => { const id = window.requestAnimationFrame(time => { pending.delete(id); callback(time); }); pending.add(id); return id; };
        const cancelAnimationFrame = id => { pending.delete(id); window.cancelAnimationFrame(id); };
        const module = { exports: {} }; const exports = module.exports;
        ${canvas.source}; window.canvasFactory = module.exports.default || module.exports;
        window.canvasPending = pending;
      })();` })
      await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${dpip.code}; window.dpipFactory = module.exports.default || module.exports; })();` })
      await page.evaluate(() => {
        window.canvasDraws = 0
        window.canvasErrors = []
        window.canvasPipEvents = []
        window.art = new window.Artplayer({
          container: '.player',
          url: '/test/pattern.mp4',
          muted: true,
          loop: true,
          subtitle: { url: '/canvas-pip.vtt' },
          proxy: window.canvasFactory((context, video) => {
            window.canvasDraws++
            window.canvasContext = context
            window.canvasVideo = video
          }),
          plugins: [window.dpipFactory({ fallbackToVideoPiP: false })],
        })
        window.originalCanvas = window.art.video
        window.originalPlayer = window.art.template.$player
        window.originalParent = window.originalPlayer.parentNode
        window.pip = window.art.plugins.artplayerPluginDocumentPip
        window.art.on('document-pip', active => window.canvasPipEvents.push(active))
        window.art.on('artplayerProxyCanvas:error', error => window.canvasErrors.push(String(error)))
        document.querySelector('#play').onclick = () => window.art.play()
        const open = document.createElement('button')
        open.id = 'canvas-open-pip'
        open.textContent = 'Open Canvas PiP'
        open.onclick = () => {
          window.openingCanvasPip = window.pip.open()
        }
        document.body.append(open)
      })
      try {
        await expect.poll(() => page.evaluate(() => window.art.isReady && window.art.subtitle.cues.length === 2)).toBe(true)
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => window.canvasDraws)).toBeGreaterThan(1)
        const popupPromise = context.waitForEvent('page', { timeout: 8000 })
        await page.click('#canvas-open-pip')
        const popup = await popupPromise
        await page.evaluate(() => window.openingCanvasPip)
        await expect(popup.locator('canvas.art-video')).toBeVisible()
        evidence.entered = await page.evaluate(() => ({
          active: window.pip.isActive,
          sameCanvas: window.art.video === window.originalCanvas,
          playerAdopted: window.originalPlayer.ownerDocument === window.documentPictureInPicture.window.document,
          videoAdopted: window.canvasVideo.ownerDocument === window.originalPlayer.ownerDocument,
          trackAdopted: window.art.template.$track.ownerDocument === window.originalPlayer.ownerDocument,
          time: window.art.currentTime,
          draws: window.canvasDraws,
        }))
        expect(evidence.entered.active && evidence.entered.sameCanvas && evidence.entered.playerAdopted && evidence.entered.videoAdopted && evidence.entered.trackAdopted).toBe(true)
        await expect.poll(() => page.evaluate(() => window.canvasDraws)).toBeGreaterThan(evidence.entered.draws + 2)
        await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(evidence.entered.time + 0.1)
        await page.evaluate(() => {
          window.art.pause()
          window.art.currentTime = 4
        })
        await expect(popup.locator('.art-subtitle')).toHaveText('PiP caption')
        await expect.poll(() => page.evaluate(() => window.canvasPending.size)).toBe(0)
        expect(await page.evaluate(() => window.canvasContext.getImageData(0, 0, 1, 1).data[3])).toBe(255)
        if (ending === 'destroy') {
          await page.evaluate(() => window.art.destroy(false))
        }
        else {
          if (ending === 'native-close')
            await page.evaluate(() => window.documentPictureInPicture.window.close())
          else await page.evaluate(() => window.pip.close())
          await expect.poll(() => page.evaluate(() => window.pip.isActive)).toBe(false)
          expect(await page.evaluate(() => window.originalPlayer.parentNode === window.originalParent && window.canvasVideo.ownerDocument === document && window.originalCanvas === window.art.video)).toBe(true)
          await expect(page.locator('.art-subtitle')).toHaveText('PiP caption')
          await page.click('#play')
          await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(4.1)
          await page.evaluate(() => window.art.destroy(false))
        }
        await expect.poll(() => page.evaluate(() => !window.documentPictureInPicture.window || window.documentPictureInPicture.window.closed)).toBe(true)
        const draws = await page.evaluate(() => window.canvasDraws)
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        evidence.final = await page.evaluate(() => ({ active: window.pip.isActive, connected: window.canvasVideo.isConnected, paused: window.canvasVideo.paused, src: window.canvasVideo.getAttribute('src'), pending: window.canvasPending.size, draws: window.canvasDraws, placeholders: document.querySelectorAll('.artplayer-document-pip-placeholder').length, events: window.canvasPipEvents, errors: window.canvasErrors }))
        expect(evidence.final).toEqual({ active: false, connected: false, paused: true, src: null, pending: 0, draws, placeholders: 0, events: ending === 'destroy' ? [true] : [true, false], errors: [] })
        evidence.outcome = 'native-window-playback-subtitles-and-cleanup'
      }
      finally {
        evidence.observed = await page.evaluate(() => ({ active: window.pip?.isActive, paused: window.canvasVideo?.paused, time: window.canvasVideo?.currentTime, draws: window.canvasDraws, subtitle: window.art?.template.$subtitle?.textContent, errors: window.canvasErrors, events: window.canvasPipEvents }))
        await page.evaluate(() => {
          if (!window.art.isDestroy)
            window.art.destroy(false)
          window.documentPictureInPicture.window?.close()
        })
        await testInfo.attach('canvas-dpip', { contentType: 'application/json', body: JSON.stringify(evidence) })
      }
    })
  }
}

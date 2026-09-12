import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { dpipCandidate } from '../helpers/dpip.js'
import { mbCandidate } from '../helpers/mediabunny.js'
import { expect, test } from './fixtures.js'

const dpip = await dpipCandidate()
const mb = await mbCandidate()
const canvas = fs.readFileSync(new URL('../../packages/artplayer-proxy-canvas/dist/artplayer-proxy-canvas.js', import.meta.url), 'utf8')

for (const core of ['published', 'candidate']) {
  for (const renderer of ['video', 'canvas', 'mediabunny']) {
    test(`Document PiP native ${core}/${renderer}: repeated windows and real keyboard`, async ({ page, context }, testInfo) => {
      await page.goto(`/test/player.html?core=${core}`)
      const supported = await page.evaluate(() => typeof window.documentPictureInPicture?.requestWindow === 'function')
      const evidence = { core, renderer, supported, dpipSha256: hash(dpip.code), proxySha256: renderer === 'video' ? null : hash(renderer === 'canvas' ? canvas : mb.code), outcome: 'incomplete', rounds: [] }
      if (!supported) {
        evidence.outcome = 'native-document-pip-unavailable'
        await testInfo.attach('dpip-native', { contentType: 'application/json', body: JSON.stringify(evidence) })
        return
      }
      for (const [code, name] of [[dpip.code, 'dpipFactory'], [canvas, 'canvasFactory'], [mb.code, 'mbFactory']])
        await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${code}; window.${name} = module.exports.default || module.exports; })();` })
      await page.evaluate((renderer) => {
        const proxy = renderer === 'video' ? {} : { proxy: renderer === 'canvas' ? window.canvasFactory() : window.mbFactory() }
        window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, ...proxy, plugins: [window.dpipFactory({ fallbackToVideoPiP: false })] })
        window.dpip = window.art.plugins.artplayerPluginDocumentPip
        window.dpipMedia = window.art.video
        window.dpipParent = window.art.template.$player.parentNode
        window.dpipEvents = []
        window.dpipKeys = 0
        window.art.on('document-pip', value => window.dpipEvents.push(value))
        window.art.hotkey.add('KeyQ', () => window.dpipKeys++)
        const probe = document.createElement('button')
        probe.id = 'keyboard-probe'
        probe.textContent = 'Keyboard probe'
        probe.style.cssText = 'position:absolute;top:20px;left:20px;z-index:9999'
        window.art.template.$player.append(probe)
        document.querySelector('#play').onclick = () => window.art.play()
        const open = document.createElement('button')
        open.id = 'open-native-pip'
        open.textContent = 'Open PiP'
        open.onclick = () => {
          window.dpipOpening = window.dpip.open()
        }
        document.body.append(open)
      }, renderer)
      try {
        await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
        await page.click('#play')
        let keys = 0
        for (let round = 0; round < 2; round++) {
          const popupPromise = context.waitForEvent('page', { timeout: 8000 })
          await page.click('#open-native-pip')
          const popup = await popupPromise
          await page.evaluate(() => window.dpipOpening)
          await expect(popup.locator('#keyboard-probe')).toBeVisible()
          expect(await page.evaluate(() => window.art.video === window.dpipMedia && window.art.template.$player.ownerDocument === window.documentPictureInPicture.window.document)).toBe(true)
          const before = await page.evaluate(() => window.art.currentTime)
          await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(before + 0.2)
          await popup.locator('#keyboard-probe').click()
          await popup.keyboard.press('q')
          await expect.poll(() => page.evaluate(() => window.dpipKeys)).toBe(++keys)
          const input = await popup.evaluate(() => {
            const input = document.createElement('input')
            input.id = 'editable-probe'
            document.querySelector('.art-video-player').append(input)
            return input.id
          })
          await popup.locator(`#${input}`).press('q')
          await expect(popup.locator(`#${input}`)).toHaveValue(core === 'published' ? '' : 'q')
          if (core === 'published')
            keys++
          expect(await page.evaluate(() => window.dpipKeys)).toBe(keys)
          await popup.locator(`#${input}`).evaluate(element => element.remove())
          if (core === 'candidate') {
            await page.evaluate(() => {
              window.Artplayer.FULLSCREEN_WEB_IN_BODY = true
              window.art.fullscreenWeb = true
            })
            expect(await page.evaluate(() => window.art.template.$player.parentNode === window.documentPictureInPicture.window.document.body)).toBe(true)
            await page.evaluate(() => {
              window.art.fullscreenWeb = false
            })
            expect(await popup.locator('.art-video-player').count()).toBe(1)
          }
          await page.evaluate(() => window.documentPictureInPicture.window.close())
          await expect.poll(() => page.evaluate(() => window.dpip.isActive)).toBe(false)
          expect(await page.evaluate(() => window.art.template.$player.parentNode === window.dpipParent && window.art.video === window.dpipMedia && document.querySelectorAll('.artplayer-document-pip-placeholder').length === 0)).toBe(true)
          await page.locator('#keyboard-probe').click()
          await page.keyboard.press('q')
          await expect.poll(() => page.evaluate(() => window.dpipKeys)).toBe(++keys)
          evidence.rounds.push({ round, nativeWindowClosed: popup.isClosed(), keys: await page.evaluate(() => window.dpipKeys) })
        }
        expect(await page.evaluate(() => window.dpipEvents)).toEqual([true, false, true, false])
        evidence.outcome = core === 'published' ? 'native-window-with-historical-editable-hotkey-defect' : 'native-window-media-keyboard-restoration'
      }
      finally {
        await page.evaluate(() => {
          window.art.destroy(false)
          window.documentPictureInPicture.window?.close()
        })
        await testInfo.attach('dpip-native', { contentType: 'application/json', body: JSON.stringify(evidence) })
      }
    })
  }
}

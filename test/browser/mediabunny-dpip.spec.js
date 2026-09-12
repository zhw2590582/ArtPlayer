import assert from 'node:assert/strict'
import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { dpipCandidate } from '../helpers/dpip.js'
import { mbCandidate } from '../helpers/mediabunny.js'
import { expect, test } from './fixtures.js'

const implementation = await mbCandidate()
const dpip = await dpipCandidate()
const manifest = JSON.parse(fs.readFileSync(new URL('./media/hls/manifest.json', import.meta.url)))
const hls = new Map(Object.entries(manifest.files).map(([name, expected]) => {
  const bytes = fs.readFileSync(new URL(`./media/hls/${name}`, import.meta.url))
  assert.equal(hash(bytes), expected.sha256)
  return [name, bytes]
}))
for (const core of ['published', 'candidate']) {
  for (const media of ['video', 'hls']) {
    for (const ending of ['close', 'native-close', 'destroy']) {
      test(`MediaBunny ${implementation.name}: ${core} core native Document PiP ${media} ${ending}`, async ({ page, browserName }, testInfo) => {
        await page.route('**/mb-dpip-hls/**', async (route) => {
          const name = new URL(route.request().url()).pathname.split('/').at(-1)
          const body = hls.get(name)
          await route.fulfill({ status: body ? 200 : 404, body: body || 'Missing fixture', contentType: name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t' })
        })
        await page.goto(`/test/player.html?core=${core}`)
        const supported = await page.evaluate(() => typeof window.documentPictureInPicture?.requestWindow === 'function')
        if (!supported) {
          await testInfo.attach('mediabunny-dpip', { contentType: 'application/json', body: JSON.stringify({ core, media, ending, implementation: implementation.name, sha256: hash(implementation.code), dpipSha256: hash(dpip.code), outcome: 'native-document-pip-unavailable', browserName, supported }) })
          return
        }
        for (const [code, global] of [[implementation.code, 'mbFactory'], [dpip.code, 'dpipFactory']]) {
          await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${code}; window.${global} = module.exports.default || module.exports; })();` })
        }
        await page.evaluate((media) => {
          window.mbDraws = 0
          window.mbPipEvents = []
          window.art = new window.Artplayer({ container: '.player', url: media === 'video' ? '/test/pattern.mp4' : '/mb-dpip-hls/master.m3u8', muted: true, proxy: window.mbFactory(), plugins: [window.dpipFactory({ fallbackToVideoPiP: false })] })
          window.mbCanvas = window.art.video
          window.mbPlayer = window.art.template.$player
          window.mbParent = window.mbPlayer.parentNode
          window.mbPip = window.art.plugins.artplayerPluginDocumentPip
          window.art.on('document-pip', value => window.mbPipEvents.push(value))
          const ctx = window.mbCanvas.getContext('2d')
          const draw = ctx.drawImage.bind(ctx)
          ctx.drawImage = (...args) => {
            window.mbDraws++
            return draw(...args)
          }
          document.querySelector('#play').onclick = () => window.art.play()
          const button = document.createElement('button')
          button.id = 'open-native-pip'
          button.textContent = 'Open native Document PiP'
          button.onclick = () => {
            window.mbOpening = window.mbPip.open()
          }
          document.body.append(button)
        }, media)
        let result
        try {
          await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
          await page.click('#play')
          await expect.poll(() => page.evaluate(() => window.mbCanvas.currentTime)).toBeGreaterThan(0.1)
          await page.click('#open-native-pip')
          await page.evaluate(() => window.mbOpening)
          expect(await page.evaluate(() => window.mbPip.isActive)).toBe(true)
          const before = await page.evaluate(() => ({ time: window.mbCanvas.currentTime, draws: window.mbDraws, adopted: window.mbPlayer.ownerDocument === window.documentPictureInPicture.window.document, sameCanvas: window.mbCanvas === window.art.video, distinctWindow: window.documentPictureInPicture.window !== window, openerVisibility: document.visibilityState }))
          expect(before.adopted).toBe(true)
          expect(before.sameCanvas).toBe(true)
          expect(before.distinctWindow).toBe(true)
          await expect.poll(() => page.evaluate(() => window.mbDraws)).toBeGreaterThan(before.draws + 2)
          await expect.poll(() => page.evaluate(() => window.mbCanvas.currentTime)).toBeGreaterThan(before.time + 0.15)
          if (media === 'hls') {
            await expect.poll(() => page.evaluate(() => window.mbCanvas.engine.audio.queuedNodes.size)).toBeGreaterThan(0)
            if (ending === 'close') {
              await page.evaluate(async () => {
                const state = await window.mbCanvas.getM3u8State()
                await window.mbCanvas.switchM3u8Quality(state.levels.find(level => level.height === 90).id)
                const next = await window.mbCanvas.getM3u8State()
                await window.mbCanvas.switchM3u8Audio(next.audios.find(audio => audio.lang === 'fr').id)
              })
              expect(await page.evaluate(async () => {
                const state = await window.mbCanvas.getM3u8State()
                return { height: state.currentLevel.height, language: state.currentAudio.lang, adopted: window.mbCanvas.ownerDocument === window.documentPictureInPicture.window.document }
              })).toEqual({ height: 90, language: 'fr', adopted: true })
            }
          }
          if (ending !== 'destroy') {
            if (ending === 'native-close')
              await page.evaluate(() => window.documentPictureInPicture.window.close())
            else await page.evaluate(() => window.mbPip.close())
            await expect.poll(() => page.evaluate(() => window.mbPip.isActive)).toBe(false)
            expect(await page.evaluate(() => window.mbPlayer.parentNode === window.mbParent && window.mbPlayer.ownerDocument === document && window.mbCanvas === window.art.video)).toBe(true)
          }
          else {
            await page.evaluate(() => window.art.destroy(false))
            await expect.poll(() => page.evaluate(() => window.mbPip.isActive)).toBe(false)
            expect(await page.evaluate(() => window.mbCanvas.engine.destroyed)).toBe(true)
          }
          result = await page.evaluate(() => ({ events: window.mbPipEvents, placeholders: document.querySelectorAll('.artplayer-document-pip-placeholder').length, nativeWindowClosed: !window.documentPictureInPicture.window || window.documentPictureInPicture.window.closed }))
          expect(result).toEqual({ events: ending === 'destroy' ? [true] : [true, false], placeholders: 0, nativeWindowClosed: true })
          await testInfo.attach('mediabunny-dpip', { contentType: 'application/json', body: JSON.stringify({ core, media, ending, implementation: implementation.name, sha256: hash(implementation.code), dpipSha256: hash(dpip.code), outcome: 'native-document-pip-canvas-playback', before, result, scope: 'Actual requestWindow from a click, no iframe or API replacement; native Canvas decoding and window lifecycle. HLS includes native audio, and close cases change quality/audio inside PiP.' }) })
        }
        finally {
          await page.evaluate(() => {
            if (!window.art.isDestroy)
              window.art.destroy(false)
            window.documentPictureInPicture.window?.close()
          })
        }
      })
    }
  }
}

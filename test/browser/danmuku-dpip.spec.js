import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { observeDanmukuLoad } from '../helpers/danmuku-combination-load.js'
import { dpipCandidate } from '../helpers/dpip.js'
import { expect, test } from './fixtures.js'

const dpip = await dpipCandidate()
const implementations = new Map()
test.beforeAll(async () => {
  const release = JSON.parse(fs.readFileSync('refactor/baselines/danmuku-release.json', 'utf8')).release
  const member = 'package/dist/artplayer-plugin-danmuku.js'
  const published = readMember(await ensureArchive(release), member)
  assert.equal(hash(published), release.files[member])
  implementations.set('published', { input: `npm ${release.version}`, code: published.toString() })
  const candidate = await browserCandidate('artplayer-plugin-danmuku', process.env.ARTPLAYER_DANMUKU_ARTIFACT)
  implementations.set('candidate', { input: candidate.provenance.file || candidate.provenance.kind, ...candidate })
})

for (const core of ['published', 'candidate']) {
  for (const implementation of ['published', 'candidate']) {
    for (const ending of ['close', 'native-close', 'destroy', 'load']) {
      test(`${core}: ${implementation} Danmuku, heatmap and Worker survive native Document PiP ${ending}`, async ({ page, context }, testInfo) => {
        if (ending === 'load')
          test.setTimeout(45000) // Two native PiP loads add 16 seconds of actual media progression.
        const input = implementations.get(implementation)
        const danmuku = input.code
        await testInfo.attach('danmuku-selected-input', { contentType: 'application/json', body: JSON.stringify({ implementation, provenance: input.provenance || { kind: 'published', sha256: hash(danmuku) }, dpip: dpip.provenance || { kind: dpip.name, sha256: hash(dpip.code) } }) })
        await page.goto(`/test/player.html?core=${core}`)
        const supported = await page.evaluate(() => typeof window.documentPictureInPicture?.requestWindow === 'function')
        const evidence = { core, implementation, ending, supported, danmuku: { input: input.input, provenance: input.provenance, sha256: hash(danmuku) }, dpip: { input: dpip.name, provenance: dpip.provenance, sha256: hash(dpip.code) }, outcome: 'incomplete', rounds: [], loads: [] }
        if (!supported) {
          evidence.outcome = 'native-document-pip-unavailable'
          await testInfo.attach('danmuku-dpip', { contentType: 'application/json', body: JSON.stringify(evidence) })
          return
        }
        await page.evaluate(() => {
          window.combinationWorkers = []
          const NativeWorker = window.Worker
          window.Worker = class extends NativeWorker {
            constructor(...args) {
              super(...args)
              this.record = { terminated: 0, replies: 0 }
              window.combinationWorkers.push(this.record)
              this.addEventListener('message', () => this.record.replies++)
            }

            terminate() {
              this.record.terminated++
              return super.terminate()
            }
          }
        })
        await page.addScriptTag({ content: danmuku })
        await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${dpip.code}; window.dpipFactory = module.exports.default || module.exports; })();` })
        await page.evaluate(() => {
          window.combinationVisible = []
          window.combinationErrors = []
          window.combinationEvents = []
          window.art = new window.Artplayer({
            container: '.player',
            url: '/assets/sample/video.mp4',
            muted: true,
            plugins: [window.artplayerPluginDanmuku({ danmuku: [], heatmap: true, emitter: true, speed: 4 }), window.dpipFactory({ fallbackToVideoPiP: false })],
          })
          window.danmuku = window.art.plugins.artplayerPluginDanmuku
          window.danmukuOwner = window.danmuku.config({})
          window.pip = window.art.plugins.artplayerPluginDocumentPip
          window.combinationPlayer = window.art.template.$player
          window.combinationLayer = window.art.template.$danmuku
          window.combinationParent = window.combinationPlayer.parentNode
          window.art.on('document-pip', value => window.combinationEvents.push(value))
          window.art.on('artplayerPluginDanmuku:error', error => window.combinationErrors.push(String(error)))
          window.art.on('artplayerPluginDanmuku:visible', row => window.combinationVisible.push({ text: row.text, ref: row.$ref, time: window.art.currentTime }))
          document.querySelector('#play').onclick = () => window.art.play()
          const open = document.createElement('button')
          open.id = 'danmuku-open-pip'
          open.textContent = 'Open Danmuku PiP'
          open.onclick = () => {
            window.openingDanmukuPip = window.pip.open()
          }
          document.body.append(open)
        })
        try {
          await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
          await page.click('#play')
          await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
          for (let round = 0; round < 2; round++) {
            const popupPromise = context.waitForEvent('page', { timeout: 8000 })
            await page.click('#danmuku-open-pip')
            const popup = await popupPromise
            await page.evaluate(() => window.openingDanmukuPip)
            await expect(popup.locator('video.art-video')).toBeVisible()
            await expect(popup.locator('.artplayer-plugin-danmuku')).toHaveCount(1)
            const text = `PiP row ${round}`
            await page.evaluate(async (text) => {
              await window.danmuku.load([{ text, time: window.art.currentTime + 0.5, mode: 1 }])
            }, text)
            await expect.poll(() => page.evaluate(text => window.combinationVisible.some(row => row.text === text), text)).toBe(true)
            await expect(popup.getByText(text, { exact: true }).and(popup.locator(':visible'))).toBeVisible()
            const snapshot = await page.evaluate((text) => {
              const row = window.combinationVisible.find(row => row.text === text)
              const rect = row.ref.getBoundingClientRect()
              const popup = window.documentPictureInPicture.window
              return {
                time: window.art.currentTime,
                rowTime: row.time,
                width: rect.width,
                height: rect.height,
                adopted: row.ref.ownerDocument === popup.document && window.combinationLayer.ownerDocument === popup.document,
                inLayer: window.combinationLayer.contains(row.ref),
                position: popup.getComputedStyle(row.ref).position,
                player: window.combinationPlayer.ownerDocument === popup.document,
                heatmap: window.art.controls.heatmap.ownerDocument === popup.document && !!window.art.controls.heatmap.querySelector('svg'),
                workers: window.combinationWorkers.map(worker => ({ ...worker })),
              }
            }, text)
            evidence.rounds.push(snapshot)
            expect(snapshot.adopted && snapshot.inLayer && snapshot.player && snapshot.heatmap).toBe(true)
            expect(snapshot.width).toBeGreaterThan(0)
            expect(snapshot.height).toBeGreaterThan(0)
            expect(snapshot.position).toBe('absolute')
            expect(snapshot.workers).toHaveLength(1)
            expect(snapshot.workers[0].replies).toBeGreaterThan(0)
            if (round === 0)
              await testInfo.attach('native-danmuku-page', { contentType: 'image/png', body: await popup.screenshot() })
            if (ending === 'load')
              evidence.loads.push(await observeDanmukuLoad(page, { label: `PiP ${round}`, requireComplete: implementation === 'candidate' }))
            evidence.beforeDestroy = await page.evaluate(() => ({ nodes: window.combinationLayer.children.length }))
            if (round === 1 && ending === 'destroy') {
              await page.evaluate(() => window.art.destroy(false))
            }
            else {
              await page.evaluate(ending => ending === 'native-close' ? window.documentPictureInPicture.window.close() : window.pip.close(), ending)
              await expect.poll(() => page.evaluate(() => window.pip.isActive)).toBe(false)
              expect(await page.evaluate(() => window.combinationPlayer.parentNode === window.combinationParent && window.combinationLayer.ownerDocument === document)).toBe(true)
              await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(snapshot.time + 0.1)
            }
          }
          if (ending !== 'destroy')
            await page.evaluate(() => window.art.destroy(false))
          await expect.poll(() => page.evaluate(() => !window.documentPictureInPicture.window || window.documentPictureInPicture.window.closed)).toBe(true)
          evidence.final = await page.evaluate(() => ({
            active: window.pip.isActive,
            workers: window.combinationWorkers,
            errors: window.combinationErrors,
            events: window.combinationEvents,
            frame: window.danmukuOwner.scheduler?.frame,
            operation: window.danmukuOwner.scheduler?.operation,
            nodes: window.combinationLayer.children.length,
            settings: document.querySelectorAll('.artplayer-plugin-danmuku').length,
            placeholders: document.querySelectorAll('.artplayer-document-pip-placeholder').length,
          }))
          expect(evidence.final.active).toBe(false)
          expect(evidence.final.workers).toHaveLength(1)
          expect(evidence.final.workers[0].terminated).toBe(1)
          expect(evidence.final.errors).toEqual([])
          // Destroy suppresses further public events, as in the existing native PiP contract.
          expect(evidence.final.events).toEqual(ending === 'destroy' ? [true, false, true] : [true, false, true, false])
          if (implementation === 'candidate') {
            expect(evidence.final.frame).toBeNull()
            expect(evidence.final.operation).toBeNull()
            expect(evidence.final.nodes + evidence.final.settings + evidence.final.placeholders).toBe(0)
            evidence.outcome = 'native-playback-danmuku-and-cleanup-passed'
          }
          else {
          // Frozen npm 5.3.0 destroy(false) retains its renderer and Setting nodes.
            expect(evidence.final.nodes).toBe(ending === 'load' ? evidence.beforeDestroy.nodes : 3)
            expect(evidence.final.nodes).toBeGreaterThan(0)
            expect(evidence.final.settings).toBe(1)
            expect(evidence.final.placeholders).toBe(0)
            evidence.outcome = 'native-playback-with-published-retained-dom'
          }
        }
        finally {
          evidence.incompleteLoad = await page.evaluate(() => window.danmukuCombinationLoadResult)
          await testInfo.attach('danmuku-dpip', { contentType: 'application/json', body: JSON.stringify(evidence) })
          await page.evaluate(() => {
            if (window.art && !window.art.isDestroy)
              window.art.destroy(false)
          })
        }
      })
    }
  }
}

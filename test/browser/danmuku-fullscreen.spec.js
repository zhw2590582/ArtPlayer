import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

const implementations = new Map()
test.beforeAll(async () => {
  const release = JSON.parse(fs.readFileSync('refactor/baselines/danmuku-release.json', 'utf8')).release
  const member = 'package/dist/artplayer-plugin-danmuku.js'
  const published = readMember(await ensureArchive(release), member)
  assert.equal(hash(published), release.files[member])
  implementations.set('published', { input: `npm ${release.version}`, code: published.toString() })
  implementations.set('candidate', { input: process.env.ARTPLAYER_DANMUKU_ARTIFACT || 'source UMD', code: process.env.ARTPLAYER_DANMUKU_ARTIFACT ? fs.readFileSync(process.env.ARTPLAYER_DANMUKU_ARTIFACT, 'utf8') : await compilePackage('artplayer-plugin-danmuku', 'umd') })
})

for (const core of ['published', 'candidate']) {
  for (const plugin of ['published', 'candidate']) {
    for (const mode of ['web', 'native']) {
      test(`${core} core / ${plugin} Danmuku: ${mode} fullscreen across three player lifetimes`, async ({ page }, testInfo) => {
        test.setTimeout(45000) // Three independent players, native entry/exit and timestamp-delivered rows.
        await page.goto(`/test/player.html?core=${core}`)
        const input = implementations.get(plugin)
        const evidence = { core, plugin, mode, input: input.input, sha256: hash(input.code), cycles: [], outcome: 'incomplete' }
        await page.evaluate(() => {
          window.fullscreenWorkers = []
          window.fullscreenLifetimes = []
          const NativeWorker = window.Worker
          window.Worker = class extends NativeWorker {
            constructor(...args) {
              super(...args)
              this.record = { replies: 0, terminated: 0 }
              window.fullscreenWorkers.push(this.record)
              this.addEventListener('message', () => this.record.replies++)
            }

            terminate() {
              this.record.terminated++
              return super.terminate()
            }
          }
        })
        await page.addScriptTag({ content: input.code })
        try {
          for (let cycle = 0; cycle < 3; cycle++) {
            await page.evaluate(({ cycle, mode }) => {
              window.fullscreenRows = []
              window.fullscreenErrors = []
              window.fullscreenModes = []
              window.art = new window.Artplayer({
                container: '.player',
                url: '/assets/sample/video.mp4',
                muted: true,
                fullscreen: true,
                fullscreenWeb: true,
                plugins: [window.artplayerPluginDanmuku({ danmuku: [], heatmap: true, emitter: true, speed: 5 })],
              })
              window.fullscreenPlugin = window.art.plugins.artplayerPluginDanmuku
              window.fullscreenOwner = window.fullscreenPlugin.config({})
              const { art, fullscreenModes: modes, fullscreenRows: rows, fullscreenErrors: errors } = window
              window.fullscreenLifetimes.push({ modes, rows, errors })
              art.on(mode === 'native' ? 'fullscreen' : 'fullscreenWeb', active => modes.push(active))
              art.on('artplayerPluginDanmuku:visible', row => rows.push({ text: row.text, time: art.currentTime }))
              art.on('artplayerPluginDanmuku:error', error => errors.push(String(error)))
              const toggle = document.createElement('button')
              toggle.id = 'danmuku-fullscreen-toggle'
              toggle.textContent = `Fullscreen ${cycle}`
              toggle.style.cssText = 'position:absolute;top:10px;left:10px;z-index:9999'
              toggle.onclick = () => {
                if (mode === 'native')
                  window.art.fullscreen = !window.art.fullscreen
                else
                  window.art.fullscreenWeb = !window.art.fullscreenWeb
              }
              window.art.template.$player.append(toggle)
              document.querySelector('#play').onclick = () => window.art.play()
            }, { cycle, mode })
            await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
            await page.click('#play')
            await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
            const width = await page.evaluate(() => window.art.template.$player.clientWidth)
            await page.click('#danmuku-fullscreen-toggle')
            if (mode === 'native')
              await expect.poll(() => page.evaluate(() => (document.fullscreenElement || document.webkitFullscreenElement) === window.art.template.$player)).toBe(true)
            else
              await expect.poll(() => page.evaluate(() => window.art.fullscreenWeb)).toBe(true)
            const text = `Fullscreen row ${cycle}`
            await page.evaluate(async (text) => {
              await window.fullscreenPlugin.load([{ text, time: window.art.currentTime + 0.5, mode: 1 }])
            }, text)
            await expect.poll(() => page.evaluate(text => window.fullscreenRows.some(row => row.text === text), text)).toBe(true)
            // The published renderer retains a hidden measurement node with the same text.
            await expect(page.getByText(text, { exact: true }).and(page.locator(':visible'))).toBeVisible()
            const entered = await page.evaluate(() => ({
              width: window.art.template.$player.clientWidth,
              layerWidth: window.art.template.$danmuku.clientWidth,
              settings: document.querySelectorAll('.artplayer-plugin-danmuku').length,
              heatmaps: document.querySelectorAll('.art-control-heatmap').length,
              time: window.art.currentTime,
            }))
            expect(entered.width).toBeGreaterThan(width)
            expect(entered.layerWidth).toBe(entered.width)
            expect(entered.settings).toBe(1)
            expect(entered.heatmaps).toBe(1)
            await page.evaluate(() => window.art.pause())
            await expect.poll(() => page.evaluate(() => window.art.video.paused)).toBe(true)
            await page.click('#danmuku-fullscreen-toggle')
            if (mode === 'native')
              await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement || document.webkitFullscreenElement))).toBe(false)
            else
              await expect.poll(() => page.evaluate(() => window.art.fullscreenWeb)).toBe(false)
            await expect.poll(() => page.evaluate(() => window.art.template.$player.clientWidth)).toBe(width)
            // Native exit can clear fullscreenElement before its change event is delivered.
            await expect.poll(() => page.evaluate(() => window.fullscreenModes)).toEqual([true, false])
            const after = await page.evaluate(() => {
              const art = window.art
              const owner = window.fullscreenOwner
              const modes = [...window.fullscreenModes]
              art.destroy()
              return {
                modes,
                errors: window.fullscreenErrors,
                roots: document.querySelectorAll('.art-video-player').length,
                settings: document.querySelectorAll('.artplayer-plugin-danmuku').length,
                heatmaps: document.querySelectorAll('.art-control-heatmap').length,
                styles: document.querySelectorAll('style#artplayer-plugin-danmuku').length,
                workers: window.fullscreenWorkers.map(worker => ({ ...worker })),
                frame: owner.scheduler?.frame,
                operation: owner.scheduler?.operation,
              }
            })
            evidence.cycles.push({ cycle, entered, after })
            expect(after.roots + after.settings + after.heatmaps).toBe(0)
            expect(after.styles).toBe(1)
            expect(after.errors).toEqual([])
            expect(after.modes).toEqual([true, false])
            expect(after.workers).toHaveLength(cycle + 1)
            for (const worker of after.workers) {
              expect(worker.replies).toBeGreaterThan(0)
              expect(worker.terminated).toBe(1)
            }
            if (plugin === 'candidate') {
              expect(after.frame).toBeNull()
              expect(after.operation).toBeNull()
            }
          }
          evidence.lifetimes = await page.evaluate(() => window.fullscreenLifetimes)
          for (const [index, lifetime] of evidence.lifetimes.entries()) {
            // BASE-LIFE-18: the frozen core keeps native listeners after destroy.
            const changes = core === 'published' && mode === 'native' ? 3 - index : 1
            expect(lifetime.modes).toEqual(Array.from({ length: changes }, () => [true, false]).flat())
            expect(lifetime.errors).toEqual([])
          }
          evidence.outcome = 'three-lifetimes-fullscreen-playback-cleanup-passed'
        }
        finally {
          await page.evaluate(() => {
            if (window.art && !window.art.isDestroy)
              window.art.destroy()
          })
          await testInfo.attach('danmuku-fullscreen', { contentType: 'application/json', body: JSON.stringify(evidence) })
        }
      })
    }
  }
}

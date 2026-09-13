import fs from 'node:fs'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

let candidate
test.beforeAll(async () => {
  candidate = process.env.ARTPLAYER_DANMUKU_ARTIFACT
    ? fs.readFileSync(process.env.ARTPLAYER_DANMUKU_ARTIFACT, 'utf8')
    : await compilePackage('artplayer-plugin-danmuku', 'umd')
})
async function setup(page, core, format, scenario, testInfo) {
  const external = []
  const origin = new URL(testInfo.project.use.baseURL).origin
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url())
    if (url.origin !== origin) {
      external.push(url.href)
      return route.abort()
    }
    // Same-origin blob URLs are actual inline Worker/media resources, not external requests.
    return route.continue()
  })
  await page.goto(`/test/player.html?core=${core}`)
  await page.evaluate(() => {
    window.danmukuEvidence = { workers: [], events: [], gates: [], sends: [], failures: [] }
    const NativeWorker = window.Worker
    window.Worker = class ObservedNativeWorker extends NativeWorker {
      constructor(url, options) {
        super(url, options)
        this.evidence = { url: String(url), requests: [], replies: [], terminated: 0, errors: [] }
        window.danmukuEvidence.workers.push(this.evidence)
        this.addEventListener('message', ({ data }) => this.evidence.replies.push({ id: data.id, result: data.result ?? null }))
        this.addEventListener('error', event => this.evidence.errors.push(event.message))
      }

      terminate() {
        this.evidence.terminated++
        return super.terminate()
      }

      postMessage(message, ...args) {
        this.evidence.requests.push(structuredClone(message))
        return super.postMessage(message, ...args)
      }
    }
    window.danmukuPlayers = []
    window.danmukuPlugins = []
    window.danmukuNodes = []
    window.danmukuVisibility = new Promise((resolve) => {
      window.releaseDanmukuVisibility = resolve
    })
    window.danmukuSending = new Promise((resolve) => {
      window.releaseDanmukuSending = resolve
    })
  })
  const implementation = { code: candidate, sha256: hash(candidate) }
  await page.addScriptTag({ content: implementation.code })
  await page.evaluate(({ scenario }) => {
    const first = document.querySelector('.player')
    first.id = 'danmuku-player-0'
    first.style.cssText = 'width:640px;height:360px'
    window.createDanmukuPlayer = (index) => {
      const container = index === 0 ? first : document.body.appendChild(document.createElement('div'))
      container.id = `danmuku-player-${index}`
      container.style.cssText = 'width:640px;height:360px'
      const mount = document.createElement('div')
      mount.id = `danmuku-mount-${index}`
      mount.style.cssText = 'width:640px;height:36px;background:#333'
      container.after(mount)
      const art = new window.Artplayer({ container, url: `/test/pattern.mp4?danmuku=${index}`, muted: true, mutex: false, fullscreenWeb: true })
      window.danmukuPlayers[index] = art
      for (const event of ['loaded', 'visible', 'start', 'stop', 'reset', 'destroy', 'config', 'error']) {
        art.on(`artplayerPluginDanmuku:${event}`, (value) => {
          window.danmukuEvidence.events.push({ index, event, time: art.currentTime, id: value?.id, text: value?.text, mode: value?.mode, count: Array.isArray(value) ? value.length : undefined })
          if (event === 'error')
            window.danmukuEvidence.failures.push(String(value))
        })
      }
      const option = {
        danmuku: [],
        heatmap: false,
        speed: 8,
        margin: [10, 10],
        fontSize: 20,
        antiOverlap: true,
        synchronousPlayback: true,
        lockTime: 1,
        ...(scenario === 'settings' ? { mount } : {}),
        filter: danmu => danmu.text !== 'FILTERED',
        beforeVisible: async (danmu) => {
          window.danmukuEvidence.gates.push({ index, id: danmu.id, text: danmu.text })
          if (danmu.text === 'GATED')
            return window.danmukuVisibility
          return danmu.text !== 'DENIED'
        },
        beforeEmit: async (danmu) => {
          window.danmukuEvidence.sends.push({ index, text: danmu.text, mode: danmu.mode })
          return scenario === 'settings' && index === 0 ? window.danmukuSending : true
        },
      }
      art.plugins.add(window.artplayerPluginDanmuku(option))
      window.danmukuPlugins[index] = art.plugins.artplayerPluginDanmuku
      return art
    }
    window.art = window.createDanmukuPlayer(0)
    document.querySelector('#play').onclick = () => window.danmukuPlayers[0].play()
    document.querySelector('#pause').onclick = () => window.danmukuPlayers[0].pause()
  }, { scenario })
  await expect.poll(() => page.evaluate(() => window.art.isReady && window.art.template.$video.videoWidth > 0)).toBe(true)
  await testInfo.attach('danmuku-browser-inputs', { contentType: 'application/json', body: JSON.stringify({ core, plugin: 'artplayer-plugin-danmuku', format, artifact: process.env.ARTPLAYER_DANMUKU_ARTIFACT || 'in-memory source UMD', sha256: implementation.sha256, media: '/test/pattern.mp4', scenario, worker: 'Native Blob Worker, only constructor/message/termination observation; no Worker responses, media clocks, layout or RAF mocked', heatmap: false }) })
  return external
}

async function geometry(page) {
  return page.evaluate(() => (window.danmukuPlayers || []).map((art, index) => {
    const player = art.template.$player.getBoundingClientRect()
    return {
      index,
      playing: art.playing,
      time: art.currentTime,
      rate: art.playbackRate,
      player: { x: player.x, y: player.y, width: player.width, height: player.height },
      nodes: [...art.template.$danmuku.children].map((node) => {
        const rect = node.getBoundingClientRect()
        const style = getComputedStyle(node)
        return { id: node.dataset.id, mode: node.dataset.mode, state: node.dataset.state, text: node.textContent, x: rect.x - player.x, y: rect.y - player.y, width: rect.width, height: rect.height, visibility: style.visibility, display: style.display, transition: node.style.transition, opacity: style.opacity }
      }),
    }
  }))
}

const visibleIds = page => page.evaluate(() => [...new Set(window.danmukuEvidence.events.filter(item => item.event === 'visible' && item.id).map(item => item.id))])

test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('danmuku-layout', { contentType: 'application/json', body: JSON.stringify(await geometry(page)) })
  await testInfo.attach('danmuku-native-page', { contentType: 'image/png', body: await page.screenshot() })
  await page.evaluate(() => {
    for (const art of window.danmukuPlayers || []) {
      if (!art.isDestroy)
        art.destroy()
    }
  })
  const evidence = await page.evaluate(() => ({ workers: [], failures: [], ...window.danmukuEvidence, expectedFailures: window.expectedDanmukuFailures || [], version: window.Artplayer?.version, retainedExternalSettings: [...document.querySelectorAll('[id^="danmuku-mount-"]')].map(node => node.querySelectorAll('.artplayer-plugin-danmuku').length) }))
  await testInfo.attach('danmuku-worker-and-lifecycle', { contentType: 'application/json', body: JSON.stringify(evidence) })
  expect(evidence.failures).toEqual(evidence.expectedFailures)
  for (const worker of evidence.workers) {
    expect(worker.url).toMatch(/^blob:/u)
    expect(worker.errors).toEqual(evidence.expectedFailures.length ? ['controlled track failure'] : [])
    expect(worker.terminated).toBe(1)
  }
})

for (const core of ['published', 'candidate']) {
  for (const format of ['candidate']) {
    const label = `${core} / Candidate Danmuku ${format}`

    test(`${label}: accepted NaN timestamp keeps the historical current-time fallback`, async ({ page }, testInfo) => {
      const external = await setup(page, core, format, 'modes', testInfo)
      const numeric = await page.evaluate(async () => {
        const input = { id: 'nan-time', text: 'NAN FALLBACK', mode: 1, time: Number.NaN }
        const expected = window.art.currentTime + 0.5
        const owner = await window.danmukuPlugins[0].emit(input)
        return { expected, inputTime: input.time, queueTime: owner.queue[0].time, isNaN: Number.isNaN(input.time) }
      })
      expect(numeric.isNaN).toBe(false)
      expect(numeric.inputTime).toBe(numeric.expected)
      expect(numeric.queueTime).toBe(numeric.expected)
      await page.click('#play')
      await expect.poll(() => visibleIds(page)).toContain('nan-time')
      expect(external).toEqual([])
      await testInfo.attach('danmuku-native-numeric-compatibility', { contentType: 'application/json', body: JSON.stringify(numeric) })
    })

    for (const action of ['destroy', 'stop']) {
      test(`${label}: failed recovery respects synchronous ${action} from the error listener`, async ({ page }, testInfo) => {
        const external = await setup(page, core, format, 'modes', testInfo)
        await page.evaluate(() => window.danmukuPlugins[0].emit({ id: 'recovery-row', text: 'RECOVERY', mode: 1, time: 0.5 }))
        await page.click('#play')
        await expect.poll(() => visibleIds(page)).toContain('recovery-row')
        const result = await page.evaluate((action) => {
          const owner = window.danmukuPlugins[0].config({})
          const row = owner.queue[0]
          const trackError = new Error('controlled track failure')
          const rebuildError = new Error('controlled track reconstruction failure')
          window.expectedDanmukuFailures = ['Error: controlled track failure', 'Error: controlled track reconstruction failure']
          owner.worker.dispatchEvent(new ErrorEvent('error', { error: trackError, message: trackError.message, cancelable: true }))
          owner.stop()
          owner.createWorker = () => {
            throw rebuildError
          }
          window.art.on('artplayerPluginDanmuku:error', (error) => {
            if (error === rebuildError) {
              if (action === 'destroy')
                window.art.destroy()
              else owner.stop()
            }
          })
          const before = window.danmukuEvidence.events.length
          const sameOwner = owner.start() === owner
          return { sameOwner, rowState: row.$state, isStop: owner.isStop, isDestroy: window.art.isDestroy, events: window.danmukuEvidence.events.slice(before), workers: window.danmukuEvidence.workers }
        }, action)
        expect(result.sameOwner).toBe(true)
        expect(result.rowState).toBe('stop')
        expect(result.isStop).toBe(true)
        expect(result.isDestroy).toBe(action === 'destroy')
        expect(result.events.filter(event => event.event === 'start')).toEqual([])
        expect(result.workers).toHaveLength(1)
        expect(result.workers[0].terminated).toBe(1)
        expect(external).toEqual([])
        await testInfo.attach('danmuku-native-recovery-reentry', { contentType: 'application/json', body: JSON.stringify({ action, ...result, fault: 'Actual video/DOM/track Worker; dispatch an explicit native ErrorEvent and inject a throwing createWorker recovery seam. This does not claim a real CSP or browser Worker construction failure.' }) })
      })
    }

    for (const action of ['pause', 'reset', 'seek', 'destroy']) {
      test(`${label}: native ${action} cancels pending visibility without blocking later work`, async ({ page }, testInfo) => {
        const external = await setup(page, core, format, 'modes', testInfo)
        await page.evaluate(() => window.danmukuPlugins[0].emit({ id: 'obsolete-gate', text: 'GATED', mode: 1, time: 0.5 }))
        await page.click('#play')
        await expect.poll(() => page.evaluate(() => window.danmukuEvidence.gates.some(item => item.id === 'obsolete-gate'))).toBe(true)
        if (action === 'pause') {
          await page.click('#pause')
          await expect.poll(() => page.evaluate(() => window.danmukuPlugins[0].isStop)).toBe(true)
        }
        if (action === 'seek') {
          await page.evaluate(async () => {
            const sought = new Promise(resolve => window.art.once('video:seeked', resolve))
            window.art.currentTime = 2
            await sought
          })
        }
        else if (action === 'destroy') {
          await page.evaluate(() => window.art.destroy())
        }
        else {
          await page.evaluate(() => window.danmukuPlugins[0].load())
        }
        if (action !== 'destroy') {
          await page.evaluate(() => window.danmukuPlugins[0].emit({ id: 'fresh-after-cancel', text: 'FRESH', mode: 1, time: window.art.currentTime + 0.5 }))
          if (action === 'pause')
            await page.click('#play')
          // The old user Promise is still unresolved. A cancelled frame must
          // release scheduler ownership so this newer item can be displayed.
          await expect.poll(() => visibleIds(page)).toContain('fresh-after-cancel')
        }
        const before = await page.evaluate(() => ({ requests: window.danmukuEvidence.workers.map(worker => worker.requests.length), visible: window.danmukuEvidence.events.filter(event => event.event === 'visible').map(event => event.id) }))
        await page.evaluate(() => window.releaseDanmukuVisibility(true))
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        expect(await visibleIds(page)).not.toContain('obsolete-gate')
        if (action === 'destroy') {
          expect(await page.evaluate(() => window.danmukuEvidence.workers.map(worker => worker.requests.length))).toEqual(before.requests)
          expect(await page.evaluate(() => window.art.template.$danmuku.childElementCount)).toBe(0)
        }
        expect(external).toEqual([])
        await testInfo.attach('danmuku-native-cancel', { contentType: 'application/json', body: JSON.stringify({ action, before, after: await visibleIds(page), cancelledSource: 'An unresolved user beforeVisible Promise; native RAF, Worker and media remain active.' }) })
      })
    }

    test(`${label}: native Worker renders three modes with synchronous filter and asynchronous beforeVisible`, async ({ page }, testInfo) => {
      const external = await setup(page, core, format, 'modes', testInfo)
      await page.evaluate(async () => {
        await window.danmukuPlugins[0].load([
          { id: 'scroll', text: 'SCROLL', mode: 0, time: 0.5 },
          { id: 'top', text: 'TOP', mode: 1, time: 0.5 },
          { id: 'bottom', text: 'BOTTOM', mode: 2, time: 0.5 },
          { id: 'filtered', text: 'FILTERED', mode: 1, time: 0.5 },
          { id: 'denied', text: 'DENIED', mode: 1, time: 0.5 },
          { id: 'gated', text: 'GATED', mode: 1, time: 0.5 },
        ])
      })
      await page.click('#play')
      await expect.poll(() => visibleIds(page)).toEqual(expect.arrayContaining(['scroll', 'top', 'bottom']))
      await expect.poll(() => page.evaluate(() => window.danmukuEvidence.gates.some(item => item.id === 'gated'))).toBe(true)
      expect(await visibleIds(page)).not.toContain('gated')
      expect(await visibleIds(page)).not.toContain('filtered')
      expect(await visibleIds(page)).not.toContain('denied')
      expect(await page.evaluate(() => window.danmukuEvidence.gates.some(item => item.id === 'filtered'))).toBe(false)
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      expect(await page.evaluate(() => window.danmukuEvidence.gates.filter(item => item.id === 'gated').length)).toBe(1)
      await page.evaluate(() => window.releaseDanmukuVisibility(true))
      await expect.poll(() => visibleIds(page)).toContain('gated')
      const [layout] = await geometry(page)
      for (const id of ['top', 'bottom']) {
        const item = layout.nodes.find(node => node.id === id && node.visibility === 'visible')
        expect(item).toBeTruthy()
        expect(Math.abs(item.x + item.width / 2 - layout.player.width / 2)).toBeLessThanOrEqual(2)
        expect(item.y).toBeGreaterThanOrEqual(9)
        expect(item.y + item.height).toBeLessThanOrEqual(layout.player.height - 8)
      }
      expect(layout.nodes.find(node => node.id === 'top').y).toBeLessThan(layout.nodes.find(node => node.id === 'bottom').y)
      expect(await page.evaluate(() => window.danmukuEvidence.workers[0].replies.length)).toBeGreaterThanOrEqual(4)
      expect(external).toEqual([])
    })

    test(`${label}: six simultaneous fixed comments preserve usable track geometry and input order`, async ({ page }, testInfo) => {
      const external = await setup(page, core, format, 'density', testInfo)
      await page.evaluate(async () => {
        await window.danmukuPlugins[0].load(Array.from({ length: 6 }, (_, index) => ({ id: `dense-${index}`, text: `TRACK ${index}`, mode: 1, time: 0.5 })))
      })
      await page.click('#play')
      await expect.poll(() => visibleIds(page)).toEqual(expect.arrayContaining(Array.from({ length: 6 }, (_, index) => `dense-${index}`)))
      await page.click('#pause')
      await expect.poll(() => page.evaluate(() => window.danmukuPlugins[0].isStop)).toBe(true)
      const [layout] = await geometry(page)
      const rows = Array.from({ length: 6 }, (_, index) => layout.nodes.find(node => node.id === `dense-${index}` && node.visibility === 'visible'))
      expect(rows.every(Boolean)).toBe(true)
      for (let index = 0; index < rows.length; index++) {
        expect(rows[index].y).toBeGreaterThanOrEqual(9)
        expect(rows[index].y + rows[index].height).toBeLessThanOrEqual(layout.player.height - 8)
        if (index)
          expect(rows[index].y).toBeGreaterThanOrEqual(rows[index - 1].y + rows[index - 1].height - 1)
      }
      const order = await visibleIds(page)
      expect(order).toEqual(Array.from({ length: 6 }, (_, index) => `dense-${index}`))
      const worker = await page.evaluate(() => window.danmukuEvidence.workers[0])
      expect(worker.requests).toHaveLength(6)
      expect(new Set(worker.requests.map(request => request.id)).size).toBe(6)
      expect(worker.requests.map(request => request.visibles.length)).toEqual([0, 1, 2, 3, 4, 5])
      expect(worker.replies.map(reply => reply.id)).toEqual(worker.requests.map(request => request.id))
      await testInfo.attach('danmuku-dense-tracks', { contentType: 'application/json', body: JSON.stringify(rows) })
      expect(external).toEqual([])
    })

    test(`${label}: native pause seek rate and public reset/load retain historical pool semantics`, async ({ page }, testInfo) => {
      const external = await setup(page, core, format, 'playback', testInfo)
      await page.evaluate(async () => {
        await window.danmukuPlugins[0].emit({ id: 'moving', text: 'MOVING', mode: 0, time: 0.5 })
      })
      await page.click('#play')
      await expect.poll(() => visibleIds(page)).toContain('moving')
      await page.click('#pause')
      await expect.poll(() => page.evaluate(() => window.danmukuPlugins[0].isStop)).toBe(true)
      const frozen = await page.evaluate(async () => {
        const node = window.art.template.$danmuku.querySelector('[data-id="moving"]')
        window.danmukuNodes = [node]
        const left = node.getBoundingClientRect().left
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        return { left, next: node.getBoundingClientRect().left, state: node.dataset.state }
      })
      expect(frozen.state).toBe('stop')
      expect(Math.abs(frozen.left - frozen.next)).toBeLessThanOrEqual(1)
      await page.evaluate(async () => {
        window.art.playbackRate = 2
        const sought = new Promise(resolve => window.art.once('video:seeked', resolve))
        window.art.currentTime = 2
        await sought
      })
      expect(await page.evaluate(() => window.danmukuNodes[0].dataset.state)).toBe('stop')
      await page.evaluate(async () => {
        window.danmukuPlugins[0].reset()
        await window.danmukuPlugins[0].emit({ id: 'reused', text: 'REUSED', mode: 0, time: window.art.currentTime + 0.5 })
      })
      await page.click('#play')
      await expect.poll(() => visibleIds(page)).toContain('reused')
      const reused = await page.evaluate(() => {
        const node = window.art.template.$danmuku.querySelector('[data-id="reused"]')
        const original = window.danmukuNodes[0]
        const nodes = [...window.art.template.$danmuku.children]
        return {
          poolReused: original.textContent === 'REUSED' && nodes.includes(original),
          visibleSameNode: node === original,
          original: { id: original.dataset.id, state: original.dataset.state, visibility: getComputedStyle(original).visibility, text: original.textContent },
          extraNodes: nodes.filter(item => item !== original).map(item => ({ id: item.dataset.id, state: item.dataset.state, visibility: getComputedStyle(item).visibility, text: item.textContent })),
          transition: node.style.transitionDuration,
          rate: window.art.playbackRate,
        }
      })
      // The historical competing loop reused a node and then hid it while
      // allocating another. A single scheduler must reuse the visible node.
      expect(reused.poolReused).toBe(true)
      expect(reused.visibleSameNode).toBe(true)
      expect(reused.extraNodes).toEqual([])
      expect(reused.transition).toBe('4s')
      expect(reused.rate).toBe(2)
      await page.evaluate(async () => {
        await window.danmukuPlugins[0].load([{ id: 'appended', text: 'APPENDED', mode: 1, time: window.art.currentTime + 0.5 }])
      })
      await expect.poll(() => visibleIds(page)).toContain('appended')
      await page.click('#pause')
      await page.evaluate(async () => {
        await window.danmukuPlugins[0].load()
      })
      expect(await page.locator('#danmuku-player-0 .art-danmuku > div').count()).toBe(0)
      await testInfo.attach('danmuku-pool-and-rate', { contentType: 'application/json', body: JSON.stringify({ frozen, reused, loadWithoutArgument: 'replaces from original empty option; explicit array load appends' }) })
      expect(external).toEqual([])
    })

    test(`${label}: actual settings, asynchronous send lock, external fullscreen mount and two-player destruction`, async ({ page }, testInfo) => {
      const external = await setup(page, core, format, 'settings', testInfo)
      const mount = page.locator('#danmuku-mount-0')
      await expect(mount.locator('.artplayer-plugin-danmuku')).toHaveCount(1)
      await mount.locator('.apd-config').hover()
      await mount.locator('.apd-config-mode [data-mode="2"]').click()
      expect(await page.evaluate(() => window.danmukuPlugins[0].option.modes)).toEqual([0, 1])
      await mount.locator('.apd-style').hover()
      await mount.locator('.apd-style-mode [data-mode="1"]').click()
      expect(await page.evaluate(() => window.danmukuPlugins[0].option.mode)).toBe(1)
      await mount.locator('.apd-input').fill('FIRST')
      await mount.locator('.apd-send').click()
      await expect.poll(() => page.evaluate(() => window.danmukuEvidence.sends.length)).toBe(1)
      await mount.locator('.apd-input').press('Enter')
      expect(await page.evaluate(() => window.danmukuEvidence.sends.length)).toBe(1)
      await page.evaluate(() => window.releaseDanmukuSending(true))
      await expect(mount.locator('.apd-input')).toHaveValue('')
      await expect(mount.locator('.apd-send')).toHaveClass(/apd-lock/u)
      await mount.locator('.apd-input').fill('LOCKED')
      await mount.locator('.apd-input').press('Enter')
      expect(await page.evaluate(() => window.danmukuEvidence.sends.length)).toBe(1)
      await expect(mount.locator('.apd-send')).not.toHaveClass(/apd-lock/u)
      await page.evaluate(() => {
        window.danmukuEmitter = document.querySelector('#danmuku-mount-0 .artplayer-plugin-danmuku')
        window.art.fullscreenWeb = true
      })
      // FULLSCREEN_WEB_IN_BODY can move the player out of its original container.
      await expect.poll(() => page.evaluate(() => window.art.template.$controlsCenter.contains(window.danmukuEmitter))).toBe(true)
      await expect(mount.locator('.artplayer-plugin-danmuku')).toHaveCount(0)
      await page.evaluate(() => {
        window.art.fullscreenWeb = false
      })
      await expect(mount.locator('.artplayer-plugin-danmuku')).toHaveCount(1)
      expect(await page.evaluate(() => document.querySelector('#danmuku-mount-0').contains(window.danmukuEmitter))).toBe(true)
      await page.evaluate(() => {
        const art = window.createDanmukuPlayer(1)
        const button = document.createElement('button')
        button.id = 'play-second-danmuku'
        button.textContent = 'Play second'
        button.onclick = () => art.play()
        document.body.appendChild(button)
      })
      await expect.poll(() => page.evaluate(() => window.danmukuPlayers[1].isReady)).toBe(true)
      await page.evaluate(() => window.danmukuPlayers[0].destroy())
      expect(await page.evaluate(() => window.danmukuEvidence.workers.map(worker => worker.terminated))).toEqual([1, 0])
      // The released plugin does not dispose external Setting DOM; retain this observation.
      await expect(mount.locator('.artplayer-plugin-danmuku')).toHaveCount(1)
      await page.locator('#danmuku-mount-1 .apd-input').fill('SECOND')
      await page.locator('#danmuku-mount-1 .apd-send').click()
      await page.click('#play-second-danmuku')
      await expect.poll(() => page.evaluate(() => window.danmukuEvidence.events.some(item => item.index === 1 && item.event === 'visible' && item.text === 'SECOND'))).toBe(true)
      expect(await page.evaluate(() => window.danmukuPlayers[1].isDestroy)).toBe(false)
      expect(external).toEqual([])
    })
  }
}

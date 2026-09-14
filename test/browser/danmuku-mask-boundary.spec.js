import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { expect, test } from './fixtures.js'

let candidate
let provenance
test.beforeAll(async () => {
  ;({ code: candidate, provenance } = await browserCandidate('artplayer-plugin-danmuku', process.env.ARTPLAYER_DANMUKU_ARTIFACT))
})

test.beforeEach(async ({ browserName }, testInfo) => {
  await testInfo.attach('danmuku-selected-input', { contentType: 'application/json', body: JSON.stringify({ browserName, provenance }) })
})

async function setup(page, core, testInfo) {
  const external = []
  const origin = new URL(testInfo.project.use.baseURL).origin
  await page.route('**/*', (route) => {
    if (new URL(route.request().url()).origin !== origin) {
      external.push(route.request().url())
      return route.abort()
    }
    return route.continue()
  })
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: candidate })
  await page.evaluate(() => {
    window.maskBoundaryEvidence = { snapshots: [], workers: [], visible: [], errors: [] }
    const NativeWorker = window.Worker
    window.Worker = class extends NativeWorker {
      constructor(url, options) {
        super(url, options)
        this.observation = { requests: [], replies: [], terminated: 0 }
        window.maskBoundaryEvidence.workers.push(this.observation)
        this.addEventListener('message', ({ data }) => this.observation.replies.push({ id: data.id, result: data.result ?? null }))
      }

      postMessage(message, ...args) {
        this.observation.requests.push({ type: message.type, id: message.id })
        return super.postMessage(message, ...args)
      }

      terminate() {
        this.observation.terminated++
        return super.terminate()
      }
    }
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true })
    window.maskBoundaryLayer = window.art.template.$danmuku
    const layer = window.maskBoundaryLayer
    // Fixed CSS input tests Danmuku's shared-layer contract. No Mask plugin,
    // model, TensorFlow backend or segmentation output is loaded or simulated.
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="320" height="360" fill="white"/></svg>'
    layer.style.maskImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
    Object.assign(layer.style, { maskMode: 'alpha', maskSize: 'contain', maskRepeat: 'no-repeat', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' })
    window.maskBoundarySnapshot = (label) => {
      const properties = ['mask-image', 'mask-mode', 'mask-size', 'mask-repeat', 'background-size', 'background-repeat']
      const computed = getComputedStyle(layer)
      const snapshot = {
        label,
        sameLayer: window.art.template.$danmuku === layer,
        connected: layer.isConnected,
        styles: properties.map(name => ({ name, value: layer.style.getPropertyValue(name), priority: layer.style.getPropertyPriority(name), computed: computed.getPropertyValue(name) })),
        children: layer.children.length,
        opacity: layer.style.opacity,
        time: window.art.currentTime,
      }
      window.maskBoundaryEvidence.snapshots.push(snapshot)
      return snapshot
    }
    window.maskBoundaryBase = window.maskBoundarySnapshot('before-registration')
    window.art.on('artplayerPluginDanmuku:visible', item => window.maskBoundaryEvidence.visible.push(item.id))
    window.art.on('artplayerPluginDanmuku:error', error => window.maskBoundaryEvidence.errors.push(String(error)))
    window.art.plugins.add(window.artplayerPluginDanmuku({ danmuku: [], heatmap: false, speed: 8, margin: [10, 10], fontSize: 20 }))
    window.maskBoundaryPlugin = window.art.plugins.artplayerPluginDanmuku
    document.querySelector('#play').onclick = () => window.art.play()
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady && window.art.template.$video.videoWidth > 0)).toBe(true)
  // Real slow playback leaves room for lifecycle checks on the finite fixture.
  await page.evaluate(() => window.art.playbackRate = 0.25)
  await testInfo.attach('danmuku-mask-boundary-inputs', {
    contentType: 'application/json',
    body: JSON.stringify({ core, artifact: provenance.file || provenance.kind, sha256: hash(candidate), media: '/test/pattern.mp4', scope: 'Shared root-layer identity and CSS preservation with fixed inline SVG mask; native video, DOM, RAF and placement Worker. No Mask SDK/model/end-to-end acceptance. Eligible rows are explicit resource-test preconditions, not timestamp-delivery evidence.' }),
  })
  return external
}

async function assertLayer(page, label) {
  const { baseline, snapshot } = await page.evaluate(label => ({ baseline: window.maskBoundaryBase, snapshot: window.maskBoundarySnapshot(label) }), label)
  expect(snapshot.sameLayer, label).toBe(true)
  expect(snapshot.connected, label).toBe(true)
  expect(snapshot.styles, label).toEqual(baseline.styles)
  return snapshot
}

async function renderRow(page, id) {
  await page.evaluate(async (id) => {
    const owner = await window.maskBoundaryPlugin.emit({ id, text: id, mode: 1, time: 0 })
    // Establish eligibility, then require actual placement Worker and visible DOM.
    owner.setState(owner.queue[owner.queue.length - 1], 'ready')
    window.maskBoundaryOwner = owner
  }, id)
  await page.click('#play')
  await expect.poll(() => page.evaluate(id => window.maskBoundaryEvidence.visible.includes(id), id)).toBe(true)
  await expect.poll(() => page.evaluate((id) => {
    const node = [...window.maskBoundaryLayer.children].find(node => node.dataset.id === id)
    if (!node)
      return false
    const rect = node.getBoundingClientRect()
    return node.dataset.state === 'emit' && getComputedStyle(node).visibility === 'visible' && rect.width > 0 && rect.height > 0
  }, id)).toBe(true)
}

test.afterEach(async ({ page }, testInfo) => {
  if (page.isClosed())
    return
  const evidence = await page.evaluate(() => {
    if (window.maskBoundaryEvidence && window.art && !window.art.isDestroy)
      window.art.destroy(false)
    return window.maskBoundaryEvidence ?? null
  })
  await testInfo.attach('danmuku-mask-boundary-evidence', { contentType: 'application/json', body: JSON.stringify(evidence) })
})

for (const core of ['published', 'candidate']) {
  test(`${core}: Danmuku retains the core layer and external CSS mask across commands and retained-HTML destroy`, async ({ page }, testInfo) => {
    const external = await setup(page, core, testInfo)
    const initial = await assertLayer(page, 'after-registration')
    const image = initial.styles.find(item => item.name === 'mask-image')
    expect(image.value).toContain('data:image/svg+xml,')
    expect(image.computed).toContain('data:image/svg+xml,')
    await renderRow(page, 'MASK-BOUNDARY-EMIT')
    await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0)
    await assertLayer(page, 'after-native-emit')
    await testInfo.attach('danmuku-mask-boundary-playing', { contentType: 'image/png', body: await page.screenshot() })

    const reset = await page.evaluate(() => {
      const owner = window.maskBoundaryPlugin.reset()
      return { sameOwner: owner === window.maskBoundaryOwner, states: owner.queue.map(item => item.$state) }
    })
    expect(reset).toEqual({ sameOwner: true, states: ['wait'] })
    await assertLayer(page, 'after-reset')

    const replacement = await page.evaluate(async () => {
      window.maskBoundaryPlugin.config({ danmuku: [{ id: 'CONFIGURED-REPLACEMENT', text: 'CONFIGURED-REPLACEMENT', time: 100 }] })
      const owner = await window.maskBoundaryPlugin.load()
      return { sameOwner: owner === window.maskBoundaryOwner, ids: owner.queue.map(item => item.id) }
    })
    expect(replacement).toEqual({ sameOwner: true, ids: ['CONFIGURED-REPLACEMENT'] })
    await assertLayer(page, 'after-no-argument-load')
    await renderRow(page, 'MASK-BOUNDARY-AFTER-LOAD')
    await assertLayer(page, 'after-replacement-native-emit')

    await page.evaluate(() => window.maskBoundaryPlugin.hide())
    expect((await assertLayer(page, 'after-hide')).opacity).toBe('0')
    await page.evaluate(() => window.maskBoundaryPlugin.show())
    expect((await assertLayer(page, 'after-show')).opacity).toBe('1')

    const beforeDestroy = await page.evaluate(() => ({ workers: window.maskBoundaryEvidence.workers, errors: window.maskBoundaryEvidence.errors }))
    expect(beforeDestroy.errors).toEqual([])
    expect(beforeDestroy.workers).toHaveLength(1)
    expect(beforeDestroy.workers[0].requests.length).toBeGreaterThanOrEqual(2)
    expect(beforeDestroy.workers[0].replies.length).toBeGreaterThanOrEqual(2)
    await page.evaluate(() => window.art.destroy(false))
    const destroyed = await assertLayer(page, 'after-destroy-false')
    expect(destroyed.children).toBe(0)
    // Use the native frame clock to detect immediate late plugin writes after cleanup.
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const settled = await assertLayer(page, 'after-destroy-native-frames')
    expect(settled.children).toBe(0)
    const terminal = await page.evaluate(() => ({ workers: window.maskBoundaryEvidence.workers, errors: window.maskBoundaryEvidence.errors }))
    expect(terminal.errors).toEqual([])
    expect(terminal.workers[0].terminated).toBe(1)
    expect(terminal.workers[0].requests).toEqual(beforeDestroy.workers[0].requests)
    expect(external).toEqual([])
  })
}

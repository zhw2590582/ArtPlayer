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
  await page.evaluate(() => {
    const evidence = window.inputEvidence = { urls: [], revoked: [], workers: [], events: [] }
    const create = URL.createObjectURL.bind(URL)
    const revoke = URL.revokeObjectURL.bind(URL)
    URL.createObjectURL = (blob) => {
      const url = create(blob)
      evidence.urls.push(url)
      return url
    }
    URL.revokeObjectURL = (url) => {
      evidence.revoked.push(url)
      return revoke(url)
    }
    const NativeWorker = window.Worker
    window.Worker = class extends NativeWorker {
      constructor(url, options) {
        super(url, options)
        this.observation = { url: String(url), terminated: 0, replies: [] }
        evidence.workers.push(this.observation)
        this.addEventListener('message', event => this.observation.replies.push(event.data))
      }

      terminate() {
        this.observation.terminated++
        return super.terminate()
      }
    }
  })
  await page.addScriptTag({ content: candidate })
  await page.evaluate(() => {
    window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true })
    for (const name of ['show', 'hide', 'config', 'reset', 'loaded', 'error', 'destroy']) {
      window.art.on(`artplayerPluginDanmuku:${name}`, value => window.inputEvidence.events.push({ name, count: Array.isArray(value) ? value.length : undefined, error: name === 'error' ? String(value) : undefined }))
    }
    window.art.plugins.add(window.artplayerPluginDanmuku({ danmuku: [], heatmap: false }))
    window.inputPlugin = window.art.plugins.artplayerPluginDanmuku
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await testInfo.attach('danmuku-input-build', { contentType: 'application/json', body: JSON.stringify({ core, artifact: provenance.file || provenance.kind, sha256: hash(candidate), worker: 'Native Blob Worker with observation only', media: '/test/pattern.mp4' }) })
  return external
}

for (const core of ['published', 'candidate']) {
  test(`Danmuku input native Worker startup failure falls back locally (${core})`, async ({ page }, testInfo) => {
    const external = await setup(page, core, testInfo)
    await page.route('**/test/fallback.xml', route => route.fulfill({ contentType: 'text/xml', body: '<i><d p="0,5,25,255,123,0,u,1">FALLBACK</d></i>' }))
    const result = await page.evaluate(async () => {
      const NativeWorker = window.Worker
      const createdBefore = window.inputEvidence.urls.length
      const workersBefore = window.inputEvidence.workers.length
      window.Worker = class extends NativeWorker {
        constructor(url, options) {
          const fault = URL.createObjectURL(new Blob(['throw new Error("controlled parser startup failure")'], { type: 'application/javascript' }))
          super(fault, options)
          URL.revokeObjectURL(fault)
        }
      }
      const internal = await window.inputPlugin.load('/test/fallback.xml')
      const result = { queue: internal.queue.map(({ text, time, mode }) => ({ text, time, mode })), workers: window.inputEvidence.workers.slice(workersBefore), urls: window.inputEvidence.urls.slice(createdBefore), revoked: window.inputEvidence.revoked, errors: window.inputEvidence.events.filter(event => event.name === 'error') }
      window.art.destroy()
      return result
    })
    expect(result.queue).toEqual([{ text: 'FALLBACK', time: 0, mode: 1 }])
    expect(result.workers).toHaveLength(1)
    expect(result.workers[0].terminated).toBe(1)
    expect(result.urls).toHaveLength(2)
    for (const url of result.urls)
      expect(result.revoked.filter(item => item === url)).toHaveLength(1)
    expect(result.errors).toEqual([])
    expect(external).toEqual([])
    await testInfo.attach('danmuku-native-worker-fault', { contentType: 'application/json', body: JSON.stringify({ ...result, fault: 'Test replaces only the newly created native parser Worker script with a thrown startup Error; fetch, fallback parser and error dispatch remain real.' }) })
  })

  test(`Danmuku input native parser cleanup and rejected fetch (${core})`, async ({ page }, testInfo) => {
    const external = await setup(page, core, testInfo)
    await page.route('**/test/input.xml', route => route.fulfill({ contentType: 'text/xml', body: '<i><d p="0,1,25,255,123,0,user,456"> A &amp; B </d><d p="2,4,20,16777215,124,0,u,789">TOP</d></i>' }))
    await page.route('**/test/empty.xml', route => route.fulfill({ contentType: 'text/xml', body: '' }))
    await page.route('**/test/rejected.xml', route => route.abort('failed'))
    const result = await page.evaluate(async () => {
      const plugin = window.inputPlugin
      const start = window.inputEvidence.workers.length
      const internal = await plugin.load('/test/input.xml')
      const parsed = internal.queue.map(({ text, time, mode, color, userID, rowID }) => ({ text, time, mode, color, userID, rowID }))
      const emptyIdentity = await plugin.load('/test/empty.xml') === internal
      let rejection
      try {
        await plugin.load('/test/rejected.xml')
      }
      catch (error) { rejection = String(error) }
      const parserWorkers = window.inputEvidence.workers.slice(start)
      const beforeDestroy = internal.queue.length
      window.art.destroy()
      return { parsed, emptyIdentity, beforeDestroy, rejection, parserWorkers, ...window.inputEvidence }
    })
    expect(result.parsed).toEqual([{ text: 'A & B', time: 0, mode: 0, color: '#ff', userID: 'user', rowID: 456 }, { text: 'TOP', time: 2, mode: 2, color: '#ffffff', userID: 'u', rowID: 789 }])
    expect(result.emptyIdentity).toBe(true)
    expect(result.beforeDestroy).toBe(2)
    expect(result.rejection).toBeTruthy()
    expect(result.events.filter(event => event.name === 'error')).toHaveLength(1)
    expect(result.parserWorkers.length).toBeGreaterThanOrEqual(1)
    for (const worker of result.parserWorkers) {
      expect(worker.terminated).toBe(1)
      expect(result.revoked.filter(url => url === worker.url)).toHaveLength(1)
      expect(worker.replies).toHaveLength(1)
      expect(Array.isArray(worker.replies[0].danmus)).toBe(true)
    }
    expect(external).toEqual([])
    await testInfo.attach('danmuku-native-parser', { contentType: 'application/json', body: JSON.stringify(result) })
  })

  test(`Danmuku input replacement append and destruction (${core})`, async ({ page }, testInfo) => {
    const external = await setup(page, core, testInfo)
    const result = await page.evaluate(async () => {
      const plugin = window.inputPlugin
      const internal = plugin.config({ danmuku: [] })
      const initialEvents = window.inputEvidence.events.map(event => event.name)
      let resolveOld
      plugin.config({ danmuku: () => new Promise(resolve => resolveOld = resolve) })
      const old = plugin.load()
      plugin.config({ danmuku: [{ text: 'new', time: 0 }] })
      const latestIdentity = await plugin.load() === internal
      resolveOld([{ text: 'obsolete' }])
      const oldIdentity = await old === internal
      let resolveA
      let resolveB
      const a = plugin.load(() => new Promise(resolve => resolveA = resolve))
      const b = plugin.load(() => new Promise(resolve => resolveB = resolve))
      resolveB([{ text: 'append B' }])
      await b
      resolveA([{ text: 'append A' }])
      await a
      const queue = internal.queue.map(item => ({ text: item.text, time: item.time }))
      let resolveLate
      const late = plugin.load(() => new Promise(resolve => resolveLate = resolve))
      const loadedBefore = window.inputEvidence.events.filter(event => event.name === 'loaded').length
      window.art.destroy()
      resolveLate([{ text: 'after destroy' }])
      const destroyedIdentity = await late === internal
      return { initialEvents, latestIdentity, oldIdentity, destroyedIdentity, queue, finalQueue: internal.queue.map(item => item.text), loadedBefore, loadedAfter: window.inputEvidence.events.filter(event => event.name === 'loaded').length, events: window.inputEvidence.events }
    })
    expect(result.initialEvents.slice(0, 4)).toEqual(['show', 'config', 'reset', 'loaded'])
    expect(result.latestIdentity && result.oldIdentity && result.destroyedIdentity).toBe(true)
    expect(result.queue.map(item => item.text)).toEqual(['new', 'append B', 'append A'])
    expect(result.queue[0].time).toBe(0)
    expect(result.finalQueue).toEqual(['new', 'append B', 'append A'])
    expect(result.loadedAfter).toBe(result.loadedBefore)
    expect(result.events.filter(event => event.name === 'error')).toEqual([])
    expect(external).toEqual([])
    await testInfo.attach('danmuku-native-input-ownership', { contentType: 'application/json', body: JSON.stringify(result) })
  })

  test(`Danmuku config callback replacement and validation (${core})`, async ({ page }, testInfo) => {
    const external = await setup(page, core, testInfo)
    const result = await page.evaluate(async () => {
      const plugin = window.inputPlugin
      const receiver = []
      const next = function (item) {
        receiver.push(this === plugin.option)
        return item.text !== 'excluded'
      }
      const internal = plugin.config({ filter: next })
      const count = window.inputEvidence.events.filter(event => event.name === 'config').length
      const unchangedIdentity = plugin.config({ filter: next, margin: [...plugin.option.margin] }) === internal
      const unchangedCount = window.inputEvidence.events.filter(event => event.name === 'config').length
      const previous = plugin.option
      let error
      try {
        plugin.config({ speed: 'invalid' })
      }
      catch (failure) { error = String(failure) }
      await plugin.emit({ text: 'excluded', time: 0 })
      const input = { text: 'included', time: 0 }
      const emittedIdentity = await plugin.emit(input) === internal
      const result = { unchangedIdentity, count, unchangedCount, unchangedOption: plugin.option === previous, filterIdentity: plugin.option.filter === next, error, receiver, emittedIdentity, input, queue: internal.queue.map(item => ({ text: item.text, time: item.time })) }
      window.art.destroy()
      return result
    })
    expect(result.unchangedIdentity && result.unchangedOption && result.filterIdentity && result.emittedIdentity).toBe(true)
    expect(result.unchangedCount).toBe(result.count)
    expect(result.error).toBeTruthy()
    expect(result.receiver).toEqual([true, true])
    expect(result.queue).toEqual([{ text: 'included', time: 0 }])
    expect(result.input).toMatchObject({ time: 0, mode: 0, color: '#FFFFFF', style: {} })
    expect(external).toEqual([])
    await testInfo.attach('danmuku-native-config', { contentType: 'application/json', body: JSON.stringify(result) })
  })
}

import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { browserCandidate } from '../helpers/browser-candidate.js'
import { expect, test } from './fixtures.js'

const { code, provenance } = await browserCandidate('artplayer-plugin-jassub', process.env.ARTPLAYER_JASSUB_ARTIFACT)
const artifact = provenance.file || 'source-build'

test.beforeEach(async ({ browserName }, testInfo) => {
  await testInfo.attach('jassub-selected-input', { contentType: 'application/json', body: JSON.stringify({ browserName, provenance }) })
})
const subtitles = `[Script Info]
ScriptType: v4.00+
PlayResX: 640
PlayResY: 360
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Liberation Sans,36,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,20,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,0:00:30.00,Default,,0,0,0,,Native lifecycle subtitle
`

async function setup(page) {
  await page.goto('/test/player.html?core=candidate')
  await page.addScriptTag({ content: code })
  await page.evaluate(() => {
    window.createPlayer('/assets/sample/steve-jobs.mp4')
    window.jassubLifecycle = { sent: [], terminated: 0, errors: [] }
    const NativeWorker = window.Worker
    window.Worker = class extends NativeWorker {
      constructor(...args) {
        super(...args)
        this.addEventListener('error', (event) => {
          window.jassubLifecycle.lastWorkerError = event
        })
      }

      postMessage(message, ...rest) {
        window.jassubLifecycle.sent.push({ target: message.target, time: message.time, rate: message.rate })
        return super.postMessage(message, ...rest)
      }

      terminate() {
        window.jassubLifecycle.terminated++
        return super.terminate()
      }
    }
    window.jassubOptions = { workerUrl: '/assets/jassub/jassub-worker.js', wasmUrl: '/assets/jassub/jassub-worker.wasm', modernWasmUrl: '/assets/jassub/jassub-worker-modern.wasm', availableFonts: { 'liberation sans': '/assets/jassub/default.woff2' }, fonts: ['/assets/jassub/default.woff2'], offscreenRender: false }
  })
  await expect.poll(() => page.evaluate(() => window.art.duration)).toBeGreaterThan(30)
}

for (const onDemandRender of [true, false]) {
  test(`JASSUB actual video replacement and repeated destruction, onDemandRender=${onDemandRender}`, async ({ page }, testInfo) => {
    await setup(page)
    try {
      await page.evaluate(async ({ subtitles, onDemandRender }) => {
        const register = window.artplayerPluginJassub.default || window.artplayerPluginJassub
        window.art.plugins.add(register({ ...window.jassubOptions, subContent: subtitles, onDemandRender }))
        const instance = window.jassub = window.art.plugins.artplayerPluginJassub.instance
        instance.addEventListener('error', event => window.jassubLifecycle.errors.push(String(event.error)))
        await new Promise(resolve => instance.addEventListener('ready', resolve, { once: true }))
        const container = document.createElement('div')
        const video = document.createElement('video')
        video.width = 640
        video.height = 360
        video.muted = true
        video.preload = 'auto'
        container.append(video)
        document.body.append(container)
        const loaded = new Promise(resolve => video.addEventListener('loadeddata', resolve, { once: true }))
        video.src = '/assets/sample/steve-jobs.mp4'
        await loaded
        await video.play()
        await new Promise((resolve) => {
          const playing = () => {
            if (video.currentTime <= 0.1)
              return
            video.removeEventListener('timeupdate', playing)
            resolve()
          }
          video.addEventListener('timeupdate', playing)
          playing()
        })
        video.pause()
        instance.setVideo(video)
        window.replacementVideo = video
        window.replacementContainer = container
        const seeked = new Promise(resolve => video.addEventListener('seeked', resolve, { once: true }))
        video.currentTime = 9
        await seeked
        video.playbackRate = 1.5
        await video.play()
      }, { subtitles, onDemandRender })
      await expect.poll(() => page.evaluate(() => {
        const canvas = window.jassub._canvas
        return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.filter((value, index) => index % 4 === 3 && value > 0).length
      })).toBeGreaterThan(100)
      const state = await page.evaluate(async () => {
        const instance = window.jassub
        const events = await new Promise((resolve, reject) => instance.getEvents((error, rows) => error ? reject(error) : resolve(rows)))
        const parentMatches = instance._canvasParent.parentNode === window.replacementContainer
        const originalContainerCount = window.art.template.$player.querySelectorAll('.JASSUB').length
        const time = window.replacementVideo.currentTime
        instance.destroy()
        instance.destroy()
        window.art.destroy(false)
        window.replacementVideo.pause()
        return { parentMatches, originalContainerCount, time, event: events[0], terminated: window.jassubLifecycle.terminated, ownedContainers: document.querySelectorAll('.JASSUB').length, replacementPreserved: window.replacementVideo.isConnected, errors: window.jassubLifecycle.errors, sent: window.jassubLifecycle.sent }
      })
      expect(state.parentMatches).toBe(true)
      expect(state.originalContainerCount).toBe(0)
      expect(state.time).toBeGreaterThanOrEqual(9)
      expect(typeof state.event.Style).toBe('number')
      expect(state.event._index).toBeUndefined()
      expect(state.terminated).toBe(1)
      expect(state.ownedContainers).toBe(0)
      expect(state.replacementPreserved).toBe(true)
      expect(state.errors).toEqual([])
      if (!onDemandRender)
        expect(state.sent.some(message => message.target === 'video' && message.rate === 1.5)).toBe(true)
      await testInfo.attach('jassub-native-lifecycle', { body: JSON.stringify({ artifact, provenance, sha256: hash(code), onDemandRender, state }), contentType: 'application/json' })
    }
    finally {
      await page.evaluate(() => {
        window.replacementVideo?.pause()
        if (!window.art.isDestroy)
          window.art.destroy()
      })
    }
  })
}

test('JASSUB actual invalid Worker URL construction releases the newly created canvas and media listeners', async ({ page }, testInfo) => {
  await setup(page)
  const state = await page.evaluate(() => {
    const video = window.art.video
    const listeners = new Map()
    const add = video.addEventListener.bind(video)
    const remove = video.removeEventListener.bind(video)
    video.addEventListener = (name, callback, ...options) => {
      if (!listeners.has(name))
        listeners.set(name, new Set())
      listeners.get(name).add(callback)
      return add(name, callback, ...options)
    }
    video.removeEventListener = (name, callback, ...options) => {
      listeners.get(name)?.delete(callback)
      return remove(name, callback, ...options)
    }
    let error
    try {
      const register = window.artplayerPluginJassub.default || window.artplayerPluginJassub
      register({ ...window.jassubOptions, workerUrl: 'http://[', onDemandRender: false })(window.art)
    }
    catch (failure) { error = { name: failure.name, message: failure.message } }
    const activeListeners = [...listeners.values()].reduce((sum, values) => sum + values.size, 0)
    window.art.destroy()
    return { error, activeListeners, ownedContainers: document.querySelectorAll('.JASSUB').length }
  })
  expect(state.error?.name).toBe('SyntaxError')
  expect(state.activeListeners).toBe(0)
  expect(state.ownedContainers).toBe(0)
  await testInfo.attach('jassub-native-construction-failure', { body: JSON.stringify({ artifact, provenance, sha256: hash(code), state }), contentType: 'application/json' })
})

test('JASSUB native asynchronous CSP Worker error reaches a pending query and explicit destruction cleans up', async ({ page }, testInfo) => {
  await setup(page)
  const state = await page.evaluate(async () => {
    const meta = document.createElement('meta')
    meta.httpEquiv = 'Content-Security-Policy'
    meta.content = 'worker-src \'none\''
    document.head.append(meta)
    const register = window.artplayerPluginJassub.default || window.artplayerPluginJassub
    const { instance } = register({ ...window.jassubOptions, onDemandRender: false })(window.art)
    let calls = 0
    const outcome = await new Promise((resolve) => {
      instance.getEvents((error, rows) => {
        calls++
        resolve({ errorIsNativeEvent: error instanceof Event, trusted: error.isTrusted, sameNativeError: error === window.jassubLifecycle.lastWorkerError, type: error.type, rowsAbsent: rows === undefined })
      })
    })
    instance.destroy()
    instance.destroy()
    window.art.destroy(false)
    return { outcome, calls, terminated: window.jassubLifecycle.terminated, ownedContainers: document.querySelectorAll('.JASSUB').length }
  })
  expect(state.outcome).toEqual({ errorIsNativeEvent: true, trusted: true, sameNativeError: true, type: 'error', rowsAbsent: true })
  expect(state.calls).toBe(1)
  expect(state.terminated).toBe(1)
  expect(state.ownedContainers).toBe(0)
  await testInfo.attach('jassub-native-worker-error', { body: JSON.stringify({ artifact, provenance, sha256: hash(code), state }), contentType: 'application/json' })
})

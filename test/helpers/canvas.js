import vm from 'node:vm'
import { transform } from 'esbuild'
import { verifyCanvasContract } from '../../refactor/scripts/canvas-contract.mjs'
import { readMember } from '../../refactor/scripts/releases.mjs'

export async function canvasHistorical() {
  const contract = await verifyCanvasContract()
  return [
    ...[contract.baseline.release, ...contract.baseline.previous].map(release => ({ name: `published-${release.version}`, source: readMember(contract.archives.get(release.version), `package/${release.manifest.main.replace(/^\.\//, '')}`).toString(), format: 'artifact' })),
    { name: 'frozen-workspace', source: contract.sources.get('packages/artplayer-proxy-canvas/src/index.js'), format: 'source' },
  ]
}

export async function canvasEnvironment(implementation, settings = {}) {
  const calls = []
  const draws = []
  const listeners = new Map()
  const proxies = []
  const emitted = []
  const timers = new Map()
  const frames = new Map()
  const cancelled = []
  let nextTimer = 0
  let nextFrame = settings.firstFrame ?? 0
  const context = {
    drawImage(...args) {
      draws.push(args)
      settings.onDraw?.(...args)
    },
  }
  const canvas = {
    nodeName: 'CANVAS',
    width: 300,
    height: 150,
    title: 'canvas-title',
    style: {},
    getContext(kind) { return kind === '2d' && !settings.noContext ? context : null },
    toDataURL(...args) {
      calls.push({ name: 'toDataURL', receiver: this, args })
      return 'data:canvas'
    },
    addEventListener(...args) { calls.push({ name: 'canvas-listener', receiver: this, args }) },
  }
  const video = {
    nodeName: 'VIDEO',
    videoWidth: 320,
    videoHeight: 180,
    width: 320,
    height: 180,
    title: 'video-title',
    src: '',
    currentTime: 0,
    paused: true,
    muted: false,
    style: {},
    play(...args) {
      calls.push({ name: 'play', receiver: this, args })
      this.paused = false
      return Promise.resolve()
    },
    pause(...args) {
      calls.push({ name: 'pause', receiver: this, args })
      this.paused = true
    },
    addEventListener(...args) { calls.push({ name: 'video-listener', receiver: this, args }) },
  }
  const art = {
    constructor: { config: { events: ['loadedmetadata', 'play', 'pause', 'seeked', 'error'] }, utils: { createElement: tag => tag === 'canvas' ? canvas : video } },
    option: { autoSize: false },
    template: { $player: { clientWidth: 640, clientHeight: 480 } },
    isDestroy: false,
    on(name, callback) {
      if (!listeners.has(name))
        listeners.set(name, new Set())
      listeners.get(name).add(callback)
      return art
    },
    off(name, callback) {
      listeners.get(name)?.delete(callback)
      return art
    },
    emit(name, ...args) {
      emitted.push({ name, args })
      for (const callback of [...(listeners.get(name) || [])]) callback(...args)
      return art
    },
    proxy(target, name, callback) {
      const entry = { target, name, callback }
      proxies.push(entry)
      return () => proxies.splice(proxies.indexOf(entry), 1)
    },
    destroy() {
      art.isDestroy = true
      art.emit('destroy')
    },
  }
  const source = implementation.format === 'source' ? (await transform(implementation.source, { format: 'cjs', target: 'es2020' })).code : implementation.source
  const module = { exports: {} }
  vm.runInNewContext(source, {
    module,
    exports: module.exports,
    window: {},
    createImageBitmap: settings.createImageBitmap,
    setTimeout(callback) {
      const id = nextTimer++
      timers.set(id, callback)
      return id
    },
    clearTimeout(id) { timers.delete(id) },
    requestAnimationFrame(callback) {
      const id = nextFrame++
      frames.set(id, callback)
      return id
    },
    cancelAnimationFrame(id) {
      cancelled.push(id)
      frames.delete(id)
    },
  }, { timeout: 5000 })
  return {
    factory: module.exports.default || module.exports,
    art,
    canvas,
    video,
    context,
    calls,
    draws,
    listeners,
    proxies,
    emitted,
    timers,
    frames,
    cancelled,
    flushTimers() {
      const pending = [...timers.values()]
      timers.clear()
      for (const callback of pending) callback()
    },
    emitVideo(event) {
      for (const entry of [...proxies]) {
        if (entry.target === video && entry.name === event.type)
          entry.callback(event)
      }
    },
    async flush() {
      // Resolve only the controlled draw/animation promise chain, without wall-clock sleeps.
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    },
  }
}

import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { build, transform } from 'esbuild'
import { verifyCanvasContract } from '../../refactor/scripts/canvas-contract.mjs'
import { readMember } from '../../refactor/scripts/releases.mjs'
import { getEntryFile } from '../../scripts/projects.js'

export async function canvasCandidate() {
  if (process.env.ARTPLAYER_CANVAS_BASELINE === '1')
    return (await canvasHistorical()).find(item => item.name === 'frozen-workspace')
  const root = fileURLToPath(new URL('../../', import.meta.url))
  const result = await build({ entryPoints: [getEntryFile(path.join(root, 'packages/artplayer-proxy-canvas'))], bundle: true, write: false, platform: 'browser', format: 'cjs', target: 'es2020' })
  return { name: 'candidate-source', source: result.outputFiles[0].text, format: 'artifact' }
}

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
    readyState: 4,
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
    removeEventListener(name, callback) {
      for (let index = proxies.length - 1; index >= 0; index--) {
        if (proxies[index].target === this && proxies[index].name === name && proxies[index].callback === callback)
          proxies.splice(index, 1)
      }
    },
    setAttribute(name, value) { this[name] = value },
    removeAttribute(name) { delete this[name] },
    remove() { this.parentNode?.removeChild(this) },
    load() { calls.push({ name: 'load', receiver: this }) },
  }
  const player = {
    clientWidth: 640,
    clientHeight: 480,
    children: [],
    appendChild(node) {
      this.children.push(node)
      node.parentNode = this
      return node
    },
    removeChild(node) {
      this.children.splice(this.children.indexOf(node), 1)
      node.parentNode = null
    },
  }
  const art = {
    constructor: { config: { events: ['loadedmetadata', 'play', 'pause', 'seeked', 'error'] }, utils: { createElement: tag => tag === 'canvas' ? canvas : video } },
    option: { autoSize: false },
    template: { $player: player },
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

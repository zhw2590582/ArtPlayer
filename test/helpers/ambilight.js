import assert from 'node:assert/strict'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { build, transform } from 'esbuild'
import { verifyAmbilightContract } from '../../refactor/scripts/ambilight-contract.mjs'
import { readMember } from '../../refactor/scripts/releases.mjs'
import { getEntryFile } from '../../scripts/projects.js'

export async function ambilightCandidate() {
  if (process.env.ARTPLAYER_AMBILIGHT_BASELINE === '1')
    return (await ambilightHistorical()).find(item => item.name === 'frozen-workspace')
  const root = fileURLToPath(new URL('../../', import.meta.url))
  const result = await build({ entryPoints: [getEntryFile(path.join(root, 'packages/artplayer-plugin-ambilight'))], bundle: true, write: false, platform: 'browser', format: 'cjs', target: 'es2020' })
  return { name: 'candidate-source', source: result.outputFiles[0].text, format: 'artifact' }
}

export async function ambilightHistorical() {
  const contract = await verifyAmbilightContract()
  return [
    ...[contract.baseline.release, ...contract.baseline.previous].map(release => ({ name: `published-${release.version}`, source: readMember(contract.archives.get(release.version), `package/${release.manifest.main.replace(/^\.\//, '')}`).toString(), format: 'artifact' })),
    { name: 'frozen-workspace', source: contract.sources.get('packages/artplayer-plugin-ambilight/src/index.js'), format: 'source' },
  ]
}

export async function ambilightEnvironment(implementation, settings = {}) {
  let time = 0
  let nextFrame = settings.firstFrame ?? 1
  const frames = new Map()
  const draws = []
  const cancelled = []
  const nodes = []
  const listeners = new Map()
  const state = { drawError: null, readError: null, draws, frames, cancelled, nodes, time: value => time = value }
  const context = settings.noContext
    ? null
    : {
        drawImage(...args) {
          draws.push(args)
          settings.onDraw?.()
          if (state.drawError)
            throw state.drawError
        },
        getImageData() {
          if (state.readError)
            throw state.readError
          return { data: [draws.length, 20, 30, 255] }
        },
      }
  function node(tag) {
    let markup = ''
    const value = {
      tag,
      children: [],
      parentNode: null,
      style: {},
      className: '',
      width: 300,
      height: 150,
      get innerHTML() { return markup },
      set innerHTML(value) {
        markup = value
        this.children = Array.from({ length: (value.match(/<div>/g) || []).length }, () => node('div'))
      },
      insertBefore(child, before) {
        assert.equal(before.parentNode, this)
        const index = this.children.indexOf(before)
        this.children.splice(index, 0, child)
        child.parentNode = this
      },
      removeChild(child) {
        assert.equal(child.parentNode, this)
        this.children.splice(this.children.indexOf(child), 1)
        child.parentNode = null
        return child
      },
      remove() { this.parentNode?.removeChild(this) },
      getContext() {
        settings.onContext?.()
        return context
      },
    }
    nodes.push(value)
    return value
  }
  const parent = node('div')
  const video = Object.assign(node('video'), { videoWidth: 300, videoHeight: 150 })
  parent.children.push(video)
  video.parentNode = parent
  const art = {
    template: { $video: video },
    playing: false,
    isDestroy: false,
    constructor: { utils: { createElement: node, addClass: (element, name) => element.className = name, setStyles: (element, styles) => Object.assign(element.style, styles) } },
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
    emit(name, ...args) { for (const callback of [...(listeners.get(name) || [])]) callback(...args) },
    destroy() {
      art.isDestroy = true
      art.emit('destroy')
    },
  }
  const module = { exports: {} }
  const source = implementation.format === 'source' ? (await transform(implementation.source, { loader: 'js', format: 'cjs', target: 'es2020' })).code : implementation.source
  vm.runInNewContext(source, {
    module,
    exports: module.exports,
    window: {},
    performance: { now: () => time },
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
  const factory = module.exports.default || module.exports
  return {
    ...state,
    art,
    parent,
    video,
    listeners,
    context,
    factory,
    frame(now) {
      time = now
      const pending = [...frames]
      frames.clear()
      for (const [, callback] of pending) callback(now)
    },
    setDrawError(error) { state.drawError = error },
    setReadError(error) { state.readError = error },
  }
}

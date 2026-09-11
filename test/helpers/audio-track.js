import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import vm from 'node:vm'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { loadPackage } from './load.js'

async function readFactory(bytes, esm) {
  if (esm)
    return (await import(`data:text/javascript;base64,${Buffer.from(bytes).toString('base64')}`)).default
  const context = {
    module: { exports: {} },
    Audio: function Audio() {
      return new globalThis.Audio()
    },
    console,
  }
  context.exports = context.module.exports
  vm.runInNewContext(bytes.toString(), context, { timeout: 5000 })
  return context.module.exports
}

export async function audioImplementations() {
  const { release } = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/audio-track-release.json', import.meta.url)))
  const archive = await ensureArchive(release)
  const implementations = [{ name: 'source', factory: (await loadPackage(release.name)).default }]
  for (const format of ['main', 'legacy', 'module']) {
    const member = `package/${release.manifest[format].replace(/^\.\//, '')}`
    const bytes = readMember(archive, member)
    assert.equal(hash(bytes), release.files[member])
    const factory = await readFactory(bytes, format === 'module')
    implementations.push({ name: `published-${format}`, factory })
  }
  for (const file of (process.env.ARTPLAYER_TEST_AUDIO || '').split(path.delimiter).filter(Boolean))
    implementations.push({ name: `artifact-${path.basename(file)}`, factory: await readFactory(fs.readFileSync(file), file.endsWith('.mjs')) })
  return implementations
}

// Records plugin intent only. It does not decode media or emulate browser timing.
export function audioHost(t, initialize = () => {}) {
  const instances = []
  const warnings = []
  let play = () => Promise.resolve()
  class Audio {
    constructor() {
      instances.push(this)
      this.calls = []
      this.values = new Map()
      this.paused = true
      for (const [name, initial] of Object.entries({ src: '', preload: '', currentTime: 0, playbackRate: 1, volume: 1, muted: false })) {
        this.values.set(name, initial)
        Object.defineProperty(this, name, {
          configurable: true,
          get: () => this.values.get(name),
          set: (next) => {
            this.calls.push([name, next])
            this.values.set(name, next)
          },
        })
      }
      initialize(this)
    }

    play() {
      this.calls.push(['play'])
      return play(this)
    }

    pause() { this.calls.push(['pause']) }
    load() { this.calls.push(['load']) }
    removeAttribute(name) {
      this.calls.push(['removeAttribute', name])
      this.values.set(name, '')
    }
  }
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'Audio')
  Object.defineProperty(globalThis, 'Audio', { configurable: true, value: Audio })
  t.after(() => descriptor ? Object.defineProperty(globalThis, 'Audio', descriptor) : Reflect.deleteProperty(globalThis, 'Audio'))
  t.mock.method(console, 'warn', error => warnings.push(error))
  return { ...createAudioArt(), instances, warnings, setPlay: callback => play = callback }
}

export function createAudioArt() {
  const listeners = new Map()
  const art = {
    video: { playbackRate: 1.25 },
    currentTime: 0,
    playing: false,
    volume: 0.6,
    muted: false,
    on(event, callback) {
      if (!listeners.has(event))
        listeners.set(event, new Set())
      listeners.get(event).add(callback)
      return art
    },
    off(event, callback) {
      listeners.get(event)?.delete(callback)
      return art
    },
    emit(event, ...args) {
      for (const callback of [...(listeners.get(event) || [])])
        callback(...args)
      return art
    },
  }
  return { art, listeners }
}

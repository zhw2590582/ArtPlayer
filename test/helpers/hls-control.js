import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import vm from 'node:vm'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { loadPackage } from './load.js'

export async function hlsImplementations() {
  const { release } = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/hls-control-release.json', import.meta.url)))
  const archive = await ensureArchive(release)
  const implementations = [{ name: 'source', factory: (await loadPackage(release.name)).default }]
  for (const format of ['main', 'legacy', 'module']) {
    const member = `package/${release.manifest[format].replace(/^\.\//, '')}`
    const bytes = readMember(archive, member)
    assert.equal(hash(bytes), release.files[member])
    let factory
    if (format === 'module') {
      factory = (await import(`data:text/javascript;base64,${Buffer.from(bytes).toString('base64')}`)).default
    }
    else {
      const context = { module: { exports: {} } }
      context.exports = context.module.exports
      vm.runInNewContext(bytes.toString(), context, { timeout: 5000 })
      factory = context.module.exports
    }
    assert.equal(typeof factory, 'function')
    implementations.push({ name: `published-${format}`, factory })
  }
  return implementations
}

// Controlled SDK and registry host: no DOM rendering, decoding or ABR simulation.
export function hlsHost() {
  const listeners = new Map()
  const calls = []
  const controls = new Map()
  const settings = new Map()
  const video = {}
  const art = {
    template: { $video: video },
    constructor: { utils: { errorHandle: (condition, message) => {
      if (!condition)
        throw new Error(message)
    } } },
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
    notice: {},
  }
  let notice = ''
  Object.defineProperty(art.notice, 'show', {
    get: () => notice,
    set: (value) => {
      calls.push(['notice', value])
      notice = value
    },
  })
  for (const [name, entries] of [['controls', controls], ['setting', settings]]) {
    art[name] = {
      update(item) {
        calls.push([`${name}.update`, item.name])
        entries.set(item.name, item)
      },
      remove(nameToRemove) {
        calls.push([`${name}.remove`, nameToRemove])
        entries.delete(nameToRemove)
      },
      check(item) { calls.push([`${name}.check`, item]) },
    }
  }
  const hls = {
    media: video,
    levels: [{ height: 360 }, { height: 720 }, { height: 1080 }],
    audioTracks: [{ id: 0, name: 'English' }, { id: 1, lang: 'fr' }],
  }
  for (const [key, initial] of [['currentLevel', -1], ['audioTrack', 0]]) {
    let value = initial
    Object.defineProperty(hls, key, {
      configurable: true,
      get: () => value,
      set: (next) => {
        calls.push([key, next])
        value = next
      },
    })
  }
  art.hls = hls
  return { art, hls, calls, controls, settings, listeners }
}

export const bothMenus = () => ({ quality: { control: true, setting: true }, audio: { control: true, setting: true } })
export const selections = menu => Array.from(menu.selector, item => [item.html, item.value, item.default])

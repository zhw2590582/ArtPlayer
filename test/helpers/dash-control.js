import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import vm from 'node:vm'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { loadPackage } from './load.js'

async function factoryFromBytes(bytes, module) {
  if (module)
    return (await import(`data:text/javascript;base64,${Buffer.from(bytes).toString('base64')}`)).default
  // VM's implicit console does not forward warnings to the test process.
  const context = { module: { exports: {} }, console }
  context.exports = context.module.exports
  vm.runInNewContext(bytes.toString(), context, { timeout: 5000 })
  assert.equal(typeof context.module.exports, 'function')
  return context.module.exports
}
export async function dashImplementations() {
  const baseline = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/dash-control-release.json', import.meta.url)))
  const { release } = baseline
  const archive = await ensureArchive(release)
  const implementations = [{ name: 'source', sdk: 5, factory: (await loadPackage(release.name)).default }]
  implementations.push({ name: 'source-v4', sdk: 4, factory: implementations[0].factory })
  const historicalFile = `packages/${release.name}/dist/artplayer-plugin-dash-control.js`
  const historical = execFileSync('git', ['show', `${baseline.sourceCommit}:${historicalFile}`])
  assert.equal(hash(historical.toString().replace(/\r\n/g, '\n')), baseline.source[historicalFile])
  implementations.push({ name: 'pre-refactor-v5', sdk: 5, factory: await factoryFromBytes(historical, false) })
  for (const format of ['main', 'legacy', 'module']) {
    const member = `package/${release.manifest[format].replace(/^\.\//, '')}`
    const bytes = readMember(archive, member)
    assert.equal(hash(bytes), release.files[member])
    implementations.push({ name: `published-${format}`, sdk: 4, factory: await factoryFromBytes(bytes, format === 'module') })
  }
  for (const filename of (process.env.ARTPLAYER_TEST_DASH || '').split(path.delimiter).filter(Boolean)) {
    const bytes = fs.readFileSync(filename)
    const factory = await factoryFromBytes(bytes, filename.endsWith('.mjs'))
    for (const sdk of [4, 5])
      implementations.push({ name: `artifact-${path.basename(filename)}-v${sdk}`, sdk, factory })
  }
  return implementations
}
// A controlled SDK surface and registry. It does not decode media or simulate ABR.
export function dashHost(version = 5) {
  const calls = []
  const controls = new Map()
  const settings = new Map()
  const listeners = new Map()
  const video = {}
  const levels = [
    { id: 'low', qualityIndex: 0, height: 360, bitrateInKbit: 400 },
    { id: 'high', qualityIndex: 1, height: 720, bitrateInKbit: 1200 },
    { id: 'top', qualityIndex: 2, height: 1080, bitrateInKbit: 2400 },
  ]
  for (const level of levels) {
    if (version === 4)
      delete level.id
    else
      delete level.qualityIndex
  }
  const tracks = [{ id: 'en', lang: 'en', index: 0 }, { id: 'fr', lang: 'fr', index: 1 }]
  const state = {
    video,
    levels,
    tracks,
    currentRepresentation: levels[1],
    currentQuality: 1,
    currentTrack: tracks[0],
    settings: { streaming: { abr: { autoSwitchBitrate: { video: true, audio: false }, minBitrate: { video: -1 } } } },
  }
  const art = {
    template: { $video: video },
    isDestroy: false,
    constructor: { utils: { errorHandle(condition, message) {
      if (!condition)
        throw new Error(message)
    } } },
    notice: {},
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
      for (const callback of [...(listeners.get(name) || [])])
        callback(...args)
      return art
    },
    destroy() {
      art.isDestroy = true
      art.emit('destroy')
    },
  }
  let notice = ''
  Object.defineProperty(art.notice, 'show', {
    get: () => notice,
    set(value) {
      notice = value
      calls.push(['notice', value])
    },
  })
  for (const [name, entries] of [['controls', controls], ['setting', settings]]) {
    art[name] = {
      update(option) {
        entries.set(option.name, option)
        calls.push([`${name}.update`, option.name])
      },
      remove(key) {
        entries.delete(key)
        calls.push([`${name}.remove`, key])
      },
      check(item) {
        calls.push([`${name}.check`, item])
      },
    }
  }
  const dash = {
    getVideoElement() {
      assert.equal(this, dash)
      return state.video
    },
    getSettings() {
      assert.equal(this, dash)
      return state.settings
    },
    updateSettings(update) {
      assert.equal(this, dash)
      calls.push(['updateSettings', JSON.parse(JSON.stringify(update))])
      Object.assign(state.settings.streaming.abr.autoSwitchBitrate, update.streaming.abr.autoSwitchBitrate)
    },
    getTracksFor(type) {
      assert.equal(this, dash)
      assert.equal(type, 'audio')
      return state.tracks
    },
    getCurrentTrackFor(type) {
      assert.equal(this, dash)
      assert.equal(type, 'audio')
      return state.currentTrack
    },
    setCurrentTrack(track) {
      assert.equal(this, dash)
      state.currentTrack = track
      calls.push(['setCurrentTrack', track])
    },
    destroy() {
      calls.push(['dash.destroy'])
    },
  }
  if (version === 4) {
    Object.assign(dash, {
      getBitrateInfoListFor(type) {
        assert.equal(this, dash)
        assert.equal(type, 'video')
        return state.levels
      },
      getQualityFor(type) {
        assert.equal(this, dash)
        assert.equal(type, 'video')
        return state.currentQuality
      },
      setQualityFor(type, index) {
        assert.equal(this, dash)
        state.currentQuality = index
        calls.push(['setQualityFor', type, index])
      },
    })
  }
  else {
    Object.assign(dash, {
      getRepresentationsByType(type) {
        assert.equal(this, dash)
        assert.equal(type, 'video')
        return state.levels
      },
      getCurrentRepresentationForType(type) {
        assert.equal(this, dash)
        assert.equal(type, 'video')
        return state.currentRepresentation
      },
      setRepresentationForTypeById(type, id) {
        assert.equal(this, dash)
        state.currentRepresentation = state.levels?.find(level => level.id === id)
        calls.push(['setRepresentationForTypeById', type, id])
      },
    })
  }
  art.dash = dash
  return { art, dash, state, calls, controls, settings, listeners, video }
}
export const bothMenus = () => ({ quality: { control: true, setting: true }, audio: { control: true, setting: true } })

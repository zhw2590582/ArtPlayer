import assert from 'node:assert/strict'
import vm from 'node:vm'
import { transform } from 'esbuild'
import { verifyChromecastContract } from '../../refactor/scripts/chromecast-contract.mjs'
import { readMember } from '../../refactor/scripts/releases.mjs'

export async function chromecastHistorical() {
  const { baseline, archives, sources } = await verifyChromecastContract()
  const implementations = []
  for (const release of [baseline.release, ...baseline.previous]) {
    for (const field of ['main', 'legacy'])
      implementations.push({ name: `published-${release.version}-${field}`, code: readMember(archives.get(release.version), `package/${release.manifest[field].replace(/^\.\//u, '')}`).toString() })
  }
  const prefix = 'packages/artplayer-plugin-chromecast'
  const source = sources.get(`${prefix}/src/index.js`)
  implementations.push({ name: 'frozen-source', code: (await transform(source, { format: 'cjs', target: 'es2020' })).code, scriptCode: (await transform(source, { format: 'iife', globalName: 'artplayerPluginChromecast', target: 'es2020' })).code })
  for (const suffix of ['js', 'legacy.js'])
    implementations.push({ name: `frozen-workspace-${suffix}`, code: sources.get(`${prefix}/dist/artplayer-plugin-chromecast.${suffix}`) })
  return implementations
}

export function chromecastEnvironment(implementation, { script = false } = {}) {
  const scripts = []
  const icons = []
  const controls = []
  const logs = []
  const sdkListeners = new Map()
  const pendingMedia = []
  const mediaLoads = []
  const sdkOptions = []
  let requests = 0
  let sdk
  const context = vm.createContext({
    console: { log: (...args) => logs.push(args), warn: (...args) => logs.push(args), error: (...args) => logs.push(args) },
    document: {
      createElement: tag => ({ tag, remove() { scripts.splice(scripts.indexOf(this), 1) } }),
      body: { appendChild(element) { scripts.push(element) } },
      querySelector: selector => selector === '.art-icon-cast' ? icons[0] : null,
    },
  })
  context.window = context
  if (!script) {
    context.module = { exports: {} }
    context.exports = context.module.exports
  }
  vm.runInContext(script ? implementation.scriptCode || implementation.code : `(function () {\n${implementation.code}\n}).call(globalThis)`, context, { timeout: 1000 })
  const exported = script ? context.artplayerPluginChromecast : context.module.exports
  const factory = typeof exported === 'function' ? exported : exported.default
  assert.equal(typeof factory, 'function')

  function player(url = '/video.mp4') {
    const listeners = new Map()
    const localControls = []
    const icon = { style: {} }
    icons.push(icon)
    const art = {
      option: { url },
      notice: { show: '' },
      isDestroy: false,
      template: { $player: { querySelector: () => icon } },
      controls: {
        add(option) {
          controls.push(option)
          localControls.push(option)
          return { querySelector: () => icon }
        },
        remove(name) {
          const index = localControls.findIndex(control => control.name === name)
          if (index >= 0)
            localControls.splice(index, 1)
        },
      },
      on(name, callback) { listeners.set(name, [...listeners.get(name) || [], callback]) },
      off(name, callback) { listeners.set(name, (listeners.get(name) || []).filter(value => value !== callback)) },
    }
    return { art, icon, controls: localControls, listeners, destroy() {
      art.isDestroy = true
      for (const callback of listeners.get('destroy') || []) callback()
    } }
  }

  // Observe SDK-returned promise chains without changing the plugin's Promise globals.
  function watched(promise) {
    pendingMedia.push(promise)
    promise.catch(() => {})
    return { then: (...args) => watched(promise.then(...args)), catch: (...args) => watched(promise.catch(...args)) }
  }

  function installSdk({ requestResult, requestError, loadError } = {}) {
    const session = { loadMedia(request) {
      mediaLoads.push(request)
      return watched(loadError ? Promise.reject(loadError) : Promise.resolve())
    } }
    const castContext = {
      setOptions(value) { sdkOptions.push(value) },
      addEventListener(name, listener) { sdkListeners.set(name, [...sdkListeners.get(name) || [], listener]) },
      removeEventListener(name, listener) { sdkListeners.set(name, (sdkListeners.get(name) || []).filter(value => value !== listener)) },
      getCurrentSession: () => session,
      requestSession() {
        requests++
        return requestError ? Promise.reject(requestError) : Promise.resolve(requestResult)
      },
    }
    context.chrome = { cast: { AutoJoinPolicy: { ORIGIN_SCOPED: 'origin_scoped' }, media: {
      DEFAULT_MEDIA_RECEIVER_APP_ID: 'CC1AD845',
      MediaInfo: class {
        constructor(contentId, contentType) {
          this.contentId = contentId
          this.contentType = contentType
        }
      },
      LoadRequest: class {
        constructor(media) { this.media = media }
      },
    } } }
    context.cast = { framework: {
      CastContext: { getInstance: () => castContext },
      CastContextEventType: { SESSION_STATE_CHANGED: 'sessionstatechanged', CAST_STATE_CHANGED: 'caststatechanged' },
      SessionState: Object.fromEntries(['NO_SESSION', 'SESSION_STARTING', 'SESSION_STARTED', 'SESSION_ENDING', 'SESSION_ENDED', 'SESSION_RESUMED'].map(value => [value, value])),
      CastState: Object.fromEntries(['NO_DEVICES_AVAILABLE', 'NOT_CONNECTED', 'CONNECTING', 'CONNECTED'].map(value => [value, value])),
    } }
    sdk = { session, castContext }
    return sdk
  }
  function emit(name, value) {
    for (const callback of sdkListeners.get(name) || []) callback(value)
  }
  function sessionState(state, session = sdk.session) {
    emit('sessionstatechanged', { sessionState: state, session })
  }
  async function flush() {
    for (let index = 0; index < 8; index++) await Promise.resolve()
  }
  return { context, exported, factory, scripts, icons, controls, logs, sdkListeners, mediaLoads, pendingMedia, sdkOptions, player, installSdk, emit, sessionState, flush, requests: () => requests }
}

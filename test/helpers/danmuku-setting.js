import assert from 'node:assert/strict'
import vm from 'node:vm'
import { parseHTML } from 'linkedom'
import { danmukuCandidateEnvironment } from './danmuku-candidate.js'

export function danmukuSettingEnvironment(implementation, { readyState = 'complete' } = {}) {
  const env = danmukuCandidateEnvironment(implementation)
  // Load actual core utilities without initializing the core's browser banner/style.
  delete env.context.document
  const core = evaluate(implementation.coreCode)
  const { document, window } = parseHTML('<!doctype html><html><head></head><body><div id="external"><span id="unrelated">Keep me</span></div><div id="second"></div><div id="player"><div id="controls"></div><div id="danmuku"></div></div></body></html>')
  Object.defineProperty(document, 'readyState', { value: readyState, configurable: true })
  // Linkedom parses the real templates and dispatches events, but has no layout.
  Object.defineProperties(window.HTMLElement.prototype, {
    clientWidth: { configurable: true, get() { return this.testRect?.width ?? 640 } },
    clientHeight: { configurable: true, get() { return this.testRect?.height ?? 360 } },
    offsetWidth: { configurable: true, get() { return this.clientWidth } },
    offsetHeight: { configurable: true, get() { return this.clientHeight } },
  })
  window.HTMLElement.prototype.getBoundingClientRect = function () {
    const { left = 0, top = 0, width = 640, height = 360 } = this.testRect || {}
    return { x: left, y: top, left, top, width, height, right: left + width, bottom: top + height }
  }
  env.context.document = document
  env.context.Element = window.Element
  env.context.HTMLElement = window.HTMLElement
  env.context.window.document = document
  env.context.window.getComputedStyle = element => element.style
  env.context.getComputedStyle = element => element.style
  const documentListeners = []
  const add = document.addEventListener.bind(document)
  const remove = document.removeEventListener.bind(document)
  document.addEventListener = (type, callback, options) => {
    const record = { type, callback, active: true, options }
    documentListeners.push(record)
    record.wrapped = (...args) => {
      if (options?.once)
        record.active = false
      return callback(...args)
    }
    add(type, record.wrapped, options)
  }
  document.removeEventListener = (type, callback, options) => {
    for (const record of documentListeners) {
      if (record.type === type && record.callback === callback && record.active) {
        record.active = false
        remove(type, record.wrapped, options)
      }
    }
  }
  function evaluate(code) {
    env.context.__settingModule = { exports: {} }
    vm.runInContext(`(function(module, exports) {\n${code}\n})(__settingModule, __settingModule.exports)`, env.context, { timeout: 1000 })
    return env.context.__settingModule.exports
  }
  env.art.constructor.utils = core.utils
  env.art.template = {
    $player: document.querySelector('#player'),
    $controlsCenter: document.querySelector('#controls'),
    $danmuku: document.querySelector('#danmuku'),
  }
  const exported = evaluate(implementation.code)
  env.factory = typeof exported === 'function' ? exported : exported.default
  env.proxies.length = 0
  env.art.proxy = (target, type, callback, options) => {
    assert.ok(target?.addEventListener, `A real template target is required for ${type}`)
    const record = { target, type, callback, options, active: true }
    env.proxies.push(record)
    target.addEventListener(type, callback, options)
    record.dispose = () => {
      record.active = false
      target.removeEventListener(type, callback, options)
    }
    return record.dispose
  }
  env.art.events = { remove: dispose => dispose() }
  const event = (type, values = {}) => Object.assign(new window.Event(type, { bubbles: true, cancelable: true }), values)
  return {
    ...env,
    document,
    domWindow: window,
    documentListeners,
    event,
    query: selector => document.querySelector(selector),
    reloadPlugin() { return evaluate(implementation.code) },
    createPeer() {
      const peerListeners = new Map()
      const player = document.createElement('div')
      const controls = document.createElement('div')
      const danmuku = document.createElement('div')
      player.append(controls, danmuku)
      document.body.appendChild(player)
      const art = {
        ...env.art,
        isDestroy: false,
        template: { $player: player, $controlsCenter: controls, $danmuku: danmuku },
        on(name, callback) { peerListeners.set(name, [...peerListeners.get(name) || [], callback]) },
        off(name, callback) { peerListeners.set(name, (peerListeners.get(name) || []).filter(item => item !== callback)) },
        emit(name, ...args) {
          for (const callback of [...peerListeners.get(name) || []])
            callback(...args)
        },
      }
      return {
        art,
        destroy() {
          art.isDestroy = true
          art.emit('destroy')
        },
      }
    },
    listenerCount: () => [...env.listeners.values()].reduce((count, callbacks) => count + callbacks.length, 0),
    proxyCount: () => env.proxies.filter(record => record.active).length,
    dispatch(target, type, values) { return target.dispatchEvent(event(type, values)) },
    timeout() {
      const [id, timer] = env.timers.entries().next().value || []
      assert.ok(timer, 'Expected a pending controlled timer')
      env.timers.delete(id)
      timer.callback()
    },
  }
}

import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import vm from 'node:vm'
import validator from 'option-validator'
import { ensureArchive, hash, readMember } from '../../refactor/scripts/releases.mjs'
import { loadPackage } from './load.js'

function commonJS(bytes) {
  const module = { exports: {} }
  vm.runInNewContext(bytes.toString(), {
    module,
    exports: module.exports,
    get document() { return globalThis.document },
    get window() { return globalThis.window },
    setTimeout: (...args) => globalThis.setTimeout(...args),
    clearTimeout: id => globalThis.clearTimeout(id),
    console,
  }, { timeout: 5000 })
  return module.exports.default || module.exports
}

export async function adsImplementations() {
  const baseline = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/ads-release.json', import.meta.url)))
  const archive = await ensureArchive(baseline.release)
  const member = `package/${baseline.release.manifest.main}`
  const bytes = readMember(archive, member)
  assert.equal(hash(bytes), baseline.release.files[member])
  const file = 'packages/artplayer-plugin-ads/dist/artplayer-plugin-ads.js'
  const historical = execFileSync('git', ['show', `${baseline.sourceCommit}:${file}`])
  assert.equal(hash(historical.toString().replaceAll('\r\n', '\n')), baseline.source[file])
  const implementations = [
    { name: 'source', factory: (await loadPackage('artplayer-plugin-ads')).default },
    { name: 'published-1.0.6', historical: true, factory: commonJS(bytes) },
    { name: 'frozen-workspace-2.1.0', historical: true, factory: commonJS(historical) },
  ]
  for (const file of (process.env.ARTPLAYER_TEST_ADS || '').split(path.delimiter).filter(Boolean)) {
    const bytes = fs.readFileSync(file)
    const factory = file.endsWith('.mjs') ? (await import(`data:text/javascript;base64,${bytes.toString('base64')}`)).default : commonJS(bytes)
    implementations.push({ name: `artifact-${path.basename(file)}`, factory })
  }
  return implementations
}

// Intent fixture only: these nodes do not model layout, HTML parsing or media decoding.
export function adsEnvironment(t) {
  const document = Object.assign(new EventTarget(), { hidden: false })
  const opened = []
  for (const [name, value] of Object.entries({ document, window: { open: url => opened.push(url) } })) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, name)
    Object.defineProperty(globalThis, name, { configurable: true, value })
    t.after(() => previous ? Object.defineProperty(globalThis, name, previous) : Reflect.deleteProperty(globalThis, name))
  }
  const timers = new Map()
  let nextId = 0
  let now = 0
  t.mock.method(globalThis, 'setTimeout', (callback, delay) => {
    const id = ++nextId
    timers.set(id, { callback, at: now + Number(delay) })
    return id
  })
  t.mock.method(globalThis, 'clearTimeout', id => timers.delete(id))
  t.mock.method(Date, 'now', () => now)
  function tick(milliseconds) {
    const end = now + milliseconds
    let steps = 0
    while (true) {
      const entry = [...timers].sort((a, b) => a[1].at - b[1].at)[0]
      if (!entry || entry[1].at > end)
        break
      assert(++steps < 10000, 'Unexpected endless timer chain')
      const [id, timer] = entry
      timers.delete(id)
      now = timer.at
      timer.callback()
    }
    now = end
  }
  function host() {
    const calls = []
    const listeners = new Map()
    const proxies = []
    const nodes = new Map()
    let normalized
    class Node extends EventTarget {
      constructor(tag = 'div', className = '', html = '') {
        super()
        this.tagName = tag.toUpperCase()
        this.className = className
        this.innerHTML = html
        this.style = {}
        this.children = []
        this.muted = false
        this.paused = true
        this.ownerDocument = document
        if (className)
          nodes.set(className, this)
      }

      play() {
        calls.push(['ad.play'])
        this.paused = false
        return Promise.resolve()
      }

      pause() {
        calls.push(['ad.pause'])
        this.paused = true
      }

      remove() {
        if (this.parentNode)
          this.parentNode.children = this.parentNode.children.filter(child => child !== this)
        this.parentNode = null
        calls.push(['remove', this.className])
      }

      removeAttribute(name) {
        calls.push(['removeAttribute', this.className, name])
        delete this[name]
      }

      load() {
        calls.push(['ad.load'])
      }
    }
    const prefix = 'artplayer-plugin-ads'
    function append(parent, value) {
      if (typeof value !== 'string') {
        parent.children.push(value)
        value.parentNode = parent
        return value
      }
      const match = value.match(/^<(\w+)\s[^>]*class="([^"]*)"[^>]*>([\s\S]*)<\/\w+>$/)
      assert(match, 'Extend the fixture for a new wrapper; do not claim a real HTML parser')
      const [, tag, className, inner] = match
      const node = new Node(tag, className, inner)
      parent.children.push(node)
      node.parentNode = parent
      for (const child of inner.matchAll(/<div class="([^"]+)"[^>]*>([\s\S]*?)<\/div>/g))
        node.children.push(new Node('div', child[1], child[2]))
      return node
    }
    const art = {
      template: { $player: new Node() },
      icons: Object.fromEntries(['volume', 'volumeClose', 'fullscreenOn', 'fullscreenOff', 'loading'].map(name => [name, new Node('span', name)])),
      constructor: {
        version: '5.4.1',
        validator(value, schema) {
          normalized = validator(value, schema)
          return normalized
        },
        utils: {
          append,
          query: (selector, parent) => parent.children.find(child => child.className === selector.slice(1)),
          setStyle(node, name, value) {
            calls.push(['style', node?.className, name, value])
            node.style[name] = value
          },
          errorHandle(condition, message) {
            if (!condition)
              throw new Error(message)
          },
        },
      },
      playing: false,
      fullscreen: false,
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
      once(name, callback) {
        const once = (...args) => {
          art.off(name, once)
          callback(...args)
        }
        return art.on(name, once)
      },
      emit(name, ...args) {
        calls.push(['emit', name, ...args])
        for (const callback of [...(listeners.get(name) || [])]) callback(...args)
        return art
      },
      proxy(target, name, callback) {
        target.addEventListener(name, callback)
        const off = () => target.removeEventListener(name, callback)
        proxies.push(off)
        return off
      },
      play() {
        calls.push(['content.play', art.isDestroy])
        art.playing = true
        art.emit('play')
        return Promise.resolve()
      },
      pause() {
        calls.push(['content.pause'])
        art.playing = false
        art.emit('pause')
      },
      destroy() {
        art.isDestroy = true
        art.emit('destroy')
        proxies.splice(0).forEach(off => off())
        listeners.clear()
      },
    }
    return {
      art,
      nodes,
      calls,
      listeners,
      get normalized() { return normalized },
      node: suffix => nodes.get(suffix ? `${prefix}-${suffix}` : prefix),
      start() { art.emit('ready').emit('play') },
      fire(suffix, name) { nodes.get(`${prefix}-${suffix}`).dispatchEvent(new Event(name)) },
      visibility(hidden) {
        document.hidden = hidden
        document.dispatchEvent(new Event('visibilitychange'))
        art.emit('document:visibilitychange')
      },
    }
  }
  return { host, tick, timers, document, opened }
}

import assert from 'node:assert/strict'
import vm from 'node:vm'
import { build, transform } from 'esbuild'
import { readMember } from '../../refactor/scripts/releases.mjs'
import { verifyVastContract } from '../../refactor/scripts/vast-contract.mjs'
import { resolveSource } from './load.js'
import { createVastSdk } from './vast-sdk.js'

export async function vastImplementations() {
  const contract = await verifyVastContract()
  const archive = contract.archives.get('artplayer-plugin-vast@1.0.0')
  const { outputFiles } = await build({ entryPoints: [resolveSource('packages/artplayer-plugin-vast/src/index')], bundle: true, write: false, format: 'cjs', platform: 'browser', external: ['@glomex/vast-ima-player'] })
  const frozen = async source => (await transform(source, { loader: 'js', format: 'cjs', target: 'es2020' })).code
  return [
    { name: 'source', code: outputFiles[0].text },
    { name: 'published-1.0.0-source', historical: true, published: true, code: await frozen(readMember(archive, 'package/src/index.js').toString()) },
    { name: 'frozen-workspace-1.2.0', historical: true, code: await frozen(contract.sources.get('packages/artplayer-plugin-vast/src/index.js')) },
  ]
}

export function vastEnvironment(implementation, options = {}) {
  const fixture = createVastSdk(options)
  const module = { exports: {} }
  class FixedDate extends Date {
    static now() { return 1000 }
  }
  vm.runInNewContext(implementation.code, {
    module,
    exports: module.exports,
    window: { google: { ima: fixture.ima } },
    Date: FixedDate,
    console: { error: (...args) => fixture.state.errors.push(args) },
    require(name) {
      assert.equal(name, '@glomex/vast-ima-player', 'Only the external SDK may be substituted')
      return fixture.sdk
    },
  }, { timeout: 5000 })
  const factory = module.exports.default || module.exports
  function host() {
    const listeners = new Map()
    const calls = []
    const node = () => ({ style: {}, parentNode: null })
    const parent = {
      children: [],
      appendChild(child) {
        if (child.parentNode)
          child.parentNode.removeChild(child)
        child.parentNode = this
        this.children.push(child)
        return child
      },
      removeChild(child) {
        const index = this.children.indexOf(child)
        assert(index !== -1, 'removeChild requires an owned node')
        this.children.splice(index, 1)
        child.parentNode = null
        return child
      },
    }
    const art = {
      template: { $player: parent, $video: {} },
      constructor: { utils: { createElement: node, setStyles: (target, styles) => Object.assign(target.style, styles), append: (target, child) => target.appendChild(child) } },
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
        calls.push([name, ...args])
        for (const callback of [...(listeners.get(name) || [])]) callback(...args)
        return art
      },
      destroy() {
        if (art.isDestroy)
          return
        art.isDestroy = true
        art.emit('destroy')
        listeners.clear()
      },
    }
    return { art, parent, calls, listeners }
  }
  return { ...fixture, factory, host }
}

export function deferred() {
  let resolve
  let reject
  const promise = new Promise((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

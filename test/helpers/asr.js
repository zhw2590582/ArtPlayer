import assert from 'node:assert/strict'
import vm from 'node:vm'
import { transform } from 'esbuild'
import { verifyAsrContract } from '../../refactor/scripts/asr-contract.mjs'
import { readMember } from '../../refactor/scripts/releases.mjs'

export async function asrHistorical() {
  const { baseline, archives, sources } = await verifyAsrContract()
  const implementations = []
  for (const release of [baseline.release, ...baseline.previous]) {
    for (const field of ['main', 'legacy'])
      implementations.push({ name: `published-${release.version}-${field}`, code: readMember(archives.get(release.version), `package/${release.manifest[field].replace(/^\.\//, '')}`).toString() })
  }
  const prefix = 'packages/artplayer-plugin-asr'
  const source = sources.get(`${prefix}/src/index.js`).replace('import style from \'./style.less?inline\'', 'const style = \'frozen-source-style\'')
  implementations.push({ name: 'frozen-source', code: (await transform(source, { format: 'cjs', target: 'es2020' })).code, scriptCode: (await transform(source, { format: 'iife', globalName: 'artplayerPluginAsr', target: 'es2020' })).code })
  for (const suffix of ['js', 'legacy.js'])
    implementations.push({ name: `frozen-workspace-${suffix}`, code: sources.get(`${prefix}/dist/artplayer-plugin-asr.${suffix}`) })
  return implementations
}

export function asrEnvironment(implementation, { script = false } = {}) {
  const listeners = new Map()
  const timeouts = new Map()
  const styles = new Map()
  const layer = { style: {}, innerHTML: '' }
  let id = 0
  const context = vm.createContext({
    console,
    setTimeout(callback, delay) {
      timeouts.set(++id, { callback, delay })
      return id
    },
    clearTimeout(timer) { timeouts.delete(timer) },
    clearInterval() {},
    document: {
      getElementById: id => styles.get(id),
      createElement: () => ({}),
      head: { appendChild(element) { styles.set(element.id, element) } },
    },
  })
  context.window = context
  if (!script) {
    context.module = { exports: {} }
    context.exports = context.module.exports
  }
  const code = script ? implementation.scriptCode || implementation.code : `(function () {\n${implementation.code}\n}).call(globalThis)`
  vm.runInContext(code, context, { timeout: 1000 })
  const exported = script ? context.artplayerPluginAsr : context.module.exports
  const factory = typeof exported === 'function' ? exported : exported.default
  assert.equal(typeof factory, 'function', implementation.name)
  const layers = []
  const art = {
    video: {},
    volume: 0.5,
    layers: { add(option) {
      layers.push(option)
      return layer
    } },
    on(name, callback) { listeners.set(name, [...listeners.get(name) || [], callback]) },
    off(name, callback) { listeners.set(name, (listeners.get(name) || []).filter(listener => listener !== callback)) },
  }
  return { context, factory, exported, styles, layer, layers, listeners, timeouts, art, reload: () => vm.runInContext(code, context), emit: name => Promise.all((listeners.get(name) || []).map(callback => callback())) }
}

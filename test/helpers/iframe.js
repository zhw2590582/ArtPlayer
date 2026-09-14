import assert from 'node:assert/strict'
import fs from 'node:fs'
import process from 'node:process'
import vm from 'node:vm'
import { verifyIframeContract } from '../../refactor/scripts/iframe-contract.mjs'
import { hash, readMember } from '../../refactor/scripts/releases.mjs'
import { browserCandidate } from './browser-candidate.js'
import { compilePackage } from './load.js'

export async function iframeCandidate() {
  if (process.env.ARTPLAYER_IFRAME_BASELINE === '1')
    return (await iframeHistorical()).find(item => item.name === 'workspace.js')
  const artifact = process.env.ARTPLAYER_IFRAME_ARTIFACT
  const code = artifact ? fs.readFileSync(artifact, 'utf8') : await compilePackage('artplayer-tool-iframe', 'umd')
  return { name: artifact ? 'candidate-artifact' : 'candidate-source', global: 'ArtplayerToolIframe', namespace: false, code, provenance: { kind: artifact ? 'explicit-artifact' : 'source-build', file: artifact || null, sha256: hash(code) } }
}

export async function iframeBrowserCandidate() {
  if (!process.env.ARTPLAYER_BROWSER_ARTIFACTS)
    return iframeCandidate()
  assert(process.env.ARTPLAYER_IFRAME_BASELINE !== '1', 'Installed Iframe cannot use the frozen workspace')
  const loaded = await browserCandidate('artplayer-tool-iframe', process.env.ARTPLAYER_IFRAME_ARTIFACT)
  return { name: 'candidate-installed', global: 'ArtplayerToolIframe', namespace: false, ...loaded }
}

export async function iframeHistorical() {
  const { baseline, archive, sources } = await verifyIframeContract()
  return [
    ...Object.keys(baseline.release.files).filter(file => file.startsWith('package/dist/')).map(file => ({ name: `published-${file.split('/').at(-1)}`, code: readMember(archive, file).toString(), global: file.includes('helper') ? 'ArtplayerHelperIframe' : 'ArtplayerPluginIframe', namespace: true })),
    ...['.js', '.legacy.js'].map(suffix => ({ name: `workspace${suffix}`, code: sources.get(`packages/artplayer-tool-iframe/dist/artplayer-tool-iframe${suffix}`), global: 'ArtplayerToolIframe', namespace: false })),
  ]
}

export function iframeEnvironment(implementation, child = false) {
  const handlers = new Map()
  const timers = new Map()
  const sent = []
  const order = []
  let now = 1234
  let nextTimer = 0
  class Frame {
    contentWindow = { postMessage: (packet, origin) => sent.push({ packet, origin }) }
    get src() { return this.url }
    set src(value) {
      this.url = value
      order.push('src')
    }
  }
  const module = { exports: {} }
  const box = {
    module,
    exports: module.exports,
    HTMLIFrameElement: Frame,
    Date: class extends Date { static now() { return now } },
    setTimeout(callback, delay) {
      const id = ++nextTimer
      timers.set(id, { callback, delay })
      return id
    },
    clearTimeout(id) { timers.delete(id) },
    addEventListener(name, callback) {
      const set = handlers.get(name) || new Set()
      set.add(callback)
      handlers.set(name, set)
      order.push(`listen:${name}`)
    },
    removeEventListener(name, callback) { handlers.get(name)?.delete(callback) },
  }
  box.window = box
  box.self = box
  box.top = child ? {} : box
  box.parent = { postMessage: (packet, origin) => sent.push({ packet, origin }) }
  vm.runInNewContext(implementation.code, box)
  const exported = module.exports
  const Factory = exported.default || exported
  return { box, Factory, exported, Frame, handlers, timers, sent, order, now(value) {
    now = value
  }, dispatch(data, source, origin = 'https://unrelated.invalid') {
    for (const callback of handlers.get('message') || []) callback({ data, source, origin })
  } }
}

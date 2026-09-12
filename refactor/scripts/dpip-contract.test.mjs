import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Node frozen contract runner.
import test from 'node:test'
import vm from 'node:vm'
import { checkFiles } from '../../scripts/package-check.mjs'
import { dpipEnvironment, dpipHistorical } from '../../test/helpers/dpip.js'
import { verifyDpipContract } from './dpip-contract.mjs'
import { archiveFiles, readMember } from './releases.mjs'

test('Document PiP freezes four actual archives, twenty-one members and seven workspace inputs', async () => {
  const { baseline } = await verifyDpipContract()
  const releases = [baseline.release, ...baseline.previous]
  assert.deepEqual(releases.map(release => release.version), ['1.1.0', '1.0.2', '1.0.1', '1.0.0'])
  assert.equal(releases.reduce((sum, release) => sum + Object.keys(release.files).length, 0), 21)
  assert.equal(Object.keys(baseline.source).length, 7)
  assert.deepEqual(releases.map(release => release.historicalCore.version), ['5.3.1', '5.3.0-beta.3', '5.3.0', '5.3.0'])
})

test('Document PiP 1.0.0 actually lacks its declared runtime; runnable fixtures never substitute Git code for that archive', async () => {
  const { baseline, archives } = await verifyDpipContract()
  const release = baseline.previous.find(item => item.version === '1.0.0')
  assert.deepEqual(Object.keys(release.missingEntrypoints), ['main', 'module', 'legacy'])
  assert.deepEqual(archiveFiles(archives.get('1.0.0')), ['package/README.md', 'package/package.json', 'package/types/artplayer-plugin-document-pip.d.ts'])
  assert.throws(() => checkFiles(release.manifest, archiveFiles(archives.get('1.0.0'))), /main/)
  const implementations = await dpipHistorical()
  assert(!implementations.some(item => item.name === 'published-1.0.0'))
  assert.equal(implementations.length, 4)
})

test('Document PiP published and frozen declarations keep required options and historical void actions despite async runtime', async () => {
  const { baseline, archives, sources } = await verifyDpipContract()
  const texts = [baseline.release, ...baseline.previous].map(release => readMember(archives.get(release.version), `package/${release.manifest.types.replace(/^\.\//, '')}`).toString())
  texts.push(sources.get('packages/artplayer-plugin-document-pip/types/artplayer-plugin-document-pip.d.ts'))
  for (const source of texts) {
    assert.match(source, /\(option: Option\) => \(art: Artplayer\) => Result/)
    for (const field of ['width', 'height']) assert.match(source, new RegExp(`${field}\\?: number`))
    assert.match(source, /placeholder\?: string/)
    assert.match(source, /fallbackToVideoPiP\?: boolean/)
    for (const method of ['open', 'close', 'toggle']) assert.match(source, new RegExp(`${method}: \\(\\) => void`))
    assert.match(source, /isActive: boolean/)
    assert.doesNotMatch(source, /Promise</)
  }
})

test('Document PiP runnable main, legacy, globals and native ESM expose actual historical export generations', async () => {
  const { baseline, archives } = await verifyDpipContract()
  for (const release of [baseline.release, ...baseline.previous].filter(release => !release.missingEntrypoints.main)) {
    for (const field of ['main', 'legacy']) {
      const code = readMember(archives.get(release.version), `package/${release.manifest[field].replace(/^\.\//, '')}`).toString()
      const env = dpipEnvironment({ code })
      assert.equal(typeof env.factory, 'function')
      assert.equal(typeof env.exported, release.version === '1.1.0' ? 'function' : 'object')
      const global = { window: {} }
      vm.runInNewContext(code, global)
      assert.equal(typeof (global.artplayerPluginDocumentPip || global.window.artplayerPluginDocumentPip), 'function')
    }
    const source = readMember(archives.get(release.version), `package/${release.manifest.module.replace(/^\.\//, '')}`).toString()
    const module = await import(`data:text/javascript,${encodeURIComponent(source)}`)
    assert.equal(typeof module.default, 'function')
  }
})

for (const implementation of await dpipHistorical()) {
  test(`Document PiP ${implementation.name}: synchronous registration, controls and unsupported fallback with live readonly flags`, async () => {
    const env = dpipEnvironment(implementation, { supported: false })
    const result = env.factory()(env.art)
    assert.deepEqual(Object.keys(result), ['name', 'isSupported', 'isActive', 'open', 'close', 'toggle'])
    assert.equal(result.name, 'artplayerPluginDocumentPip')
    assert.equal(result.isSupported, false)
    assert.equal(result.isActive, false)
    assert.equal(Reflect.set(result, 'isActive', true), false)
    const { spec, node } = env.controls.get('document-pip')
    assert.equal(spec.position, 'right')
    assert.equal(spec.index, 40)
    assert.equal(spec.tooltip, 'PIP Mode')
    assert.equal(node.content, 'pip-icon')
    assert.equal(node.listeners.get('click').size, 1)
    const pending = result.open()
    assert.equal(typeof pending.then, 'function')
    assert.equal(await pending, undefined)
    assert.equal(env.art.pip, true)
    assert.equal(env.requests.length, 0)
    assert.equal(env.warnings.length, 1)
    env.window.documentPictureInPicture = { requestWindow: () => Promise.resolve(env.createWindow()) }
    assert.equal(result.isSupported, false, 'Capability is captured during registration')
    assert.equal(await result.close(), undefined)
    assert.equal(result.toggle(), undefined)
    await env.flush()
  })

  test(`Document PiP ${implementation.name}: normal window adoption, styles, UI events and restoration retain public ordering`, async () => {
    const env = dpipEnvironment(implementation)
    const link = env.document.createElement('link')
    Object.assign(link, { rel: 'stylesheet', href: 'https://example.invalid/player.css', media: 'screen', crossOrigin: 'anonymous', referrerPolicy: 'no-referrer' })
    env.document.head.appendChild(link)
    const result = env.factory({ width: 720, height: 405, placeholder: 'PiP active' })(env.art)
    assert.equal(await result.open(), undefined)
    const win = env.windows[0]
    assert.deepEqual({ ...env.requests[0] }, { width: 720, height: 405 })
    assert.equal(result.isActive, true)
    assert.equal(env.player.ownerDocument, win.document)
    assert.equal(env.parent.children[0].textContent, 'PiP active')
    assert.equal(env.parent.children[1], env.sibling)
    assert.equal(win.document.body.children[0].children[0], env.player)
    const copied = win.document.querySelectorAll('link[rel="stylesheet"]')[0]
    for (const name of ['href', 'media', 'crossOrigin', 'referrerPolicy']) assert.equal(copied[name], link[name])
    assert.equal(win.document.querySelectorAll('style').length, 2)
    assert(win.document.querySelector('meta[name="viewport"]'))
    assert.equal(env.controls.get('document-pip').node.tooltip, 'Exit PIP Mode')
    assert.deepEqual(env.emitted.map(event => [event.name, ...event.args]), [['document-pip', true], ['resize']])
    assert.equal(await result.close(), undefined)
    assert.equal(result.isActive, false)
    assert.equal(win.closed, true)
    assert.equal(env.player.ownerDocument, env.document)
    assert.deepEqual(env.parent.children, [env.player, env.sibling])
    assert.equal(env.player.className, 'art-video-player')
    assert.equal(env.controls.get('document-pip').node.tooltip, 'PIP Mode')
    assert.deepEqual(env.emitted.map(event => [event.name, ...event.args]), [['document-pip', true], ['resize'], ['document-pip', false], ['resize']])
    assert.deepEqual(env.sleeps, [100, 100])
    assert.deepEqual(env.rebinds.map(item => item.document), [win.document, env.document])
    assert.equal([...win.listeners.values()].reduce((sum, set) => sum + set.size, 0), 0)
  })

  test(`Document PiP ${implementation.name}: factory option snapshot, defaults and deferred style injection remain reproducible`, async () => {
    const env = dpipEnvironment(implementation, { readyState: 'loading' })
    assert.equal(env.document.getElementById('artplayer-plugin-document-pip'), null)
    env.document.readyState = 'complete'
    env.document.dispatchEvent({ type: 'DOMContentLoaded' })
    assert.match(env.document.getElementById('artplayer-plugin-document-pip').textContent, /artplayer-document-pip/)
    assert.equal(env.document.querySelectorAll('style').length, 1)
    const option = { width: undefined, placeholder: 'saved' }
    const register = env.factory(option)
    option.width = 999
    option.placeholder = 'changed'
    const result = register(env.art)
    assert.equal(result.toggle(), undefined)
    await env.flush()
    assert.deepEqual({ ...env.requests[0] }, { width: undefined, height: 270 })
    assert.equal(env.parent.children[0].textContent, 'saved')
    await result.close()
    const normal = env.factory()(env.art)
    await normal.open()
    assert.deepEqual({ ...env.requests[1] }, { width: 480, height: 270 })
    assert.equal(env.parent.children[0].textContent, 'Playing in Document Picture-in-Picture')
    await normal.close()
  })
}

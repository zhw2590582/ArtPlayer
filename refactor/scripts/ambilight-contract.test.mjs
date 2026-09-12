import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Freeze actual published plugin contracts before migration.
import test from 'node:test'
import vm from 'node:vm'
import { ambilightEnvironment, ambilightHistorical } from '../../test/helpers/ambilight.js'
import { verifyAmbilightContract } from './ambilight-contract.mjs'
import { readMember } from './releases.mjs'

const contract = await verifyAmbilightContract()

test('Ambilight archives, manifests and source snapshots retain their exact identities', () => {
  assert.equal(contract.baseline.release.version, '1.1.0')
  assert.equal(contract.baseline.previous[0].version, '1.0.0')
  assert.equal([...contract.archives].length, 2)
  assert.equal(contract.baseline.release.historicalCore.version, '5.3.1')
  assert.equal(contract.baseline.previous[0].historicalCore.version, '5.1.7')
})

test('Ambilight published CommonJS and script globals preserve their distinct export shapes', () => {
  for (const release of [contract.baseline.release, ...contract.baseline.previous]) {
    for (const field of ['main', 'legacy']) {
      const code = readMember(contract.archives.get(release.version), `package/${release.manifest[field].replace(/^\.\//, '')}`).toString()
      const module = { exports: {} }
      const window = {}
      vm.runInNewContext(code, { module, exports: module.exports, window }, { timeout: 5000 })
      assert.equal(typeof module.exports, release.version === '1.0.0' ? 'object' : 'function')
      assert.equal(typeof (module.exports.default || module.exports)(), 'function')
      const global = { window: {} }
      vm.runInNewContext(code, global, { timeout: 5000 })
      assert.equal(typeof (global.artplayerPluginAmbilight || global.window.artplayerPluginAmbilight), 'function')
    }
  }
})

test('Ambilight published declarations retain the required options argument and ignored zIndex field', () => {
  const old = readMember(contract.archives.get('1.0.0'), 'package/types/artplayer-plugin-ambilight.d.ts').toString()
  const current = readMember(contract.archives.get('1.1.0'), 'package/types/artplayer-plugin-ambilight.d.ts').toString()
  assert.match(old, /export = artplayerPluginAmbilight/)
  assert.match(current, /export default artplayerPluginAmbilight/)
  for (const source of [old, current]) {
    assert.match(source, /\(option: Option\)/)
    assert.match(source, /zIndex\??: number/)
  }
  assert.match(current, /blur\?: string/)
  assert.match(old, /blur: string/)
})

test('Ambilight 1.1.0 native ESM import exposes the default factory', async () => {
  const source = readMember(contract.archives.get('1.1.0'), 'package/dist/artplayer-plugin-ambilight.mjs').toString()
  const namespace = await import(`data:text/javascript,${encodeURIComponent(source)}`)
  assert.deepEqual(Object.keys(namespace), ['default'])
  assert.equal(typeof namespace.default, 'function')
  assert.equal(typeof namespace.default(), 'function')
})

for (const implementation of await ambilightHistorical()) {
  test(`Ambilight ${implementation.name}: defaults, option-read timing, styling, grid sampling and public returns`, async () => {
    const env = await ambilightEnvironment(implementation)
    const option = { opacity: 0.1, zIndex: -99 }
    const attach = env.factory(option)
    option.opacity = 0.7
    const result = attach(env.art)
    const element = env.parent.children[0]
    assert.equal(element.className, 'artplayer-plugin-ambilight')
    assert.equal(element.children.length, 9)
    assert.equal(element.style.zIndex, 9, 'Historical zIndex option is ignored')
    assert.equal(element.children[0].style.opacity, 0.7)
    assert.equal(element.children[0].style.filter, 'blur(50px)')
    assert.equal(element.children[0].style.transition, 'background-color 0.3s ease')
    assert.deepEqual(Object.keys(result), ['name', 'start', 'stop'])
    assert.equal(result.name, 'artplayerPluginAmbilight')
    assert.equal(result.start(), undefined)
    assert.equal(env.frames.size, 1)
    assert.equal(env.draws.length, 0)
    env.art.playing = true
    env.frame(100)
    assert.equal(env.draws.length, 9)
    assert.deepEqual([...env.draws[0].slice(1)], [0, 0, 100, 50, 0, 0, 1, 1])
    assert.deepEqual([...env.draws[8].slice(1)], [200, 100, 100, 50, 0, 0, 1, 1])
    assert.equal(element.children[8].style.backgroundColor, 'rgb(9, 20, 30)')
    assert.equal(result.stop(), undefined)
    assert.equal(env.frames.size, 0)
    assert.equal(typeof env.factory(), 'function', 'Runtime accepts omitted options despite the old declaration')
  })
}

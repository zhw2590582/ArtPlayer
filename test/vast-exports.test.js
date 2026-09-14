import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Exercise real bundled SDK exports without external ad loading.
import test from 'node:test'
import vm from 'node:vm'
import { compilePackage } from './helpers/load.js'

const code = process.env.ARTPLAYER_VAST_ARTIFACT
  ? fs.readFileSync(process.env.ARTPLAYER_VAST_ARTIFACT, 'utf8')
  : await compilePackage('artplayer-plugin-vast', 'umd')

for (const format of ['commonjs', 'global', 'amd']) {
  test(`VAST ${format} preserves direct and historical default calls on one factory`, async () => {
    const window = {}
    const box = { window, CustomEvent }
    let factory
    if (format === 'commonjs') {
      box.module = { exports: {} }
      box.exports = box.module.exports
    }
    else if (format === 'amd') {
      box.define = (dependencies, create) => {
        if (typeof dependencies === 'function') {
          factory = dependencies()
        }
        else {
          assert.deepEqual([...dependencies], [])
          factory = create()
        }
      }
      box.define.amd = {}
    }
    vm.runInNewContext(code, box, { timeout: 5000 })
    factory ||= format === 'commonjs' ? box.module.exports : box.artplayerPluginVast || window.artplayerPluginVast
    assert.equal(typeof factory, 'function')
    assert.equal(factory.default, factory)
    assert.equal(factory.default.default, factory)
    assert.deepEqual(Object.getOwnPropertyDescriptor(factory, 'default'), { value: factory, writable: true, enumerable: true, configurable: true })
    for (const entry of [factory, factory.default]) {
      const pending = entry(() => assert.fail('A destroyed core cannot receive a callback'))({ isDestroy: true })
      assert.equal(typeof pending.then, 'function')
      const result = await pending
      assert.equal(result.name, 'artplayerPluginVast')
      assert.equal(result.destroy(), undefined)
    }
  })
}

test('VAST ESM default import retains the same callable alias', async () => {
  const esm = process.env.ARTPLAYER_VAST_ESM_ARTIFACT
    ? fs.readFileSync(process.env.ARTPLAYER_VAST_ESM_ARTIFACT, 'utf8')
    : await compilePackage('artplayer-plugin-vast', 'es')
  const { default: factory } = await import(`data:text/javascript;base64,${Buffer.from(esm).toString('base64')}`)
  assert.equal(typeof factory, 'function')
  assert.equal(factory.default, factory)
  const pending = factory.default()({ isDestroy: true })
  assert.equal(typeof pending.then, 'function')
  assert.equal((await pending).name, 'artplayerPluginVast')
})

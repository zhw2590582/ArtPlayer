import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Actual ASR distribution imports use the repository runner.
import test from 'node:test'

test('ASR built ESM imports without DOM and keeps both factory paths and synchronous registration', async () => {
  const module = await import('../packages/artplayer-plugin-asr/dist/artplayer-plugin-asr.mjs')
  assert.deepEqual(Object.keys(module), ['default'])
  assert.equal(module.default.default, module.default)
  assert.deepEqual(Object.keys(module.default), [])
  const events = new Map()
  const layer = { style: {}, innerHTML: '' }
  const result = module.default({ length: 1 })({
    video: {},
    volume: 0.5,
    layers: { add: () => layer },
    on: (name, callback) => events.set(name, callback),
    off: name => events.delete(name),
  })
  assert.equal(result.then, undefined)
  assert.deepEqual(Object.keys(result), ['name', 'stop', 'hide', 'append'])
  result.append('One. <b>Two</b>')
  assert.equal(layer.innerHTML, '<div class="art-asr-line"><b>Two</b></div>')
  await result.stop()
  await events.get('destroy')()
  assert.equal(events.size, 0)
})

test('ASR three generated package artifacts exactly match the demo copies', () => {
  for (const suffix of ['js', 'legacy.js', 'mjs']) {
    const name = `artplayer-plugin-asr.${suffix}`
    assert.deepEqual(fs.readFileSync(`packages/artplayer-plugin-asr/dist/${name}`), fs.readFileSync(`docs/compiled/${name}`))
  }
})

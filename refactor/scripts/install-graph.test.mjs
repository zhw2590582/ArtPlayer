import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Verify install comparison cannot borrow ancestor dependencies.
import test from 'node:test'
import { consumerDirectory, removeConsumer } from '../../scripts/package-consumer.mjs'
import { installedGraph } from './install-graph.mjs'

function write(directory, manifest) {
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify(manifest))
}

test('installation audit rejects a dependency resolved from the parent checkout', () => {
  const directory = consumerDirectory()
  try {
    const root = path.join(directory, 'checkout')
    write(root, { name: 'root', version: '1.0.0', dependencies: { borrowed: '1.0.0' } })
    fs.mkdirSync(path.join(root, 'packages'))
    write(path.join(directory, 'node_modules/borrowed'), { name: 'borrowed', version: '1.0.0' })
    assert.throws(() => installedGraph(root), /escaped isolated checkout/)
  }
  finally { removeConsumer(directory) }
})

test('installation audit records workspace peers, nested resolution and resource identities', () => {
  const directory = consumerDirectory()
  try {
    write(directory, { name: 'root', version: '1.0.0', devDependencies: { compiler: '1.0.0' }, dependencies: { buffer: '5.7.1' } })
    write(path.join(directory, 'node_modules/buffer'), { name: 'buffer', version: '5.7.1' })
    write(path.join(directory, 'node_modules/compiler'), { name: 'compiler', version: '1.0.0', dependencies: { engine: '2.0.0' }, scripts: { postinstall: 'node install.js' } })
    write(path.join(directory, 'node_modules/compiler/node_modules/engine'), { name: 'engine', version: '2.0.0' })
    fs.writeFileSync(path.join(directory, 'node_modules/compiler/node_modules/engine/code.wasm'), 'fixture')
    write(path.join(directory, 'packages/plugin'), { name: 'plugin', version: '1.0.0', peerDependencies: { host: '^1' }, peerDependenciesMeta: { host: { optional: true } } })
    const graph = installedGraph(directory)
    assert.equal(graph.rootTools[0].resolved, 'compiler@1.0.0')
    assert.equal(graph.requests.find(item => item.name === 'buffer').resolved, 'buffer@5.7.1')
    assert.equal(graph.requests.find(item => item.name === 'engine').resolved, 'engine@2.0.0')
    assert.equal(graph.missing[0].name, 'host')
    assert.equal(graph.missing[0].optional, true)
    assert.equal(graph.resources.length, 1)
    assert.equal(graph.resources[0].package, 'engine@2.0.0')
    assert.equal(graph.resources[0].bytes, 7)
    assert.equal(graph.packages.find(item => item.name === 'compiler').lifecycle.postinstall, 'node install.js')
  }
  finally { removeConsumer(directory) }
})

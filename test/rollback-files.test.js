import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Exercise stale and incomplete rollback installations.
import { test } from 'node:test'
import { hash } from '../refactor/scripts/releases.mjs'
import { consumerDirectory, removeConsumer } from '../scripts/package-consumer.mjs'
import { verifyRollbackFiles } from '../scripts/rollback-files.mjs'

test('rollback verifies content even when candidate and old version match', () => {
  const dir = consumerDirectory()
  try {
    const root = path.join(dir, 'node_modules/artplayer')
    fs.mkdirSync(root, { recursive: true })
    const manifest = JSON.stringify({ name: 'artplayer', version: '1.0.0' })
    fs.writeFileSync(path.join(root, 'package.json'), manifest)
    fs.writeFileSync(path.join(root, 'index.js'), 'old')
    const pkg = { name: 'artplayer', version: '1.0.0', files: { 'package/package.json': hash(manifest), 'package/index.js': hash('old') } }
    assert.equal(verifyRollbackFiles(dir, pkg).verifiedMembers, 2)
    fs.writeFileSync(path.join(root, 'index.js'), 'new')
    assert.throws(() => verifyRollbackFiles(dir, pkg), /Rollback bytes differ/)
    fs.writeFileSync(path.join(root, 'index.js'), 'old')
    fs.writeFileSync(path.join(root, 'runtime.js'), 'new-only')
    assert.throws(() => verifyRollbackFiles(dir, pkg), /leftover files/)
    fs.unlinkSync(path.join(root, 'runtime.js'))
    fs.unlinkSync(path.join(root, 'index.js'))
    assert.throws(() => verifyRollbackFiles(dir, pkg), /missing or leftover/)
  }
  finally { removeConsumer(dir) }
})

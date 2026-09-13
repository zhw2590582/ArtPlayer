import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
// eslint-disable-next-line test/no-import-node-test -- Verify isolated package runtime evidence and rejected inputs.
import test from 'node:test'
import { publishedConsumer } from '../scripts/package-check.mjs'
import { removeConsumer } from '../scripts/package-consumer.mjs'
import { checkPackageRuntime, runtimeConsumer, verifyInstalledFiles } from '../scripts/package-runtime.mjs'

test('Runtime evidence records the actual child Node version with published contracts', async () => {
  const { dir, releases } = await publishedConsumer()
  try {
    verifyInstalledFiles(dir, releases)
    const result = runtimeConsumer(dir, { baseline: true })
    assert.equal(result.node, process.versions.node)
    assert(result.checks.includes('DIST.esm'))
    assert(result.checks.includes('SSR.constructor-browser-only'))
  }
  finally { removeConsumer(dir) }
})

test('Installed runtime verification rejects tampered bytes, traversal and workspace links', async () => {
  const { dir, releases } = await publishedConsumer()
  try {
    const manifest = path.join(dir, 'node_modules/artplayer/package.json')
    const original = fs.readFileSync(manifest)
    fs.appendFileSync(manifest, '\n')
    assert.throws(() => verifyInstalledFiles(dir, releases), /Installed package bytes differ/)
    fs.writeFileSync(manifest, original)
    const unsafe = structuredClone(releases)
    unsafe[0].files['package/../escape'] = '0'.repeat(64)
    assert.throws(() => verifyInstalledFiles(dir, unsafe), /Unsafe package member/)
    const root = path.join(dir, 'node_modules/artplayer')
    const target = path.join(dir, 'linked-artplayer')
    assert(path.dirname(target) === dir && path.dirname(path.dirname(root)) === dir)
    fs.renameSync(root, target)
    fs.symlinkSync(target, root, process.platform === 'win32' ? 'junction' : 'dir')
    assert.throws(() => verifyInstalledFiles(dir, releases), /workspace links/)
  }
  finally { removeConsumer(dir) }
})

test('Runtime selection cannot silently fall back to a different Node version', () => {
  assert.throws(() => checkPackageRuntime({ expectedNode: '0.0.0' }), /requested exact Node/)
})

test('Runtime package selection rejects other directories and stale source commits before installing', () => {
  const parent = path.resolve('refactor/.cache/packages')
  fs.mkdirSync(parent, { recursive: true })
  const directory = fs.mkdtempSync(path.join(parent, 'run-runtime-negative-'))
  try {
    fs.writeFileSync(path.join(directory, 'report.json'), JSON.stringify({ source: '0'.repeat(40) }))
    assert.throws(() => checkPackageRuntime({ expectedNode: process.versions.node, output: directory }), /another commit/)
    assert.throws(() => checkPackageRuntime({ expectedNode: process.versions.node, output: parent }), /direct package-check run/)
  }
  finally {
    assert.equal(path.dirname(fs.realpathSync(directory)), fs.realpathSync(parent))
    assert(path.basename(directory).startsWith('run-runtime-negative-'))
    fs.rmSync(directory, { recursive: true, force: true })
  }
})

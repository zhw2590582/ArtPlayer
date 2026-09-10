import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- This fixture exercises the repository's Node test runner.
import { test } from 'node:test'
import { checkFiles, publishedConsumer } from '../scripts/package-check.mjs'
import { removeConsumer, runtimeConsumer } from '../scripts/package-consumer.mjs'

test('Package checks reject missing files, missing wildcard exports and internal configuration', () => {
  const manifest = { name: 'fixture', main: './dist/main.js', module: './dist/main.mjs', types: './types/main.d.ts', legacy: './dist/legacy.js', exports: { '.': './dist/main.js', './lang/*': './dist/lang/*.js' } }
  const files = ['package/dist/main.js', 'package/dist/main.mjs', 'package/types/main.d.ts', 'package/dist/legacy.js', 'package/dist/lang/fr.js']
  checkFiles(manifest, files)
  for (const missing of files)
    assert.throws(() => checkFiles(manifest, files.filter(file => file !== missing)), /Missing/)
  assert.throws(() => checkFiles(manifest, [...files, 'package/tsconfig.json']), /tsconfig/)
  assert.throws(() => checkFiles(manifest, files, ['package/dist/old.js']), /Historical/)
})

test('Actual isolated runtime rejects removed default exports and required files', async () => {
  const { dir } = await publishedConsumer()
  try {
    assert.equal(runtimeConsumer(dir).checks.length, 23)
    const esm = path.join(dir, 'node_modules/artplayer-plugin-chapter/dist/artplayer-plugin-chapter.mjs')
    const original = fs.readFileSync(esm)
    fs.writeFileSync(esm, 'export const removedDefault = true\n')
    assert.throws(() => runtimeConsumer(dir), /Command failed/)
    fs.writeFileSync(esm, original)
    const entry = path.join(dir, 'node_modules/artplayer-plugin-chapter/dist/artplayer-plugin-chapter.js')
    fs.unlinkSync(entry)
    assert.throws(() => runtimeConsumer(dir), /Command failed/)
  }
  finally {
    removeConsumer(dir)
  }
})

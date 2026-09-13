import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- This fixture exercises the repository's Node test runner.
import { test } from 'node:test'
import { checkFiles, publishedConsumer } from '../scripts/package-check.mjs'
import { removeConsumer, runtimeConsumer } from '../scripts/package-consumer.mjs'
import { emitterContracts } from './contracts/emitter.js'

test('Package checks reject missing files, missing wildcard exports and internal configuration', () => {
  const manifest = { name: 'fixture', main: './dist/main.js', module: './dist/main.mjs', types: './types/main.d.ts', legacy: './dist/legacy.js', exports: { '.': './dist/main.js', './lang/*': './dist/lang/*.js' } }
  const files = ['package/dist/main.js', 'package/dist/main.mjs', 'package/types/main.d.ts', 'package/dist/legacy.js', 'package/dist/lang/fr.js']
  checkFiles(manifest, files)
  for (const missing of files)
    assert.throws(() => checkFiles(manifest, files.filter(file => file !== missing)), /Missing/)
  assert.throws(() => checkFiles(manifest, [...files, 'package/tsconfig.json']), /tsconfig/)
  for (const source of ['src/internal.ts', 'public/artplayer.ts', 'node_modules/private/index.js'])
    assert.throws(() => checkFiles(manifest, [...files, `package/${source}`]), /Source\/dependencies/)
  for (const source of ['dist/internal.ts', 'dist/internal.cts', 'dist/internal.mts'])
    assert.throws(() => checkFiles(manifest, [...files, `package/${source}`]), /Authored TypeScript/)
  checkFiles(manifest, [...files, 'package/types/entry.d.cts', 'package/types/entry.d.mts'])
  assert.throws(() => checkFiles(manifest, files, ['package/dist/old.js']), /Historical/)
})

test('Actual isolated runtime rejects removed default exports and required files', async () => {
  const { dir } = await publishedConsumer()
  try {
    assert.equal(runtimeConsumer(dir, { baseline: true }).checks.length, 22 + Object.keys(emitterContracts).length)
    assert.throws(() => runtimeConsumer(dir), /Command failed/)
    const esm = path.join(dir, 'node_modules/artplayer-plugin-chapter/dist/artplayer-plugin-chapter.mjs')
    const original = fs.readFileSync(esm)
    fs.writeFileSync(esm, 'export const removedDefault = true\n')
    assert.throws(() => runtimeConsumer(dir, { baseline: true }), /Command failed/)
    fs.writeFileSync(esm, original)
    const entry = path.join(dir, 'node_modules/artplayer-plugin-chapter/dist/artplayer-plugin-chapter.js')
    fs.unlinkSync(entry)
    assert.throws(() => runtimeConsumer(dir, { baseline: true }), /Command failed/)
  }
  finally {
    removeConsumer(dir)
  }
})

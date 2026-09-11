import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
// eslint-disable-next-line test/no-import-node-test -- Package consumers run in the baseline runner.
import test from 'node:test'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'

test('Audio Track preserves root/legacy, historical extracted inputs and partial update across compilers', () => {
  const source = fs.readFileSync('test/types/audio-track.ts', 'utf8')
  for (const [compiler, mode] of [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    assert.equal(checkConsumer(compiler, mode, source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')).length, 12, `${compiler.version} ${mode} must reject invalid inputs`)
  }
  const cjs = `import audio = require('artplayer-plugin-audio-track');
import legacy = require('artplayer-plugin-audio-track/legacy');
import runtime = require('artplayer-plugin-audio-track/runtime');
import Artplayer = require('artplayer');
const option: audio.Option = { url: 'audio.aac' };
const update: audio.UpdateOption = { offset: 1 };
const art = new Artplayer({ container: '#player', url: 'video.mp4' });
const result: audio.Result = audio(option)(art);
result.update(option); legacy(option)(art).update(option);
const precise: runtime.RuntimeResult = runtime(option)(art); precise.update(update);`
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', cjs), [])
  const readme = fs.readFileSync('packages/artplayer-plugin-audio-track/README.md', 'utf8').match(/```ts\n([\s\S]*?)```/)?.[1]
  assert(readme, 'Keep the documented runtime type example runnable')
  assert.deepEqual(checkConsumer(ts, 'bundler-esm', readme), [])
  assert.deepEqual(checkConsumer(compat, 'node10-commonjs', readme), [])
})

test('Audio Track editor declaration is reproducible and validates partial/legacy calls without leaked types', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-audio-track/types/artplayer-plugin-audio-track.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginAudioTrack')
  const file = 'docs/assets/ts/artplayer-plugin-audio-track.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated, 'Run yarn build:ts')
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `
const option: artplayerPluginAudioTrack.Option = { url: 'audio.aac' };
const part: artplayerPluginAudioTrack.UpdateOption = { offset: 1 };
const factory = artplayerPluginAudioTrack as artplayerPluginAudioTrack.RuntimeFactory;
const result = factory(option)(new Artplayer({ container: '#player', url: 'video.mp4' }));
result.update(part);
const historical: Parameters<artplayerPluginAudioTrack.Result['update']>[0] = { url: 'old.aac' };
const oldURL: string = historical.url;
// @ts-expect-error Update fields stay typed.
result.update({ offset: 'bad' });
// @ts-expect-error Factory options are required.
artplayerPluginAudioTrack();
// @ts-expect-error Private definitions do not become globals.
const hidden: artplayerPluginAudioTrackDefinitions.Option = { url: 'audio.aac' };
void [oldURL, hidden];`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [], compiler.version)
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 3)
    assert(checkPluginEditorDeclaration(`${generated}\nexport interface Broken { value: MissingType }`, core, '', compiler).some(item => item.code === 2309))
  }
})

test('Audio Track runtime type entry reuses the exact root runtime for CJS and ESM', async () => {
  const manifest = JSON.parse(fs.readFileSync('packages/artplayer-plugin-audio-track/package.json'))
  assert.equal(manifest.exports['./runtime'].require.default, manifest.exports['.'].require.default)
  assert.equal(manifest.exports['./runtime'].import.default, manifest.exports['.'].import.default)
  const require = createRequire(import.meta.url)
  assert.equal(require('artplayer-plugin-audio-track/runtime'), require('artplayer-plugin-audio-track'))
  const [root, runtime] = await Promise.all([import('artplayer-plugin-audio-track'), import('artplayer-plugin-audio-track/runtime')])
  assert.equal(runtime.default, root.default)
  assert.equal(typeof root.default, 'function')
  const legacy = require('artplayer-plugin-audio-track/legacy')
  assert.equal(typeof legacy, 'function')
})

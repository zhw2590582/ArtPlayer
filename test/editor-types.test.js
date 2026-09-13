import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Exercise the real standalone editor compiler and generator.
import { test } from 'node:test'
import { ESLint } from 'eslint'
import compat from 'typescript-compat'
import { asGlobalDeclaration, checkCoreEditorDeclaration, generateCoreEditorDeclaration } from '../scripts/editor-types.mjs'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../scripts/plugin-editor-types.mjs'

test('editor declarations are reproducible, standalone and preserve constructor/named types in both compilers', async () => {
  const generated = generateCoreEditorDeclaration()
  const file = 'docs/assets/ts/artplayer.d.ts'
  const eslint = new ESLint({ fix: true, fixTypes: ['layout'] })
  const [formatted] = await eslint.lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated, 'Editor declarations are stale; run yarn build:ts')
  assert.deepEqual(checkCoreEditorDeclaration(formatted.output || generated, compat), [])
  const corrupted = generated.replace('export type OptionInput = ArtplayerDefinitions.OptionInput;', 'export type OptionInput = MissingEditorType;')
  assert.notEqual(corrupted, generated, 'Missing corruption target')
  assert(checkCoreEditorDeclaration(corrupted).some(diagnostic => diagnostic.code === 2304), 'Invalid output must not be hidden by skipLibCheck')
  assert.throws(() => asGlobalDeclaration('export { default } from "./missing"', 'Artplayer'), /unresolved exports/)
})

test('ASR editor generation supports named types without mixing default and export assignment', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-asr/types/artplayer-plugin-asr.d.ts', 'utf8')
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const old = `${source.replace(/^import.*$/gim, '')}\nexport = artplayerPluginAsr;\nexport as namespace artplayerPluginAsr;\n`
  assert(checkPluginEditorDeclaration(old, core).some(item => item.code === 2309), 'The old textual generator must reproduce its conflicting export assignment')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginAsr')
  const file = 'docs/assets/ts/artplayer-plugin-asr.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const consumer = `declare const art: Artplayer;
const factory: typeof artplayerPluginAsr = () => () => ({ name: 'artplayerPluginAsr', stop() {}, hide() {}, append(_text: string) {} });
const oldResult: void = factory()(art).stop();
const option: artplayerPluginAsr.RuntimeOption = { audioInput: { type: 'capture' }, onAudioChunk: async () => 'subtitle' };
declare const runtime: artplayerPluginAsr.RuntimeFactory;
const stopped: Promise<void> = runtime(option)(art).stop();
// @ts-expect-error Root stop retains historical void type.
const rootPromise: Promise<void> = artplayerPluginAsr()(art).stop();
// @ts-expect-error Capture input is runtime-only.
artplayerPluginAsr({ audioInput: { type: 'capture' } });
// @ts-expect-error Unknown capture mode.
const invalid: artplayerPluginAsr.RuntimeOption = { audioInput: { type: 'direct' } };
void [oldResult, stopped, rootPromise, invalid];`
  for (const compiler of [undefined, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 3)
  }
})

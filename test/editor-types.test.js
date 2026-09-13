import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Exercise the real standalone editor compiler and generator.
import { test } from 'node:test'
import { ESLint } from 'eslint'
import compat from 'typescript-compat'
import { vastSdkDeclarations } from '../scripts/editor-declarations/dependencies.ts'
import { editorLibUris, generateEditorDeclarations } from '../scripts/editor-declarations/generate.ts'
import { checkStandaloneDeclarations } from '../scripts/editor-declarations/validation.ts'
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

test('Chapter and VAST editor consumers preserve SDK types, optional Window hook and named results', () => {
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const generated = new Map([['artplayer.d.ts', core]])
  for (const [suffix, global] of [['chapter', 'artplayerPluginChapter'], ['vast', 'artplayerPluginVast']]) {
    const source = fs.readFileSync(`packages/artplayer-plugin-${suffix}/types/artplayer-plugin-${suffix}.d.ts`, 'utf8')
    const old = `${source.replace(/^import.*$/gim, '')}\nexport = ${global};\nexport as namespace ${global};\n`
    const diagnostics = checkPluginEditorDeclaration(old, core)
    assert(diagnostics.some(item => item.code === 2309))
    if (suffix === 'vast')
      assert(diagnostics.some(item => item.code === 2304 && item.message.includes('Player')))
    generated.set(`${suffix}.d.ts`, generatePluginEditorDeclaration(source, global, {}, suffix === 'vast' ? vastSdkDeclarations() : []))
  }
  const consumer = `
import chapter = require('./chapter');
import vast = require('./vast');
declare const art: Artplayer;
const chapters: chapter.Chapters = [{ start: 0, end: 10, title: 'Intro' }];
const result: chapter.Result = chapter({ chapters })(art);
result.update({ chapters: [] });
const option: vast.ArtplayerPluginVastOption = async context => {
  const player = context.init();
  const volume: number = player.volume;
  player.volume = 0.5;
  player.pause();
  player.play();
  context.playUrl('ad.xml', { oldUntypedConfig: true });
  // @ts-expect-error SDK numeric property remains checked.
  player.volume = 'loud';
  // @ts-expect-error SDK methods must not degrade to any.
  player.missingMethod();
  // @ts-expect-error Private SDK implementation stays private.
  player._setupIma();
  void volume;
};
const instance: vast.ArtplayerPluginVastInstance = vast(option)(art);
const windowFactory: typeof vast | undefined = window.artplayerPluginVast;
// @ts-expect-error Historical required callback is still required.
vast();
// @ts-expect-error Chapter timestamps stay numeric.
chapter({ chapters: [{ start: '0', end: 1, title: '' }] });
// @ts-expect-error SDK internals are private to the declaration module.
declare const leaked: artplayerPluginVastDefinitions.Player;
void [result, instance, windowFactory, leaked];
`
  generated.set('global.ts', 'declare const globalArt: Artplayer; const globalResult: artplayerPluginChapter.Result = artplayerPluginChapter()(globalArt);')
  for (const compiler of [undefined, compat]) {
    generated.set('consumer.ts', consumer)
    assert.deepEqual(checkStandaloneDeclarations(generated, compiler), [])
    generated.set('consumer.ts', consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''))
    const errors = checkStandaloneDeclarations(generated, compiler)
    assert.equal(errors.length, 6, 'Every intentional misuse must remain rejected')
  }
})

test('all editor outputs are generated and checked together without modifying source declarations', async () => {
  const outputs = await generateEditorDeclarations()
  assert.equal([...outputs.keys()].filter(file => file.endsWith('.d.ts')).length, 22)
  for (const [file, code] of outputs)
    assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), code.replaceAll('\r\n', '\n'), `Stale editor output: ${file}`)
  await assert.rejects(generateEditorDeclarations(['missing-plugin']), /Unknown declaration package/)
  await assert.rejects(generateEditorDeclarations(['artplayer-plugin-chapter', 'artplayer-plugin-chapter']), /Duplicate/)
  const source = 'const note = \'libUris\'; let libUris = [\'old\']; const untouched = 1'
  assert.equal(editorLibUris(source, ['chapter.d.ts']), 'const note = \'libUris\'; let libUris = [\n      \'./assets/ts/chapter.d.ts\',\n    ]; const untouched = 1')
  assert.throws(() => editorLibUris('const unrelated = []', []), /exactly one/)
  assert.throws(() => editorLibUris('let libUris = []; function x() { let libUris = [] }', []), /exactly one/)
  assert.throws(() => editorLibUris('let libUris = fetch()', []), /array initializer/)
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

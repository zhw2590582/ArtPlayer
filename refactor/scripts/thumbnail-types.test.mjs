import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Public type and editor contract runner.
import test from 'node:test'
import ts from 'typescript'
import compat from 'typescript-compat'
import { ESLint } from 'eslint'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]
const invalid = source => source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')

test('Thumbnail public declarations check actual callbacks, custom events and invalid calls in current and old TS', () => {
  const source = fs.readFileSync('test/types/thumbnail.ts', 'utf8')
  for (const [compiler, mode] of modes) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    assert.equal(checkConsumer(compiler, mode, invalid(source)).length, 10, `${compiler.version} ${mode} negatives`)
  }
  const commonjs = fs.readFileSync('test/types/thumbnail-commonjs.cts', 'utf8')
  for (const [compiler, mode] of [[ts, 'nodenext-cjs'], [compat, 'node10-commonjs']]) {
    assert.deepEqual(checkConsumer(compiler, mode, commonjs), [])
    assert.equal(checkConsumer(compiler, mode, invalid(commonjs)).length, 1)
  }
  assert.deepEqual(checkConsumer(ts, 'node10-commonjs', fs.readFileSync('test/types/thumbnail-source.ts', 'utf8')), [], 'Source and declaration constructors must be mutually assignable')
})

test('Thumbnail editor declaration is generated with its exact uppercase global and works in old TS', async () => {
  const source = fs.readFileSync('packages/artplayer-tool-thumbnail/types/artplayer-tool-thumbnail.d.ts', 'utf8')
  const code = generatePluginEditorDeclaration(source, 'ArtplayerToolThumbnail')
  const file = 'docs/assets/ts/artplayer-tool-thumbnail.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(code, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || code)
  const consumer = `const input = document.createElement('input');
const options: ArtplayerToolThumbnail.Option = { fileInput: input };
const tool: ArtplayerToolThumbnail = new ArtplayerToolThumbnail(options);
tool.on('update', (url, progress) => url + progress.toFixed());
tool.on('custom', (value: number) => value.toFixed());
const promise: Promise<void> = tool.start();
// @ts-expect-error No lowercase global exists.
const bad = new artplayerToolThumbnail(options);
// @ts-expect-error Invalid known event payload.
tool.emit('update', 12, 'url');`
  for (const compiler of [ts, compat]) {
    const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
    assert.deepEqual(checkPluginEditorDeclaration(code, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(code, core, invalid(consumer), compiler).length, 2)
  }
  assert.throws(() => generatePluginEditorDeclaration(source.replace('declare class ArtplayerToolThumbnail', 'declare class WrongClass'), 'ArtplayerToolThumbnail'), /Unexpected CommonJS editor class/)
})

test('Full editor generation bundles explicit local MediaBunny types instead of publishing an invalid media global', () => {
  const source = fs.readFileSync('packages/artplayer-proxy-mediabunny/types/artplayer-proxy-mediabunny.d.ts', 'utf8')
  const media = fs.readFileSync('packages/artplayer-proxy-mediabunny/types/media.d.ts', 'utf8')
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const frozenGenerator = `${source.replace(/^import.*$/gm, '')}\nexport = artplayerProxyMediabunny;\nexport as namespace artplayerProxyMediabunny;`
  const code = generatePluginEditorDeclaration(source, 'artplayerProxyMediabunny', { './media': media })
  const consumer = `declare const player: artplayerProxyMediabunny.MediaBunnyPlayer;
const canvas: (art: Artplayer) => HTMLCanvasElement = artplayerProxyMediabunny();
const time: number | undefined = player.mediabunny?.currentTime;
// @ts-expect-error HLS levels are read from state, not directly from the player alias.
const bad = player.mediabunny?.levels;`
  for (const compiler of [ts, compat]) {
    assert(checkPluginEditorDeclaration(frozenGenerator, core, '', compiler).some(item => item.code === 2307), 'The old generator leaves a missing relative type import')
    assert.deepEqual(checkPluginEditorDeclaration(code, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(code, core, invalid(consumer), compiler).length, 1)
  }
  assert.throws(() => generatePluginEditorDeclaration(source, 'artplayerProxyMediabunny'), /Unsupported editor type re-export/)
  assert.throws(() => generatePluginEditorDeclaration(source, 'artplayerProxyMediabunny', { './media': media + '\nexport interface Extra {}' }), /explicitly cover/)
  const common = fs.readFileSync('docs/assets/js/common.js', 'utf8')
  assert(common.includes('./assets/ts/artplayer-tool-thumbnail.d.ts'))
  assert(!common.includes('./assets/ts/media.d.ts'))
})

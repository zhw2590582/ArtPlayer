import assert from 'node:assert/strict'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Public compatibility uses the repository Node runner.
import test from 'node:test'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { maskInvalidStatements } from './danmuku-mask-consumer.mjs'
import { verifyDanmukuMaskContract } from './danmuku-mask-contract.mjs'
import { readMember } from './releases.mjs'

test('Mask public declaration keeps both actual published factory and result shapes', async () => {
  const contract = await verifyDanmukuMaskContract()
  const current = fs.readFileSync('packages/artplayer-plugin-danmuku-mask/types/artplayer-plugin-danmuku-mask.d.ts', 'utf8').replaceAll('\r\n', '\n')
  for (const archive of contract.archives.values())
    assert.equal(current, readMember(archive, 'package/types/artplayer-plugin-danmuku-mask.d.ts').toString().replaceAll('\r\n', '\n'))
})

test('Mask strict public consumers preserve optional arguments, function replacement and reject invalid results/options', () => {
  const source = fs.readFileSync('test/types/danmuku-mask-public.ts', 'utf8')
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', source), [])
    assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', source.replace('from \'artplayer-plugin-danmuku-mask\'', 'from \'artplayer-plugin-danmuku-mask/types/artplayer-plugin-danmuku-mask\'')), [], 'Legacy mapping must preserve historical direct declaration paths')
    const invalid = checkConsumer(compiler, 'node10-commonjs', `${source}\n${maskInvalidStatements.join('\n')}\n`)
    assert.equal(invalid.length, maskInvalidStatements.length)
    assert.deepEqual(invalid.map(item => item.line), maskInvalidStatements.map((_, index) => source.split('\n').length + 1 + index))
  }
})

test('Mask editor declaration is generated from the unchanged public contract and accepts optional registration', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-danmuku-mask/types/artplayer-plugin-danmuku-mask.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginDanmukuMask')
  const file = 'docs/assets/ts/artplayer-plugin-danmuku-mask.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `const option: NonNullable<Parameters<typeof artplayerPluginDanmukuMask>[0]> = {opacity: 0};
const art = new Artplayer({container: '#player', url: '/video.mp4'});
const result = artplayerPluginDanmukuMask(option)(art);
const started: Promise<void> = result.start();
const stopped: void = result.stop();
artplayerPluginDanmukuMask();
const replacement: typeof artplayerPluginDanmukuMask = () => () => ({name: 'artplayerPluginDanmukuMask', async start() {}, stop() {}});
// @ts-expect-error Synchronous registration has no then method.
artplayerPluginDanmukuMask().then(() => {});
// @ts-expect-error The runtime factory has no default property.
artplayerPluginDanmukuMask.default();
// @ts-expect-error Opacity remains numeric.
artplayerPluginDanmukuMask({opacity: '1'});`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 3)
  }
})

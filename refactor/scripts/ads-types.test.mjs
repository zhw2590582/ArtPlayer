import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Check published and workspace declaration consumers independently.
import test from 'node:test'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]

test('Ads root, legacy and accurate runtime types support five compiler modes and reject invalid consumers', () => {
  const source = fs.readFileSync('test/types/ads.ts', 'utf8')
  for (const [compiler, mode] of modes) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    assert.equal(checkConsumer(compiler, mode, source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')).length, 10)
  }
  const commonjs = `import ads = require('artplayer-plugin-ads'); import legacy = require('artplayer-plugin-ads/legacy'); import runtime = require('artplayer-plugin-ads/runtime');
const option: ads.Option = { html: 'ad', totalDuration: 5 }; ads(option); ads.default(option); legacy(option); legacy.default(option); runtime(option); runtime.default(option);`
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', commonjs), [])
})

test('Ads historical calls compile against frozen declarations; approved scalar extraction differences remain explicit', async () => {
  const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/ads-release.json')))
  const member = 'package/types/artplayer-plugin-ads.d.ts'
  const published = readMember(await ensureArchive(baseline.release), member)
  assert.equal(hash(published), baseline.release.files[member])
  const oldPath = 'packages/artplayer-plugin-ads/types/artplayer-plugin-ads.d.ts'
  const workspace = execFileSync('git', ['show', `${baseline.sourceCommit}:${oldPath}`]).toString().replaceAll('\r\n', '\n')
  assert.equal(hash(workspace), baseline.source[oldPath])
  const directory = fs.mkdtempSync(path.join(refactorDir, '.cache/ads-legacy-types-'))
  try {
    for (const [family, declaration, extraction] of [
      ['published', published, `declare const input: Parameters<typeof ads>[0]; const duration: string | undefined = input.totalDuration; void duration;`],
      ['workspace', workspace, `declare const input: Parameters<typeof ads>[0]; const source: string = input.source; const duration: number | undefined = input.totalDuration; void [source, duration];`],
    ]) {
      const source = fs.readFileSync(path.join(refactorDir, `fixtures/consumers/ads-${family}.ts`), 'utf8')
      fs.writeFileSync(path.join(directory, 'legacy.d.ts'), declaration)
      const filename = path.join(directory, 'consumer.ts')
      for (const compiler of [ts, compat]) {
        fs.writeFileSync(filename, `${source}\n${extraction}`.replace('from \'artplayer-plugin-ads\'', 'from \'./legacy\''))
        const program = compiler.createProgram([filename], { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] })
        assert.deepEqual(compiler.getPreEmitDiagnostics(program).map(item => ({ code: item.code, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n') })), [], `${family} / ${compiler.version}`)
        assert(program.getSourceFiles().some(file => path.resolve(file.fileName) === path.join(directory, 'legacy.d.ts')))
        assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', source), [])
        const differences = checkConsumer(compiler, 'node10-commonjs', `${source}\n${extraction}`)
        assert.deepEqual(differences.map(item => item.code), family === 'published' ? [2322] : [2322, 2322], 'ADS-TYPE-01 accepted with scope: preserve the exact approved scalar inference differences')
      }
      for (const [compiler, mode] of modes)
        assert.deepEqual(checkConsumer(compiler, mode, source), [], `${family} / ${compiler.version} / ${mode}`)
    }
  }
  finally {
    const resolved = fs.realpathSync(directory)
    assert.equal(path.dirname(resolved), fs.realpathSync(path.join(refactorDir, '.cache')))
    assert(path.basename(resolved).startsWith('ads-legacy-types-'))
    fs.rmSync(resolved, { recursive: true, force: true })
  }
})

test('Ads editor generation retains public namespaces and rejects unknown declaration shapes', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-ads/types/artplayer-plugin-ads.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginAds')
  const file = 'docs/assets/ts/artplayer-plugin-ads.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `const option: artplayerPluginAds.Option = { html: 'ad', totalDuration: 5 };
const factory: (art: Artplayer) => artplayerPluginAds.Result = artplayerPluginAds(option);
artplayerPluginAds.default(option);
// @ts-expect-error A DOM element is not HTML text.
artplayerPluginAds({ html: document.body });
// @ts-expect-error Complete translations are required.
artplayerPluginAds({ i18n: { close: 'Close' } });
void factory;`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 2)
  }
  assert.throws(() => generatePluginEditorDeclaration(`import type Unknown from 'unknown';\n${source}`, 'artplayerPluginAds'), /Unsupported CommonJS plugin editor import/)
  assert.throws(() => generatePluginEditorDeclaration(source.replace('export as namespace artplayerPluginAds', ''), 'artplayerPluginAds'), /Incomplete CommonJS/)
  assert.throws(() => generatePluginEditorDeclaration(source.replace('interface Translations {', 'const unexpected: string; interface Translations {'), 'artplayerPluginAds'), /only public type declarations/)
})

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Compiler and historical declaration contract runner.
import test from 'node:test'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { iframeCandidate, iframeEnvironment, iframeHistorical } from '../../test/helpers/iframe.js'
import { verifyIframeContract } from './iframe-contract.mjs'
import { readMember } from './releases.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]
const invalid = code => code.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')

test('Iframe error envelopes preserve non-string thrown messages rather than claiming string-only payloads', async () => {
  const implementations = [...(await iframeHistorical()).filter(item => !item.name.includes('helper')), await iframeCandidate()]
  for (const implementation of implementations) {
    for (const [body, expected] of [['throw { message: 7 }', 7], ['throw 3', undefined]]) {
      const env = iframeEnvironment(implementation, true)
      await assert.rejects(env.Factory.onMessage({ data: { type: 'commit', data: body, id: 1 }, source: env.box.parent }), () => true)
      assert.equal(env.sent.length, 1)
      assert.equal(env.sent[0].packet.type, 'error')
      assert.equal(env.sent[0].packet.data, expected)
      assert.equal(env.sent[0].packet.id, 1)
    }
  }
})

test('Iframe public types preserve legacy extraction while precise views reject invalid protocol calls', () => {
  const source = fs.readFileSync('test/types/iframe.ts', 'utf8')
  for (const [compiler, mode] of modes) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    assert.equal(checkConsumer(compiler, mode, invalid(source)).length, 16)
    assert.deepEqual(checkConsumer(compiler, mode, fs.readFileSync('refactor/fixtures/consumers/iframe-workspace.ts', 'utf8')), [])
  }
  const commonjs = fs.readFileSync('test/types/iframe-commonjs.cts', 'utf8')
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', commonjs), [])
  assert.equal(checkConsumer(ts, 'nodenext-cjs', invalid(commonjs)).length, 1)
  const implementationSource = fs.readFileSync('test/types/iframe-source.ts', 'utf8')
  assert.deepEqual(checkConsumer(ts, 'node10-commonjs', implementationSource), [])
  const implementation = checkConsumer(ts, 'node10-commonjs', invalid(implementationSource))
  assert.deepEqual(implementation.map(item => item.code), [2419], 'Only the preserved non-null legacy callback differs from the actual constructor')
  assert(implementation[0].message.includes('messageCallback') && implementation[0].message.includes('null'))
})

test('Iframe frozen workspace keeps exact default signatures and published Function callbacks remain a separate legacy boundary', async () => {
  const contract = await verifyIframeContract()
  const source = fs.readFileSync('refactor/fixtures/consumers/iframe-workspace.ts', 'utf8')
  const filename = path.resolve('test/types/iframe-history.ts')
  const declaration = path.resolve('test/types/iframe-history.d.ts')
  for (const compiler of [ts, compat]) {
    function historical(code, definitions) {
      const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] }
      const host = compiler.createCompilerHost(options)
      const original = host.getSourceFile.bind(host)
      host.getSourceFile = (file, language, ...rest) => path.resolve(file) === filename
        ? compiler.createSourceFile(file, code.replaceAll('artplayer-tool-iframe', './iframe-history'), language, true)
        : path.resolve(file) === declaration ? compiler.createSourceFile(file, definitions, language, true) : original(file, language, ...rest)
      const exists = host.fileExists.bind(host)
      host.fileExists = file => path.resolve(file) === declaration || exists(file)
      const program = compiler.createProgram([filename, declaration], options, host)
      assert(program.getSourceFile(declaration))
      return compiler.getPreEmitDiagnostics(program).map(item => item.code)
    }
    const frozen = contract.sources.get('packages/artplayer-tool-iframe/types/artplayer-tool-iframe.d.ts')
    const published = readMember(contract.archive, 'package/types/artplayer-plugin-iframe.d.ts').toString()
    assert.deepEqual(historical(source, frozen), [])
    assert.deepEqual(historical(source, published), [2344], 'Published Function versus workspace callable field is a pre-refactor difference')
    const broad = `import Iframe from 'artplayer-tool-iframe'; declare const tool: Iframe; declare const callback: Function; tool.promises[1] = { resove: callback, reject: callback };`
    assert.deepEqual(historical(broad, published), [])
    assert.deepEqual(historical(broad, frozen), [2322, 2322])
    assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', broad).map(item => item.code), [2322, 2322])
    assert.deepEqual(historical(`${source}\nIframe.postMessage({ type: 'custom' });`, frozen), [2345])
    assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', `${source}\nIframe.postMessage({ type: 'custom' });`).map(item => item.code), [2345])
  }
})

test('Iframe standalone editor generation fixes the frozen export errors and preserves class plus named types', async () => {
  const contract = await verifyIframeContract()
  const historical = contract.sources.get('docs/assets/ts/artplayer-tool-iframe.d.ts')
  const source = fs.readFileSync('packages/artplayer-tool-iframe/types/artplayer-tool-iframe.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'ArtplayerToolIframe')
  const file = 'docs/assets/ts/artplayer-tool-iframe.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const consumer = `declare const frame: HTMLIFrameElement;
const option: ArtplayerToolIframe.Option = { iframe: frame, url: '/frame' };
const tool: ArtplayerToolIframe = new ArtplayerToolIframe(option);
const runtime = ArtplayerToolIframe as ArtplayerToolIframe.RuntimeConstructor;
runtime.postMessage({ type: 'custom' });
const promise: Promise<void> = runtime.onMessage(new MessageEvent('message', { data: { type: 'custom' } }));
// @ts-expect-error No lowercase runtime global exists.
new artplayerToolIframe(option);
// @ts-expect-error URL remains text.
new ArtplayerToolIframe({ iframe: frame, url: 1 });`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(historical, '', '', compiler).map(item => item.code).sort(), [2303, 2309, 2686])
    assert.deepEqual(checkPluginEditorDeclaration(generated, '', consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(generated, '', invalid(consumer), compiler).length, 2)
  }
})

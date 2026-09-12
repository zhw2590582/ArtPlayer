import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Node baseline runner.
import test from 'node:test'
import vm from 'node:vm'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { verifyAmbilightContract } from './ambilight-contract.mjs'
import { readMember } from './releases.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]

test('Ambilight current types retain inference, optional runtime arguments and ten invalid-use rejections', () => {
  const source = fs.readFileSync('test/types/ambilight.ts', 'utf8')
  for (const [compiler, mode] of modes) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    assert.equal(checkConsumer(compiler, mode, source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')).length, 10)
  }
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', `import ambilight = require('artplayer-plugin-ambilight'); import legacy = require('artplayer-plugin-ambilight/legacy');
const option: ambilight.Option = {}; ambilight(option); ambilight.default(option); legacy(); legacy.default(option);`), [])
})

test('Ambilight published calls compile against both exact historical declarations and candidate without new inference widening', async () => {
  const contract = await verifyAmbilightContract()
  const source = fs.readFileSync('refactor/fixtures/consumers/ambilight-published.ts', 'utf8')
  for (const version of ['1.0.0', '1.1.0']) {
    const old = readMember(contract.archives.get(version), 'package/types/artplayer-plugin-ambilight.d.ts').toString()
    const required = `declare const input: Parameters<typeof ambilight>[0]; const blur: string = input.blur; const opacity: number = input.opacity; void [blur, opacity];`
    for (const compiler of [ts, compat]) {
      const filename = path.resolve('test/types/ambilight-history.ts')
      const declaration = path.resolve('test/types/ambilight-history.d.ts')
      function historical(code) {
        const host = compiler.createCompilerHost({})
        const original = host.getSourceFile.bind(host)
        host.getSourceFile = (file, language, ...rest) => path.resolve(file) === filename
          ? compiler.createSourceFile(file, code.replace('from \'artplayer-plugin-ambilight\'', 'from \'./ambilight-history\''), language, true)
          : path.resolve(file) === declaration ? compiler.createSourceFile(file, old, language, true) : original(file, language, ...rest)
        const exists = host.fileExists.bind(host)
        host.fileExists = file => path.resolve(file) === declaration || exists(file)
        const program = compiler.createProgram([filename, declaration], { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] }, host)
        assert(program.getSourceFile(declaration))
        return compiler.getPreEmitDiagnostics(program).map(item => item.code)
      }
      assert.deepEqual(historical(source), [])
      assert.deepEqual(historical(`${source}\n${required}`), version === '1.0.0' ? [] : [2322, 2322])
      assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', source), [])
      assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', `${source}\n${required}`).map(item => item.code), [2322, 2322], 'Optional fields were introduced in published 1.1.0; no new difference from that baseline')
    }
  }
})

test('Ambilight editor globals are generated from the public namespace and retain negative checks', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-ambilight/types/artplayer-plugin-ambilight.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginAmbilight')
  const file = 'docs/assets/ts/artplayer-plugin-ambilight.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated)
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `const option: artplayerPluginAmbilight.Option = {}; artplayerPluginAmbilight(); artplayerPluginAmbilight.default(option);
// @ts-expect-error Invalid blur.
artplayerPluginAmbilight({ blur: 2 });`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 1)
  }
})

test('Ambilight production main, legacy, global and native ESM preserve callable and default identities', async () => {
  for (const suffix of ['js', 'legacy.js']) {
    const source = fs.readFileSync(`packages/artplayer-plugin-ambilight/dist/artplayer-plugin-ambilight.${suffix}`, 'utf8')
    const module = { exports: {} }
    vm.runInNewContext(source, { module, exports: module.exports, window: {} })
    assert.equal(typeof module.exports, 'function')
    assert.equal(module.exports.default, module.exports)
    assert.equal(typeof module.exports.default(), 'function')
    const global = { window: {} }
    vm.runInNewContext(source, global)
    const factory = global.artplayerPluginAmbilight || global.window.artplayerPluginAmbilight
    assert.equal(factory.default, factory)
  }
  const source = fs.readFileSync('packages/artplayer-plugin-ambilight/dist/artplayer-plugin-ambilight.mjs', 'utf8')
  const module = await import(`data:text/javascript,${encodeURIComponent(source)}`)
  assert.deepEqual(Object.keys(module), ['default'])
  assert.equal(module.default.default, module.default)
})

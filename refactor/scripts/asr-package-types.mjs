import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { verifyAsrContract } from './asr-contract.mjs'
import { hash, readMember } from './releases.mjs'

const publicFixture = fs.readFileSync(path.join(workspace, 'test/types/asr-public.ts'), 'utf8')
const publishedFixture = fs.readFileSync(path.join(workspace, 'refactor/fixtures/consumers/asr-published.ts'), 'utf8')
const standardModes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]

function typecheck(consumer, compiler, mode, candidate) {
  const next = mode.startsWith('nodenext')
  const extension = next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'
  const filename = path.join(consumer, `consumer.${extension}`)
  const files = [filename]
  if (candidate && mode !== 'bundler-esm' && mode !== 'nodenext-esm') {
    const commonjs = path.join(consumer, `commonjs.${extension}`)
    fs.writeFileSync(commonjs, `import asr = require('artplayer-plugin-asr');
import legacy = require('artplayer-plugin-asr/legacy');
import runtime = require('artplayer-plugin-asr/runtime');
import type Artplayer from 'artplayer';
const replacement: typeof asr.default = () => (_art: Artplayer) => ({name: 'artplayerPluginAsr', stop() {}, hide() {}, append(_text: string) {}});
const legacyReplacement: typeof legacy.default = replacement;
asr.default(); legacy.default(); runtime({onAudioChunk: async () => 'Text.'}); runtime.default();
declare const art: Artplayer;
const stopped: Promise<void> = runtime()(art).stop();
void [legacyReplacement, stopped];`)
    files.push(commonjs)
  }
  const options = {
    strict: true,
    noEmit: true,
    skipLibCheck: false,
    types: [],
    esModuleInterop: !mode.endsWith('-no-interop'),
    target: compiler.ScriptTarget.ES2020,
    lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'],
    module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS,
    moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs,
  }
  function compile(code) {
    fs.writeFileSync(filename, code)
    const program = compiler.createProgram(files, options)
    for (const file of program.getSourceFiles()) {
      const actual = fs.realpathSync(file.fileName)
      assert(actual.startsWith(fs.realpathSync(consumer) + path.sep)
        || (program.isSourceFileDefaultLibrary(file) && path.dirname(actual) === fs.realpathSync(path.dirname(compiler.sys.getExecutingFilePath()))), `Types escaped installed consumer: ${actual}`)
    }
    return compiler.getPreEmitDiagnostics(program).map(item => ({
      file: item.file ? path.relative(consumer, item.file.fileName).replaceAll('\\', '/') : null,
      line: item.file && item.start !== undefined ? item.file.getLineAndCharacterOfPosition(item.start).line + 1 : null,
      code: item.code,
      message: compiler.flattenDiagnosticMessageText(item.messageText, '\n').replaceAll(consumer.replaceAll('\\', '/'), '<consumer>'),
    }))
  }
  let source = candidate
    ? mode.endsWith('-no-interop') ? publicFixture.replace('import runtime from \'artplayer-plugin-asr/runtime\'', 'import runtime = require(\'artplayer-plugin-asr/runtime\')') : publicFixture
    : publishedFixture
  if (candidate && mode === 'nodenext-esm') {
    source = source
      .replace('import legacy from \'artplayer-plugin-asr\'', 'import legacyModule from \'artplayer-plugin-asr\'\nconst legacy = legacyModule.default')
      .replace('import legacyEntry from \'artplayer-plugin-asr/legacy\'', 'import legacyEntryModule from \'artplayer-plugin-asr/legacy\'\nconst legacyEntry = legacyEntryModule.default')
      .replace('namespace.default', 'namespace.default.default')
  }
  const diagnostics = compile(source)
  const invalid = candidate ? compile(source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')) : []
  if (candidate) {
    const expectedLines = []
    let line = 1
    for (const text of source.split('\n')) {
      if (text.startsWith('// @ts-expect-error'))
        expectedLines.push(line)
      else line++
    }
    assert.deepEqual(invalid.map(item => item.line).sort((a, b) => a - b), expectedLines, 'Each invalid statement must fail at its own line')
  }
  const published = candidate ? compile(publishedFixture) : diagnostics
  const namespace = mode === 'nodenext-esm' ? compile(fs.readFileSync(path.join(workspace, 'refactor/fixtures/consumers/asr-esm-namespace.ts'), 'utf8')) : []
  return { compiler: compiler.version, mode, diagnostics, invalid, published, namespace }
}

async function main() {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:asr-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/asr-package-types-'))
  console.log(`ASR isolated package evidence: ${output}`)
  const contract = await verifyAsrContract()
  const expected = JSON.parse(fs.readFileSync(path.join(workspace, 'refactor/baselines/asr-type-diagnostics.json'), 'utf8'))
  for (const [file, digest] of Object.entries(expected.fixtures))
    assert.equal(hash(fs.readFileSync(path.join(workspace, file), 'utf8').replaceAll('\r\n', '\n')), digest, `Frozen ASR fixture changed: ${file}`)
  const packages = []
  for (const name of ['artplayer', 'artplayer-plugin-asr']) {
    const archive = path.join(output, `${name}.tgz`)
    fs.writeFileSync(path.join(output, `${name}-pack.log`), run([yarn, 'pack', '--filename', archive], path.join(workspace, 'packages', name)))
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    const files = packedFiles(archive)
    checkFiles(manifest, files, name === contract.baseline.release.name ? Object.keys(contract.baseline.release.files) : [])
    packages.push({ name, archive, sha256: hash(fs.readFileSync(archive)), files: Object.fromEntries(files.map(member => [member, hash(readMember(archive, member))])) })
  }
  const matrix = []
  const core = packages[0]
  const candidates = [
    ...[...contract.baseline.previous].reverse().concat(contract.baseline.release).map(release => ({ ...release, archive: contract.archives.get(release.version), label: `published-${release.version}` })),
    { ...packages[1], label: 'candidate' },
  ]
  for (const plugin of candidates) {
    const candidate = plugin.label === 'candidate'
    const consumer = consumerDirectory()
    try {
      writeJson(path.join(consumer, 'package.json'), { name: 'asr-isolated-consumer', private: true, dependencies: Object.fromEntries([core, plugin].map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) })
      fs.copyFileSync(path.join(workspace, 'yarn.lock'), path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${plugin.label}-install.log`), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
      const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${plugin.label}-frozen-install.log`), run([yarn, 'install', '--offline', '--frozen-lockfile', '--ignore-scripts', '--non-interactive'], consumer))
      assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock)
      fs.writeFileSync(path.join(output, `${plugin.label}-yarn.lock`), lock)
      for (const pkg of [core, plugin]) {
        const root = path.join(consumer, 'node_modules', pkg.name)
        assert.equal(fs.realpathSync(root), root, 'Installed package must not be a workspace link')
        for (const [member, expected] of Object.entries(pkg.files))
          assert.equal(hash(fs.readFileSync(path.join(root, member.slice(8)))), expected, `Installed bytes differ: ${member}`)
      }
      const runtimeFile = path.join(consumer, 'exports.cjs')
      fs.writeFileSync(runtimeFile, candidate
        ? `const assert = require('node:assert/strict');
for (const name of ['artplayer-plugin-asr', 'artplayer-plugin-asr/legacy', 'artplayer-plugin-asr/runtime']) { const factory = require(name); assert.equal(typeof factory, 'function'); assert.equal(factory.default, factory); assert.equal(Object.getOwnPropertyDescriptor(factory, 'default').enumerable, false); assert.equal(typeof factory({}), 'function'); }
assert.equal(require('artplayer-plugin-asr/runtime'), require('artplayer-plugin-asr'));
Promise.all(['artplayer-plugin-asr', 'artplayer-plugin-asr/runtime', 'artplayer-plugin-asr/legacy'].map(name => import(name))).then(([root, runtime, legacy]) => { assert.deepEqual(Object.keys(root), ['default']); assert.deepEqual(Object.keys(runtime), ['default']); assert.equal(runtime.default, root.default); assert.equal(root.default.default, root.default); assert.equal(legacy.default, require('artplayer-plugin-asr/legacy')); }).catch(error => { console.error(error); process.exitCode = 1; });`
        : `const assert = require('node:assert/strict'); const value = require('artplayer-plugin-asr'); assert.equal(typeof value, '${plugin.version === '2.1.0' ? 'function' : 'object'}'); assert.equal(typeof (value.default || value)({}), 'function'); assert.equal(typeof value.default, '${plugin.version === '2.1.0' ? 'undefined' : 'function'}'); import('artplayer-plugin-asr').then(module => { assert.equal(typeof module.default, 'function'); assert.equal(typeof module.default({}), 'function'); }).catch(error => { console.error(error); process.exitCode = 1; });`)
      fs.writeFileSync(path.join(output, `${plugin.label}-runtime.log`), run([runtimeFile], consumer))
      const modes = candidate ? [...standardModes, [ts, 'node10-commonjs-no-interop'], [compat, 'node10-commonjs-no-interop']] : standardModes
      for (const [compiler, mode] of modes) {
        const result = { plugin: plugin.label, ...typecheck(consumer, compiler, mode, candidate) }
        matrix.push(result)
        writeJson(path.join(output, `${plugin.label}-${compiler.version}-${mode}.json`), result)
        console.log(`${plugin.label} TS ${compiler.version} ${mode}: ${result.diagnostics.length} diagnostics; ${result.invalid.length} negative diagnostics`)
      }
    }
    finally {
      removeConsumer(consumer)
    }
  }
  writeJson(path.join(output, 'report.json'), { suite: 'asr-isolated-package-types', introducedBy: 'PKG-ASR-04', packages, published: candidates.slice(0, -1).map(pkg => ({ label: pkg.label, archive: pkg.archive, sha256: hash(fs.readFileSync(pkg.archive)) })), matrix })
  for (const result of matrix) {
    const baseline = result.plugin === 'candidate' ? [] : expected.cases.find(item => item.plugin === result.plugin && item.compiler === result.compiler && item.mode === result.mode)?.diagnostics
    assert.deepEqual(result.diagnostics, baseline, `${result.plugin} TS ${result.compiler} ${result.mode}`)
    assert.deepEqual(result.namespace, [], `Historical ESM namespace: ${result.plugin}`)
    if (result.plugin === 'candidate') {
      const publishedBaseline = result.mode === 'nodenext-esm' ? expected.cases.find(item => item.plugin === 'published-2.1.0' && item.compiler === result.compiler && item.mode === result.mode).diagnostics : []
      assert.deepEqual(result.published, publishedBaseline, `Historical direct consumer: ${result.compiler} ${result.mode}`)
      assert.equal(result.invalid.length, 12, 'Installed declarations must reject all 12 invalid uses')
    }
  }
  console.log(`ASR installed matrix verified: ${matrix.length} cases; ${output}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

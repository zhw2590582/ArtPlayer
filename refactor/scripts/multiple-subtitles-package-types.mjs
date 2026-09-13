import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { verifyMultipleSubtitlesContract } from './multiple-subtitles-contract.mjs'
import { hash, readMember } from './releases.mjs'

async function main() {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:multiple-subtitles-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/multiple-subtitles-package-types-'))
  console.log(`Multiple subtitles isolated package evidence: ${output}`)
  const contract = await verifyMultipleSubtitlesContract()
  const packages = []
  for (const name of ['artplayer', 'artplayer-plugin-multiple-subtitles']) {
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
    const consumer = consumerDirectory()
    try {
      writeJson(path.join(consumer, 'package.json'), { name: 'multiple-subtitles-isolated-consumer', private: true, dependencies: Object.fromEntries([core, plugin].map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) })
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
      fs.writeFileSync(runtimeFile, plugin.label === 'candidate'
        ? `const assert = require('node:assert/strict');
for (const name of ['artplayer-plugin-multiple-subtitles', 'artplayer-plugin-multiple-subtitles/legacy', 'artplayer-plugin-multiple-subtitles/runtime']) { const factory = require(name); assert.equal(typeof factory, 'function'); assert.equal(factory.default, factory); assert.equal(typeof factory({}), 'function'); }
assert.equal(require('artplayer-plugin-multiple-subtitles/runtime'), require('artplayer-plugin-multiple-subtitles'));
Promise.all(['artplayer-plugin-multiple-subtitles', 'artplayer-plugin-multiple-subtitles/runtime', 'artplayer-plugin-multiple-subtitles/legacy'].map(name => import(name))).then(([root, runtime, legacy]) => { assert.deepEqual(Object.keys(root), ['default']); assert.deepEqual(Object.keys(runtime), ['default']); assert.equal(runtime.default, root.default); assert.equal(root.default.default, root.default); assert.equal(legacy.default, require('artplayer-plugin-multiple-subtitles/legacy')); assert.equal(legacy.default.default, legacy.default); }).catch(error => { console.error(error); process.exitCode = 1; });`
        : `const assert = require('node:assert/strict'); const value = require('artplayer-plugin-multiple-subtitles'); assert.equal(typeof value, '${plugin.version === '1.2.0' ? 'function' : 'object'}'); assert.equal(typeof (value.default || value)({}), 'function'); ${plugin.version === '1.2.0' ? '' : 'assert.throws(() => value({}), { name: \'TypeError\', message: \'value is not a function\' });'} assert.equal(typeof value.default, '${plugin.version === '1.2.0' ? 'undefined' : 'function'}');`)
      fs.writeFileSync(path.join(output, `${plugin.label}-runtime.log`), run([runtimeFile], consumer))
      const candidateModes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]
      if (plugin.label === 'candidate')
        candidateModes.push([ts, 'node10-commonjs-no-interop'], [compat, 'node10-commonjs-no-interop'])
      const historicalModes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]
      for (const [compiler, mode] of (plugin.label === 'candidate' ? candidateModes : historicalModes)) {
        const next = mode.startsWith('nodenext')
        const extension = next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'
        const source = fs.readFileSync(path.join(workspace, plugin.label === 'candidate' ? 'test/types/multiple-subtitles-public.ts' : 'refactor/fixtures/consumers/multiple-subtitles-published.ts'), 'utf8')
        const filename = path.join(consumer, `consumer.${extension}`)
        const historical = path.join(consumer, `historical.${extension}`)
        fs.copyFileSync(path.join(workspace, 'refactor/fixtures/consumers/multiple-subtitles-published.ts'), historical)
        const files = plugin.label === 'candidate' ? [filename, historical] : [filename]
        if (mode === 'nodenext-cjs' && plugin.label === 'candidate') {
          const commonjs = path.join(consumer, 'commonjs.cts')
          fs.writeFileSync(commonjs, `import vtt = require('artplayer-plugin-multiple-subtitles'); import legacy = require('artplayer-plugin-multiple-subtitles/legacy'); import runtime = require('artplayer-plugin-multiple-subtitles/runtime'); vtt.default({subtitles: []}); legacy.default({subtitles: []}); runtime({}); runtime.default({});`)
          files.push(commonjs)
        }
        const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: !mode.endsWith('-no-interop'), target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS, moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs }
        function compile(code) {
          fs.writeFileSync(filename, code)
          const program = compiler.createProgram(files, options)
          for (const file of program.getSourceFiles()) {
            const actual = fs.realpathSync(file.fileName)
            assert(actual.startsWith(fs.realpathSync(consumer) + path.sep) || (program.isSourceFileDefaultLibrary(file) && path.dirname(actual) === fs.realpathSync(path.dirname(compiler.sys.getExecutingFilePath()))), `Types escaped installed consumer: ${actual}`)
          }
          return compiler.getPreEmitDiagnostics(program).map(item => ({ code: item.code, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n') }))
        }
        const diagnostics = compile(source)
        const historicalFailure = plugin.version === '1.2.0' && mode === 'nodenext-esm'
        const expected = historicalFailure ? [2322, 2344, 7019, 2349, 2344, 2322, 2344, 2349] : []
        writeJson(path.join(output, `${plugin.label}-${compiler.version}-${mode}-diagnostics.json`), { diagnostics, historicalFailure })
        assert.deepEqual(diagnostics.map(item => item.code), expected, `${plugin.label} ${compiler.version} ${mode}`)
        const invalid = plugin.label === 'candidate' ? compile(source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')) : []
        if (plugin.label === 'candidate')
          assert.equal(invalid.length, 12, 'Installed declarations must reject all invalid uses')
        const commonjs = {}
        if (mode === 'node10-commonjs' || mode === 'nodenext-cjs') {
          const fixture = fs.readFileSync(path.join(workspace, 'refactor/fixtures/consumers/multiple-subtitles-commonjs.ts'), 'utf8')
          const oldAssignment = plugin.label !== 'candidate' && plugin.version !== '1.2.0'
          for (const form of ['direct', 'default']) {
            const consumer = form === 'direct' ? fixture : fixture.replace('const vtt = plugin', 'const vtt = plugin.default')
            const diagnostics = compile(consumer)
            const expected = form === 'default'
              ? oldAssignment ? [2339] : []
              : oldAssignment ? [] : compiler === compat ? [2344, 2322, 2344, 2741, 2344, 2349] : [2322, 2344, 2344, 2322, 2344, 2349]
            writeJson(path.join(output, `${plugin.label}-${compiler.version}-${mode}-require-${form}.json`), { diagnostics, expected })
            assert.deepEqual(diagnostics.map(item => item.code), expected, `${plugin.label} ${compiler.version} ${mode} require ${form}`)
            commonjs[form] = { diagnostics, typeChecks: diagnostics.length === 0 }
          }
        }
        matrix.push({ plugin: plugin.label, compiler: compiler.version, mode, historicalFailure, diagnostics, invalid, commonjs })
      }
    }
    finally {
      removeConsumer(consumer)
    }
  }
  writeJson(path.join(output, 'report.json'), { suite: 'multiple-subtitles-isolated-package-types', introducedBy: 'PKG-MULTI-SUB-04', scope: 'Three actual published packages in five compiler modes and packed candidate in seven modes, installed outside the workspace with packed core. Offline frozen reinstalls and byte identity verified. Expected old NodeNext ESM and CommonJS module extraction failures remain explicit; these do not count as candidate compatibility success. Raw historical export-assignment type compatibility remains unresolved. Full device and distribution acceptance remains separate.', packages, published: candidates.slice(0, 3).map(pkg => ({ label: pkg.label, archive: pkg.archive, sha256: hash(fs.readFileSync(pkg.archive)), missingEntrypoints: pkg.missingEntrypoints })), matrix })
  console.log(`Multiple subtitles installed matrix verified: ${matrix.length} cases, including ${matrix.filter(item => item.historicalFailure).length} expected historical declaration failure; ${output}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

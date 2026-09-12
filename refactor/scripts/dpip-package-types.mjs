import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { verifyDpipContract } from './dpip-contract.mjs'
import { hash, readMember } from './releases.mjs'

async function main() {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:dpip-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/dpip-package-types-'))
  console.log(`Document PiP isolated package evidence: ${output}`)
  const contract = await verifyDpipContract()
  const packages = []
  for (const name of ['artplayer', 'artplayer-plugin-document-pip']) {
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
      writeJson(path.join(consumer, 'package.json'), { name: 'dpip-isolated-consumer', private: true, dependencies: Object.fromEntries([core, plugin].map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) })
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
for (const name of ['artplayer-plugin-document-pip', 'artplayer-plugin-document-pip/legacy']) { const factory = require(name); assert.equal(typeof factory, 'function'); assert.equal(factory.default, factory); assert.equal(typeof factory(), 'function'); }
import('artplayer-plugin-document-pip').then(module => { assert.deepEqual(Object.keys(module), ['default']); assert.equal(module.default.default, module.default); }).catch(error => { console.error(error); process.exitCode = 1; });`
        : plugin.version === '1.0.0'
          ? `const assert = require('node:assert/strict'); assert.throws(() => require('artplayer-plugin-document-pip'), error => error.code === 'MODULE_NOT_FOUND' && error.message.includes('artplayer-plugin-document-pip')); console.log('Expected historical 1.0.0 missing runtime preserved');`
          : `const assert = require('node:assert/strict'); const value = require('artplayer-plugin-document-pip'); assert.equal(typeof value, '${plugin.version === '1.1.0' ? 'function' : 'object'}'); assert.equal(typeof (value.default || value)({}), 'function');`)
      fs.writeFileSync(path.join(output, `${plugin.label}-runtime.log`), run([runtimeFile], consumer))
      const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]
      if (plugin.label === 'candidate')
        modes.push([ts, 'node10-commonjs-no-interop'], [compat, 'node10-commonjs-no-interop'])
      for (const [compiler, mode] of modes) {
        const next = mode.startsWith('nodenext')
        const extension = next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'
        const source = fs.readFileSync(path.join(workspace, plugin.label === 'candidate' ? 'test/types/dpip.ts' : 'refactor/fixtures/consumers/dpip-published.ts'), 'utf8')
        const filename = path.join(consumer, `consumer.${extension}`)
        const historical = path.join(consumer, `historical.${extension}`)
        fs.copyFileSync(path.join(workspace, 'refactor/fixtures/consumers/dpip-published.ts'), historical)
        const files = plugin.label === 'candidate' ? [filename, historical] : [filename]
        if (mode === 'nodenext-cjs' && plugin.label === 'candidate') {
          const commonjs = path.join(consumer, 'commonjs.cts')
          fs.writeFileSync(commonjs, `import dpip = require('artplayer-plugin-document-pip'); import legacy = require('artplayer-plugin-document-pip/legacy'); dpip.default({ width: 640 }); legacy.default({});`)
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
        const modernResolution = next || mode === 'bundler-esm'
        const expected = plugin.label === 'published-1.0.0' && modernResolution
          ? [2307]
          : plugin.label === 'published-1.0.1' && modernResolution
            ? [7016]
            : ['published-1.0.2', 'published-1.1.0'].includes(plugin.label) && mode === 'nodenext-esm'
                ? [2322, 2344, 2349, 2349, 2344, 2344, 2349]
                : []
        const historicalFailure = expected.length !== 0
        writeJson(path.join(output, `${plugin.label}-${compiler.version}-${mode}-diagnostics.json`), { diagnostics, historicalFailure })
        assert.deepEqual(diagnostics.map(item => item.code), expected, `${plugin.label} ${compiler.version} ${mode}`)
        const invalid = plugin.label === 'candidate' ? compile(source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')) : []
        if (plugin.label === 'candidate')
          assert.equal(invalid.length, 14, 'Installed declarations must reject all invalid uses')
        matrix.push({ plugin: plugin.label, compiler: compiler.version, mode, historicalFailure, diagnostics, invalid })
      }
    }
    finally {
      removeConsumer(consumer)
    }
  }
  writeJson(path.join(output, 'report.json'), { suite: 'dpip-isolated-package-types', introducedBy: 'PKG-DPIP-04', scope: 'Four actual published packages and packed candidate installed outside workspace with packed candidate core; offline and frozen reinstall, exact bytes, compiler/default/import= contracts. Candidate keeps required Parameters and assignable void Result while offering opt-in AsyncResult. Published 1.0.0 missing runtime is an explicit negative control; historical NodeNext ESM diagnostics are retained. This is not native Document PiP or complete distribution/device acceptance.', packages, published: candidates.slice(0, 4).map(pkg => ({ label: pkg.label, archive: pkg.archive, sha256: hash(fs.readFileSync(pkg.archive)), missingEntrypoints: pkg.missingEntrypoints })), matrix })
  console.log(`Document PiP installed types passed: ${matrix.length} cases; ${output}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { hash, readMember } from './releases.mjs'
import { runtimeNegatives, vastConsumer } from './vast-consumer.mjs'
import { verifyVastContract } from './vast-contract.mjs'

let output
async function main() {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:vast-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/vast-package-types-'))
  console.log(`VAST isolated package evidence: ${output}`)
  const contract = await verifyVastContract()
  const fixtures = Object.fromEntries(['runtime', 'published'].map(kind => [kind, hash(vastConsumer(kind))]))
  const packages = []
  for (const name of ['artplayer', 'artplayer-plugin-vast']) {
    const archive = path.join(output, `${name}.tgz`)
    fs.writeFileSync(path.join(output, `${name}-pack.log`), run([yarn, 'pack', '--filename', archive], path.join(workspace, 'packages', name)))
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    const files = packedFiles(archive)
    checkFiles(manifest, files, name === 'artplayer-plugin-vast' ? Object.keys(contract.baseline.release.files) : [])
    packages.push({ name, archive, sha256: hash(fs.readFileSync(archive)), files: Object.fromEntries(files.map(member => [member, hash(readMember(archive, member))])) })
  }
  const matrix = []
  const core = packages[0]
  const plugins = [{ ...contract.baseline.release, archive: contract.archives.get('artplayer-plugin-vast@1.0.0'), label: 'published' }, { ...packages[1], label: 'candidate' }]
  for (const plugin of plugins) {
    const consumer = consumerDirectory()
    try {
      writeJson(path.join(consumer, 'package.json'), { name: 'vast-isolated-consumer', private: true, dependencies: Object.fromEntries([core, plugin].map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) })
      fs.copyFileSync(path.join(workspace, 'yarn.lock'), path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${plugin.label}-install.log`), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
      const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${plugin.label}-frozen-install.log`), run([yarn, 'install', '--offline', '--frozen-lockfile', '--ignore-scripts', '--non-interactive', '--force'], consumer))
      assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock)
      fs.writeFileSync(path.join(output, `${plugin.label}-yarn.lock`), lock)
      for (const pkg of [core, plugin]) {
        const root = path.join(consumer, 'node_modules', pkg.name)
        assert.equal(fs.realpathSync(root), root, 'Installed package must not be a workspace link')
        for (const [member, expected] of Object.entries(pkg.files))
          assert.equal(hash(fs.readFileSync(path.join(root, member.slice(8)))), expected, `Installed bytes differ: ${member}`)
      }
      const runtimeFile = path.join(consumer, 'exports.cjs')
      fs.writeFileSync(runtimeFile, plugin.label === 'published'
        ? `const assert = require('node:assert/strict'); const value = require('artplayer-plugin-vast'); assert.equal(typeof value.default, 'function'); assert.equal(typeof value.default(() => {}), 'function');`
        : `const assert = require('node:assert/strict');
(async () => {
for (const name of ['artplayer-plugin-vast','artplayer-plugin-vast/runtime','artplayer-plugin-vast/legacy']) {const factory = require(name); assert.equal(factory.default, factory); assert.equal((await factory()({isDestroy:true})).name,'artplayerPluginVast');}
assert.equal(require('artplayer-plugin-vast/runtime'),require('artplayer-plugin-vast'));
const [root,runtime] = await Promise.all(['artplayer-plugin-vast','artplayer-plugin-vast/runtime'].map(name=>import(name)));
assert.equal(root.default,runtime.default); assert.equal(runtime.default.default,runtime.default); assert.equal((await runtime.default()({isDestroy:true})).name,'artplayerPluginVast');
})().catch(error=>{console.error(error);process.exitCode=1;});`)
      fs.writeFileSync(path.join(output, `${plugin.label}-runtime.log`), run([runtimeFile], consumer))
      const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs'], [ts, 'node10-commonjs-no-interop'], [compat, 'node10-commonjs-no-interop']]
      for (const [compiler, mode] of modes) {
        const next = mode.startsWith('nodenext')
        const requireImport = mode.endsWith('-no-interop')
        const filename = path.join(consumer, next ? `consumer.${mode.endsWith('-cjs') ? 'cts' : 'mts'}` : 'consumer.ts')
        const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: !requireImport, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS, moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs }
        function compile(source) {
          fs.writeFileSync(filename, source)
          const program = compiler.createProgram([filename], options)
          const declarations = []
          for (const file of program.getSourceFiles()) {
            const actual = fs.realpathSync(file.fileName)
            assert(actual.startsWith(fs.realpathSync(consumer) + path.sep) || (program.isSourceFileDefaultLibrary(file) && path.dirname(actual) === fs.realpathSync(path.dirname(compiler.sys.getExecutingFilePath()))), `Types escaped installed consumer: ${actual}`)
            if (!program.isSourceFileDefaultLibrary(file))
              declarations.push({ file: path.relative(consumer, file.fileName).replaceAll('\\', '/'), sha256: hash(fs.readFileSync(file.fileName)) })
          }
          const diagnostics = compiler.getPreEmitDiagnostics(program).map(item => ({ code: item.code, file: item.file && path.relative(consumer, item.file.fileName).replaceAll('\\', '/'), line: item.file && item.start !== undefined ? item.file.getLineAndCharacterOfPosition(item.start).line + 1 : null, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n') }))
          return { sourceSha256: hash(source), diagnostics, declarations }
        }
        const entry = { plugin: plugin.label, compiler: compiler.version, mode }
        matrix.push(entry)
        const source = vastConsumer('published', { requireImport })
        entry.root = compile(source)
        writeJson(path.join(output, 'matrix-progress.json'), matrix)
        assert.deepEqual(entry.root.diagnostics, [], `${plugin.label} ${compiler.version} ${mode}`)
        entry.rootNegative = compile(`${source}\nvast();\nvast(undefined);\nvast.default(() => {});\n`)
        assert.deepEqual(entry.rootNegative.diagnostics.map(item => item.code), [2554, 2345, 2339])
        if (plugin.label === 'candidate') {
          entry.legacy = compile(vastConsumer('published', { requireImport, legacy: true }))
          assert.deepEqual(entry.legacy.diagnostics, [])
          const runtime = vastConsumer('runtime', { requireImport })
          entry.runtime = compile(runtime)
          writeJson(path.join(output, 'matrix-progress.json'), matrix)
          assert.deepEqual(entry.runtime.diagnostics, [])
          assert(entry.runtime.declarations.some(item => item.file.includes('@alugha/ima/')), 'SDK types must resolve through actual installed dependencies')
          assert(entry.runtime.declarations.some(item => item.file.includes('@glomex/vast-ima-player/')))
          const { invalid, expected } = runtimeNegatives(runtime)
          entry.runtimeNegative = compile(invalid)
          assert.deepEqual(entry.runtimeNegative.diagnostics.map(item => item.line), expected)
        }
        writeJson(path.join(output, 'matrix-progress.json'), matrix)
      }
    }
    finally { removeConsumer(consumer) }
  }
  assert.deepEqual(Object.fromEntries(['runtime', 'published'].map(kind => [kind, hash(vastConsumer(kind))])), fixtures, 'Fixtures changed during installed validation')
  writeJson(path.join(output, 'report.json'), { task: 'PKG-VAST-04', node: process.version, fixtures, packages, published: { archive: plugins[0].archive, sha256: hash(fs.readFileSync(plugins[0].archive)) }, matrix, scope: 'Actual published and Yarn-packed candidate installed outside workspace; offline forced frozen reinstall, member hashes and declaration path isolation. No real IMA, live ad SDK registration, device or complete task06 distribution claim.' })
  console.log(`VAST isolated installed consumers passed ${matrix.length} compiler modes: ${output}`)
}

main().catch((error) => {
  if (output)
    writeJson(path.join(output, 'failure.json'), { message: error.message, stack: error.stack })
  console.error(error)
  process.exitCode = 1
})

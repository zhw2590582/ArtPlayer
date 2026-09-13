import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { maskConsumerSource, maskInvalidStatements } from './danmuku-mask-consumer.mjs'
import { verifyDanmukuMaskContract } from './danmuku-mask-contract.mjs'
import { hash, readMember } from './releases.mjs'

async function main() {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:danmuku-mask-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/danmuku-mask-package-types-'))
  console.log(`Mask installed consumer evidence: ${output}`)
  const contract = await verifyDanmukuMaskContract()
  const packages = []
  for (const name of ['artplayer', 'artplayer-plugin-danmuku-mask']) {
    const archive = path.join(output, `${name}.tgz`)
    fs.writeFileSync(path.join(output, `${name}-pack.log`), run([yarn, 'pack', '--filename', archive], path.join(workspace, 'packages', name)))
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    const files = packedFiles(archive)
    checkFiles(manifest, files, name === contract.baseline.release.name ? Object.keys(contract.baseline.release.files) : [])
    packages.push({ name, archive, sha256: hash(fs.readFileSync(archive)), files: Object.fromEntries(files.map(member => [member, hash(readMember(archive, member))])) })
  }
  const core = packages[0]
  const candidates = [
    ...[...contract.baseline.previous, contract.baseline.release].map(release => ({ ...release, archive: contract.archives.get(release.version), label: `published-${release.version}` })),
    { ...packages[1], label: 'candidate' },
  ]
  const matrix = []
  const priorDiagnostics = new Map()
  for (const plugin of candidates) {
    const consumer = consumerDirectory()
    try {
      writeJson(path.join(consumer, 'package.json'), { name: 'mask-isolated-consumer', private: true, dependencies: Object.fromEntries([core, plugin].map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) })
      fs.copyFileSync(path.join(workspace, 'yarn.lock'), path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${plugin.label}-install.log`), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
      const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${plugin.label}-frozen-install.log`), run([yarn, 'install', '--offline', '--frozen-lockfile', '--ignore-scripts', '--non-interactive'], consumer))
      assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock)
      fs.writeFileSync(path.join(output, `${plugin.label}-yarn.lock`), lock)
      for (const pkg of [core, plugin]) {
        const root = path.join(consumer, 'node_modules', pkg.name)
        assert.equal(fs.realpathSync(root), root, 'Installed package is a workspace link')
        for (const [member, expected] of Object.entries(pkg.files))
          assert.equal(hash(fs.readFileSync(path.join(root, member.slice(8)))), expected, `Installed bytes differ: ${member}`)
      }
      const runtime = path.join(consumer, 'exports.cjs')
      fs.writeFileSync(runtime, `const assert = require('node:assert/strict'); global.self = global;
for (const name of ['artplayer-plugin-danmuku-mask', 'artplayer-plugin-danmuku-mask/legacy']) {
  const value = require(name); const old = ${plugin.version === '1.0.0'};
  assert.equal(typeof value, old ? 'object' : 'function');
  assert.equal(typeof value.default, old ? 'function' : 'undefined');
  const factory = old ? value.default : value;
  const style = {}; const handlers = new Map();
  const result = factory()({ template: { $video: {}, $danmuku: {style} }, on(name, fn) { handlers.set(name, fn); }, off(name, fn) { if (handlers.get(name) === fn) handlers.delete(name); } });
  assert.deepEqual(Object.keys(result), ['name', 'start', 'stop']);
  assert.equal(result.name, 'artplayerPluginDanmukuMask'); assert.equal(typeof result.start, 'function');
  assert.equal(result.stop(), undefined); assert.equal(style.maskImage, 'none');
  handlers.get('destroy')();
}
console.log('Installed CJS/legacy registration and stop/destroy passed; no model startup.');`)
      fs.writeFileSync(path.join(output, `${plugin.label}-runtime.log`), run([runtime], consumer))
      for (const [compiler, mode] of [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]) {
        const next = mode.startsWith('nodenext')
        const filename = path.join(consumer, `consumer.${next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'}`)
        const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS, moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs }
        const compile = (source) => {
          fs.writeFileSync(filename, source)
          const program = compiler.createProgram([filename], options)
          for (const file of program.getSourceFiles()) {
            const actual = fs.realpathSync(file.fileName)
            assert(actual.startsWith(fs.realpathSync(consumer) + path.sep) || (program.isSourceFileDefaultLibrary(file) && path.dirname(actual) === fs.realpathSync(path.dirname(compiler.sys.getExecutingFilePath()))), `Type escaped consumer: ${actual}`)
          }
          return compiler.getPreEmitDiagnostics(program).map(d => ({ code: d.code, file: d.file ? path.relative(consumer, d.file.fileName).replaceAll('\\', '/') : null, line: d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : null, message: compiler.flattenDiagnosticMessageText(d.messageText, '\n').replaceAll(consumer.replaceAll('\\', '/'), '<consumer>') }))
        }
        const raw = compile(maskConsumerSource(mode, true))
        const key = `${compiler.version}:${mode}`
        if (plugin.label === 'published-1.1.0')
          priorDiagnostics.set(key, raw)
        if (plugin.label === 'candidate')
          assert.deepEqual(raw, priorDiagnostics.get(key).filter(item => !(mode === 'node10-commonjs' && item.code === 2307 && item.line === 3)), 'Only the recorded old legacy-path resolution failure may be corrected')
        let source = maskConsumerSource(mode)
        if (plugin.label !== 'candidate' && mode === 'node10-commonjs') {
          assert.deepEqual(raw.map(item => [item.code, item.line]), [[2307, 3]], 'Historical legacy path failure must stay precise')
          source = source.replace('from \'artplayer-plugin-danmuku-mask/legacy\'', 'from \'artplayer-plugin-danmuku-mask/types/artplayer-plugin-danmuku-mask\'')
        }
        const diagnostics = compile(source)
        assert.deepEqual(diagnostics, [], `${plugin.label} ${compiler.version} ${mode}`)
        const invalid = compile(`${source}\n${maskInvalidStatements.join('\n')}\n`)
        assert.equal(invalid.length, maskInvalidStatements.length)
        assert.deepEqual(invalid.map(item => item.line), maskInvalidStatements.map((_, index) => source.split('\n').length + 1 + index))
        matrix.push({ plugin: plugin.label, compiler: compiler.version, mode, raw, diagnostics, invalid })
      }
    }
    finally { removeConsumer(consumer) }
  }
  writeJson(path.join(output, 'report.json'), { task: 'PKG-MASK-04', node: process.version, packages, published: candidates.slice(0, 2).map(pkg => ({ label: pkg.label, archive: pkg.archive, sha256: hash(fs.readFileSync(pkg.archive)) })), matrix, scope: 'Actual published and candidate packages installed outside workspace, offline/frozen lock stability, byte checks, strict types and CJS/legacy registration. No model startup, native inference, ESM browser or GPU acceptance.' })
  console.log(`Mask installed consumers passed ${matrix.length} compiler modes: ${output}`)
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

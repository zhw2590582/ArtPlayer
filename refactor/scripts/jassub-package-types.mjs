import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkFiles, packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { jassubConsumerSource, jassubInvalidStatements, jassubRuntimeSource } from './jassub-consumer.mjs'
import { verifyJassubContract } from './jassub-contract.mjs'
import { hash, readMember } from './releases.mjs'

const name = 'artplayer-plugin-jassub'
const declaration = `package/types/${name}.d.ts`
const shape = diagnostics => diagnostics.map(({ code, file, line }) => ({ code, file, line }))
let evidenceOutput

function installedBytes(consumer, packages) {
  for (const pkg of packages) {
    const root = path.join(consumer, 'node_modules', pkg.name)
    assert.equal(fs.realpathSync(root), root, 'Installed package must not be a workspace link')
    assert(!fs.lstatSync(root).isSymbolicLink(), 'Installed package root is a link')
    for (const [member, expected] of Object.entries(pkg.files)) {
      const file = path.join(root, member.slice(8))
      assert.equal(fs.realpathSync(file), file, `Installed member resolves through a link: ${member}`)
      assert(fs.lstatSync(file).isFile(), `Installed member is not a regular file: ${member}`)
      assert.equal(hash(fs.readFileSync(file)), expected, `Installed bytes differ: ${member}`)
    }
  }
}

function runtimeProbe(candidate, old) {
  return `const assert = require('node:assert/strict');
global.self = global;
const names = ${JSON.stringify([name, `${name}/legacy`, ...(candidate ? [`${name}/runtime`] : [])])};
const old = ${old};
const commonjs = names.map(name => require(name));
for (const value of commonjs) {
  assert.equal(typeof value, old ? 'object' : 'function');
  assert.equal(typeof value.default, old ? 'function' : 'undefined');
  const factory = old ? value.default : value;
  assert.equal(typeof factory(), 'function');
  assert.equal(typeof factory({workerUrl: '/worker.js', wasmUrl: '/wasm.wasm', modernWasmUrl: '/modern.wasm'}), 'function');
}
${candidate ? 'assert.equal(commonjs[2], commonjs[0]); assert.equal(require.resolve(names[2]), require.resolve(names[0]));' : ''}
Promise.all(names.map(name => import(name))).then(modules => {
  assert.equal(typeof modules[0].default, 'function');
  assert.equal(typeof modules[0].default(), 'function');
  assert.equal(modules[1].default, commonjs[1]);
  const legacy = old ? modules[1].default.default : modules[1].default;
  assert.equal(typeof legacy(), 'function');
  ${candidate ? 'assert.equal(modules[2].default, modules[0].default); assert.equal(typeof modules[2].default(), \'function\');' : ''}
  console.log('Installed CJS/ESM root/legacy lazy factories and conditional runtime identity passed. Registrars were not invoked; no vendor initialization.');
}).catch(error => { console.error(error); process.exitCode = 1; });
`
}

async function main() {
  assert.equal(process.version.slice(1), fs.readFileSync(path.join(workspace, '.node-version'), 'utf8').trim(), 'Use the repository Node version')
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use yarn test:jassub-types-package')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn))
  const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/jassub-package-types-'))
  evidenceOutput = output
  console.log(`JASSUB isolated installed consumer evidence: ${output}`)
  const fixtureHashes = () => Object.fromEntries(['refactor/scripts/jassub-consumer.mjs', 'test/types/jassub-public.ts', 'test/types/jassub-runtime.ts'].map(file => [file, hash(fs.readFileSync(path.join(workspace, file)))]))
  const fixtures = fixtureHashes()
  const contract = await verifyJassubContract()
  const releases = [...contract.baseline.previous, contract.baseline.release]
  assert.deepEqual(releases.map(release => release.version), ['1.0.0', '1.1.0'])
  const packages = []
  for (const packageName of ['artplayer', name]) {
    const archive = path.join(output, `${packageName}.tgz`)
    fs.writeFileSync(path.join(output, `${packageName}-pack.log`), run([yarn, 'pack', '--filename', archive], path.join(workspace, 'packages', packageName)))
    const manifest = JSON.parse(readMember(archive, 'package/package.json'))
    const files = packedFiles(archive)
    checkFiles(manifest, files, packageName === name ? Object.keys(contract.baseline.release.files) : [])
    packages.push({ name: packageName, archive, manifest, sha256: hash(fs.readFileSync(archive)), files: Object.fromEntries(files.map(member => [member, hash(readMember(archive, member))])) })
  }
  const [core, candidate] = packages
  const rootDeclarations = releases.map((release) => {
    const current = readMember(candidate.archive, declaration)
    const previous = readMember(contract.archives.get(release.version), declaration)
    const normalize = bytes => bytes.toString('utf8').replaceAll('\r\n', '\n')
    assert.equal(normalize(current), normalize(previous), `Preserve npm ${release.version} root declaration; only checkout CRLF may differ`)
    return { version: release.version, candidateSha256: hash(current), publishedSha256: hash(previous), bytesEqual: current.equals(previous), normalizedLFSha256: hash(normalize(current)) }
  })
  const exports = candidate.manifest.exports
  assert.equal(exports['./runtime'].import.types, './types/runtime.d.mts')
  assert.equal(exports['./runtime'].require.types, './types/runtime.d.cts')
  assert.equal(exports['./runtime'].import.default, exports['.'].import)
  assert.equal(exports['./runtime'].require.default, exports['.'].require)
  assert.deepEqual(candidate.manifest.typesVersions['*'].runtime, ['types/runtime.d.ts'])
  assert.deepEqual(candidate.manifest.typesVersions['*'].legacy, [`types/${name}.d.ts`])
  const plugins = [
    ...releases.map(release => ({ ...release, archive: contract.archives.get(release.version), label: `published-${release.version}` })),
    { ...candidate, label: 'candidate' },
  ]
  const matrix = []
  const historical = new Map()
  for (const plugin of plugins) {
    const consumer = consumerDirectory()
    try {
      writeJson(path.join(consumer, 'package.json'), { name: 'jassub-isolated-consumer', private: true, dependencies: Object.fromEntries([core, plugin].map(pkg => [pkg.name, `file:${pkg.archive.replaceAll('\\', '/')}`])) })
      fs.copyFileSync(path.join(workspace, 'yarn.lock'), path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${plugin.label}-install.log`), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
      installedBytes(consumer, [core, plugin])
      const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
      fs.writeFileSync(path.join(output, `${plugin.label}-frozen-install.log`), run([yarn, 'install', '--offline', '--frozen-lockfile', '--force', '--ignore-scripts', '--non-interactive'], consumer))
      assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock, 'Frozen reinstall changed consumer lock')
      installedBytes(consumer, [core, plugin])
      fs.writeFileSync(path.join(output, `${plugin.label}-yarn.lock`), lock)
      const runtimeFile = path.join(consumer, 'exports.cjs')
      fs.writeFileSync(runtimeFile, runtimeProbe(plugin.label === 'candidate', plugin.version === '1.0.0'))
      fs.writeFileSync(path.join(output, `${plugin.label}-runtime.log`), run([runtimeFile], consumer))
      for (const [compiler, mode] of [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]) {
        const next = mode.startsWith('nodenext')
        const filename = path.join(consumer, `consumer.${next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'}`)
        const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS, moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs }
        let declarations = []
        const compile = (source, esModuleInterop = options.esModuleInterop) => {
          fs.writeFileSync(filename, source)
          const program = compiler.createProgram([filename], { ...options, esModuleInterop })
          for (const file of program.getSourceFiles()) {
            const actual = fs.realpathSync(file.fileName)
            assert(actual.startsWith(fs.realpathSync(consumer) + path.sep) || (program.isSourceFileDefaultLibrary(file) && path.dirname(actual) === fs.realpathSync(path.dirname(compiler.sys.getExecutingFilePath()))), `Type escaped consumer: ${actual}`)
          }
          declarations = program.getSourceFiles().filter(file => !program.isSourceFileDefaultLibrary(file)).map(file => path.relative(consumer, file.fileName).replaceAll('\\', '/')).sort()
          return compiler.getPreEmitDiagnostics(program).map(diagnostic => ({ code: diagnostic.code, file: diagnostic.file ? path.relative(consumer, diagnostic.file.fileName).replaceAll('\\', '/') : null, line: diagnostic.file && diagnostic.start !== undefined ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1 : null, message: compiler.flattenDiagnosticMessageText(diagnostic.messageText, '\n').replaceAll(consumer.replaceAll('\\', '/'), '<consumer>').replaceAll(consumer, '<consumer>') }))
        }
        const rawSource = jassubConsumerSource(mode, true)
        const raw = compile(rawSource)
        const key = `${compiler.version}:${mode}`
        const entry = { plugin: plugin.label, compiler: compiler.version, mode, raw, diagnostics: null, invalid: null, runtime: null }
        matrix.push(entry)
        writeJson(path.join(output, 'matrix-progress.json'), matrix)
        const legacyLines = rawSource.split('\n').flatMap((line, index) => /from ['"]artplayer-plugin-jassub\/legacy['"]/.test(line) ? [index + 1] : [])
        assert.equal(legacyLines.length, 1, 'The raw consumer must contain one identifiable legacy import')
        const legacyFailure = { code: 2307, file: path.basename(filename), line: legacyLines[0] }
        if (plugin.label === 'published-1.0.0') {
          if (mode === 'node10-commonjs')
            assert.deepEqual(shape(raw), [legacyFailure], 'Preserve the exact old Node10 legacy resolution error')
          if (mode === 'nodenext-esm')
            assert(raw.length > 0, 'Keep raw historical NodeNext namespace failures visible')
          historical.set(key, { raw: shape(raw) })
        }
        else {
          const expected = historical.get(key).raw
          assert.deepEqual(shape(raw), plugin.label === 'candidate' && mode === 'node10-commonjs' ? expected.filter(item => item.code !== legacyFailure.code || item.file !== legacyFailure.file || item.line !== legacyFailure.line) : expected, 'Only the exact recorded old Node10 legacy resolution failure may be corrected')
        }
        let source = jassubConsumerSource(mode)
        if (plugin.label !== 'candidate' && mode === 'node10-commonjs')
          source = source.replace(/(['"])artplayer-plugin-jassub\/legacy\1/g, `'artplayer-plugin-jassub/types/artplayer-plugin-jassub'`)
        entry.diagnostics = compile(source)
        assert.deepEqual(entry.diagnostics, [], `${plugin.label} ${compiler.version} ${mode}: explicit historical namespace consumer`)
        entry.invalid = compile(`${source}\n${jassubInvalidStatements.join('\n')}\n`)
        assert.equal(jassubInvalidStatements.length, 7, 'Retain all seven historical negative consumers')
        assert.equal(entry.invalid.length, jassubInvalidStatements.length)
        assert.deepEqual(entry.invalid.map(item => item.line), jassubInvalidStatements.map((_, index) => source.split('\n').length + 1 + index), 'Every old-entry negative statement must fail at its exact line')
        if (plugin.label === 'published-1.0.0')
          historical.get(key).invalid = shape(entry.invalid)
        else assert.deepEqual(shape(entry.invalid), historical.get(key).invalid, 'Both published packages and candidate preserve exact invalid diagnostic codes and lines')
        if (plugin.label === 'candidate') {
          const runtimeSource = jassubRuntimeSource(mode)
          const diagnostics = compile(runtimeSource)
          const runtimeDeclarations = declarations
          assert.deepEqual(diagnostics, [], `Accurate runtime consumer: ${compiler.version} ${mode}`)
          const lines = runtimeSource.split('\n')
          const negative = []
          for (let index = 0; index < lines.length; index++) {
            if (!/^[ \t]*\/\/ @ts-expect-error/.test(lines[index]))
              continue
            assert(lines[index + 1]?.trim() && !lines[index + 1].trim().startsWith('//'), 'Each runtime directive must precede one negative statement')
            const invalid = compile(lines.map((line, offset) => offset === index ? '' : line).join('\n'))
            assert(invalid.length > 0 && invalid.every(item => item.file === path.basename(filename) && item.line === index + 2), `Runtime negative statement ${index + 2} must independently fail on its own line`)
            negative.push({ line: index + 2, diagnostics: invalid })
          }
          assert.equal(negative.length, 14, 'Retain all fourteen runtime negative consumers')
          entry.runtime = { diagnostics, negative, declarations: runtimeDeclarations, sourceSha256: hash(runtimeSource) }
          if ((compiler === ts && mode === 'nodenext-cjs') || (compiler === compat && mode === 'node10-commonjs')) {
            const commonjsSource = jassubRuntimeSource(`${mode}-no-interop`)
            assert(commonjsSource.includes('import runtime = require(\'artplayer-plugin-jassub/runtime\')'), 'Exercise the promised CommonJS import assignment')
            const commonjsDiagnostics = compile(commonjsSource, false)
            entry.runtime.commonjs = { esModuleInterop: false, diagnostics: commonjsDiagnostics, declarations, sourceSha256: hash(commonjsSource) }
            writeJson(path.join(output, 'matrix-progress.json'), matrix)
            assert.deepEqual(commonjsDiagnostics, [], `Runtime import=require without interop: ${compiler.version} ${mode}`)
          }
        }
        writeJson(path.join(output, 'matrix-progress.json'), matrix)
      }
    }
    finally { removeConsumer(consumer) }
  }
  assert.deepEqual(fixtureHashes(), fixtures, 'Consumer fixtures changed during the installed matrix; rerun with final inputs')
  writeJson(path.join(output, 'report.json'), { task: 'PKG-JASSUB-04', node: process.version, fixtures, rootDeclarations, packages, published: plugins.slice(0, 2).map(plugin => ({ label: plugin.label, archive: plugin.archive, sha256: hash(fs.readFileSync(plugin.archive)) })), matrix, scope: 'Actual npm 1.0.0/1.1.0 and Yarn-packed candidate/core installed outside workspace; offline installation and forced frozen reinstall with unchanged lock, strictly verified installed member hashes and non-link checks; root declaration text unchanged after CRLF normalization with both raw hashes recorded, exact old diagnostics, conditional accurate runtime declarations and Node lazy factory/legacy identity. Registrars are never invoked in Node; this is not browser Worker/WASM/font rendering or publication acceptance.' })
  console.log(`JASSUB isolated installed consumers passed ${matrix.length} compiler modes: ${output}`)
}

main().catch((error) => {
  if (evidenceOutput)
    writeJson(path.join(evidenceOutput, 'failure.json'), { message: error.message, stack: error.stack })
  console.error(error)
  process.exitCode = 1
})

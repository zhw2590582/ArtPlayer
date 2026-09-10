import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

const root = path.resolve(refactorDir, '..')
const fixtures = path.join(refactorDir, 'fixtures/consumers')
const parent = os.tmpdir()
const reportPath = path.join(refactorDir, 'baselines/consumers.json')
const fixtureNames = ['runtime.cjs', 'public.ts', 'language.ts', 'optional-chapter.ts', 'legacy-plugin.ts']
export const runtimeChecks = [
  'DIST.cjs', 'DIST.cjs-legacy', 'DIST.esm', 'DIST.esm-default-only', 'DIST.esm-legacy',
  'DIST.global-core', 'DIST.amd-core', 'DIST.global-core-legacy', 'DIST.amd-core-legacy',
  'DIST.global-chapter', 'DIST.amd-chapter', 'DIST.global-chapter-legacy', 'DIST.amd-chapter-legacy',
  'SSR.import-template', 'SSR.constructor-browser-only', 'DIST.i18n-cjs-esm-global',
  'DIST.exports-boundary', 'DIST.direct-esm-file',
]

export async function runConsumers() {
  const releases = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/releases.json'), 'utf8')).releases
  fs.mkdirSync(parent, { recursive: true })
  const dir = fs.mkdtempSync(path.join(parent, 'artplayer-published-'))
  try {
    const provenance = []
    for (const release of releases) {
      const archive = await ensureArchive(release)
      for (const [member, digest] of Object.entries(release.files)) {
        const bytes = readMember(archive, member)
        assert.equal(hash(bytes), digest, `Published member changed: ${member}`)
        const target = path.resolve(dir, 'node_modules', release.name, member.slice('package/'.length))
        assert(target.startsWith(path.join(dir, 'node_modules', release.name) + path.sep), 'Unsafe consumer path')
        fs.mkdirSync(path.dirname(target), { recursive: true })
        fs.writeFileSync(target, bytes)
      }
      provenance.push({ name: release.name, version: release.version, integrity: release.integrity, sha256: release.sha256 })
    }
    for (const name of fixtureNames) fs.copyFileSync(path.join(fixtures, name), path.join(dir, name))
    fs.writeFileSync(path.join(dir, 'package.json'), '{"private":true,"type":"module"}\n')
    const runtime = JSON.parse(execFileSync(process.execPath, [path.join(dir, 'runtime.cjs')], { cwd: dir, encoding: 'utf8', timeout: 20000, maxBuffer: 1024 * 1024 }))
    assert.equal(ts.version, JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).devDependencies.typescript, 'Unexpected TypeScript compiler')
    const types = []
    for (const [mode, module, moduleResolution, packageType] of [
      ['node10-commonjs', ts.ModuleKind.CommonJS, ts.ModuleResolutionKind.Node10, 'commonjs'],
      ['nodenext-cjs', ts.ModuleKind.NodeNext, ts.ModuleResolutionKind.NodeNext, 'commonjs'],
      ['nodenext-esm', ts.ModuleKind.NodeNext, ts.ModuleResolutionKind.NodeNext, 'module'],
      ['bundler-esm', ts.ModuleKind.ESNext, ts.ModuleResolutionKind.Bundler, 'module'],
    ]) {
      fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ private: true, type: packageType }))
      for (const name of fixtureNames.filter(name => name.endsWith('.ts'))) {
        const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], target: ts.ScriptTarget.ES2020, module, moduleResolution, esModuleInterop: true }
        const program = ts.createProgram([path.join(dir, name)], options)
        const declarations = program.getSourceFiles().filter(file => /\/(?:artplayer|artplayer-plugin-chapter)\/types\//.test(file.fileName.replaceAll('\\', '/')) && file.isDeclarationFile)
        assert(declarations.every(file => file.fileName.startsWith(path.join(dir, 'node_modules').replaceAll('\\', '/'))), 'Types escaped isolated published packages')
        if (name !== 'legacy-plugin.ts' || mode !== 'node10-commonjs') assert(declarations.length > 0, 'Published declarations were not loaded')
        const diagnostics = ts.getPreEmitDiagnostics(program).map(d => ({
          file: d.file ? path.relative(dir, d.file.fileName).replaceAll('\\', '/') : null,
          line: d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : null,
          code: d.code, message: ts.flattenDiagnosticMessageText(d.messageText, '\n').replaceAll(dir.replaceAll('\\', '/'), '<consumer>').replaceAll(dir, '<consumer>'),
        }))
        types.push({ mode, packageType, fixture: name, diagnostics, declarations: declarations.map(file => path.relative(dir, file.fileName).replaceAll('\\', '/')).sort() })
      }
    }
    return { schemaVersion: 1, task: 'BASE-05', sourceCommit: '2b7054d8', capturedAt: new Date().toISOString(), node: process.version, typescript: ts.version, releases: provenance,
      compilerOptions: { strict: true, skipLibCheck: false, noEmit: true, types: [], lib: ['es2020', 'dom'], target: 'es2020', esModuleInterop: true },
      fixtureHashAlgorithm: 'sha256-lf', fixtures: Object.fromEntries(fixtureNames.map(name => [name, hash(fs.readFileSync(path.join(fixtures, name), 'utf8').replaceAll('\r\n', '\n'))])), runtime, types }
  }
  finally {
    const resolved = fs.realpathSync(dir)
    assert(path.dirname(resolved) === fs.realpathSync(parent) && path.basename(resolved).startsWith('artplayer-published-'), 'Unsafe consumer cleanup')
    fs.rmSync(resolved, { recursive: true, force: true })
  }
}

export function consumerProfile(report) {
  return { releases: report.releases, fixtures: report.fixtures, typescript: report.typescript, compilerOptions: report.compilerOptions, runtime: report.runtime, types: report.types }
}

export function validateConsumerReport(report) {
  assert.equal(report.schemaVersion, 1)
  assert.equal(report.task, 'BASE-05')
  assert.deepEqual(report.runtime.checks, runtimeChecks, 'Missing runtime consumer checks')
  assert.equal(report.fixtureHashAlgorithm, 'sha256-lf')
  assert.equal(report.compilerOptions.skipLibCheck, false)
  assert.equal(report.compilerOptions.strict, true)
  const releases = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/releases.json'), 'utf8')).releases
  assert.deepEqual(report.releases, releases.map(({ name, version, integrity, sha256 }) => ({ name, version, integrity, sha256 })), 'Wrong published consumers')
  assert.equal(report.types.length, 16)
  const cases = new Set(report.types.map(item => `${item.mode}/${item.fixture}`))
  assert.equal(cases.size, 16)
  for (const mode of ['node10-commonjs', 'nodenext-cjs', 'nodenext-esm', 'bundler-esm']) {
    for (const fixture of fixtureNames.filter(name => name.endsWith('.ts'))) {
      const result = report.types.find(item => item.mode === mode && item.fixture === fixture)
      assert(result, 'Missing TS consumer case')
      if (mode !== 'nodenext-esm' && ['public.ts', 'language.ts'].includes(fixture)) assert.deepEqual(result.diagnostics, [], 'Previously valid consumer failed')
      if (mode !== 'nodenext-esm' && fixture === 'optional-chapter.ts') assert.deepEqual(result.diagnostics.map(d => d.code), [2554], 'Historical optional-argument result changed')
      if (mode === 'node10-commonjs' && fixture === 'legacy-plugin.ts') assert.deepEqual(result.diagnostics.map(d => d.code), [2307], 'Historical legacy resolution changed')
    }
  }
  for (const name of fixtureNames) assert.equal(report.fixtures[name], hash(fs.readFileSync(path.join(fixtures, name), 'utf8').replaceAll('\r\n', '\n')), 'Consumer fixture changed; review baseline')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await runConsumers()
  validateConsumerReport(result)
  if (process.argv.includes('--capture')) {
    assert(!fs.existsSync(reportPath), 'Do not overwrite frozen consumer results')
    fs.writeFileSync(reportPath, `${JSON.stringify(result, null, 2)}\n`)
  }
  else if (process.argv.includes('--inspect')) {
    console.log(JSON.stringify(result, null, 2))
  }
  else {
    assert(process.argv.slice(2).every(arg => arg === '--check'), 'Use --capture, --inspect or --check')
    const frozen = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
    validateConsumerReport(frozen)
    assert.deepEqual(consumerProfile(result), consumerProfile(frozen), 'Published consumer behavior differs')
    console.log(`Published consumers rerun: ${result.runtime.checks.length} runtime checks, ${result.types.length} strict TS cases; historical diagnostics remain explicit`)
  }
}

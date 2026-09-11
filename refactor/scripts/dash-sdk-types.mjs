import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import compat from 'typescript-compat'
import { archiveFiles, ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

const root = path.resolve(refactorDir, '..')
const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]

async function copyRelease(release, directory, members) {
  const archive = await ensureArchive(release)
  if (!members)
    assert.deepEqual(archiveFiles(archive), Object.keys(release.files).sort())
  for (const member of members || Object.keys(release.files)) {
    const bytes = readMember(archive, member)
    assert.equal(hash(bytes), release.files[member], member)
    const destination = path.resolve(directory, 'node_modules', release.name, member.slice('package/'.length))
    assert(destination.startsWith(path.resolve(directory, 'node_modules') + path.sep))
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    fs.writeFileSync(destination, bytes)
  }
}

export async function checkDashSDKTypes() {
  const sdkInputs = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/dash-sdk.json')))
  const dependencies = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/dash-type-dependencies.json')))
  const directory = fs.mkdtempSync(path.join(refactorDir, '.cache/dash-sdk-types-'))
  const results = []
  try {
    for (const { release } of sdkInputs.sdks) {
      const workspace = path.join(directory, release.version)
      await copyRelease(release, workspace, ['package/package.json', 'package/index.d.ts'])
      if (release.version === '5.2.1') {
        for (const dependency of dependencies.releases)
          await copyRelease(dependency, workspace)
        const manifest = JSON.parse(fs.readFileSync(path.join(workspace, 'node_modules/dashjs/package.json')))
        assert.equal(manifest.dependencies['@svta/cml-request'], '1.0.12')
        for (const dependency of dependencies.releases) {
          const metadata = JSON.parse(fs.readFileSync(path.join(workspace, 'node_modules', dependency.name, 'package.json')))
          for (const [name, version] of Object.entries(metadata.peerDependencies || {}))
            assert(dependencies.releases.some(peer => peer.name === name && peer.version === version), `Missing exact peer ${name}@${version}`)
        }
      }
      const fixture = path.join(refactorDir, `fixtures/consumers/dash-sdk-v${release.version[0]}.ts`)
      const source = fs.readFileSync(fixture, 'utf8')
      assert(source.includes('// Candidate plugin consumer.'))
      for (const [compiler, mode] of modes) {
        const next = mode.startsWith('nodenext')
        const filename = path.join(workspace, `consumer.${next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'}`)
        const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS, moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs }
        function compile(code) {
          fs.writeFileSync(filename, code)
          const program = compiler.createProgram([filename], options)
          const files = program.getSourceFiles().map(file => path.resolve(file.fileName))
          assert(files.includes(path.join(workspace, 'node_modules/dashjs/index.d.ts')), 'Actual SDK declaration was not loaded')
          const hasPlugin = files.some(file => fs.realpathSync(file) === fs.realpathSync(path.join(root, 'packages/artplayer-plugin-dash-control/types/artplayer-plugin-dash-control.d.ts')))
          assert.equal(hasPlugin, code.includes('// Candidate plugin consumer.'), 'Only plugin consumers must load the candidate declaration')
          const diagnostics = compiler.getPreEmitDiagnostics(program).map(item => ({
            file: item.file ? path.relative(workspace, item.file.fileName).replaceAll('\\', '/').replace(/^consumer\.[cm]?ts$/, 'consumer.ts') : null,
            code: item.code,
            line: item.file && item.start !== undefined ? item.file.getLineAndCharacterOfPosition(item.start).line + 1 : null,
            message: compiler.flattenDiagnosticMessageText(item.messageText, '\n').replaceAll(workspace.replaceAll('\\', '/'), '<consumer>').replaceAll(root.replaceAll('\\', '/'), '<workspace>'),
          }))
          return { diagnostics, files: files.filter(file => file.startsWith(path.join(workspace, 'node_modules'))).map(file => path.relative(workspace, file).replaceAll('\\', '/')) }
        }
        const sdkSource = source.split('// Candidate plugin consumer.')[0]
          .replace(/^import .+ from '(?:artplayer|artplayer-plugin-dash-control)'\r?\n/gm, '')
        const sdkOnly = compile(sdkSource)
        const candidate = compile(source)
        const invalid = compile(source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''))
        results.push({ sdk: release.version, compiler: compiler.version, mode, sdkOnly, candidate, invalid })
      }
    }
    return results
  }
  finally {
    const resolved = fs.realpathSync(directory)
    assert.equal(path.dirname(resolved), fs.realpathSync(path.join(refactorDir, '.cache')))
    assert(path.basename(resolved).startsWith('dash-sdk-types-'))
    fs.rmSync(resolved, { recursive: true, force: true })
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const results = await checkDashSDKTypes()
  const report = path.join(refactorDir, '.cache/dash-sdk-type-diagnostics.json')
  fs.writeFileSync(report, `${JSON.stringify(results, null, 2)}\n`)
  console.log(results.map(row => ({ sdk: row.sdk, compiler: row.compiler, mode: row.mode, sdkOnly: row.sdkOnly.diagnostics.length, candidate: row.candidate.diagnostics.length, invalid: row.invalid.diagnostics.length })))
  console.log(report)
}

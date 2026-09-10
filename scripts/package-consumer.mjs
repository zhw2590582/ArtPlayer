import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import compat from 'typescript-compat'

export const workspace = fileURLToPath(new URL('../', import.meta.url))
export const names = ['artplayer', 'artplayer-plugin-chapter']
export const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'))
export const writeJson = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
export const run = (args, cwd) => execFileSync(process.execPath, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120000, maxBuffer: 8 * 1024 * 1024, windowsHide: true, env: { ...process.env, NODE_PATH: '' } })

export function consumerDirectory() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'artplayer-consumer-'))
  assert(!path.resolve(dir).startsWith(path.resolve(workspace)), 'Consumer must be outside workspace')
  return dir
}

export function removeConsumer(dir) {
  assert.equal(path.dirname(fs.realpathSync(dir)), fs.realpathSync(os.tmpdir()))
  assert(path.basename(dir).startsWith('artplayer-consumer-'), 'Refusing unrelated temporary cleanup')
  fs.rmSync(dir, { recursive: true, force: true })
}

export function runtimeConsumer(dir) {
  fs.copyFileSync(path.join(workspace, 'test/package/runtime.cjs'), path.join(dir, 'runtime.cjs'))
  fs.copyFileSync(path.join(workspace, 'test/contracts/emitter.js'), path.join(dir, 'emitter.mjs'))
  writeJson(path.join(dir, 'expected.json'), { version: readJson(path.join(dir, 'node_modules/artplayer/package.json')).version })
  return JSON.parse(run(['runtime.cjs'], dir))
}

export function typeConsumers(dir) {
  const results = []
  for (const [compiler, mode] of [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'bundler-esm'], [compat, 'node10-commonjs'], [ts, 'nodenext-esm']]) {
    const next = mode.startsWith('nodenext')
    const extension = next ? (mode.endsWith('-cjs') ? 'cts' : 'mts') : 'ts'
    const inputs = ['public', 'declaration-inputs', 'declaration-legacy', 'chapter-options', 'chapter-exports', 'language-value', 'language', 'legacy-plugin']
    if (mode === 'nodenext-cjs')
      inputs.push('commonjs')
    const files = inputs.map((name) => {
      const file = path.join(dir, `${name}.${extension}`)
      const folder = ['language', 'legacy-plugin'].includes(name) ? 'refactor/fixtures/consumers' : 'test/types'
      fs.copyFileSync(path.join(workspace, folder, `${name}.${name === 'commonjs' ? 'cts' : 'ts'}`), file)
      return file
    })
    const options = {
      strict: true,
      noEmit: true,
      skipLibCheck: false,
      types: [],
      esModuleInterop: true,
      target: compiler.ScriptTarget.ES2020,
      lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'],
      module: next ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS,
      moduleResolution: next ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs,
    }
    const program = compiler.createProgram(files, options)
    const libDir = path.dirname(compiler.sys.getExecutingFilePath())
    for (const file of program.getSourceFiles()) {
      const actual = fs.realpathSync(file.fileName)
      assert(actual.startsWith(fs.realpathSync(dir) + path.sep)
        || (path.dirname(actual) === fs.realpathSync(libDir) && /^lib\..*\.d\.ts$/.test(path.basename(actual))), `Type resolution escaped consumer: ${file.fileName}`)
    }
    const diagnostics = compiler.getPreEmitDiagnostics(program).map(d => ({
      file: d.file ? `test/types/${path.basename(d.file.fileName).replace(/\.[cm]ts$/, '.ts').replace(/^public\.ts$/, 'consumer.ts')}` : null,
      code: d.code,
      line: d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : null,
      message: compiler.flattenDiagnosticMessageText(d.messageText, '\n').replaceAll(`${dir.replaceAll('\\', '/')}/node_modules/`, '<workspace>/packages/'),
    }))
    const expected = mode === 'nodenext-esm' ? readJson(path.join(workspace, 'test/types/known-diagnostics.json')).diagnostics : []
    const historical = readJson(path.join(workspace, 'refactor/baselines/consumers.json')).types
    const known = readJson(path.join(workspace, 'test/package/known-types.json')).cases
    for (const fixture of ['language.ts', 'legacy-plugin.ts']) {
      if (!known.some(item => item.fixture === fixture && item.mode === mode))
        continue
      const original = historical.find(result => result.mode === mode && result.fixture === fixture)
      for (const diagnostic of original.diagnostics) {
        expected.push({ ...diagnostic, file: `test/types/${fixture}`, message: compiler === compat
          ? diagnostic.message.split('\n')[0]
          : diagnostic.message.replaceAll('<consumer>/node_modules/', '<workspace>/packages/') })
      }
    }
    const ordered = values => [...values].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.code - b.code)
    assert.deepEqual(ordered(diagnostics), ordered(expected), `Packed type regression: TS ${compiler.version} ${mode}`)
    results.push({ compiler: compiler.version, mode, diagnostics, declarations: program.getSourceFiles().filter(f => f.fileName.includes('/node_modules/')).map(f => path.relative(dir, f.fileName).replaceAll('\\', '/')).sort() })
  }
  return results
}

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import compat from 'typescript-compat'
import runtimeCompat from 'typescript-runtime-compat'

const root = fileURLToPath(new URL('../', import.meta.url))
const relative = name => path.relative(root, name).replaceAll('\\', '/')
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))

export function checkProject(configPath) {
  const config = ts.readConfigFile(configPath, ts.sys.readFile)
  if (config.error)
    return { files: [], diagnostics: [config.error] }
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath))
  assert.equal(parsed.options.strict, true, 'Migrated projects must stay strict')
  assert.equal(parsed.options.skipLibCheck, false, 'Do not hide declaration errors')
  assert.equal(parsed.options.noEmit, true, 'Type checks must not write build artifacts')
  assert.deepEqual(parsed.options.types, [], 'Browser projects must not inherit ambient Node/test globals')
  const program = ts.createProgram(parsed.fileNames, parsed.options)
  return { files: parsed.fileNames, diagnostics: [...parsed.errors, ...ts.getPreEmitDiagnostics(program)] }
}

export function checkConsumer(compiler, mode, source = fs.readFileSync(path.join(root, 'test/types/public.ts'), 'utf8')) {
  const nodeNext = mode.startsWith('nodenext')
  const module = nodeNext ? compiler.ModuleKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleKind.ESNext : compiler.ModuleKind.CommonJS
  const moduleResolution = nodeNext ? compiler.ModuleResolutionKind.NodeNext : mode === 'bundler-esm' ? compiler.ModuleResolutionKind.Bundler : compiler.ModuleResolutionKind.NodeJs
  const filename = path.join(root, 'test/types', nodeNext ? `consumer.${mode.endsWith('-cjs') ? 'cts' : 'mts'}` : 'consumer.ts')
  const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], esModuleInterop: true, module, moduleResolution }
  const host = compiler.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)
  host.getSourceFile = (name, languageVersion, onError, shouldCreateNewSourceFile) => path.resolve(name) === filename
    ? compiler.createSourceFile(filename, source, languageVersion, true)
    : getSourceFile(name, languageVersion, onError, shouldCreateNewSourceFile)
  const program = compiler.createProgram([filename], options, host)
  assert(program.getSourceFile(filename), 'Consumer fixture was not loaded')
  return compiler.getPreEmitDiagnostics(program).map(diagnostic => ({
    file: diagnostic.file ? relative(diagnostic.file.fileName).replace(/consumer\.[cm]?ts$/, 'consumer.ts') : null,
    code: diagnostic.code,
    line: diagnostic.file && diagnostic.start !== undefined ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1 : null,
    message: compiler.flattenDiagnosticMessageText(diagnostic.messageText, '\n').replaceAll(root.replaceAll('\\', '/'), '<workspace>/'),
  }))
}

export function runTypechecks() {
  const dependencies = read('package.json').devDependencies
  assert.equal(ts.version, dependencies.typescript)
  assert.equal(`npm:typescript@${compat.version}`, dependencies['typescript-compat'])
  assert.equal(`npm:typescript@${runtimeCompat.version}`, dependencies['typescript-runtime-compat'])
  const configs = [path.join(root, 'tsconfig.json')]
  for (const name of fs.readdirSync(path.join(root, 'packages'))) {
    const config = path.join(root, 'packages', name, 'tsconfig.json')
    if (fs.existsSync(config)) {
      configs.push(config)
    }
    else {
      const sources = ts.sys.readDirectory(path.join(root, 'packages', name, 'src'), ['.ts', '.tsx', '.mts', '.cts'])
      assert(!sources.some(file => !/\.d\.[cm]?ts$/.test(file)), `Add a package tsconfig before migrating ${name}`)
    }
  }
  let sourceCount = 0
  for (const config of configs) {
    const result = checkProject(config)
    assert.equal(result.diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(result.diagnostics, {
      getCurrentDirectory: () => root,
      getCanonicalFileName: name => name,
      getNewLine: () => '\n',
    }))
    sourceCount += result.files.filter(file => relative(file).includes('/src/') && !/\.d\.[cm]?ts$/.test(file)).length
    console.log(`Strict project passed: ${relative(config)} (${result.files.length} root files)`)
  }
  for (const [compiler, mode] of [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'bundler-esm'], [ts, 'nodenext-esm'], [compat, 'node10-commonjs']]) {
    for (const fixture of ['test/types/public.ts', 'test/types/declaration-inputs.ts', 'test/types/declaration-legacy.ts', 'test/types/plugins-public.ts', 'test/types/playback-public.ts', 'test/types/chapter-options.ts', 'test/types/chapter-exports.ts', 'test/types/hls-control.ts', 'test/types/dash-control.ts', 'test/types/ads.ts', 'refactor/fixtures/consumers/ads-published.ts', 'refactor/fixtures/consumers/ads-workspace.ts', 'refactor/fixtures/consumers/dash-control-legacy.ts', 'test/types/audio-track.ts', 'test/types/language-value.ts', 'refactor/fixtures/consumers/language.ts', 'refactor/fixtures/consumers/legacy-plugin.ts']) {
      assert.deepEqual(checkConsumer(compiler, mode, fs.readFileSync(path.join(root, fixture), 'utf8')), [], `Consumer failed: TS ${compiler.version} ${mode} ${fixture}`)
    }
    if (mode === 'nodenext-cjs')
      assert.deepEqual(checkConsumer(compiler, mode, fs.readFileSync(path.join(root, 'test/types/commonjs.cts'), 'utf8')), [], 'CommonJS export assignment consumer failed')
    console.log(`Consumers passed: TS ${compiler.version} ${mode}`)
  }
  const runtimeFixtures = ['test/types/runtime-leaf-consumer.ts', 'test/types/runtime-public.ts', 'test/types/runtime-construction.ts']
  for (const compiler of [ts, runtimeCompat]) {
    for (const mode of ['node10-commonjs', 'nodenext-cjs', 'bundler-esm', 'nodenext-esm']) {
      for (const fixture of runtimeFixtures)
        assert.deepEqual(checkConsumer(compiler, mode, fs.readFileSync(path.join(root, fixture), 'utf8')), [], `Runtime declarations failed: TS ${compiler.version} ${mode} ${fixture}`)
      if (mode === 'nodenext-cjs')
        assert.deepEqual(checkConsumer(compiler, mode, fs.readFileSync(path.join(root, 'test/types/runtime-commonjs.cts'), 'utf8')), [], `Runtime CJS export assignment failed: TS ${compiler.version}`)
      console.log(`Runtime declaration consumers passed: TS ${compiler.version} ${mode}`)
    }
  }
  console.log(`TypeScript production source files checked: ${sourceCount}; unmigrated JS is not counted`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  runTypechecks()

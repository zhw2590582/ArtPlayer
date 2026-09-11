import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'
import ts from 'typescript'

const workspace = fileURLToPath(new URL('../', import.meta.url))
const normalize = value => value.replaceAll('\\', '/')

export async function generateCoreDeclarations({ root = workspace, write = false } = {}) {
  const packageRoot = path.join(root, 'packages/artplayer')
  const sourceRoot = path.join(packageRoot, 'public')
  const outputRoot = path.join(packageRoot, 'types')
  const files = ts.sys.readDirectory(sourceRoot, ['.ts', '.mts', '.cts']).sort()
  assert(files.length > 0, 'No public TypeScript sources found')
  assert(files.every(file => !/\.d\.[cm]?ts$/.test(file)), 'Public sources must be TypeScript, not copied declaration artifacts')
  const options = {
    strict: true,
    skipLibCheck: false,
    types: [],
    target: ts.ScriptTarget.ES2020,
    lib: ['lib.es2020.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    declaration: true,
    emitDeclarationOnly: true,
    noEmitOnError: true,
    rootDir: sourceRoot,
    outDir: outputRoot,
    newLine: ts.NewLineKind.LineFeed,
  }
  const outputs = new Map()
  const program = ts.createProgram(files, options)
  const formatHost = { getCurrentDirectory: () => root, getCanonicalFileName: name => name, getNewLine: () => '\n' }
  const errors = ts.getPreEmitDiagnostics(program)
  assert.equal(errors.length, 0, ts.formatDiagnosticsWithColorAndContext(errors, formatHost))
  for (const source of program.getSourceFiles()) {
    if (program.isSourceFileDefaultLibrary(source))
      continue
    assert(files.includes(source.fileName), `Public declarations depend on a non-public source: ${normalize(path.relative(root, source.fileName))}`)
  }
  const emitted = program.emit(undefined, (file, text) => {
    const relative = normalize(path.relative(outputRoot, file))
    assert(!relative.startsWith('../') && !path.isAbsolute(relative) && /\.d\.[cm]?ts$/.test(relative), `Unexpected declaration output: ${file}`)
    outputs.set(relative, text)
  })
  assert.equal(emitted.emitSkipped, false, ts.formatDiagnosticsWithColorAndContext(emitted.diagnostics, formatHost))
  assert.equal(outputs.size, files.length, 'Each public source must emit one declaration')

  const eslint = new ESLint({ cwd: workspace, fix: true, fixTypes: ['layout'] })
  const generated = new Map()
  for (const [relative, content] of outputs) {
    const source = `public/${relative.replace('.d.', '.')}`
    // Declaration emit omits line comments. This bridge intentionally merges
    // the constructor value, instance alias and CJS named-type namespace.
    const bridge = ['artplayer.d.cts', 'runtime.d.cts', 'runtime.d.ts'].includes(relative) ? '/* eslint-disable ts/no-redeclare -- Constructor, instance and named types share the export. */\n' : ''
    const code = `// Generated from ${source} by yarn build:types. Do not edit.\n${bridge}${content}`
    const [result] = await eslint.lintText(code, { filePath: path.join(workspace, 'packages/artplayer/types', relative) })
    if (result.errorCount) {
      const formatter = await eslint.loadFormatter('stylish')
      throw new Error(formatter.format([result]))
    }
    generated.set(relative, result.output || code)
  }
  const existing = ts.sys.readDirectory(outputRoot, ['.d.ts', '.d.mts', '.d.cts'])
  for (const file of existing)
    assert(generated.has(normalize(path.relative(outputRoot, file))), `Declaration has no public source: ${file}`)
  const changed = []
  for (const [relative, text] of generated) {
    const file = path.join(outputRoot, relative)
    const actual = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n') : null
    if (actual === text)
      continue
    changed.push(relative)
    if (write) {
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, text)
    }
  }
  assert(write || changed.length === 0, `Generated core declarations are stale: ${changed.join(', ')}. Run yarn build:types.`)
  return { files: [...generated.keys()].sort(), changed }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert(process.argv.length === 3 && ['--write', '--check'].includes(process.argv[2]), 'Use build-types.mjs --write or --check')
  const result = await generateCoreDeclarations({ write: process.argv[2] === '--write' })
  console.log(`Core declarations ${process.argv[2]}: ${result.files.length} files; ${result.changed.length} changed`)
}

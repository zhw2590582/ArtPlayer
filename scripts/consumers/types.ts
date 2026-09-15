import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import compat from 'typescript-compat'

type Mode = 'node10-commonjs' | 'nodenext-cjs' | 'nodenext-esm' | 'bundler-esm'

// Both pinned compilers provide this stable API; newer resolution modes never
// reach TS 4.3. Keep the version boundary here, outside consumer fixtures.
export const typeMatrix: { compiler: typeof ts, mode: Mode }[] = [
  ...(['node10-commonjs', 'nodenext-cjs', 'nodenext-esm', 'bundler-esm'] as const).map(mode => ({ compiler: ts, mode })),
  { compiler: compat as unknown as typeof ts, mode: 'node10-commonjs' },
]

function inside(root: string, file: string) {
  const relative = path.relative(root, file)
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
}

export function checkTypeFixture(directory: string, source: string, compiler: typeof ts, mode: Mode) {
  const root = fs.realpathSync(directory)
  const next = mode.startsWith('nodenext')
  const extension = next ? mode.endsWith('-cjs') ? 'cts' : 'mts' : 'ts'
  const file = path.join(root, `installed-consumer.${extension}`)
  const options: ts.CompilerOptions = {
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
  const library = fs.realpathSync(path.dirname(compiler.getDefaultLibFilePath(options)))
  function compile(text: string) {
    fs.writeFileSync(file, text)
    const program = compiler.createProgram([file], options)
    const declarations: string[] = []
    for (const input of program.getSourceFiles()) {
      const resolved = fs.realpathSync(input.fileName)
      const standard = path.dirname(resolved) === library && /^lib\..*\.d\.ts$/.test(path.basename(resolved))
      assert(inside(root, resolved) || standard, `Consumer input escaped installation: ${resolved}`)
      if (input.isDeclarationFile && !standard)
        declarations.push(path.relative(root, resolved).replaceAll('\\', '/'))
    }
    const diagnostics = compiler.getPreEmitDiagnostics(program).map(diagnostic => ({
      code: diagnostic.code,
      file: diagnostic.file ? fs.realpathSync(diagnostic.file.fileName) : null,
      line: diagnostic.file && diagnostic.start !== undefined ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1 : null,
      message: compiler.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    }))
    return { declarations, diagnostics }
  }
  try {
    const valid = compile(source)
    assert.deepEqual(valid.diagnostics, [], `Valid installed consumer failed (${compiler.version}/${mode})`)
    const expected = source.split(/\r?\n/).flatMap((line, index) => line.includes('@ts-expect-error') ? [index + 2] : [])
    assert(expected.length > 0, 'Consumer needs negative statements')
    // Preserve lines so every intentionally invalid call must fail at its own location.
    const invalid = compile(source.replaceAll('@ts-expect-error', 'expected type error'))
    assert(invalid.diagnostics.every(diagnostic => diagnostic.file === file && expected.includes(diagnostic.line ?? 0)), 'Unexpected negative consumer diagnostics')
    assert.deepEqual([...new Set(invalid.diagnostics.map(diagnostic => diagnostic.line))].sort((a, b) => a! - b!), expected, 'Every invalid consumer statement must be rejected')
    return { compiler: compiler.version, mode, declarations: valid.declarations, negativeStatements: expected.length, negativeDiagnostics: invalid.diagnostics.map(({ code, line }) => ({ code, line })) }
  }
  finally {
    fs.rmSync(file, { force: true })
  }
}

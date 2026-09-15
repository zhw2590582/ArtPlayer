import assert from 'node:assert/strict'

export interface CompilerModule { name: string, source: string }

// Reproduce emission with pinned standard libraries and optional verified module
// declarations. This is intentionally not a full upstream semantic typecheck.
export function emitAmd(ts: typeof import('typescript'), source: string, libraries: string[], strict = false, modules: CompilerModule[] = []): string {
  const options: import('typescript').CompilerOptions = {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.AMD,
    newLine: ts.NewLineKind.LineFeed,
    noResolve: modules.length === 0,
    lib: libraries.map(library => `lib.${library}.d.ts`),
    strict,
  }
  const host = ts.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)
  const inputs = new Map([['worker.ts', source], ...modules.map((module, index): [string, string] => [`pinned-${index}.d.ts`, module.source])])
  host.getSourceFile = (file, languageVersion, onError, createNew) => inputs.has(file)
    ? ts.createSourceFile(file, inputs.get(file)!, languageVersion, true)
    : getSourceFile(file, languageVersion, onError, createNew)
  host.resolveModuleNames = names => names.map((name) => {
    const index = modules.findIndex(module => module.name === name)
    return index < 0 ? undefined : { resolvedFileName: `pinned-${index}.d.ts`, extension: ts.Extension.Dts }
  })
  let output = ''
  host.writeFile = (file, text) => {
    assert(file.endsWith('.js') && !output, 'Unexpected compiler output')
    output = text
  }
  const result = ts.createProgram(['worker.ts'], options, host).emit()
  assert(!result.emitSkipped && output, 'Missing source emission')
  return output
}

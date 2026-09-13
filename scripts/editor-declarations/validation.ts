import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

export function checkStandaloneDeclarations(files: Map<string, string>, compiler: typeof ts = ts) {
  const folder = path.resolve(fileURLToPath(new URL('../../refactor/.cache/editor-check/', import.meta.url)))
  const sources = new Map([...files].map(([file, code]) => [path.join(folder, file), code]))
  const options: ts.CompilerOptions = { strict: true, noEmit: true, skipLibCheck: false, types: [], target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs }
  const host = compiler.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)
  const exists = host.fileExists.bind(host)
  const directoryExists = host.directoryExists?.bind(host)
  host.fileExists = file => sources.has(path.resolve(file)) || exists(file)
  host.directoryExists = directory => path.resolve(directory) === folder || !!directoryExists?.(directory)
  host.getSourceFile = (file, version, onError, create) => {
    const code = sources.get(path.resolve(file))
    return code === undefined ? getSourceFile(file, version, onError, create) : compiler.createSourceFile(file, code, version, true)
  }
  const program = compiler.createProgram([...sources.keys()], options, host)
  for (const file of program.getSourceFiles())
    assert(sources.has(path.resolve(file.fileName)) || program.isSourceFileDefaultLibrary(file), `Editor types escaped the standalone bundle: ${file.fileName}`)
  return compiler.getPreEmitDiagnostics(program).map(diagnostic => ({ code: diagnostic.code, file: diagnostic.file && path.basename(diagnostic.file.fileName), message: compiler.flattenDiagnosticMessageText(diagnostic.messageText, '\n') }))
}

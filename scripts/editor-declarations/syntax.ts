import assert from 'node:assert/strict'
import ts from 'typescript'

export function parseDeclaration(code: string, file = 'plugin.d.ts'): ts.SourceFile {
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const options: ts.CompilerOptions = { noLib: true, noResolve: true, types: [] }
  const host = ts.createCompilerHost(options)
  host.getSourceFile = name => name === file ? source : undefined
  const program = ts.createProgram([file], options, host)
  assert.equal(program.getSyntacticDiagnostics(source).length, 0, 'Invalid plugin declaration syntax')
  return source
}

export function exportedDefinition(node: ts.Statement): ts.Statement {
  assert(ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isClassDeclaration(node)
    || ts.isModuleDeclaration(node) || ts.isEnumDeclaration(node), 'Unsupported SDK declaration kind')
  return ts.factory.replaceModifiers(node, [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)])
}

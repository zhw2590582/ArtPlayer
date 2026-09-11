import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// Migrate each package explicitly; unknown imports/exports must not disappear silently.
export function generatePluginEditorDeclaration(code, name) {
  assert(/^[a-z_$][\w$]*$/i.test(name), 'Invalid plugin global')
  const source = ts.createSourceFile('plugin.d.ts', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  assert.equal(source.parseDiagnostics.length, 0, 'Invalid plugin declaration syntax')
  const factory = ts.factory
  const definitions = []
  const aliases = []
  const internal = `${name}Definitions`
  let exported = false
  let callable = false
  for (const node of source.statements) {
    if (ts.isImportDeclaration(node)) {
      assert(node.importClause?.isTypeOnly && !node.importClause.namedBindings && node.importClause.name?.text === 'Artplayer' && node.moduleSpecifier.text === 'artplayer', 'Unsupported plugin editor import')
      continue
    }
    if (ts.isExportAssignment(node)) {
      assert(!node.isExportEquals && ts.isIdentifier(node.expression) && node.expression.text === name, 'Unexpected plugin default export')
      exported = true
      continue
    }
    assert(ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isFunctionDeclaration(node), 'Unsupported plugin editor declaration')
    assert(node.name && node.name.text !== internal, 'Invalid plugin declaration name')
    definitions.push(factory.replaceModifiers(node, [factory.createModifier(ts.SyntaxKind.ExportKeyword)]))
    if (ts.isFunctionDeclaration(node)) {
      assert.equal(node.name.text, name, 'Unexpected plugin callable')
      callable = true
      continue
    }
    if (node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      aliases.push(factory.createTypeAliasDeclaration(
        [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        node.name,
        node.typeParameters,
        factory.createTypeReferenceNode(factory.createQualifiedName(factory.createIdentifier(internal), node.name), node.typeParameters?.map(parameter => factory.createTypeReferenceNode(parameter.name))),
      ))
    }
  }
  assert(exported && callable, 'Plugin editor requires a default function')
  const namespace = (identifier, statements) => factory.createModuleDeclaration([factory.createModifier(ts.SyntaxKind.DeclareKeyword)], factory.createIdentifier(identifier), factory.createModuleBlock(statements), ts.NodeFlags.Namespace)
  const statements = [
    namespace(internal, definitions),
    factory.createVariableStatement([factory.createModifier(ts.SyntaxKind.DeclareKeyword)], factory.createVariableDeclarationList([
      factory.createVariableDeclaration(name, undefined, factory.createTypeQueryNode(factory.createQualifiedName(factory.createIdentifier(internal), factory.createIdentifier(name)))),
    ], ts.NodeFlags.Const)),
    namespace(name, aliases),
    factory.createExportAssignment(undefined, true, factory.createIdentifier(name)),
    factory.createNamespaceExportDeclaration(factory.createIdentifier(name)),
  ]
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  return `// Generated from the package public declaration by yarn build:ts. Do not edit.\n/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */\n${statements.map(node => printer.printNode(ts.EmitHint.Unspecified, node, source)).join('\n')}\n`
}

export function checkPluginEditorDeclaration(code, core, consumer = '', compiler = ts) {
  const folder = fileURLToPath(new URL('../refactor/.cache/plugin-editor-semantic/', import.meta.url))
  const sources = new Map([
    [path.join(folder, 'artplayer.d.ts'), core],
    [path.join(folder, 'plugin.d.ts'), code],
    [path.join(folder, 'consumer.ts'), consumer],
  ])
  const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs }
  const host = compiler.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)
  host.getSourceFile = (file, version, onError, create) => sources.has(path.resolve(file))
    ? compiler.createSourceFile(file, sources.get(path.resolve(file)), version, true)
    : getSourceFile(file, version, onError, create)
  const program = compiler.createProgram([...sources.keys()], options, host)
  for (const file of program.getSourceFiles())
    assert(sources.has(path.resolve(file.fileName)) || program.isSourceFileDefaultLibrary(file), `Plugin editor types escaped the standalone bundle: ${file.fileName}`)
  return compiler.getPreEmitDiagnostics(program).map(diagnostic => ({ code: diagnostic.code, message: compiler.flattenDiagnosticMessageText(diagnostic.messageText, '\n') }))
}

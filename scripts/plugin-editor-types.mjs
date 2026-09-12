import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// Migrate each package explicitly; unknown imports/exports must not disappear silently.
export function generatePluginEditorDeclaration(code, name, localTypes = {}) {
  assert(/^[a-z_$][\w$]*$/i.test(name), 'Invalid plugin global')
  let source = ts.createSourceFile('plugin.d.ts', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  assert.equal(source.parseDiagnostics.length, 0, 'Invalid plugin declaration syntax')
  const expanded = []
  for (const node of source.statements) {
    if (!ts.isExportDeclaration(node) || !node.moduleSpecifier) {
      expanded.push(node)
      continue
    }
    assert(node.isTypeOnly, 'Unsupported plugin editor declaration: runtime re-export')
    const dependency = localTypes[node.moduleSpecifier.text]
    assert(typeof dependency === 'string' && node.exportClause && ts.isNamedExports(node.exportClause), 'Unsupported editor type re-export')
    const names = node.exportClause.elements.map((item) => {
      assert(!item.propertyName, 'Renamed editor type re-export is unsupported')
      return item.name.text
    })
    const types = ts.createSourceFile('dependency.d.ts', dependency, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
    assert.equal(types.parseDiagnostics.length, 0)
    const definitions = types.statements.filter(item => !ts.isImportDeclaration(item))
    assert(definitions.every(item => ts.isInterfaceDeclaration(item) || ts.isTypeAliasDeclaration(item)), 'Editor dependencies must contain only types')
    assert.deepEqual(definitions.map(item => item.name.text).sort(), names.sort(), 'Editor re-export must explicitly cover its local type definitions')
    expanded.push(...types.statements)
  }
  // Reparse combined statements so comments and text positions belong to one file.
  source = ts.createSourceFile('plugin.d.ts', expanded.map(node => ts.createPrinter().printNode(ts.EmitHint.Unspecified, node, node.getSourceFile())).join('\n'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  if (source.statements.some(node => ts.isExportAssignment(node) && node.isExportEquals))
    return generateCommonJSPluginEditor(source, name)
  const factory = ts.factory
  const definitions = []
  const aliases = []
  const internal = `${name}Definitions`
  let exported = false
  let callable = false
  let classExport = false
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
    if (ts.isVariableStatement(node)) {
      const values = node.declarationList.declarations
      assert(values.length === 1 && values[0].name.text === name && ts.isFunctionTypeNode(values[0].type), 'Unexpected plugin callable variable')
      definitions.push(factory.replaceModifiers(node, [factory.createModifier(ts.SyntaxKind.ExportKeyword)]))
      callable = true
      continue
    }
    assert(ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node), 'Unsupported plugin editor declaration')
    assert(node.name && node.name.text !== internal, 'Invalid plugin declaration name')
    definitions.push(factory.replaceModifiers(node, [factory.createModifier(ts.SyntaxKind.ExportKeyword)]))
    if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
      assert.equal(node.name.text, name, 'Unexpected plugin callable')
      callable = true
      classExport = ts.isClassDeclaration(node)
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
  assert(exported && callable, 'Plugin editor requires a default function or class')
  const namespace = (identifier, statements) => factory.createModuleDeclaration([factory.createModifier(ts.SyntaxKind.DeclareKeyword)], factory.createIdentifier(identifier), factory.createModuleBlock(statements), ts.NodeFlags.Namespace)
  const statements = [
    namespace(internal, definitions),
    factory.createVariableStatement([factory.createModifier(ts.SyntaxKind.DeclareKeyword)], factory.createVariableDeclarationList([
      factory.createVariableDeclaration(name, undefined, factory.createTypeQueryNode(factory.createQualifiedName(factory.createIdentifier(internal), factory.createIdentifier(name)))),
    ], ts.NodeFlags.Const)),
    ...(classExport ? [factory.createTypeAliasDeclaration(undefined, name, undefined, factory.createTypeReferenceNode(factory.createQualifiedName(factory.createIdentifier(internal), factory.createIdentifier(name))))] : []),
    namespace(name, aliases),
    factory.createExportAssignment(undefined, true, factory.createIdentifier(name)),
    factory.createNamespaceExportDeclaration(factory.createIdentifier(name)),
  ]
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  return `// Generated from the package public declaration by yarn build:ts. Do not edit.\n/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */\n${statements.map(node => printer.printNode(ts.EmitHint.Unspecified, node, source)).join('\n')}\n`
}

function generateCommonJSPluginEditor(source, name) {
  const statements = []
  let namespace = false
  let callable = false
  let exported = false
  let global = false
  let classExport = false
  for (const node of source.statements) {
    if (ts.isImportDeclaration(node)) {
      assert(node.importClause?.isTypeOnly && !node.importClause.namedBindings && node.importClause.name?.text === 'Artplayer' && node.moduleSpecifier.text === 'artplayer', 'Unsupported CommonJS plugin editor import')
      continue
    }
    if (ts.isModuleDeclaration(node)) {
      assert.equal(node.name.text, name, 'Unexpected plugin namespace')
      assert(node.body && ts.isModuleBlock(node.body) && node.body.statements.every(item => ts.isInterfaceDeclaration(item) || ts.isTypeAliasDeclaration(item)), 'Editor namespace must contain only public type declarations')
      namespace = true
    }
    else if (ts.isClassDeclaration(node)) {
      assert.equal(node.name?.text, name, 'Unexpected CommonJS editor class')
      callable = true
      classExport = true
    }
    else if (ts.isVariableStatement(node)) {
      const definitions = node.declarationList.declarations
      assert.equal(definitions.length, 1)
      const definition = definitions[0]
      assert.equal(definition.name.text, name)
      assert(ts.isTypeReferenceNode(definition.type) && ts.isQualifiedName(definition.type.typeName)
        && definition.type.typeName.left.text === name && definition.type.typeName.right.text === 'Factory', 'Editor export must use its public Factory interface')
      callable = true
    }
    else if (ts.isExportAssignment(node)) {
      assert(node.isExportEquals && node.expression.text === name, 'Unexpected CommonJS plugin export')
      exported = true
    }
    else if (ts.isNamespaceExportDeclaration(node)) {
      assert.equal(node.name.text, name)
      global = true
    }
    else {
      assert.fail('Unsupported CommonJS plugin editor declaration')
    }
    statements.push(node)
  }
  assert(namespace && callable && exported && global, 'Incomplete CommonJS plugin editor declaration')
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const bridge = classExport ? '' : '/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */\n'
  return `// Generated from the package public declaration by yarn build:ts. Do not edit.\n${bridge}${statements.map(node => printer.printNode(ts.EmitHint.Unspecified, node, source)).join('\n')}\n`
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

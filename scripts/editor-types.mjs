import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateDtsBundle } from 'dts-bundle-generator'
import ts from 'typescript'
import compat from 'typescript-compat'

const root = fileURLToPath(new URL('../', import.meta.url))
const factory = ts.factory

/** Put flattened definitions in a private scope so public aliases cannot refer to themselves. */
export function asGlobalDeclaration(code, globalName) {
  assert(/^[A-Z_$][\w$]*$/i.test(globalName), 'Invalid editor global name')
  const source = ts.createSourceFile('bundle.d.ts', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const exports = new Map()
  const declarations = new Map()
  const definitions = []
  for (const node of source.statements) {
    if (ts.isExportDeclaration(node)) {
      assert(!node.moduleSpecifier && node.exportClause && ts.isNamedExports(node.exportClause), 'Editor bundle must contain no unresolved exports')
      for (const item of node.exportClause.elements)
        exports.set(item.name.text, (item.propertyName || item.name).text)
      continue
    }
    assert(ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isClassDeclaration(node), `Unsupported editor declaration: ${ts.SyntaxKind[node.kind]}`)
    assert(node.name, 'Editor definitions must be named')
    const name = node.name.text
    assert(!declarations.has(name), `Duplicate bundled declaration: ${name}`)
    declarations.set(name, node)
    if (node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword))
      exports.set(name, name)
    definitions.push(factory.replaceModifiers(node, [factory.createModifier(ts.SyntaxKind.ExportKeyword)]))
  }
  const defaultName = exports.get('default')
  assert(defaultName && ts.isClassDeclaration(declarations.get(defaultName)), 'Core editor requires the actual default constructor class')
  const definitionName = `${globalName}Definitions`
  assert(!declarations.has(definitionName), 'Editor definition namespace collides with source')
  const qualified = name => factory.createQualifiedName(factory.createIdentifier(definitionName), factory.createIdentifier(name))
  const aliases = []
  for (const [name, local] of exports) {
    if (name === 'default')
      continue
    const declaration = declarations.get(local)
    assert(declaration, `Missing bundled export: ${local}`)
    const parameters = declaration.typeParameters
    aliases.push(factory.createTypeAliasDeclaration(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      name,
      parameters,
      factory.createTypeReferenceNode(qualified(local), parameters?.map(parameter => factory.createTypeReferenceNode(parameter.name))),
    ))
  }
  const namespace = (name, nodes) => factory.createModuleDeclaration(
    [factory.createModifier(ts.SyntaxKind.DeclareKeyword)],
    factory.createIdentifier(name),
    factory.createModuleBlock(nodes),
    ts.NodeFlags.Namespace,
  )
  const statements = [
    namespace(definitionName, definitions),
    factory.createVariableStatement([factory.createModifier(ts.SyntaxKind.DeclareKeyword)], factory.createVariableDeclarationList([
      factory.createVariableDeclaration(globalName, undefined, factory.createTypeQueryNode(qualified(defaultName))),
    ], ts.NodeFlags.Const)),
    factory.createTypeAliasDeclaration(undefined, globalName, undefined, factory.createTypeReferenceNode(qualified(defaultName))),
    namespace(globalName, aliases),
    factory.createExportAssignment(undefined, true, factory.createIdentifier(globalName)),
    factory.createNamespaceExportDeclaration(factory.createIdentifier(globalName)),
  ]
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  return `// Generated from packages/artplayer/public/artplayer.ts by yarn build:ts. Do not edit.\n/* eslint-disable ts/no-redeclare, ts/no-namespace -- UMD constructor and named types share the global export. */\n${printer.printFile(factory.updateSourceFile(source, statements))}`
}

export function generateCoreEditorDeclaration() {
  const require = createRequire(import.meta.url)
  const bundlerRequire = createRequire(require.resolve('dts-bundle-generator'))
  assert.equal(bundlerRequire('typescript'), ts, 'Editor bundler must use the pinned workspace compiler')
  const [code] = generateDtsBundle([{
    filePath: path.join(root, 'packages/artplayer/public/artplayer.ts'),
    output: { exportReferencedTypes: false, noBanner: true },
  }], { preferredConfigPath: path.join(root, 'scripts/tsconfig.editor.json') })
  const declaration = asGlobalDeclaration(code, 'Artplayer')
  for (const compiler of [ts, compat])
    assert.deepEqual(checkCoreEditorDeclaration(declaration, compiler), [], `Invalid editor declaration: TS ${compiler.version}`)
  return declaration
}

export function checkCoreEditorDeclaration(code, compiler = ts) {
  const folder = path.join(root, 'refactor/.cache/editor-semantic')
  const declaration = path.join(folder, 'artplayer.d.ts')
  const sources = new Map([
    [declaration, code],
    [path.join(folder, 'global.ts'), `
const option: Artplayer.OptionInput = { container: '#player' }
const player: Artplayer = new Artplayer(option, function (art) {
  const same: Artplayer = this
  const other: Artplayer = art
  void [same, other]
})
const factory: Artplayer.PluginFactory<Artplayer, { name: string }> = function (art) {
  return { name: String(art.id + this.id) }
}
const plugins: Promise<Artplayer.Plugins> = player.plugins.add(factory)
const emitter: Artplayer.Emitter<{ value: [number] }> = new Artplayer.Emitter()
emitter.on('value', count => count.toFixed()).emit('value', 2)
const language: NonNullable<Artplayer.I18n['en']> = { Play: 'Play' }
const configuration: Artplayer.Config = Artplayer.config
// @ts-expect-error Private flattened definitions must not leak into the editor global scope.
const leaked: ArtplayerDefinitions.Config = Artplayer.config
// @ts-expect-error Required container is not optional.
new Artplayer({ url: '' })
// @ts-expect-error Named aliases must not degrade to any through circular definitions.
const invalidOption: Artplayer.Option = { container: 123, url: '' }
// @ts-expect-error Plugin callback results retain the selected result type.
const invalidFactory: Artplayer.PluginFactory<Artplayer, number> = () => 'bad'
// @ts-expect-error Generic event payloads stay checked.
emitter.emit('value', 'bad')
void [plugins, language, configuration, invalidOption, invalidFactory, leaked]
`],
    [path.join(folder, 'module.ts'), `
import Player = require('./artplayer')
const player: Player = new Player({ container: '#player' })
const option: Player.OptionInput = { container: '#player' }
// @ts-expect-error The UMD export is the constructor, not a default wrapper object.
Player.default
void [player, option]
`],
  ])
  const options = { strict: true, noEmit: true, skipLibCheck: false, types: [], target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'], module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs }
  const host = compiler.createCompilerHost(options)
  const getSourceFile = host.getSourceFile.bind(host)
  const exists = host.fileExists.bind(host)
  const directoryExists = host.directoryExists.bind(host)
  host.fileExists = file => sources.has(path.resolve(file)) || exists(file)
  host.directoryExists = directory => path.resolve(directory) === folder || directoryExists(directory)
  host.getSourceFile = (file, version, onError, create) => sources.has(path.resolve(file))
    ? compiler.createSourceFile(file, sources.get(path.resolve(file)), version, true)
    : getSourceFile(file, version, onError, create)
  const program = compiler.createProgram([...sources.keys()], options, host)
  for (const file of program.getSourceFiles())
    assert(sources.has(path.resolve(file.fileName)) || program.isSourceFileDefaultLibrary(file), `Editor types escaped the standalone bundle: ${file.fileName}`)
  return compiler.getPreEmitDiagnostics(program).map(diagnostic => ({ code: diagnostic.code, message: compiler.flattenDiagnosticMessageText(diagnostic.messageText, '\n') }))
}

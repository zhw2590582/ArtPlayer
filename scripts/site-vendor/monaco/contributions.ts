import assert from 'node:assert/strict'
import ts from 'typescript'
import { moduleIds } from './languages.ts'

export interface Contribution { name: string, contrib: string, modulePrefix: string }

// Read the fixed metadata without running its browser/CommonJS wrapper.
export function readContributionMetadata(source: string): Contribution[] {
  const ast = ts.createSourceFile('metadata.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const declarations: ts.VariableDeclaration[] = []
  const visit = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'METADATA')
      declarations.push(node)
    ts.forEachChild(node, visit)
  }
  visit(ast)
  assert.equal(declarations.length, 1, 'Expected one METADATA declaration')
  function property(object: ts.Node | undefined, key: string): ts.Expression {
    assert(object && ts.isObjectLiteralExpression(object), 'Expected metadata object')
    const values = object.properties.filter(item => ts.isPropertyAssignment(item) && (ts.isIdentifier(item.name) || ts.isStringLiteral(item.name)) && item.name.text === key)
    assert.equal(values.length, 1, `Expected one metadata property: ${key}`)
    return (values[0] as ts.PropertyAssignment).initializer
  }
  function literal(object: ts.Node, key: string): string {
    const value = property(object, key)
    assert(ts.isStringLiteral(value), 'Expected literal metadata value')
    return value.text
  }
  const plugins = property(declarations[0]!.initializer, 'PLUGINS')
  assert(ts.isArrayLiteralExpression(plugins), 'Expected plugin array')
  const result = plugins.elements.map((plugin) => {
    const name = literal(plugin, 'name')
    const contrib = literal(plugin, 'contrib')
    const modulePrefix = literal(plugin, 'modulePrefix')
    assert.equal(literal(plugin, 'rootPath'), `./${name}`)
    assert.equal(contrib, `${modulePrefix}/monaco.contribution`)
    for (const type of ['dev', 'min'])
      assert.equal(literal(property(plugin, 'paths'), type), `./release/${type}`)
    return { name, contrib, modulePrefix }
  })
  assert.deepEqual(result.map(item => item.name), ['monaco-typescript', 'monaco-css', 'monaco-json', 'monaco-html', 'monaco-languages'], 'Contribution order changed')
  assert.deepEqual(result.map(item => item.modulePrefix), ['vs/language/typescript', 'vs/language/css', 'vs/language/json', 'vs/language/html', 'vs/basic-languages'], 'Contribution prefix changed')
  return result
}

// The upstream release injects this dependency AFTER per-plugin minification.
export function injectCoreDependency(source: string, prefix: string): string {
  const pattern = /define\((['"][a-z/\-]+\/fillers\/monaco-editor-core['"]),\[\],/g
  const matches = [...source.matchAll(pattern)]
  assert.equal(matches.length, 1, 'Expected one empty core filler dependency')
  assert.equal(matches[0]![1]!.slice(1, -1), `${prefix}/fillers/monaco-editor-core`, 'Wrong core filler')
  return source.replace(pattern, 'define($1,[\'vs/editor/editor.api\'],')
}

export function assembleContributions(core: string, groups: (Contribution & { source: string })[]): string {
  assert.deepEqual(groups.map(item => item.modulePrefix), ['vs/language/typescript', 'vs/language/css', 'vs/language/json', 'vs/language/html', 'vs/basic-languages'], 'Contribution order changed')
  const entry = '"vs/editor/editor.main"'
  assert.equal(core.split(entry).length, 2, 'Expected unique quoted core entry')
  // Core contains nested UMD calls and addresses AMD names through a string table.
  // Verify the entry's actual define() use, not merely a matching literal string.
  let entries = 0
  const tables = new Map<string, number>()
  const ast = ts.createSourceFile('core.js', core, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const findTables = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      const index = node.initializer.elements.findIndex(item => ts.isStringLiteral(item) && item.text === 'vs/editor/editor.main')
      if (index >= 0) {
        assert(node.initializer.elements.every(item => ts.isStringLiteral(item)), 'Expected literal core module table')
        tables.set(node.name.text, index)
      }
    }
    ts.forEachChild(node, findTables)
  }
  findTables(ast)
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'define') {
      const name = node.arguments[0]
      if (name && ts.isStringLiteral(name) && name.text === 'vs/editor/editor.main')
        entries++
      if (name && ts.isElementAccessExpression(name) && ts.isIdentifier(name.expression) && ts.isNumericLiteral(name.argumentExpression)
        && tables.get(name.expression.text) === Number(name.argumentExpression.text)) { entries++ }
    }
    ts.forEachChild(node, visit)
  }
  visit(ast)
  assert.equal(entries, 1, 'Missing core AMD entry')
  core = core.replace(entry, '"vs/editor/edcore.main"')
  const extra = groups.map((group) => {
    assert.equal(group.contrib, `${group.modulePrefix}/monaco.contribution`, 'Wrong contribution entry')
    const ids = moduleIds(group.source)
    assert(ids.includes(group.contrib) && ids.every(id => id.startsWith(`${group.modulePrefix}/`)), 'Wrong contribution ownership')
    return injectCoreDependency(group.source, group.modulePrefix)
  })
  extra.push(`define("vs/editor/editor.main", ["vs/editor/edcore.main","${groups.map(group => group.contrib).join('","')}"], function(api) { return api; });`)
  const map = core.lastIndexOf('//# sourceMappingURL=')
  const offset = map === -1 ? core.length : map
  return `${core.slice(0, offset)}\n${extra.join('\n')}\n${core.slice(offset)}`
}

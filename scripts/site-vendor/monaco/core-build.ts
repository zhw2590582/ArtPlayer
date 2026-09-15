import assert from 'node:assert/strict'
import path from 'node:path'
import ts from 'typescript'
import { hash } from './archives.ts'

export interface CoreSourceMap { sources: string[], sourcesContent: string[] }

export function inventoryCoreMap(map: CoreSourceMap): { source: string, bytes: number, sha256: string }[] {
  assert.equal(map.sources.length, map.sourcesContent.length, 'Missing mapped source content')
  assert.equal(new Set(map.sources).size, map.sources.length, 'Repeated mapped source name')
  return map.sources.map((source, index) => {
    const content = map.sourcesContent[index]
    assert(typeof content === 'string', 'Missing mapped source text')
    const bytes = new TextEncoder().encode(content)
    return { source, bytes: bytes.length, sha256: hash(bytes) }
  })
}

export function restoreCoreMapComment(minified: string, relative: string): string {
  assert(/^vs\/[\w./-]+\.js$/.test(relative) && !relative.split('/').includes('..'), 'Invalid core output path')
  assert(minified.endsWith('\n'), 'Expected esbuild output newline')
  const url = path.posix.relative(path.posix.dirname(`min/${relative}`), `min-maps/${relative}.map`)
  return `${minified}\n//# sourceMappingURL=${url}`
}

export function readCoreNls(source: string): { id: string, messages: Record<string, string[]> } {
  const file = ts.createSourceFile('nls.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  assert.equal(file.statements.length, 1, 'Expected one NLS registration')
  const statement = file.statements[0]!
  assert(ts.isExpressionStatement(statement) && ts.isCallExpression(statement.expression), 'Expected literal NLS call')
  const call = statement.expression
  assert(ts.isIdentifier(call.expression) && call.expression.text === 'define' && call.arguments.length === 2, 'Expected AMD NLS definition')
  const name = call.arguments[0]!
  assert(ts.isStringLiteral(name), 'Expected NLS module name')
  const data = call.arguments[1]!
  assert(ts.isObjectLiteralExpression(data), 'Expected literal translation object')
  const entries = data.properties.map((property) => {
    assert(ts.isPropertyAssignment(property) && ts.isStringLiteral(property.name) && ts.isArrayLiteralExpression(property.initializer), 'Expected literal translation arrays')
    return [property.name.text, property.initializer.elements.map((item) => {
      assert(ts.isStringLiteral(item), 'Expected literal translation text')
      return item.text
    })] as const
  })
  assert.equal(new Set(entries.map(([name]) => name)).size, entries.length, 'Repeated translation module')
  const messages = Object.fromEntries(entries)
  return { id: name.text, messages }
}

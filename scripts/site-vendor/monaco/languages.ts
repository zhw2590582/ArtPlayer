import assert from 'node:assert/strict'
import ts from 'typescript'

function definitions(source: string): ts.CallExpression[] {
  const ast = ts.createSourceFile('worker.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const result: ts.CallExpression[] = []
  const walk = (node: ts.Node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'define')
      result.push(node)
    ts.forEachChild(node, walk)
  }
  walk(ast)
  return result
}

export function moduleIds(source: string): string[] {
  const ids = definitions(source).map((call) => {
    assert(call.arguments[0] && ts.isStringLiteral(call.arguments[0]), 'Expected literal AMD name')
    return call.arguments[0].text
  })
  assert.equal(new Set(ids).size, ids.length, 'Duplicate AMD module')
  return ids
}

// RequireJS names one anonymous AMD definition and removes newline-ended maps.
// Locate the call syntactically so comments/strings containing define( are inert.
export function nameModule(source: string, id: string): string {
  assert(/^[\w./-]+$/.test(id) && id.split('/').every(part => part !== '.' && part !== '..'), 'Unexpected AMD identifier')
  const calls = definitions(source)
  assert.equal(calls.length, 1, 'Expected one anonymous AMD definition')
  const call = calls[0]!
  assert(call.arguments[0] && ts.isArrayLiteralExpression(call.arguments[0]), 'Expected anonymous AMD dependency array')
  const offset = call.expression.end
  assert.equal(source[offset], '(', 'Unexpected AMD opening boundary')
  const map = /^\/\/# sourceMappingURL=[^\r\n]+(?:\r?\n)?$/gm
  const maps = [...source.matchAll(map)]
  assert(maps.length <= 1, 'Duplicate source map trailer')
  source = `${source.slice(0, offset + 1)}'${id}',${source.slice(offset + 1)}`
  // types/main and uri/index have no final newline. The archived optimizer kept
  // their map comment and appended a semicolon; account for those bytes too.
  if (maps[0] && !maps[0][0].endsWith('\n'))
    return `${source};`
  return source.replace(map, '').trimEnd()
}

export function aliasModule(id: string, main: string): string {
  assert(/^[\w-]+$/.test(id) && /^[\w/-]+$/.test(main), 'Unexpected AMD alias')
  return `define('${id}', ['${id}/${main}'], function (main) { return main; });`
}

// Check whole source fragments, their module ownership and every intervening byte.
// A module inventory alone would overlook helper code outside define() calls.
export function verifyWorkerSources(worker: string, ids: string[], fragments: { id: string, source: string }[]): void {
  assert.deepEqual(moduleIds(worker), ids, 'Worker AMD inventory changed')
  assert.deepEqual(fragments.map(item => item.id).sort(), [...ids].sort(), 'Incomplete source coverage')
  const intervals = fragments.map(({ id, source }) => {
    assert.deepEqual(moduleIds(source), [id], 'Wrong source module ownership')
    const start = worker.indexOf(source)
    assert(start >= 0, `Source differs: ${id}`)
    assert.equal(worker.indexOf(source, start + 1), -1, `Repeated source: ${id}`)
    return { start, end: start + source.length }
  }).sort((a, b) => a.start - b.start)
  let end = 0
  for (const interval of intervals) {
    assert(interval.start >= end, 'Overlapping source fragments')
    assert.equal(worker.slice(end, interval.start).trim(), '', 'Unattributed worker content')
    end = interval.end
  }
  assert.equal(worker.slice(end).trim(), '', 'Unattributed worker suffix')
}

export function languageHeader(language: string): string {
  assert(['css', 'html', 'json', 'typescript'].includes(language), 'Unexpected Monaco language')
  return `/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * monaco-${language} version: 0.30.1(5a7ba61be909ae9e4889768a3453ebb0dec392e2)
 * Released under the MIT license
 * https://github.com/Microsoft/monaco-${language}/blob/master/LICENSE.md
 *-----------------------------------------------------------------------------*/
`
}

import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { build } from 'esbuild'
import ts from 'typescript'

export const upstreamSha256 = 'e00bbf82bf08c452825690372ded39a9b60f4baf438f0e7ce8300e9bc4629c03'
export const obsoleteMap = '//# sourceMappingURL=/index.js.map'

export function moduleRanges(code: string) {
  const source = ts.createSourceFile('console.js', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const ranges = new Map<string, { start: number, end: number }>()
  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node) && ts.isStringLiteral(node.name) && ['W5CS', 'Focm'].includes(node.name.text)) {
      assert(ts.isArrayLiteralExpression(node.initializer))
      const fn = node.initializer.elements[0]
      assert(fn && ts.isFunctionExpression(fn))
      assert(!ranges.has(node.name.text), 'Duplicate owned console module')
      ranges.set(node.name.text, { start: fn.body.getStart(source) + 1, end: fn.body.end - 1 })
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  assert.equal(ranges.size, 2, 'Missing owned console modules')
  return ranges
}

export async function generateConsole(root: string) {
  const upstream = fs.readFileSync(path.join(root, 'refactor/baselines/site-vendor/console-original.js'), 'utf8')
  assert.equal(createHash('sha256').update(upstream).digest('hex'), upstreamSha256, 'Frozen console source changed')
  const ranges = moduleRanges(upstream)
  const bodies = new Map<string, string>()
  for (const [id, entry] of [['W5CS', 'view'], ['Focm', 'entry']] as const) {
    const result = await build({ entryPoints: [path.join(root, `scripts/site-vendor/console/runtime/${entry}.ts`)], bundle: true, write: false, platform: 'browser', format: 'iife', globalName: '__consoleOwned', target: 'es2015', minify: true, legalComments: 'none', logLevel: 'silent' })
    const compiled = result.outputFiles[0]?.text
    assert(compiled)
    const expression = id === 'W5CS'
      ? '__consoleOwned.createView(require("react"),require("console-feed"),require("styled-components").default,require("RxPG").default,require("V2JG").default)'
      : '__consoleOwned.install(require("react"),require("react-dom"),require("./Console").default,window)'
    bodies.set(id, `\n"use strict";${compiled}Object.defineProperty(exports,"__esModule",{value:true});exports.default=${expression};\n`)
  }
  let output = upstream
  for (const [id, range] of [...ranges].sort((a, b) => b[1].start - a[1].start))
    output = output.slice(0, range.start) + bodies.get(id) + output.slice(range.end)
  assert(output.endsWith(obsoleteMap), 'Unexpected original console source map trailer')
  return output.slice(0, -obsoleteMap.length)
}

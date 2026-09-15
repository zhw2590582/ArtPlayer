import assert from 'node:assert/strict'

// Fixed Monaco 0.30.1 importTypescript.js adaptations, followed by RequireJS's
// removal of the top-level strict directive. Never apply to arbitrary versions.
export function browserTypeScript(source: string): string {
  const replacements: [RegExp, string][] = [
    [/\n {4}ts\.sys =([\s\S]*)\n {4}\}\)\(\);/, '\n    // MONACOCHANGE\n    ts.sys = undefined;\n    // END MONACOCHANGE'],
    [/^( +)etwModule = require\(.*$/m, '$1// MONACOCHANGE\n$1etwModule = undefined;\n$1// END MONACOCHANGE'],
    [/^( +)var result = ts\.sys\.require\(.*$/m, '$1// MONACOCHANGE\n$1var result = undefined;\n$1// END MONACOCHANGE'],
    [/^( +)fs = require\("fs"\);$/m, '$1// MONACOCHANGE\n$1fs = undefined;\n$1// END MONACOCHANGE'],
    [/^( +)debugger;$/m, '$1// MONACOCHANGE\n$1// debugger;\n$1// END MONACOCHANGE'],
    [/= require\("perf_hooks"\)/, '/* MONACOCHANGE */= {}/* END MONACOCHANGE */'],
  ]
  for (const [pattern, replacement] of replacements) {
    assert.equal([...source.matchAll(new RegExp(pattern.source, `${pattern.flags}g`))].length, 1, 'Unexpected TypeScript adaptation boundary')
    source = source.replace(pattern, replacement)
  }
  const map = /\/\/# sourceMappingURL[^\n]+/g
  assert.equal([...source.matchAll(map)].length, 1, 'Unexpected TypeScript source map boundary')
  const strict = /^"use strict";$/gm
  assert.equal([...source.matchAll(strict)].length, 1, 'Unexpected TypeScript strict directive')
  return source.replace(map, '').replace(strict, '')
}

export function verifyTypeScriptSource(source: string, worker: string): number {
  const adapted = browserTypeScript(source)
  const offset = worker.indexOf(adapted)
  assert.equal(offset, 98, 'Adapted TypeScript differs from the archived worker')
  assert.equal(worker.indexOf(adapted, offset + 1), -1, 'Duplicate TypeScript source in worker')
  return adapted.length
}

export const workerHeader = `/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * monaco-typescript version: 0.30.1(5a7ba61be909ae9e4889768a3453ebb0dec392e2)
 * Released under the MIT license
 * https://github.com/Microsoft/monaco-typescript/blob/master/LICENSE.md
 *-----------------------------------------------------------------------------*/
`

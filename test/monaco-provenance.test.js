import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Verify fixed source transforms without executing archived runtime.
import test from 'node:test'
import { browserTypeScript, verifyTypeScriptSource } from '../scripts/site-vendor/monaco/typescript.ts'

const source = `"use strict";
    ts.sys = (function () {
        return 1;
    })();
    etwModule = require("etw");
    var result = ts.sys.require("other");
    fs = require("fs");
    debugger;
    var hooks = require("perf_hooks");
//# sourceMappingURL=typescriptServices.js.map
`

test('Monaco TypeScript adaptations reject missing or duplicate historical boundaries', () => {
  const output = browserTypeScript(source)
  assert.match(output, /ts.sys = undefined/)
  assert(!output.includes('require('))
  assert(!output.includes('sourceMappingURL'))
  assert(!output.includes('"use strict"'))
  const emittedDirective = `const emitted = '\"use strict\";';\n`
  assert(browserTypeScript(source + emittedDirective).includes(emittedDirective))
  assert.throws(() => browserTypeScript(source.replace('    fs = require("fs");', '    fs = {}')), /adaptation boundary/)
  assert.throws(() => browserTypeScript(`${source}\n    fs = require("fs");`), /adaptation boundary/)
  assert.throws(() => browserTypeScript(source.replace('//# sourceMappingURL=', '// removed=')), /source map boundary/)
  assert.throws(() => browserTypeScript(`${source}\n"use strict";`), /strict directive/)
})

test('Monaco TypeScript proof rejects modified or repeated worker content', () => {
  const output = browserTypeScript(source)
  const worker = `${' '.repeat(98)}${output}\nnextModule()`
  assert.equal(verifyTypeScriptSource(source, worker), output.length)
  assert.throws(() => verifyTypeScriptSource(source, worker.replace('etwModule = undefined', 'etwModule = {}')), /differs/)
  assert.throws(() => verifyTypeScriptSource(source, worker + output), /Duplicate/)
  assert.throws(() => verifyTypeScriptSource(source, worker.slice(1)), /differs/)
})

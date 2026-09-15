import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Verify fixed source transforms without executing archived runtime.
import test from 'node:test'
import ts from 'typescript'
import { extractBasicFixtures } from '../scripts/site-vendor/monaco/basic-fixtures.ts'
import { emitAmd } from '../scripts/site-vendor/monaco/compiler.ts'
import { aliasModule, moduleIds, nameModule, verifyWorkerSources } from '../scripts/site-vendor/monaco/languages.ts'
import { browserTypeScript, verifyTypeScriptSource } from '../scripts/site-vendor/monaco/typescript.ts'

test('Monaco fixture extraction retains generated cases and preprocessing but rejects extra imports', () => {
  const file = 'monaco-languages/src/scss/scss.test.ts'
  const source = `import { testTokenization } from '../test/testRunner';
    const cases = ['a\\nb', 'c'].map(line => [{ line: line.replace(/\\n/g, ' '), tokens: [{ startIndex: 0, type: 'text' }] }]);
    testTokenization(['scss', 'css'], cases);`
  const [fixture] = extractBasicFixtures(ts, [file], () => source)
  assert.deepEqual(fixture.languages, ['scss', 'css'])
  assert.deepEqual(fixture.cases.map(item => item[0].line), ['a b', 'c'])
  assert.throws(() => extractBasicFixtures(ts, [file], () => 'import fs from "node:fs"; fs.readFileSync("x");'), /Unexpected test import/)
})

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

test('Monaco AMD naming ignores strings and preserves source bodies', () => {
  const anonymous = '// define(fake)\nconst example = "define(fake)";\ndefine(["exports"], function (exports) { exports.value = 1; });\n//# sourceMappingURL=source.js.map\n'
  const named = nameModule(anonymous, 'library/main')
  assert(named.includes('const example = "define(fake)";'))
  assert(named.includes('define(\'library/main\',["exports"]'))
  assert(!named.includes('sourceMappingURL'))
  assert.deepEqual(moduleIds(named), ['library/main'])
  assert.deepEqual(moduleIds(nameModule(anonymous, 'library/lib.index')), ['library/lib.index'])
  assert.throws(() => nameModule(anonymous, '../library'), /identifier/)
  assert(nameModule(anonymous.trimEnd(), 'library/main').endsWith('//# sourceMappingURL=source.js.map;'))
  assert.throws(() => nameModule(named, 'library/main'), /anonymous AMD dependency array/)
  assert.throws(() => nameModule(anonymous + anonymous, 'library/main'), /one anonymous/)
  assert.throws(() => nameModule(anonymous, 'library/\'main'), /identifier/)
  assert.throws(() => nameModule(`${anonymous}//# sourceMappingURL=second.map\n`, 'library/main'), /Duplicate source map/)
})

test('Monaco mode emission resolves const enums only from explicit declaration inputs', () => {
  const source = 'import { ScanError } from "pinned-json"; export const code = ScanError.End;'
  const declarations = [{ name: 'pinned-json', source: 'export declare const enum ScanError { End = 2 }' }]
  const compiled = emitAmd(ts, source, ['es5'], true, declarations)
  assert.match(compiled, /exports.code = 2/)
  const wrong = emitAmd(ts, source, ['es5'], true, [{ ...declarations[0], source: declarations[0].source.replace('2', '3') }])
  const fragment = nameModule(compiled, 'mode')
  assert.throws(() => verifyWorkerSources(nameModule(wrong, 'mode'), ['mode'], [{ id: 'mode', source: fragment }]), /Source differs/)
  assert(!emitAmd(ts, source, ['es5'], true).includes('exports.code = 2'))
})

test('Monaco worker proof covers helper code, aliases and all module boundaries', () => {
  const id = 'library/main'
  const source = nameModule('const helper = 1;\ndefine(["exports"], function (exports) { exports.value = helper; });', id)
  const alias = aliasModule('library', 'main')
  const worker = `${source}\n\n${alias}\n`
  const fragments = [{ id, source }, { id: 'library', source: alias }]
  const ids = [id, 'library']
  verifyWorkerSources(worker, ids, fragments)
  assert.throws(() => verifyWorkerSources(worker.replace('helper = 1', 'helper = 2'), ids, fragments), /Source differs/)
  assert.throws(() => verifyWorkerSources(`globalThis.hidden = true;\n${worker}`, ids, fragments), /Unattributed worker content/)
  assert.throws(() => verifyWorkerSources(`${worker}globalThis.hidden = true;`, ids, fragments), /Unattributed worker suffix/)
  assert.throws(() => verifyWorkerSources(worker, ids, fragments.slice(0, 1)), /Incomplete source coverage/)
  assert.throws(() => verifyWorkerSources(worker, ids, [{ id, source: alias }, fragments[1]]), /ownership/)
  assert.throws(() => verifyWorkerSources(worker.replace('[\'library/main\']', '[\'library/other\']'), ids, fragments), /Source differs/)
  assert.throws(() => verifyWorkerSources(worker + alias, ids, fragments), /Duplicate AMD/)
  assert.throws(() => verifyWorkerSources(`${worker}define('extra', [], function () {});`, ids, fragments), /inventory changed/)
  assert.throws(() => moduleIds('define(dynamicName, [], function () {});'), /literal AMD name/)
})

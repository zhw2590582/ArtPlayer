import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Verify fixed source transforms without executing archived runtime.
import test from 'node:test'
import ts from 'typescript'
import { extractBasicFixtures } from '../scripts/site-vendor/monaco/basic-fixtures.ts'
import { emitAmd } from '../scripts/site-vendor/monaco/compiler.ts'
import { assembleContributions, injectCoreDependency, readContributionMetadata } from '../scripts/site-vendor/monaco/contributions.ts'
import { inventoryCoreMap, readCoreNls, restoreCoreMapComment } from '../scripts/site-vendor/monaco/core-build.ts'
import { adaptCoreOrigin } from '../scripts/site-vendor/monaco/core-origins.ts'
import { aliasModule, moduleIds, nameModule, verifyWorkerSources } from '../scripts/site-vendor/monaco/languages.ts'
import { browserTypeScript, verifyTypeScriptSource } from '../scripts/site-vendor/monaco/typescript.ts'

const contributionGroups = ['typescript', 'css', 'json', 'html', 'languages'].map((name) => {
  const modulePrefix = name === 'languages' ? 'vs/basic-languages' : `vs/language/${name}`
  return { name: `monaco-${name}`, modulePrefix, contrib: `${modulePrefix}/monaco.contribution` }
})

test('Contribution metadata preserves upstream ordering and rejects computed or duplicate values', () => {
  const plugins = contributionGroups.map(group => ({ ...group, rootPath: `./${group.name}`, paths: { dev: './release/dev', min: './release/min' } }))
  const metadata = list => `var METADATA = ${JSON.stringify({ PLUGINS: list })};`
  assert.deepEqual(readContributionMetadata(metadata(plugins)), contributionGroups)
  assert.throws(() => readContributionMetadata(metadata([...plugins].reverse())), /order changed/)
  assert.throws(() => readContributionMetadata(metadata(plugins).replace('"monaco-css"', 'getName()')), /literal metadata/)
  assert.throws(() => readContributionMetadata(metadata(plugins).replace('"name":"monaco-css"', '"name":"monaco-css","name":"monaco-css"')), /one metadata property/)
})

test('Contribution assembly retains the entry alias, dependency order and exact map boundary', () => {
  const core = 'define("vs/editor/editor.main",[],function(){return {};});\n'
  const map = '//# sourceMappingURL=../../../min-maps/vs/editor/editor.main.js.map'
  const groups = contributionGroups.map(group => ({ ...group, source: `define('${group.modulePrefix}/fillers/monaco-editor-core',[],function(){return self.monaco;});\ndefine('${group.contrib}',[],function(){});` }))
  const output = assembleContributions(core + map, groups)
  assert(output.startsWith(core.replace('editor.main', 'edcore.main')))
  assert(output.endsWith(`function(api) { return api; });\n${map}`))
  assert.deepEqual(moduleIds(output), ['vs/editor/edcore.main', ...groups.flatMap(group => [`${group.modulePrefix}/fillers/monaco-editor-core`, group.contrib]), 'vs/editor/editor.main'])
  assert.equal(output.split('[\'vs/editor/editor.api\']').length, 6)
  assert.equal(assembleContributions(core, groups), output.slice(0, -map.length))
  assert.throws(() => assembleContributions(core + core, groups), /unique quoted core entry/)
  assert.throws(() => assembleContributions('const name = "vs/editor/editor.main";', groups), /Missing core AMD entry/)
  assert(assembleContributions(`define([],function(){});\n${core}`, groups).startsWith('define([],function(){});'))
  const indexed = 'var names = ["other","vs/editor/editor.main"];define(names[1 /* entry */],[],function(){});'
  assert(assembleContributions(indexed, groups).startsWith(indexed.replace('editor.main', 'edcore.main')))
  assert.throws(() => assembleContributions(indexed.replace('names[1', 'names[0'), groups), /Missing core AMD entry/)
  assert.throws(() => assembleContributions(core, groups.slice(1)), /order changed/)
  assert.throws(() => assembleContributions(core, groups.map((group, index) => index ? group : { ...group, source: `${group.source}\ndefine('unrelated',[],function(){});` })), /ownership/)
})

test('Core dependency injection rejects omissions, duplicates and already patched filler modules', () => {
  const prefix = 'vs/basic-languages'
  const source = `define('${prefix}/fillers/monaco-editor-core',[],function(){return self.monaco;});`
  assert.throws(() => injectCoreDependency('', prefix), /one empty core filler/)
  assert.throws(() => injectCoreDependency(source + source, prefix), /one empty core filler/)
  assert.throws(() => injectCoreDependency(source, 'vs/language/css'), /Wrong core filler/)
  assert.throws(() => injectCoreDependency(injectCoreDependency(source, prefix), prefix), /one empty core filler/)
})

test('Core NLS extraction accepts historical trailing commas without evaluating expressions', () => {
  assert.deepEqual(readCoreNls('define("nls", { "find": ["Find", "查找",], });'), { id: 'nls', messages: { find: ['Find', '查找'] } })
  assert.throws(() => readCoreNls('define("nls", { "find": [translate()], });'), /literal translation text/)
  assert.throws(() => readCoreNls('define("nls", { "find": [], "find": [] });'), /Repeated translation/)
  assert.throws(() => readCoreNls('run(); define("nls", {});'), /one NLS registration/)
})

test('Core source inventories and map comments reject incomplete or ambiguous evidence', () => {
  assert.equal(inventoryCoreMap({ sources: ['test'], sourcesContent: ['查找'] })[0].bytes, 6)
  assert.throws(() => inventoryCoreMap({ sources: ['a'], sourcesContent: [] }), /Missing mapped/)
  assert.throws(() => inventoryCoreMap({ sources: ['a', 'a'], sourcesContent: ['', ''] }), /Repeated mapped/)
  assert.equal(restoreCoreMapComment('code;\n', 'vs/loader.js'), 'code;\n\n//# sourceMappingURL=../../min-maps/vs/loader.js.map')
  assert.throws(() => restoreCoreMapComment('code;', 'vs/loader.js'), /newline/)
  assert.throws(() => restoreCoreMapComment('code;\n', 'vs/../outside.js'), /output path/)
})

test('Core origin adaptation rejects duplicate boundaries and preserves replacement bytes', () => {
  const edits = [{ before: 'export default purify;', after: 'define(factory); // $&' }]
  assert.equal(adaptCoreOrigin('export default purify;', edits), 'define(factory); // $&')
  assert.throws(() => adaptCoreOrigin('missing', edits), /boundary/)
  assert.throws(() => adaptCoreOrigin('export default purify;export default purify;', edits), /boundary/)
})

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

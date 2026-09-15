import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Exercise frozen Unicode recipes and source boundaries.
import test from 'node:test'
import { verifyMonacoUnicodeNotices } from '../scripts/site-vendor/monaco/unicode-origins.ts'
import { readUnicodeTables, replayUnicodeGenerator, verifyUnicodeGeneration } from '../scripts/site-vendor/monaco/unicode.ts'

const source = 'const CONTAINS_RTL = /a/; const CONTAINS_EMOJI = /b/; export function isEmojiImprecise(x: number) { return (x === 1); } function getGraphemeBreakRawData() { return JSON.parse("[0,0,0]"); }'
const output = logs => ({ logs, writes: new Map() })
const rtl = output(['------', 'a', '------'])
const emoji = output(['very imprecise test :: x === 1', '------', 'b', '------'])
const tree = output(['[0,0,0]'])

test('Unicode extraction identifies exact top-level declarations and literal data', () => {
  const tables = readUnicodeTables(source)
  assert.deepEqual(tables, { rtl: 'a', emoji: 'b', imprecise: 'x === 1', grapheme: [0, 0, 0] })
  assert.deepEqual(readUnicodeTables(`${source}\nconst text = 'CONTAINS_RTL = /wrong/;';`), tables)
  assert.deepEqual(readUnicodeTables(source.replace('x === 1', 'x\n /* trivia */ === 1')), tables)
  assert.throws(() => readUnicodeTables(`${source} const CONTAINS_RTL = /c/;`), /repeated Unicode/)
  assert.throws(() => readUnicodeTables(source.replace('const CONTAINS_RTL = /a/;', '')), /Missing Unicode/)
  assert.throws(() => readUnicodeTables(source.replace('/a/', 'getRegex()')), /regex literal/)
  assert.throws(() => readUnicodeTables(source.replace('/a/', '/a/g')), /regex flags/)
  assert.throws(() => readUnicodeTables(source.replace('JSON.parse("[0,0,0]")', 'getTree()')), /literal Unicode tree/)
  assert.throws(() => readUnicodeTables(source.replace('[0,0,0]', '[0,0]')), /tree integers/)
  assert.throws(() => readUnicodeTables(source.replace('[0,0,0]', '[0,-1,0]')), /tree integers/)
})

test('Unicode comparison rejects dataset substitutions and incomplete generator output', () => {
  const tables = readUnicodeTables(source)
  verifyUnicodeGeneration(tables, rtl, emoji, tree)
  assert.throws(() => verifyUnicodeGeneration({ ...tables, rtl: 'c' }, rtl, emoji, tree), /RTL differs/)
  assert.throws(() => verifyUnicodeGeneration({ ...tables, emoji: 'c' }, rtl, emoji, tree), /emoji differs/)
  assert.throws(() => verifyUnicodeGeneration({ ...tables, imprecise: 'x === 2' }, rtl, emoji, tree), /imprecise emoji differs/)
  assert.throws(() => verifyUnicodeGeneration(tables, rtl, emoji, output(['[0,1,0]'])), /grapheme tree differs/)
  assert.throws(() => verifyUnicodeGeneration(tables, output(['a']), emoji, tree), /regex delimiters/)
  assert.throws(() => verifyUnicodeGeneration(tables, rtl, output(['------', 'b', '------']), tree), /imprecise emoji expression/)
})

test('Unicode recipes only read declared inputs and capture declared writes without filesystem output', () => {
  const inputs = new Map([['./data.txt', Buffer.from('frozen')]])
  const recipe = 'const fs = require("fs"); fs.writeFileSync("out.txt", fs.readFileSync("./data.txt").toString("utf8")); console.log("result");'
  const actual = replayUnicodeGenerator(recipe, inputs, ['out.txt'], {})
  assert.deepEqual(actual, { logs: ['result'], writes: new Map([['out.txt', 'frozen']]) })
  assert.throws(() => replayUnicodeGenerator(recipe.replace('./data.txt', '../outside'), inputs, ['out.txt'], {}), /Unexpected Unicode input/)
  assert.throws(() => replayUnicodeGenerator(recipe.replace('out.txt', '../outside'), inputs, ['out.txt'], {}), /Unexpected or repeated Unicode output/)
  assert.throws(() => replayUnicodeGenerator('require("node:fs")', new Map(), [], {}), /Unexpected Unicode import/)
  assert.throws(() => replayUnicodeGenerator('', inputs, [], {}), /Unused Unicode input/)
  assert.throws(() => replayUnicodeGenerator('', new Map(), ['out.txt'], {}), /Missing Unicode output/)
  assert.throws(() => replayUnicodeGenerator('require("fs").writeFileSync("out.txt", "a"); require("fs").writeFileSync("out.txt", "b");', new Map(), ['out.txt'], {}), /repeated Unicode output/)
})

test('Unicode notices bind complete data terms and attribution to editor and worker', () => {
  const manifest = JSON.parse(fs.readFileSync('scripts/site-vendor/manifest.json', 'utf8'))
  verifyMonacoUnicodeNotices(process.cwd(), manifest)
  const group = manifest.groups.find(item => item.name === 'monaco-editor')
  const component = group.components.find(item => item.name === 'Unicode data (Monaco core)')
  component.assets.pop()
  assert.throws(() => verifyMonacoUnicodeNotices(process.cwd(), manifest), /notice binding/)
  component.assets.push('docs/assets/js/vs/base/worker/workerMain.js')
  group.notices = group.notices.filter(item => !item.target.endsWith('core-unicode/LICENSE.txt'))
  assert.throws(() => verifyMonacoUnicodeNotices(process.cwd(), manifest), /Missing Monaco Unicode notice/)
})

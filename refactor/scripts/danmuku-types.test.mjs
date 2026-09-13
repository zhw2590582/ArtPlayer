import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Public declaration compatibility uses Node.
import test from 'node:test'
import ts from 'typescript'
import compat from 'typescript-compat'
import { generateCoreEditorDeclaration } from '../../scripts/editor-types.mjs'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { ensureArchive, readMember } from './releases.mjs'

const modes = [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]
const read = file => fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n')
const declaration = 'packages/artplayer-plugin-danmuku/types/artplayer-plugin-danmuku.d.ts'

test('Danmuku root declaration retains the exact latest npm 5.3.0 type source', async () => {
  const { release } = JSON.parse(read('refactor/baselines/danmuku-release.json'))
  const archive = await ensureArchive(release)
  assert.equal(read(declaration), readMember(archive, 'package/types/artplayer-plugin-danmuku.d.ts').toString().replaceAll('\r\n', '\n'))
})

test('Danmuku root and runtime consumers retain extraction, ownership and meaningful negative checks', () => {
  for (const [compiler, mode] of modes) {
    for (const fixture of ['danmuku-root', 'danmuku-runtime']) {
      let source = read(`test/types/${fixture}.ts`)
      if (fixture === 'danmuku-root' && mode === 'nodenext-esm') {
        source = source.replace('import danmuku from \'artplayer-plugin-danmuku\'', 'import danmukuModule from \'artplayer-plugin-danmuku\'\nconst danmuku = danmukuModule.default')
          .replace('import legacy from \'artplayer-plugin-danmuku/legacy\'', 'import legacyModule from \'artplayer-plugin-danmuku/legacy\'\nconst legacy = legacyModule.default')
      }
      assert.deepEqual(checkConsumer(compiler, mode, source), [], `${fixture}: ${compiler.version}/${mode}`)
      const expected = []
      let line = 1
      for (const text of source.split('\n')) {
        if (/^\s*\/\/ @ts-expect-error/u.test(text))
          expected.push(line)
        else line++
      }
      assert.equal(expected.length, fixture === 'danmuku-root' ? 4 : 14)
      const invalid = checkConsumer(compiler, mode, source.replaceAll(/^[\t ]*\/\/ @ts-expect-error[^\n]*\n/gmu, ''))
      assert.deepEqual(invalid.map(item => item.line).sort((a, b) => a - b), expected, 'Every invalid consumer statement must fail at its own line')
    }
  }
})

test('Danmuku runtime declarations are assignable from the real strict TypeScript implementation', () => {
  const filename = path.resolve('packages/artplayer-plugin-danmuku/tsconfig.json')
  const config = ts.readConfigFile(filename, ts.sys.readFile)
  assert.equal(config.error, undefined)
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(filename))
  const program = ts.createProgram([...parsed.fileNames, path.resolve('refactor/fixtures/implementation/danmuku.ts')], parsed.options)
  assert.deepEqual(ts.getPreEmitDiagnostics(program).map(item => ts.flattenDiagnosticMessageText(item.messageText, '\n')), [])
})

test('Danmuku editor declarations retain the callable global and exported historical names', () => {
  const generated = generatePluginEditorDeclaration(read(declaration), 'artplayerPluginDanmuku')
  const core = generateCoreEditorDeclaration()
  const consumer = `const option: artplayerPluginDanmuku.Option = {danmuku: [], points: [{time: 1, value: 2}]};
const art = new Artplayer({container: '#player', url: '/video.mp4'});
const result: artplayerPluginDanmuku.Result = artplayerPluginDanmuku(option)(art);
const oldReturn: artplayerPluginDanmuku.Result = result.emit({text: 'legacy editor'}); void oldReturn;`
  for (const compiler of [ts, compat])
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [])
})

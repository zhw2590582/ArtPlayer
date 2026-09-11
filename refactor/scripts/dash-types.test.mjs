import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Run exact compiler and editor compatibility contracts.
import test from 'node:test'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

test('DASH public factories preserve root/legacy imports, inferred SDK fields and historical extraction', () => {
  const source = fs.readFileSync('test/types/dash-control.ts', 'utf8')
  for (const [compiler, mode] of [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    const invalid = source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')
    assert.equal(checkConsumer(compiler, mode, invalid).length, 8, 'Every invalid use must remain invalid')
  }
  const commonjs = `import dash = require('artplayer-plugin-dash-control'); import legacy = require('artplayer-plugin-dash-control/legacy');
const option: dash.Option = { quality: { getName: level => String(level.height) } }; dash(option); legacy();`
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', commonjs), [])
})

test('DASH legacy consumer compiles against the actual published declaration and candidate', async () => {
  const { release } = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/dash-control-release.json')))
  const member = 'package/types/artplayer-plugin-dash-control.d.ts'
  const bytes = readMember(await ensureArchive(release), member)
  assert.equal(hash(bytes), release.files[member])
  const source = fs.readFileSync(path.join(refactorDir, 'fixtures/consumers/dash-control-legacy.ts'), 'utf8')
  const directory = fs.mkdtempSync(path.join(refactorDir, '.cache/dash-legacy-types-'))
  try {
    const filename = path.join(directory, 'consumer.ts')
    fs.writeFileSync(path.join(directory, 'legacy.d.ts'), bytes)
    fs.writeFileSync(filename, source.replace('from \'artplayer-plugin-dash-control\'', 'from \'./legacy\''))
    for (const compiler of [ts, compat]) {
      const program = compiler.createProgram([filename], { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] })
      const diagnostics = compiler.getPreEmitDiagnostics(program).map(item => ({ code: item.code, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n') }))
      assert.deepEqual(diagnostics, [], `Published / TS ${compiler.version}`)
      assert(program.getSourceFiles().some(file => path.resolve(file.fileName) === path.join(directory, 'legacy.d.ts')))
      assert.deepEqual(checkConsumer(compiler, 'node10-commonjs', source), [], `Candidate / TS ${compiler.version}`)
    }
  }
  finally {
    const resolved = fs.realpathSync(directory)
    assert.equal(path.dirname(resolved), fs.realpathSync(path.join(refactorDir, '.cache')))
    assert(path.basename(resolved).startsWith('dash-legacy-types-'))
    fs.rmSync(resolved, { recursive: true, force: true })
  }
})

test('DASH editor declarations are reproducible, standalone, precise and compatible with old TS', async () => {
  const source = fs.readFileSync('packages/artplayer-plugin-dash-control/types/artplayer-plugin-dash-control.d.ts', 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginDashControl')
  const file = 'docs/assets/ts/artplayer-plugin-dash-control.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated, 'Run yarn build:ts')
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `
const option: artplayerPluginDashControl.Option = { quality: { getName: level => String(level.height) }, audio: { getName: track => track.lang || String(track.id) } }
const oldQuality: Parameters<typeof artplayerPluginDashControl>[0]['quality'] = { getName: (level: object) => String(level) }
const factory: (art: Artplayer) => artplayerPluginDashControl.Result = artplayerPluginDashControl(option)
artplayerPluginDashControl()
artplayerPluginDashControl(undefined)
// @ts-expect-error A formatter must return a string.
artplayerPluginDashControl({ quality: { getName: level => level.height } })
// @ts-expect-error SDK fields cannot become any.
artplayerPluginDashControl({ audio: { getName: track => track.unknownProperty } })
// @ts-expect-error Private definition namespace must not leak globally.
const hidden: artplayerPluginDashControlDefinitions.Option = {}
void [oldQuality, factory, hidden]
`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [], compiler.version)
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 3)
  }
})

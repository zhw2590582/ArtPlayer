import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Use the repository's built-in baseline runner.
import test from 'node:test'
import { ESLint } from 'eslint'
import ts from 'typescript'
import compat from 'typescript-compat'
import { checkPluginEditorDeclaration, generatePluginEditorDeclaration } from '../../scripts/plugin-editor-types.mjs'
import { checkConsumer } from '../../scripts/typecheck.mjs'
import { ensureArchive, readMember, refactorDir } from './releases.mjs'

test('HLS generated editor types are reproducible, standalone and reject invalid formatter uses', async () => {
  const source = fs.readFileSync(new URL('../../packages/artplayer-plugin-hls-control/types/artplayer-plugin-hls-control.d.ts', import.meta.url), 'utf8')
  const generated = generatePluginEditorDeclaration(source, 'artplayerPluginHlsControl')
  const file = 'docs/assets/ts/artplayer-plugin-hls-control.d.ts'
  const [formatted] = await new ESLint({ fix: true, fixTypes: ['layout'] }).lintText(generated, { filePath: file })
  assert.equal(formatted.errorCount, 0)
  assert.equal(fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), formatted.output || generated, 'Run yarn build:ts')
  const core = fs.readFileSync('docs/assets/ts/artplayer.d.ts', 'utf8')
  const consumer = `
const option: artplayerPluginHlsControl.Option = { quality: { getName: (level, index) => level.height + ':' + index }, audio: { getName: track => track.name } }
const legacyOption: NonNullable<Parameters<typeof artplayerPluginHlsControl>[0]['quality']> = { getName: (value: object) => String(value) }
const plugin: (art: Artplayer) => artplayerPluginHlsControl.Result = artplayerPluginHlsControl(option)
artplayerPluginHlsControl()
artplayerPluginHlsControl(undefined)
artplayerPluginHlsControl({ quality: { getName: (value: { bitrate: number }) => String(value.bitrate) } })
// @ts-expect-error Formatter must return a string.
artplayerPluginHlsControl({ quality: { getName: level => level.height } })
// @ts-expect-error Default quality type cannot silently become any.
artplayerPluginHlsControl({ quality: { getName: level => level.missing } })
// @ts-expect-error Private definitions must not leak into globals.
const hidden: artplayerPluginHlsControlDefinitions.Option = {}
void [legacyOption, plugin, hidden]
`
  for (const compiler of [ts, compat]) {
    assert.deepEqual(checkPluginEditorDeclaration(generated, core, consumer, compiler), [], compiler.version)
    assert.equal(checkPluginEditorDeclaration(generated, core, consumer.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, ''), compiler).length, 3)
    assert(checkPluginEditorDeclaration(`${generated}\nexport interface Broken { value: MissingType }`, core, '', compiler).some(item => item.code === 2309), 'Do not hide incompatible export assignment or unresolved declarations')
  }
  assert.throws(() => generatePluginEditorDeclaration(source.replace('from \'artplayer\'', 'from \'missing-sdk\''), 'artplayerPluginHlsControl'), /Unsupported plugin editor import/)
  assert.throws(() => generatePluginEditorDeclaration(`${source}\nexport { Missing } from './missing'`, 'artplayerPluginHlsControl'), /Unsupported plugin editor declaration/)
  assert.throws(() => generatePluginEditorDeclaration('export interface {', 'plugin'), /Invalid plugin declaration syntax/)
})

test('HLS root, legacy, named types and callback inference work across old and modern compilers', () => {
  const source = fs.readFileSync(path.join(refactorDir, '../test/types/hls-control.ts'), 'utf8')
  for (const [compiler, mode] of [[ts, 'node10-commonjs'], [ts, 'nodenext-cjs'], [ts, 'nodenext-esm'], [ts, 'bundler-esm'], [compat, 'node10-commonjs']]) {
    assert.deepEqual(checkConsumer(compiler, mode, source), [], `${compiler.version} ${mode}`)
    const invalid = source.replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')
    assert.equal(checkConsumer(compiler, mode, invalid).length, 8, `${compiler.version} ${mode} must reject all invalid uses`)
  }
  const cjs = 'import hls = require(\'artplayer-plugin-hls-control\'); import legacy = require(\'artplayer-plugin-hls-control/legacy\'); const option: hls.Option = { audio: { getName: track => track.name } }; hls(option); legacy();'
  assert.deepEqual(checkConsumer(ts, 'nodenext-cjs', cjs), [])
})

test('HLS callback generics accept actual pinned SDK declarations without a runtime dependency', async () => {
  const { release } = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/hls-sdk.json')))
  const archive = await ensureArchive(release)
  const directory = fs.mkdtempSync(path.join(refactorDir, '.cache/hls-types-'))
  try {
    fs.writeFileSync(path.join(directory, 'sdk.d.ts'), readMember(archive, 'package/dist/hls.js.d.ts'))
    const filename = path.join(directory, 'consumer.ts')
    fs.writeFileSync(filename, `import type { Level, MediaPlaylist } from './sdk';
import hls from 'artplayer-plugin-hls-control';
hls<Level, MediaPlaylist>({ quality: { getName: level => String(level.bitrate) }, audio: { getName: track => track.name } });
hls({ quality: { getName: (level: Level, index?: number) => level.height + ':' + index }, audio: { getName: (track: MediaPlaylist) => track.groupId } });
`)
    for (const compiler of [ts, compat]) {
      const program = compiler.createProgram([filename], { strict: true, noEmit: true, skipLibCheck: false, types: [], esModuleInterop: true, module: compiler.ModuleKind.CommonJS, moduleResolution: compiler.ModuleResolutionKind.NodeJs, target: compiler.ScriptTarget.ES2020, lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] })
      const describe = program => compiler.getPreEmitDiagnostics(program).map(item => ({ file: item.file && path.basename(item.file.fileName), code: item.code, message: compiler.flattenDiagnosticMessageText(item.messageText, '\n') }))
      const expected = compiler === compat
        ? [
            { file: 'sdk.d.ts', code: 2304, message: 'Cannot find name \'MediaDecodingConfiguration\'.' },
            { file: 'sdk.d.ts', code: 2304, message: 'Cannot find name \'MediaCapabilitiesDecodingInfo\'.' },
          ]
        : []
      assert.deepEqual(describe(program), expected, `Actual Hls.js types / TS ${compiler.version}`)
      const sdkOnly = path.join(directory, 'sdk-only.ts')
      fs.writeFileSync(sdkOnly, 'import type { Level, MediaPlaylist } from \'./sdk\'; export type Inputs = [Level, MediaPlaylist];\n')
      const control = compiler.createProgram([sdkOnly], program.getCompilerOptions())
      assert.deepEqual(describe(control), expected, 'Old DOM library errors must originate in the SDK alone, not the plugin')
      assert(program.getSourceFiles().some(file => path.resolve(file.fileName) === path.join(directory, 'sdk.d.ts')))
    }
  }
  finally {
    const resolved = fs.realpathSync(directory)
    assert.equal(path.dirname(resolved), fs.realpathSync(path.join(refactorDir, '.cache')))
    assert(path.basename(resolved).startsWith('hls-types-'))
    fs.rmSync(resolved, { recursive: true, force: true })
  }
})

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Internal runtime compiler checks use the repository runner.
import test from 'node:test'
import ts from 'typescript'
import runtimeCompat from 'typescript-runtime-compat'

for (const compiler of [ts, runtimeCompat]) {
  test(`Multiple subtitles strict runtime modules and negative consumers: TS ${compiler.version}`, () => {
    const file = path.resolve('packages/artplayer-plugin-multiple-subtitles/tsconfig.json')
    const config = compiler.readConfigFile(file, compiler.sys.readFile)
    assert.equal(config.error, undefined)
    const parsed = compiler.parseJsonConfigFileContent(config.config, compiler.sys, path.dirname(file))
    assert.equal(parsed.options.strict, true)
    assert.equal(parsed.options.allowJs, false)
    assert.equal(parsed.options.skipLibCheck, false)
    assert.equal(parsed.options.noEmit, true)
    assert.deepEqual(parsed.options.types, [])
    const fixture = path.resolve('test/types/multiple-subtitles-runtime.ts')
    assert(parsed.fileNames.some(file => path.resolve(file) === fixture))
    function diagnostics(negative) {
      const host = compiler.createCompilerHost(parsed.options)
      const read = host.readFile.bind(host)
      host.readFile = file => path.resolve(file) === fixture && negative
        ? fs.readFileSync(fixture, 'utf8').replaceAll(/\/\/ @ts-expect-error[^\n]*\n/g, '')
        : read(file)
      const program = compiler.createProgram(parsed.fileNames, parsed.options, host)
      assert(program.getSourceFile(fixture))
      assert(!program.getSourceFiles().some(file => /multiple-subtitles\/src\/.*\.js$/.test(file.fileName.replaceAll('\\', '/'))), 'Vendored JS must be represented by its explicit declaration')
      return compiler.getPreEmitDiagnostics(program).map(error => ({ code: error.code, text: compiler.flattenDiagnosticMessageText(error.messageText, '\n') }))
    }
    assert.deepEqual(diagnostics(false), [])
    const rejected = diagnostics(true)
    assert.equal(rejected.length, 8, JSON.stringify(rejected))
  })
}

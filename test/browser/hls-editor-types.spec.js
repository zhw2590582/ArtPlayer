import fs from 'node:fs'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

test('Monaco consumes HLS global types and executes the emitted plugin factory', async ({ page }, testInfo) => {
  const code = process.env.ARTPLAYER_HLS_ARTIFACT
    ? fs.readFileSync(process.env.ARTPLAYER_HLS_ARTIFACT, 'utf8')
    : await compilePackage('artplayer-plugin-hls-control', 'umd')
  const declarations = Object.fromEntries(['artplayer', 'artplayer-plugin-hls-control'].map(name => [name, hash(fs.readFileSync(new URL(`../../docs/assets/ts/${name}.d.ts`, import.meta.url)))]))
  const inputs = { candidate: process.env.ARTPLAYER_HLS_ARTIFACT || 'workspace source build', sha256: hash(code), declarations }
  await testInfo.attach('hls-editor-inputs', { contentType: 'application/json', body: JSON.stringify(inputs) })
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ content: code })
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  const result = await page.evaluate(async () => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    await new Promise((resolve, reject) => window.require(['vs/editor/editor.main'], resolve, reject))
    const api = window.monaco
    const types = api.languages.typescript
    types.typescriptDefaults.setCompilerOptions({ target: types.ScriptTarget.ES2020, strict: true, skipLibCheck: false, noEmit: false, types: [], allowNonTsExtensions: true })
    const names = ['artplayer', 'artplayer-plugin-hls-control']
    const libraries = await Promise.all(names.map(async (name) => {
      const uri = `file:///${name}.d.ts`
      const source = await (await fetch(`/assets/ts/${name}.d.ts`)).text()
      return { uri, handle: types.typescriptDefaults.addExtraLib(source, uri) }
    }))
    const model = api.editor.createModel(`
const hlsOption: artplayerPluginHlsControl.Option = {
  quality: { getName: (level, index) => level.height + ':' + index },
  audio: { getName: track => track.name },
}
const oldQuality: NonNullable<Parameters<typeof artplayerPluginHlsControl>[0]['quality']> = { getName: (value: object) => String(value) }
const typedFactory: (art: Artplayer) => artplayerPluginHlsControl.Result = artplayerPluginHlsControl(hlsOption)
const defaultFactory = artplayerPluginHlsControl()
`, 'typescript', api.Uri.parse('file:///hls-consumer.ts'))
    const invalid = api.editor.createModel('artplayerPluginHlsControl({ quality: { getName: level => level.height } })', 'typescript', api.Uri.parse('file:///hls-invalid.ts'))
    try {
      const worker = await (await types.getTypeScriptWorker())(model.uri, invalid.uri)
      const syntax = await worker.getSyntacticDiagnostics(model.uri.toString())
      const semantic = await worker.getSemanticDiagnostics(model.uri.toString())
      const declarations = (await Promise.all(libraries.map(lib => worker.getSemanticDiagnostics(lib.uri)))).flat()
      const bad = await worker.getSemanticDiagnostics(invalid.uri.toString())
      if (syntax.length || semantic.length || declarations.length)
        return { syntax, semantic, declarations, invalid: bad.map(item => item.code), executed: false }
      const output = await worker.getEmitOutput(model.uri.toString())
      const script = output.outputFiles.find(file => file.name.endsWith('.js'))
      if (!script)
        throw new Error('Monaco did not emit the HLS fixture')
      // eslint-disable-next-line no-new-func -- Exercise the local editor Run action with its real emitted code.
      const executed = new Function(`${script.text}\nreturn typeof typedFactory === 'function' && typeof defaultFactory === 'function'`)()
      return { syntax, semantic, declarations, invalid: bad.map(item => item.code), executed }
    }
    finally {
      model.dispose()
      invalid.dispose()
      for (const library of libraries)
        library.handle.dispose()
    }
  })
  expect(result.syntax).toEqual([])
  expect(result.semantic).toEqual([])
  expect(result.declarations).toEqual([])
  expect(result.invalid).toEqual([2769])
  expect(result.executed).toBe(true)
})

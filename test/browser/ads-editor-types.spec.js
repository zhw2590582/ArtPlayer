import fs from 'node:fs'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

test('Monaco compiles Ads namespaces and executes callable and historical default factories', async ({ page }, testInfo) => {
  const code = process.env.ARTPLAYER_ADS_ARTIFACT
    ? fs.readFileSync(process.env.ARTPLAYER_ADS_ARTIFACT, 'utf8')
    : await compilePackage('artplayer-plugin-ads', 'umd')
  const declarations = Object.fromEntries(['artplayer', 'artplayer-plugin-ads'].map(name => [name, hash(fs.readFileSync(new URL(`../../docs/assets/ts/${name}.d.ts`, import.meta.url)))]))
  await testInfo.attach('ads-editor-inputs', { contentType: 'application/json', body: JSON.stringify({ candidate: process.env.ARTPLAYER_ADS_ARTIFACT || 'workspace source build', sha256: hash(code), declarations }) })
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ content: code })
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  const result = await page.evaluate(async () => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    await new Promise((resolve, reject) => window.require(['vs/editor/editor.main'], resolve, reject))
    const api = window.monaco
    const types = api.languages.typescript
    types.typescriptDefaults.setCompilerOptions({ target: types.ScriptTarget.ES2020, strict: true, skipLibCheck: false, noEmit: false, types: [], allowNonTsExtensions: true })
    const libraries = await Promise.all(['artplayer', 'artplayer-plugin-ads'].map(async (name) => {
      const uri = `file:///${name}.d.ts`
      const source = await (await fetch(`/assets/ts/${name}.d.ts`)).text()
      return { uri, handle: types.typescriptDefaults.addExtraLib(source, uri) }
    }))
    const model = api.editor.createModel(`
const adsOption: artplayerPluginAds.Option = { html: '<b>ad</b>', totalDuration: 5,
  i18n: { close: 'Close', countdown: '%s seconds', detail: 'Details', canBeClosed: '%s seconds' } };
const typedFactory: (art: Artplayer) => artplayerPluginAds.Result = artplayerPluginAds(adsOption);
const defaultFactory = artplayerPluginAds.default(adsOption);
const historical: Parameters<typeof artplayerPluginAds>[0] = { html: 'ad', totalDuration: '10' };
const workspace: artplayerPluginAds.WorkspaceOption = { source: 'ad.mp4', type: 'video' };
const oldFactory = artplayerPluginAds(historical);
const workspaceFactory = artplayerPluginAds(workspace);
`, 'typescript', api.Uri.parse('file:///ads-consumer.ts'))
    const invalid = api.editor.createModel('artplayerPluginAds({ totalDuration: false })', 'typescript', api.Uri.parse('file:///ads-invalid.ts'))
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
        throw new Error('Monaco did not emit the Ads fixture')
      // eslint-disable-next-line no-new-func -- Exercise the local editor Run action with its real emitted code.
      const executed = new Function(`${script.text}\nreturn [typedFactory, defaultFactory, oldFactory, workspaceFactory].every(value => typeof value === 'function') && artplayerPluginAds.default === artplayerPluginAds`)()
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

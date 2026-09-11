import fs from 'node:fs'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { compilePackage } from '../helpers/load.js'
import { expect, test } from './fixtures.js'

test('Monaco preserves legacy audio inference and runs the precise typed factory', async ({ page }, testInfo) => {
  const code = process.env.ARTPLAYER_AUDIO_ARTIFACT
    ? fs.readFileSync(process.env.ARTPLAYER_AUDIO_ARTIFACT, 'utf8')
    : await compilePackage('artplayer-plugin-audio-track', 'umd')
  const declarations = Object.fromEntries(['artplayer', 'artplayer-plugin-audio-track'].map(name => [name, hash(fs.readFileSync(new URL(`../../docs/assets/ts/${name}.d.ts`, import.meta.url)))]))
  await testInfo.attach('audio-editor-inputs', { contentType: 'application/json', body: JSON.stringify({ candidate: process.env.ARTPLAYER_AUDIO_ARTIFACT || 'workspace source build', sha256: hash(code), declarations }) })
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ content: code })
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  const result = await page.evaluate(async () => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    await new Promise((resolve, reject) => window.require(['vs/editor/editor.main'], resolve, reject))
    const api = window.monaco
    const types = api.languages.typescript
    types.typescriptDefaults.setCompilerOptions({ target: types.ScriptTarget.ES2020, strict: true, skipLibCheck: false, noEmit: false, types: [], allowNonTsExtensions: true })
    const libraries = await Promise.all(['artplayer', 'artplayer-plugin-audio-track'].map(async (name) => {
      const uri = `file:///${name}.d.ts`
      const source = await (await fetch(`/assets/ts/${name}.d.ts`)).text()
      return { uri, handle: types.typescriptDefaults.addExtraLib(source, uri) }
    }))
    const model = api.editor.createModel(`
const typedFactory = artplayerPluginAudioTrack as artplayerPluginAudioTrack.RuntimeFactory;
const editorArt = new Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true });
const option: artplayerPluginAudioTrack.Option = { url: '/test/audio-tone.m4a' };
const legacyInput: Parameters<artplayerPluginAudioTrack.Result['update']>[0] = option;
const legacyURL: string = legacyInput.url;
const implemented: ReturnType<ReturnType<typeof artplayerPluginAudioTrack>> = {
  name: 'artplayerPluginAudioTrack', audio: new Audio(), update(options) { this.audio.src = options.url; }
};
const pluginResult = typedFactory(option)(editorArt);
const done: void = pluginResult.update({ offset: 0.25 });
`, 'typescript', api.Uri.parse('file:///audio-consumer.ts'))
    const invalid = api.editor.createModel(`typedFactory({});
pluginResult.update({ sync: 'fast' });
artplayerPluginAudioTrack();`, 'typescript', api.Uri.parse('file:///audio-invalid.ts'))
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
        throw new Error('Monaco did not emit the audio consumer')
      // eslint-disable-next-line no-new-func -- Run the real locally emitted editor script.
      const execution = new Function(`${script.text}\nreturn { art: editorArt, plugin: pluginResult, done }`)()
      try {
        if (!execution.art.isReady)
          await new Promise(resolve => execution.art.on('ready', resolve))
        return { syntax, semantic, declarations, invalid: bad.map(item => item.code), executed: execution.art.isReady && execution.plugin.audio instanceof HTMLAudioElement && execution.done === undefined }
      }
      finally {
        execution.art.destroy()
      }
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
  expect(result.invalid).toEqual([2345, 2322, 2554])
  expect(result.executed).toBe(true)
})

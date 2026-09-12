import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { thumbnailCandidate } from '../helpers/thumbnail.js'
import { expect, test } from './fixtures.js'

const candidate = await thumbnailCandidate()

test('Monaco consumes Thumbnail global declarations and runs the actual typed constructor and cleanup', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ content: candidate.code })
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  const result = await page.evaluate(async () => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    await new Promise((resolve, reject) => window.require(['vs/editor/editor.main'], resolve, reject))
    const api = window.monaco
    const types = api.languages.typescript
    types.typescriptDefaults.setCompilerOptions({ target: types.ScriptTarget.ES2020, strict: true, skipLibCheck: false, noEmit: false, types: [], allowNonTsExtensions: true })
    const libraries = await Promise.all(['artplayer', 'artplayer-tool-thumbnail', 'artplayer-proxy-mediabunny'].map(async (name) => {
      const uri = `file:///${name}.d.ts`
      const source = await (await fetch(`/assets/ts/${name}.d.ts`)).text()
      return { uri, handle: types.typescriptDefaults.addExtraLib(source, uri) }
    }))
    const model = api.editor.createModel(`
const input = document.createElement('input'); input.type = 'file'; document.body.appendChild(input);
const options: ArtplayerToolThumbnail.Option = { fileInput: input, number: 10 };
const tool: ArtplayerToolThumbnail = new ArtplayerToolThumbnail(options);
let last = 0;
tool.on('custom', (value: number) => { last = value; });
tool.emit('custom', 7);
tool.on('update', (url, progress) => url + progress.toFixed());
const video: HTMLVideoElement = tool.video;
tool.destroy(); tool.destroy(); input.remove();
function mediaTypes(player: artplayerProxyMediabunny.MediaBunnyPlayer): number | undefined { return player.mediabunny?.currentTime; }
`, 'typescript', api.Uri.parse('file:///thumbnail-consumer.ts'))
    const invalid = api.editor.createModel("new ArtplayerToolThumbnail({ fileInput: '#input' });", 'typescript', api.Uri.parse('file:///thumbnail-invalid.ts'))
    try {
      const worker = await (await types.getTypeScriptWorker())(model.uri, invalid.uri)
      const syntax = await worker.getSyntacticDiagnostics(model.uri.toString())
      const semantic = await worker.getSemanticDiagnostics(model.uri.toString())
      const declaration = (await Promise.all(libraries.map(library => worker.getSemanticDiagnostics(library.uri)))).flat()
      const bad = await worker.getSemanticDiagnostics(invalid.uri.toString())
      if (syntax.length || semantic.length || declaration.length)
        return { syntax, semantic, declaration, invalid: bad.map(item => item.code), executed: false }
      const output = await worker.getEmitOutput(model.uri.toString())
      const script = output.outputFiles.find(file => file.name.endsWith('.js'))
      if (!script)
        throw new Error('Monaco did not emit the Thumbnail fixture')
      // eslint-disable-next-line no-new-func -- Run actual code emitted by the local Monaco worker.
      const actual = new Function(`${script.text}\nreturn { last, connected: video.isConnected, inputConnected: input.isConnected, processing: tool.processing }`)()
      return { syntax, semantic, declaration, invalid: bad.map(item => item.code), executed: true, actual }
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
  expect(result.declaration).toEqual([])
  expect(result.invalid).toEqual([2322])
  expect(result.executed).toBe(true)
  expect(result.actual).toEqual({ last: 7, connected: false, inputConnected: false, processing: false })
  await testInfo.attach('thumbnail-editor', { contentType: 'application/json', body: JSON.stringify({ candidate: candidate.name, sha256: hash(candidate.code), declarations: Object.fromEntries(['artplayer', 'artplayer-tool-thumbnail', 'artplayer-proxy-mediabunny'].map(name => [name, hash(fs.readFileSync(`docs/assets/ts/${name}.d.ts`))])), result, scope: 'Real local Monaco worker, typed constructor/custom event and native DOM cleanup; MediaBunny relative type bundle also compiles. This does not test file decoding or the complete demo/player integration.' }) })
})

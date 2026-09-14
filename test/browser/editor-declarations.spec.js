import fs from 'node:fs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { expect, test } from './fixtures.js'

test('Monaco checks all editor declarations together and runs the Chapter consumer', async ({ page }, testInfo) => {
  const common = fs.readFileSync('packages/artplayer-vitepress/browser/editor-libraries.ts', 'utf8')
  const list = common.match(/(?:let|const) libUris = \[([\s\S]*?)\]/)?.[1] || ''
  const names = [...list.matchAll(/'\.\/assets\/ts\/([^']+\.d\.ts)'/g)].map(match => match[1])
  expect(names).toHaveLength(22)
  await testInfo.attach('editor-declaration-inputs', { contentType: 'application/json', body: JSON.stringify(Object.fromEntries(names.map(name => [name, hash(fs.readFileSync(`docs/assets/ts/${name}`))]))) })
  await page.goto('/test/player.html?core=candidate&chapter=candidate')
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  const result = await page.evaluate(async (names) => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    await new Promise((resolve, reject) => window.require(['vs/editor/editor.main'], resolve, reject))
    const api = window.monaco
    const types = api.languages.typescript
    types.typescriptDefaults.setCompilerOptions({ target: types.ScriptTarget.ES2020, strict: true, skipLibCheck: false, noEmit: false, types: [], allowNonTsExtensions: true })
    const libraries = await Promise.all(names.map(async (name) => {
      const source = await (await fetch(`/assets/ts/${name}`)).text()
      const uri = `file:///${name}`
      return { uri, handle: types.typescriptDefaults.addExtraLib(source, uri) }
    }))
    const model = api.editor.createModel(`
const chapters: artplayerPluginChapter.Chapters = [{ start: 0, end: 2, title: 'Intro' }];
const player = new Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, plugins: [artplayerPluginChapter({ chapters })] });
const chapter = player.plugins.artplayerPluginChapter as artplayerPluginChapter.Result;
chapter.update({ chapters: [{ start: 0, end: 1, title: 'Updated' }] });
const adOption: artplayerPluginVast.ArtplayerPluginVastOption = context => {
  const volume: number = context.init().volume;
  context.playerOptions.autoResize = true;
  return Promise.resolve();
};
`, 'typescript', api.Uri.parse('file:///editor-consumer.ts'))
    const invalid = api.editor.createModel(`
artplayerPluginVast(context => { context.init().volume = 'loud'; context.playerOptions.autoResize = 'yes'; });
artplayerPluginChapter({ chapters: [{ start: '0', end: 2, title: '' }] });
`, 'typescript', api.Uri.parse('file:///editor-invalid.ts'))
    try {
      const worker = await (await types.getTypeScriptWorker())(model.uri, invalid.uri)
      const syntax = await worker.getSyntacticDiagnostics(model.uri.toString())
      const semantic = await worker.getSemanticDiagnostics(model.uri.toString())
      const declarations = (await Promise.all(libraries.map(lib => worker.getSemanticDiagnostics(lib.uri)))).flat()
      const bad = (await worker.getSemanticDiagnostics(invalid.uri.toString())).map(item => item.code)
      if (syntax.length || semantic.length || declarations.length)
        return { syntax, semantic, declarations, bad }
      const output = await worker.getEmitOutput(model.uri.toString())
      const script = output.outputFiles.find(file => file.name.endsWith('.js'))
      if (!script)
        throw new Error('Monaco did not emit the consumer')
      // eslint-disable-next-line no-new-func -- Execute the actual editor output with local controlled media.
      const player = new Function(`${script.text}\nreturn player`)()
      try {
        await new Promise((resolve, reject) => {
          player.on('ready', resolve)
          player.on('error', reject)
        })
        const name = player.plugins.artplayerPluginChapter.name
        const ready = player.isReady
        player.destroy(true)
        return { syntax, semantic, declarations, bad, name, ready, instances: window.Artplayer.instances.length }
      }
      finally {
        if (!player.isDestroy)
          player.destroy(true)
      }
    }
    finally {
      model.dispose()
      invalid.dispose()
      for (const library of libraries) library.handle.dispose()
    }
  }, names)
  await testInfo.attach('editor-declaration-result', { contentType: 'application/json', body: JSON.stringify(result) })
  expect(result.syntax).toEqual([])
  expect(result.semantic).toEqual([])
  expect(result.declarations).toEqual([])
  expect(result.bad).toEqual([2322, 2322, 2322])
  expect(result.name).toBe('artplayerPluginChapter')
  expect(result.ready).toBe(true)
  expect(result.instances).toBe(0)
})

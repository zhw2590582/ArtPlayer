import { createHash } from 'node:crypto'
import fs from 'node:fs'
import { build } from 'esbuild'
import { extractExamples } from '../../scripts/docs-smoke/parser.ts'
import { expect, test } from './fixtures.js'

const compiled = await build({
  entryPoints: ['scripts/docs-smoke/runtime.ts'],
  bundle: true,
  write: false,
  format: 'iife',
  globalName: 'DocumentationSmoke',
  target: 'es2020',
  logLevel: 'silent',
})
const pluginFile = 'packages/artplayer-plugin-danmuku/dist/artplayer-plugin-danmuku.js'
const plugin = fs.readFileSync(pluginFile)
const pluginHash = createHash('sha256').update(plugin).digest('hex')
const pluginUrl = '/uncompiled/artplayer-plugin-danmuku/index.js'

for (const relative of ['plugin/danmuku.md', 'en/plugin/danmuku.md']) {
  const source = fs.readFileSync(`packages/artplayer-vitepress/docs/${relative}`, 'utf8')
  for (const example of extractExamples(source, relative)) {
    test(`documented Danmuku example becomes ready and cleans up: ${example.id}`, async ({ page }, testInfo) => {
      await page.route(`**${pluginUrl}`, route => route.fulfill({ contentType: 'text/javascript', body: plugin }))
      await page.goto('/test/player.html')
      await page.addScriptTag({ content: compiled.outputFiles[0].text })
      const result = await page.evaluate(
        ({ example, pluginUrl }) => window.DocumentationSmoke.runExample(example, ['/candidate/artplayer.js', pluginUrl]),
        { example, pluginUrl },
      )
      expect(result.instances).toBe(1)
      expect(result.ready).toBe(1)
      expect(result.media[0].duration).toBeGreaterThan(0)
      expect(result.media[0].width).toBeGreaterThan(0)
      expect(result.media[0].height).toBeGreaterThan(0)
      await expect(page.locator('iframe[data-documentation-smoke]')).toHaveCount(0)
      await testInfo.attach('documented-example', {
        contentType: 'application/json',
        body: JSON.stringify({ example, pluginFile, pluginHash, result, scope: 'readiness and frame cleanup; interactive commands and playback remain separate' }),
      })
    })
  }
}

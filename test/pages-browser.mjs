/* eslint-disable antfu/no-top-level-await -- Sequential standalone browser command; always closes its own server and browsers. */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { chromium, firefox, webkit } from 'playwright'
import { serveAsset } from '../scripts/library/assets.ts'
import { digest } from '../scripts/pages/artifact.ts'

const { output } = JSON.parse(fs.readFileSync('refactor/.cache/pages/latest.json', 'utf8'))
assert.equal(path.dirname(path.resolve(output)), path.resolve('refactor/.cache/pages'))
assert(path.basename(output).startsWith('run-'))
const prepared = JSON.parse(fs.readFileSync(path.join(output, 'report.json'), 'utf8'))
assert.equal(prepared.status, 'validated')
const site = path.join(output, 'site')
const reports = []
const failures = []
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname
  const media = pathname === '/__media.mp4'
  serveAsset(media ? path.resolve('test/browser/media') : site, media ? '/pattern.mp4' : pathname, request, response).catch((error) => {
    failures.push(String(error))
    response.destroy()
  })
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const serverUrl = `http://127.0.0.1:${server.address().port}`
try {
  for (const [engine, launcher] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await launcher.launch()
    try {
      for (const format of ['demo', 'module']) {
        const page = await browser.newPage()
        page.setDefaultTimeout(10000)
        page.setDefaultNavigationTimeout(10000)
        const errors = []
        const network = []
        page.on('pageerror', error => errors.push(String(error)))
        page.on('requestfailed', request => network.push({ url: request.url(), type: request.resourceType(), error: request.failure()?.errorText }))
        process.stdout.write(`Checking ${engine}/${format}\n`)
        const core = format === 'demo' ? 'uncompiled/artplayer/index.js' : 'compiled/artplayer.mjs'
        const chapter = format === 'demo' ? 'uncompiled/artplayer-plugin-chapter/index.js' : 'compiled/artplayer-plugin-chapter.mjs'
        for (const file of [core, chapter]) assert.equal(digest(path.join(site, file)).sha256, prepared.files[file].sha256)
        const setup = `window.art = new window.Artplayer({ container: '.player', url: '/__media.mp4', muted: true, fullscreenWeb: true, plugins: [window.artplayerPluginChapter({chapters:[{start:0,end:Infinity,title:'Pages staging'}]})] }); document.querySelector('button').onclick = () => art.play();`
        const scripts = format === 'demo'
          ? `<script src="/${core}"></script><script src="/${chapter}"></script><script>${setup}</script>`
          : `<script type="module">import Artplayer from '/${core}'; import chapter from '/${chapter}'; window.Artplayer=Artplayer; window.artplayerPluginChapter=chapter; ${setup}</script>`
        await page.route('**/__pages_probe.html', route => route.fulfill({ contentType: 'text/html', body: `<!doctype html><button>Play</button><div class="player" style="width:640px;height:360px"></div>${scripts}` }))
        try {
          await page.goto(`${serverUrl}/__pages_probe.html`)
          await page.waitForFunction(() => window.art?.isReady)
          await page.locator('button').click()
          await page.waitForFunction(() => window.art.playing && window.art.currentTime > 0.2)
          assert.equal(await page.locator('.art-chapter').count(), 1)
          await page.evaluate(() => {
            window.art.plugins.artplayerPluginChapter.update({ chapters: [{ start: 0, end: Infinity, title: 'Updated' }] })
            window.art.fullscreenWeb = true
          })
          await page.waitForFunction(() => window.art.fullscreenWeb)
          assert.equal(await page.locator('.art-chapter').getAttribute('data-title'), 'Updated')
          const state = await page.evaluate(() => ({ time: window.art.currentTime, width: window.art.video.videoWidth, readyState: window.art.video.readyState, mediaError: window.art.video.error?.code ?? null }))
          assert(state.width > 0)
          assert.equal(state.mediaError, null)
          await page.evaluate(() => window.art.destroy())
          assert.equal(await page.locator('.art-video-player').count(), 0)
          assert.deepEqual(errors, [])
          assert.deepEqual(network.filter(entry => entry.type === 'script'), [])
          reports.push({ engine, version: browser.version(), platform: process.platform, format, passed: true, state, network, inputs: { core: prepared.files[core], chapter: prepared.files[chapter] } })
        }
        catch (error) {
          process.stderr.write(`${engine}/${format}: ${String(error)}; ${JSON.stringify(errors)}\n`)
          reports.push({ engine, version: browser.version(), format, passed: false, error: String(error), errors, network })
          failures.push(`${engine}/${format}: ${String(error)}`)
        }
        finally {
          await page.close()
        }
      }
    }
    finally {
      await browser.close()
    }
  }
}
finally {
  server.closeAllConnections()
  await new Promise(resolve => server.close(resolve))
  fs.writeFileSync(path.join(output, 'browser.json'), `${JSON.stringify({ prepared: digest(path.join(output, 'report.json')), reports, failures, limitation: 'Controlled probe page and fixed native MP4; scripts served from exact staged directory. Not full live editor, external SDK, physical device or remote Pages verification.' }, null, 2)}\n`)
}
assert.deepEqual(failures, [])
process.stdout.write(`Staged Pages browser checks passed: ${reports.length}. Evidence: ${output}/browser.json\n`)

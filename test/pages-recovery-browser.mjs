/* eslint-disable antfu/no-top-level-await -- Sequential browser evidence with explicit server/browser cleanup. */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { chromium, firefox, webkit } from 'playwright'
import { hash } from '../refactor/scripts/releases.mjs'
import { serveAsset } from '../scripts/library/assets.ts'
import { inside } from '../scripts/pages/artifact.ts'
import { verifyRestoredTree } from '../scripts/pages/recovery.ts'

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const selected = read('refactor/.cache/pages-recovery/latest.json')
assert(selected.passed)
const output = fs.realpathSync(selected.output)
assert.equal(path.dirname(output), fs.realpathSync('refactor/.cache/pages-recovery'))
const report = read(path.join(output, 'report.json'))
assert(report.passed)
assert.equal(report.node, process.versions.node)
const site = path.join(output, 'site')
verifyRestoredTree(site, report.gitFiles)
const reports = []
const failures = []
const cancellations = []
const urls = []
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname
  // Preserve archived HTML response bytes; the development server injects reload code.
  const relative = pathname.endsWith('/') ? `${pathname.slice(1)}index.html` : pathname.slice(1)
  if (relative.endsWith('.html') && Object.hasOwn(report.files, relative)) {
    const bytes = fs.readFileSync(inside(site, relative))
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': bytes.length })
    response.end(request.method === 'HEAD' ? undefined : bytes)
    return
  }
  serveAsset(site, pathname, request, response).catch((error) => {
    const observation = { pathname, range: request.headers.range || null, code: error.code, aborted: request.aborted, responseDestroyed: response.destroyed, responseFinished: response.writableFinished }
    if (pathname === '/assets/sample/video.mp4' && error.code === 'ERR_STREAM_PREMATURE_CLOSE' && request.aborted)
      cancellations.push(observation)
    else
      failures.push({ error: String(error), ...observation })
    response.destroy()
  })
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${server.address().port}`
try {
  for (const file of ['index.html', 'mobile.html', 'iframe.html', 'esm.html', 'document/index.html', 'document/en/index.html', 'compiled/artplayer.js', 'uncompiled/artplayer/index.js', 'compiled/artplayer-tool-thumbnail.js', 'assets/example/tool.thumbnail.js', 'CNAME', '.nojekyll']) {
    assert(report.files[file], `Missing frozen route: ${file}`)
    const response = await fetch(`${origin}/${file}`)
    assert.equal(response.status, 200)
    const body = new Uint8Array(await response.arrayBuffer())
    assert.equal(hash(body), report.files[file].sha256, `Restored HTTP bytes differ: ${file}`)
    urls.push({ file, status: response.status, contentType: response.headers.get('content-type'), sha256: hash(body) })
  }
  for (const [engine, launcher] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await launcher.launch()
    try {
      for (const format of ['umd', 'esm']) {
        const page = await browser.newPage()
        page.setDefaultTimeout(10000)
        page.setDefaultNavigationTimeout(10000)
        const errors = []
        page.on('pageerror', error => errors.push(String(error)))
        const core = `compiled/artplayer.${format === 'umd' ? 'js' : 'mjs'}`
        const chapter = `compiled/artplayer-plugin-chapter.${format === 'umd' ? 'js' : 'mjs'}`
        const setup = `window.art = new Artplayer({container:'.player',url:'/assets/sample/video.mp4',muted:true,plugins:[artplayerPluginChapter({chapters:[{start:0,end:Infinity,title:'Restored'}]})]}); document.querySelector('button').onclick=()=>art.play();`
        const scripts = format === 'umd'
          ? `<script src="/${core}"></script><script src="/${chapter}"></script><script>${setup}</script>`
          : `<script type="module">import Artplayer from '/${core}'; import artplayerPluginChapter from '/${chapter}'; window.Artplayer=Artplayer; ${setup}</script>`
        await page.route('**/__recovery_probe.html', route => route.fulfill({ contentType: 'text/html', body: `<!doctype html><button>Play</button><div class="player" style="width:640px;height:360px"></div>${scripts}` }))
        try {
          await page.goto(`${origin}/__recovery_probe.html`)
          await page.waitForFunction(() => window.art?.isReady)
          await page.locator('button').click()
          await page.waitForFunction(() => window.art.currentTime > 0.2 && window.art.video.videoWidth > 0)
          await page.evaluate(() => {
            window.art.pause()
            window.art.seek = 3
          })
          await page.waitForFunction(() => window.art.video.paused && Math.abs(window.art.currentTime - 3) < 0.1)
          const state = await page.evaluate(() => ({ version: window.Artplayer.version, width: window.art.video.videoWidth, height: window.art.video.videoHeight, time: window.art.currentTime, error: window.art.video.error?.code || 0 }))
          assert.equal(state.error, 0)
          assert.equal(await page.locator('.art-chapter').count(), 1)
          await page.evaluate(() => window.art.destroy())
          assert.equal(await page.locator('.art-video-player').count(), 0)
          assert.deepEqual(errors, [])
          reports.push({ engine, version: browser.version(), format, passed: true, state, inputs: { core: report.files[core], chapter: report.files[chapter], media: report.files['assets/sample/video.mp4'] } })
          process.stdout.write(`${engine}/${format}: restored playback passed\n`)
        }
        catch (error) {
          failures.push(`${engine}/${format}: ${String(error)}`)
          reports.push({ engine, version: browser.version(), format, passed: false, error: String(error), errors })
          await page.screenshot({ path: path.join(output, `${engine}-${format}-failure.png`) })
        }
        finally { await page.close() }
      }
    }
    finally { await browser.close() }
  }
}
finally {
  server.closeAllConnections()
  await new Promise(resolve => server.close(resolve))
  fs.writeFileSync(path.join(output, 'browser.json'), `${JSON.stringify({ task: 'REL-04', restoredReportSha256: hash(fs.readFileSync(path.join(output, 'report.json'))), platform: process.platform, reports, urls, failures, cancellations, limitations: ['Controlled probe loads actual restored scripts/media; not the complete editor or iframe UI.', 'No remote Pages source/domain/deployment was changed.', 'Thumbnail route bytes verified; extraction and missing historical npm archive are separate gates.'] }, null, 2)}\n`)
}
assert.deepEqual(failures, [])
process.stdout.write(`Restored site: ${urls.length} exact HTTP routes and ${reports.length} browser playback cases passed\n`)

import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'
import { expect, firefox } from '@playwright/test'
import { observeWorkers } from '../../test/helpers/worker-observer.js'
import { ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

// Direct SDK control: no ArtPlayer or plugin is loaded, and no worker output is substituted.
export async function diagnose({ version = '1.7.2', iterations = 5, transport = 'http', teardown = 'reset-first', worker = true, host = 'direct', plugin = false, sdkLogs = false, workerObserver = false } = {}) {
  const runnerSHA256 = hash(fs.readFileSync(new URL(import.meta.url)))
  const observerSHA256 = hash(fs.readFileSync(new URL('../../test/helpers/worker-observer.js', import.meta.url)))
  assert(Number.isInteger(iterations) && iterations > 0 && iterations <= 50)
  assert(['http', 'route'].includes(transport))
  assert(['reset-first', 'sdk-first'].includes(teardown))
  assert(['direct', 'published', 'candidate'].includes(host))
  assert(!plugin || host !== 'direct', 'Plugin comparison requires an ArtPlayer host')
  const matrix = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/hls-sdk-matrix.json')))
  const release = matrix.releases.find(item => item.version === version)
  assert(release, 'Use a frozen SDK version')
  const sdk = readMember(await ensureArchive(release), 'package/dist/hls.min.js')
  assert.equal(hash(sdk), release.files['package/dist/hls.min.js'])
  const media = path.join(refactorDir, '../test/browser/media/hls')
  const manifest = JSON.parse(fs.readFileSync(path.join(media, 'manifest.json')))
  const files = new Map()
  for (const [name, expected] of Object.entries(manifest.files)) {
    const bytes = fs.readFileSync(path.join(media, name))
    assert.equal(hash(bytes), expected.sha256)
    files.set(`/${name}`, bytes)
  }
  files.set('/grouped.m3u8', fs.readFileSync(path.join(refactorDir, '../test/browser/fixtures/hls-grouped.m3u8')))
  files.set('/hls.js', sdk)
  if (host === 'published') {
    const baseline = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/releases.json')))
    const core = baseline.releases.find(item => item.name === 'artplayer')
    const bytes = readMember(await ensureArchive(core), 'package/dist/artplayer.js')
    assert.equal(hash(bytes), core.files['package/dist/artplayer.js'])
    files.set('/artplayer.js', bytes)
  }
  if (host === 'candidate')
    files.set('/artplayer.js', fs.readFileSync(path.join(refactorDir, '../packages/artplayer/dist/artplayer.js')))
  if (plugin)
    files.set('/plugin.js', fs.readFileSync(path.join(refactorDir, '../packages/artplayer-plugin-hls-control/dist/artplayer-plugin-hls-control.js')))
  files.set('/', Buffer.from('<!doctype html><title>Hls host diagnostic</title><div class="player" style="width:640px;height:360px"></div>'))
  const contentType = name => name.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : name.endsWith('.mpegts') ? 'video/mp2t' : name.endsWith('.js') ? 'text/javascript' : 'text/html'
  const server = http.createServer((req, res) => {
    const name = new URL(req.url, 'http://localhost').pathname
    const bytes = files.get(name)
    res.writeHead(bytes ? 200 : 404, { 'Content-Type': contentType(name), 'Cache-Control': 'no-store' })
    res.end(bytes || 'Missing diagnostic fixture')
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  const directory = fs.mkdtempSync(path.join(refactorDir, '.cache/hls-direct-'))
  const results = []
  let browser
  let browserVersion
  try {
    browser = await firefox.launch({ headless: true })
    browserVersion = browser.version()
    for (let iteration = 0; iteration < iterations; iteration++) {
      const context = await browser.newContext()
      await context.tracing.start({ screenshots: true, snapshots: true, sources: true })
      const page = await context.newPage()
      const wait = predicate => expect.poll(() => page.evaluate(predicate), { timeout: 7000 }).toBe(true)
      const entry = { iteration, status: 'running', errors: [], requests: [] }
      results.push(entry)
      page.on('pageerror', error => entry.errors.push(error.message))
      page.on('crash', () => entry.errors.push('page crashed'))
      page.on('requestfailed', request => entry.requests.push({ url: request.url(), error: request.failure() }))
      if (transport === 'route') {
        await page.route('**/*.m3u8', route => serveRoute(route))
        await page.route('**/*.mpegts', route => serveRoute(route))
      }
      async function serveRoute(route) {
        const name = new URL(route.request().url()).pathname
        const bytes = files.get(name)
        await route.fulfill({ status: bytes ? 200 : 404, body: bytes || 'Missing fixture', contentType: contentType(name) })
      }
      try {
        await page.goto(origin)
        if (workerObserver)
          await page.evaluate(observeWorkers)
        await page.addScriptTag({ url: `${origin}/hls.js` })
        if (host !== 'direct')
          await page.addScriptTag({ url: `${origin}/artplayer.js` })
        if (plugin)
          await page.addScriptTag({ url: `${origin}/plugin.js` })
        await page.evaluate(({ worker, teardown, host, plugin, sdkLogs }) => {
          let video
          let hls
          let art
          const records = []
          const buffer = ranges => Array.from({ length: ranges.length }, (_, index) => [ranges.start(index), ranges.end(index)])
          const state = () => ({ time: video.currentTime, readyState: video.readyState, height: video.videoHeight, paused: video.paused, buffered: buffer(video.buffered), seekable: buffer(video.seekable) })
          const record = (event, data) => {
            records.push({ at: performance.now(), event, data, media: state() })
            if (records.length > 400)
              records.shift()
          }
          const logger = Object.fromEntries(['trace', 'debug', 'log', 'warn', 'info', 'error'].map(level => [level, (...args) => record(`log:${level}`, args.map(String))]))
          function attach(element) {
            video = element
            hls = new window.Hls({ enableWorker: worker, startLevel: 0, debug: sdkLogs ? logger : false })
            for (const key of ['ERROR', 'AUDIO_TRACKS_UPDATED', 'AUDIO_TRACK_SWITCHED', 'LEVEL_SWITCHED', 'FRAG_BUFFERED', 'BUFFER_FLUSHED']) {
              hls.on(window.Hls.Events[key], (_, data) => record(key, { id: data.id, level: data.level, fatal: data.fatal, details: data.details, frag: data.frag && { type: data.frag.type, sn: data.frag.sn, level: data.frag.level }, tracks: data.audioTracks?.map(track => ({ id: track.id, name: track.name, group: track.groupId })) }))
            }
            for (const name of ['waiting', 'stalled', 'seeking', 'seeked', 'playing', 'pause', 'ended', 'loadedmetadata', 'canplay', 'error'])
              video.addEventListener(name, () => record(name))
            hls.loadSource('/grouped.m3u8')
            hls.attachMedia(video)
            return hls
          }
          if (host === 'direct') {
            video = document.createElement('video')
            video.muted = true
            video.controls = true
            video.width = 640
            video.height = 360
            document.querySelector('.player').append(video)
            attach(video)
          }
          else {
            art = new window.Artplayer({
              container: '.player',
              url: '/grouped.m3u8',
              muted: true,
              setting: true,
              plugins: plugin ? [window.artplayerPluginHlsControl({ quality: { control: true, setting: true }, audio: { control: true, setting: true } })] : [],
              customType: { m3u8(video, _url, player) {
                player.hls = attach(video)
              } },
            })
            art.on('destroy', () => hls.destroy())
          }
          window.direct = {
            get hls() { return hls },
            get video() { return video },
            records,
            state,
            destroy() {
              record('destroy:start', teardown)
              if (art) {
                art.destroy()
              }
              else {
                if (teardown === 'reset-first') {
                  video.removeAttribute('src')
                  video.load()
                  video.remove()
                }
                hls.destroy()
                if (teardown === 'sdk-first') {
                  video.removeAttribute('src')
                  video.load()
                  video.remove()
                }
              }
              record('destroy:end')
            },
          }
        }, { worker, teardown, host, plugin, sdkLogs })
        await wait(() => window.direct.video?.readyState >= 3)
        await page.evaluate(() => window.direct.video.play())
        await wait(() => window.direct.video.currentTime > 0.3)
        await page.evaluate(() => {
          window.direct.hls.currentLevel = 0
        })
        await wait(() => window.direct.hls.audioTracks.length === 2 && window.direct.hls.audioTracks.every(track => track.groupId === 'low'))
        await page.evaluate(() => {
          window.direct.mark = performance.now()
          window.direct.hls.audioTrack = 1
        })
        await wait(() => window.direct.records.some(item => item.at >= window.direct.mark && item.event === 'AUDIO_TRACK_SWITCHED' && item.data.id === 1))
        await page.evaluate(() => {
          window.direct.hls.currentLevel = 1
        })
        await wait(() => window.direct.video.videoHeight === 180 && window.direct.hls.audioTrack === 0)
        await page.evaluate(() => {
          window.direct.hls.audioTrack = 2
        })
        await wait(() => window.direct.records.some(item => item.event === 'AUDIO_TRACK_SWITCHED' && item.data.id === 2))
        await page.evaluate(() => {
          window.direct.hls.currentLevel = 0
        })
        await wait(() => window.direct.hls.audioTracks.length === 2)
        await page.evaluate(() => window.direct.destroy())
        await page.evaluate(() => window.direct.state())
        assert.deepEqual(entry.errors, [])
        entry.status = 'passed'
      }
      catch (error) {
        entry.status = 'failed'
        entry.failure = error.message
        await page.screenshot({ path: path.join(directory, `${iteration}.png`) }).catch(() => {})
      }
      finally {
        entry.state = await page.evaluate(() => ({ coreLoaded: typeof window.Artplayer, pluginLoaded: typeof window.artplayerPluginHlsControl, workers: window.workerEvidence, media: window.direct?.state(), events: window.direct?.records, sdk: { version: window.Hls?.version, level: window.direct?.hls.currentLevel, audioTrack: window.direct?.hls.audioTrack } })).catch(error => ({ error: error.message }))
        await context.tracing.stop({ path: path.join(directory, `${iteration}.zip`) }).catch((error) => {
          entry.traceError = error.message
        })
        await context.close().catch((error) => {
          entry.closeError = error.message
        })
        if (entry.state.error || entry.errors.length || entry.traceError || entry.closeError) {
          entry.status = 'failed'
          entry.failure ||= entry.state.error || entry.traceError || entry.closeError || entry.errors.join('; ')
        }
      }
      console.log(JSON.stringify({ iteration, status: entry.status, failure: entry.failure, media: entry.state.media }))
    }
  }
  finally {
    await browser?.close()
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
    fs.writeFileSync(path.join(directory, 'report.json'), `${JSON.stringify({ version, iterations, transport, teardown, worker, host, plugin, sdkLogs, workerObserver, runnerSHA256, observerSHA256, browserVersion, release, inputs: Object.fromEntries([...files].map(([file, bytes]) => [file, hash(bytes)])), results }, null, 2)}\n`)
    console.log(`Diagnostic report: ${directory}`)
  }
  return results
}

const { values } = parseArgs({ options: { 'version': { type: 'string', default: '1.7.2' }, 'iterations': { type: 'string', default: '5' }, 'transport': { type: 'string', default: 'http' }, 'teardown': { type: 'string', default: 'reset-first' }, 'no-worker': { type: 'boolean', default: false }, 'host': { type: 'string', default: 'direct' }, 'plugin': { type: 'boolean', default: false }, 'sdk-logs': { type: 'boolean', default: false }, 'observe-workers': { type: 'boolean', default: false } } })
diagnose({ version: values.version, iterations: Number(values.iterations), transport: values.transport, teardown: values.teardown, worker: !values['no-worker'], host: values.host, plugin: values.plugin, sdkLogs: values['sdk-logs'], workerObserver: values['observe-workers'] }).then((results) => {
  process.exitCode = results.some(result => result.status !== 'passed') ? 1 : 0
}).catch((error) => {
  console.error(error)
  process.exitCode = 1
})

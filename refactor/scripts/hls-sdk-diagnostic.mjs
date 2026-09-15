import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'
import { expect, firefox } from '@playwright/test'
import { snapshotHlsControllers } from '../../test/helpers/hls-controller-state.js'
import { observeWorkers } from '../../test/helpers/worker-observer.js'
import { ensureArchive, hash, readMember, refactorDir } from './releases.mjs'

// Direct SDK control: no ArtPlayer or plugin is loaded, and no worker output is substituted.
export async function diagnose({ version = '1.7.2', iterations = 5, transport = 'http', teardown = 'reset-first', worker = true, host = 'direct', plugin = false, sdkLogs = false, workerObserver = false, controllerState = false, captureBeforeDestroy = false, switchBoundary = 'switched', prefill = false, sequence } = {}) {
  const runnerSHA256 = hash(fs.readFileSync(new URL(import.meta.url)))
  const observerSHA256 = hash(fs.readFileSync(new URL('../../test/helpers/worker-observer.js', import.meta.url)))
  const controllerObserverSHA256 = hash(fs.readFileSync(new URL('../../test/helpers/hls-controller-state.js', import.meta.url)))
  assert(Number.isInteger(iterations) && iterations > 0 && iterations <= 50)
  assert(['http', 'route'].includes(transport))
  assert(['reset-first', 'sdk-first'].includes(teardown))
  assert(['direct', 'published', 'candidate'].includes(host))
  assert(['switched', 'selected', 'immediate'].includes(switchBoundary))
  assert(!plugin || host !== 'direct', 'Plugin comparison requires an ArtPlayer host')
  const matrix = JSON.parse(fs.readFileSync(path.join(refactorDir, 'baselines/hls-sdk-matrix.json')))
  const versions = sequence || Array.from({ length: iterations }, () => version)
  assert(Array.isArray(versions) && versions.length > 0 && versions.length <= 50)
  const releases = [...new Set(versions)].map((version) => {
    const release = matrix.releases.find(item => item.version === version)
    assert(release, 'Use a frozen SDK version')
    return release
  })
  const media = path.join(refactorDir, '../test/browser/media/hls')
  const manifest = JSON.parse(fs.readFileSync(path.join(media, 'manifest.json')))
  const files = new Map()
  for (const [name, expected] of Object.entries(manifest.files)) {
    const bytes = fs.readFileSync(path.join(media, name))
    assert.equal(hash(bytes), expected.sha256)
    files.set(`/${name}`, bytes)
  }
  files.set('/grouped.m3u8', fs.readFileSync(path.join(refactorDir, '../test/browser/fixtures/hls-grouped.m3u8')))
  for (const release of releases) {
    const sdk = readMember(await ensureArchive(release), 'package/dist/hls.min.js')
    assert.equal(hash(sdk), release.files['package/dist/hls.min.js'])
    files.set(`/hls-${release.version}.js`, sdk)
  }
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
    for (let iteration = 0; iteration < versions.length; iteration++) {
      const context = await browser.newContext()
      await context.tracing.start({ screenshots: true, snapshots: true, sources: true })
      const page = await context.newPage()
      const wait = predicate => expect.poll(() => page.evaluate(predicate), { timeout: 7000 }).toBe(true)
      const entry = { iteration, version: versions[iteration], status: 'running', errors: [], requests: [], phase: 'setup', crashes: [] }
      results.push(entry)
      if (controllerState) {
        entry.observedEvents = []
        await page.exposeFunction('__recordHlsControllerState', (event) => {
          entry.observedEvents.push({ receivedDuring: entry.phase, ...event })
          if (entry.observedEvents.length > 400)
            entry.observedEvents.shift()
        })
      }
      page.on('pageerror', error => entry.errors.push(error.message))
      page.on('crash', () => {
        entry.errors.push('page crashed')
        entry.crashes.push({ phase: entry.phase, at: new Date().toISOString() })
      })
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
        if (controllerState)
          await page.addScriptTag({ content: `window.snapshotHlsControllers = ${snapshotHlsControllers.toString()};` })
        if (workerObserver)
          await page.evaluate(observeWorkers)
        await page.addScriptTag({ url: `${origin}/hls-${entry.version}.js` })
        assert.equal(await page.evaluate(() => window.Hls.version), entry.version)
        if (host !== 'direct')
          await page.addScriptTag({ url: `${origin}/artplayer.js` })
        if (plugin)
          await page.addScriptTag({ url: `${origin}/plugin.js` })
        await page.evaluate(({ worker, teardown, host, plugin, sdkLogs, controllerState }) => {
          let video
          let hls
          let art
          const records = []
          const buffer = ranges => Array.from({ length: ranges.length }, (_, index) => [ranges.start(index), ranges.end(index)])
          const state = () => ({ time: video.currentTime, readyState: video.readyState, height: video.videoHeight, paused: video.paused, frames: video.getVideoPlaybackQuality().totalVideoFrames, buffered: buffer(video.buffered), seekable: buffer(video.seekable) })
          const record = (event, data) => {
            const snapshot = { at: performance.now(), event, data, media: state(), ...(controllerState ? { controllers: window.snapshotHlsControllers(hls) } : {}) }
            records.push(snapshot)
            if (controllerState)
              window.__recordHlsControllerState(snapshot).catch(() => {})
            if (records.length > 400)
              records.shift()
          }
          const logger = Object.fromEntries(['trace', 'debug', 'log', 'warn', 'info', 'error'].map(level => [level, (...args) => record(`log:${level}`, args.map(String))]))
          function attach(element) {
            video = element
            hls = new window.Hls({ enableWorker: worker, startLevel: 0, debug: sdkLogs ? logger : false })
            const eventKeys = ['ERROR', 'AUDIO_TRACKS_UPDATED', 'AUDIO_TRACK_SWITCHING', 'AUDIO_TRACK_SWITCHED', 'LEVEL_SWITCHING', 'LEVEL_SWITCHED', 'FRAG_BUFFERED', 'BUFFER_FLUSHED']
            if (controllerState)
              eventKeys.push('BUFFER_FLUSHING', 'FRAG_LOADING', 'FRAG_LOADED', 'BUFFER_APPENDED')
            for (const key of eventKeys) {
              hls.on(window.Hls.Events[key], (_, data) => record(key, { id: data.id, type: data.type, startOffset: data.startOffset, endOffset: typeof data.endOffset === 'number' && !Number.isFinite(data.endOffset) ? String(data.endOffset) : data.endOffset, level: typeof data.level === 'number' ? data.level : undefined, fatal: data.fatal, details: typeof data.details === 'string' ? data.details : undefined, frag: data.frag && { type: data.frag.type, sn: data.frag.sn, level: data.frag.level }, tracks: data.audioTracks?.map(track => ({ id: track.id, name: track.name, group: track.groupId })) }))
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
            record,
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
        }, { worker, teardown, host, plugin, sdkLogs, controllerState })
        entry.phase = 'initial-playback'
        await wait(() => window.direct.video?.readyState >= 3)
        await page.evaluate(() => window.direct.video.play())
        await wait(() => window.direct.video.currentTime > 0.3)
        if (prefill) {
          entry.phase = 'initial-prefill'
          await wait(() => {
            const video = window.direct.video
            return video.buffered.length === 1 && video.buffered.end(0) >= video.duration - 0.1
          })
        }
        entry.phase = 'low-group'
        await page.evaluate(() => {
          window.direct.hls.currentLevel = 0
        })
        await wait(() => window.direct.hls.audioTracks.length === 2 && window.direct.hls.audioTracks.every(track => track.groupId === 'low'))
        await page.evaluate((switchBoundary) => {
          window.direct.mark = performance.now()
          window.direct.hls.audioTrack = 1
          if (switchBoundary === 'immediate') {
            window.direct.record('high-group:requested', { boundary: switchBoundary, audioTrack: window.direct.hls.audioTrack })
            window.direct.hls.currentLevel = 1
          }
        }, switchBoundary)
        if (switchBoundary === 'switched') {
          await wait(() => window.direct.records.some(item => item.at >= window.direct.mark && item.event === 'AUDIO_TRACK_SWITCHED' && item.data.id === 1))
        }
        else if (switchBoundary === 'selected') {
          if (plugin)
            await expect(page.locator('.art-control-hls-audio .art-selector-value')).toHaveText('French', { timeout: 7000 })
          else
            await wait(() => window.direct.hls.audioTrack === 1)
        }
        entry.phase = 'high-group'
        if (switchBoundary !== 'immediate') {
          if (prefill) {
            entry.phase = 'low-prefill'
            await wait(() => {
              const video = window.direct.video
              return video.buffered.length === 1 && video.buffered.end(0) >= video.duration - 0.1
            })
            entry.phase = 'high-group'
          }
          await page.evaluate((switchBoundary) => {
            window.direct.record('high-group:requested', { boundary: switchBoundary, audioTrack: window.direct.hls.audioTrack })
            window.direct.hls.currentLevel = 1
          }, switchBoundary)
        }
        await wait(() => window.direct.video.videoHeight === 180 && window.direct.hls.audioTrack === 0)
        entry.phase = 'high-group-playback'
        await page.evaluate(() => {
          window.direct.playbackStart = window.direct.state()
        })
        await wait(() => {
          const current = window.direct.state()
          return !current.paused && current.height === 180 && current.time > window.direct.playbackStart.time + 0.3 && current.frames > window.direct.playbackStart.frames + 2
        })
        entry.highPlayback = await page.evaluate(() => ({ start: window.direct.playbackStart, end: window.direct.state() }))
        entry.phase = 'commentary-track'
        await page.evaluate(() => {
          window.direct.hls.audioTrack = 2
        })
        await wait(() => window.direct.records.some(item => item.event === 'AUDIO_TRACK_SWITCHED' && item.data.id === 2))
        entry.phase = 'return-low-group'
        await page.evaluate(() => {
          window.direct.hls.currentLevel = 0
        })
        await wait(() => window.direct.hls.audioTracks.length === 2)
        entry.phase = 'return-low-playback'
        await wait(() => window.direct.video.videoHeight === 90)
        await page.evaluate(() => {
          window.direct.playbackStart = window.direct.state()
        })
        await wait(() => {
          const current = window.direct.state()
          return !current.paused && current.height === 90 && current.time > window.direct.playbackStart.time + 0.3 && current.frames > window.direct.playbackStart.frames + 2
        })
        entry.lowPlayback = await page.evaluate(() => ({ start: window.direct.playbackStart, end: window.direct.state() }))
        if (captureBeforeDestroy) {
          entry.phase = 'capture-before-destroy'
          entry.beforeDestroy = await page.evaluate(() => ({ coreLoaded: typeof window.Artplayer, pluginLoaded: typeof window.artplayerPluginHlsControl, media: window.direct.state(), sdk: { version: window.Hls.version, workerEnabled: window.direct.hls.config.enableWorker, level: window.direct.hls.currentLevel, audioTrack: window.direct.hls.audioTrack }, events: window.direct.records }))
        }
        entry.phase = 'destroy-call'
        await page.evaluate(() => window.direct.destroy())
        entry.phase = 'after-destroy-state'
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
        entry.failurePhase = entry.status === 'failed' ? entry.phase : undefined
        entry.phase = 'final-state'
        entry.state = await page.evaluate(() => ({ coreLoaded: typeof window.Artplayer, pluginLoaded: typeof window.artplayerPluginHlsControl, workers: window.workerEvidence, media: window.direct?.state(), events: window.direct?.records, controllers: window.snapshotHlsControllers?.(window.direct?.hls), sdk: { version: window.Hls?.version, level: window.direct?.hls.currentLevel, audioTrack: window.direct?.hls.audioTrack, mainState: window.direct?.hls.streamController?.state, audioState: window.direct?.hls.audioStreamController?.state } })).catch(error => ({ error: error.message }))
        entry.phase = 'trace-stop'
        await context.tracing.stop({ path: path.join(directory, `${iteration}.zip`) }).catch((error) => {
          entry.traceError = error.message
        })
        entry.phase = 'context-close'
        await context.close().catch((error) => {
          entry.closeError = error.message
        })
        if (entry.state.error || entry.errors.length || entry.traceError || entry.closeError) {
          entry.status = 'failed'
          entry.failurePhase ||= entry.crashes[0]?.phase || (entry.state.error ? 'final-state' : entry.traceError ? 'trace-stop' : 'context-close')
          entry.failure ||= entry.state.error || entry.traceError || entry.closeError || entry.errors.join('; ')
        }
      }
      console.log(JSON.stringify({ iteration, version: entry.version, status: entry.status, failure: entry.failure, media: entry.state.media }))
    }
  }
  finally {
    await browser?.close()
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
    fs.writeFileSync(path.join(directory, 'report.json'), `${JSON.stringify({ version: sequence ? undefined : version, iterations: versions.length, sequence: versions, transport, teardown, worker, host, plugin, sdkLogs, workerObserver, controllerState, captureBeforeDestroy, switchBoundary, prefill, runnerSHA256, observerSHA256, controllerObserverSHA256, browserVersion, release: sequence ? undefined : releases[0], releases, inputs: Object.fromEntries([...files].map(([file, bytes]) => [file, hash(bytes)])), results }, null, 2)}\n`)
    console.log(`Diagnostic report: ${directory}`)
  }
  return results
}

const { values, tokens } = parseArgs({
  tokens: true,
  options: {
    'version': { type: 'string', default: '1.7.2' },
    'iterations': { type: 'string', default: '5' },
    'sequence': { type: 'string' },
    'transport': { type: 'string', default: 'http' },
    'teardown': { type: 'string', default: 'reset-first' },
    'host': { type: 'string', default: 'direct' },
    'no-worker': { type: 'boolean', default: false },
    'plugin': { type: 'boolean', default: false },
    'sdk-logs': { type: 'boolean', default: false },
    'observe-workers': { type: 'boolean', default: false },
    'controller-state': { type: 'boolean', default: false },
    'capture-before-destroy': { type: 'boolean', default: false },
    'switch-boundary': { type: 'string', default: 'switched' },
    'prefill': { type: 'boolean', default: false },
  },
})
assert(!values.sequence || !tokens.some(token => token.kind === 'option' && ['version', 'iterations'].includes(token.name)), 'Use --sequence or --version/--iterations, not both')
diagnose({ version: values.version, iterations: Number(values.iterations), transport: values.transport, teardown: values.teardown, worker: !values['no-worker'], host: values.host, plugin: values.plugin, sdkLogs: values['sdk-logs'], workerObserver: values['observe-workers'], controllerState: values['controller-state'], captureBeforeDestroy: values['capture-before-destroy'], switchBoundary: values['switch-boundary'], prefill: values.prefill, sequence: values.sequence?.split(',') }).then((results) => {
  process.exitCode = results.some(result => result.status !== 'passed') ? 1 : 0
}).catch((error) => {
  console.error(error)
  process.exitCode = 1
})

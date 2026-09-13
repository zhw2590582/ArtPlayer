import assert from 'node:assert/strict'
import { execFileSync, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { chromium, expect, firefox } from '@playwright/test'

// Windows verification only: owns its Yarn process tree and a separate report directory.
assert.equal(process.platform, 'win32', 'This replay uses Windows taskkill process-tree cleanup')
const root = fileURLToPath(new URL('../../', import.meta.url))
const evidenceRoot = path.join(root, 'refactor/.cache/asr05-editor')
fs.mkdirSync(evidenceRoot, { recursive: true })
const output = fs.mkdtempSync(path.join(evidenceRoot, 'run-'))
const report = { startedAt: new Date().toISOString(), node: process.version, platform: process.platform, output, browsers: [] }
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const lfHash = file => sha256(fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/gu, '\n'))
function sourceSnapshot() {
  const directory = path.join(root, 'packages/artplayer-plugin-asr/src')
  const files = fs.readdirSync(directory).sort().filter(name => name.endsWith('.ts')).map(name => `packages/artplayer-plugin-asr/src/${name}`)
  files.push('scripts/dev.js', 'scripts/utils.js', 'scripts/projects.js', 'scripts/rebuild.js', 'package.json', 'yarn.lock', 'packages/artplayer-plugin-asr/package.json')
  return Object.fromEntries(files.map(file => [file, lfHash(file)]))
}
report.head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', windowsHide: true }).trim()
report.sourceAndBuildLfSha256 = sourceSnapshot()
report.coreProd = { file: 'docs/compiled/artplayer.js', sha256: sha256(fs.readFileSync(path.join(root, 'docs/compiled/artplayer.js'))), lfSha256: lfHash('docs/compiled/artplayer.js') }
report.scriptSha256 = sha256(fs.readFileSync(fileURLToPath(import.meta.url)))
report.mediaSha256 = sha256(fs.readFileSync(path.join(root, 'docs/assets/sample/steve-jobs.mp4')))
const pageUrl = 'http://localhost:8082/?libs=./uncompiled/artplayer-plugin-asr/index.js&example=asr.local'
const scriptFiles = {
  '/compiled/artplayer.js': 'docs/compiled/artplayer.js',
  '/uncompiled/artplayer-plugin-asr/index.js': 'docs/uncompiled/artplayer-plugin-asr/index.js',
  '/assets/example/asr.local.js': 'docs/assets/example/asr.local.js',
}

async function verifyFreePort() {
  const probe = net.createServer()
  await new Promise((resolve, reject) => {
    probe.once('error', reject)
    probe.listen(8082, resolve)
  })
  await new Promise((resolve, reject) => probe.close(error => error ? reject(error) : resolve()))
}

async function validate(browserType) {
  const result = { engine: browserType.name(), navigations: [], requests: [], requestFailures: [], errors: [], consoleErrors: [], blockedAdvertising: [], responses: [], checks: [] }
  report.browsers.push(result)
  const browser = await browserType.launch({ headless: true })
  result.version = browser.version()
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true })
  const page = await context.newPage()
  let phase = 'initial-load'
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame())
      result.navigations.push({ url: frame.url(), phase })
  })
  const responseReads = []
  page.on('pageerror', error => result.errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error')
      result.consoleErrors.push({ text: message.text(), location: message.location() })
  })
  page.on('request', request => result.requests.push({ url: request.url(), method: request.method(), type: request.resourceType() }))
  page.on('requestfailed', request => result.requestFailures.push({ url: request.url(), error: request.failure()?.errorText, phase }))
  page.on('websocket', socket => result.requests.push({ url: socket.url(), type: 'websocket' }))
  page.on('response', (response) => {
    const pathname = new URL(response.url()).pathname
    if (!scriptFiles[pathname])
      return
    responseReads.push((async () => {
      const bytes = await response.body()
      const disk = fs.readFileSync(path.join(root, scriptFiles[pathname]))
      const captured = { url: response.url(), status: response.status(), sha256: sha256(bytes), diskSha256: sha256(disk), bytes: bytes.length }
      result.responses.push(captured)
      fs.writeFileSync(path.join(output, `${result.engine}-${path.basename(scriptFiles[pathname])}`), bytes)
      assert.equal(captured.sha256, captured.diskSha256, `Served file drift: ${pathname}`)
      assert.equal(captured.status, 200)
    })())
  })
  await page.route('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js*', async (route) => {
    result.blockedAdvertising.push(route.request().url())
    await route.abort('blockedbyclient')
  })
  await context.addInitScript(() => {
    localStorage.setItem('prod', 'true')
    window.asrContexts = []
    const NativeContext = window.AudioContext || window.webkitAudioContext
    window.AudioContext = class extends NativeContext {
      constructor(options) {
        super(options)
        window.asrContexts.push(this)
      }
    }
  })
  const statistics = page.locator('.art-layer-asr-local-statistics')
  const playControl = page.locator('.art-control-playAndPause')
  const chunks = () => statistics.textContent().then(text => Number(/Chunks: (\d+)/u.exec(text)?.[1] || 0))
  const nonzero = async () => {
    await expect.poll(async () => Number(/Current peak: (\d+)/u.exec(await statistics.textContent())?.[1] || 0), { timeout: 30000 }).toBeGreaterThan(0)
    await expect(page.locator('.art-layer-asr')).toContainText('Simulated local subtitle: audio chunk')
  }
  try {
    await page.goto(pageUrl)
    await expect.poll(() => page.evaluate(() => Boolean(window.art?.isReady && window.art?.plugins.artplayerPluginAsr)), { timeout: 30000 }).toBe(true)
    const editor = await page.evaluate(() => ({
      models: window.monaco.editor.getModels().filter(model => model.getLanguageId() === 'javascript').map(model => model.getValue()),
      coreVersion: window.Artplayer.version,
      pluginVersion: window.artplayerPluginAsr.version,
      source: window.art.video.currentSrc,
      userAgent: navigator.userAgent,
    }))
    result.editor = editor
    assert(editor.models.includes(fs.readFileSync(path.join(root, scriptFiles['/assets/example/asr.local.js']), 'utf8')))
    assert.equal(editor.source, 'http://localhost:8082/assets/sample/steve-jobs.mp4')
    await playControl.press('Enter')
    await nonzero()
    phase = 'capture'
    result.firstStatistics = await statistics.textContent()
    result.checks.push('Actual Monaco example and native playback produce nonzero PCM and simulated subtitle')
    await page.screenshot({ path: path.join(output, `${result.engine}-playing.png`), fullPage: true })

    await page.locator('.art-video-player').hover()
    await page.locator('.art-control-asr-local-stop').click()
    await expect(statistics).toContainText('Local capture stopped.')
    const stoppedAt = await page.evaluate(() => window.art.currentTime)
    await expect.poll(() => page.evaluate(() => window.art.currentTime), { timeout: 10000 }).toBeGreaterThan(stoppedAt + 0.8)
    await expect(statistics).toContainText('Local capture stopped.')
    assert.equal(await page.evaluate(() => window.art.playing), true)
    assert.deepEqual(await page.evaluate(() => window.asrContexts.map(context => context.state)), ['running'])
    result.checks.push('Stop ASR settles while native playback advances and capture statistics remain stopped')

    await playControl.press('Enter')
    await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(false)
    await playControl.press('Enter')
    await nonzero()
    const beforePause = await chunks()
    await playControl.press('Enter')
    await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(false)
    await page.waitForTimeout(600)
    assert.equal(await chunks(), beforePause)
    await playControl.press('Enter')
    await expect.poll(chunks).toBeGreaterThan(beforePause)
    assert.equal(await page.evaluate(() => window.asrContexts.length), 1)
    result.checks.push('Pause/play resumes after stop and ordinary pause preserves one native context')

    await page.evaluate(() => {
      window.asrOldArt = window.art
    })
    phase = 'run-cleanup'
    await page.locator('.run').click()
    await expect.poll(() => page.evaluate(() => Boolean(window.art !== window.asrOldArt && window.art?.isReady)), { timeout: 30000 }).toBe(true)
    await expect.poll(() => page.evaluate(() => window.asrContexts[0].state)).toBe('closed')
    assert.equal(await page.evaluate(() => window.asrOldArt.isDestroy), true)
    assert.equal(await page.evaluate(() => window.Artplayer.instances.length), 1)
    await expect(page.locator('.art-video-player')).toHaveCount(1)
    await playControl.press('Enter')
    await nonzero()
    phase = 'rerun-capture'
    assert.deepEqual(await page.evaluate(() => window.asrContexts.map(context => context.state)), ['closed', 'running'])
    result.checks.push('Actual Run Code destroys old player/context, installs one new player, and native sampling resumes')
    await page.screenshot({ path: path.join(output, `${result.engine}-rerun.png`), fullPage: true })
    phase = 'destroy-cleanup'
    await page.evaluate(() => window.art.destroy(true))
    await expect.poll(() => page.evaluate(() => window.asrContexts.every(context => context.state === 'closed'))).toBe(true)
    assert.equal(await page.evaluate(() => window.Artplayer.instances.length), 0)
    result.checks.push('Final destroy closes every observed native AudioContext and empties instance registry')
    await Promise.all(responseReads)
    for (const pathname of Object.keys(scriptFiles))
      assert(result.responses.some(response => new URL(response.url).pathname === pathname), `Missing actual served script: ${pathname}`)
    const unexpectedNetwork = result.requests.filter(({ url }) => {
      const parsed = new URL(url)
      return !['localhost', '127.0.0.1'].includes(parsed.hostname) && !['blob:', 'data:'].includes(parsed.protocol) && !result.blockedAdvertising.includes(url)
    })
    assert.deepEqual(unexpectedNetwork, [], 'Only local media/code and the explicitly aborted advertising request are permitted')
    const mediaUrl = 'http://localhost:8082/assets/sample/steve-jobs.mp4'
    result.expectedMediaCancellations = result.requestFailures.filter(({ url, error, phase }) => url === mediaUrl && ['net::ERR_ABORTED', 'NS_BINDING_ABORTED'].includes(error) && ['run-cleanup', 'destroy-cleanup'].includes(phase))
    assert.deepEqual(result.requestFailures.filter(failure => !result.blockedAdvertising.includes(failure.url) && !result.expectedMediaCancellations.includes(failure)), [], 'Unexpected failed local requests')
    assert.deepEqual(result.consoleErrors.filter(({ text, location }) => {
      const chromiumAdvertising = /^Failed to load resource: net::ERR_BLOCKED_BY_CLIENT(?:\.Inspector)?$/u.test(text) && result.blockedAdvertising.includes(location.url)
      const firefoxAdvertising = text.includes('Cross-Origin Request Blocked:') && result.blockedAdvertising.some(url => text.includes(url))
      return !chromiumAdvertising && !firefoxAdvertising
    }), [], 'Console errors must be attributable to the explicitly blocked advertising URL')
    assert.deepEqual(result.errors, [])
    assert.equal(result.navigations.filter(({ phase }) => phase === 'capture' || phase === 'rerun-capture').length, 0, 'The dev server reloaded the page during sampling')
    result.status = 'passed'
  }
  catch (error) {
    result.status = 'failed'
    result.error = error.stack
    await page.screenshot({ path: path.join(output, `${result.engine}-failure.png`), fullPage: true }).catch(() => {})
    throw error
  }
  finally {
    await Promise.allSettled(responseReads)
    await context.tracing.stop({ path: path.join(output, `${result.engine}-trace.zip`) })
    await browser.close()
  }
}

let server
let serverLog = ''
let docsWatcher
report.docsChanges = []
try {
  await verifyFreePort()
  docsWatcher = fs.watch(path.join(root, 'docs'), { recursive: true }, (event, filename) => report.docsChanges.push({ at: new Date().toISOString(), event, filename }))
  const yarn = path.join(root, 'refactor/.cache/toolchains/yarn-1.22.22/package/bin/yarn.js')
  server = spawn(process.execPath, [yarn, 'dev', 'artplayer-plugin-asr', '--no-open'], {
    cwd: root,
    windowsHide: true,
    env: { ...process.env, PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH}` },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  report.serverPid = server.pid
  report.serverCommand = [process.execPath, yarn, 'dev', 'artplayer-plugin-asr', '--no-open']
  server.stdout.on('data', (data) => {
    serverLog += data
  })
  server.stderr.on('data', (data) => {
    serverLog += data
  })
  await expect.poll(() => {
    assert.equal(server.exitCode, null, serverLog)
    return serverLog.includes('Watching') && serverLog.includes('Built in')
  }, { timeout: 30000 }).toBe(true)
  for (const browserType of [chromium, firefox]) {
    try {
      await validate(browserType)
    }
    catch (error) {
      process.exitCode = 1
      console.error(`${browserType.name()}: ${error.message}`)
    }
  }
  assert.deepEqual(sourceSnapshot(), report.sourceAndBuildLfSha256, 'ASR source/build configuration changed during validation; rerun for a stable candidate')
}
catch (error) {
  report.error = error.stack
  process.exitCode = 1
}
finally {
  docsWatcher?.close()
  if (server?.pid && server.exitCode === null) {
    report.serverCleanupExitCode = await new Promise((resolve) => {
      const kill = spawn('taskkill', ['/PID', String(server.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' })
      kill.once('exit', resolve)
    })
    try {
      assert.equal(report.serverCleanupExitCode, 0, 'Owned Yarn process tree cleanup failed')
      await verifyFreePort()
      report.port8082Released = true
    }
    catch (error) {
      report.cleanupError = error.stack
      process.exitCode = 1
    }
  }
  report.finishedAt = new Date().toISOString()
  fs.writeFileSync(path.join(output, 'server.log'), serverLog)
  fs.writeFileSync(path.join(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify({ output, browsers: report.browsers.map(({ engine, status }) => ({ engine, status })), error: report.error }, null, 2))
}

import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { chromium, firefox, webkit } from '@playwright/test'
import react from '@vitejs/plugin-react'
import ts from 'typescript'
import { build, preview } from 'vite'
import { packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { hash, readMember } from './releases.mjs'

assert.equal(process.version.slice(1), fs.readFileSync(path.join(workspace, '.node-version'), 'utf8').trim())
assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22')
const yarn = process.env.npm_execpath
assert(yarn && fs.existsSync(yarn))
const before = process.argv.includes('--before')
const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/react-consumer-'))
const consumer = consumerDirectory()
const report = { task: 'EX-01', before, node: process.version, source: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: workspace, encoding: 'utf8' }).trim(), packages: [], browsers: [], passed: false }
console.log(`React consumer evidence: ${output}`)
try {
  const dependencies = {}
  for (const name of ['artplayer', 'artplayer-plugin-danmuku', 'artplayer-plugin-document-pip']) {
    const archive = path.join(output, `${name}.tgz`)
    fs.writeFileSync(path.join(output, `${name}-pack.log`), run([yarn, 'pack', '--filename', archive], path.join(workspace, 'packages', name)))
    dependencies[name] = `file:${archive.replaceAll('\\', '/')}`
    report.packages.push({ name, archive, sha256: hash(fs.readFileSync(archive)) })
  }
  const rootManifest = JSON.parse(fs.readFileSync(path.join(workspace, 'package.json'), 'utf8'))
  for (const name of ['react', 'react-dom', '@types/react', '@types/react-dom']) dependencies[name] = rootManifest.devDependencies[name]
  writeJson(path.join(consumer, 'package.json'), { name: 'react-artplayer-isolated-consumer', private: true, type: 'module', dependencies })
  fs.writeFileSync(path.join(output, 'install.log'), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
  const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
  fs.writeFileSync(path.join(output, 'consumer-yarn.lock'), lock)
  fs.writeFileSync(path.join(output, 'frozen.log'), run([yarn, 'install', '--offline', '--frozen-lockfile', '--force', '--ignore-scripts', '--non-interactive'], consumer))
  assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock)
  for (const pkg of report.packages) {
    for (const member of packedFiles(pkg.archive)) {
      assert.deepEqual(fs.readFileSync(path.join(consumer, 'node_modules', pkg.name, member.replace(/^package\//, ''))), readMember(pkg.archive, member))
    }
  }
  const example = path.join(workspace, 'example/react.js')
  fs.cpSync(path.join(example, 'src'), path.join(consumer, 'src'), { recursive: true })
  fs.copyFileSync(path.join(example, 'index.html'), path.join(consumer, 'index.html'))
  fs.copyFileSync(path.join(example, 'tsconfig.json'), path.join(consumer, 'tsconfig.json'))
  if (before) {
    const old = execFileSync('git', ['show', '3e39fc745f4dc98eba678ca081e86c1d3cc965cd:example/react.js/src/Player.tsx'], { cwd: workspace })
    fs.writeFileSync(path.join(consumer, 'src/Player.tsx'), old)
    report.beforeWrapper = hash(old)
  }
  for (const file of ['lifecycle.tsx', 'consumer.tsx']) fs.copyFileSync(path.join(workspace, 'test/react', file), path.join(consumer, file))
  fs.writeFileSync(path.join(consumer, 'harness.html'), '<!doctype html><html><body><div id="root"></div><script type="module" src="/lifecycle.tsx"></script></body></html>')
  fs.mkdirSync(path.join(consumer, 'public'))
  const media = fs.readFileSync(path.join(workspace, 'test/browser/media/pattern.mp4'))
  fs.writeFileSync(path.join(consumer, 'public/pattern.mp4'), media)
  fs.copyFileSync(path.join(example, 'public/vite.svg'), path.join(consumer, 'public/vite.svg'))
  report.media = { file: 'test/browser/media/pattern.mp4', sha256: hash(media) }
  report.inputs = Object.fromEntries(['src/Player.tsx', 'src/player-options.ts', 'src/App.tsx', 'src/main.tsx', 'index.html', 'lifecycle.tsx', 'consumer.tsx'].map(file => [file, hash(fs.readFileSync(path.join(consumer, file)))]))
  const config = ts.readConfigFile(path.join(consumer, 'tsconfig.json'), ts.sys.readFile)
  assert.equal(config.error, undefined)
  const parsed = ts.parseJsonConfigFileContent({ ...config.config, include: ['src', 'consumer.tsx', 'lifecycle.tsx'] }, ts.sys, consumer)
  assert.deepEqual(parsed.errors, [])
  const host = ts.createCompilerHost(parsed.options)
  host.getCurrentDirectory = () => consumer
  const program = ts.createProgram(parsed.fileNames, parsed.options, host)
  const diagnostics = ts.getPreEmitDiagnostics(program).map(d => ({ code: d.code, file: d.file?.fileName, text: ts.flattenDiagnosticMessageText(d.messageText, '\n') }))
  report.types = { version: ts.version, diagnostics }
  assert.deepEqual(diagnostics, [])
  const library = fs.realpathSync(path.dirname(ts.sys.getExecutingFilePath()))
  for (const file of program.getSourceFiles()) {
    const actual = fs.realpathSync(file.fileName)
    assert(actual.startsWith(fs.realpathSync(consumer) + path.sep) || (path.dirname(actual) === library && /^lib\..*\.d\.ts$/.test(path.basename(actual))), `Types escaped consumer: ${actual}`)
  }
  for (const mode of ['development', 'production']) {
    const outDir = path.join(output, mode)
    await build({ root: consumer, configFile: false, plugins: [react()], mode, define: { 'process.env.NODE_ENV': JSON.stringify(mode) }, build: { outDir, emptyOutDir: false, rollupOptions: { input: { app: path.join(consumer, 'index.html'), harness: path.join(consumer, 'harness.html') } } } })
    // Windows can assign browser-blocked ports (observed: 6566) for port 0.
    const server = await preview({ root: consumer, configFile: false, build: { outDir }, preview: { host: '127.0.0.1', port: 4173, open: false } })
    const address = server.httpServer.address()
    const base = `http://127.0.0.1:${address.port}`
    try {
      for (const [engine, type] of Object.entries({ chromium, firefox, webkit })) {
        const browser = await type.launch()
        const row = { mode, engine, version: browser.version(), checks: [], passed: false }
        report.browsers.push(row)
        const page = await browser.newPage()
        const unexpected = []
        page.on('pageerror', error => unexpected.push(error.message))
        await page.route('https://artplayer.org/assets/sample/danmuku.xml', route => route.fulfill({ contentType: 'text/xml', body: '<i><d p="0,1,25,16777215,0,0,0,0">React lifecycle sample</d></i>' }))
        await page.route('https://artplayer.org/assets/sample/video.mp4', route => route.fulfill({ contentType: 'video/mp4', body: media }))
        const snapshot = () => page.evaluate(() => window.probe.snapshot())
        const wait = async (count) => {
          await page.waitForFunction(count => window.probe?.snapshot().active === count, count)
          return snapshot()
        }
        try {
          await page.goto(`${base}/harness.html`)
          let state = await wait(1)
          assert.equal(state.created, mode === 'development' ? 2 : 1)
          assert.equal(state.players, 1)
          assert.equal(await page.locator('#player').getAttribute('data-consumer'), 'preserved')
          await page.waitForFunction(() => window.probe.current().plugins.artplayerPluginDanmuku && window.probe.current().plugins.artplayerPluginDocumentPip)
          row.checks.push('strict-mode-and-plugin-registration')
          const original = state.created
          await page.evaluate(() => window.probe.render())
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
          assert.equal((await snapshot()).created, original)
          row.checks.push('stable-props-retain-instance')
          for (const mode of ['callback', 'option']) {
            const prior = (await snapshot()).created
            await page.evaluate(mode => window.probe.render(mode), mode)
            await page.waitForFunction(prior => window.probe.snapshot().created === prior + 1, prior)
            state = await wait(1)
            assert(state.records.slice(0, -1).every(record => record.isDestroy && record.destroyed === 1))
            assert.equal(state.players, 1)
            row.checks.push(`${mode}-change-cleans-old-instance`)
          }
          await page.waitForFunction(() => window.probe.current().duration > 1)
          await page.evaluate(() => window.probe.current().play())
          await page.waitForFunction(() => window.probe.current().currentTime > 0.15)
          row.media = await page.evaluate(async () => {
            const art = window.probe.current()
            art.pause()
            const time = art.currentTime
            const seeked = new Promise(resolve => art.video.addEventListener('seeked', resolve, { once: true }))
            art.currentTime = 1
            await seeked
            const canvas = document.createElement('canvas')
            canvas.width = 8
            canvas.height = 8
            const context = canvas.getContext('2d')
            context.drawImage(art.video, 0, 0, 8, 8)
            return { time, paused: art.playing === false, seek: art.currentTime, width: art.video.videoWidth, rgba: Array.from(context.getImageData(0, 0, 8, 8).data) }
          })
          assert(row.media.time > 0.15 && row.media.paused && Math.abs(row.media.seek - 1) < 0.1 && row.media.width > 0)
          assert(row.media.rgba.some((value, index) => index % 4 !== 3 && value > 50))
          row.checks.push('native-play-pause-seek-and-decoded-pixels')
          await page.evaluate(() => window.probe.render('siblings'))
          await wait(2)
          const retainedId = await page.evaluate(() => window.probe.current().id)
          await page.evaluate(() => window.probe.render())
          state = await wait(1)
          assert.equal(await page.evaluate(() => window.probe.current().id), retainedId)
          assert.equal(state.players, 1)
          row.checks.push('sibling-unmount-preserves-other-instance')
          await page.evaluate(() => window.probe.render('optional'))
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
          await wait(1)
          row.checks.push('optional-getInstance')
          await page.evaluate(() => window.probe.render('empty'))
          state = await wait(0)
          assert.equal(state.players, 0)
          assert.equal(state.videos, 0)
          assert(state.records.every(record => record.isDestroy && record.destroyed === 1))
          row.checks.push('unmount-cleans-recorded-instances-and-dom')
          await page.evaluate(() => window.probe.render())
          await wait(1)
          row.checks.push('remount-after-empty')
          await page.evaluate(() => window.probe.render('throw'))
          await page.locator('#caught').waitFor()
          state = await snapshot()
          row.callbackFailure = state
          assert.equal(state.active, 0, 'Throwing getInstance leaked a player')
          assert(state.records.every(record => record.isDestroy && record.destroyed === 1))
          assert.equal(state.errors.length, mode === 'development' ? 2 : 1)
          assert(state.errors.every(error => error.same && error.message === 'react-consumer-callback-failure'))
          row.checks.push('callback-exception-cleanup-and-original-error')
          await page.evaluate(() => window.probe.render('throw-cleanup'))
          await page.waitForFunction(count => window.probe.snapshot().errors.length === count, mode === 'development' ? 4 : 2)
          state = await snapshot()
          assert.equal(state.active, 0)
          assert.equal(state.players, 0)
          assert(state.records.every(record => record.isDestroy && record.destroyed === 1))
          assert(state.errors.every(error => error.same && error.message === 'react-consumer-callback-failure'))
          row.checks.push('cleanup-error-preserves-primary-callback-error')
          assert.deepEqual(unexpected, [])
          await page.goto(base)
          await page.locator('.art-video-player').waitFor()
          await page.waitForFunction(() => document.querySelector('video')?.readyState >= 2)
          row.checks.push('original-app-entry-loads-media')
          assert.deepEqual(unexpected, [])
          row.passed = true
        }
        catch (error) {
          row.error = error.stack
          await page.screenshot({ path: path.join(output, `${mode}-${engine}-failure.png`) })
          throw error
        }
        finally {
          await browser.close()
          writeJson(path.join(output, 'report.json'), report)
        }
      }
    }
    finally {
      await new Promise(resolve => server.httpServer.close(resolve))
    }
  }
  report.passed = true
}
finally {
  writeJson(path.join(output, 'report.json'), report)
  removeConsumer(consumer)
}
console.log('React installed consumer types and six native browser profiles passed.')

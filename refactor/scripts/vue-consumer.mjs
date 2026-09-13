import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { chromium, firefox, webkit } from '@playwright/test'
import vue from '@vitejs/plugin-vue'
import { build, preview } from 'vite'
import { packedFiles } from '../../scripts/package-check.mjs'
import { consumerDirectory, removeConsumer, run, workspace, writeJson } from '../../scripts/package-consumer.mjs'
import { hash, readMember } from './releases.mjs'

assert.equal(process.version.slice(1), fs.readFileSync(path.join(workspace, '.node-version'), 'utf8').trim())
assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22')
assert(process.argv.slice(2).every(arg => arg === '--before'))
const yarn = process.env.npm_execpath
assert(yarn && fs.existsSync(yarn))
const before = process.argv.includes('--before')
const output = fs.mkdtempSync(path.join(workspace, 'refactor/.cache/vue-consumer-'))
const consumer = consumerDirectory()
const report = { task: 'EX-02', before, node: process.version, source: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: workspace, encoding: 'utf8' }).trim(), packages: [], browsers: [], passed: false }
console.log(`Vue consumer evidence: ${output}`)
try {
  const dependencies = {}
  for (const name of ['artplayer', 'artplayer-plugin-danmuku', 'artplayer-plugin-document-pip']) {
    const archive = path.join(output, `${name}.tgz`)
    fs.writeFileSync(path.join(output, `${name}-pack.log`), run([yarn, 'pack', '--filename', archive], path.join(workspace, 'packages', name)))
    dependencies[name] = `file:${archive.replaceAll('\\', '/')}`
    report.packages.push({ name, archive, sha256: hash(fs.readFileSync(archive)) })
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(workspace, 'package.json'), 'utf8'))
  dependencies.vue = manifest.devDependencies.vue
  const devDependencies = { 'vue-tsc': manifest.devDependencies['vue-tsc'], 'typescript': manifest.devDependencies.typescript }
  writeJson(path.join(consumer, 'package.json'), { name: 'vue-artplayer-isolated-consumer', private: true, type: 'module', dependencies, devDependencies })
  fs.writeFileSync(path.join(output, 'install.log'), run([yarn, 'install', '--offline', '--ignore-scripts', '--non-interactive'], consumer))
  const lock = fs.readFileSync(path.join(consumer, 'yarn.lock'))
  fs.writeFileSync(path.join(output, 'consumer-yarn.lock'), lock)
  fs.writeFileSync(path.join(output, 'frozen.log'), run([yarn, 'install', '--offline', '--frozen-lockfile', '--force', '--ignore-scripts', '--non-interactive'], consumer))
  assert.deepEqual(fs.readFileSync(path.join(consumer, 'yarn.lock')), lock)
  for (const pkg of report.packages) {
    for (const member of packedFiles(pkg.archive)) assert.deepEqual(fs.readFileSync(path.join(consumer, 'node_modules', pkg.name, member.replace(/^package\//, ''))), readMember(pkg.archive, member))
  }
  const example = path.join(workspace, 'example/vue.js')
  fs.cpSync(path.join(example, 'src'), path.join(consumer, 'src'), { recursive: true })
  for (const file of ['index.html', 'tsconfig.json']) fs.copyFileSync(path.join(example, file), path.join(consumer, file))
  if (before) {
    const old = execFileSync('git', ['show', '4df96893649ee0d3ffe1504af0609c3c6e023409:example/vue.js/src/Player.vue'], { cwd: workspace })
    fs.writeFileSync(path.join(consumer, 'src/Player.vue'), old)
    report.beforeWrapper = hash(old)
  }
  for (const file of ['Lifecycle.vue', 'entry.ts', 'LegacyConsumer.vue', 'legacy-entry.js', 'consumer.ts']) fs.copyFileSync(path.join(workspace, 'test/vue', file), path.join(consumer, file))
  for (const [file, entry] of [['harness.html', 'entry.ts'], ['legacy.html', 'legacy-entry.js']]) fs.writeFileSync(path.join(consumer, file), `<!doctype html><html><body><div id="root"></div><script type="module" src="/${entry}"></script></body></html>`)
  fs.mkdirSync(path.join(consumer, 'public'))
  const media = fs.readFileSync(path.join(workspace, 'test/browser/media/pattern.mp4'))
  fs.writeFileSync(path.join(consumer, 'public/pattern.mp4'), media)
  fs.copyFileSync(path.join(example, 'public/favicon.ico'), path.join(consumer, 'public/favicon.ico'))
  report.media = { file: 'test/browser/media/pattern.mp4', sha256: hash(media) }
  report.inputs = Object.fromEntries(['src/Player.vue', 'src/player-options.ts', 'src/App.vue', 'src/main.ts', 'index.html', 'Lifecycle.vue', 'entry.ts', 'LegacyConsumer.vue', 'legacy-entry.js', 'consumer.ts'].map(file => [file, hash(fs.readFileSync(path.join(consumer, file)))]))
  const config = JSON.parse(fs.readFileSync(path.join(consumer, 'tsconfig.json'), 'utf8'))
  config.include = ['src', 'Lifecycle.vue', 'entry.ts', 'consumer.ts']
  writeJson(path.join(consumer, 'tsconfig.json'), config)
  const typeLog = run([path.join(consumer, 'node_modules/vue-tsc/bin/vue-tsc.js'), '-p', 'tsconfig.json', '--noEmit', '--listFiles', '--pretty', 'false'], consumer)
  fs.writeFileSync(path.join(output, 'types.log'), typeLog)
  const files = typeLog.trim().split(/\r?\n/)
  for (const file of files) {
    const actual = fs.realpathSync(file)
    assert(actual.startsWith(fs.realpathSync(consumer) + path.sep), `Types escaped consumer: ${actual}`)
  }
  report.types = { vueTsc: manifest.devDependencies['vue-tsc'], typescript: manifest.devDependencies.typescript, vue: dependencies.vue, files: files.length, isolated: true, negativeCases: 3 }
  for (const mode of ['development', 'production']) {
    const outDir = path.join(output, mode)
    await build({ root: consumer, configFile: false, plugins: [vue({ isProduction: mode === 'production' })], mode, define: { 'process.env.NODE_ENV': JSON.stringify(mode) }, build: { outDir, emptyOutDir: false, rollupOptions: { input: { app: path.join(consumer, 'index.html'), harness: path.join(consumer, 'harness.html'), legacy: path.join(consumer, 'legacy.html') } } } })
    const server = await preview({ root: consumer, configFile: false, build: { outDir }, preview: { host: '127.0.0.1', port: 0, open: false } })
    const base = `http://127.0.0.1:${server.httpServer.address().port}`
    try {
      for (const [engine, type] of Object.entries({ chromium, firefox, webkit })) {
        const browser = await type.launch()
        const row = { mode, engine, version: browser.version(), checks: [], passed: false }
        report.browsers.push(row)
        const page = await browser.newPage()
        await page.addInitScript(() => {
          const active = new Set()
          let created = 0
          const NativeWorker = window.Worker
          window.Worker = class extends NativeWorker {
            constructor(url, options) {
              super(url, options)
              active.add(this)
              created++
            }

            terminate() {
              active.delete(this)
              return super.terminate()
            }
          }
          window.workerProbe = () => ({ active: active.size, created })
        })
        const unexpected = []
        page.on('pageerror', error => unexpected.push(error.message))
        await page.route('https://artplayer.org/assets/sample/danmuku.xml', route => route.fulfill({ contentType: 'text/xml', body: '<i><d p="0,1,25,16777215,0,0,0,0">Vue lifecycle sample</d></i>' }))
        await page.route('https://artplayer.org/assets/sample/video.mp4', route => route.fulfill({ contentType: 'video/mp4', body: media }))
        const snapshot = () => page.evaluate(() => window.vueProbe.snapshot())
        const act = action => page.evaluate(action => window.vueProbe.act(action), action)
        const wait = async (count) => {
          await page.waitForFunction(count => window.vueProbe?.snapshot().active === count, count)
          return snapshot()
        }
        try {
          await page.goto(`${base}/harness.html`)
          let state = await wait(1)
          assert.equal(state.created, 1)
          assert.equal(state.componentRef, true)
          assert.equal(state.exposesArt, false)
          assert.equal(await page.locator('.primary-player').count(), 1)
          await page.waitForFunction(() => window.vueProbe.current().plugins.artplayerPluginDanmuku && window.vueProbe.current().plugins.artplayerPluginDocumentPip)
          row.checks.push('mount-event-closed-component-ref-and-plugin-registration')
          const id = await page.evaluate(() => window.vueProbe.current().id)
          for (const mode of ['mutate', 'replace']) {
            await act(mode)
            assert.equal((await snapshot()).created, 1)
            assert.equal(await page.evaluate(() => window.vueProbe.current().id), id)
            assert.equal(await page.evaluate(() => window.vueProbe.current().option.url), '/pattern.mp4')
            row.checks.push(`${mode}-option-retains-mount-only-contract`)
          }
          await page.waitForFunction(() => window.vueProbe.current().duration > 1)
          await page.evaluate(() => window.vueProbe.current().play())
          await page.waitForFunction(() => window.vueProbe.current().currentTime > 0.15)
          row.media = await page.evaluate(async () => {
            const art = window.vueProbe.current()
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
          await page.evaluate(() => window.vueProbe.current().switchUrl('/pattern.mp4?api'))
          assert.equal(await page.evaluate(() => window.vueProbe.current().id), id)
          assert((await page.evaluate(() => window.vueProbe.current().url)).includes('?api'))
          row.checks.push('instance-api-updates-source-without-remount')
          await act('key')
          state = await wait(1)
          assert.equal(state.created, 2)
          assert.equal(state.records[0].destroyed, 1)
          assert.equal(await page.evaluate(() => window.vueProbe.current().option.url), '/pattern.mp4?replacement')
          row.checks.push('key-change-reconstructs-with-current-props')
          const retainedId = await page.evaluate(() => window.vueProbe.current().id)
          await act('siblings')
          await wait(2)
          await act('remove-sibling')
          await wait(1)
          assert.equal(await page.evaluate(() => window.vueProbe.current().id), retainedId)
          row.checks.push('sibling-cleanup-retains-other-instance')
          await act('bare')
          await wait(1)
          await act('remove-bare')
          state = await wait(0)
          assert.equal(state.players, 0)
          row.checks.push('optional-listener-and-unmount')
          const prior = state.created
          await act('cancel')
          assert.equal((await snapshot()).created, prior)
          row.checks.push('cancel-before-mount-does-not-allocate')
          for (let index = 0; index < 3; index++) {
            await act('show')
            await wait(1)
            await act('hide')
            state = await wait(0)
            assert.equal(state.players, 0)
            assert(state.records.every(record => record.isDestroy && record.destroyed === 1))
            assert.equal((await page.evaluate(() => window.workerProbe())).active, 0)
          }
          row.checks.push('three-mount-unmount-cycles-clean-once')
          await act('throw')
          state = await wait(1)
          assert.equal(state.errors.length, 1)
          assert.equal(state.errors[0].same, true)
          await act('hide')
          await wait(0)
          row.checks.push('vue-captured-listener-error-retains-instance-until-unmount')
          await act('unmount')
          await wait(0)
          await act('normal')
          row.checks.push('listener-triggered-unmount-cleans-created-instance')
          await act('cache')
          await wait(1)
          const cachedId = await page.evaluate(() => window.vueProbe.current().id)
          await act('deactivate')
          state = await wait(1)
          assert.equal(state.players, 0)
          await act('activate')
          assert.equal(await page.evaluate(() => window.vueProbe.current().id), cachedId)
          await page.evaluate(() => window.unmountVue())
          state = await wait(0)
          assert.equal(state.videos, 0)
          assert(state.records.every(record => record.isDestroy && record.destroyed === 1))
          row.final = state
          row.workers = await page.evaluate(() => window.workerProbe())
          assert(row.workers.created > 0)
          assert.equal(row.workers.active, 0)
          row.checks.push('keepalive-retains-on-deactivation-and-destroys-on-owner-unmount')
          assert.deepEqual(unexpected, [])
          await page.goto(`${base}/legacy.html`)
          await page.waitForFunction(() => Boolean(document.body.dataset.instance))
          assert.equal(await page.locator('#legacy-player').getAttribute('data-consumer'), 'preserved')
          await page.locator('#toggle').click()
          await page.waitForFunction(() => document.body.dataset.destroyed === 'yes')
          assert.equal(await page.locator('.art-video-player').count(), 0)
          await page.locator('#toggle').click()
          await page.locator('.art-video-player').waitFor()
          row.checks.push('plain-js-event-prop-usage-and-remount')
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
catch (error) {
  report.error = error.stack
  fs.writeFileSync(path.join(output, 'failure.log'), `${error.stack}\n${error.stdout || ''}\n${error.stderr || ''}`)
  throw error
}
finally {
  writeJson(path.join(output, 'report.json'), report)
  removeConsumer(consumer)
}
console.log('Vue installed consumer types and six native browser profiles passed.')

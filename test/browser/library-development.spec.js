import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { expect, test } from '@playwright/test'
import { startDevServer } from '../../scripts/library/server.ts'

const root = fileURLToPath(new URL('../../', import.meta.url))
const cache = path.join(root, 'refactor/.cache')

function removeFixture(directory) {
  if (fs.realpathSync(directory) !== directory || path.dirname(directory) !== fs.realpathSync(cache))
    throw new Error(`Refusing redirected fixture cleanup: ${directory}`)
  fs.rmSync(directory, { recursive: true, force: true })
}

test('typed development builds real assets and workers, watches edits and recovers from compilation errors', async ({ page }, testInfo) => {
  test.setTimeout(60000)
  const directory = fs.mkdtempSync(path.join(cache, 'library-development-'))
  const name = 'artplayer-plugin-build-probe'
  const source = path.join(directory, 'packages', name, 'src')
  fs.mkdirSync(source, { recursive: true })
  fs.cpSync(path.join(root, 'refactor/fixtures/build'), source, { recursive: true })
  fs.writeFileSync(path.join(source, '../package.json'), JSON.stringify({ name, version: '1.0.0' }))
  fs.mkdirSync(path.join(directory, 'docs'))
  fs.writeFileSync(path.join(directory, 'docs/index.html'), `<!doctype html><html><body><main></main>
<script src="/uncompiled/${name}/index.js"></script><script>
window.probe = artplayerPluginBuildProbe();
document.querySelector('main').textContent = String(probe.value);
</script></body></html>`)
  const module = pathToFileURL(path.join(root, 'scripts/dev.js')).href
  const code = `process.on('message', () => process.emit('SIGTERM'));
process.argv = [process.execPath, 'fixture.js', '${name}', '--no-open'];
await import(${JSON.stringify(module)});
process.disconnect();`
  const launcher = path.join(directory, 'launch.mjs')
  fs.writeFileSync(launcher, code)
  const child = spawn(process.execPath, [launcher], { cwd: directory, env: { ...process.env, ARTPLAYER_DEV_PORT: '0' }, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe', 'ipc'] })
  let output = ''
  child.stdout.on('data', (data) => {
    output += data
  })
  child.stderr.on('data', (data) => {
    output += data
  })
  const exited = new Promise(resolve => child.once('exit', resolve))
  try {
    await expect.poll(() => output, { timeout: 20000 }).toContain('Watching')
    expect(child.exitCode).toBeNull()
    const url = /Demo: (http:\/\/localhost:\d+)/.exec(output)[1]
    await page.goto(url)
    await expect(page.locator('main')).toHaveText('42')
    expect(await page.evaluate(() => window.probe.css)).toContain('#123abc')
    expect(await page.evaluate(() => window.probe.svg)).toContain('<svg')
    const workerResult = await page.evaluate(() => new Promise((resolve, reject) => {
      const worker = window.probe.createWorker()
      worker.onmessage = ({ data }) => {
        worker.terminate()
        resolve(data)
      }
      worker.onerror = (error) => {
        worker.terminate()
        reject(new Error(error.message))
      }
      worker.postMessage(21)
    }))
    expect(workerResult).toBe(22)
    const entry = path.join(source, 'index.ts')
    const original = fs.readFileSync(entry, 'utf8')
    const before = output.length
    fs.writeFileSync(entry, original.replace('add(20, 22)', 'add(20, 23)'))
    await expect.poll(() => output.slice(before), { timeout: 15000 }).toContain('Built in')
    await expect(page.locator('main')).toHaveText('43')
    const valid = output.length
    fs.writeFileSync(entry, 'export default function broken( {')
    await expect.poll(() => output.slice(valid), { timeout: 15000 }).toContain('Build error')
    expect(child.exitCode).toBeNull()
    const failed = output.length
    fs.writeFileSync(entry, original.replace('add(20, 22)', 'add(20, 24)'))
    await expect.poll(() => output.slice(failed), { timeout: 15000 }).toContain('Built in')
    await expect(page.locator('main')).toHaveText('44')
    const html = path.join(directory, 'docs/index.html')
    fs.appendFileSync(html, '<title>Docs edit reloaded</title>')
    await expect(page).toHaveTitle('Docs edit reloaded')
    await expect(page.locator('main')).toHaveText('44')
  }
  finally {
    await testInfo.attach('development-server.log', { body: output, contentType: 'text/plain' })
    const watchdog = setTimeout(() => child.kill(), 5000)
    if (child.connected)
      child.send('close')
    const exitCode = await exited
    clearTimeout(watchdog)
    removeFixture(directory)
    expect(exitCode, 'Dev CLI must close its resources and exit naturally').toBe(0)
  }
})

test('actual docs editor runs TypeScript and plays and seeks local media through the owned server', async ({ page, browser }, testInfo) => {
  test.setTimeout(60000)
  const errors = []
  const pageErrors = []
  const service = await startDevServer({ root: path.join(root, 'docs'), port: 0, onError: error => errors.push(error.message) })
  page.on('pageerror', error => pageErrors.push(error.message))
  await page.route('https://**/*', route => route.fulfill({ status: 200, body: '' }))
  await page.addInitScript((origin) => {
    if (location.origin === origin)
      localStorage.setItem('ts', 'true')
  }, service.url)
  try {
    const code = 'const typed: number = 17; window.devServerTyped = typed; var art = new Artplayer({container:".artplayer-app",url:"/assets/sample/video.mp4",muted:true});'
    await page.goto(`${service.url}/?code=${encodeURIComponent(code)}`)
    await page.waitForFunction(() => window.art?.isReady && window.devServerTyped === 17)
    await page.evaluate(() => window.art.play())
    await page.waitForFunction(() => window.art.currentTime > 0.1)
    const target = await page.evaluate(() => {
      window.art.pause()
      const target = Math.min(2, window.art.duration / 2)
      window.art.seek = target
      return target
    })
    await page.waitForFunction(target => Math.abs(window.art.currentTime - target) < 0.3 && !window.art.video.seeking, target)
    const frameAlpha = await page.evaluate(() => {
      const video = window.art.video
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      context.drawImage(video, 0, 0)
      return context.getImageData(0, 0, 1, 1).data[3]
    })
    expect(frameAlpha).toBe(255)
    const state = await page.evaluate(() => ({
      version: window.Artplayer.version,
      typed: window.devServerTyped,
      currentTime: window.art.currentTime,
      paused: window.art.video.paused,
      width: window.art.video.videoWidth,
      height: window.art.video.videoHeight,
      error: window.art.video.error?.code || 0,
      editorModels: window.monaco.editor.getModels().length,
    }))
    expect(state.typed).toBe(17)
    expect(state.paused).toBe(true)
    expect(state.width).toBeGreaterThan(0)
    expect(state.height).toBeGreaterThan(0)
    expect(state.error).toBe(0)
    expect(state.editorModels).toBeGreaterThan(1)
    const inputs = ['docs/uncompiled/artplayer/index.js', 'docs/assets/sample/video.mp4'].map(file => ({ file, sha256: createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex') }))
    await testInfo.attach('actual-docs-server.json', { body: JSON.stringify({ browser: browser.version(), platform: process.platform, inputs, frameAlpha, state }, null, 2), contentType: 'application/json' })
    await page.screenshot({ path: testInfo.outputPath('actual-docs.png') })
    await page.goto('about:blank')
    expect(pageErrors).toEqual([])
  }
  finally {
    await service.close()
    expect(errors).toEqual([])
  }
})

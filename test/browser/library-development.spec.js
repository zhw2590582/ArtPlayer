import { spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { expect, test } from '@playwright/test'

const root = fileURLToPath(new URL('../../', import.meta.url))
const cache = path.join(root, 'refactor/.cache')

function removeFixture(directory) {
  if (fs.realpathSync(directory) !== directory || path.dirname(directory) !== fs.realpathSync(cache))
    throw new Error(`Refusing redirected fixture cleanup: ${directory}`)
  fs.rmSync(directory, { recursive: true, force: true })
}

async function freePort() {
  const server = net.createServer()
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, resolve)
  })
  const port = server.address().port
  await new Promise(resolve => server.close(resolve))
  return port
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
  const port = await freePort()
  const url = `http://localhost:${port}`
  const module = pathToFileURL(path.join(root, 'scripts/library/development.ts')).href
  const code = `import { runDevelop } from ${JSON.stringify(module)};
process.argv = [process.execPath, 'fixture.js', '${name}', '--no-open'];
await runDevelop({port:${port}});`
  const launcher = path.join(directory, 'launch.mjs')
  fs.writeFileSync(launcher, code)
  const child = spawn(process.execPath, [launcher], { cwd: directory, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
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
  }
  finally {
    await testInfo.attach('development-server.log', { body: output, contentType: 'text/plain' })
    child.kill()
    await exited
    removeFixture(directory)
  }
})

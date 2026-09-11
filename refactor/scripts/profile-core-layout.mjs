import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { chromium } from '@playwright/test'

const directory = fs.mkdtempSync('refactor/.cache/core22-profile-')
const port = 8086
const env = { ...process.env, ARTPLAYER_BROWSER_PORT: String(port) }
delete env.ARTPLAYER_BROWSER_ARTIFACTS
const server = spawn(process.execPath, ['test/browser/server.mjs'], { env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
let serverLog = ''
server.stdout.on('data', (chunk) => {
  serverLog += chunk
})
server.stderr.on('data', (chunk) => {
  serverLog += chunk
})
let browser
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Server startup timeout')), 60000)
    const close = (code) => {
      clearTimeout(timer)
      reject(new Error(`Server exited ${code}: ${serverLog}`))
    }
    server.once('exit', close)
    server.stdout.on('data', () => {
      if (serverLog.includes(`Browser test server: http://127.0.0.1:${port}`)) {
        clearTimeout(timer)
        server.removeListener('exit', close)
        resolve()
      }
    })
  })
  browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 960, height: 720 } })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${port}/test/player.html?core=candidate&chapter=published`)
  const manifest = await (await page.request.get(`http://127.0.0.1:${port}/test/manifest.json`)).json()
  fs.writeFileSync(path.join(directory, 'candidate.js'), await (await page.request.get(`http://127.0.0.1:${port}/candidate/artplayer.js`)).body())
  await page.evaluate(() => {
    window.profileSamples = []
    window.runProfile = async function (count) {
      function constructProfilePlayer() {
        return new window.Artplayer({ container: '.player', url: '/assets/sample/video.mp4', muted: true })
      }
      function destroyProfilePlayer(art) {
        art.destroy()
      }
      for (let index = 0; index < count; index++) {
        const start = performance.now()
        const art = constructProfilePlayer()
        const constructed = performance.now()
        try {
          await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Ready timed out')), 10000)
            art.once('ready', () => {
              clearTimeout(timer)
              resolve()
            })
          })
          await art.play()
          await new Promise(resolve => art.video.requestVideoFrameCallback(() => resolve()))
          art.pause()
          const beforeDestroy = performance.now()
          destroyProfilePlayer(art)
          window.profileSamples.push({ constructorMs: constructed - start, destroyMs: performance.now() - beforeDestroy })
        }
        finally {
          art.destroy()
        }
      }
    }
  })
  await page.evaluate(() => window.runProfile(10))
  await page.evaluate(() => {
    window.profileSamples = []
  })
  const client = await page.context().newCDPSession(page)
  await client.send('Profiler.enable')
  await client.send('Profiler.setSamplingInterval', { interval: 100 })
  await client.send('Profiler.start')
  await page.evaluate(() => window.runProfile(60))
  const { profile } = await client.send('Profiler.stop')
  const nodes = new Map(profile.nodes.map(node => [node.id, node]))
  const parents = new Map()
  for (const node of profile.nodes) {
    for (const child of node.children || []) parents.set(child, node.id)
  }
  const totals = { constructor: 0, destroy: 0, other: 0 }
  const groups = { constructor: new Map(), destroy: new Map() }
  for (let index = 0; index < profile.samples.length; index++) {
    const leaf = nodes.get(profile.samples[index])
    let node = leaf
    let group = 'other'
    while (node) {
      if (node.callFrame.functionName === 'constructProfilePlayer') {
        group = 'constructor'
        break
      }
      if (node.callFrame.functionName === 'destroyProfilePlayer') {
        group = 'destroy'
        break
      }
      node = nodes.get(parents.get(node.id))
    }
    const duration = profile.timeDeltas[index]
    totals[group] += duration
    if (group !== 'other') {
      const frame = leaf.callFrame
      const key = `${frame.functionName || '(anonymous)'}:${frame.url}:${frame.lineNumber + 1}`
      const result = groups[group].get(key) || { frame, sampledUs: 0, samples: 0 }
      result.sampledUs += duration
      result.samples++
      groups[group].set(key, result)
    }
  }
  const summary = {
    kind: 'diagnostic-cpu-sampling',
    browser: browser.version(),
    node: process.version,
    manifest,
    intervalRequestedUs: 100,
    warmup: 10,
    repetitions: 60,
    totalsUs: totals,
    groups: Object.fromEntries(Object.entries(groups).map(([name, values]) => [name, [...values.values()].sort((a, b) => b.sampledUs - a.sampledUs)])),
    timings: await page.evaluate(() => window.profileSamples),
    errors,
    limit: 'Instrumented Chromium source-build diagnostic only; not an uninstrumented published/candidate performance comparison. Native frames and sampling gaps may be charged to their JS caller. Timings must not be used for performance acceptance.',
  }
  assert.deepEqual(errors, [])
  assert.equal(await page.evaluate(() => window.Artplayer.instances.length), 0)
  fs.writeFileSync(path.join(directory, 'profile.cpuprofile'), JSON.stringify(profile))
  fs.writeFileSync(path.join(directory, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`)
  console.log(directory)
  for (const [name, rows] of Object.entries(summary.groups)) console.log(name, totals[name], rows.slice(0, 12).map(row => ({ name: row.frame.functionName, line: row.frame.lineNumber + 1, sampledUs: row.sampledUs, samples: row.samples })))
}
finally {
  try {
    await browser?.close()
  }
  finally {
    server.kill()
    fs.writeFileSync(path.join(directory, 'server.log'), serverLog)
  }
}

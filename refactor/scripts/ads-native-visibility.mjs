import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'
import { expect } from '@playwright/test'
import { nativeChrome } from '../../test/helpers/native-chrome.js'
import { hash } from './releases.mjs'

async function main() {
  const output = fs.mkdtempSync(path.resolve('refactor/.cache/ads-native-visibility-'))
  const artifact = path.resolve(process.env.ARTPLAYER_ADS_ARTIFACT || 'packages/artplayer-plugin-ads/dist/artplayer-plugin-ads.js')
  const code = fs.readFileSync(artifact, 'utf8')
  const port = Number(process.env.ARTPLAYER_BROWSER_PORT || 8084)
  const baseURL = `http://127.0.0.1:${port}`
  const server = spawn(process.execPath, ['test/browser/server.mjs'], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: process.env })
  let serverLog = ''
  server.stderr.on('data', (bytes) => {
    serverLog += bytes
  })
  let native
  let page
  const report = { task: 'PKG-ADS-05', artifact, sha256: hash(code), noDefaults: true, scope: 'Native selected/background tabs in isolated installed Chrome. Desktop window occlusion excluded by --disable-backgrounding-occluded-windows; no focus or visibility property emulation. Does not prove minimized-window or mobile lifecycle behavior.', cases: [], passed: false }
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Owned browser server startup timed out')), 30000)
      server.on('error', (error) => {
        clearTimeout(timeout)
        reject(error)
      })
      server.on('exit', (code) => {
        clearTimeout(timeout)
        reject(new Error(`Owned browser server exited: ${code}; ${serverLog}`))
      })
      server.stdout.on('data', (bytes) => {
        serverLog += bytes
        if (serverLog.includes('Browser test server:')) {
          clearTimeout(timeout)
          resolve()
        }
      })
    })
    report.manifest = await (await fetch(`${baseURL}/test/manifest.json`)).json()
    native = await nativeChrome()
    report.browser = native.browser.version()
    report.executable = native.executable
    page = native.context.pages()[0]
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await native.context.tracing.start({ screenshots: true, snapshots: true, sources: true })
    for (const core of ['published-4.5.5', 'published', 'candidate']) {
      for (const media of ['html', 'video']) {
        report.currentCase = { core, media }
        await page.goto(`${baseURL}/test/player.html?core=${core}`)
        // A stock browser may open this owned tab behind a startup tab/window.
        await page.bringToFront()
        await expect.poll(() => page.evaluate(() => document.hidden)).toBe(false)
        await page.addScriptTag({ content: code })
        await page.evaluate((media) => {
          window.visibilityEvents = []
          document.addEventListener('visibilitychange', event => window.visibilityEvents.push({ hidden: document.hidden, trusted: event.isTrusted }))
          window.adsSkips = 0
          window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, plugins: [window.artplayerPluginAds({ html: 'Native visibility ad', video: media === 'video' ? '/test/pattern.mp4' : '', muted: true, totalDuration: 30, playDuration: 0 })] })
          window.art.on('artplayerPluginAds:skip', () => window.adsSkips++)
          document.querySelector('#play').onclick = () => window.art.play()
        }, media)
        await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
        await page.locator('#play').click()
        const countdown = page.locator('.artplayer-plugin-ads-countdown')
        await expect(countdown).toBeVisible()
        if (media === 'video')
          await expect.poll(() => page.locator('.artplayer-plugin-ads-video').evaluate(video => video.currentTime)).toBeGreaterThan(0.2)
        const foreground = await native.context.newPage()
        await foreground.goto('data:text/html,<title>Ads visibility foreground</title>Foreground test tab')
        await foreground.bringToFront()
        await expect.poll(() => page.evaluate(() => document.hidden)).toBe(true)
        const hiddenText = await countdown.textContent()
        await delay(2200)
        assert.equal(await countdown.textContent(), hiddenText, 'Countdown advanced in a genuinely hidden page')
        const hiddenVideo = media === 'video' ? await page.locator('.artplayer-plugin-ads-video').evaluate(video => ({ time: video.currentTime, paused: video.paused })) : null
        await page.bringToFront()
        await expect.poll(() => page.evaluate(() => document.hidden)).toBe(false)
        await expect.poll(() => countdown.textContent()).not.toBe(hiddenText)
        let restoredVideo = null
        if (media === 'video') {
          await expect.poll(() => page.locator('.artplayer-plugin-ads-video').evaluate(video => video.currentTime)).toBeGreaterThan(hiddenVideo.time + 0.2)
          restoredVideo = await page.locator('.artplayer-plugin-ads-video').evaluate(video => ({ time: video.currentTime, paused: video.paused }))
          assert.equal(restoredVideo.paused, false, 'Ad video remained paused after the tab returned')
        }
        const events = await page.evaluate(() => window.visibilityEvents)
        assert(events.some(event => event.hidden && event.trusted))
        assert(events.some(event => !event.hidden && event.trusted))
        await foreground.bringToFront()
        await expect.poll(() => page.evaluate(() => document.hidden)).toBe(true)
        await page.evaluate(() => window.art.destroy(false))
        await page.bringToFront()
        await delay(1200)
        assert.equal(await page.locator('.artplayer-plugin-ads').count(), 0)
        assert.equal(await page.evaluate(() => window.adsSkips), 0)
        report.cases.push({ core, media, hiddenText, events, hiddenVideo, restoredVideo, destroyed: true })
        await foreground.close()
      }
    }
    assert.deepEqual(errors, [])
    assert.equal(report.cases.length, 6)
    report.passed = true
  }
  catch (error) {
    report.error = error.stack
    if (page) {
      report.failureState = await page.evaluate(() => {
        const video = window.art?.template.$video
        return {
          hidden: document.hidden,
          focused: document.hasFocus(),
          ready: window.art?.isReady,
          visibility: window.visibilityEvents,
          video: video && { source: video.currentSrc, src: video.src, ready: video.readyState, network: video.networkState, preload: video.preload, error: video.error?.message, paused: video.paused },
        }
      }).catch(() => null)
      await page.screenshot({ path: path.join(output, 'failure.png') }).catch(() => {})
    }
    throw error
  }
  finally {
    if (native) {
      await native.context.tracing.stop({ path: path.join(output, 'trace.zip') }).catch(() => {})
      await native.close()
    }
    server.kill()
    fs.writeFileSync(path.join(output, 'server.log'), serverLog)
    fs.writeFileSync(path.join(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
    console.log(`Ads native visibility evidence: ${output}; passed=${report.passed}, cases=${report.cases.length}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

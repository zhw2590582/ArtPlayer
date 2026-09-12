import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from '@playwright/test'

// Use only an owned fresh profile. Playwright's normal launch forces document visibility.
export async function nativeChrome() {
  const executable = process.env.ARTPLAYER_NATIVE_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  assert(fs.existsSync(executable), 'Set ARTPLAYER_NATIVE_CHROME to an installed Chrome executable')
  const cache = fs.realpathSync('refactor/.cache')
  const profile = fs.mkdtempSync(path.join(cache, 'native-chrome-'))
  // Isolate native tab visibility from unrelated desktop windows covering this test window.
  const child = spawn(executable, ['--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--disable-backgrounding-occluded-windows', 'about:blank'], { windowsHide: true, stdio: 'ignore' })
  let launchError
  child.on('error', (error) => {
    launchError = error
  })
  let browser
  async function close() {
    if (browser?.isConnected()) {
      const session = await browser.newBrowserCDPSession()
      await session.send('Browser.close').catch(() => {})
      await browser.close()
    }
    if (child.exitCode === null && !child.killed)
      child.kill()
    assert.equal(path.dirname(fs.realpathSync(profile)), cache)
    assert(path.basename(profile).startsWith('native-chrome-'))
    // Chrome may still be releasing files; keep the isolated profile on cleanup failure.
    try {
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 })
    }
    catch (error) { console.warn(`Isolated Chrome profile retained: ${profile}`, error.message) }
  }
  try {
    const activePort = path.join(profile, 'DevToolsActivePort')
    let port
    for (let attempt = 0; !port && attempt < 100; attempt++) {
      if (launchError)
        throw launchError
      assert.equal(child.exitCode, null, 'Isolated Chrome exited before exposing its endpoint')
      try {
        const content = fs.readFileSync(activePort, 'utf8')
        const match = /^(\d+)\r?\n\/devtools\/browser\/[^\r\n]+/.exec(content)
        if (match && Number(match[1]) > 0 && Number(match[1]) < 65536)
          port = match[1]
      }
      catch (error) {
        if (!['ENOENT', 'EBUSY'].includes(error.code))
          throw error
      }
      if (!port)
        await delay(100)
    }
    assert(port, 'Isolated Chrome did not expose a complete endpoint')
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`, { noDefaults: true })
    return { browser, context: browser.contexts()[0], executable, close }
  }
  catch (error) {
    await close()
    throw error
  }
}

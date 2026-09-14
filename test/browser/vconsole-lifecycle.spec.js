/* eslint-disable no-console -- Exercise the vendor's public log interception. */
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import process from 'node:process'
import { expect, test } from '@playwright/test'

const artifact = process.env.ARTPLAYER_VCONSOLE_BASELINE === '1' ? 'scripts/site-vendor/vconsole/upstream.js' : 'docs/assets/js/vconsole.min.js'
test.beforeEach(async ({ page }) => {
  await page.route('**/assets/js/vconsole.min.js', route => route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(artifact) }))
})

for (const recreate of [false, true]) {
  test(`vConsole cancels queued logging on last plugin removal, recreate=${recreate}`, async ({ page, browser }, testInfo) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.route('**/vconsole-lifecycle.html', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><script src="/assets/js/vconsole.min.js"></script>' }))
    await page.goto('/vconsole-lifecycle.html')
    const result = await page.evaluate(async (recreate) => {
      const raf = window.requestAnimationFrame.bind(window)
      const cancel = window.cancelAnimationFrame.bind(window)
      const callbacks = []
      const cancellations = []
      window.requestAnimationFrame = (callback) => {
        const id = raf(callback)
        callbacks.push({ id, callback })
        return id
      }
      window.cancelAnimationFrame = (id) => {
        cancellations.push(id)
        cancel(id)
      }
      const first = new window.VConsole({ defaultPlugins: [] })
      console.log('stale-before-destroy')
      first.destroy()
      const late = callbacks.slice()
      let next
      if (recreate) {
        await new Promise((resolve) => {
          next = new window.VConsole({ defaultPlugins: [], onReady: resolve })
        })
        next.show()
        console.log('fresh-after-recreate')
      }
      // Native frames allow the original queued callback to reproduce the failure.
      await new Promise(resolve => raf(() => raf(resolve)))
      // A cancelled callback delivered late must also be inert after recreation.
      const staleErrors = []
      for (const entry of late) {
        if (cancellations.includes(entry.id)) {
          try {
            entry.callback(performance.now())
          }
          catch (error) {
            staleErrors.push(String(error))
          }
        }
      }
      const logs = document.querySelector('#__vconsole')?.textContent || ''
      window.requestAnimationFrame = raf
      window.cancelAnimationFrame = cancel
      next?.destroy()
      await new Promise(resolve => raf(resolve))
      return { scheduled: callbacks.length, cancelled: cancellations.length, staleErrors, logs, roots: document.querySelectorAll('#__vconsole').length }
    }, recreate)
    await testInfo.attach('vconsole-lifecycle', { contentType: 'application/json', body: JSON.stringify({ result, errors, browser: browser.version(), artifactSha256: createHash('sha256').update(fs.readFileSync(artifact)).digest('hex') }) })
    expect(result.scheduled).toBeGreaterThan(0)
    expect(result.cancelled).toBeGreaterThan(0)
    expect(errors).toEqual([])
    expect(result.staleErrors).toEqual([])
    expect(result.roots).toBe(0)
    if (recreate) {
      expect(result.logs).toContain('fresh-after-recreate')
      expect(result.logs).not.toContain('stale-before-destroy')
    }
  })
}

test('vConsole removed plugin panels cannot attach to a replacement with the same id', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.route('**/vconsole-lifecycle.html', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><script src="/assets/js/vconsole.min.js"></script>' }))
  await page.goto('/vconsole-lifecycle.html')
  const result = await page.evaluate(async () => {
    let instance
    await new Promise((resolve) => {
      instance = new window.VConsole({ defaultPlugins: [], onReady: resolve })
    })
    const makePlugin = (text) => {
      const plugin = new window.VConsole.VConsolePlugin('replacement', 'Replacement')
      plugin.on('renderTab', callback => callback(`<div class="panel-ownership-probe">${text}</div>`))
      return plugin
    }
    instance.addPlugin(makePlugin('stale-panel'))
    instance.removePlugin('replacement')
    instance.addPlugin(makePlugin('fresh-panel'))
    await new Promise(resolve => setTimeout(resolve, 30))
    const panels = Array.from(document.querySelectorAll('.panel-ownership-probe'), element => element.textContent)
    instance.destroy()
    return panels
  })
  expect(result).toEqual(['fresh-panel'])
  expect(errors).toEqual([])
})

for (const mode of ['amd', 'commonjs']) {
  test(`vConsole retains ${mode} factory and private patch state`, async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const setup = mode === 'amd'
      ? 'window.define=function(name,deps,factory){window.testModuleName=name;window.testConstructor=factory()};window.define.amd=true;'
      : 'window.module={exports:{}};window.exports=window.module.exports;'
    await page.route('**/vconsole-lifecycle.html', route => route.fulfill({ contentType: 'text/html', body: `<!doctype html><script>${setup}</script><script src="/assets/js/vconsole.min.js"></script>` }))
    await page.goto('/vconsole-lifecycle.html')
    const result = await page.evaluate(async (mode) => {
      const Constructor = mode === 'amd' ? window.testConstructor : window.module.exports
      let instance
      await new Promise((resolve) => {
        instance = new Constructor({ defaultPlugins: [], onReady: resolve })
      })
      instance.show()
      console.log('factory-contract-log')
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      const logs = document.querySelector('#__vconsole').textContent
      instance.destroy()
      return { logs, global: typeof window.VConsole, helper: typeof window.__artplayerVConsoleLogLifecycle, roots: document.querySelectorAll('#__vconsole').length }
    }, mode)
    expect(result.logs).toContain('factory-contract-log')
    expect(result.global).toBe('undefined')
    expect(result.helper).toBe('undefined')
    expect(result.roots).toBe(0)
    expect(errors).toEqual([])
  })
}

test('vConsole scroller resumes pending layout work safely after destruction', async ({ page }, testInfo) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.route('**/vconsole-lifecycle.html', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><script src="/assets/js/vconsole.min.js"></script>' }))
  await page.goto('/vconsole-lifecycle.html')
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      window.scrollerInstance = new window.VConsole({ defaultPlugins: [], onReady: resolve })
    })
    window.scrollerInstance.show()
    console.log('scroller-ready')
  })
  await expect(page.getByText('scroller-ready', { exact: true })).toBeVisible()
  const result = await page.evaluate(async () => {
    const instance = window.scrollerInstance
    const nativeTimer = window.setTimeout.bind(window)
    const pending = []
    window.setTimeout = (callback, delay, ...args) => {
      if (delay === 0) {
        pending.push(() => callback(...args))
        return 0
      }
      return nativeTimer(callback, delay, ...args)
    }
    document.querySelector('.vc-scroller-viewport').style.height = '137px'
    for (let index = 0; index < 20; index++)
      console.log(`layout-row-${index}`)
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    const rows = document.querySelectorAll('.vc-log-row').length
    instance.destroy()
    window.setTimeout = nativeTimer
    for (const callback of pending)
      callback()
    await new Promise(resolve => nativeTimer(resolve, 30))
    return { pending: pending.length, rows, roots: document.querySelectorAll('#__vconsole').length }
  })
  await testInfo.attach('vconsole-scroller', { contentType: 'application/json', body: JSON.stringify({ result, errors, artifactSha256: createHash('sha256').update(fs.readFileSync(artifact)).digest('hex') }) })
  expect(result.pending).toBeGreaterThan(0)
  expect(result.rows).toBeGreaterThan(0)
  expect(result.roots).toBe(0)
  expect(errors).toEqual([])
})

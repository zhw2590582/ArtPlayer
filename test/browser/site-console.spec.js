import { createHash } from 'node:crypto'
import fs from 'node:fs'
import { expect, test } from './fixtures.js'

const frozen = fs.readFileSync('refactor/baselines/site-vendor/console-original.js')
expect(createHash('sha256').update(frozen).digest('hex')).toBe('e00bbf82bf08c452825690372ded39a9b60f4baf438f0e7ce8300e9bc4629c03')
async function setup(page, testInfo, historical) {
  await page.route('**/site-console-fixture', route => route.fulfill({
    contentType: 'text/html; charset=utf-8',
    body: '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="first" style="height:220px;width:640px"></div><div id="second" style="height:220px;width:640px"></div></body></html>',
  }))
  if (historical)
    await page.route('**/assets/js/console.js', route => route.fulfill({ contentType: 'text/javascript', body: frozen }))
  await page.goto('/site-console-fixture')
  await page.evaluate(() => {
    window.originalConsole = { ...window.console }
    window.scrollTimers = new Set()
    window.scrollFired = 0
    const schedule = window.setTimeout
    const cancel = window.clearTimeout
    window.setTimeout = (callback, delay, ...args) => {
      if (delay !== 200 || typeof callback !== 'function')
        return schedule(callback, delay, ...args)
      const id = schedule(() => {
        window.scrollTimers.delete(id)
        window.scrollFired++
        Reflect.apply(callback, window, args)
      }, delay)
      window.scrollTimers.add(id)
      return id
    }
    window.clearTimeout = (id) => {
      window.scrollTimers.delete(id)
      cancel(id)
    }
  })
  await page.addScriptTag({ url: '/assets/js/console.js' })
  await page.evaluate(() => {
    window.viewer = window.consoleLog(document.querySelector('#first'))
  })
  await testInfo.attach('console-input', { contentType: 'application/json', body: JSON.stringify({
    historical,
    path: historical ? 'refactor/baselines/site-vendor/console-original.js' : 'docs/assets/js/console.js',
    sha256: createHash('sha256').update(historical ? frozen : fs.readFileSync('docs/assets/js/console.js')).digest('hex'),
  }) })
}

for (const historical of [false, true]) {
  const scope = historical ? 'historical' : 'current'
  test(`${scope} console globals, returned component and repeated mount retain their interfaces`, async ({ page }, testInfo) => {
    await setup(page, testInfo, historical)
    expect(await page.evaluate(() => {
      const first = document.querySelector('#first')
      const hook = window.console.log
      return {
        react: window.React.version,
        dom: window.ReactDOM.version,
        loader: typeof window.parcelRequire,
        entry: window.parcelRequire('Focm').default === window.consoleLog,
        reactModule: window.parcelRequire('n8MK') === window.React,
        sameComponent: window.consoleLog(first) === window.viewer,
        sameHook: window.console.log === hook,
        methods: ['add', 'onClear', 'onMouseEnter', 'onMouseLeave', 'componentWillUnmount', 'render'].every(name => typeof window.viewer[name] === 'function'),
        state: { count: window.viewer.state.logs.length, hover: window.viewer.state.hover },
      }
    })).toEqual({ react: '17.0.2', dom: '17.0.2', loader: 'function', entry: true, reactModule: true, sameComponent: true, sameHook: true, methods: true, state: { count: 0, hover: false } })
    await expect(page.locator('.console-header-number')).toHaveText('0')
    expect(await page.evaluate(() => window.ReactDOM.unmountComponentAtNode(document.querySelector('#first')))).toBe(true)
    expect(await page.evaluate(() => ({ restored: window.console.log === window.originalConsole.log, feed: 'feed' in window.console }))).toEqual({ restored: true, feed: false })
  })

  test(`${scope} console renders levels and raw objects; Clear resets the visible log count`, async ({ page }, testInfo) => {
    await setup(page, testInfo, historical)
    await page.evaluate(() => {
      window.sample = { message: 'structured-value', nested: { answer: 42 } }
      window.sample.self = window.sample
      window.console.log('plain-message', window.sample)
      window.console.info('info-message')
      window.console.warn('warning-message')
      window.console.error('error-message', new Error('native-error'))
    })
    await expect(page.locator('.console-header-number')).toHaveText('4')
    await expect(page.locator('.console-component')).toContainText('plain-message')
    await expect(page.locator('.console-component')).toContainText('warning-message')
    await expect(page.locator('.console-component')).toContainText('error-message')
    expect(await page.evaluate(() => ({ methods: window.viewer.state.logs.map(log => log.method), objectIdentity: window.viewer.state.logs[0].data[1] === window.sample }))).toEqual({ methods: ['log', 'info', 'warn', 'error'], objectIdentity: true })
    await page.locator('.console-header-right').click()
    await expect(page.locator('.console-header-number')).toHaveText('0')
    await expect(page.locator('.console-component')).toHaveText('')
  })

  test(`${scope} console scrolls new logs and preserves the pointer hover pause`, async ({ page }, testInfo) => {
    await setup(page, testInfo, historical)
    await page.mouse.move(900, 600)
    await page.evaluate(() => {
      for (let i = 0; i < 40; i++)
        window.console.log(`scroll-row-${i}`)
    })
    await expect(page.locator('.console-header-number')).toHaveText('40')
    await page.waitForFunction(() => window.scrollFired > 0)
    await expect.poll(() => page.locator('.console-component').evaluate(node => node.scrollTop)).toBeGreaterThan(0)
    await page.locator('.console-component').hover()
    await page.waitForFunction(() => window.viewer.state.hover)
    await page.evaluate(() => {
      const node = document.querySelector('.console-component')
      node.style.scrollBehavior = 'auto'
      node.scrollTop = 0
      window.console.log('hover-retains-position')
    })
    await expect(page.locator('.console-header-number')).toHaveText('41')
    expect(await page.evaluate(() => ({ top: document.querySelector('.console-component').scrollTop, timers: window.scrollTimers.size }))).toEqual({ top: 0, timers: 0 })
    await page.mouse.move(900, 600)
    await page.waitForFunction(() => !window.viewer.state.hover)
    await page.evaluate(() => window.console.log('resume-scrolling'))
    await expect(page.locator('.console-header-number')).toHaveText('42')
    await expect.poll(() => page.locator('.console-component').evaluate(node => node.scrollTop)).toBeGreaterThan(0)
  })
}

test('frozen historical console leaves its scheduled scroll callback after unmount', async ({ page }, testInfo) => {
  await setup(page, testInfo, true)
  await page.evaluate(() => {
    // Keep the native callback pending until after the synchronous unmount.
    window.viewer.add({ method: 'log', data: ['pending-scroll'] })
    window.pendingBeforeUnmount = window.scrollTimers.size
    window.ReactDOM.unmountComponentAtNode(document.querySelector('#first'))
    window.pendingAfterUnmount = window.scrollTimers.size
  })
  expect(await page.evaluate(() => ({ before: window.pendingBeforeUnmount, after: window.pendingAfterUnmount }))).toEqual({ before: 1, after: 1 })
  await page.waitForFunction(() => window.scrollFired === 1)
  await expect(page.locator('#first')).toBeEmpty()
})

test('frozen historical console loses the remaining viewer when another viewer unmounts', async ({ page }, testInfo) => {
  await setup(page, testInfo, true)
  await page.evaluate(() => {
    window.otherViewer = window.consoleLog(document.querySelector('#second'))
    window.console.log('both-mounted')
  })
  await expect(page.locator('#first .console-header-number')).toHaveText('1')
  await expect(page.locator('#second .console-header-number')).toHaveText('1')
  await page.evaluate(() => {
    window.ReactDOM.unmountComponentAtNode(document.querySelector('#first'))
    window.console.log('remaining-viewer-loses-log')
  })
  await page.waitForFunction(() => window.viewer.state.logs.length === 1 && !('feed' in window.console))
  // Drain the same console-feed macrotask queue before inspecting the survivor.
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 0)))
  expect(await page.evaluate(() => window.otherViewer.state.logs.map(log => log.data[0]))).toEqual(['both-mounted'])
})

test('frozen historical console error-only rendering loses the message on Firefox and WebKit', async ({ page, browserName }, testInfo) => {
  await setup(page, testInfo, true)
  await page.evaluate(() => {
    window.nativeError = new Error('native-error-message')
    window.console.error(window.nativeError)
  })
  await expect(page.locator('.console-header-number')).toHaveText('1')
  const result = await page.evaluate(() => ({
    parsed: window.viewer.state.logs[0].data[0],
    message: window.nativeError.message,
    stack: window.nativeError.stack,
    text: document.querySelector('.console-component').textContent,
  }))
  expect(result.parsed).toBe(result.stack)
  expect(result.message).toBe('native-error-message')
  for (const line of result.stack.trim().split('\n'))
    expect(result.text).toContain(line.trim())
  if (browserName === 'chromium')
    expect(result.text).toContain(result.message)
  else
    expect(result.text).not.toContain(result.message)
  await testInfo.attach('historical-error-rendering', { contentType: 'application/json', body: JSON.stringify(result) })
})

test('candidate console cancels pending scroll and log work on unmount and survives remount', async ({ page }, testInfo) => {
  await setup(page, testInfo, false)
  expect(await page.evaluate(() => {
    window.viewer.add({ method: 'log', data: ['pending-scroll'] })
    window.console.log('queued-before-unmount')
    window.ReactDOM.unmountComponentAtNode(document.querySelector('#first'))
    const pending = window.scrollTimers.size
    window.viewer = window.consoleLog(document.querySelector('#first'))
    window.console.log('after-remount')
    return pending
  })).toBe(0)
  await expect(page.locator('.console-header-number')).toHaveText('1')
  await expect(page.locator('.console-component')).toHaveText('after-remount')
})

for (const removeFirst of [true, false]) {
  test(`candidate console retains the surviving viewer when removing ${removeFirst ? 'first' : 'second'}`, async ({ page }, testInfo) => {
    await setup(page, testInfo, false)
    await page.evaluate(() => {
      window.otherViewer = window.consoleLog(document.querySelector('#second'))
      window.console.log('both-mounted')
    })
    await expect(page.locator('#first .console-header-number')).toHaveText('1')
    await expect(page.locator('#second .console-header-number')).toHaveText('1')
    await page.evaluate((first) => {
      window.ReactDOM.unmountComponentAtNode(document.querySelector(first ? '#first' : '#second'))
      window.console.log('survivor-log')
    }, removeFirst)
    const remaining = removeFirst ? '#second' : '#first'
    await expect(page.locator(`${remaining} .console-header-number`)).toHaveText('2')
    await expect(page.locator(`${remaining} .console-component`)).toContainText('survivor-log')
    expect(await page.evaluate((selector) => {
      window.ReactDOM.unmountComponentAtNode(document.querySelector(selector))
      return window.console.log === window.originalConsole.log
    }, remaining)).toBe(true)
  })
}

test('candidate console keeps native Error message and stack visible without modifying Error', async ({ page }, testInfo) => {
  await setup(page, testInfo, false)
  await page.evaluate(() => {
    window.nativeError = new Error('candidate-error-message')
    window.originalStack = window.nativeError.stack
    window.console.error(window.nativeError)
  })
  await expect(page.locator('.console-header-number')).toHaveText('1')
  await expect(page.locator('.console-component')).toContainText('candidate-error-message')
  expect(await page.evaluate(() => window.nativeError.stack === window.originalStack)).toBe(true)
  const stack = await page.evaluate(() => window.originalStack)
  for (const line of stack.trim().split('\n'))
    await expect(page.locator('.console-component')).toContainText(line.trim())
})

test('candidate console leaves later external wrappers intact and remounts without duplicate forwarding', async ({ page }, testInfo) => {
  await setup(page, testInfo, false)
  await page.evaluate(() => {
    const own = window.console.log
    window.externalCalls = 0
    window.external = function (...args) {
      window.externalCalls++
      return own.apply(this, args)
    }
    window.console.log = window.external
    window.consoleLog.unmount(document.querySelector('#first'))
    window.console.log('no-viewer')
    window.viewer = window.consoleLog(document.querySelector('#first'))
    window.console.log('remounted')
  })
  await expect(page.locator('.console-header-number')).toHaveText('1')
  await expect(page.locator('.console-component')).toHaveText('remounted')
  expect(await page.evaluate(() => {
    window.consoleLog.unmount(document.querySelector('#first'))
    return { calls: window.externalCalls, retained: window.console.log === window.external }
  })).toEqual({ calls: 2, retained: true })
})

test('editor retains console on persisted pagehide and releases it on final pagehide', async ({ page }) => {
  await page.route('https://**/*', route => route.fulfill({ status: 200, body: '' }))
  await page.goto('/?code=window.console.log("editor-initial")')
  await expect(page.locator('.console-component')).toContainText('editor-initial')
  const before = await page.locator('.console-header-number').textContent()
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }))
    window.console.log('persisted-live')
  })
  await expect(page.locator('.console-component')).toContainText('persisted-live')
  await expect(page.locator('.console-header-number')).toHaveText(String(Number(before) + 1))
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false })))
  await expect(page.locator('.console-header')).toHaveCount(0)
  expect(await page.evaluate(() => 'feed' in window.console)).toBe(false)
})

test('candidate console parses stateful methods once for shared viewers', async ({ page }, testInfo) => {
  await setup(page, testInfo, false)
  await page.evaluate(() => {
    window.otherViewer = window.consoleLog(document.querySelector('#second'))
    window.console.count('shared-count')
    window.console.count('shared-count')
    window.console.assert(true, 'must-not-log')
    window.console.assert(false, 'visible-assertion')
    window.console.time('shared-time')
    window.console.timeEnd('shared-time')
  })
  await expect(page.locator('#first .console-header-number')).toHaveText('4')
  await expect(page.locator('#second .console-header-number')).toHaveText('4')
  const result = await page.evaluate(() => ({
    a: window.viewer.state.logs,
    b: window.otherViewer.state.logs,
    sameRecords: window.viewer.state.logs.every((row, index) => row === window.otherViewer.state.logs[index]),
  }))
  expect(result.a).toEqual(result.b)
  expect(result.sameRecords).toBe(true)
  expect(JSON.stringify(result.a)).toContain('shared-count: 1')
  expect(JSON.stringify(result.a)).toContain('shared-count: 2')
  await expect(page.locator('#first .console-component')).toContainText('visible-assertion')
  await expect(page.locator('#first .console-component')).not.toContainText('must-not-log')
  await page.evaluate(() => window.console.clear())
  await expect(page.locator('#first .console-header-number')).toHaveText('5')
  await expect(page.locator('#second .console-header-number')).toHaveText('5')
  expect(await page.evaluate(() => window.viewer.state.logs.at(-1).method)).toBe('clear')
})

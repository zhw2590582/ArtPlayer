import fs from 'node:fs'
import { expect, test } from './fixtures.js'

test('mobile page runs dependencies in order and plays the selected code with no AMD property leak', async ({
  page,
}) => {
  let release
  let started
  const gate = new Promise((resolve) => {
    release = resolve
  })
  const firstRequested = new Promise((resolve) => {
    started = resolve
  })
  let secondRequested = false
  await page.route('https://**/*', route =>
    route.fulfill({ status: 200, body: '' }))
  await page.route('**/site-first.js', async (route) => {
    started()
    await gate
    await route.fulfill({
      contentType: 'text/javascript',
      body: 'window.order = ["first"]; window.firstDependency = true;',
    })
  })
  await page.route('**/site-second.js', (route) => {
    secondRequested = true
    return route.fulfill({
      contentType: 'text/javascript',
      body: 'if (!window.firstDependency) throw new Error("Dependency order"); window.order.push("second");',
    })
  })
  const code
    = 'window.order.push("code"); window.art = new Artplayer({ container: ".artplayer-app", url: "/test/pattern.mp4", muted: true });'
  await page.goto(
    `/mobile.html?libs=${encodeURIComponent('./site-first.js\n./site-second.js')}&code=${encodeURIComponent(code)}`,
    { waitUntil: 'domcontentloaded' },
  )
  await firstRequested
  expect(secondRequested).toBe(false)
  release()
  await page.waitForFunction(() => window.art?.isReady)
  expect(await page.evaluate(() => window.order)).toEqual([
    'first',
    'second',
    'code',
  ])
  expect(await page.evaluate(() => Object.hasOwn(window, 'define'))).toBe(
    false,
  )
  await page.evaluate(() => window.art.play())
  await expect
    .poll(() => page.evaluate(() => window.art.currentTime))
    .toBeGreaterThan(0)
  await page.evaluate(() => window.art.pause())
  expect(await page.evaluate(() => window.art.playing)).toBe(false)
  await page.evaluate(() => window.art.destroy(true))
  expect(await page.evaluate(() => window.Artplayer.instances.length)).toBe(0)
})

test('real script failure is retryable and cancellation restores the original AMD function', async ({
  page,
}) => {
  await page.goto('/test/player.html')
  await page.addScriptTag({ url: '/assets/js/loader.js' })
  let attempts = 0
  await page.route('**/site-retry.js', route =>
    route.fulfill(
      ++attempts === 1
        ? { status: 404, body: 'missing' }
        : {
            contentType: 'text/javascript',
            body: 'window.retryLoaded = true;',
          },
    ))
  const result = await page.evaluate(async () => {
    const original = Object.assign(() => {}, { amd: {} })
    Object.defineProperty(window, 'define', {
      value: original,
      writable: true,
      configurable: true,
      enumerable: false,
    })
    let error = ''
    try {
      await window.ArtplayerDocsLoader.loadLibraries('/site-retry.js')
    }
    catch (cause) {
      error = cause.message
    }
    const restored
      = window.define === original
        && !Object.getOwnPropertyDescriptor(window, 'define').enumerable
    await window.ArtplayerDocsLoader.loadLibraries('/site-retry.js')
    await window.ArtplayerDocsLoader.loadLibraries('/site-retry.js')
    return {
      error,
      restored,
      retryLoaded: window.retryLoaded,
      nodes: document.querySelectorAll('script[src$="site-retry.js"]').length,
      after: window.define === original,
    }
  })
  expect(result.error).toContain('Loading script failed')
  expect(result).toMatchObject({
    restored: true,
    retryLoaded: true,
    nodes: 1,
    after: true,
  })
  expect(attempts).toBe(2)
  const cancellation = await page.evaluate(async () => {
    const original = window.define
    const append = document.head.appendChild
    document.head.appendChild = function (node) {
      if (node.src?.endsWith('/site-pending.js')) {
        queueMicrotask(() => window.ArtplayerDocsLoader.dispose())
        return node
      }
      return append.call(this, node)
    }
    try {
      let error = ''
      try {
        await window.ArtplayerDocsLoader.loadLibraries('/site-pending.js')
      }
      catch (cause) {
        error = cause.message
      }
      return { error, restored: window.define === original }
    }
    finally {
      document.head.appendChild = append
    }
  })
  expect(cancellation.error).toContain('Cancelled')
  expect(cancellation.restored).toBe(true)
})

test('desktop editor preserves example priority and reuses loaded dependencies when Run is clicked', async ({
  page,
}) => {
  let loads = 0
  await page.route('https://**/*', route =>
    route.fulfill({ status: 200, body: '' }))
  await page.route('**/site-lib.js', (route) => {
    loads++
    return route.fulfill({
      contentType: 'text/javascript',
      body: 'window.siteLibraryLoaded = true;',
    })
  })
  await page.route('**/assets/example/site.fixture.js', route =>
    route.fulfill({
      contentType: 'text/javascript',
      body: 'if (!window.siteLibraryLoaded) throw new Error("Missing dependency"); window.siteRuns = (window.siteRuns || 0) + 1; var art = new Artplayer({ container: ".artplayer-app", url: "/test/pattern.mp4", muted: true });',
    }))
  await page.goto(
    `/?libs=${encodeURIComponent('./site-lib.js')}&example=site.fixture&code=${encodeURIComponent('throw new Error("wrong priority")')}`,
    { waitUntil: 'domcontentloaded' },
  )
  await page.waitForFunction(() => window.art?.isReady)
  const before = await page.evaluate(() => {
    window.previousArt = window.art
    return window.art.id
  })
  await page.locator('.run').click()
  await page.waitForFunction(
    id => window.art?.isReady && window.art.id !== id,
    before,
  )
  expect(
    await page.evaluate(() => ({
      runs: window.siteRuns,
      destroyed: window.previousArt.isDestroy,
      instances: window.Artplayer.instances.length,
      amd: typeof window.define,
    })),
  ).toEqual({ runs: 2, destroyed: true, instances: 1, amd: 'function' })
  expect(loads).toBe(1)
  await page.evaluate(() => window.art.destroy(true))
})

test('Run Code handles nested clicks, encodes dependencies and stays local on 127.0.0.1', async ({
  page,
}) => {
  await page.goto('/test/player.html')
  await page.evaluate(() => {
    window.opened = []
    window.open = (url) => {
      window.opened.push(url)
      return null
    }
    document.body.innerHTML
      = '<div className="run-code" data-libs="https://cdn.example/lib.js?a=1&amp;b=2"><span id="run-inner">Run</span></div><div><pre><code>var x = "你好+a&amp;b";</code></pre></div><div class="run-code" id="missing">Missing code</div>'
  })
  const code = fs.readFileSync(
    'packages/artplayer-vitepress/docs/public/main.js',
    'utf8',
  )
  await page.addScriptTag({ content: code })
  await page.addScriptTag({ content: code })
  await page.locator('#run-inner').click()
  await page.locator('#missing').click()
  const opened = await page.evaluate(() => window.opened)
  expect(opened).toHaveLength(1)
  const url = new URL(opened[0])
  expect(url.origin).toBe('http://127.0.0.1:8082')
  expect(url.searchParams.get('libs')).toBe(
    'https://cdn.example/lib.js?a=1&b=2',
  )
  expect(url.searchParams.get('code')).toBe('var x = "你好+a&b";')
  expect(page.url()).toContain('/test/player.html')
})

test('first-language redirect preserves the translated deep link and later explicit Chinese selection', async ({
  page,
}) => {
  const code = fs.readFileSync(
    'packages/artplayer-vitepress/docs/public/main.js',
    'utf8',
  )
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'language', { get: () => 'en-US' }),
  )
  await page.route('https://docs.example/**', route =>
    route.fulfill({
      contentType: 'text/html',
      body: `<html><body>Documentation<script>${code}</script></body></html>`,
    }))
  await page.goto('https://docs.example/document/start/option.html?x=1#url')
  await page.waitForURL(
    'https://docs.example/document/en/start/option.html?x=1#url',
  )
  expect(await page.evaluate(() => localStorage.getItem('lang-init'))).toBe(
    'true',
  )
  await page.goto('https://docs.example/document/start/option.html')
  expect(page.url()).toBe('https://docs.example/document/start/option.html')
})

test('a late initial example response cannot overwrite a newer editor Run', async ({
  page,
}) => {
  let release
  let started
  const gate = new Promise((resolve) => {
    release = resolve
  })
  const requested = new Promise((resolve) => {
    started = resolve
  })
  await page.route('https://**/*', route => route.fulfill({ body: '' }))
  await page.addInitScript(() => {
    const original = window.fetch
    window.fetch = async (...args) => {
      const response = await original(...args)
      if (String(args[0]).includes('site.slow.js')) {
        const read = response.text.bind(response)
        response.text = async () => {
          const text = await read()
          window.slowReceived = true
          return text
        }
      }
      return response
    }
  })
  await page.route('**/assets/example/site.slow.js', async (route) => {
    started()
    await gate
    await route.fulfill({
      contentType: 'text/javascript',
      body: 'window.staleRan = true;',
    })
  })
  await page.goto('/?example=site.slow', { waitUntil: 'domcontentloaded' })
  await requested
  await page.evaluate(() => {
    const model = window.monaco.editor
      .getModels()
      .find(model => model.getLanguageId() === 'javascript')
    model.setValue(
      'window.newerRan = true; var art = new Artplayer({ container: ".artplayer-app", url: "/test/pattern.mp4", muted: true });',
    )
  })
  await page.locator('.run').click()
  await page.waitForFunction(() => window.art?.isReady)
  release()
  await page.waitForFunction(() => window.slowReceived)
  expect(
    await page.evaluate(() => ({
      newer: window.newerRan,
      stale: !!window.staleRan,
      ready: window.art.isReady,
      instances: window.Artplayer.instances.length,
    })),
  ).toEqual({ newer: true, stale: false, ready: true, instances: 1 })
  await page.evaluate(() => window.art.destroy(true))
})

test('denied storage keeps the requested documentation page without a redirect loop', async ({
  page,
}) => {
  const code = fs.readFileSync(
    'packages/artplayer-vitepress/docs/public/main.js',
    'utf8',
  )
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'language', { get: () => 'en-US' })
    Object.defineProperty(window, 'localStorage', {
      get: () => {
        throw new DOMException('Blocked', 'SecurityError')
      },
    })
  })
  let requests = 0
  await page.route('https://blocked.example/**', (route) => {
    requests++
    return route.fulfill({
      contentType: 'text/html',
      body: `<html><body>Documentation<script>${code}</script></body></html>`,
    })
  })
  await page.goto('https://blocked.example/document/start/option.html')
  expect(page.url()).toBe('https://blocked.example/document/start/option.html')
  expect(requests).toBe(1)
  expect(await page.evaluate(() => window['run-code-init'])).toBe(true)
})

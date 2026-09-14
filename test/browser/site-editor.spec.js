import { Buffer } from 'node:buffer'
import { expect, test } from './fixtures.js'

const player
  = 'var art = new Artplayer({ container: ".artplayer-app", url: "/test/pattern.mp4", muted: true });'
async function setup(page) {
  await page.route('https://**/*', route =>
    route.fulfill({ status: 200, body: '' }))
}

function waitError(page, expected) {
  return page.waitForEvent(
    'console',
    async message =>
      message.type() === 'error'
      && message.args().length > 0
      && (
        await message
          .args()[0]
          .evaluate(value =>
            value instanceof Error ? value.message : String(value),
          )
      ).includes(expected),
  )
}

test('desktop TypeScript mode emits and runs typed code, Ctrl-S reruns and invalid syntax keeps the current player', async ({
  page,
}) => {
  await setup(page)
  await page.addInitScript(() => localStorage.setItem('ts', 'true'))
  await page.goto(
    `/?code=${encodeURIComponent(`const count: number = 7; window.typedCount = count; ${player}`)}`,
  )
  await page.waitForFunction(
    () => window.art?.isReady && window.typedCount === 7,
  )
  expect(
    await page.evaluate(() => window.monaco.editor.getModels().length),
  ).toBe(23)
  const first = await page.evaluate(() => {
    window.previous = window.art
    return window.art.id
  })
  await page.evaluate(() =>
    window.monaco.editor
      .getModels()
      .find(model => !model.uri.path.endsWith('.d.ts'))
      .setValue(
        'const next: number = 8; window.typedCount = next; var art = new Artplayer({container:".artplayer-app",url:"/test/pattern.mp4",muted:true});',
      ),
  )
  await page.keyboard.press('Control+s')
  await page.waitForFunction(
    id => window.art?.isReady && window.art.id !== id,
    first,
  )
  expect(
    await page.evaluate(() => ({
      count: window.typedCount,
      destroyed: window.previous.isDestroy,
      models: window.monaco.editor.getModels().length,
    })),
  ).toEqual({ count: 8, destroyed: true, models: 23 })
  await page.evaluate(() => {
    window.previous = window.art
    window.monaco.editor
      .getModels()
      .find(model => !model.uri.path.endsWith('.d.ts'))
      .setValue('const invalid: = 1')
  })
  const error = waitError(page, 'TypeScript syntax error')
  await page.locator('.run').click()
  await error
  expect(
    await page.evaluate(
      () => window.art === window.previous && !window.art.isDestroy,
    ),
  ).toBe(true)
  await page.evaluate(() =>
    window.dispatchEvent(
      new PageTransitionEvent('pagehide', { persisted: false }),
    ),
  )
  expect(
    await page.evaluate(() => window.monaco.editor.getModels().length),
  ).toBe(0)
})

test('desktop file imports retain order, support CSS and remain usable after Run', async ({
  page,
}) => {
  await setup(page)
  await page.goto(`/?code=${encodeURIComponent(player)}`)
  await page.waitForFunction(() => window.art?.isReady)
  await page.locator('#file').setInputFiles([
    {
      name: 'FIRST.JS',
      mimeType: 'text/javascript',
      buffer: Buffer.from('window.importOrder = [1];'),
    },
    {
      name: 'second.js',
      mimeType: 'text/javascript',
      buffer: Buffer.from('window.importOrder.push(2);'),
    },
    {
      name: 'custom.css',
      mimeType: 'text/css',
      buffer: Buffer.from(
        '.artplayer-app { --editor-import-marker: imported; }',
      ),
    },
  ])
  await expect(page.locator('.libsInput')).toHaveValue('[custom.css]')
  expect(await page.evaluate(() => window.importOrder)).toEqual([1, 2])
  expect(
    await page
      .locator('.artplayer-app')
      .evaluate(element =>
        getComputedStyle(element)
          .getPropertyValue('--editor-import-marker')
          .trim(),
      ),
  ).toBe('imported')
  const before = await page.evaluate(() => window.art.id)
  await page.locator('.run').click()
  await page.waitForFunction(
    id => window.art?.isReady && window.art.id !== id,
    before,
  )
  expect(await page.evaluate(() => window.importOrder)).toEqual([1, 2])
})

test('denied browser storage falls back to a working editor and reports unsaved preferences', async ({
  page,
}) => {
  await setup(page)
  await page.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Denied', 'SecurityError')
      },
    }),
  )
  await page.goto(`/?code=${encodeURIComponent(player)}`)
  await page.waitForFunction(() => window.art?.isReady)
  const before = await page.evaluate(() => window.art.id)
  const error = waitError(page, 'preference was not saved')
  await page.locator('#prod').click()
  await error
  await expect(page.locator('#prod')).not.toBeChecked()
  expect(await page.evaluate(() => window.art.id)).toBe(before)
})

test('stored production and visibility settings reload with their existing keys', async ({
  page,
}) => {
  await setup(page)
  const scripts = []
  page.on('request', (request) => {
    if (request.resourceType() === 'script')
      scripts.push(new URL(request.url()).pathname)
  })
  await page.addInitScript(() => {
    if (!localStorage.getItem('editor-test-init')) {
      for (const key of ['prod', 'code', 'log'])
        localStorage.setItem(key, 'true')
      localStorage.setItem('editor-test-init', 'true')
    }
  })
  await page.goto(`/?code=${encodeURIComponent(player)}`)
  await page.waitForFunction(() => window.art?.isReady)
  expect(scripts).toContain('/compiled/artplayer.js')
  await expect(page.locator('#editor')).toBeHidden()
  await expect(page.locator('.console')).toBeHidden()
  await page.locator('#code').uncheck()
  await expect(page.locator('#editor')).toBeVisible()
  await page.waitForFunction(() => window.art?.isReady)
  expect(await page.evaluate(() => localStorage.getItem('code'))).toBe('false')
})

test('Monaco language AMD modules finish before example dependencies can suspend define', async ({
  page,
}) => {
  await setup(page)
  let release
  let started
  const gate = new Promise((resolve) => {
    release = resolve
  })
  const requested = new Promise((resolve) => {
    started = resolve
  })
  let dependencies = 0
  await page.route(
    '**/vs/basic-languages/typescript/typescript.js',
    async (route) => {
      const response = await route.fetch()
      started()
      await gate
      await route.fulfill({
        response,
        body: `window.languageAmdReady = true;\n${await response.text()}`,
      })
    },
  )
  await page.route('**/site-editor-dependency.js', (route) => {
    dependencies++
    return route.fulfill({
      contentType: 'text/javascript',
      body: 'if (!window.languageAmdReady) throw new Error("Language module was not ready"); window.editorDependencyLoaded = true;',
    })
  })
  await page.goto(
    `/?libs=${encodeURIComponent('./site-editor-dependency.js')}&code=${encodeURIComponent(player)}`,
    { waitUntil: 'domcontentloaded' },
  )
  await requested
  await page.locator('.run').dispatchEvent('click')
  expect(dependencies).toBe(0)
  release()
  await page.waitForFunction(
    () => window.art?.isReady && window.editorDependencyLoaded,
  )
  expect(dependencies).toBe(1)
  expect(await page.evaluate(() => typeof window.define)).toBe('function')
})

test('failed declaration loading disposes partial models and prevents premature Run', async ({
  page,
}) => {
  await setup(page)
  await page.route('**/assets/ts/artplayer-plugin-chapter.d.ts', route =>
    route.fulfill({ status: 404, body: 'Missing declaration' }))
  const error = waitError(page, 'Loading editor declaration failed')
  await page.goto('/?code=window.prematureRun=true')
  await error
  await expect(page.locator('.run')).toHaveAttribute('aria-disabled', 'true')
  await page.locator('.run').dispatchEvent('click')
  expect(
    await page.evaluate(() => ({
      models: window.monaco.editor.getModels().length,
      ran: !!window.prematureRun,
    })),
  ).toEqual({ models: 0, ran: false })
})

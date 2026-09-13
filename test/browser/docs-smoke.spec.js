import fs from 'node:fs'
import { build } from 'esbuild'
import { expect, test } from './fixtures.js'

const compiled = await build({
  entryPoints: ['scripts/docs-smoke/runtime.ts'],
  bundle: true,
  write: false,
  format: 'iife',
  globalName: 'DocumentationSmoke',
  target: 'es2020',
  logLevel: 'silent',
})
const runtime = compiled.outputFiles[0].text
const core = '/candidate/artplayer.js'
const example = code => ({ id: 'fixture.md:1', file: 'fixture.md', line: 1, code })
const player = 'var art = new Artplayer({ container: \'.artplayer-app\', url: \'/test/pattern.mp4\', muted: true });'
const documented = JSON.parse(fs.readFileSync('docs/test/examples.json', 'utf8'))
  .examples
  .filter(item => item.file === 'start/option.md')
  .slice(0, 3)

function expectDimensions(media, browserName) {
  // DPIP-MEDIA-01: Windows WebKit can report either intrinsic or styled dimensions.
  // Keep exact observed pairs; readiness smoke does not close intrinsic-size compatibility.
  const sizes = browserName === 'webkit' ? [[320, 180], [640, 360]] : [[320, 180]]
  expect(sizes).toContainEqual([media.width, media.height])
}

test.beforeEach(async ({ page }) => {
  await page.goto('/test/player.html')
  await page.addScriptTag({ content: runtime })
})

test('readiness smoke uses actual core/media and releases each frame without touching a parent player', async ({
  page,
  browserName,
}, testInfo) => {
  await page.evaluate(() => {
    window.createPlayer('/test/pattern.mp4')
    localStorage.setItem('smoke-existing', 'preserved')
    sessionStorage.setItem('smoke-session', 'preserved')
  })
  for (let index = 0; index < 3; index++) {
    const result = await page.evaluate(
      async ({ item, core }) => {
        return window.DocumentationSmoke.runExample(item, [core])
      },
      {
        item: example(
          `${player}\nlocalStorage.clear(); sessionStorage.clear(); localStorage.setItem('smoke-leak', 'bad');`,
        ),
        core,
      },
    )
    expect(result.instances).toBe(1)
    expect(result.ready).toBe(1)
    expectDimensions(result.media[0], browserName)
    expect(result.media[0].duration).toBeGreaterThan(0)
    await testInfo.attach(`readiness-${index}`, { body: JSON.stringify(result), contentType: 'application/json' })
    expect(await page.locator('iframe[data-documentation-smoke]').count()).toBe(0)
  }
  expect(
    await page.evaluate(() => ({
      players: window.Artplayer.instances.length,
      kept: localStorage.getItem('smoke-existing'),
      session: sessionStorage.getItem('smoke-session'),
      leak: localStorage.getItem('smoke-leak'),
    })),
  ).toEqual({ players: 1, kept: 'preserved', session: 'preserved', leak: null })
  await page.evaluate(() => window.art.destroy())
})

test('smoke remains pending beyond 100ms until real media becomes ready', async ({ page }) => {
  let release
  const gate = new Promise((resolve) => {
    release = resolve
  })
  await page.route('**/test/pattern.mp4', async (route) => {
    await gate
    await route.continue()
  })
  try {
    await page.evaluate(
      ({ item, core }) => {
        window.smokeState = { done: false }
        window.smokePromise = window.DocumentationSmoke.runExample(item, [core]).then((value) => {
          window.smokeState = { done: true, value }
        })
        window.oldCompletion = new Promise(resolve => setTimeout(resolve, 100))
      },
      { item: example(player), core },
    )
    await page.evaluate(() => window.oldCompletion)
    expect(await page.evaluate(() => window.smokeState.done)).toBe(false)
    release()
    await page.evaluate(() => window.smokePromise)
    expect(await page.evaluate(() => window.smokeState.value.ready)).toBe(1)
  }
  finally {
    release()
  }
})

test('generated real documentation cases run with controlled native media', async ({ page, browserName }) => {
  await page.route('**/assets/sample/video.mp4', route =>
    route.fulfill({ contentType: 'video/mp4', body: fs.readFileSync('test/browser/media/pattern.mp4') }))
  for (const item of documented) {
    const result = await page.evaluate(({ item, core }) => window.DocumentationSmoke.runExample(item, [core]), {
      item,
      core,
    })
    expect(result.ready).toBe(1)
    expectDimensions(result.media[0], browserName)
  }
})

test('parallel calls are rejected while a controlled case is still active', async ({ page }) => {
  const state = await page.evaluate(
    async ({ item, core }) => {
      const first = window.DocumentationSmoke.runExample(item, [core])
      let rejected
      try {
        await window.DocumentationSmoke.runExample(item, [core])
      }
      catch (error) {
        rejected = String(error)
      }
      await first
      return rejected
    },
    { item: example(player), core },
  )
  expect(state).toContain('must run sequentially')
})

for (const [name, code, message] of [
  ['synchronous error', `${player}\nthrow new Error('sync fixture');`, 'sync fixture'],
  ['returned rejection', `${player}\nPromise.reject(new Error('returned fixture'));`, 'returned fixture'],
  ['unhandled rejection', `${player}\nPromise.reject(new Error('unhandled fixture')); void 0;`, 'unhandled fixture'],
  [
    'readiness callback error',
    `${player}\nart.on('ready', () => { throw new Error('ready fixture'); });`,
    'ready fixture',
  ],
  ['cleanup error', `${player}\nart.on('destroy', () => { throw new Error('destroy fixture'); });`, 'destroy fixture'],
]) {
  test(`smoke reports ${name} and removes its frame`, async ({ page }) => {
    const result = await page.evaluate(
      async ({ item, core }) => {
        try {
          await window.DocumentationSmoke.runExample(item, [core])
          return 'unexpected success'
        }
        catch (error) {
          return String(error)
        }
      },
      { item: example(code), core },
    )
    expect(result).toContain(message)
    expect(await page.locator('iframe[data-documentation-smoke]').count()).toBe(0)
    expect(await page.evaluate(() => window.Artplayer.instances.length)).toBe(0)
  })
}

test('missing script and never-ready examples fail instead of becoming green after a delay', async ({ page }) => {
  await page.route('**/missing-smoke.js', route => route.fulfill({ status: 404, body: 'missing fixture' }))
  const missing = await page.evaluate(async (item) => {
    try {
      await window.DocumentationSmoke.runExample(item, ['/missing-smoke.js'])
      return 'unexpected success'
    }
    catch (error) {
      return String(error)
    }
  }, example('void 0;'))
  expect(missing).toContain('Failed to load')
  const timeout = await page.evaluate(
    async ({ item, core }) => {
      try {
        await window.DocumentationSmoke.runExample(item, [core], 1000)
        return 'unexpected success'
      }
      catch (error) {
        return String(error)
      }
    },
    { item: example('new Artplayer({ container: \'.artplayer-app\', url: \'\' });'), core },
  )
  expect(timeout).toContain('readiness timeout')
  expect(await page.locator('iframe[data-documentation-smoke]').count()).toBe(0)
})

test('frame-owned timers and globals do not survive into the next example', async ({ page }) => {
  await page.evaluate(
    async ({ first, second, core }) => {
      await window.DocumentationSmoke.runExample(first, [core])
      await window.DocumentationSmoke.runExample(second, [core])
    },
    {
      first: example(
        `${player}\nwindow.smokeLeak = 1; setTimeout(() => { throw new Error('late frame callback'); }, 700);`,
      ),
      second: example(
        `${player}\nif (window.smokeLeak) throw new Error('global leaked');\nnew Promise(resolve => setTimeout(resolve, 900));`,
      ),
      core,
    },
  )
  expect(await page.locator('iframe[data-documentation-smoke]').count()).toBe(0)
})

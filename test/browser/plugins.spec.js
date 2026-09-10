import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: late plugin registration preserves fulfillment without reviving a closed candidate`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(async () => {
      const container = document.createElement('div')
      document.body.append(container)
      const art = new window.Artplayer({ container, url: '' })
      const registry = art.plugins
      let resolve
      let disposed = 0
      const pending = registry.add(() => new Promise(done => resolve = done))
      art.destroy()
      resolve({ name: 'late', destroy() {
        disposed++
      } })
      const fulfilled = await pending
      const before = registry.id
      let calls = 0
      let error = ''
      try {
        registry.add(() => {
          calls++
          return { name: 'afterClose' }
        })
      }
      catch (caught) {
        error = caught.message
      }
      return { same: fulfilled === registry, late: Object.hasOwn(registry, 'late'), disposed, calls, error, idDelta: registry.id - before }
    })
    expect(result).toEqual(core === 'published'
      ? { same: true, late: true, disposed: 0, calls: 1, error: '', idDelta: 1 }
      : { same: true, late: false, disposed: 0, calls: 0, error: 'Cannot add a plugin after ArtPlayer is destroyed', idDelta: 0 })
  })
}

test('candidate: a plugin that closes construction prevents subsequent factories', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  const result = await page.evaluate(() => {
    const container = document.createElement('div')
    document.body.append(container)
    let calls = 0
    const art = new window.Artplayer({ container, url: '', plugins: [(art) => {
      art.destroy()
      return { name: 'closing' }
    }, () => {
      calls++
      return { name: 'never' }
    }] })
    return { calls, id: art.plugins.id, closing: Object.hasOwn(art.plugins, 'closing'), destroyed: art.isDestroy, instances: window.Artplayer.instances.length }
  })
  expect(result).toEqual({ calls: 0, id: 1, closing: false, destroyed: true, instances: 0 })
})

test('candidate: constructor-owned rejection is reported once without an unhandled rejection', async ({ page }) => {
  const warnings = []
  page.on('console', (message) => {
    if (message.type() === 'warning' && message.text().startsWith('Failed to initialize ArtPlayer plugin:'))
      warnings.push(message.args()[1].evaluate(error => ({ message: error.message, same: error === window.pluginFailure })))
  })
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.evaluate(() => {
    const container = document.createElement('div')
    document.body.append(container)
    window.pluginFailure = new Error('owned-plugin-rejection')
    window.art = new window.Artplayer({ container, url: '', plugins: [() => Promise.reject(window.pluginFailure)] })
  })
  await expect.poll(() => warnings.length).toBe(1)
  expect(await warnings[0]).toEqual({ message: 'owned-plugin-rejection', same: true })
  await page.evaluate(() => window.art.destroy())
})

test.describe('mobile user-agent builtin selection (not physical-device evidence)', () => {
  test.use({ userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36' })
  for (const core of ['published', 'candidate']) {
    test(`${core}: builtin order and live exclusions precede user plugins`, async ({ page }) => {
      await page.goto(`/test/player.html?core=${core}&chapter=published`)
      const results = await page.evaluate(() => [false, true].map((isLive) => {
        const container = document.createElement('div')
        document.body.append(container)
        const art = new window.Artplayer({ container, url: '', isLive, miniProgressBar: true, lock: true, autoPlayback: true, autoOrientation: true, fastForward: true, plugins: [() => ({ name: 'user' })] })
        const names = Object.getOwnPropertyNames(art.plugins).filter(name => !['art', 'id'].includes(name))
        art.destroy()
        return names
      }))
      expect(results).toEqual([
        ['mini-progress-bar', 'lock', 'auto-playback', 'autoOrientation', 'fastForward', 'user'],
        ['lock', 'autoOrientation', 'user'],
      ])
    })
  }
})

import { expect, test } from './fixtures.js'

async function setup(page, core, scale = 1) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(({ scale }) => {
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/pattern.mp4',
      muted: true,
      thumbnails: { url: '/test/thumbnail-grid.svg', number: 100, column: 10, width: 100, height: 60, scale },
    })
    window.hoverThumbnail = (percentage) => {
      const art = window.art
      const progress = art.template.$progress
      const clientX = progress.getBoundingClientRect().left + progress.clientWidth * percentage
      art.emit('setBar', 'hover', percentage, new MouseEvent('mousemove', { clientX }))
    }
  }, { scale })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

async function visible(page) {
  await expect.poll(() => page.evaluate(() => window.art.controls.thumbnails.style.backgroundImage)).not.toBe('')
}

for (const core of ['published', 'candidate']) {
  test(`${core}: thumbnail cells follow the generated grid at row boundaries and on returning to the first cell`, async ({ page }, testInfo) => {
    await setup(page, core)
    await page.evaluate(() => window.hoverThumbnail(0.1))
    await visible(page)
    const result = await page.evaluate(() => {
      const art = window.art
      const element = art.controls.thumbnails
      const row = element.style.backgroundPosition
      const dimensions = [element.style.width, element.style.height]
      window.hoverThumbnail(0.11)
      const ordinary = element.style.backgroundPosition
      window.hoverThumbnail(0.001)
      const first = element.style.backgroundPosition
      const left = element.style.left
      window.hoverThumbnail(0.999)
      const last = element.style.backgroundPosition
      const right = Number.parseFloat(element.style.left)
      const expectedRight = art.template.$progress.clientWidth - 100
      const descriptor = Object.getOwnPropertyDescriptor(art, 'thumbnails')
      return { row, ordinary, first, last, left, right, expectedRight, dimensions, immutable: !descriptor.enumerable && !descriptor.configurable }
    })
    expect(result.row).toBe(core === 'published' ? '-900px 0px' : '0px -60px')
    expect(result.ordinary).toBe('-100px -60px')
    expect(result.first).toBe(core === 'published' ? '-100px -60px' : '0px 0px')
    expect(result.last).toBe('-900px -540px')
    expect(result.left).toBe('0px')
    expect(result.right).toBe(result.expectedRight)
    expect(result.dimensions).toEqual(['100px', '60px'])
    expect(result.immutable).toBe(true)
    await testInfo.attach('thumbnail-grid', { contentType: 'image/png', body: await page.locator('.player').screenshot() })
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: scaled internal thumbnails and public image results have distinct Blob URL owners`, async ({ page }) => {
    await setup(page, core, 0.5)
    await page.evaluate(() => {
      window.thumbnailRevocations = []
      const original = URL.revokeObjectURL
      URL.revokeObjectURL = function (url) {
        window.thumbnailRevocations.push(url)
        return original.call(this, url)
      }
    })
    await page.evaluate(() => window.hoverThumbnail(0.2))
    await visible(page)
    const result = await page.evaluate(async () => {
      const art = window.art
      const style = art.controls.thumbnails.style
      const internal = style.backgroundImage.slice(5, -2)
      const image = await window.Artplayer.utils.loadImg('/test/thumbnail-grid.svg', 0.5)
      const publicUrl = image.src
      const dimensions = [image.naturalWidth, image.naturalHeight]
      const previewSize = [style.width, style.height]
      art.destroy()
      const revokedInternal = window.thumbnailRevocations.filter(url => url === internal).length
      const revokedPublic = window.thumbnailRevocations.filter(url => url === publicUrl).length
      const blob = await (await fetch(publicUrl)).blob()
      URL.revokeObjectURL(publicUrl)
      if (!revokedInternal)
        URL.revokeObjectURL(internal)
      return { dimensions, previewSize, internalBlob: internal.startsWith('blob:'), revokedInternal, revokedPublic, publicType: blob.type }
    })
    expect(result).toEqual({ dimensions: [500, 300], previewSize: ['50px', '30px'], internalBlob: true, revokedInternal: core === 'published' ? 0 : 1, revokedPublic: 0, publicType: 'image/png' })
  })

  test(`${core}: a delayed image follows the latest hover rather than the first request position`, async ({ page, request }) => {
    const svg = await (await request.get('/test/thumbnail-grid.svg')).body()
    let release
    const gate = new Promise(resolve => release = resolve)
    let requested
    const received = new Promise(resolve => requested = resolve)
    await page.route('**/test/thumbnail-grid.svg?delayed=1', async (route) => {
      requested()
      await gate
      await route.fulfill({ contentType: 'image/svg+xml', body: svg })
    })
    await setup(page, core)
    await page.evaluate(() => {
      window.art.thumbnails = { ...window.art.thumbnails, url: '/test/thumbnail-grid.svg?delayed=1' }
      window.hoverThumbnail(0.2)
    })
    await received
    await page.evaluate(() => window.hoverThumbnail(0.7))
    release()
    await visible(page)
    const result = await page.evaluate(() => ({ left: Number.parseFloat(window.art.controls.thumbnails.style.left), width: window.art.template.$progress.clientWidth }))
    expect(result.left).toBeCloseTo(result.width * (core === 'published' ? 0.2 : 0.7) - 50, 4)
    await page.evaluate(() => window.art.destroy())
  })
}

test('candidate: removing thumbnails revokes the scaled image and a replacement control can reload', async ({ page }) => {
  await setup(page, 'candidate', 0.5)
  await page.evaluate(() => window.hoverThumbnail(0.2))
  await visible(page)
  await page.evaluate(() => {
    const art = window.art
    const url = art.controls.thumbnails.style.backgroundImage.slice(5, -2)
    window.removedThumbnailRevocations = 0
    const original = URL.revokeObjectURL
    URL.revokeObjectURL = function (value) {
      if (value === url)
        window.removedThumbnailRevocations++
      return original.call(this, value)
    }
    art.controls.remove('thumbnails')
    art.controls.add({ name: 'thumbnails', position: 'top', index: 20 })
    window.hoverThumbnail(0.4)
  })
  await visible(page)
  expect(await page.evaluate(() => window.removedThumbnailRevocations)).toBe(1)
  await page.evaluate(() => window.art.destroy())
  expect(await page.evaluate(() => window.removedThumbnailRevocations)).toBe(1)
})

test('candidate: image failure permits a retry through the same thumbnail configuration', async ({ page, request }) => {
  const svg = await (await request.get('/test/thumbnail-grid.svg')).body()
  let attempts = 0
  await page.route('**/test/thumbnail-grid.svg?retry=1', async (route) => {
    attempts++
    await route.fulfill({
      status: attempts === 1 ? 503 : 200,
      headers: { 'Cache-Control': 'no-store' },
      contentType: 'image/svg+xml',
      body: attempts === 1 ? '<temporary-image-failure/>' : svg,
    })
  })
  await setup(page, 'candidate')
  const warning = page.waitForEvent('console', message => message.type() === 'warning' && message.text().includes('ArtPlayer thumbnail load failed'))
  await page.evaluate(() => {
    window.art.thumbnails = { ...window.art.thumbnails, url: '/test/thumbnail-grid.svg?retry=1' }
    window.hoverThumbnail(0.2)
  })
  await warning
  await page.evaluate(() => window.hoverThumbnail(0.3))
  await visible(page)
  expect(attempts).toBe(2)
  await page.evaluate(() => window.art.destroy())
})

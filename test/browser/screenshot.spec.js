import { expect, test } from './fixtures.js'

async function setup(page, core, crossOrigin = false, control = false) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(({ crossOrigin, control }) => {
    const url = new URL('/test/pattern.mp4', location.href)
    if (crossOrigin)
      url.hostname = 'localhost'
    window.art = new window.Artplayer({ container: '.player', url: url.href, muted: true, screenshot: control })
  }, { crossOrigin, control })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.evaluate(() => window.art.play())
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
  await page.evaluate(() => window.art.pause())
}

for (const core of ['published', 'candidate']) {
  test(`${core}: captures decoded PNG pixels and consumer-owned Blob URLs`, async ({ page }) => {
    await setup(page, core)
    const result = await page.evaluate(async () => {
      const art = window.art
      const data = await art.getDataURL()
      const url = await art.getBlobUrl()
      const image = new Image()
      image.src = data
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)
      const pixels = context.getImageData(0, 0, image.width, image.height).data
      const colors = new Set()
      for (let index = 0; index < pixels.length; index += 4)
        colors.add(`${pixels[index]},${pixels[index + 1]},${pixels[index + 2]}`)
      const expected = [art.video.videoWidth, art.video.videoHeight]
      const descriptors = ['getDataURL', 'getBlobUrl', 'screenshot'].map((name) => {
        const d = Object.getOwnPropertyDescriptor(art, name)
        return [d.writable, d.configurable, d.enumerable]
      })
      art.destroy()
      const blob = await (await fetch(url)).blob()
      URL.revokeObjectURL(url)
      return { png: data.startsWith('data:image/png;base64,'), dimensions: [image.width, image.height], expected, colors: colors.size, blobType: blob.type, blobSize: blob.size, descriptors }
    })
    expect(result.png).toBe(true)
    expect(result.dimensions).toEqual(result.expected)
    expect(result.dimensions[0]).toBeGreaterThan(0)
    expect(result.colors).toBeGreaterThan(10)
    expect(result.blobType).toBe('image/png')
    expect(result.blobSize).toBeGreaterThan(100)
    expect(result.descriptors).toEqual(Array.from({ length: 3 }, () => [false, false, false]))
  })

  test(`${core}: screenshot preserves download filename, event data and Promise result`, async ({ page }) => {
    await setup(page, core)
    const downloadPromise = page.waitForEvent('download')
    const result = await page.evaluate(async () => {
      const art = window.art
      const events = []
      art.on('screenshot', value => events.push(value))
      const screenshot = art.screenshot
      const value = await screenshot('chosen.png')
      art.destroy()
      return { count: events.length, same: events[0] === value, png: value.startsWith('data:image/png;base64,') }
    })
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe('chosen.png.png')
    expect(result).toEqual({ count: 1, same: true, png: true })
    await download.delete()
  })

  test(`${core}: actual cross-origin video rejects capture with SecurityError and notice`, async ({ page }) => {
    await setup(page, core, true)
    const result = await page.evaluate(async () => {
      const art = window.art
      const errors = []
      for (const name of ['getDataURL', 'getBlobUrl', 'screenshot']) {
        try {
          await art[name]()
          errors.push('resolved')
        }
        catch (error) {
          errors.push(error.name)
        }
      }
      const result = { errors, notice: art.notice.show, text: art.template.$noticeInner.textContent.length }
      art.destroy()
      return result
    })
    expect(result.errors).toEqual(['SecurityError', 'SecurityError', 'SecurityError'])
    expect(result.notice).toBe(true)
    expect(result.text).toBeGreaterThan(0)
  })

  test(`${core}: source replacement does not download a stale captured frame`, async ({ page }) => {
    await setup(page, core)
    const result = await page.evaluate(async () => {
      const art = window.art
      let events = 0
      let downloads = 0
      const original = HTMLAnchorElement.prototype.click
      HTMLAnchorElement.prototype.click = () => {
        downloads++
      }
      art.on('screenshot', () => {
        events++
      })
      try {
        const promise = art.screenshot()
        art.url = '/test/pattern.mp4?replacement=1'
        const result = { png: (await promise).startsWith('data:image/png;base64,'), events, downloads }
        art.destroy()
        return result
      }
      finally {
        HTMLAnchorElement.prototype.click = original
      }
    })
    const oldEffects = core === 'published' ? 1 : 0
    expect(result).toEqual({ png: true, events: oldEffects, downloads: oldEffects })
  })

  test(`${core}: screenshot toolbar rejection has exact historical error accounting`, async ({ page }, testInfo) => {
    await setup(page, core, false, true)
    await page.evaluate((core) => {
      window.captureFailures = []
      const failure = new Error('controlled screenshot draw failure')
      const original = HTMLCanvasElement.prototype.toDataURL
      window.restoreCapture = () => {
        HTMLCanvasElement.prototype.toDataURL = original
      }
      HTMLCanvasElement.prototype.toDataURL = () => {
        throw failure
      }
      if (core === 'published') {
        window.addEventListener('unhandledrejection', (event) => {
          if (event.reason === failure) {
            window.captureFailures.push(event.reason.message)
            event.preventDefault()
          }
        })
      }
      window.art.notice.show = false
    }, core)
    await page.locator('.art-control-screenshot').click()
    await expect.poll(() => page.evaluate(() => window.art.template.$noticeInner.textContent)).toBe('controlled screenshot draw failure')
    if (core === 'published')
      await expect.poll(() => page.evaluate(() => window.captureFailures.length)).toBe(1)
    const known = await page.evaluate(() => {
      window.restoreCapture()
      window.art.destroy()
      return window.captureFailures
    })
    expect(known).toEqual(core === 'published' ? ['controlled screenshot draw failure'] : [])
    await testInfo.attach('known-screenshot-rejections', { contentType: 'application/json', body: JSON.stringify(known) })
  })
}

test('candidate: null toBlob callback rejects and reports without a page error', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(async () => {
    const prototype = HTMLCanvasElement.prototype
    const original = prototype.toBlob
    prototype.toBlob = function (callback) {
      queueMicrotask(() => callback(null))
    }
    try {
      await window.art.getBlobUrl()
      return 'resolved'
    }
    catch (error) {
      return error.message
    }
    finally {
      prototype.toBlob = original
      window.art.destroy()
    }
  })).toBe('Unable to encode screenshot blob')
})

test('candidate: destroy during screenshot await suppresses the queued download and event', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(async () => {
    const art = window.art
    let events = 0
    let downloads = 0
    const original = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = () => {
      downloads++
    }
    art.on('screenshot', () => {
      events++
    })
    try {
      const promise = art.screenshot()
      art.destroy()
      return { png: (await promise).startsWith('data:image/png;base64,'), events, downloads }
    }
    finally {
      HTMLAnchorElement.prototype.click = original
    }
  })).toEqual({ png: true, events: 0, downloads: 0 })
})

test('candidate: cross-origin screenshot toolbar handles its internal rejected Promise', async ({ page }) => {
  await setup(page, 'candidate', true, true)
  await page.evaluate(() => {
    window.art.notice.show = false
  })
  await page.locator('.art-control-screenshot').click()
  await expect.poll(() => page.evaluate(() => window.art.notice.show)).toBe(true)
  await page.evaluate(() => window.art.destroy())
})

import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await page.locator('#play').click()
  await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
  await page.locator('#pause').click()
  await expect.poll(() => page.evaluate(() => window.art.video.paused && !window.art.video.seeking)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  for (const mode of ['remove', 'destroy', 'source']) {
    test(`${core}: progress click reentry through ${mode} cannot continue an obsolete seek`, async ({ page }) => {
      await setup(page, core)
      const result = await page.evaluate((mode) => {
        const art = window.art
        let seeks = 0
        let bars = 0
        art.on('seek', () => seeks++)
        art.on('setBar', (type) => {
          if (type !== 'played' || bars++)
            return
          if (mode === 'remove')
            art.controls.remove('progress')
          else if (mode === 'destroy')
            art.destroy()
          else
            art.url = '/test/pattern.mp4?progress=reentrant'
        })
        const progress = art.template.$progress
        progress.dispatchEvent(new MouseEvent('click', { clientX: progress.getBoundingClientRect().left + progress.clientWidth / 2 }))
        const result = { seeks, bars }
        art.destroy()
        return result
      }, mode)
      expect(result).toEqual({ seeks: core === 'published' ? 1 : 0, bars: 1 })
    })
  }

  test(`${core}: real progress click keeps setBar before seek and clamps the edges`, async ({ page }) => {
    await setup(page, core)
    const rect = await page.evaluate(() => {
      const art = window.art
      window.progressOrder = []
      art.on('setBar', (type, percent) => {
        if (type === 'played')
          window.progressOrder.push(['setBar', percent])
      })
      art.on('seek', () => window.progressOrder.push(['seek']))
      const rect = art.template.$progress.getBoundingClientRect()
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    })
    await page.mouse.click(rect.x, rect.y)
    await expect.poll(() => page.evaluate(() => window.art.video.seeking)).toBe(false)
    expect(await page.evaluate(() => window.art.currentTime / window.art.duration)).toBeCloseTo(0.5, 1)
    const result = await page.evaluate(() => {
      const art = window.art
      const firstSeek = window.progressOrder.findIndex(item => item[0] === 'seek')
      const previous = window.progressOrder[firstSeek - 1]
      const progress = art.template.$progress
      progress.dispatchEvent(new MouseEvent('click', { clientX: progress.getBoundingClientRect().left - 100 }))
      const start = art.currentTime
      progress.dispatchEvent(new MouseEvent('click', { clientX: progress.getBoundingClientRect().right + 100 }))
      const end = art.currentTime
      const duration = art.duration
      art.destroy()
      return { previous, start, end, duration }
    })
    expect(result.previous[0]).toBe('setBar')
    expect(result.previous[1]).toBeCloseTo(0.5, 1)
    expect(result.start).toBe(0)
    expect(result.end).toBeCloseTo(result.duration, 1)
  })

  test(`${core}: a progress drag ends when its source is replaced and can restart on the new source`, async ({ page }) => {
    await setup(page, core)
    const stale = await page.evaluate(() => {
      const art = window.art
      window.dragSeeks = 0
      art.on('seek', () => window.dragSeeks++)
      const progress = art.template.$progress
      progress.dispatchEvent(new MouseEvent('mousedown', { button: 0 }))
      art.url = '/test/pattern.mp4?progress=new-source'
      art.emit('document:mousemove', new MouseEvent('mousemove', { clientX: progress.getBoundingClientRect().left + progress.clientWidth / 2 }))
      return window.dragSeeks
    })
    expect(stale).toBe(core === 'published' ? 1 : 0)
    await expect.poll(() => page.evaluate(() => window.art.video.readyState >= 2)).toBe(true)
    expect(await page.evaluate(() => {
      const art = window.art
      const progress = art.template.$progress
      progress.dispatchEvent(new MouseEvent('mousedown', { button: 0 }))
      art.emit('document:mousemove', new MouseEvent('mousemove', { clientX: progress.getBoundingClientRect().left + progress.clientWidth / 2 }))
      art.emit('document:mouseup', new MouseEvent('mouseup'))
      const seeks = window.dragSeeks
      art.destroy()
      return seeks
    })).toBe(stale + 1)
  })

  test(`${core}: a caller-owned media Blob URL remains readable after switching and destroying the player`, async ({ page, browserName }, testInfo) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(async () => {
      window.blobCapabilities = []
      let blob
      let fallback
      for (const extension of ['mp4', 'webm']) {
        const candidate = await (await fetch(`/test/pattern.${extension}`)).blob()
        fallback ||= candidate
        const url = URL.createObjectURL(candidate)
        const video = document.createElement('video')
        const capability = await new Promise((resolve) => {
          video.onloadedmetadata = () => resolve({ extension, width: video.videoWidth, error: 0 })
          video.onerror = () => resolve({ extension, width: video.videoWidth, error: video.error.code })
          video.src = url
          video.load()
        })
        window.blobCapabilities.push(capability)
        video.onloadedmetadata = null
        video.onerror = null
        video.removeAttribute('src')
        video.load()
        URL.revokeObjectURL(url)
        if (!capability.error) {
          blob = candidate
          break
        }
      }
      window.blobPlayable = !!blob
      blob ||= fallback
      window.sharedBlobSize = blob.size
      window.sharedBlobUrl = URL.createObjectURL(blob)
      window.borrowedRevocations = []
      const original = URL.revokeObjectURL
      URL.revokeObjectURL = function (url) {
        window.borrowedRevocations.push(url)
        return original.call(this, url)
      }
      window.createPlayer(window.blobPlayable ? window.sharedBlobUrl : '/test/pattern.mp4')
    })
    const capabilities = await page.evaluate(() => window.blobCapabilities)
    await testInfo.attach('native-blob-capabilities', { contentType: 'application/json', body: JSON.stringify(capabilities) })
    if (!capabilities.some(item => item.error === 0)) {
      expect(browserName).toBe('webkit')
      expect(capabilities).toEqual([{ extension: 'mp4', width: 0, error: 4 }, { extension: 'webm', width: 0, error: 4 }])
    }
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const result = await page.evaluate(async () => {
      const art = window.art
      // The Windows WebKit runtime cannot decode either Blob fixture natively.
      // Still exercise actual URL assignment/replacement and byte ownership there.
      if (!window.blobPlayable)
        art.url = window.sharedBlobUrl
      const assigned = art.video.src === window.sharedBlobUrl
      await art.switchUrl('/test/pattern.mp4?borrowed=replaced')
      const read = async () => {
        try {
          return (await (await fetch(window.sharedBlobUrl)).blob()).size
        }
        catch (error) {
          return error.name
        }
      }
      const afterSwitch = await read()
      art.destroy()
      const afterDestroy = await read()
      const revoked = window.borrowedRevocations.filter(url => url === window.sharedBlobUrl).length
      URL.revokeObjectURL(window.sharedBlobUrl)
      return { afterSwitch, afterDestroy, revoked, size: window.sharedBlobSize, assigned, decodedBlob: window.blobPlayable }
    })
    expect(result.size).toBeGreaterThan(100)
    expect(result.assigned).toBe(true)
    await testInfo.attach('borrowed-url-evidence', { contentType: 'application/json', body: JSON.stringify(result) })
    expect(result.revoked).toBe(core === 'published' ? 1 : 0)
    expect(result.afterSwitch).toBe(core === 'published' ? 'TypeError' : result.size)
    expect(result.afterDestroy).toBe(core === 'published' ? 'TypeError' : result.size)
  })

  test(`${core}: quality selectors retain default labels, source position and empty-array behavior`, async ({ page, browserName }, testInfo) => {
    await setup(page, core)
    await page.evaluate(() => {
      const art = window.art
      window.qualityNativeEvents = []
      for (const key of ['currentTime', 'playbackRate', 'src']) {
        const descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, key)
        Object.defineProperty(art.video, key, {
          configurable: true,
          get() { return descriptor.get.call(this) },
          set(value) {
            window.qualityNativeEvents.push({ key, value, time: this.currentTime, seeking: this.seeking, source: this.currentSrc })
            descriptor.set.call(this, value)
          },
        })
      }
      for (const event of ['loadedmetadata', 'seeking', 'seeked', 'canplay', 'ratechange', 'pause', 'playing'])
        art.video.addEventListener(event, () => window.qualityNativeEvents.push({ event, time: art.currentTime, seeking: art.video.seeking, source: art.video.currentSrc }))
      art.playbackRate = 1.5
      art.currentTime = 2
      window.qualityRestarts = []
      art.on('restart', url => window.qualityRestarts.push(url))
      window.qualityOptions = [
        { html: 'Quality A', url: '/test/pattern.mp4?quality=A' },
        { html: 'Quality B', url: '/test/pattern.mp4?quality=B', default: true },
      ]
      art.quality = window.qualityOptions
    })
    await expect.poll(() => page.evaluate(() => Math.abs(window.art.currentTime - 2) < 0.05 && !window.art.video.seeking)).toBe(true)
    await expect(page.locator('.art-control-quality .art-selector-value')).toHaveText('Quality B')
    await page.locator('.art-control-quality').hover()
    await page.locator('.art-control-quality .art-selector-item').filter({ hasText: 'Quality A' }).click()
    await expect.poll(() => page.evaluate(() => window.art.url.includes('quality=A'))).toBe(true)
    await expect.poll(() => page.evaluate(() => window.qualityRestarts)).toEqual(['/test/pattern.mp4?quality=A'])
    await expect.poll(() => page.evaluate(() => window.art.video.readyState >= 3 && !window.art.video.seeking)).toBe(true)
    await expect(page.locator('.art-control-quality .art-selector-value')).toHaveText('Quality A')
    await testInfo.attach('quality-native-events', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => window.qualityNativeEvents)) })
    const restoredTime = await page.evaluate(() => window.art.currentTime)
    if (core === 'published' && browserName === 'webkit')
      expect(restoredTime).toBeLessThan(0.05)
    else
      expect(restoredTime).toBeCloseTo(2, 1)
    expect(await page.evaluate(() => window.art.playbackRate)).toBe(1.5)
    expect(await page.evaluate(() => window.qualityOptions.map(item => !!item.default))).toEqual([true, false])
    const empty = await page.evaluate(() => {
      const art = window.art
      art.quality = []
      const result = { text: art.controls.quality.textContent, read: art.quality, hasGetter: !!Object.getOwnPropertyDescriptor(art, 'quality').get }
      art.destroy()
      return result
    })
    expect(empty).toEqual({ text: '', read: undefined, hasGetter: false })
  })
}

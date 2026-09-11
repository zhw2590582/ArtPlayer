import { devices } from '@playwright/test'
import { expect, test } from './fixtures.js'

async function openChapter(page, core, chapter) {
  await page.goto(`/test/player.html?core=${core}&chapter=${chapter}`)
  await page.evaluate(() => {
    document.querySelector('.player').style.cssText = 'width:min(640px,100%);height:300px'
    window.chapterEvents = []
    window.chapterMediaEvents = []
    window.art = new window.Artplayer({
      container: '.player',
      url: '/test/pattern.mp4?quality=B',
      muted: true,
      fullscreen: true,
      fullscreenWeb: true,
      miniProgressBar: true,
      quality: [
        { html: 'Quality A', url: '/test/pattern.mp4?quality=A' },
        { html: 'Quality B', url: '/test/pattern.mp4?quality=B', default: true },
      ],
      thumbnails: { url: '/test/thumbnail-grid.svg', number: 100, column: 10, width: 100, height: 60 },
      plugins: [window.artplayerPluginChapter({ chapters: [
        { start: 0, end: 2, title: 'Opening' },
        { start: 2, end: 6, title: 'Middle' },
        { start: 6, end: 8, title: 'Ending' },
      ] })],
    })
    for (const name of ['restart', 'seek', 'fullscreen', 'fullscreenWeb'])
      window.art.on(name, value => window.chapterEvents.push({ name, value }))
    for (const name of ['loadedmetadata', 'loadeddata', 'canplay', 'seeking', 'seeked', 'playing', 'pause', 'error'])
      window.art.video.addEventListener(name, () => window.chapterMediaEvents.push({ name, time: window.art.currentTime, source: window.art.video.currentSrc, paused: window.art.video.paused, readyState: window.art.video.readyState }))
    document.querySelector('#play').onclick = () => window.art.play()
    document.querySelector('#pause').onclick = () => window.art.pause()
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await expect(page.locator('.art-chapter')).toHaveCount(3)
}

async function hoverChapter(page, percentage, text) {
  const inner = page.locator('.art-control-progress-inner')
  const box = await inner.boundingBox()
  const x = Math.round(box.x + box.width * percentage)
  await page.mouse.move(x, box.y + box.height / 2)
  await expect(page.locator('.art-chapter-title')).toHaveText(text)
  await expect(page.locator('.art-chapter-title')).toHaveCSS('opacity', '1')
  await expect(page.locator('.art-control-thumbnails')).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.art.controls.thumbnails.style.backgroundImage)).not.toBe('')
  const layout = await page.evaluate(() => {
    const rect = (element) => {
      const box = element.getBoundingClientRect()
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom }
    }
    return {
      title: rect(document.querySelector('.art-chapter-title')),
      thumbnail: rect(window.art.controls.thumbnails),
      progress: rect(document.querySelector('.art-control-progress-inner')),
    }
  })
  expect(layout.title.left).toBeGreaterThanOrEqual(layout.progress.left - 1)
  expect(layout.title.right).toBeLessThanOrEqual(layout.progress.right + 1)
  expect(layout.thumbnail.bottom).toBeLessThanOrEqual(layout.title.top)
  return { box, x, layout }
}

test.afterEach(async ({ page }, testInfo) => {
  const state = await page.evaluate(() => ({
    events: window.chapterEvents,
    nativeEvents: window.chapterMediaEvents,
    time: window.art?.currentTime,
    paused: window.art?.video.paused,
    mediaError: window.art?.video.error?.code || null,
    source: window.art?.video.currentSrc,
    readyState: window.art?.video.readyState,
    mobileBranch: window.Artplayer?.utils.isMobile,
    maxTouchPoints: navigator.maxTouchPoints,
    chapters: [...document.querySelectorAll('.art-chapter')].map(node => ({ ...node.dataset })),
  })).catch(error => ({ error: error.message }))
  await testInfo.attach('chapter-combination-state', { contentType: 'application/json', body: JSON.stringify(state) })
  if (!page.isClosed())
    await page.evaluate(() => window.art?.destroy())
})

for (const core of ['published', 'candidate']) {
  for (const chapter of ['published', 'candidate']) {
    test(`${core} core + ${chapter} chapter: long titles retain text within a narrow player`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await openChapter(page, core, chapter)
      const fullTitle = 'A long chapter title with complete metadata retained for consumers. '.repeat(4)
      await page.evaluate(fullTitle => window.art.plugins.artplayerPluginChapter.update({ chapters: [{ start: 0, end: Infinity, title: fullTitle }] }), fullTitle)
      const box = await page.locator('.art-control-progress-inner').boundingBox()
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await expect(page.locator('.art-chapter-title')).toHaveText(fullTitle.trim())
      await expect(page.locator('.art-chapter-title')).toHaveCSS('opacity', '1')
      const layout = await page.locator('.art-chapter-title').evaluate((element) => {
        const title = element.getBoundingClientRect()
        const progress = element.parentElement.getBoundingClientRect()
        return { left: title.left, right: title.right, width: title.width, progressLeft: progress.left, progressRight: progress.right, text: element.textContent, dataset: element.parentElement.querySelector('.art-chapter').dataset.title }
      })
      await testInfo.attach('long-chapter-layout', { contentType: 'application/json', body: JSON.stringify(layout) })
      await testInfo.attach('long-chapter-title', { contentType: 'image/png', body: await page.screenshot() })
      expect(layout.text).toBe(fullTitle.trim())
      expect(layout.dataset).toBe(fullTitle.trim())
      expect(layout.left).toBeGreaterThanOrEqual(layout.progressLeft - 1)
      if (chapter === 'published')
        expect(layout.right).toBeGreaterThan(layout.progressRight)
      else
        expect(layout.right).toBeLessThanOrEqual(layout.progressRight + 1)
    })

    test(`${core} core + ${chapter} chapter: quality switch preserves chapter/thumbnail interactions`, async ({ page, browserName }, testInfo) => {
      await openChapter(page, core, chapter)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.2)
      await page.locator('#pause').click()
      const { box, x } = await hoverChapter(page, 0.375, 'Middle')
      await page.mouse.click(x, box.y + box.height / 2)
      await expect.poll(() => page.evaluate(() => !window.art.video.seeking)).toBe(true)
      const time = await page.evaluate(() => window.art.currentTime)
      expect(time).toBeCloseTo(3, 1)
      await expect.poll(() => page.locator('.art-chapter .art-progress-played').nth(1).evaluate(node => Number.parseFloat(node.style.width))).toBeCloseTo(25, 0)
      expect(await page.locator('.art-chapter .art-progress-played').evaluateAll(nodes => [nodes[0].style.width, nodes[2].style.width])).toEqual(['100%', '0px'])
      await page.locator('.art-control-quality').hover()
      await expect(page.locator('.art-control-quality .art-selector-list')).toHaveCSS('opacity', '1')
      await page.locator('.art-control-quality .art-selector-item').filter({ hasText: 'Quality A' }).click()
      await expect.poll(() => page.evaluate(() => window.art.url.includes('quality=A'))).toBe(true)
      await expect.poll(() => page.evaluate(() => window.chapterEvents.filter(event => event.name === 'restart').map(event => event.value))).toEqual(['/test/pattern.mp4?quality=A'])
      await expect.poll(() => page.evaluate(() => !window.art.video.seeking && window.art.video.readyState >= 2)).toBe(true)
      const restoredTime = await page.evaluate(() => window.art.currentTime)
      const historicalReset = core === 'published' && browserName === 'webkit'
      if (historicalReset)
        expect(restoredTime).toBeLessThan(0.05)
      else
        expect(restoredTime).toBeCloseTo(time, 1)
      await testInfo.attach('quality-position', { contentType: 'application/json', body: JSON.stringify({ before: time, restoredTime, historicalReset }) })
      expect(await page.evaluate(() => window.art.video.paused)).toBe(true)
      await expect(page.locator('.art-control-quality .art-selector-value')).toHaveText('Quality A')
      await page.locator('#pause').click()
      await expect(page.locator('.art-control-quality .art-selector-list')).toHaveCSS('opacity', '0')
      await hoverChapter(page, 0.85, 'Ending')
      await page.evaluate(() => window.art.plugins.artplayerPluginChapter.update({ chapters: [{ start: 0, end: Infinity, title: 'Updated after quality' }] }))
      await hoverChapter(page, 0.5, 'Updated after quality')
      await testInfo.attach('chapter-quality-thumbnail', { contentType: 'image/png', body: await page.locator('.art-video-player').screenshot() })
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(restoredTime + 0.2)
      expect(await page.evaluate(() => window.art.video.error)).toBeNull()
    })

    for (const mode of ['fullscreenWeb', 'fullscreen']) {
      test(`${core} core + ${chapter} chapter: ${mode} keeps hover geometry and exits cleanly`, async ({ page }, testInfo) => {
        await openChapter(page, core, chapter)
        if (mode === 'fullscreenWeb')
          await page.evaluate(() => { window.Artplayer.FULLSCREEN_WEB_IN_BODY = true })
        const control = page.locator(`.art-control-${mode}`)
        const before = await page.locator('.art-control-progress-inner').boundingBox()
        await control.click()
        await expect.poll(() => page.evaluate(mode => window.art[mode], mode)).toBe(true)
        const { box, layout } = await hoverChapter(page, 0.5, 'Middle')
        expect(box.width).toBeGreaterThanOrEqual(before.width)
        await testInfo.attach(`chapter-${mode}`, { contentType: 'image/png', body: await page.screenshot() })
        await testInfo.attach('chapter-fullscreen-layout', { contentType: 'application/json', body: JSON.stringify(layout) })
        await control.click()
        await expect.poll(() => page.evaluate(mode => window.art[mode], mode)).toBe(false)
        expect(await page.evaluate(() => window.art.template.$container.contains(window.art.template.$player))).toBe(true)
        await hoverChapter(page, 0.99, 'Ending')
        expect(await page.evaluate(mode => window.chapterEvents.filter(event => event.name === mode).map(event => event.value), mode)).toEqual([true, false])
      })
    }

    test.describe(`${core} core + ${chapter} chapter touch emulation`, () => {
      test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, userAgent: devices['iPhone 13'].userAgent })
      test('trusted taps seek through chapters before and after web fullscreen', async ({ page }, testInfo) => {
        await openChapter(page, core, chapter)
        expect(await page.evaluate(() => window.Artplayer.utils.isMobile)).toBe(true)
        await page.evaluate(() => {
          window.chapterTouches = []
          window.art.template.$progress.addEventListener('touchstart', event => window.chapterTouches.push({ trusted: event.isTrusted, touches: event.touches.length }))
        })
        for (const fullscreen of [false, true, false]) {
          if (await page.evaluate(() => window.art.fullscreenWeb) !== fullscreen)
            await page.locator('.art-control-fullscreenWeb').tap()
          await expect.poll(() => page.evaluate(() => window.art.fullscreenWeb)).toBe(fullscreen)
          const progress = await page.locator('.art-control-progress-inner').boundingBox()
          await page.touchscreen.tap(progress.x + progress.width * 0.375, progress.y + progress.height / 2)
          await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeCloseTo(3, 1)
          await expect.poll(() => page.evaluate(() => !window.art.video.seeking)).toBe(true)
          await expect(page.locator('.art-chapter')).toHaveCount(3)
        }
        expect(await page.evaluate(() => window.chapterTouches)).toEqual(Array.from({ length: 3 }, () => ({ trusted: true, touches: 1 })))
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await testInfo.attach('chapter-touch-emulation', { contentType: 'image/png', body: await page.screenshot() })
      })
    })
  }
}

import { hoverProgress } from './chapter-hover.ts'
import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: chapter hover waits for a moving fullscreen progress bar`, async ({ page }, testInfo) => {
    await page.goto(`/test/player.html?core=${core}&chapter=candidate`)
    await page.evaluate(() => {
      window.art = new window.Artplayer({
        container: '.player',
        url: '/test/pattern.mp4',
        muted: true,
        fullscreen: true,
        plugins: [window.artplayerPluginChapter({ chapters: [{ start: 0, end: 2, title: 'Opening' }, { start: 2, end: 6, title: 'Middle' }, { start: 6, end: Infinity, title: 'Ending' }] })],
      })
    })
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    await page.locator('.art-control-fullscreen').click()
    await expect.poll(() => page.evaluate(() => window.art.fullscreen)).toBe(true)
    await page.evaluate(async () => {
      window.progressAnimation = document.querySelector('.art-progress').animate([
        { transform: 'translateY(-60px)' },
        { transform: 'translateY(0)' },
      ], { duration: 600, easing: 'linear' })
      await window.progressAnimation.ready
    })
    const pointer = await hoverProgress(page, 0.5)
    await page.evaluate(() => window.progressAnimation.finished)
    const layout = await page.evaluate(({ x, y }) => {
      const element = document.querySelector('.art-control-progress-inner')
      const rect = element.getBoundingClientRect()
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, pointerInside: !!document.elementFromPoint(x, y)?.closest('.art-progress'), title: document.querySelector('.art-chapter-title').textContent }
    }, pointer)
    await testInfo.attach('chapter-hover-motion', { contentType: 'application/json', body: JSON.stringify({ core, baseline: process.env.ARTPLAYER_CHAPTER_HOVER_BASELINE === '1', pointer, layout, motion: 'controlled native Web Animation after actual fullscreen; no media or hit-test mocks' }) })
    expect(layout.pointerInside).toBe(true)
    expect(pointer.x).toBeGreaterThanOrEqual(layout.x)
    expect(pointer.x).toBeLessThanOrEqual(layout.x + layout.width)
    expect(pointer.y).toBeGreaterThanOrEqual(layout.y)
    expect(pointer.y).toBeLessThanOrEqual(layout.y + layout.height)
    await expect(page.locator('.art-chapter-title')).toHaveText('Middle')
    await expect(page.locator('.art-chapter-title')).toHaveCSS('opacity', '1')
    await page.locator('.art-control-fullscreen').click()
    await expect.poll(() => page.evaluate(() => window.art.fullscreen)).toBe(false)
    await page.evaluate(() => window.art.destroy())
  })
}

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
  })
})

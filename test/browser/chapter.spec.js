import { expect, test } from './fixtures.js'

async function openChapter(page, chapter, chapters = []) {
  await page.goto(`/test/player.html?core=published&chapter=${chapter}`)
  await page.evaluate((chapters) => {
    window.chapterInput = chapters
    window.createPlayer('/test/pattern.mp4', { chapters })
  }, chapters)
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

function segments(page) {
  return page.locator('.art-chapter').evaluateAll(nodes => nodes.map(node => ({
    start: node.dataset.start,
    end: node.dataset.end,
    title: node.dataset.title,
    width: node.style.width,
  })))
}

async function hover(page, percentage) {
  const box = await page.locator('.art-control-progress-inner').boundingBox()
  const x = Math.round(box.x + box.width * percentage)
  await page.mouse.move(x, box.y + box.height / 2)
  return (x - box.x) / box.width
}

for (const chapter of ['published', 'candidate']) {
  test.describe(`${chapter} chapter on published core`, () => {
    test('factory, registration, input normalization and safe title text', async ({ page }) => {
      await openChapter(page, chapter, [{ start: 4, end: 6, title: ' Second ' }, { start: 1, end: 2, title: '<b>First</b>' }])
      expect(await page.evaluate(() => {
        const plugin = window.art.plugins.artplayerPluginChapter
        return { factory: typeof window.artplayerPluginChapter(), name: plugin.name, keys: Object.keys(plugin).sort(), input: window.chapterInput }
      })).toEqual({
        factory: 'function',
        name: 'artplayerPluginChapter',
        keys: ['name', 'update'],
        input: [{ start: 0, end: 1, title: '' }, { start: 1, end: 2, title: '<b>First</b>' }, { start: 2, end: 4, title: '' }, { start: 4, end: 6, title: ' Second ' }, { start: 6, end: 8, title: '' }],
      })
      expect(await segments(page)).toEqual([
        { start: '0', end: '1', title: '', width: '12.5%' },
        { start: '1', end: '2', title: '<b>First</b>', width: '12.5%' },
        { start: '2', end: '4', title: '', width: '25%' },
        { start: '4', end: '6', title: 'Second', width: '25%' },
        { start: '6', end: '8', title: '', width: '25%' },
      ])
      await hover(page, 0.2)
      await expect(page.locator('.art-chapter-title')).toHaveText('<b>First</b>')
      await expect(page.locator('.art-chapter-title b')).toHaveCount(0)
      await expect(page.locator('style#artplayer-plugin-chapter')).toHaveCount(1)
      await page.evaluate(() => {
        window.art.destroy()
        window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, plugins: [window.artplayerPluginChapter()] })
      })
      await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
      await expect(page.locator('.art-chapter')).toHaveCount(0)
    })

    test('progress bars, real hover, title edges and boundary seek', async ({ page }) => {
      await openChapter(page, chapter, [{ start: 0, end: 2, title: 'First chapter' }, { start: 2, end: 6, title: 'Middle' }, { start: 6, end: 8, title: 'Last chapter' }])
      for (const type of ['played', 'loaded']) {
        const widths = await page.evaluate((type) => {
          window.art.emit('setBar', type, 0.375)
          return [...document.querySelectorAll(`.art-chapter .art-progress-${type}`)].map(node => node.style.width)
        }, type)
        expect(widths).toEqual(['100%', '25%', '0px'])
      }
      const percentage = await hover(page, 0.375)
      const widths = await page.locator('.art-chapter .art-progress-hover').evaluateAll(nodes => nodes.map(node => Number.parseFloat(node.style.width)))
      for (const [index, expected] of [100, (percentage * 8 - 2) / 4 * 100, 0].entries())
        expect(widths[index]).toBeCloseTo(expected, 1)
      const box = await page.locator('.art-control-progress-inner').boundingBox()
      for (const [percentage, title] of [[0.01, 'First chapter'], [0.5, 'Middle'], [0.99, 'Last chapter']]) {
        await page.mouse.move(box.x + box.width * percentage, box.y + box.height / 2)
        await expect(page.locator('.art-chapter-title')).toHaveText(title)
        await expect(page.locator('.art-video-player')).toHaveClass(/art-progress-hover/)
        const layout = await page.locator('.art-chapter-title').evaluate(title => ({ left: Number.parseFloat(title.style.left), width: title.clientWidth, container: title.parentElement.clientWidth }))
        expect(layout.left).toBeGreaterThanOrEqual(0)
        expect(layout.left + layout.width).toBeLessThanOrEqual(layout.container)
      }
      await page.mouse.click(box.x + box.width / 4, box.y + box.height / 2)
      await expect.poll(() => page.locator('video').evaluate(video => video.currentTime)).toBeCloseTo(2, 1)
      expect(await page.evaluate(() => {
        window.art.emit('setBar', 'played', 1)
        return [...document.querySelectorAll('.art-chapter .art-progress-played')].map(node => node.style.width)
      })).toEqual(['100%', '100%', '100%'])
    })

    test('sync update, Infinity, object identity, empty lists and invalid data', async ({ page }) => {
      await openChapter(page, chapter)
      await expect(page.locator('.art-chapter')).toHaveCount(0)
      expect(await page.evaluate(() => {
        const entry = { start: 0, end: Infinity, title: 'All' }
        const chapters = [entry]
        const result = window.art.plugins.artplayerPluginChapter.update({ chapters })
        return { result, same: chapters[0] === entry, end: entry.end }
      })).toEqual({ result: undefined, same: true, end: 8 })
      await expect(page.locator('.art-chapter')).toHaveCount(1)
      await page.evaluate(() => window.art.plugins.artplayerPluginChapter.update({}))
      await expect(page.locator('.art-chapter')).toHaveCount(0)
      await expect(page.locator('.art-video-player')).not.toHaveClass(/artplayer-plugin-chapter/)
      const cases = [
        [[{ start: '0', end: 2, title: 'Bad' }], 'TypeError', 'Illegal chapter data type'],
        [[{ start: 0, end: 2, title: 12 }], 'TypeError', 'Illegal chapter data type'],
        [[{ start: -1, end: 2, title: 'Bad' }], 'Error', 'Illegal chapter time point'],
        [[{ start: 2, end: 2, title: 'Bad' }], 'Error', 'Illegal chapter time point'],
        [[{ start: 0, end: 9, title: 'Bad' }], 'Error', 'Illegal chapter time point'],
        [[{ start: 0, end: 4, title: 'A' }, { start: 3, end: 6, title: 'B' }], 'Error', 'Illegal chapter time point'],
      ]
      for (const [chapters, name, message] of cases) {
        expect(await page.evaluate((chapters) => {
          const update = window.art.plugins.artplayerPluginChapter.update
          update({ chapters: [{ start: 0, end: Infinity, title: 'Valid before failure' }] })
          try {
            update({ chapters })
          }
          catch (error) { return { name: error.name, message: error.message } }
        }, chapters)).toEqual({ name, message })
        await expect(page.locator('.art-chapter')).toHaveCount(0)
      }
      expect(await page.evaluate(() => {
        try {
          window.art.plugins.artplayerPluginChapter.update()
        }
        catch (error) { return error.name }
      })).toBe('TypeError')
    })

    test('explicit source update and core-owned destruction', async ({ page }) => {
      await openChapter(page, chapter, [{ start: 0, end: 8, title: 'Initial' }])
      await page.evaluate(() => window.art.switchUrl('/assets/sample/video.mp4'))
      expect(await page.locator('video').evaluate(video => video.duration)).toBeGreaterThan(90)
      await page.evaluate(() => window.art.plugins.artplayerPluginChapter.update({ chapters: [{ start: 0, end: Infinity, title: 'New source' }] }))
      expect(await page.locator('.art-chapter').evaluate(node => Number(node.dataset.end))).toBeGreaterThan(90)
      await page.evaluate(() => window.art.destroy())
      await expect(page.locator('.player')).toBeEmpty()
      expect(await page.evaluate(() => window.Artplayer.instances.length)).toBe(0)
      await expect(page.locator('style#artplayer-plugin-chapter')).toHaveCount(1)
    })
  })
}

test('published-only observations: blank title, NaN and once-only metadata are historical defects', async ({ page }, testInfo) => {
  await openChapter(page, 'published', [{ start: 0, end: 2, title: 'Previous' }, { start: 4, end: 8, title: 'Next' }])
  await hover(page, 0.1)
  await hover(page, 0.375)
  const staleTitle = await page.locator('.art-chapter-title').textContent()
  expect(staleTitle).toBe('Previous')
  await page.evaluate(() => window.art.switchUrl('/assets/sample/video.mp4'))
  expect(await page.locator('.art-chapter').last().evaluate(node => node.dataset.end)).toBe('8')
  await page.evaluate(() => window.art.plugins.artplayerPluginChapter.update({ chapters: [{ start: Number.NaN, end: 3, title: 'Invalid' }] }))
  expect(await page.locator('.art-chapter').first().evaluate(node => node.dataset.start)).toBe('NaN')
  await testInfo.attach('chapter-known-defects', { body: JSON.stringify({ staleTitle, endAfterSourceChange: 8, acceptsNaN: true }), contentType: 'application/json' })
})

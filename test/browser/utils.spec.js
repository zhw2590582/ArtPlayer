import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: subtitle object URL contains real VTT data`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    expect(await page.evaluate(async () => {
      const content = 'WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nText\n'
      const url = window.Artplayer.utils.vttToBlob(content)
      try {
        const response = await fetch(url)
        return { blob: url.startsWith('blob:'), type: response.headers.get('content-type'), text: await response.text() }
      }
      finally {
        URL.revokeObjectURL(url)
      }
    })).toEqual({ blob: true, type: 'text/vtt', text: 'WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nText\n' })
  })

  test(`${core}: download starts and removes its temporary anchor`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const download = page.waitForEvent('download')
    await page.evaluate(() => window.Artplayer.utils.download('/test/pattern.mp4', 'sample.mp4'))
    const result = await download
    expect(result.suggestedFilename()).toBe('sample.mp4')
    expect(await result.failure()).toBeNull()
    await expect(page.locator('a[download]')).toHaveCount(0)
  })
}

test('candidate download releases the anchor even when click fails', async ({ page }) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  expect(await page.evaluate(() => {
    const click = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = () => {
      throw new Error('controlled click failure')
    }
    try {
      window.Artplayer.utils.download('/test/pattern.mp4', 'sample.mp4')
    }
    catch (error) {
      return error.message
    }
    finally {
      HTMLAnchorElement.prototype.click = click
    }
  })).toBe('controlled click failure')
  await expect(page.locator('a[download]')).toHaveCount(0)
})

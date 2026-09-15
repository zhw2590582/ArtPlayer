import { hash } from '../../refactor/scripts/releases.mjs'
import { thumbnailCandidate, thumbnailHistorical } from '../helpers/thumbnail.js'
import { expect, test } from './fixtures.js'

const candidate = await thumbnailCandidate()

for (const implementation of [...thumbnailHistorical(), candidate]) {
  test(`Thumbnail ${implementation.name}: destroy preserves falsy listener exceptions with real DOM cleanup`, async ({ page }, testInfo) => {
    await page.goto('/test/player.html?core=candidate&chapter=published')
    await page.addScriptTag({ content: implementation.code })
    const result = await page.evaluate(() => {
      return [undefined, null, false, 0, -0, '', Number.NaN].map((failure, index) => {
        const input = document.createElement('input')
        input.type = 'file'
        document.body.append(input)
        const tool = new window.ArtplayerToolThumbnail({ fileInput: input })
        let notified = 0
        let threw = false
        let same = false
        tool.on('destroy', () => {
          notified++
          throw failure
        })
        try {
          tool.destroy()
        }
        catch (error) {
          threw = true
          same = Object.is(error, failure)
        }
        const videoConnected = tool.video.isConnected
        input.remove()
        return { index, threw, same, notified, videoConnected }
      })
    })
    await testInfo.attach('thumbnail-cleanup-errors', { contentType: 'application/json', body: JSON.stringify({ implementation: implementation.name, sha256: hash(implementation.code), result }) })
    expect(result).toEqual(Array.from({ length: 7 }, (_, index) => ({ index, threw: true, same: true, notified: 1, videoConnected: false })))
  })
}

test('Thumbnail native browser event registry handles special names and nested once without changing DOM cleanup', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ content: candidate.code })
  const result = await page.evaluate(() => {
    const input = document.createElement('input')
    input.type = 'file'
    document.body.append(input)
    const tool = new window.ArtplayerToolThumbnail({ fileInput: input })
    const keys = []
    for (const name of ['__proto__', 'constructor', 'toString', 'hasOwnProperty']) {
      let calls = 0
      tool.emit(name)
      const prototype = Object.getPrototypeOf(tool.e)
      tool.on(name, () => calls++).once(name, () => calls++)
      tool.emit(name).emit(name).off(name)
      keys.push({ name, calls, prototypePreserved: Object.getPrototypeOf(tool.e) === prototype, removed: !Object.hasOwn(tool.e, name) })
    }
    let nested = false
    const seen = []
    tool.on('custom', (value) => {
      if (!nested) {
        nested = true
        tool.emit('custom', 'inner')
      }
      seen.push(`on:${value}`)
    })
    tool.once('custom', value => seen.push(`once:${value}`))
    tool.emit('custom', 'outer')
    const video = tool.video
    tool.destroy()
    tool.destroy()
    input.remove()
    return { keys, seen, videoConnected: video.isConnected, inputConnected: input.isConnected, processing: tool.processing }
  })
  expect(result.keys).toEqual(['__proto__', 'constructor', 'toString', 'hasOwnProperty'].map(name => ({ name, calls: 3, prototypePreserved: true, removed: true })))
  expect(result.seen).toEqual(['on:inner', 'once:inner', 'on:outer'])
  expect(result.videoConnected).toBe(false)
  expect(result.inputConnected).toBe(false)
  expect(result.processing).toBe(false)
  await testInfo.attach('thumbnail-emitter', { contentType: 'application/json', body: JSON.stringify({ candidate: candidate.name, sha256: hash(candidate.code), result }) })
})

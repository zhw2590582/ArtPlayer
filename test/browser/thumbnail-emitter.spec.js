import { hash } from '../../refactor/scripts/releases.mjs'
import { thumbnailCandidate } from '../helpers/thumbnail.js'
import { expect, test } from './fixtures.js'

const candidate = await thumbnailCandidate()

test('Thumbnail native browser event registry handles special names and nested once without changing DOM cleanup', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ content: candidate.code })
  const result = await page.evaluate(() => {
    const input = document.createElement('input')
    input.type = 'file'
    document.body.append(input)
    const tool = new ArtplayerToolThumbnail({ fileInput: input })
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
    tool.on('custom', value => {
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

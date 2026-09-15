import { hash } from '../../refactor/scripts/releases.mjs'
import { autoThumbnailCandidate } from '../helpers/auto-thumbnail.js'
import { expect, test } from './fixtures.js'

const implementation = await autoThumbnailCandidate()
for (const core of ['published', 'candidate']) {
  test(`Auto-thumbnail delayed factory installation stays inert after ${core} core destruction`, async ({ page }, testInfo) => {
    await page.goto(`/test/player.html?core=${core}`)
    await page.addScriptTag({ content: implementation.code })
    const evidence = await page.evaluate(async () => {
      window.createPlayer('/test/pattern.mp4')
      const art = window.art
      const install = window.artplayerPluginAutoThumbnail({ width: 80, number: 1 })
      art.destroy()
      const subscriptions = []
      const on = art.on
      art.on = function (name, callback) {
        subscriptions.push(name)
        return on.call(this, name, callback)
      }
      try {
        const pending = install(art)
        const asynchronous = typeof pending.then === 'function'
        const result = await pending
        art.emit('video:loadedmetadata')
        const videos = document.querySelectorAll('video').length
        const canvases = document.querySelectorAll('canvas').length
        // Clean up the deliberate regression probe even when the old bundle leaks.
        art.emit('destroy')
        return { destroyed: art.isDestroy, asynchronous, result, subscriptions, videos, canvases }
      }
      finally {
        art.on = on
      }
    })
    await testInfo.attach('auto-thumbnail-late-registration', { contentType: 'application/json', body: JSON.stringify({ core, sha256: hash(implementation.code), provenance: implementation.provenance, ...evidence }) })
    expect(evidence).toEqual({ destroyed: true, asynchronous: true, result: { name: 'artplayerPluginAutoThumbnail' }, subscriptions: [], videos: 0, canvases: 0 })
  })
}

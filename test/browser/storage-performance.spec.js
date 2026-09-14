import { expect, test } from './fixtures.js'

for (let group = 0; group < 3; group++) {
  test(`playback persistence measurements and fresh-state contracts group ${group + 1}`, async ({ page }, testInfo) => {
    const runs = []
    for (const core of group % 2 ? ['candidate', 'published'] : ['published', 'candidate']) {
      await page.goto(`/test/player.html?core=${core}&chapter=published`)
      await page.evaluate(() => {
        localStorage.setItem('artplayer_settings', JSON.stringify({ times: { another: 2 }, external: { retained: true }, volume: 0.7 }))
        window.art = new window.Artplayer({ container: '.player', url: '/test/pattern.mp4', muted: true, autoPlayback: true, id: 'persistence-measurement' })
        document.querySelector('#play').onclick = () => window.art.play()
      })
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.playing && window.art.currentTime > 0.1)).toBe(true)
      try {
        const result = await page.evaluate(() => {
          const art = window.art
          const refresh = () => art.emit('video:timeupdate', new Event('timeupdate'))
          for (let index = 0; index < 100; index++)
            refresh()
          // Timings run without replacing native Storage/JSON methods.
          const samples = []
          for (let sample = 0; sample < 5; sample++) {
            const started = performance.now()
            for (let index = 0; index < 100; index++)
              refresh()
            samples.push(performance.now() - started)
          }
          const original = { getItem: Storage.prototype.getItem, setItem: Storage.prototype.setItem, parse: JSON.parse, stringify: JSON.stringify }
          const counts = { getItem: 0, setItem: 0, parse: 0, stringify: 0 }
          Storage.prototype.getItem = function (...args) {
            if (args[0] === art.storage.name)
              counts.getItem++
            return original.getItem.apply(this, args)
          }
          Storage.prototype.setItem = function (...args) {
            if (args[0] === art.storage.name)
              counts.setItem++
            return original.setItem.apply(this, args)
          }
          JSON.parse = (...args) => {
            counts.parse++
            return original.parse(...args)
          }
          JSON.stringify = (...args) => {
            counts.stringify++
            return original.stringify(...args)
          }
          try {
            for (let index = 0; index < 100; index++)
              refresh()
          }
          finally {
            Storage.prototype.getItem = original.getItem
            Storage.prototype.setItem = original.setItem
            JSON.parse = original.parse
            JSON.stringify = original.stringify
          }
          // WebKit's native clock can advance between consecutive property reads.
          const beforeRefresh = art.currentTime
          refresh()
          const afterRefresh = art.currentTime
          const stored = art.storage.get()
          const time = { beforeRefresh, afterRefresh }
          const isolated = art.storage.get()
          isolated.times.transient = 999
          isolated.external.retained = false
          const fresh = art.storage.get()
          const calls = []
          const get = art.storage.get
          // A legal custom get can update unrelated settings between record read and save.
          art.storage.get = function (key) {
            calls.push(key ?? null)
            const result = get.call(this, key)
            if (key === 'times') {
              const latest = get.call(this)
              latest.external = { retained: true, revision: 'interleaved' }
              localStorage.setItem(this.name, JSON.stringify(latest))
            }
            return result
          }
          try {
            refresh()
          }
          finally {
            art.storage.get = get
          }
          const merged = art.storage.get()
          const pausedBefore = localStorage.getItem(art.storage.name)
          art.pause()
          refresh()
          const pausedAfter = localStorage.getItem(art.storage.name)
          return { samples, counts, time, stored, fresh, merged, calls, pausedBefore, pausedAfter }
        })
        runs.push({ core, group, result })
        expect(result.stored.times['persistence-measurement']).toBeGreaterThanOrEqual(result.time.beforeRefresh)
        expect(result.stored.times['persistence-measurement']).toBeLessThanOrEqual(result.time.afterRefresh)
        expect(result.stored.times.another).toBe(2)
        expect(result.stored.external).toEqual({ retained: true })
        expect(result.fresh.times).not.toHaveProperty('transient')
        expect(result.fresh.external).toEqual({ retained: true })
        expect(result.merged.external).toEqual({ retained: true, revision: 'interleaved' })
        expect(result.calls).toEqual(['times', null])
        expect(result.pausedAfter).toBe(result.pausedBefore)
      }
      finally {
        await page.evaluate(() => window.art.destroy(false))
        await testInfo.attach(`persistence-${core}`, { contentType: 'application/json', body: JSON.stringify(runs.at(-1) || { core, group, failedBeforeMeasurements: true }) })
      }
    }
    await testInfo.attach('persistence-paired-summary', { contentType: 'application/json', body: JSON.stringify({ runs, limitation: 'Actual video and native same-origin localStorage, followed by synthetic timeupdate dispatch while playing. 100 warmups and five 100-event timing samples without native method wrappers; a separate instrumented window reports Storage/JSON calls. A custom public get tests synchronous interleaving, not a concurrent multi-process storage race. No storage implementation or write cadence change is made.' }) })
  })
}

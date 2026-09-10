import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: plugin, toggle, setting and static runtime return contracts`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => {
      const container = document.createElement('div')
      Object.assign(container.style, { width: '640px', height: '360px' })
      document.body.append(container)
      window.art = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true, setting: true })
    })
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const values = await page.evaluate(async () => {
      const art = window.art
      const sync = art.plugins.add(() => ({ name: 'syncContract' }))
      const promise = art.plugins.add(async () => ({ name: 'asyncContract' }))
      const before = art.plugins.asyncContract === undefined
      const asyncResult = await promise
      const failure = new Error('plugin rejection contract')
      const rejected = await art.plugins.add(() => Promise.reject(failure)).catch(error => error === failure)
      const item = { name: 'returnContract', html: 'Initial' }
      const added = art.setting.add(item)
      const updated = art.setting.update({ name: 'returnContract', html: 'Updated' })
      const identity = art.setting.find('returnContract') === item
      const html = item.$html.textContent
      const removed = art.setting.remove('returnContract')
      const missing = art.setting.find('returnContract')
      art.notice.show = 'Visible notice'
      const notice = art.notice.show
      const emitter = new art.constructor.Emitter('ignored')
      let received
      const ctx = { value: 2 }
      const chained = emitter.on('contract', function (payload) {
        received = this.value + payload
      }, ctx).emit('contract', 3) === emitter
      return {
        syncRegistry: sync === art.plugins,
        syncThen: typeof sync.then,
        asyncPromise: promise instanceof Promise,
        asyncPending: before,
        asyncRegistry: asyncResult === art.plugins,
        rejected,
        addedItem: added === item,
        updatedItem: updated === item,
        foundItem: identity,
        html,
        removedType: typeof removed,
        missing,
        notice,
        chained,
        received,
      }
    })
    expect(values).toEqual({ syncRegistry: true, syncThen: 'undefined', asyncPromise: true, asyncPending: true, asyncRegistry: true, rejected: true, addedItem: true, updatedItem: true, foundItem: true, html: 'Updated', removedType: 'undefined', missing: null, notice: true, chained: true, received: 5 })
    expect(await page.evaluate(async () => {
      const result = window.art.toggle()
      const promise = result instanceof Promise
      await result
      return promise
    })).toBe(true)
    await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(true)
    expect(await page.evaluate(() => typeof window.art.toggle())).toBe('undefined')
    expect(await page.evaluate(() => window.art.playing)).toBe(false)
    await page.evaluate(() => window.art.destroy())
  })

  test(`${core}: native subtitle update events carry cue arrays`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => {
      const container = document.createElement('div')
      Object.assign(container.style, { width: '640px', height: '360px' })
      document.body.append(container)
      const art = window.art = new window.Artplayer({ container, url: '/test/pattern.mp4', muted: true, subtitle: { url: '/test/declaration-cues.vtt' } })
      window.cueEvents = []
      for (const name of ['subtitleBeforeUpdate', 'subtitleAfterUpdate']) {
        art.on(name, (cues) => {
          window.cueEvents.push({ name, array: Array.isArray(cues), length: cues.length, native: cues[0] instanceof VTTCue, same: cues[0] === art.subtitle.textTrack.cues[0], text: cues[0]?.text })
        })
      }
    })
    await expect.poll(() => page.evaluate(() => window.art.isReady && window.art.subtitle.cues.length === 1)).toBe(true)
    await page.evaluate(() => {
      window.art.seek = 1
    })
    await expect.poll(() => page.evaluate(() => window.cueEvents.some(event => event.name === 'subtitleAfterUpdate'))).toBe(true)
    const events = await page.evaluate(() => window.cueEvents)
    for (const name of ['subtitleBeforeUpdate', 'subtitleAfterUpdate'])
      expect(events.find(event => event.name === name)).toEqual({ name, array: true, length: 1, native: true, same: true, text: 'Declaration cue' })
    expect(await page.evaluate(() => window.art.template.$subtitle.textContent.trim())).toBe('Declaration cue')
    await page.evaluate(() => {
      const url = window.art.template.$track.src
      window.art.destroy()
      // Explicit test teardown; subtitle URL ownership is still tracked by CORE-15.
      URL.revokeObjectURL(url)
    })
  })
}

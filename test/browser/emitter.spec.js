import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: emitter event names and once across nested dispatch`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    const result = await page.evaluate(() => {
      const emitter = new window.Artplayer.Emitter()
      const freshKeys = Object.keys(emitter)
      let reservedCalls = 0
      let errorName
      try {
        emitter.on('__proto__', () => reservedCalls++).emit('__proto__').off('__proto__')
      }
      catch (error) { errorName = error.name }
      let nested = false
      let onceCalls = 0
      emitter.on('value', () => {
        if (!nested) {
          nested = true
          emitter.emit('value')
        }
      }).once('value', () => onceCalls++)
      emitter.emit('value')
      return { freshKeys, reservedCalls, errorName, onceCalls }
    })
    expect(result).toEqual({ freshKeys: [], reservedCalls: core === 'published' ? 0 : 1, errorName: core === 'published' ? 'TypeError' : undefined, onceCalls: core === 'published' ? 2 : 1 })
  })
}

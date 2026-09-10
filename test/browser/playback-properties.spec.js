import { expect, test } from './fixtures.js'

for (const core of ['published', 'candidate']) {
  test(`${core}: real media preserves timeline, volume, rate and property descriptors`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => window.createPlayer('/test/pattern.mp4?properties=media'))
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const result = await page.evaluate(() => {
      const { art } = window
      const seeks = []
      const muted = []
      art.on('seek', (...args) => seeks.push(args))
      art.on('muted', value => muted.push(value))
      art.seek = '2.5 seconds'
      const seekNotice = art.template.$noticeInner.textContent
      art.forward = 1
      art.backward = 0.5
      art.volume = 0.42
      const volumeNotice = art.template.$noticeInner.textContent
      art.muted = 'truthy'
      art.playbackRate = 1.5
      const rateNotice = art.template.$noticeInner.textContent
      art.playbackRate = 0
      const resetNotice = art.template.$noticeInner.textContent
      const descriptors = Object.fromEntries(['currentTime', 'seek', 'forward', 'backward', 'volume', 'muted', 'playbackRate', 'loaded', 'loadedTime', 'played', 'state'].map((name) => {
        const descriptor = Object.getOwnPropertyDescriptor(art, name)
        return [name, { getter: typeof descriptor.get === 'function', setter: typeof descriptor.set === 'function', enumerable: descriptor.enumerable, configurable: descriptor.configurable }]
      }))
      const unreadable = Object.fromEntries(['seek', 'forward', 'backward', 'switch', 'quality'].map(name => [name, art[name] === undefined]))
      const buffered = Array.from({ length: art.video.buffered.length }, (_, index) => art.video.buffered.end(index))
      const result = { seeks, muted, time: art.currentTime, volume: art.volume, mediaMuted: art.video.muted, rate: art.playbackRate, seekNotice, volumeNotice, rateNotice, resetNotice, descriptors, unreadable, played: art.played, duration: art.duration, buffered, loadedTime: art.loadedTime, loaded: art.loaded, error: art.video.error?.code || 0 }
      art.destroy()
      return result
    })
    expect(result.seeks).toEqual([[2.5, '2.5 seconds'], [3.5, 3.5], [3, 3]])
    expect(result.muted).toEqual(['truthy'])
    expect(result.time).toBeCloseTo(3, 2)
    expect(result.volume).toBeCloseTo(0.42, 6)
    expect(result.mediaMuted).toBe(true)
    expect(result.rate).toBe(1)
    expect(result.seekNotice).toBe('00:02 / 00:08')
    expect(result.volumeNotice).toBe('Volume: 42')
    expect(result.rateNotice).toBe('Rate: 1.5x')
    expect(result.resetNotice).toBe('Rate: Normal')
    expect(result.played).toBeCloseTo(3 / result.duration, 6)
    // WebKit may empty its buffered ranges during seek; compare the actual media surface.
    expect(result.loadedTime).toBe(result.buffered.at(-1) || 0)
    expect(result.loaded).toBeCloseTo(result.loadedTime / result.duration, 6)
    expect(result.error).toBe(0)
    expect(Object.values(result.unreadable)).toEqual([true, true, true, true, true])
    for (const [name, descriptor] of Object.entries(result.descriptors)) {
      expect(descriptor).toEqual({
        getter: !['seek', 'forward', 'backward'].includes(name),
        setter: !['loaded', 'loadedTime', 'played'].includes(name),
        enumerable: false,
        configurable: false,
      })
    }
  })

  test(`${core}: invalid time inputs and rate no-op retain native behavior`, async ({ page }) => {
    await page.goto(`/test/player.html?core=${core}&chapter=published`)
    await page.evaluate(() => window.createPlayer('/test/pattern.mp4?properties=invalid'))
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    const result = await page.evaluate(() => {
      const { art } = window
      art.currentTime = 2
      const times = []
      for (const input of [Number.NaN, undefined, null, '', 'invalid']) {
        art.currentTime = input
        times.push(art.currentTime)
      }
      art.notice.show = 'keep'
      art.playbackRate = 1
      art.playbackRate = Number.NaN
      const result = { times, rate: art.playbackRate, notice: art.template.$noticeInner.textContent, noRuntimeType: window.Artplayer.PlaybackControls === undefined }
      art.destroy()
      return result
    })
    expect(result).toEqual({ times: [2, 2, 2, 2, 2], rate: 1, notice: 'keep', noRuntimeType: true })
  })
}

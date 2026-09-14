import fs from 'node:fs'
import process from 'node:process'
import { hash } from '../../refactor/scripts/releases.mjs'
import { expect, test } from './fixtures.js'

const baseline = process.env.ARTPLAYER_SLIDER_BASELINE
const before = baseline ? fs.readFileSync(baseline, 'utf8') : undefined
const attributes = ['aria-disabled', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext']

for (let group = 0; group < 3; group++) {
  test(`slider DOM updates and duplicate-event timing group ${group + 1}`, async ({ page }, testInfo) => {
    const results = []
    const variants = before ? (group % 2 ? ['candidate', 'before'] : ['before', 'candidate']) : ['candidate']
    for (const variant of variants) {
      if (variant === 'before')
        await page.route('**/candidate/artplayer.js', route => route.fulfill({ contentType: 'text/javascript', body: before }))
      else
        await page.unroute('**/candidate/artplayer.js')
      await page.goto('/test/player.html?core=candidate&chapter=published')
      await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.2)
      await page.evaluate(() => window.art.pause())
      const result = await page.evaluate((attributes) => {
        const art = window.art
        const element = document.querySelector('.art-control-progress')
        const refresh = () => art.emit('video:timeupdate', new Event('timeupdate'))
        refresh()
        const initial = Object.fromEntries(attributes.map(name => [name, element.getAttribute(name)]))
        // Keep MutationObserver out of the timing loop: these are synthetic duplicate events.
        for (let i = 0; i < 300; i++)
          refresh()
        const timings = []
        for (let sample = 0; sample < 5; sample++) {
          const started = performance.now()
          for (let i = 0; i < 1000; i++)
            refresh()
          timings.push(performance.now() - started)
        }
        const observer = new MutationObserver(() => {})
        observer.observe(element, { attributes: true, attributeFilter: attributes })
        let events = 0
        const count = () => events++
        art.on('video:timeupdate', count)
        for (let i = 0; i < 100; i++)
          refresh()
        const duplicates = observer.takeRecords().map(record => record.attributeName)
        // External DOM changes must still be repaired on the next refresh.
        element.setAttribute('aria-valuemax', '999')
        element.removeAttribute('aria-disabled')
        observer.takeRecords()
        refresh()
        const repaired = observer.takeRecords().map(record => record.attributeName)
        const final = Object.fromEntries(attributes.map(name => [name, element.getAttribute(name)]))
        observer.disconnect()
        art.off('video:timeupdate', count)
        window.sliderNativeUpdates = { updates: [], events: 0 }
        const nativeObserver = new MutationObserver(records => window.sliderNativeUpdates.updates.push(...records.map(record => record.attributeName)))
        nativeObserver.observe(element, { attributes: true, attributeFilter: attributes })
        const nativeCount = () => window.sliderNativeUpdates.events++
        art.on('video:timeupdate', nativeCount)
        window.finishSliderNativeUpdates = () => {
          window.sliderNativeUpdates.updates.push(...nativeObserver.takeRecords().map(record => record.attributeName))
          nativeObserver.disconnect()
          art.off('video:timeupdate', nativeCount)
          return { ...window.sliderNativeUpdates, value: Number(element.getAttribute('aria-valuenow')), time: art.currentTime }
        }
        return { initial, final, timings, duplicates, repaired, events, time: art.currentTime, duration: art.duration }
      }, attributes)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(result.time + 0.8)
      await page.evaluate(() => window.art.pause())
      const native = await page.evaluate(() => window.finishSliderNativeUpdates())
      const record = { group, variant, before: variant === 'before' ? { file: baseline, sha256: hash(before) } : null, result, native }
      results.push(record)
      try {
        expect(result.events).toBe(101)
        expect(result.final).toEqual(result.initial)
        expect(Number(result.final['aria-valuemax'])).toBe(result.duration)
        expect(result.duplicates).toHaveLength(variant === 'before' ? 500 : 0)
        expect(result.repaired).toEqual(variant === 'before' ? attributes : ['aria-disabled', 'aria-valuemax'])
        expect(native.events).toBeGreaterThan(0)
        expect(Math.abs(native.value - native.time)).toBeLessThan(0.3)
        if (variant === 'candidate') {
          expect(native.updates).not.toContain('aria-disabled')
          expect(native.updates).not.toContain('aria-valuemin')
          expect(native.updates).not.toContain('aria-valuemax')
          expect(native.updates).toContain('aria-valuenow')
        }
      }
      finally {
        await page.evaluate(() => window.art.destroy(false))
        await testInfo.attach(`slider-updates-${variant}`, { contentType: 'application/json', body: JSON.stringify(record) })
      }
    }
    await testInfo.attach('slider-paired-summary', { contentType: 'application/json', body: JSON.stringify({ results, limitation: 'Three alternating same-engine groups when a baseline artifact is supplied; 300-event warmup plus five samples of 1000 synthetic paused timeupdate events, without a MutationObserver in the timed loop. Separate DOM operation counts and actual native playback checks. Not total playback FPS, input latency or full BASE-06 initialization/resource acceptance.' }) })
  })
}

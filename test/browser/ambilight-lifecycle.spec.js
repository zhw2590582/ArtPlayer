import { hash } from '../../refactor/scripts/releases.mjs'
import { ambilightCandidate } from '../helpers/ambilight.js'
import { expect, test } from './fixtures.js'

const implementation = await ambilightCandidate()

async function setup(page, core, testInfo, crossOrigin = false) {
  await page.goto(`/test/player.html?core=${core}`)
  // Lexical observers delegate to native RAF; core and test frames are not counted.
  await page.addScriptTag({ content: `(() => {
    const pending = new Set();
    const requestAnimationFrame = callback => {
      const id = window.requestAnimationFrame(time => { pending.delete(id); callback(time); });
      pending.add(id); return id;
    };
    const cancelAnimationFrame = id => { pending.delete(id); window.cancelAnimationFrame(id); };
    const module = { exports: {} }; const exports = module.exports;
    ${implementation.source};
    window.ambilightFactory = module.exports.default || module.exports;
    window.ambilightPending = pending;
  })();` })
  await page.evaluate((crossOrigin) => {
    const url = new URL('/test/pattern.mp4', location.href)
    if (crossOrigin)
      url.hostname = 'localhost'
    window.createPlayer(url.href)
    window.art.plugins.add(window.ambilightFactory({ frequency: Infinity }))
    window.ambilight = window.art.plugins.artplayerPluginAmbilight
  }, crossOrigin)
  await expect.poll(() => page.evaluate(() => window.art.template.$video.videoWidth)).toBeGreaterThan(0)
  await page.click('#play')
  await expect.poll(() => page.evaluate(() => window.art.playing && window.art.currentTime > 0)).toBe(true)
  await testInfo.attach('ambilight-candidate-inputs', { contentType: 'application/json', body: JSON.stringify({ core, implementation: implementation.name, sha256: hash(implementation.source), crossOrigin, canvas: 'native canvas and media, lexical native RAF observer' }) })
}

const colors = page => page.evaluate(() => [...document.querySelectorAll('.artplayer-plugin-ambilight > div')].map(node => node.style.backgroundColor))

test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('ambilight-candidate-state', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ version: window.Artplayer?.version, pending: window.ambilightPending?.size, grids: document.querySelectorAll('.artplayer-plugin-ambilight').length, source: window.art?.url }))) })
  await page.evaluate(() => {
    window.ambilight?.stop()
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
  })
})

for (const core of ['published-5.1.7', 'published', 'candidate']) {
  test(`${core}: Ambilight ready starts native sampling and destruction releases only its frames and view`, async ({ page }, testInfo) => {
    await setup(page, core, testInfo)
    await expect.poll(async () => (await colors(page)).filter(color => /^rgb\(/.test(color)).length).toBe(9)
    expect(await page.evaluate(() => window.ambilightPending.size)).toBe(1)
    await page.click('#pause')
    await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(false)
    const before = await colors(page)
    await page.evaluate(() => window.ambilight.stop())
    expect(await colors(page)).toEqual(before)
    expect(await page.evaluate(() => window.ambilightPending.size)).toBe(0)
    await page.evaluate(() => window.ambilight.start())
    expect(await page.evaluate(() => window.ambilightPending.size)).toBe(1)
    await page.evaluate(async () => {
      window.art.destroy(false)
      window.ambilight.start()
      window.ambilight.stop()
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    })
    expect(await page.locator('.artplayer-plugin-ambilight').count()).toBe(0)
    expect(await page.evaluate(() => window.ambilightPending.size)).toBe(0)
  })

  test(`${core}: Ambilight recovers from native cross-origin taint after a same-origin source switch`, async ({ page }, testInfo) => {
    await setup(page, core, testInfo, true)
    const error = await page.evaluate(() => {
      const context = document.createElement('canvas').getContext('2d')
      window.ambilightProbe = context
      context.drawImage(window.art.template.$video, 0, 0, 1, 1)
      try {
        context.getImageData(0, 0, 1, 1)
        return null
      }
      catch (error) { return error.name }
    })
    expect(error).toBe('SecurityError')
    expect(await colors(page)).toEqual(Array.from({ length: 9 }, () => ''))
    expect(await page.evaluate(() => window.ambilightPending.size)).toBe(1)
    await page.evaluate(() => {
      window.ambilightOriginalGrid = document.querySelector('.artplayer-plugin-ambilight')
      return window.art.switchUrl('/test/pattern.mp4')
    })
    await page.click('#play')
    await expect.poll(() => page.evaluate(() => window.art.playing && window.art.template.$video.currentSrc.startsWith(location.origin))).toBe(true)
    await expect.poll(() => page.evaluate(() => {
      const context = document.createElement('canvas').getContext('2d')
      try {
        context.drawImage(window.art.template.$video, 0, 0, 1, 1)
        context.getImageData(0, 0, 1, 1)
        return true
      }
      catch { return false }
    })).toBe(true)
    await testInfo.attach('native-canvas-reset-control', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => {
      const context = window.ambilightProbe
      context.canvas.width = 3
      try {
        context.drawImage(window.art.template.$video, 0, 0, 1, 1)
        context.getImageData(0, 0, 1, 1)
        return { resetReadable: true }
      }
      catch (error) { return { resetReadable: false, error: error.name } }
    })) })
    await expect.poll(async () => (await colors(page)).filter(color => /^rgb\(/.test(color)).length).toBe(9)
    expect(await page.evaluate(() => window.ambilightOriginalGrid === document.querySelector('.artplayer-plugin-ambilight'))).toBe(true)
    expect(await page.evaluate(() => window.ambilightPending.size)).toBe(1)
  })
}

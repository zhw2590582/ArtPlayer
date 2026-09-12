import { transform } from 'esbuild'
import { hash } from '../../refactor/scripts/releases.mjs'
import { ambilightHistorical } from '../helpers/ambilight.js'
import { expect, test } from './fixtures.js'

const implementations = await Promise.all((await ambilightHistorical()).map(async item => ({ ...item, code: item.format === 'source' ? (await transform(item.source, { format: 'cjs', target: 'es2020' })).code : item.source })))

async function setup(page, core, implementation, testInfo, crossOrigin = false) {
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${implementation.code}; window.ambilightFactory = module.exports.default || module.exports; })();` })
  await page.evaluate((crossOrigin) => {
    const url = new URL('/test/pattern.mp4', location.href)
    if (crossOrigin)
      url.hostname = 'localhost'
    window.createPlayer(url.href)
  }, crossOrigin)
  await expect.poll(() => page.evaluate(() => window.art.template.$video.videoWidth)).toBeGreaterThan(0)
  await page.click('#play')
  await expect.poll(() => page.evaluate(() => window.art.playing && window.art.currentTime > 0)).toBe(true)
  await page.evaluate(() => {
    window.art.plugins.add(window.ambilightFactory({ frequency: Infinity }))
    window.ambilight = window.art.plugins.artplayerPluginAmbilight
  })
  await testInfo.attach('ambilight-inputs', { contentType: 'application/json', body: JSON.stringify({ core, implementation: implementation.name, sha256: hash(implementation.code), crossOrigin, media: '/test/pattern.mp4', canvas: 'native, no pixel or RAF stubs' }) })
}

test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('ambilight-state', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ version: window.Artplayer?.version, source: window.art?.url, width: window.art?.template.$video.videoWidth, currentTime: window.art?.currentTime, errors: window.ambilightErrors, grids: document.querySelectorAll('.artplayer-plugin-ambilight').length }))) })
  await page.evaluate(() => {
    // Historical escaped methods intentionally restart work; cleanup follows assertions.
    window.ambilight?.stop()
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
  })
})

for (const core of ['published-5.1.7', 'published', 'candidate']) {
  for (const implementation of implementations) {
    const label = `${core} / ${implementation.name}`
    test(`${label}: native canvas colors, pause, source switch and historical retained destroy view`, async ({ page }, testInfo) => {
      await setup(page, core, implementation, testInfo)
      await page.evaluate(() => window.ambilight.start())
      await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('.artplayer-plugin-ambilight > div')].filter(node => /^rgb\(/.test(node.style.backgroundColor)).length)).toBe(9)
      const layout = await page.evaluate(() => {
        const grid = document.querySelector('.artplayer-plugin-ambilight')
        return { parentMatches: grid.parentNode === window.art.template.$video.parentNode, nextMatches: grid.nextSibling === window.art.template.$video, columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length, zIndex: getComputedStyle(grid).zIndex }
      })
      expect(layout).toEqual({ parentMatches: true, nextMatches: true, columns: 3, zIndex: '9' })
      await page.click('#pause')
      await expect.poll(() => page.evaluate(() => window.art.playing)).toBe(false)
      const before = await page.evaluate(() => [...document.querySelectorAll('.artplayer-plugin-ambilight > div')].map(node => node.style.backgroundColor))
      const stopped = await page.evaluate(() => {
        const returned = window.ambilight.stop()
        return { returned: returned === undefined, colors: [...document.querySelectorAll('.artplayer-plugin-ambilight > div')].map(node => node.style.backgroundColor) }
      })
      expect(stopped).toEqual({ returned: true, colors: before })
      await page.evaluate(() => window.art.switchUrl('/assets/sample/video.mp4'))
      await page.click('#play')
      await expect.poll(() => page.evaluate(() => window.art.playing && window.art.template.$video.videoWidth > 0)).toBe(true)
      await page.evaluate(() => window.ambilight.start())
      expect(await page.evaluate(() => window.art.template.$video.currentSrc.endsWith('/assets/sample/video.mp4'))).toBe(true)
      await page.evaluate(() => window.art.destroy(false))
      expect(await page.locator('.artplayer-plugin-ambilight').count()).toBe(1)
    })

    test(`${label}: native cross-origin SecurityError persists after same-origin recovery in historical canvas`, async ({ page }, testInfo) => {
      await setup(page, core, implementation, testInfo, true)
      const capture = () => page.evaluate(() => {
        window.ambilight.stop()
        try {
          window.ambilight.start()
          return null
        }
        catch (error) {
          window.ambilightErrors = [...(window.ambilightErrors || []), error.name]
          return error.name
        }
      })
      expect(await capture()).toBe('SecurityError')
      await page.evaluate(() => window.art.switchUrl('/test/pattern.mp4'))
      await page.click('#play')
      await expect.poll(() => page.evaluate(() => window.art.playing && window.art.template.$video.currentSrc.startsWith(location.origin))).toBe(true)
      await expect.poll(() => page.evaluate(() => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        try {
          context.drawImage(window.art.template.$video, 0, 0, 1, 1)
          context.getImageData(0, 0, 1, 1)
          return true
        }
        catch { return false }
      })).toBe(true)
      expect(await capture()).toBe('SecurityError')
      expect(await page.evaluate(() => window.art.currentTime)).toBeGreaterThanOrEqual(0)
    })
  }
}

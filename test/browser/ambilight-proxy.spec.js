import { hash } from '../../refactor/scripts/releases.mjs'
import { ambilightCandidate } from '../helpers/ambilight.js'
import { canvasCandidate } from '../helpers/canvas.js'
import { expect, test } from './fixtures.js'

const implementation = await ambilightCandidate()
const proxySource = (await canvasCandidate()).source
const proxy = proxySource

for (const core of ['published-5.1.7', 'published', 'candidate']) {
  const scenario = core === 'published-5.1.7' ? 'historical core has no proxy option and retains native Ambilight playback' : 'Ambilight samples all nine canvas proxy regions after output resizing'
  test(`${core}: ${scenario}`, async ({ page }, testInfo) => {
    await page.goto(`/test/player.html?core=${core}`)
    for (const [name, source] of [['ambilightFactory', implementation.source], ['canvasProxy', proxy]])
      await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${source}; window.${name} = module.exports.default || module.exports; })();` })
    await page.evaluate(() => {
      window.palette = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(255, 255, 0)', 'rgb(0, 255, 255)', 'rgb(255, 0, 255)', 'rgb(120, 0, 0)', 'rgb(0, 120, 0)', 'rgb(0, 0, 120)']
      window.drawCount = 0
      window.proxyErrors = []
      window.art = new window.Artplayer({
        container: '.player',
        url: '/test/pattern.mp4',
        muted: true,
        proxy: window.canvasProxy((context, video) => {
          window.proxyVideo = video
          // Exercise the proxy's public post-processing callback with native canvas.
          const canvas = context.canvas
          for (let index = 0; index < 9; index++) {
            context.fillStyle = window.palette[index]
            context.fillRect(index % 3 * canvas.width / 3, Math.floor(index / 3) * canvas.height / 3, canvas.width / 3, canvas.height / 3)
          }
          window.drawCount++
        }),
        plugins: [window.ambilightFactory({ frequency: Infinity })],
      })
      window.art.on('artplayerProxyCanvas:error', error => window.proxyErrors.push({ name: error.name, message: error.message }))
      document.querySelector('#play').onclick = () => window.art.play()
    })
    await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
    await page.click('#play')
    if (core === 'published-5.1.7') {
      expect(await page.evaluate(() => 'proxy' in window.Artplayer.option)).toBe(false)
      expect(await page.evaluate(() => window.art.template.$video.nodeName)).toBe('VIDEO')
      await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('.artplayer-plugin-ambilight > div')].filter(node => /^rgb\(/.test(node.style.backgroundColor)).length)).toBe(9)
      expect(await page.evaluate(() => window.drawCount)).toBe(0)
      await testInfo.attach('ambilight-proxy-capability', { contentType: 'application/json', body: JSON.stringify({ core, proxyOption: false, actualHost: 'VIDEO', plugin: hash(implementation.source), proxy: hash(proxySource), scope: 'unsupported proxy option is ignored by this actual historical core; native plugin playback only' }) })
      await page.evaluate(() => window.art.destroy())
      return
    }
    expect(await page.evaluate(() => 'proxy' in window.Artplayer.option)).toBe(true)
    await expect.poll(() => page.evaluate(() => window.drawCount)).toBeGreaterThan(0)
    await expect.poll(() => page.evaluate(() => window.proxyVideo.currentTime)).toBeGreaterThan(0)
    await page.evaluate(() => {
      window.art.template.$video.width = 600
      window.art.template.$video.height = 300
      window.drawCount = 0
    })
    await expect.poll(() => page.evaluate(() => window.drawCount)).toBeGreaterThan(0)
    const dimensions = await page.evaluate(() => ({ nodeName: window.art.template.$video.nodeName, canvas: [window.art.template.$video.width, window.art.template.$video.height], video: [window.proxyVideo.videoWidth, window.proxyVideo.videoHeight] }))
    expect(dimensions.nodeName).toBe('CANVAS')
    expect(dimensions.canvas).not.toEqual(dimensions.video)
    await testInfo.attach('ambilight-proxy-inputs', { contentType: 'application/json', body: JSON.stringify({ core, dimensions, plugin: hash(implementation.source), proxy: hash(proxySource), media: '/test/pattern.mp4', scope: 'real video decode and proxy post-processing callback paints a nine-cell palette using native Canvas' }) })
    await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('.artplayer-plugin-ambilight > div')].map(node => node.style.backgroundColor))).toEqual(await page.evaluate(() => window.palette))
    await page.evaluate(() => window.art.destroy())
    expect(await page.locator('.artplayer-plugin-ambilight').count()).toBe(0)
  })
}

test.afterEach(async ({ page }, testInfo) => {
  await testInfo.attach('ambilight-proxy-state', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({ ready: window.art?.isReady, nodeName: window.art?.template.$video.nodeName, readyState: window.art?.template.$video.readyState, paused: window.art?.template.$video.paused, currentTime: window.art?.template.$video.currentTime, drawCount: window.drawCount, errors: window.proxyErrors }))) })
  await page.evaluate(() => {
    window.art?.plugins.artplayerPluginAmbilight?.stop()
    window.proxyVideo?.pause()
    if (window.art && !window.art.isDestroy)
      window.art.destroy()
  })
})

import { PNG } from 'pngjs'
import { hash } from '../../refactor/scripts/releases.mjs'
import { acceptedVttText, vttThumbnailCandidate, vttThumbnailHistorical } from '../helpers/vtt-thumbnail.js'
import { expect, test } from './fixtures.js'

const candidate = await vttThumbnailCandidate()
const historical = (await vttThumbnailHistorical()).filter(item => /^published-.*-main$/.test(item.name))
const cores = ['published-5.1.6', 'published-5.1.7', 'published-5.3.0', 'published', 'candidate']
const cues = 'WEBVTT\n\n00:00.000 --> 00:04.000\nsprite.svg#xywh=0,0,80,45\n\n00:04.000 --> 00:08.000\nsprite.svg#xywh=80,0,80,45\n'
const sprite = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="45"><path fill="red" d="M0 0h80v45H0z"/><path fill="blue" d="M80 0h80v45H80z"/></svg>'

function centerPixel(bytes) {
  const { width, height, data } = PNG.sync.read(bytes)
  const index = (Math.floor(height / 2) * width + Math.floor(width / 2)) * 4
  return [...data.subarray(index, index + 4)]
}

async function install(page, core, implementation, testInfo) {
  let requests = 0
  await page.route('**/test/vtt-combination/cues.vtt', (route) => {
    requests++
    return route.fulfill({ contentType: 'text/vtt', body: acceptedVttText(implementation, cues) })
  })
  await page.route('**/test/vtt-combination/sprite.svg', route => route.fulfill({ contentType: 'image/svg+xml', body: sprite }))
  await page.goto(`/test/player.html?core=${core}`)
  await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${implementation.code}; window.vttFactory = module.exports.default || module.exports; })();` })
  await page.evaluate(async () => {
    window.createPlayer('/test/pattern.mp4', true)
    await window.art.plugins.add(window.vttFactory({ vtt: '/test/vtt-combination/cues.vtt' }))
    window.vttControl = window.art.controls['vtt-thumbnail'] || window.art.controls.thumbnails
  })
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
  await testInfo.attach('vtt-combination-inputs', {
    contentType: 'application/json',
    body: JSON.stringify({ core, implementation: implementation.name, sha256: hash(implementation.code), cueFormat: /^published-1\.0\./.test(implementation.name) ? 'historical compact arrow; ordinary-space failures retained separately' : 'standard spaced arrow', mobile: 'desktop unless test declares an emulated user agent; no physical-device inference' }),
  })
  return () => requests
}

async function hover(page, percentage) {
  const progress = page.locator('.art-control-progress')
  await progress.hover()
  const bounds = await progress.boundingBox()
  await page.mouse.move(bounds.x + bounds.width * percentage, bounds.y + bounds.height / 2)
}

for (const core of cores) {
  test(`VTT candidate / ${core}: actual sprite pixels, chapter, native/web fullscreen and source switch`, async ({ page }, testInfo) => {
    const requests = await install(page, core, candidate, testInfo)
    try {
      const preview = page.locator('.art-control-vtt-thumbnail')
      const progress = page.locator('.art-control-progress')
      const bounds = await progress.boundingBox()
      await page.mouse.move(bounds.x + bounds.width * 0.25, bounds.y + bounds.height / 2)
      await expect(preview).toHaveCSS('background-position', '0px 0px')
      await expect(preview).toBeVisible()
      const red = await preview.screenshot()
      expect(centerPixel(red)).toEqual([255, 0, 0, 255])
      await testInfo.attach('vtt-red-cell', { contentType: 'image/png', body: red })
      await page.mouse.move(bounds.x + bounds.width * 0.75, bounds.y + bounds.height / 2)
      await expect(preview).toHaveCSS('background-position', '-80px 0px')
      const blue = await preview.screenshot()
      expect(centerPixel(blue)).toEqual([0, 0, 255, 255])
      await testInfo.attach('vtt-blue-cell', { contentType: 'image/png', body: blue })
      await page.click('#play')
      await expect.poll(() => page.evaluate(() => window.art.currentTime)).toBeGreaterThan(0.1)
      await page.click('#pause')
      await page.evaluate(() => {
        window.art.fullscreenWeb = true
      })
      await expect.poll(() => page.evaluate(() => window.art.fullscreenWeb)).toBe(true)
      await hover(page, 0.25)
      await expect(preview).toHaveCSS('background-position', '0px 0px')
      expect(centerPixel(await preview.screenshot())).toEqual([255, 0, 0, 255])
      await page.evaluate(async () => {
        window.art.fullscreenWeb = false
        await window.art.switchUrl('/test/pattern.mp4?second')
      })
      await hover(page, 0.75)
      await expect(preview).toHaveCSS('background-position', '-80px 0px')
      expect(await page.evaluate(() => window.vttControl === window.art.controls['vtt-thumbnail'])).toBe(true)
      expect(requests()).toBe(1)
      expect(await page.evaluate(() => Boolean(window.art.plugins.artplayerPluginChapter))).toBe(true)
      await expect(page.locator('.art-chapter')).toHaveCount(1)
      await page.evaluate(() => {
        window.vttFullscreen = []
        window.art.on('fullscreen', value => window.vttFullscreen.push(value))
        document.querySelector('#play').onclick = () => {
          window.art.fullscreen = true
        }
      })
      expect(await page.evaluate(() => Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled))).toBe(true)
      await page.locator('#play').click()
      await expect.poll(() => page.evaluate(() => (document.fullscreenElement || document.webkitFullscreenElement) === window.art.template.$player)).toBe(true)
      await hover(page, 0.75)
      await expect(preview).toBeVisible()
      await expect(preview).toHaveCSS('background-position', '-80px 0px')
      expect(centerPixel(await preview.screenshot())).toEqual([0, 0, 255, 255])
      expect(await page.evaluate(() => (document.fullscreenElement || document.webkitFullscreenElement).contains(window.vttControl))).toBe(true)
      await page.evaluate(() => {
        window.art.fullscreen = false
      })
      await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement || document.webkitFullscreenElement))).toBe(false)
      await expect.poll(() => page.evaluate(() => window.vttFullscreen)).toEqual([true, false])
      await page.evaluate(() => window.art.destroy(false))
      await expect(preview).toHaveCount(0)
    }
    finally {
      await page.evaluate(() => {
        if (!window.art.isDestroy)
          window.art.destroy()
      })
    }
  })
}

for (const implementation of historical) {
  const core = implementation.profile === 'old-control' ? 'published-5.1.6' : 'candidate'
  test(`VTT ${implementation.name} / ${core}: legal old calls preserve preview and control identity`, async ({ page }, testInfo) => {
    const requests = await install(page, core, implementation, testInfo)
    try {
      const name = implementation.profile === 'old-control' ? 'thumbnails' : 'vtt-thumbnail'
      const preview = page.locator(`.art-control-${name}`)
      const bounds = await page.locator('.art-control-progress').boundingBox()
      await page.mouse.move(bounds.x + bounds.width * 0.75, bounds.y + bounds.height / 2)
      await expect(preview).toHaveCSS('background-position', '-80px 0px')
      expect(centerPixel(await preview.screenshot())).toEqual([0, 0, 255, 255])
      expect(await page.evaluate(name => window.art.controls[name] === window.vttControl, name)).toBe(true)
      await page.evaluate(async () => {
        await window.art.switchUrl('/test/pattern.mp4?old-plugin')
      })
      await hover(page, 0.25)
      await expect(preview).toHaveCSS('background-position', '0px 0px')
      expect(requests()).toBe(1)
    }
    finally { await page.evaluate(() => window.art.destroy()) }
  })
}

for (const core of ['published-5.1.7', 'published', 'candidate']) {
  test(`VTT 1.0.1 / ${core}: pre-existing reserved thumbnails name conflict is retained as historical evidence`, async ({ page }, testInfo) => {
    const implementation = historical.find(item => item.version === '1.0.1')
    await page.route('**/test/vtt-conflict.vtt', route => route.fulfill({ contentType: 'text/vtt', body: acceptedVttText(implementation, cues) }))
    await page.goto(`/test/player.html?core=${core}`)
    await page.addScriptTag({ content: `(() => { const module = { exports: {} }; const exports = module.exports; ${implementation.code}; window.vttFactory = module.exports.default || module.exports; })();` })
    const state = await page.evaluate(async () => {
      window.createPlayer('/test/pattern.mp4')
      const original = window.art.controls.thumbnails
      try {
        await window.art.plugins.add(window.vttFactory({ vtt: '/test/vtt-conflict.vtt' }))
        return { error: null }
      }
      catch (error) {
        return { error: error.message, sameReservedControl: original === window.art.controls.thumbnails }
      }
      finally { window.art.destroy() }
    })
    expect(state.error).toContain('Can\'t add an existing [thumbnails] to the [control]')
    expect(state.sameReservedControl).toBe(true)
    await testInfo.attach('vtt-historical-conflict', { contentType: 'application/json', body: JSON.stringify({ core, plugin: implementation.name, sha256: hash(implementation.code), state, scope: 'Existing incompatibility, not successful old-plugin/new-core acceptance and not a newly introduced refactor regression' }) })
  })
}

test.describe('VTT mobile event integration', () => {
  test.use({ userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36', hasTouch: true })
  for (const core of cores) {
    test(`VTT candidate / ${core}: emulated mobile drag routes through core progress and releases hiding timer`, async ({ page }, testInfo) => {
      await install(page, core, candidate, testInfo)
      const sample = await page.evaluate(() => {
        const art = window.art
        const progress = art.template.$progress
        const box = progress.getBoundingClientRect()
        const events = []
        art.on('setBar', (type, percentage, event) => {
          if (event)
            events.push({ type, percentage, nativeType: event.type })
        })
        function touch(type, percentage) {
          const x = box.left + box.width * percentage
          const y = box.top + box.height / 2
          const point = { identifier: 1, target: progress, clientX: x, clientY: y, pageX: x + scrollX, pageY: y + scrollY }
          const event = new Event(type, { bubbles: true, cancelable: true })
          Object.defineProperties(event, { touches: { value: type === 'touchend' ? [] : [point] }, changedTouches: { value: [point] } })
          progress.dispatchEvent(event)
        }
        touch('touchstart', 0.25)
        touch('touchmove', 0.75)
        touch('touchend', 0.75)
        const control = art.controls['vtt-thumbnail']
        return { mobile: window.Artplayer.utils.isMobile, events, position: control.style.backgroundPosition, display: control.style.display, time: art.currentTime, duration: art.duration }
      })
      expect(sample.mobile).toBe(true)
      expect(sample.events.some(event => event.nativeType === 'touchmove' && event.type === 'played')).toBe(true)
      expect(sample.display).toBe('flex')
      expect(sample.position).toBe('-80px 0px')
      expect(sample.time / sample.duration).toBeGreaterThan(0.5)
      await expect(page.locator('.art-control-vtt-thumbnail')).toHaveCSS('display', 'none')
      await page.evaluate(() => window.art.destroy(false))
      await expect(page.locator('.art-control-vtt-thumbnail')).toHaveCount(0)
      await testInfo.attach('vtt-mobile-event-integration', { contentType: 'application/json', body: JSON.stringify({ core, sample, scope: 'Android user agent and synthetic DOM touch payloads through actual core handlers; native media seek and real hide timer. Not trusted OS touch, real Android, or iOS Safari acceptance.' }) })
    })
  }
})

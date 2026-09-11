import { expect, test } from './fixtures.js'

async function setup(page, core) {
  await page.goto(`/test/player.html?core=${core}&chapter=published`)
  await page.evaluate(() => window.createPlayer('/test/pattern.mp4'))
  await expect.poll(() => page.evaluate(() => window.art.isReady)).toBe(true)
}

for (const core of ['published', 'candidate']) {
  test(`${core}: sizing methods remain detachable own properties and ratio parsing retains legacy coercion`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const descriptors = ['autoSize', 'autoHeight', 'aspectRatio', 'flip'].map((name) => {
        const descriptor = Object.getOwnPropertyDescriptor(art, name)
        return { name, configurable: descriptor.configurable, enumerable: descriptor.enumerable, writable: descriptor.writable ?? null }
      })
      const { autoSize, autoHeight } = art
      const returns = [typeof Reflect.apply(autoSize, null, []), typeof Reflect.apply(autoHeight, {}, [])]
      art.template.$player.style.cssText = 'width:640px;height:360px;'
      const events = []
      art.on('aspectRatio', value => events.push(value))
      art.aspectRatio = ' 4 : 3 : ignored'
      const parsed = { value: art.aspectRatio, width: art.template.$video.style.width, height: art.template.$video.style.height }
      art.aspectRatio = ''
      art.aspectRatio = 'default'
      art.flip = 'custom'
      const custom = art.flip
      art.flip = ''
      const result = { descriptors, returns, parsed, events, custom, reset: art.flip }
      art.destroy()
      return result
    })).toEqual({
      descriptors: ['autoSize', 'autoHeight', 'aspectRatio', 'flip'].map(name => ({ name, configurable: false, enumerable: false, writable: name.startsWith('auto') ? false : null })),
      returns: ['undefined', 'undefined'],
      parsed: { value: ' 4 : 3 : ignored', width: '480px', height: '100%' },
      events: [' 4 : 3 : ignored', 'default', 'default'],
      custom: 'custom',
      reset: 'normal',
    })
  })
}

test('candidate: hidden containers defer sizing and recover after becoming visible', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const { $container, $video, $player } = art.template
    Object.defineProperties($video, { videoWidth: { configurable: true, value: 1920 }, videoHeight: { configurable: true, value: 1080 } })
    $container.style.cssText = 'display:none;width:640px;height:480px;'
    $player.style.cssText = 'width:80%;height:70%;'
    const events = []
    art.on('autoSize', value => events.push(['size', value]))
    art.on('autoHeight', value => events.push(['height', value]))
    art.autoSize()
    art.autoHeight()
    const hidden = { width: $player.style.width, height: $player.style.height, containerHeight: $container.style.height, count: events.length }
    $container.style.display = 'block'
    art.autoSize()
    art.autoHeight()
    const result = { hidden, events, height: $container.style.height }
    art.destroy()
    return result
  })).toEqual({ hidden: { width: '80%', height: '70%', containerHeight: '480px', count: 0 }, events: [['size', { width: 640, height: 360 }], ['height', 360]], height: '360px' })
})

test('candidate: malformed ratios preserve layout while retaining notices, datasets and events', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const { $video } = art.template
    art.aspectRatio = '4:3'
    const before = $video.getAttribute('style')
    const values = []
    art.on('aspectRatio', value => values.push(value))
    const stable = ['bad', '0:0', '-1:2', '1:0', 'Infinity:2'].map((value) => {
      art.aspectRatio = value
      return $video.getAttribute('style') === before && art.aspectRatio === value && art.template.$notice.textContent.includes(value)
    })
    art.destroy()
    return { stable, values }
  })).toEqual({ stable: [true, true, true, true, true], values: ['bad', '0:0', '-1:2', '1:0', 'Infinity:2'] })
})

test('candidate: retained display setters and sizing methods do not write or emit after destroy', async ({ page }) => {
  await setup(page, 'candidate')
  expect(await page.evaluate(() => {
    const art = window.art
    const { $container, $player, $video } = art.template
    art.destroy(false)
    const before = [$container.outerHTML, $player.outerHTML, $video.outerHTML]
    const events = []
    for (const name of ['autoSize', 'autoHeight', 'aspectRatio', 'flip'])
      art.on(name, () => events.push(name))
    art.autoSize()
    art.autoHeight()
    art.aspectRatio = '4:3'
    art.flip = 'horizontal'
    return { same: before.every((html, index) => html === [$container, $player, $video][index].outerHTML), events }
  })).toEqual({ same: true, events: [] })
})

for (const core of ['published', 'candidate']) {
  test(`${core}: sizing preserves valid geometry, return values and emitted measurements`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const { $container, $player, $video } = art.template
      Object.defineProperties($video, { videoWidth: { configurable: true, value: 1920 }, videoHeight: { configurable: true, value: 1080 } })
      $container.style.cssText = 'width:640px;height:480px;'
      const sizes = []
      const heights = []
      art.on('autoSize', value => sizes.push(value))
      art.on('autoHeight', value => heights.push(value))
      const autoSize = art.autoSize()
      const styles = { width: $player.style.width, height: $player.style.height }
      const autoHeight = art.autoHeight()
      const result = { styles, sizes, heights, returns: [typeof autoSize, typeof autoHeight], containerHeight: $container.style.height }
      art.destroy()
      return result
    })).toEqual({ styles: { width: '100%', height: '75%' }, sizes: [{ width: 640, height: 360 }], heights: [360], returns: ['undefined', 'undefined'], containerHeight: '360px' })
  })

  test(`${core}: aspect ratio and flip preserve dataset, notices and event order`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const events = []
      art.on('aspectRatio', value => events.push(['aspectRatio', value]))
      art.on('flip', value => events.push(['flip', value]))
      art.aspectRatio = '4:3'
      const video = art.template.$video
      const ratio = { width: video.style.width, height: video.style.height, margin: video.style.margin, value: art.aspectRatio }
      art.flip = 'horizontal'
      const flip = art.flip
      art.aspectRatio = 'default'
      art.flip = 'normal'
      const result = { ratio, flip, reset: { width: video.style.width, height: video.style.height, margin: video.style.margin, ratio: art.aspectRatio, flip: art.flip }, events }
      art.destroy()
      return result
    })).toEqual({ ratio: { width: '480px', height: '100%', margin: '0px auto', value: '4:3' }, flip: 'horizontal', reset: { width: '', height: '', margin: '', ratio: 'default', flip: 'normal' }, events: [['aspectRatio', '4:3'], ['flip', 'horizontal'], ['aspectRatio', 'default'], ['flip', 'normal']] })
  })

  test(`${core}: unresolved media dimensions do not partially change layout or emit NaN height`, async ({ page }) => {
    await setup(page, core)
    expect(await page.evaluate(() => {
      const art = window.art
      const { $video, $player } = art.template
      Object.defineProperties($video, { videoWidth: { configurable: true, value: 0 }, videoHeight: { configurable: true, value: 0 } })
      $player.style.width = '80%'
      $player.style.height = '70%'
      const events = []
      art.on('autoHeight', value => events.push(Number.isFinite(value)))
      art.autoSize()
      art.autoHeight()
      const result = { width: $player.style.width, height: $player.style.height, finiteHeightEvents: events }
      art.destroy()
      return result
    })).toEqual({ width: core === 'candidate' ? '80%' : '100%', height: '70%', finiteHeightEvents: core === 'candidate' ? [] : [false] })
  })
}

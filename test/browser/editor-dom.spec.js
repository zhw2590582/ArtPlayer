import { expect, test } from './fixtures.js'

test('docs Monaco DOM helpers preserve dimensions and offsets through nested scrolling', async ({ page }, testInfo) => {
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  const observations = await page.evaluate(async () => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    const load = ids => new Promise((resolve, reject) => window.require(ids, (...modules) => resolve(modules), reject))
    await load(['vs/editor/editor.main'])
    const [dom] = await load(['vs/base/browser/dom'])
    const host = document.createElement('div')
    host.style.cssText = 'position:relative;width:300px;height:160px;border:5px solid;overflow:scroll;'
    const spacer = document.createElement('div')
    spacer.style.cssText = 'width:600px;height:500px;'
    const child = document.createElement('div')
    child.style.cssText = 'box-sizing:content-box;position:absolute;left:70px;top:90px;width:120px;height:50px;padding:3px;border:2px solid;margin:7px;'
    host.append(spacer, child)
    document.body.append(host)
    try {
      return [[0, 0], [25, 35], [0, 0]].map(([left, top]) => {
        host.scrollLeft = left
        host.scrollTop = top
        const rect = child.getBoundingClientRect()
        return {
          scroll: [host.scrollLeft, host.scrollTop],
          content: [dom.getContentWidth(child), dom.getContentHeight(child)],
          total: [dom.getTotalWidth(child), dom.getTotalHeight(child)],
          offset: dom.getTopLeftOffset(child),
          native: { left: rect.left + window.scrollX, top: rect.top + window.scrollY },
        }
      })
    }
    finally {
      host.remove()
    }
  })
  for (const value of observations) {
    expect(value.content).toEqual([120, 50])
    expect(value.total).toEqual([144, 74])
    expect(value.offset.left).toBeCloseTo(value.native.left, 1)
    expect(value.offset.top).toBeCloseTo(value.native.top, 1)
  }
  expect(observations.map(value => value.scroll)).toEqual([[0, 0], [25, 35], [0, 0]])
  await testInfo.attach('monaco-dom-origins', { contentType: 'application/json', body: JSON.stringify(observations) })
})

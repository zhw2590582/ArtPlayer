import { expect } from '@playwright/test'

// Observe real media/RAF delivery after a companion plugin has become operational.
export async function observeDanmukuLoad(page, { label, requireComplete, rate = 20, seconds = 6 }) {
  let result
  try {
    await page.evaluate(async ({ label, rate, seconds }) => {
      const art = window.art
      const plugin = art.plugins.artplayerPluginDanmuku
      const owner = plugin.config({ speed: 1, antiOverlap: false })
      const host = art.template.$player.ownerDocument.defaultView
      const base = art.currentTime
      const rows = Array.from({ length: rate * seconds }, (_, index) => ({
        id: `${label}-${index}`,
        text: `${label} ${index}`,
        time: base + 0.5 + index / rate,
        mode: index % 3,
      }))
      const ids = new Set(rows.map(row => row.id))
      const state = window.danmukuCombinationLoad = { base, end: base + seconds + 2, rows, visible: [], frames: [], errors: [], startWall: host.performance.now() }
      const visible = (row) => {
        if (ids.has(row.id))
          state.visible.push({ id: row.id, time: art.currentTime, wall: host.performance.now() })
      }
      const error = error => state.errors.push(String(error))
      let frame
      const sample = () => {
        state.frames.push({ time: art.currentTime, wall: host.performance.now() })
        frame = host.requestAnimationFrame(sample)
      }
      frame = host.requestAnimationFrame(sample)
      art.on('artplayerPluginDanmuku:visible', visible)
      art.on('artplayerPluginDanmuku:error', error)
      window.finishDanmukuCombinationLoad = () => {
        host.cancelAnimationFrame(frame)
        art.off('artplayerPluginDanmuku:visible', visible)
        art.off('artplayerPluginDanmuku:error', error)
        const loaded = owner.queue.filter(row => ids.has(row.id))
        const result = { ...state, endWall: host.performance.now(), time: art.currentTime, loaded: loaded.length, waiting: loaded.filter(row => row.$state === 'wait').length, referenced: loaded.filter(row => row.$ref).length, nodes: art.template.$danmuku.children.length, pooled: owner.$refs.length, uniquePool: new Set(owner.$refs).size, decodedWidth: art.video.videoWidth }
        window.danmukuCombinationLoadResult = result
        return result
      }
      await plugin.load(rows)
    }, { label, rate, seconds })
    await expect.poll(() => page.evaluate(() => window.art.currentTime >= window.danmukuCombinationLoad.end), { timeout: 16000 }).toBe(true)
  }
  finally {
    result = await page.evaluate(() => window.finishDanmukuCombinationLoad?.())
  }
  expect(result.decodedWidth).toBeGreaterThan(0)
  expect(result.loaded).toBe(rate * seconds)
  expect(result.errors).toEqual([])
  if (requireComplete) {
    expect(result.visible.map(row => row.id).sort()).toEqual(result.rows.map(row => row.id).sort())
    expect(result.waiting).toBe(rate * seconds)
    expect(result.referenced).toBe(0)
    expect(result.uniquePool).toBe(result.pooled)
  }
  return { ...result, requireComplete, rate, seconds }
}

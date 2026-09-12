import { expect, test } from './fixtures.js'

test('Thumbnail native HTTP and Blob media controls', async ({ page, browserName }, testInfo) => {
  await page.goto('/test/player.html?core=published')
  const results = await page.evaluate(async () => {
    const result = []
    for (const url of ['/test/pattern.mp4', '/test/thumbnail-pattern.mp4', '/assets/sample/video.mp4']) {
      const blob = await (await fetch(url)).blob()
      for (const transport of ['http', 'blob']) {
        const video = document.createElement('video')
        video.muted = true
        video.controls = true
        document.body.append(video)
        const source = transport === 'blob' ? URL.createObjectURL(blob) : url
        const state = await new Promise((resolve) => {
          const timeout = setTimeout(() => finish('timeout'), 1500)
          function finish(outcome) {
            clearTimeout(timeout)
            resolve({ outcome, readyState: video.readyState, error: video.error?.code || 0, duration: video.duration, width: video.videoWidth })
          }
          video.onloadeddata = () => finish('loaded')
          video.onerror = () => finish('error')
          video.src = source
        })
        result.push({ url, type: blob.type, transport, ...state })
        video.removeAttribute('src')
        video.load()
        video.remove()
        if (transport === 'blob')
          URL.revokeObjectURL(source)
      }
    }
    return result
  })
  await testInfo.attach('thumbnail-native-media-controls', { contentType: 'application/json', body: JSON.stringify(results) })
  expect(results).toHaveLength(6)
  expect(results.every(item => item.outcome !== 'timeout')).toBe(true)
  for (const item of results) {
    if (item.transport === 'blob' && item.outcome === 'error') {
      expect(browserName).toBe('webkit')
      expect(item.error).toBe(4)
      testInfo.annotations.push({ type: 'capability-control', description: `Native Blob URL unavailable for ${item.url}; HTTP comparison loads. This is not successful extraction.` })
    }
    else {
      expect(item.outcome).toBe('loaded')
      expect(item.width).toBeGreaterThan(0)
    }
  }
})

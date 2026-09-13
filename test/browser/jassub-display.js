import { PNG } from 'pngjs'

// Read the browser's composited PNG in Node, without copying the transferred canvas.
export async function captureJassubDisplay(page, phase) {
  const geometry = await page.evaluate(() => window.jassubGeometry())
  const started = Date.now()
  let png
  try {
    png = await page.screenshot({ clip: geometry.clip })
  }
  catch (error) {
    await page.evaluate((failure) => {
      (window.jassubNative.displayFailures ||= []).push(failure)
    }, { message: error.message, elapsed: Date.now() - started, geometry })
    throw error
  }
  const { data, width, height } = PNG.sync.read(png)
  let visible = 0
  let signature = 0
  for (let i = 0; i < data.length; i += 4) {
    // The screenshot diagnostic ASS uses green glyphs; normal fixtures stay white.
    if (data[i] < 70 && data[i + 1] > 180 && data[i + 2] < 70) {
      visible++
      signature = (signature + i) >>> 0
    }
  }
  const state = { ...geometry, phase, visible, signature, screenshotWidth: width, screenshotHeight: height, screenshotElapsed: Date.now() - started, observation: 'composited-png' }
  await page.evaluate((state) => {
    window.jassubNative.lastPixel = state
    if (state.phase)
      window.jassubNative.snapshots.push(state)
  }, state)
  return { state, png }
}

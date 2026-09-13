import { drawMask, toBinaryMask } from './sdk'

export function makeWhiteTransparent(imageData) {
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 250 && data[i + 1] > 250 && data[i + 2] > 250)
      data[i + 3] = 0
  }
  return imageData
}

export function createOutput(layer) {
  const canvas = document.createElement('canvas')
  try {
    const ctx = canvas.getContext('2d')
    if (!ctx)
      throw new Error('Danmuku mask requires a 2D canvas context')
    Object.assign(layer.style, {
      maskMode: 'alpha',
      maskSize: 'contain',
      maskRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    })
    return { canvas, ctx }
  }
  catch (error) {
    canvas.width = 0
    canvas.height = 0
    throw error
  }
}

export async function renderMask(output, video, layer, segmenter, config, active) {
  const { canvas, ctx } = output
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const segmentation = await segmenter.segmentPeople(video)
  if (!active() || !segmentation || !segmentation.length)
    return
  const mask = await toBinaryMask(
    segmentation,
    { r: 255, g: 255, b: 255, a: 255 },
    { r: 0, g: 0, b: 0, a: 255 },
    config.drawContour,
    config.foregroundThreshold,
  )
  if (!active())
    return
  await drawMask(canvas, video, mask, config.opacity, config.maskBlurAmount)
  if (!active())
    return
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ctx.putImageData(makeWhiteTransparent(imageData), 0, 0)
  const url = canvas.toDataURL()
  if (active())
    layer.style.maskImage = `url(${url})`
}

export function releaseOutput(output) {
  if (output) {
    output.canvas.width = 0
    output.canvas.height = 0
  }
}

export function readOptions(option, getFallbackUrl) {
  const config = {
    url: option.url || getFallbackUrl(),
    width: option.width || 160,
    number: option.number || 100,
    scale: option.scale || 1,
  }
  if (!Number.isFinite(Number(config.width)) || config.width <= 0 || !Number.isFinite(Number(config.number)) || config.number <= 0)
    throw new TypeError('Auto-thumbnail width and number must be finite positive numbers')
  return config
}

export function sheetSize(config, video) {
  if (!Number.isFinite(video.duration) || video.duration <= 0 || !Number.isFinite(video.videoWidth) || video.videoWidth <= 0 || !Number.isFinite(video.videoHeight) || video.videoHeight <= 0)
    throw new TypeError('Auto-thumbnail requires finite media duration and dimensions')
  const height = Math.floor(config.width * video.videoHeight / video.videoWidth)
  const canvasWidth = Math.trunc(config.width * 10)
  const canvasHeight = Math.trunc(height * Math.ceil(config.number / 10))
  if (![height, canvasWidth, canvasHeight].every(value => Number.isSafeInteger(value) && value > 0 && value <= 0xFFFFFFFF))
    throw new RangeError('Auto-thumbnail canvas dimensions are invalid')
  return { height, canvasWidth, canvasHeight }
}

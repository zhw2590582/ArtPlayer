export function hasDimensions(video: HTMLVideoElement): boolean {
  return Number.isFinite(video.videoWidth) && Number.isFinite(video.videoHeight) && video.videoWidth > 0 && video.videoHeight > 0
}

export function resizeCanvas(canvas: HTMLCanvasElement, video: HTMLVideoElement, player: HTMLElement | null | undefined, autoSize: boolean | undefined): void {
  if (!player || autoSize || !hasDimensions(video))
    return
  const width = player.clientWidth
  const height = player.clientHeight
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0)
    return
  const aspect = video.videoWidth / video.videoHeight
  const canvasWidth = width / height > aspect ? height * aspect : width
  const canvasHeight = width / height > aspect ? height : width / aspect
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  canvas.style.padding = `${(height - canvasHeight) / 2}px ${(width - canvasWidth) / 2}px`
}

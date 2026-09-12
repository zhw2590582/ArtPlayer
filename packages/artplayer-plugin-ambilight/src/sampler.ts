type SamplingSource = HTMLVideoElement | HTMLCanvasElement

function isCanvas(source: SamplingSource): source is HTMLCanvasElement {
  return source.nodeName === 'CANVAS'
}

export function createColorSampler(canvas: HTMLCanvasElement, video: SamplingSource, createCanvas: () => HTMLCanvasElement) {
  let context: CanvasRenderingContext2D | null
  try {
    context = canvas.getContext('2d')
    canvas.width = 3
    canvas.height = 3
  }
  catch (error) {
    canvas.width = 0
    canvas.height = 0
    throw error
  }
  let destroyed = false
  let replaceCanvas = false

  function read(active: () => boolean): string[] | null {
    if (destroyed || !active())
      return null
    // A canvas proxy's output buffer can differ from its forwarded video dimensions.
    const canvasOutput = isCanvas(video)
    const width = canvasOutput ? video.width : video.videoWidth
    const height = canvasOutput ? video.height : video.videoHeight
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0)
      return null
    const w = width / 3
    const h = height / 3
    const colors: string[] = []
    try {
      if (replaceCanvas) {
        const replacement = createCanvas()
        if (destroyed || !active()) {
          replacement.width = 0
          replacement.height = 0
          return null
        }
        canvas = replacement
        context = null
        context = canvas.getContext('2d')
        if (destroyed || !active()) {
          canvas.width = 0
          canvas.height = 0
          return null
        }
        canvas.width = 3
        canvas.height = 3
        replaceCanvas = false
      }
      if (!context)
        return null
      for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
          if (destroyed || !active())
            return null
          context.drawImage(video, column * w, row * h, w, h, 0, 0, 1, 1)
          if (destroyed || !active())
            return null
          const [r, g, b] = context.getImageData(0, 0, 1, 1).data
          colors.push(`rgb(${r}, ${g}, ${b})`)
        }
      }
      return colors
    }
    catch {
      // Firefox can retain taint after a size reset; replace on the next eligible sample.
      if (!destroyed) {
        replaceCanvas = true
        canvas.width = 0
        canvas.height = 0
      }
      return null
    }
  }

  function destroy() {
    if (destroyed)
      return
    destroyed = true
    canvas.width = 0
    canvas.height = 0
  }
  return { read, destroy }
}

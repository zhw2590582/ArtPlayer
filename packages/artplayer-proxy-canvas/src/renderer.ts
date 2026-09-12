import { hasDimensions } from './geometry'

export type DrawCallback = (context: CanvasRenderingContext2D, video: HTMLVideoElement) => void

export function createRenderer(canvas: HTMLCanvasElement, video: HTMLVideoElement, callback: DrawCallback | undefined, notify: DrawCallback, error: (failure: unknown) => void) {
  const context = canvas.getContext('2d')
  let reported = false
  return {
    available() {
      if (context)
        return true
      if (!reported) {
        reported = true
        error(new Error('Canvas 2D context is unavailable'))
      }
      return false
    },
    async draw(valid: () => boolean): Promise<void> {
      const usable = () => valid() && video.readyState >= 2 && !video.seeking
      if (!context || !usable() || !hasDimensions(video) || !canvas.width || !canvas.height)
        return
      let acquiring = false
      try {
        if (typeof createImageBitmap !== 'undefined') {
          acquiring = true
          const bitmap = await createImageBitmap(video)
          acquiring = false
          try {
            if (usable())
              context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
          }
          finally { bitmap.close() }
        }
        else {
          context.drawImage(video, 0, 0, canvas.width, canvas.height)
        }
        if (!usable())
          return
        if (callback)
          callback(context, video)
        if (usable())
          notify(context, video)
      }
      catch (failure) {
        // Chromium can expose readyState 4 before its first frame is usable.
        // Other engines report zero frame counts even while drawing successfully.
        const awaitingFirstFrame = acquiring && typeof failure === 'object' && failure !== null && 'name' in failure
          && failure.name === 'InvalidStateError' && video.currentTime === 0
          && typeof video.getVideoPlaybackQuality === 'function' && video.getVideoPlaybackQuality().totalVideoFrames === 0
        if (usable() && !awaitingFirstFrame)
          error(failure)
      }
    },
  }
}

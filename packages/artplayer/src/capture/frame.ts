export type CaptureMedia = CanvasImageSource & {
  videoWidth: number
  videoHeight: number
  currentTime: number
}

export function drawFrame(canvas: HTMLCanvasElement, video: CaptureMedia): void {
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const context = canvas.getContext('2d')
  if (!context)
    throw new TypeError('Canvas 2D context is unavailable')
  context.drawImage(video, 0, 0)
}

export function captureBlobUrl(canvas: HTMLCanvasElement, resolve: (url: string) => void, reject: (error: unknown) => void): void {
  canvas.toBlob((blob) => {
    try {
      if (!blob)
        throw new Error('Unable to encode screenshot blob')
      // The public getBlobUrl caller owns this URL, including after destroy.
      resolve(URL.createObjectURL(blob))
    }
    catch (error) {
      reject(error)
    }
  })
}

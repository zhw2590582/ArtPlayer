import type { Thumbnails } from '../../types/option'

export interface ThumbnailGeometry {
  imageWidth: number
  videoWidth: number
  videoHeight: number
  progressWidth: number
  position: number
}

export function thumbnailLayout(option: Thumbnails, geometry: ThumbnailGeometry) {
  const { number, column, width, height, scale } = option
  const { imageWidth, videoWidth, videoHeight, progressWidth, position } = geometry
  const columns = Number(column)
  const previewWidth = Number(width) * Number(scale) || imageWidth / columns
  const previewHeight = Number(height) * Number(scale) || previewWidth / (videoWidth / videoHeight)
  const index = Math.floor(position / (progressWidth / Number(number)))
  // Match the zero-based cells produced by artplayer-tool-thumbnail.
  const row = Math.floor(index / columns)
  const cell = index % columns
  const left = position <= previewWidth / 2
    ? 0
    : position > progressWidth - previewWidth / 2
      ? `${progressWidth - previewWidth}px`
      : `${position - previewWidth / 2}px`
  return {
    height: `${previewHeight}px`,
    width: `${previewWidth}px`,
    backgroundPosition: `-${cell * previewWidth}px -${row * previewHeight}px`,
    left,
  }
}

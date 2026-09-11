export interface Size {
  width: number
  height: number
}

export function positiveSize({ width, height }: Size): boolean {
  return Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0
}

export function containSize(container: Size, ratio: number): (Size & { axis: 'width' | 'height' }) | undefined {
  if (!positiveSize(container) || !Number.isFinite(ratio) || ratio <= 0)
    return
  const result = container.width / container.height > ratio
    ? { width: ratio * container.height, height: container.height, axis: 'width' as const }
    : { width: container.width, height: container.width / ratio, axis: 'height' as const }
  return positiveSize(result) ? result : undefined
}

export function proportionalHeight(width: number, media: Size): number | undefined {
  if (!Number.isFinite(width) || width <= 0 || !positiveSize(media))
    return
  const height = media.height * (width / media.width)
  return Number.isFinite(height) && height > 0 ? height : undefined
}

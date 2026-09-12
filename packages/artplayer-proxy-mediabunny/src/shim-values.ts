export function clampVolume(value: unknown): number {
  return Math.max(0, Math.min(1, Number(value) || 0))
}

export function timeRanges(duration: number, start: number, end: number): TimeRanges {
  if (!duration || Number.isNaN(duration) || end <= 0)
    return { length: 0, start: () => 0, end: () => 0 }
  return { length: 1, start: () => start, end: () => end }
}

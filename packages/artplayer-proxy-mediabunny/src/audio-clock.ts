export interface AudioClock {
  audioContext: AudioContext | null
  paused: boolean
  audioContextStartTime: number
  playbackTimeAtStart: number
  playbackRate: number
}

export function mediaTime(clock: AudioClock): number {
  if (clock.paused || !clock.audioContext)
    return clock.playbackTimeAtStart
  return (clock.audioContext.currentTime - clock.audioContextStartTime) * clock.playbackRate + clock.playbackTimeAtStart
}

export function bufferTiming(clock: AudioClock, timestamp: number, duration: number, now: number) {
  const startAt = clock.audioContextStartTime + (timestamp - clock.playbackTimeAtStart) / clock.playbackRate
  const endAt = startAt + duration / clock.playbackRate
  const endMediaTime = (endAt - clock.audioContextStartTime) * clock.playbackRate + clock.playbackTimeAtStart
  return { startAt: Math.max(startAt, now), offset: startAt < now ? (now - startAt) * clock.playbackRate : null, endMediaTime }
}

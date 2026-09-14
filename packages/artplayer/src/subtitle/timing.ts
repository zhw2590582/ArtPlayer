import type { SubtitleCue } from './types'

export function refreshPausedCues(track: TextTrack | undefined, video: { paused?: boolean, currentTime?: number } | undefined, cues: readonly SubtitleCue[]): void {
  if (!track || track.mode === 'disabled' || !video?.paused || !Number.isFinite(video.currentTime))
    return
  const time = video.currentTime!
  const expected = cues.filter(cue => cue.startTime <= time && time < cue.endTime)
  const active = Array.from(track.activeCues || [])
  if (expected.length === active.length && expected.every((cue, index) => active[index] === cue))
    return
  // Some engines retain stale active flags after timing edits while paused.
  for (const cue of cues)
    track.removeCue(cue)
  for (const cue of cues)
    track.addCue(cue)
}

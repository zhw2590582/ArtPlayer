import type { SwitchHost } from './types'
import { positionRevision } from '../media/position-revision'

// Native media clocks may round within a frame. Larger misses need one correction.
const POSITION_TOLERANCE = 0.05

export function positionRestoration(art: Pick<SwitchHost, 'currentTime' | 'template'>, target: number, active: () => boolean) {
  let expected: number | undefined
  let observedSeek = false
  let corrected = false
  let manual = false
  let revision = positionRevision(art)
  const manualPosition = () => manual || positionRevision(art) !== revision
  const seeking = () => !!art.template?.$video?.seeking
  return {
    restore(write = () => {
      art.currentTime = target
    }): void {
      if (!active() || manualPosition())
        return
      const previousRevision = positionRevision(art)
      write()
      revision = positionRevision(art)
      // Nested public writes supersede the restoration's own setter call.
      if (revision > previousRevision + 1)
        manual = true
      if (!active())
        return
      // Keep the actual clamped value accepted by the player setter.
      expected = art.currentTime
      if (!active() || manualPosition())
        return
      observedSeek = seeking()
    },
    manual(): void {
      manual = true
    },
    ready(): boolean {
      if (!active() || seeking())
        return false
      const missed = expected !== undefined && Math.abs(art.currentTime - expected) > POSITION_TOLERANCE
      if (!manualPosition() && observedSeek && !corrected && expected !== undefined && missed) {
        corrected = true
        if (!active())
          return false
        art.currentTime = expected
      }
      return active() && !seeking()
    },
  }
}

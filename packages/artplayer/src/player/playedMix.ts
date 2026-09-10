import type { Position } from '../media/playback'
import { def } from '../utils'

export default function playedMix(art: Position): asserts art is Position & { readonly played: number } {
  def(art, 'played', { get: () => art.currentTime / art.duration })
}

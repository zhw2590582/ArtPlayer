import type { PlaybackMethods } from '../media/types'
import { def } from '../utils'

export default function toggleMix<PlayResult, PauseResult>(art: PlaybackMethods<PlayResult, PauseResult> & { readonly playing: boolean }): asserts art is typeof art & { toggle: () => PlayResult | PauseResult } {
  def(art, 'toggle', {
    value() {
      if (art.playing)
        return art.pause()
      else
        return art.play()
    },
  })
}

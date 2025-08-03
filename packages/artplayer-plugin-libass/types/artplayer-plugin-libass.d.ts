import type SubtitlesOctopus from '@hrgui/libass-wasm-ts'
import type Artplayer from 'artplayer'
import type { Options } from 'libass-wasm'

declare const artplayerPluginAss: (options: Options) => (art: Artplayer) => {
  name: 'artplayerPluginLibass'
  libass: SubtitlesOctopus
  visible: boolean
  init: () => void
  switch: (url: string) => void
  show: () => void
  hide: () => void
  destroy: () => void
}

export default artplayerPluginAss

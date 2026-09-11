import type Artplayer from 'artplayer'

export interface QualityLevel {
  height: number
  width?: number
  id?: string | number
  qualityIndex?: number
  bitrate?: number
  bitrateInKbit?: number
}

export interface AudioTrack {
  id?: string | number | null
  index?: number | null
  lang?: string | null
}

export interface Config<Item extends object = object> {
  control?: boolean
  setting?: boolean
  title?: string
  auto?: string
  /** Called without a receiver or index, with the original SDK object. */
  getName?: (item: Item) => string
}

export interface Option<Level extends object = QualityLevel, Track extends object = AudioTrack> {
  quality?: Config<Level>
  audio?: Config<Track>
}

export interface Result {
  name: 'artplayerPluginDashControl'
  update: () => void
}

declare function artplayerPluginDashControl<Level extends object = QualityLevel, Track extends object = AudioTrack>(option?: Option<Level, Track>): (art: Artplayer) => Result
// Preserve the required last signature for historical Parameters<typeof factory>[0] consumers.
declare function artplayerPluginDashControl<Level extends object = QualityLevel, Track extends object = AudioTrack>(option: Option<Level, Track>): (art: Artplayer) => Result

export default artplayerPluginDashControl

import type Artplayer from 'artplayer'

export interface QualityLevel {
  height: number
  name?: string
}

export interface AudioTrack {
  id: number
  name: string
  lang?: string
  language?: string
}

export interface Config<Item extends object = object> {
  control?: boolean
  setting?: boolean
  title?: string
  auto?: string
  /** Plain callback; current-label calls omit index. SDK objects retain their identity. */
  getName?: (item: Item, index?: number) => string
}

export interface Option<Level extends object = QualityLevel, Track extends object = AudioTrack> {
  quality?: Config<Level>
  audio?: Config<Track>
}

export interface Result {
  name: 'artplayerPluginHlsControl'
  update: () => void
}

declare function artplayerPluginHlsControl<Level extends object = QualityLevel, Track extends object = AudioTrack>(option?: Option<Level, Track>): (art: Artplayer) => Result
// Keep the required last signature for historical Parameters<typeof factory>[0] consumers.
declare function artplayerPluginHlsControl<Level extends object = QualityLevel, Track extends object = AudioTrack>(option: Option<Level, Track>): (art: Artplayer) => Result

export default artplayerPluginHlsControl

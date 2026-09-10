import type { Subtitle as SubtitleInput } from '../../types/subtitle'
import type { ComponentHost } from '../component/types'
import type { OptionalMediaCapabilities } from '../media/types'

export type SubtitleOption = Required<SubtitleInput>

export interface SubtitleCue extends TextTrackCue {
  text: string
  originalStartTime?: number
  originalEndTime?: number
}

export interface SubtitleTrack extends HTMLTrackElement {
  offset?: number
}

export interface SubtitleHost extends ComponentHost {
  template: { $player: HTMLElement, $video: HTMLElement & OptionalMediaCapabilities, $subtitle: HTMLDivElement, $track: SubtitleTrack }
  option: { subtitle: SubtitleOption }
  proxy: ComponentHost['events']['proxy']
  on: (name: 'video:timeupdate', callback: () => void) => unknown
  off: (name: 'video:timeupdate', callback: () => void) => unknown
  notice: { set show(value: unknown) }
  i18n: { get: (key: string) => string }
}

export interface SubtitleView {
  art: SubtitleHost
  option: SubtitleOption | null
  destroyEvent: () => unknown
  readonly cues: SubtitleCue[]
  readonly activeCues: SubtitleCue[]
  readonly textTrack: TextTrack | undefined
  update: () => void
}

export interface SubtitleOffsetHost {
  template: { $track?: SubtitleTrack | null }
  subtitle: { readonly cues: SubtitleCue[], update: () => void }
  readonly duration: number
  notice: { set show(value: string) }
  i18n: { get: (key: string) => string }
  emit: (name: 'subtitleOffset', value: number) => unknown
}

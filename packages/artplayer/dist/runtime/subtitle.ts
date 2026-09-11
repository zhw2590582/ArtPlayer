import type { Subtitle as SubtitleInput } from '../subtitle'

export type SubtitleOption = Required<SubtitleInput>

export interface SubtitleCue extends TextTrackCue {
  text: string
  originalStartTime?: number
  originalEndTime?: number
}

export interface SubtitleTrack extends HTMLTrackElement { offset?: number }

export interface Subtitle {
  name: string
  option: SubtitleOption | null
  destroyEvent: () => unknown
  url: string
  readonly textTrack: TextTrack | undefined
  readonly activeCues: SubtitleCue[]
  readonly cues: SubtitleCue[]
  show: boolean
  toggle: () => void
  style: {
    (styles: Partial<CSSStyleDeclaration>): HTMLDivElement
    (key: string, value: string | number): HTMLDivElement
  }
  update: () => void
  switch: (url: string, option?: SubtitleInput) => Promise<string | null | undefined>
  init: (option: SubtitleOption) => Promise<string | null | undefined>
  createTrack: (kind: string, url: string) => void
}

export interface Notice {
  timer: number | null
  get show(): boolean
  set show(value: string | Error | false)
  destroy: () => void
}

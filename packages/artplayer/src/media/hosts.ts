import type { ResolvedOption } from '../option/types'
import type { PlaybackMethods } from './types'

export interface MediaHost<Media> {
  template: { $video: Media }
}

interface NoticeHost {
  i18n: { get: (key: string) => string }
  notice: { get show(): unknown, set show(value: string | Error) }
  emit: (name: 'play' | 'pause') => unknown
}

export type PauseHost<Media extends Pick<PlaybackMethods, 'pause'>> = MediaHost<Media> & NoticeHost

interface PauseTarget {
  pause: () => unknown
}

export type PlayHost<Media extends Pick<PlaybackMethods, 'play'>> = MediaHost<Media> & NoticeHost & Partial<PauseTarget> & {
  option: Pick<ResolvedOption, 'mutex'>
  constructor: { instances: PauseTarget[] }
}

export interface LayoutHost {
  template: { $player: Pick<Element, 'getBoundingClientRect'> }
}

export type RectState = Readonly<Pick<DOMRect, 'bottom' | 'height' | 'left' | 'right' | 'top' | 'width'>> & {
  readonly rect: DOMRect
  readonly x: number
  readonly y: number
}

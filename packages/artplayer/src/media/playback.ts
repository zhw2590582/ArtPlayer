import type { PipProperty } from '../display/types'
import type { NoticeSink } from '../notice'

export interface Position {
  readonly duration: number
  get currentTime(): number
  set currentTime(time: number | string)
}

export interface SeekMethods {
  get seek(): undefined
  set seek(time: number | string)
  get forward(): undefined
  set forward(time: number)
  get backward(): undefined
  set backward(time: number)
}

export interface SeekHost extends Position {
  notice: NoticeSink
  emit: (name: 'seek', currentTime: number, requestedTime: number | string) => unknown
}

export interface PlaybackNotice {
  i18n: { get: (key: string) => string }
  notice: NoticeSink
}

export interface VolumeHost extends PlaybackNotice {
  template: { $video: Pick<HTMLMediaElement, 'volume' | 'muted'> }
  storage: { set: (key: 'volume', value: number) => unknown }
  emit: (name: 'muted', value: boolean) => unknown
}

export type DisplayState = 'mini' | 'pip' | 'fullscreen' | 'fullscreenWeb'
export type DisplayStates = Record<'mini' | 'fullscreenWeb', boolean> & PipProperty & { fullscreen?: boolean }

export interface StateProperty {
  get state(): DisplayState | 'standard'
  set state(name: string)
}

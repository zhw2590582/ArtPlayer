import type { SubscriptionHost } from '../component/resources'
import type { ComponentHost, EntryInput, EntryOption } from '../component/types'
import type { PipProperty } from '../display/types'

export interface UIEvents {
  'mousemove': [MouseEvent]
  'click': [MouseEvent]
  'document:mousemove': [MouseEvent]
  'document:mouseup': [MouseEvent]
  'video:timeupdate': [Event]
  'video:loadedmetadata': [Event]
  'video:durationchange': [Event]
  'video:emptied': [Event]
  'video:seeking': [Event]
  'video:seeked': [Event]
  'video:progress': [Event]
  'video:ended': [Event]
  'video:playing': [Event]
  'video:pause': [Event]
  'video:volumechange': [Event]
  'video:ratechange': [Event]
  'setBar': [type: string, percentage: number, event?: MouseEvent | TouchEvent]
  'raf': []
  'control': [boolean]
  'fullscreen': [boolean]
  'fullscreenWeb': [boolean]
  'pip': [boolean]
  'setting': [boolean]
  'contextmenu': [boolean]
  'aspectRatio': [string]
  'flip': [string]
  'blur': [Event]
  'resize': []
}

export interface QualityItem { html: string | HTMLElement, url: string, default?: boolean }

type IconName = 'play' | 'pause' | 'volume' | 'volumeClose' | 'fullscreenOn' | 'fullscreenOff' | 'fullscreenWebOn' | 'fullscreenWebOff' | 'pip' | 'setting' | 'screenshot' | 'airplay'

export interface ControlHost extends ComponentHost, SubscriptionHost<UIEvents>, PipProperty {
  template: {
    $video?: { readonly currentTime: number, readonly seeking?: boolean }
    $player: HTMLDivElement
    $bottom: HTMLDivElement
    $controls: HTMLDivElement
    $progress: HTMLDivElement
    $controlsLeft: HTMLDivElement
    $controlsRight: HTMLDivElement
  }
  option: {
    isLive: boolean
    quality: QualityItem[]
    screenshot: boolean
    setting: boolean
    pip: boolean
    airplay: boolean
    fullscreenWeb: boolean
    fullscreen: boolean
    controls: EntryInput<ControlHost>[]
    highlight: { time: number, text: string }[]
  }
  icons: Record<IconName, HTMLElement> & { indicator?: HTMLElement }
  i18n: { get: (key: string) => string }
  constructor: { CONTROL_HIDE_TIME: number, USE_RAF: boolean, SEEK_STEP: number, VOLUME_STEP: number }
  setting: { show: boolean, toggle: () => void, resize: () => void }
  isInput: boolean
  isFocus: boolean
  isRotate: boolean
  playing: boolean
  muted: boolean
  volume: number
  currentTime: number
  duration: number
  played: number
  loaded: number
  top: number
  height: number
  fullscreen?: boolean
  fullscreenWeb: boolean
  get seek(): undefined
  set seek(second: number)
  get quality(): undefined
  set quality(value: QualityItem[])
  play: () => unknown
  pause: () => unknown
  screenshot: () => unknown
  airplay: () => unknown
}

export type ControlOption = EntryOption<ControlHost>
export type ControlFactory = (art: ControlHost) => ControlOption

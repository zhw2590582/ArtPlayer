import type { SubscriptionHost } from '../component/resources'
import type { CoreEmission } from '../events/core-types'
import type { OptionalMediaCapabilities } from '../media/types'
import type { NoticeSink } from '../notice'

export interface WebFullscreenHost extends CoreEmission<'fullscreenWeb' | 'resize'> {
  constructor: { FULLSCREEN_WEB_IN_BODY: boolean }
  template: { $container: HTMLElement, $player: HTMLElement }
  state: string
}

export interface WebFullscreenProperty {
  fullscreenWeb: boolean
}

export interface FullscreenHost extends CoreEmission<'fullscreen' | 'fullscreenError' | 'resize'> {
  template: { $player: HTMLElement, $video: HTMLElement & OptionalMediaCapabilities }
  state: string
  notice: NoticeSink
  i18n: { get: (key: string) => string }
  once: (name: 'video:loadedmetadata', listener: () => void) => unknown
  on: (name: 'document:webkitfullscreenchange', listener: () => void) => unknown
  off: (name: 'video:loadedmetadata' | 'document:webkitfullscreenchange', listener: () => void) => unknown
}

export interface NativeFullscreenAdapter {
  document: Document
  target: HTMLElement
  readonly element: Element | null
  elementProperty: string
  changeEvent: string
  errorEvent: string
  request: () => unknown
  exit: () => unknown
}

export interface PipHost {
  template: { $video: HTMLElement & OptionalMediaCapabilities & { disablePictureInPicture?: boolean } }
  state: string
  notice: NoticeSink
  i18n: { get: (key: string) => string }
  emit: (name: 'pip', value: boolean) => unknown
}

export interface PipProperty {
  get pip(): HTMLElement | null | boolean
  set pip(value: boolean)
}

export interface MiniEvents {
  'video:playing': [Event]
  'video:pause': [Event]
  'video:timeupdate': [Event]
  'document:mousemove': [MouseEvent]
  'document:mouseup': [MouseEvent]
}

export interface MiniHost extends SubscriptionHost<MiniEvents> {
  template: { $player: HTMLElement, $video: HTMLElement, $mini?: HTMLElement }
  icons: { close: HTMLElement, play: HTMLElement, pause: HTMLElement }
  storage: { get: (key: string) => unknown, set: (key: string, value: number) => unknown }
  state: string
  playing: boolean
  play: () => unknown
  pause: () => unknown
  emit: (name: 'mini', value: boolean) => unknown
}

export interface MiniProperty {
  mini: boolean
}

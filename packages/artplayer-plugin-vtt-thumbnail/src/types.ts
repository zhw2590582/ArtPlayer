import type Artplayer from 'artplayer'
import type { Events, Utils } from 'artplayer'

export interface Option {
  vtt?: string
  style?: Partial<CSSStyleDeclaration>
}

export interface Result {
  name: 'artplayerPluginVttThumbnail'
}

export interface Rectangle {
  x: string
  y: string
  w: string
  h: string
}

export interface Thumbnail extends Rectangle {
  start: number
  end: number
  url: string
}

export type Cleanup = () => void
export type OwnedEvent = 'destroy' | 'setBar'
export interface Lifetime {
  readonly closed: boolean
  own: (cleanup: Cleanup) => () => boolean
  listen: <Name extends OwnedEvent>(name: Name, callback: (...args: Events[Name]) => unknown) => void
  wait: <Value>(value: Value | PromiseLike<Value>) => Promise<Value | void>
  dispose: Cleanup
}

export type LifetimeHost = Pick<Artplayer, 'on' | 'off' | 'isDestroy'>
export type StyleKey = 'backgroundImage' | 'height' | 'width' | 'backgroundPosition' | 'left' | 'display'
export interface PreviewOptions {
  lifetime: Lifetime
  thumbnails: readonly Thumbnail[]
  progress: Pick<HTMLElement, 'clientWidth'>
  duration: () => number
  setStyle: Utils['setStyle']
  isMobile: boolean
}

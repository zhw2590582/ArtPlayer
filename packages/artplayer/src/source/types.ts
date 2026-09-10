export type SourceEvent = 'video:error' | 'video:loadedmetadata' | 'video:canplay'
export type SourceListener = (event?: unknown) => void

export interface SourceEvents {
  on: (name: SourceEvent, callback: SourceListener) => unknown
  once: (name: SourceEvent, callback: SourceListener) => unknown
  off: (name: SourceEvent, callback: SourceListener) => unknown
}

export interface SourceMedia {
  src: string | null
}

export interface UrlTarget {
  url: string | null
}

export interface UrlHost<Media extends SourceMedia, Host> extends UrlTarget, SourceEvents {
  template: { $video: Media }
  option: {
    url: string
    type: string
    customType: Record<string, ((this: Host, video: Media, url: string, art: Host) => unknown) | undefined>
  }
  loading: { set show(value: boolean) }
  isReady: boolean
  emit: (name: 'restart', url: string) => unknown
}

export interface SwitchHost extends UrlTarget, SourceEvents {
  currentTime: number
  readonly playing: boolean
  aspectRatio: string
  playbackRate: number
  pause: () => unknown
  play: () => unknown
  notice: { set show(value: string) }
}

export interface SwitchMethods {
  switchUrl: (url: string) => Promise<void>
  switchQuality: (url: string) => Promise<void>
  set switch(url: string)
}

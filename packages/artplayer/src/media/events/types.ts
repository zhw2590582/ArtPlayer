export type MediaEventName = `video:${string}`
export type MediaListener = (event?: unknown) => void

export interface MediaEvents {
  on: (name: MediaEventName, callback: MediaListener) => unknown
  once: (name: MediaEventName, callback: MediaListener) => unknown
  off: (name: MediaEventName, callback: MediaListener) => unknown
  emit: {
    (name: MediaEventName, event: Event): unknown
    (name: 'ready' | 'resize'): unknown
    (name: 'error', error: unknown, attempt: number): unknown
  }
}

export interface MediaUI {
  loading: { set show(value: boolean) }
  controls: { set show(value: boolean) }
  mask: { set show(value: boolean) }
}

export interface MediaEventHost extends MediaEvents, MediaUI {
  template: {
    $video: EventTarget
    $player: Pick<HTMLElement, 'classList'>
    $poster: Pick<HTMLElement, 'style'>
  }
  proxy: (target: EventTarget, name: string, callback: (event: Event) => void) => unknown
  isReady: boolean
  readonly playing: boolean
  url: string | null
  set seek(time: number)
  play: () => unknown
  option: { url: string, loop: boolean }
  i18n: { get: (key: string) => string }
  notice: { set show(message: string) }
  constructor: { RECONNECT_TIME_MAX: number, RECONNECT_SLEEP_TIME: number }
}

export interface Reconnect {
  reset: () => void
  loadStart: () => void
  schedule: (error: unknown) => void
}

import type { MediaSurface } from './media'

/** Query results remain nullable for caller-supplied SSR templates. */
export interface Template<Host, Media extends MediaSurface = MediaSurface> {
  art: Host
  $container: HTMLDivElement
  $player: HTMLDivElement | null
  $video: Media
  $track: HTMLTrackElement | null
  $poster: HTMLDivElement | null
  $subtitle: HTMLDivElement | null
  $danmuku: HTMLDivElement | null
  $bottom: HTMLDivElement | null
  $progress: HTMLDivElement | null
  $controls: HTMLDivElement | null
  $controlsLeft: HTMLDivElement | null
  $controlsCenter: HTMLDivElement | null
  $controlsRight: HTMLDivElement | null
  $layer: HTMLDivElement | null
  $loading: HTMLDivElement | null
  $notice: HTMLDivElement | null
  $noticeInner: HTMLDivElement | null
  $mask: HTMLDivElement | null
  $state: HTMLDivElement | null
  $setting: HTMLDivElement | null
  $info: HTMLDivElement | null
  $infoPanel: HTMLDivElement | null
  $infoClose: HTMLDivElement | null
  $contextmenu: HTMLDivElement | null
  $mini?: HTMLElement
  query: <ElementType extends Element = Element>(selector: string) => ElementType | null
  init: () => void
  destroy: (removeHtml: boolean) => void
}

export type IconName = 'loading' | 'state' | 'play' | 'pause' | 'check' | 'volume' | 'volumeClose'
  | 'screenshot' | 'setting' | 'pip' | 'arrowLeft' | 'arrowRight' | 'playbackRate' | 'aspectRatio'
  | 'config' | 'lock' | 'flip' | 'unlock' | 'fullscreenOff' | 'fullscreenOn' | 'fullscreenWebOff'
  | 'fullscreenWebOn' | 'switchOn' | 'switchOff' | 'error' | 'close' | 'airplay'

/** Default getters create fresh icon wrappers; unknown custom keys may be absent. */
export type Icons = Readonly<Record<IconName, HTMLElement>> & { readonly [name: string]: HTMLElement | undefined }

export interface TemplateHost<Host> {
  id: number
  option: {
    container: string | HTMLElement
    useSSR: boolean
    proxy?: (this: Host, art: Host) => unknown
    backdrop: boolean
  }
  constructor: { instances: readonly { template: { $container: Element } }[] }
}

// Missing SSR nodes remain nullable; mounting does not synthesize replacements.
export interface TemplateNodes {
  $player: HTMLDivElement | null
  $video: HTMLVideoElement | HTMLCanvasElement | null
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
}

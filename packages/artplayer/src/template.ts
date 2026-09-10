import type { TemplateHost, TemplateNodes } from './template/types'
import { ownContainer } from './lifecycle/instance'
import captureTemplate from './lifecycle/template-rollback'
import html from './template/html'
import bindNodes from './template/nodes'
import { addClass, errorHandle, isMobile, query, replaceElement, supportsFlex } from './utils'

export default class Template<Host extends TemplateHost<Host>> implements TemplateNodes {
  declare art: Host
  declare $container: HTMLDivElement
  declare $player: HTMLDivElement | null
  declare $video: HTMLVideoElement | HTMLCanvasElement | null
  declare $track: HTMLTrackElement | null
  declare $poster: HTMLDivElement | null
  declare $subtitle: HTMLDivElement | null
  declare $danmuku: HTMLDivElement | null
  declare $bottom: HTMLDivElement | null
  declare $progress: HTMLDivElement | null
  declare $controls: HTMLDivElement | null
  declare $controlsLeft: HTMLDivElement | null
  declare $controlsCenter: HTMLDivElement | null
  declare $controlsRight: HTMLDivElement | null
  declare $layer: HTMLDivElement | null
  declare $loading: HTMLDivElement | null
  declare $notice: HTMLDivElement | null
  declare $noticeInner: HTMLDivElement | null
  declare $mask: HTMLDivElement | null
  declare $state: HTMLDivElement | null
  declare $setting: HTMLDivElement | null
  declare $info: HTMLDivElement | null
  declare $infoPanel: HTMLDivElement | null
  declare $infoClose: HTMLDivElement | null
  declare $contextmenu: HTMLDivElement | null

  constructor(art: Host) {
    this.art = art
    const { option, constructor } = art

    if (option.container instanceof Element) {
      this.$container = option.container as HTMLDivElement
    }
    else {
      this.$container = query(option.container) as HTMLDivElement
      errorHandle(this.$container, `No container element found by ${option.container}`)
    }

    errorHandle(supportsFlex(), 'The current browser does not support flex layout')

    const type = this.$container.tagName.toLowerCase()
    errorHandle(type === 'div', `Unsupported container element type, only support 'div' but got '${type}'`)

    errorHandle(
      constructor.instances.every(ins => ins.template.$container !== this.$container),
      'Cannot mount multiple instances on the same dom element',
    )

    this.query = this.query.bind(this)
    ownContainer(art, this.$container, captureTemplate(this.$container))
    this.$container.dataset.artId = String(art.id)
    this.init()
  }

  static get html(): string {
    return html
  }

  query<T extends Element = Element>(className: string): T | null {
    return query(className, this.$container) as T | null
  }

  init(): void {
    const { option } = this.art

    if (!option.useSSR) {
      this.$container.innerHTML = Template.html
    }

    bindNodes(this)

    if (option.proxy) {
      const video = option.proxy.call(this.art, this.art)
      assertProxy(video)
      replaceElement(video, this.$video)
      video.className = 'art-video'
      this.$video = video
    }

    if (option.backdrop) {
      addClass(this.$player, 'art-backdrop')
    }

    if (isMobile) {
      addClass(this.$player, 'art-mobile')
    }
  }

  destroy(removeHtml: boolean): void {
    if (removeHtml) {
      this.$container.innerHTML = ''
    }
    else {
      addClass(this.$player, 'art-destroy')
    }
  }
}

function assertProxy(video: unknown): asserts video is HTMLVideoElement | HTMLCanvasElement {
  errorHandle(
    video instanceof HTMLVideoElement || video instanceof HTMLCanvasElement,
    'Function \'option.proxy\' needs to return \'HTMLVideoElement\' or \'HTMLCanvasElement\'',
  )
}

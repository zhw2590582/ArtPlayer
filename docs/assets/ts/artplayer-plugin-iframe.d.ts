interface Message {
  type: string
  data: any
  id?: number
}

declare class ArtplayerPluginIframe {
  constructor(option: { iframe: HTMLIFrameElement, url: string })

  static iframe: boolean
  static postMessage(message: Message): void
  static onMessage(event: MessageEvent & { data: Message }): void
  static inject(): void

  readonly promises: Record<number, { resove: (...args: any[]) => any, reject: (...args: any[]) => any }>
  readonly injected: boolean
  readonly destroyed: boolean
  readonly $iframe: HTMLIFrameElement
  readonly url: string
  readonly messageCallback: (...args: any[]) => any

  onMessage(event: MessageEvent & { data: Message }): void
  postMessage(message: Message): Promise<any>
  commit<T extends (...args: any[]) => any>(callback: T): Promise<ReturnType<T>>
  message(callback: (...args: any[]) => any): void
  destroy(): void
}

export default ArtplayerPluginIframe

export = artplayerPluginIframe
export as namespace artplayerPluginIframe;

// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace ArtplayerToolIframeDefinitions {
  export interface Option {
    iframe: HTMLIFrameElement
    url: string
  }
  /** Historical open envelope. data remains required in the default class API. */
  export interface Message<T = any> {
    type: string
    data: T
    id?: number
  }
  export interface Callbacks {
    resove: (...args: any[]) => any
    reject: (...args: any[]) => any
  }
  /** Public notifications omit the request id and all private session metadata. */
  export interface Notification<T = unknown> {
    type: string
    data: T
  }
  export type MessageCallback = (this: ArtplayerToolIframe, message: Notification) => void
  /** Actual outgoing calls allow an omitted data field. Custom message types remain valid. */
  export interface OutboundMessage<T = unknown> {
    type: string
    data?: T
    id?: number
  }
  /** Known built-in envelopes; use Message/OutboundMessage for application protocols. */
  export type ProtocolMessage<T = unknown> = {
    type: 'inject'
    data?: undefined
    id?: number
  } | {
    type: 'commit'
    data: string
    id: number
  } | {
    type: 'response'
    data: T
    id: number
  } | {
    type: 'error'
    data: unknown
    id: number
  }
  export type Resolve<T> = (value: T | PromiseLike<T>) => void
  export type ResolverCallback<T> = (resolve: Resolve<T>) => void
  /** Opt-in view. Response T is supplied by the application's protocol, not validated at runtime. */
  export interface RuntimeInstance extends Omit<ArtplayerToolIframe, 'messageCallback' | 'postMessage' | 'message'> {
    messageCallback: MessageCallback | null
    postMessage: <T = unknown>(message: OutboundMessage) => Promise<T>
    message: (callback: MessageCallback) => void
  }
  /** For the existing serialized resolve(...) protocol; callback bodies must use that exact name. */
  export interface ResolverInstance extends Omit<RuntimeInstance, 'commit'> {
    commit: <T>(callback: ResolverCallback<T>) => Promise<T>
  }
  /** Opt-in static async/optional-data view. There is no runtime self-default property. */
  export interface RuntimeConstructor {
    new (option: Option): RuntimeInstance
    readonly prototype: RuntimeInstance
    readonly iframe: boolean
    postMessage: (message: OutboundMessage) => void
    onMessage: (event: MessageEvent<OutboundMessage>) => Promise<void>
    inject: () => void
  }
  export class ArtplayerToolIframe {
    constructor(option: Option)
    static iframe: boolean
    static postMessage(message: Message): void
    static onMessage(event: MessageEvent & {
      data: Message
    }): void
    static inject(): void
    readonly promises: Record<number, Callbacks>
    readonly injected: boolean
    readonly destroyed: boolean
    readonly $iframe: HTMLIFrameElement
    readonly url: string
    readonly messageCallback: (...args: any[]) => any
    onMessage(event: MessageEvent & {
      data: Message
    }): void
    postMessage(message: Message): Promise<any>
    commit<T extends (...args: any[]) => any>(callback: T): Promise<ReturnType<T>>
    message(callback: (...args: any[]) => any): void
    destroy(): void
  }
}
declare const ArtplayerToolIframe: typeof ArtplayerToolIframeDefinitions.ArtplayerToolIframe
type ArtplayerToolIframe = ArtplayerToolIframeDefinitions.ArtplayerToolIframe
declare namespace ArtplayerToolIframe {
  export type Option = ArtplayerToolIframeDefinitions.Option
  export type Message<T = any> = ArtplayerToolIframeDefinitions.Message<T>
  export type Callbacks = ArtplayerToolIframeDefinitions.Callbacks
  export type Notification<T = unknown> = ArtplayerToolIframeDefinitions.Notification<T>
  export type MessageCallback = ArtplayerToolIframeDefinitions.MessageCallback
  export type OutboundMessage<T = unknown> = ArtplayerToolIframeDefinitions.OutboundMessage<T>
  export type ProtocolMessage<T = unknown> = ArtplayerToolIframeDefinitions.ProtocolMessage<T>
  export type Resolve<T> = ArtplayerToolIframeDefinitions.Resolve<T>
  export type ResolverCallback<T> = ArtplayerToolIframeDefinitions.ResolverCallback<T>
  export type RuntimeInstance = ArtplayerToolIframeDefinitions.RuntimeInstance
  export type ResolverInstance = ArtplayerToolIframeDefinitions.ResolverInstance
  export type RuntimeConstructor = ArtplayerToolIframeDefinitions.RuntimeConstructor
}
export = ArtplayerToolIframe
export as namespace ArtplayerToolIframe;

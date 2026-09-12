/* eslint-disable ts/no-redeclare -- Constructor, instance and named-type namespace intentionally merge. */
import type * as Definition from './artplayer-tool-iframe.js'

declare const ArtplayerToolIframe: typeof Definition.default
type ArtplayerToolIframe = Definition.default

declare namespace ArtplayerToolIframe {
  type Option = Definition.Option
  type Message<T = any> = Definition.Message<T>
  type Callbacks = Definition.Callbacks
  type Notification<T = unknown> = Definition.Notification<T>
  type MessageCallback = Definition.MessageCallback
  type OutboundMessage<T = unknown> = Definition.OutboundMessage<T>
  type ProtocolMessage<T = unknown> = Definition.ProtocolMessage<T>
  type Resolve<T> = Definition.Resolve<T>
  type ResolverCallback<T> = Definition.ResolverCallback<T>
  type RuntimeInstance = Definition.RuntimeInstance
  type ResolverInstance = Definition.ResolverInstance
  type RuntimeConstructor = Definition.RuntimeConstructor
}

export = ArtplayerToolIframe

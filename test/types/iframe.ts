import type { Callbacks, Message, MessageCallback, Notification, Option, OutboundMessage, ProtocolMessage, Resolve, ResolverInstance, RuntimeConstructor } from 'artplayer-tool-iframe'
import Iframe from 'artplayer-tool-iframe'
import Legacy from 'artplayer-tool-iframe/legacy'

declare const frame: HTMLIFrameElement
const option: Option = { iframe: frame, url: '/iframe.html' }
const tool = new Iframe(option)
const old = new Legacy(option)
const Runtime = Iframe as RuntimeConstructor
const runtime = Runtime
const precise = new Runtime(option)
runtime.postMessage({ type: 'custom' })
const asyncReceiver: Promise<void> = runtime.onMessage(new MessageEvent('message', { data: { type: 'custom' } }))
const unknownReply: Promise<unknown> = precise.postMessage({ type: 'custom' })
const numeric: Promise<number> = precise.postMessage<number>({ type: 'query', data: 2 })
const callback: MessageCallback = function (message) {
  const source: HTMLIFrameElement = this.$iframe
  const body: unknown = message.data
  void [source, body]
}
precise.message(callback)
precise.messageCallback = null
const resolver = tool as ResolverInstance
const resolved: Promise<number> = resolver.commit<number>((resolve) => {
  resolve(3)
})
const resolve: Resolve<number> = value => void value
resolve(Promise.resolve(1))
const notification: Notification<number> = { type: 'custom', data: 3 }
const packet: Message<number> = { type: 'custom', data: 3 }
const outgoing: OutboundMessage = { type: 'arbitrary' }
const callbacks: Callbacks = { resove() {}, reject() {} }
function receive(packet: ProtocolMessage<number>) {
  if (packet.type === 'response') {
    const value: number = packet.data
    return value
  }
  if (packet.type === 'error' && typeof packet.data === 'string')
    return packet.data.toUpperCase()
  return packet.id
}
receive({ type: 'inject' })
receive({ type: 'commit', data: 'return 1', id: 1 })
// @ts-expect-error Constructor options are still required.
void new Iframe()
// @ts-expect-error A string selector is not an iframe element.
void new Iframe({ iframe: '#frame', url: '/frame' })
// @ts-expect-error URL is text.
void new Iframe({ iframe: frame, url: 1 })
// @ts-expect-error Default data remains required for old extracted types.
tool.postMessage({ type: 'custom' })
// @ts-expect-error Message types are strings.
precise.postMessage({ type: 1 })
// @ts-expect-error Public request ids remain numeric.
runtime.postMessage({ type: 'custom', id: '1' })
// @ts-expect-error Public flags remain readonly in the default API.
tool.injected = true
// @ts-expect-error The legacy static receiver return is still void.
const notAsync: Promise<void> = Iframe.onMessage(new MessageEvent('message', { data: packet }))
// @ts-expect-error No self-default property exists on the real constructor.
Iframe.default(option)
// @ts-expect-error Runtime iframe is a readonly getter.
runtime.iframe = true
// @ts-expect-error Public notifications do not contain a request id.
const wrongNotification: Notification = { type: 'custom', data: 1, id: 2 }
receive({ type: 'error', data: 1, id: 1 })
// @ts-expect-error Error packets still require a numeric request id.
receive({ type: 'error', data: 1, id: '1' })
// @ts-expect-error Known response data follows its protocol parameter.
receive({ type: 'response', data: '1', id: 1 })
// @ts-expect-error Typed resolver rejects incompatible values.
resolver.commit<number>(resolve => resolve('3'))
// @ts-expect-error Historical misspelling is preserved rather than silently renamed.
callbacks.resolve(1)
// @ts-expect-error Runtime notifications have unknown data until the application narrows it.
precise.message(message => message.data.toFixed())
void [old, asyncReceiver, unknownReply, numeric, resolved, notification, outgoing, notAsync, wrongNotification]

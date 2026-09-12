import Iframe from 'artplayer-tool-iframe'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
interface OldMessage { type: string, data: any, id?: number }
type ExactConstructor = Assert<Equal<ConstructorParameters<typeof Iframe>, [option: { iframe: HTMLIFrameElement, url: string }]>>
type ExactMessage = Assert<Equal<Parameters<Iframe['postMessage']>, [message: OldMessage]>>
type ExactStaticReceiver = Assert<Equal<ReturnType<typeof Iframe.onMessage>, void>>
type ExactCallbacks = Assert<Equal<Iframe['promises'], Record<number, { resove: (...args: any[]) => any, reject: (...args: any[]) => any }>>>
type ExactCallback = Assert<Equal<Iframe['messageCallback'], (...args: any[]) => any>>

declare const frame: HTMLIFrameElement
const tool: Iframe = new Iframe({ iframe: frame, url: '/iframe.html' })
const message: OldMessage = { type: 'custom', data: { enabled: true }, id: 1 }
Iframe.postMessage(message)
Iframe.inject()
const staticResult: void = Iframe.onMessage(new MessageEvent('message', { data: message }))
tool.onMessage(new MessageEvent('message', { data: message }))
const custom: Promise<any> = tool.postMessage(message)
const sync: Promise<number> = tool.commit(() => {
  return 1
})
const nested: Promise<Promise<number>> = tool.commit(() => {
  return Promise.resolve(1)
})
const resolver: Promise<void> = tool.commit((resolve: (value: number) => void) => {
  resolve(1)
})
tool.message((value, additional) => [value, additional])
tool.promises[1] = { resove: (...args: any[]) => args, reject: (...args: any[]) => args }
tool.promises[1].resove(1, 2)
tool.promises[1].reject(new Error('old'))
const replacement: typeof Iframe.onMessage = () => {}
const enabled: boolean = Iframe.iframe
tool.destroy()
void [staticResult, custom, sync, nested, resolver, replacement, enabled]
export type { ExactCallback, ExactCallbacks, ExactConstructor, ExactMessage, ExactStaticReceiver }

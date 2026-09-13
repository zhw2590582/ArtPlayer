import type { Factory, Option, Result, RuntimeFactory } from 'artplayer-proxy-canvas'
import type { MediaCanvas, RuntimeFactory as RuntimeEntry, Factory as RuntimeEntryFactory, Option as RuntimeOption, Result as RuntimeResult } from 'artplayer-proxy-canvas/runtime'
import Artplayer from 'artplayer'
import canvas from 'artplayer-proxy-canvas'
import * as namespace from 'artplayer-proxy-canvas'
import legacy from 'artplayer-proxy-canvas/legacy'
import runtime from 'artplayer-proxy-canvas/runtime'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type OptionalInput = Assert<Equal<Parameters<typeof canvas>, [option?: Option]>>
type ExactResult = Assert<Equal<ReturnType<ReturnType<typeof canvas>>, HTMLCanvasElement>>
type HistoricalFactory = (option?: (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => void) => (art: Artplayer) => HTMLCanvasElement
type ExactFactory = Assert<Equal<typeof canvas, HistoricalFactory>>
type RuntimeEntries = Assert<Equal<[RuntimeEntryFactory, RuntimeOption, RuntimeResult, RuntimeEntry], [Factory, Option, Result, RuntimeFactory]>>
type ExactRuntime = Assert<Equal<typeof runtime, RuntimeFactory>>

const replacement: HistoricalFactory = (_option?: Option) => (_art: Artplayer) => document.createElement('canvas')
const toOld: HistoricalFactory = canvas
const fromOld: typeof canvas = replacement
const namedFactory: Factory = replacement
const namespaceFactory: HistoricalFactory = namespace.default
const legacyFactory: typeof legacy = replacement

const option: Option = (context, video) => {
  context.drawImage(video, 0, 0)
  const source: HTMLVideoElement = video
  const ctx: CanvasRenderingContext2D = context
  void [source, ctx]
}
const art = new Artplayer({ container: '#player', url: 'video.mp4', proxy: canvas(option) })
canvas()
canvas(undefined)
runtime.default(option)
runtime.default.default()
legacy()
declare const optional: Option | undefined
canvas(optional)
const missing: Parameters<typeof canvas>[0] = undefined
const factory: Factory = canvas
const registration: (art: Artplayer) => HTMLCanvasElement = factory()
const result: Result = registration(art)
const originalResult: Result = document.createElement('canvas')
const media = result as MediaCanvas
const play: Promise<void> = media.play()
media.pause()
media.src = 'replacement.mp4'
const context: CanvasRenderingContext2D | null = media.getContext('2d')
const listen: HTMLCanvasElement['addEventListener'] = media.addEventListener
const width: number = media.width
// @ts-expect-error Callback remains a function.
canvas(42)
// @ts-expect-error Strings are not typed callbacks.
canvas('callback')
// @ts-expect-error Historical runtime tolerates null, but published types never accepted it.
canvas(null)
// @ts-expect-error The callback receives a 2D context.
canvas((ctx: WebGLRenderingContext) => void ctx)
// @ts-expect-error The callback receives video, not canvas.
canvas((ctx: CanvasRenderingContext2D, video: HTMLCanvasElement) => void [ctx, video])
// @ts-expect-error Canvas return must not be relabeled as a native video.
const video: HTMLVideoElement = result
// @ts-expect-error Registration remains synchronous.
const promise: Promise<HTMLCanvasElement> = canvas()(art)
// @ts-expect-error 2D contexts have no media play method.
media.getContext('2d')?.play()
// @ts-expect-error Native Canvas dimensions remain numeric.
media.width = '320'
// @ts-expect-error Historical root factory has no required or exposed self default member.
canvas.default()
// @ts-expect-error Legacy factory retains the same plain factory shape.
legacy.default()
// @ts-expect-error A precise runtime replacement must provide its self identity.
const missingAlias: RuntimeFactory = replacement
// @ts-expect-error Self default identity is readonly in precise declarations.
runtime.default = runtime
// @ts-expect-error Registration requires a host.
canvas()()
void [toOld, fromOld, namedFactory, namespaceFactory, legacyFactory, missing, originalResult, play, context, listen, width, video, promise, missingAlias]
export type { ExactFactory, ExactResult, ExactRuntime, OptionalInput, RuntimeEntries }

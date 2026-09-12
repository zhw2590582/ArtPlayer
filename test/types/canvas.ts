import type { Factory, MediaCanvas, Option, Result } from 'artplayer-proxy-canvas'
import Artplayer from 'artplayer'
import canvas from 'artplayer-proxy-canvas'
import legacy from 'artplayer-proxy-canvas/legacy'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type OptionalInput = Assert<Equal<Parameters<typeof canvas>, [option?: Option]>>
type ExactResult = Assert<Equal<ReturnType<ReturnType<typeof canvas>>, HTMLCanvasElement>>

const option: Option = (context, video) => {
  context.drawImage(video, 0, 0)
  const source: HTMLVideoElement = video
  const ctx: CanvasRenderingContext2D = context
  void [source, ctx]
}
const art = new Artplayer({ container: '#player', url: 'video.mp4', proxy: canvas(option) })
canvas()
canvas(undefined)
canvas.default(option)
legacy.default()
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
// @ts-expect-error Self default identity is readonly in declarations.
canvas.default = legacy
// @ts-expect-error Registration requires a host.
canvas()()
void [missing, originalResult, play, context, listen, width, video, promise]
export type { ExactResult, OptionalInput }

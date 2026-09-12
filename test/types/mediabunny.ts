import type { HlsState, MediaBunnyCanvas, MediaBunnyPlayer, MediaBunnyShim, Option, Result, SyntheticFrameCallback } from 'artplayer-proxy-mediabunny'
import Artplayer from 'artplayer'
import factory from 'artplayer-proxy-mediabunny'
import legacy from 'artplayer-proxy-mediabunny/legacy'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type ExactFactory = Assert<Equal<typeof factory, (option?: Option) => (art: Artplayer) => HTMLCanvasElement>>
type ExactParameters = Assert<Equal<Parameters<typeof factory>, [option?: Option]>>
type ExactResult = Assert<Equal<ReturnType<ReturnType<typeof factory>>, HTMLCanvasElement>>
type ExactResultAlias = Assert<Equal<Result, HTMLCanvasElement>>
type NativeAttributes = Assert<Equal<MediaBunnyCanvas['setAttribute'], HTMLCanvasElement['setAttribute']>>
type NativeEvents = Assert<Equal<MediaBunnyCanvas['addEventListener'], HTMLCanvasElement['addEventListener']>>

const art: MediaBunnyPlayer = new Artplayer({ container: '#player', url: 'movie.mp4', proxy: factory() })
const replacement: typeof factory = (_option?: Option) => (_art: Artplayer) => document.createElement('canvas')
const canvas: Result = factory(undefined)(art)
const fromLegacy: typeof factory = legacy
const toLegacy: typeof legacy = factory
declare const shim: MediaBunnyShim
const playing: Promise<void> = shim.play()
const paused: void = shim.pause()
const loading: void = shim.load()
const state: Promise<HlsState | null> = shim.getM3u8State()
const source: unknown = shim.currentSrc
shim.src = new Blob([])
shim.currentTime = 2
shim.volume = 0.5
shim.muted = false
const callback: SyntheticFrameCallback = (now, metadata) => {
  const values: number[] = [now, metadata.presentationTime, metadata.expectedDisplayTime, metadata.width, metadata.height, metadata.mediaTime, metadata.presentedFrames, metadata.processingDuration, metadata.captureTime, metadata.receiveTime, metadata.rtpTimestamp]
  void values
}
shim.cancelVideoFrameCallback(shim.requestVideoFrameCallback(callback))
const maybe: 'maybe' = shim.canPlayType('video/mp4')
art.mediabunny?.pause()
delete art.mediabunny
declare const extended: MediaBunnyCanvas
const native: HTMLCanvasElement = extended
extended.play()
extended.addEventListener('click', event => event.clientX)
extended.setAttribute('src', 'native-attribute-only')
state.then((value) => {
  if (!value)
    return
  const height: number | undefined = value.currentLevel?.height
  const language: string | undefined = value.currentAudio?.language
  const track: unknown = value.levels[0]?.track
  // @ts-expect-error SDK internals require explicit narrowing, not ambient SDK declarations.
  track.decode()
  void [height, language]
})
// @ts-expect-error The default factory does not promise shim members on a replacement canvas.
canvas.play()
// @ts-expect-error The default result is the historical exact DOM Canvas.
const requiredShim: MediaBunnyCanvas = canvas
// @ts-expect-error Alias does not exist before initialization or after destroy.
art.mediabunny.play()
// @ts-expect-error Factory options are optional but not null.
factory(null)
// @ts-expect-error Volume remains numeric.
factory({ volume: '0.7' })
// @ts-expect-error Historical Option does not widen arbitrary SDK objects.
factory({ source: {} })
// @ts-expect-error Option stream remains byte-oriented.
factory({ source: new ReadableStream<string>() })
// @ts-expect-error Unknown options remain errors.
factory({ arbitrary: true })
// @ts-expect-error The initializer still requires its host.
factory()()
// @ts-expect-error Synchronous registration remains synchronous.
const promise: Promise<Result> = factory()(art)
// @ts-expect-error Computed duration has no writable setter.
shim.duration = 10
// @ts-expect-error Synchronous load does not falsely promise awaitable completion.
const loaded: Promise<void> = shim.load()
// @ts-expect-error Canvas retains its native string attribute API.
extended.setAttribute('src', new Blob([]))
// @ts-expect-error Manual/auto are the only track modes.
const mode: NonNullable<HlsState>['videoMode'] = 'adaptive'
void [replacement, fromLegacy, toLegacy, playing, paused, loading, state, source, maybe, native, requiredShim, promise, loaded, mode]
export type { ExactFactory, ExactParameters, ExactResult, ExactResultAlias, NativeAttributes, NativeEvents }

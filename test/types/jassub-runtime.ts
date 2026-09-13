import type Artplayer from 'artplayer'
import type { AssEvent, AssStyle, RuntimeFactory, RuntimeInstance, RuntimeOption, RuntimeResult } from 'artplayer-plugin-jassub/runtime'
import runtime from 'artplayer-plugin-jassub/runtime'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
export type HostCheck = Assert<Equal<Parameters<ReturnType<RuntimeFactory>>, [art: Artplayer]>>

declare const art: Artplayer
declare const canvas: HTMLCanvasElement
const option: RuntimeOption = { canvas, fonts: ['/font.woff2', new Uint8Array([0])], availableFonts: { fallback: new Uint8Array([0]) }, onDemandRender: false }
const factory: RuntimeFactory = runtime
const result: RuntimeResult = runtime(option)(art)
const replacement: typeof runtime = (_option?: RuntimeOption) => (_art: Artplayer) => result
const defaults: RuntimeResult = runtime()(art)
runtime(undefined)(art)
runtime({ video: null, canvas })(art)
const instance: RuntimeInstance = result.instance
const target: EventTarget = instance
const resize: void = instance.resize(640, 360, 0, 0, true)
const video: void = instance.setVideo(art.video)
const destroyed: void = instance.destroy()
const error: Error = instance.destroy(new Error('test'))
const errorOrEmpty: Error | '' = instance.destroy('failure')
const sent: Promise<void> = instance.sendMessage('custom', { payload: new Uint8Array([1]) }, [])
instance.setCurrentTime(false, 10, 2)
instance.setTrackByUrl('/sub.ass')
instance.setTrack('[Script Info]')
instance.freeTrack()
instance.setIsPaused(true)
instance.setRate(2)
instance.createEvent({ Start: 1000, Duration: 2000, Style: 0, Text: 'Subtitle' })
instance.setEvent({ Text: 'Replacement' }, 0)
instance.removeEvent(0)
instance.createStyle({ Name: 'Default', FontSize: 24 })
instance.setStyle({ Bold: 1 }, 0)
instance.removeStyle(0)
instance.styleOverride({ FontSize: 30 })
instance.disableStyleOverride()
instance.addFont(new Uint8Array([0]))
instance.setDefaultFont('fallback')
instance.runBenchmark()
instance.getEvents((failure, events) => {
  const caught: Error | Event | null = failure
  const values: AssEvent[] | undefined = events
  if (events) {
    for (const event of events) {
      const style: number = event.Style
      const start: number = event.Start
      void [style, start]
    }
  }
  void [caught, values]
})
instance.getStyles((_failure, styles) => {
  const values: AssStyle[] | undefined = styles
  void values
})
instance.addEventListener('ready', function (event) {
  function acceptsInstance(_instance: RuntimeInstance) {}
  acceptsInstance(this)
  const detail: null = event.detail
  void detail
})
instance.addEventListener('error', (event) => {
  const message: string = event.message
  void message
})
instance.addEventListener('custom', { handleEvent(event) {
  const type: string = event.type
  void type
} })
// @ts-expect-error Runtime URL fields are optional strings, not numbers.
runtime({ workerUrl: 42 })
// @ts-expect-error Accurate entry does not silently accept unknown options.
runtime({ typoOption: true })
// @ts-expect-error Resize starts with width; force is the fifth parameter.
instance.resize(true)
// @ts-expect-error Actual destroy is synchronous.
const asyncDestroy: Promise<void> = instance.destroy()
// @ts-expect-error Actual setVideo is synchronous.
const asyncVideo: Promise<void> = instance.setVideo(art.video)
// @ts-expect-error Actual resize is synchronous.
const asyncResize: Promise<void> = instance.resize()
// @ts-expect-error Registration is synchronous.
runtime()(art).then(() => {})
// @ts-expect-error sendMessage waits for initialization and returns a Promise.
const syncMessage: void = instance.sendMessage('custom')
// @ts-expect-error Style is the numeric libass index.
instance.createEvent({ Style: 'Default' })
// @ts-expect-error Worker responses do not contain _index.
const index: number = ({} as AssEvent)._index
// @ts-expect-error Callback errors may omit the event list.
instance.getEvents((_error, events) => { const required: AssEvent[] = events; void required }) // eslint-disable-line style/max-statements-per-line -- Keep this rejected callback on one diagnostic line.
// @ts-expect-error Font data must be a URL or bytes.
instance.addFont(1)
// @ts-expect-error Unknown instance methods are not hidden by an any index.
instance.nonexistentMethod()
// @ts-expect-error Only two blend modes are supported.
runtime({ blendMode: 'gpu' })
void [asyncDestroy, asyncVideo, asyncResize, defaults, destroyed, error, errorOrEmpty, factory, index, replacement, resize, sent, syncMessage, target, video]

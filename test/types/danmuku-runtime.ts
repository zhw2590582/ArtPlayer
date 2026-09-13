import type { Danmu, EventMap, Icons, Input, Item, NormalizedDanmu, NormalizedOption, Owner, Point, RuntimeFactory, RuntimeOption, RuntimeResult, Slider } from 'artplayer-plugin-danmuku/runtime'
import Artplayer from 'artplayer'
import runtime from 'artplayer-plugin-danmuku/runtime'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type FactoryArguments = Assert<Equal<Parameters<typeof runtime>, [option: RuntimeOption]>>
type FactoryReturns = Assert<Equal<ReturnType<ReturnType<typeof runtime>>, RuntimeResult>>
type EmitReturns = Assert<Equal<ReturnType<RuntimeResult['emit']>, Promise<Owner>>>
type LoadReturns = Assert<Equal<ReturnType<RuntimeResult['load']>, Promise<Owner>>>
type CommandReturns = Assert<Equal<ReturnType<RuntimeResult['config']>, Owner>>
type OwnerHasNoFacadeKeys = Assert<Equal<Extract<'name' | 'mount', keyof Owner>, never>>
type VisiblePayload = Assert<Equal<EventMap['artplayerPluginDanmuku:visible'], [item: Item]>>
type LoadedPayload = Assert<Equal<EventMap['artplayerPluginDanmuku:loaded'], [queue: Item[]]>>

function expectOption(_option: NormalizedOption) {}
const row: Danmu = { text: 'extended input', id: 'message-1', author: { name: 'test' }, style: { fontWeight: 'bold' } }
const input: Input = () => [row]
const asyncInput: Input = async () => [row]
const point: Point = [10, 5]
const margin: Slider<[number | string, number | string]> = { steps: [{ name: 'half', value: [10, '50%'], hide: true, show: false }] }
const options: RuntimeOption = {
  danmuku: input,
  points: [point],
  MARGIN: margin,
  SPEED: { steps: [{ name: 'fast', value: 2.5, hide: true }] },
  filter(danmu) {
    expectOption(this)
    const normalized: NormalizedDanmu = danmu
    const time: number = danmu.time
    const extension: unknown = danmu.author
    // @ts-expect-error Queue allocation has not run when filter is invoked.
    const state: string = danmu.$state
    void [normalized, time, extension, state]
    return true
  },
  async beforeEmit(danmu) {
    expectOption(this)
    const text: string = danmu.text
    void text
    return true
  },
  async beforeVisible(item) {
    expectOption(this)
    const state: 'wait' | 'ready' | 'emit' | 'stop' = item.$state
    const index: number = item.$index
    const node: HTMLDivElement | null = item.$ref
    const extra: unknown = item.author
    void [state, index, node, extra]
    return true
  },
}
const art = new Artplayer({ container: '#player', url: '/video.mp4', plugins: [runtime(options)] })
const factory: RuntimeFactory = runtime
const result = runtime({})(art)
const registered: 'artplayerPluginDanmuku' = result.name
const icon: string = runtime.icons.$check_on
const icons: Icons = runtime.icons
runtime.icons = icons
runtime.icons.$on = '<svg></svg>'
const promise: Promise<Owner> = result.emit(row)
const loading: Promise<Owner> = result.load(asyncInput)
const replacing: Promise<Owner> = result.load()
const owner: Owner = result.config({ opacity: 0.5 })
const stopped: Owner = owner.stop().start().suspend().continue().reset()
const configured: NormalizedOption = result.option
result.option.visible = false
result.mount(document.createElement('div'))
result.mount('#danmuku-mount')
const loadedPayload: EventMap['artplayerPluginDanmuku:loaded'] = [owner.queue]
const pointsPayload: EventMap['artplayerPluginDanmuku:points'] = [[point]]
const failedPayload: EventMap['artplayerPluginDanmuku:error'] = [new Error('failed')]

async function consume() {
  const emitted = await result.emit({ text: 'await owner' })
  const rows: Item[] = emitted.queue
  const next: Owner = emitted.hide().show()
  // @ts-expect-error The resolved owner does not expose the facade name.
  void emitted.name
  // @ts-expect-error The resolved owner does not own setting.mount.
  emitted.mount('#mount')
  return [rows, next]
}
// @ts-expect-error The factory still requires its options object.
runtime()
// @ts-expect-error Undefined is not a valid options object.
runtime(undefined)
// @ts-expect-error An emitted row requires text.
result.emit({ id: 'missing-text' })
// @ts-expect-error The runtime heatmap uses mutable pairs, not historical object points.
runtime({ points: [{ time: 1, value: 2 }] })
// @ts-expect-error Margin sliders carry pairs rather than scalar numbers.
runtime({ MARGIN: { steps: [{ value: 10 }] } })
// @ts-expect-error A live mount needs an explicit destination.
result.mount()
// @ts-expect-error Facade option is a getter, although the returned options object is mutable.
result.option = configured
// @ts-expect-error Facade isHide is a getter.
result.isHide = true
// @ts-expect-error Facade isStop is a getter.
result.isStop = true
// @ts-expect-error emit returns a Promise; synchronous chaining is not available.
result.emit(row).hide()
// @ts-expect-error The factory has icons but no default self-reference.
void runtime.default

export type { CommandReturns, EmitReturns, FactoryArguments, FactoryReturns, LoadedPayload, LoadReturns, OwnerHasNoFacadeKeys, VisiblePayload }
void [factory, registered, icon, promise, loading, replacing, stopped, loadedPayload, pointsPayload, failedPayload, consume]

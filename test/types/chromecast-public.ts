import type { Chromecast, ConnectionState, Factory, Option, Result, RuntimeFactory, RuntimeOption, RuntimeResult } from 'artplayer-plugin-chromecast'
import type { RuntimeFactory as EntryFactory, RuntimeOption as EntryOption, RuntimeResult as EntryResult } from 'artplayer-plugin-chromecast/runtime'
import Artplayer from 'artplayer'
import chromecast from 'artplayer-plugin-chromecast'
import * as namespace from 'artplayer-plugin-chromecast'
import legacy from 'artplayer-plugin-chromecast/legacy'
import runtime from 'artplayer-plugin-chromecast/runtime'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
interface OldOption { url?: string, sdk?: string, icon?: string, mimeType?: string }
interface OldResult { name: 'artplayerPluginChromecast' }
type OldFactory = (option: OldOption) => (art: Artplayer) => OldResult
type RootFactory = Assert<Equal<typeof chromecast, OldFactory>>
type RootArguments = Assert<Equal<Parameters<typeof chromecast>, [option: OldOption]>>
type RootResult = Assert<Equal<ReturnType<ReturnType<typeof chromecast>>, OldResult>>
type RootNames = Assert<Equal<[Option, Result, Chromecast], [OldOption, OldResult, OldResult]>>
type RuntimeArguments = Assert<Equal<Parameters<typeof runtime>, [option: RuntimeOption]>>
type RuntimeReturns = Assert<Equal<ReturnType<ReturnType<typeof runtime>>, Promise<RuntimeResult>>>
type RuntimeNames = Assert<Equal<[EntryFactory, EntryOption, EntryResult], [RuntimeFactory, RuntimeOption, RuntimeResult]>>

const replacement: OldFactory = (_option: OldOption) => (_art: Artplayer) => ({ name: 'artplayerPluginChromecast' })
const toOld: OldFactory = chromecast
const fromOld: typeof chromecast = replacement
const named: Factory = replacement
const fromNamespace: OldFactory = namespace.default
const oldEntry: typeof legacy = replacement
function acceptOptions(_option: RuntimeOption) {}
const option: RuntimeOption = {
  url: '/video.mp4',
  onStateChange(state) {
    acceptOptions(this)
    const value: ConnectionState = state
    void value
  },
  onCastAvailable(available) {
    const value: boolean = available
    void value
  },
  onCastStart() { acceptOptions(this) },
  onError(error) {
    const value: unknown = error
    void value
  },
}
const art = new Artplayer({ container: '#player', url: '/video.mp4', plugins: [chromecast({}), runtime(option), legacy({})] })
const historic: 'artplayerPluginChromecast' = chromecast({})(art).name
const promise: Promise<RuntimeResult> = runtime(option)(art)
runtime.default = runtime
runtime.default.default({})
async function consume() {
  const result = await runtime({})(art)
  const state: string | null = result.getCastState()
  const casting: boolean = result.isCasting()
  const name: 'artplayerPluginChromecast' = result.name
  return [state, casting, name]
}
// @ts-expect-error Historical required argument is retained.
chromecast()
// @ts-expect-error Undefined is not the required options object.
chromecast(undefined)
// @ts-expect-error Runtime also requires an options object.
runtime()
// @ts-expect-error No callback fields are silently added to root inference.
chromecast({ onCastStart() {} })
// @ts-expect-error URL remains text.
runtime({ url: 4 })
// @ts-expect-error SDK location remains text.
runtime({ sdk: false })
// @ts-expect-error Icon remains HTML text.
runtime({ icon: document.createElement('i') })
// @ts-expect-error MIME remains text.
runtime({ mimeType: 3 })
// @ts-expect-error Connection state is normalized text, not a number.
runtime({ onStateChange: (_state: number) => {} })
// @ts-expect-error Availability is boolean.
runtime({ onCastAvailable: (_available: string) => {} })
// @ts-expect-error An SDK rejection may be any thrown value.
runtime({ onError: (_error: Error) => {} })
// @ts-expect-error Root remains synchronous for historical type extraction.
const asynchronousRoot: Promise<Result> = chromecast({})(art)
// @ts-expect-error Runtime registration must be awaited.
const synchronousRuntime: RuntimeResult = runtime({})(art)
// @ts-expect-error Historical result only exposed name.
chromecast({})(art).getCastState()
// @ts-expect-error A plain historical replacement need not have a self alias.
chromecast.default({})
// @ts-expect-error The accurate runtime replacement must include its alias and Promise.
const inaccurate: RuntimeFactory = replacement
// @ts-expect-error Raw SDK state starts null and must be handled.
const unknownInitial: string = (null as unknown as RuntimeResult).getCastState()
void [toOld, fromOld, named, fromNamespace, oldEntry, historic, promise, consume, asynchronousRoot, synchronousRuntime, inaccurate, unknownInitial]
export type { RootArguments, RootFactory, RootNames, RootResult, RuntimeArguments, RuntimeNames, RuntimeReturns }

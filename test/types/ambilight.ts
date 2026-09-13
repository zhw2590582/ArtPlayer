import type { Factory, Option, Result, RuntimeFactory } from 'artplayer-plugin-ambilight'
import type { RuntimeFactory as EntryFactory, Option as EntryOption, Result as EntryResult } from 'artplayer-plugin-ambilight/runtime'
import Artplayer from 'artplayer'
import ambilight from 'artplayer-plugin-ambilight'
import legacy from 'artplayer-plugin-ambilight/legacy'
import runtime from 'artplayer-plugin-ambilight/runtime'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
interface PublishedOption {
  blur?: string
  opacity?: number
  frequency?: number
  zIndex?: number
  duration?: number
}
interface PublishedResult {
  name: 'artplayerPluginAmbilight'
  start: () => void
  stop: () => void
}
type PublishedFactory = (option: PublishedOption) => (art: Artplayer) => PublishedResult
type RootFactory = Assert<Equal<typeof ambilight, PublishedFactory>>
type RootArguments = Assert<Equal<Parameters<typeof ambilight>, [option: PublishedOption]>>
type RootResult = Assert<Equal<ReturnType<ReturnType<typeof ambilight>>, PublishedResult>>
type RuntimeArguments = Assert<Equal<Parameters<typeof runtime>, [option?: Option]>>
type RuntimeTypes = Assert<Equal<[EntryOption, EntryResult, EntryFactory], [Option, Result, RuntimeFactory]>>

const replacement: PublishedFactory = (_option: PublishedOption) => (_art: Artplayer) => ({ name: 'artplayerPluginAmbilight', start() {}, stop() {} })
const assignToOld: PublishedFactory = ambilight
const assignFromOld: typeof ambilight = replacement
const option: Option = { blur: '40px', opacity: 0.6, frequency: 10, duration: 0.2, zIndex: 3 }
const art = new Artplayer({ container: '#player', url: 'video.mp4', plugins: [ambilight(option), legacy({}), runtime()] })
runtime(undefined)
runtime.default(option)
runtime.default.default()
declare const optional: Option | undefined
runtime(optional)
const inferred: Parameters<typeof ambilight>[0] = option
const blur: string | undefined = inferred.blur
const factory: Factory = replacement
const result: Result = factory(option)(art)
const name: 'artplayerPluginAmbilight' = result.name
const calls: void[] = [result.start(), result.stop()]
const registration: (art: Artplayer) => Result = runtime()
// @ts-expect-error Published 1.1.0 requires the options argument.
ambilight()
// @ts-expect-error Published 1.1.0 does not permit undefined as its argument.
ambilight(undefined)
// @ts-expect-error Optional input belongs to the accurate runtime entry.
ambilight(optional)
// @ts-expect-error Historical replacement factories must not require a self alias.
ambilight.default(option)
// @ts-expect-error Legacy retains the root required-argument type.
legacy()
// @ts-expect-error Root Parameters retains the required options argument.
const missing: Parameters<typeof ambilight>[0] = undefined
// @ts-expect-error Blur is a CSS string, not a number.
ambilight({ blur: 50 })
// @ts-expect-error Opacity remains numeric.
ambilight({ opacity: '0.5' })
// @ts-expect-error Frequency remains numeric.
ambilight({ frequency: '10' })
// @ts-expect-error Duration remains numeric.
ambilight({ duration: false })
// @ts-expect-error The ignored historical zIndex input still has its declared type.
ambilight({ zIndex: '9' })
// @ts-expect-error Null was never accepted by the public types.
ambilight(null)
// @ts-expect-error Unknown options do not silently enter the contract.
runtime({ speed: 10 })
// @ts-expect-error Methods are synchronous.
const promise: Promise<void> = result.start()
// @ts-expect-error No public plugin destroy method is introduced.
result.destroy()
void [assignToOld, assignFromOld, blur, name, calls, registration, missing, promise]
export type { RootArguments, RootFactory, RootResult, RuntimeArguments, RuntimeTypes }

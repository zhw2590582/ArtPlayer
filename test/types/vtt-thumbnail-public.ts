import type { Factory, Option, Result, RuntimeFactory } from 'artplayer-plugin-vtt-thumbnail'
import type { Factory as EntryFactory, Option as EntryOption, Result as EntryResult, RuntimeFactory as EntryRuntimeFactory } from 'artplayer-plugin-vtt-thumbnail/runtime'
import Artplayer from 'artplayer'
import legacy from 'artplayer-plugin-vtt-thumbnail'
import * as namespace from 'artplayer-plugin-vtt-thumbnail'
import legacyEntry from 'artplayer-plugin-vtt-thumbnail/legacy'
import runtime from 'artplayer-plugin-vtt-thumbnail/runtime'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type ExactOptions = Assert<Equal<Parameters<typeof legacy>, [option: Option]>>
type ExactFactory = Assert<Equal<typeof legacy, Factory>>
type ExactResult = Assert<Equal<ReturnType<ReturnType<typeof legacy>>, Result>>
type ActualResult = Assert<Equal<ReturnType<ReturnType<typeof runtime>>, Promise<Result>>>
type HistoricalFactory = (option: { vtt?: string, style?: Partial<CSSStyleDeclaration> }) => (art: Artplayer) => { name: 'artplayerPluginVttThumbnail' }
type ExactHistoricalFactory = Assert<Equal<typeof legacy, HistoricalFactory>>
type ExactRuntimeFactory = Assert<Equal<typeof runtime, RuntimeFactory>>
type RuntimeEntryTypes = Assert<Equal<[EntryFactory, EntryOption, EntryResult, EntryRuntimeFactory], [Factory, Option, Result, RuntimeFactory]>>

const option: Option = { vtt: '/cues.vtt', style: { opacity: '0.8' } }
const art = new Artplayer({ container: '#player', url: '/video.mp4', plugins: [legacy(option), runtime(option)] })
const old: Result = legacy(option)(art)
const oldReplacement: typeof legacy = (_option: Option) => (_art: Artplayer) => ({ name: 'artplayerPluginVttThumbnail' })
const toOld: HistoricalFactory = legacy
const fromOld: typeof legacy = (_option: Parameters<HistoricalFactory>[0]) => (_art: Artplayer) => ({ name: 'artplayerPluginVttThumbnail' })
const namespaceFactory: HistoricalFactory = namespace.default
const legacyReplacement: typeof legacyEntry = fromOld
legacyEntry(option)
const factory: RuntimeFactory = runtime
const pending: Promise<Result> = factory(option)(art)
const alias: Promise<Result> = factory.default.default(option)(art)
factory.default = runtime
const awaitedName: Promise<'artplayerPluginVttThumbnail'> = pending.then(result => result.name)
// @ts-expect-error Published extraction keeps the option object required.
const absent: Parameters<typeof legacy>[0] = undefined
// @ts-expect-error Root declarations preserve historical synchronous extraction.
const changed: Promise<Result> = old
// @ts-expect-error Runtime entry does not invent a synchronous result field.
void pending.name
// @ts-expect-error Runtime options remain required.
runtime()
// @ts-expect-error Required option object is not undefined.
runtime(undefined)
// @ts-expect-error URL remains a string.
runtime({ vtt: 1 })
// @ts-expect-error CSS width remains a string.
runtime({ style: { width: 80 } })
// @ts-expect-error Unknown options are not silently accepted.
runtime({ unknown: true })
// @ts-expect-error A host is required.
runtime({})()
// @ts-expect-error The runtime entry cannot be replaced with a synchronous registrar.
const wrong: typeof runtime = oldReplacement
// @ts-expect-error The historical root factory has no self default property.
legacy.default({})
// @ts-expect-error The legacy factory has the same pure function shape.
legacyEntry.default({})
void [toOld, fromOld, namespaceFactory, legacyReplacement, alias, awaitedName, absent, changed, wrong]
export type { ActualResult, ExactFactory, ExactHistoricalFactory, ExactOptions, ExactResult, ExactRuntimeFactory, RuntimeEntryTypes }

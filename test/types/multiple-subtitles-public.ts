import type { Factory, LegacyResult, Option, Result, RuntimeFactory, TrackOption } from 'artplayer-plugin-multiple-subtitles'
import Artplayer from 'artplayer'
import legacy from 'artplayer-plugin-multiple-subtitles'
import legacyEntry from 'artplayer-plugin-multiple-subtitles/legacy'
import runtime from 'artplayer-plugin-multiple-subtitles/runtime'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type ExactOptions = Assert<Equal<Parameters<typeof legacy>, [option: Option]>>
type ExactFactory = Assert<Equal<typeof legacy, Factory>>
type ExactResult = Assert<Equal<ReturnType<ReturnType<typeof legacy>>, LegacyResult>>
type ActualResult = Assert<Equal<ReturnType<ReturnType<typeof runtime>>, Promise<Result>>>
type OldTrack = Assert<Equal<TrackOption, { url?: string, name?: string, type?: 'vtt' | 'srt' | 'ass', encoding?: string, onParser?: (...args: object[]) => object }>>

const option: Option = { subtitles: [{ url: '/en.vtt', name: 'en', onParser: (...args) => args }] }
const art = new Artplayer({ container: '#player', url: '/video.mp4', plugins: [legacy(option), runtime(option)] })
const old: LegacyResult = legacy(option)(art)
const replacement: typeof legacy = (_option: Option) => (_art: Artplayer) => ({ name: 'multipleSubtitles' })
legacyEntry(option)
const factory: RuntimeFactory = runtime
const pending: Promise<Result> = factory({})(art)
const alias: Promise<Result> = factory.default.default(option)(art)
factory.default = runtime
pending.then((result) => {
  const returned: void = result.tracks(['en'])
  result.tracks()
  result.reset()
  // @ts-expect-error Selection names are strings.
  result.tracks([1])
  void returned
})
// @ts-expect-error Historical subtitles field remains required.
legacy({})
// @ts-expect-error Published extraction keeps the option object required.
const absent: Parameters<typeof legacy>[0] = undefined
// @ts-expect-error Root declarations preserve historical synchronous extraction.
const changed: Promise<Result> = old
// @ts-expect-error Registration has no synchronous name.
void pending.name
// @ts-expect-error Factory options remain required.
runtime()
// @ts-expect-error Factory options cannot be undefined.
runtime(undefined)
// @ts-expect-error URL remains a string.
runtime({ subtitles: [{ url: 1 }] })
// @ts-expect-error Invalid subtitle format remains rejected.
runtime({ subtitles: [{ type: 'xml' }] })
// @ts-expect-error Unknown options remain rejected.
runtime({ unknown: true })
// @ts-expect-error A host is required.
runtime({})()
// @ts-expect-error Accurate runtime types cannot accept a synchronous registrar.
const wrong: typeof runtime = replacement
void [alias, absent, changed, wrong]
export type { ActualResult, ExactFactory, ExactOptions, ExactResult, OldTrack }

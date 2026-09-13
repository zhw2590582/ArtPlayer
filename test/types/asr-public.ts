import type { AsrPluginInstance, AsrPluginOption, AudioChunk, RuntimeFactory, RuntimeOption, RuntimeResult } from 'artplayer-plugin-asr'
import type { AudioChunk as EntryChunk, RuntimeFactory as EntryFactory, RuntimeOption as EntryOption, RuntimeResult as EntryResult } from 'artplayer-plugin-asr/runtime'
import Artplayer from 'artplayer'
import legacy from 'artplayer-plugin-asr'
import * as namespace from 'artplayer-plugin-asr'
import legacyEntry from 'artplayer-plugin-asr/legacy'
import runtime from 'artplayer-plugin-asr/runtime'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
type RuntimeEntryTypes = Assert<Equal<[EntryChunk, EntryFactory, EntryOption, EntryResult], [AudioChunk, RuntimeFactory, RuntimeOption, RuntimeResult]>>

interface HistoricalOption {
  length?: number
  interval?: number
  sampleRate?: number
  autoHideTimeout?: number
  onAudioChunk?: (chunk: { pcm: ArrayBuffer, wav: ArrayBuffer }) => void | Promise<void>
}

interface HistoricalResult {
  name: 'artplayerPluginAsr'
  stop: () => void
  hide: () => void
  append: (subtitle: string) => void
}

type HistoricalFactory = (option?: HistoricalOption) => (art: Artplayer) => HistoricalResult
type RootArguments = Assert<Equal<Parameters<typeof legacy>, [option?: AsrPluginOption]>>
type RootOption = Assert<Equal<AsrPluginOption, HistoricalOption>>
type RootResult = Assert<Equal<ReturnType<ReturnType<typeof legacy>>, AsrPluginInstance>>
type RootShape = Assert<Equal<AsrPluginInstance, HistoricalResult>>
type RootFactory = Assert<Equal<typeof legacy, HistoricalFactory>>
type RootStop = Assert<Equal<ReturnType<AsrPluginInstance['stop']>, void>>
type ChunkShape = Assert<Equal<AudioChunk, { pcm: ArrayBuffer, wav: ArrayBuffer }>>
type PreciseArguments = Assert<Equal<Parameters<typeof runtime>, [option?: RuntimeOption]>>
type PreciseResult = Assert<Equal<ReturnType<ReturnType<typeof runtime>>, RuntimeResult>>
type PreciseStop = Assert<Equal<ReturnType<RuntimeResult['stop']>, Promise<void>>>
type PreciseFactory = Assert<Equal<typeof runtime, RuntimeFactory>>
type PreciseCallback = Assert<Equal<NonNullable<RuntimeOption['onAudioChunk']>, (chunk: AudioChunk) => string | void | null | Promise<string | void | null>>>

const replacement: HistoricalFactory = (_option?: HistoricalOption) => (_art: Artplayer) => ({
  name: 'artplayerPluginAsr',
  stop() {},
  hide() {},
  append(_subtitle: string) {},
})
const assignToOld: HistoricalFactory = legacy
const assignFromOld: typeof legacy = replacement
const namespaceFactory: HistoricalFactory = namespace.default
const explicitLegacy: HistoricalFactory = legacyEntry
const option: AsrPluginOption = { onAudioChunk: async (_chunk: AudioChunk): Promise<void> => {} }
const absent: Parameters<typeof legacy>[0] = undefined
const art = new Artplayer({ container: '#player', url: '/video.mp4', plugins: [legacy(option), runtime(), legacyEntry(absent)] })
const old = legacy(option)(art)
const oldReturns: void[] = [old.stop(), old.hide(), old.append('Subtitle.')]
const bareRoot: typeof legacy = replacement

const runtimeOption: RuntimeOption = { length: 2, interval: 250, sampleRate: 48000, autoHideTimeout: 3000, onAudioChunk: async (chunk) => {
  const pcm: ArrayBuffer = chunk.pcm
  const wav: ArrayBuffer = chunk.wav
  void [pcm, wav]
  return 'Recognized subtitle.'
} }
const correct: RuntimeResult = runtime(runtimeOption)(art)
const stopped: Promise<void> = correct.stop()
const alias: RuntimeFactory = runtime.default.default
const aliasResult: RuntimeResult = alias(undefined)(art)
runtime({ onAudioChunk: () => 'Synchronous subtitle.' })
runtime({ onAudioChunk: () => null })
runtime({ onAudioChunk: () => undefined })
runtime({ onAudioChunk: async () => {} })
runtime({ onAudioChunk: async () => null })
runtime(option)

// @ts-expect-error Root options preserve the historical void/Promise<void> callback shape.
legacy({ onAudioChunk: () => 'Only the precise entry describes returned subtitles.' })
// @ts-expect-error Root stop extraction remains void for historical replacement factories.
const rootPromise: Promise<void> = old.stop()
// @ts-expect-error The legacy factory type must not demand or expose a self default alias.
bareRoot.default()
// @ts-expect-error Accurate stop is asynchronous.
const synchronous: void = correct.stop()
// @ts-expect-error Accurate result replacements cannot return void from stop.
const wrongStop: RuntimeResult = { name: 'artplayerPluginAsr', stop() {}, hide() {}, append(_text: string) {} }
// @ts-expect-error Callback results do not include booleans.
runtime({ onAudioChunk: () => true })
// @ts-expect-error Async callback results do not include booleans.
runtime({ onAudioChunk: async () => true })
// @ts-expect-error Options use numeric sample rates.
runtime({ sampleRate: '16000' })
// @ts-expect-error Unknown options remain rejected.
runtime({ unknown: true })
// @ts-expect-error Registration requires an Artplayer instance.
runtime()()
// @ts-expect-error Append accepts a string.
correct.append(123)
// @ts-expect-error PCM is an ArrayBuffer rather than encoded text.
const invalidChunk: AudioChunk = { pcm: 'raw audio', wav: new ArrayBuffer(4) }
void [assignToOld, assignFromOld, namespaceFactory, explicitLegacy, oldReturns, stopped, aliasResult, rootPromise, synchronous, wrongStop, invalidChunk]
export type { ChunkShape, PreciseArguments, PreciseCallback, PreciseFactory, PreciseResult, PreciseStop, RootArguments, RootFactory, RootOption, RootResult, RootShape, RootStop, RuntimeEntryTypes }

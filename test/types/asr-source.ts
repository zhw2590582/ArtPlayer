import type { AudioChunk, Factory, RuntimeFactory, RuntimeOption, RuntimeResult } from 'artplayer-plugin-asr'
import type source from '../../packages/artplayer-plugin-asr/src/index'
import type { AsrOptions, AsrResult, AudioChunk as SourceChunk } from '../../packages/artplayer-plugin-asr/src/types'

declare const implementation: typeof source
declare const runtimeFactory: RuntimeFactory
declare const runtimeOption: RuntimeOption
declare const sourceResult: AsrResult
declare const publicResult: RuntimeResult
declare const sourceChunk: SourceChunk
declare const publicChunk: AudioChunk

const historical: Factory = implementation
const accurate: Factory = runtimeFactory
const runtimeCall: (option?: RuntimeOption) => ReturnType<RuntimeFactory> = implementation
const sourceOption: AsrOptions = runtimeOption
const resultToPublic: RuntimeResult = sourceResult
const resultToSource: AsrResult = publicResult
const chunkToPublic: AudioChunk = sourceChunk
const chunkToSource: SourceChunk = publicChunk
void [historical, accurate, runtimeCall, sourceOption, resultToPublic, resultToSource, chunkToPublic, chunkToSource]

import type Artplayer from 'artplayer'
import asr from 'artplayer-plugin-asr'
import * as namespace from 'artplayer-plugin-asr'

// Compile this fixture as .mts with NodeNext: published declarations expose
// a CommonJS declaration namespace even though the runtime import is ESM.
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
interface HistoricalModule { default: HistoricalFactory }
const result: ReturnType<ReturnType<typeof asr.default>> = {
  name: 'artplayerPluginAsr',
  stop() {},
  hide() {},
  append(_subtitle: string) {},
}
const replacementFactory: HistoricalFactory = (_option?: HistoricalOption) => (_art: Artplayer) => result
const replacementModule: typeof asr = { default: replacementFactory }
const assignToOld: HistoricalModule = asr
const assignFromOld: typeof asr = assignToOld
const namespaceModule: typeof namespace.default = replacementModule
const factoryToOld: HistoricalFactory = asr.default
const factoryFromOld: typeof asr.default = replacementFactory
const option: Parameters<typeof asr.default>[0] = {
  onAudioChunk: async (_chunk): Promise<void> => {},
}
const absent: Parameters<typeof namespace.default.default>[0] = undefined
declare const art: Artplayer
const installed: HistoricalResult = asr.default(option)(art)
const namespaceResult: HistoricalResult = namespace.default.default(absent)(art)
const stop: void = installed.stop()
const append: void = namespaceResult.append('Old namespace import.')
void [assignFromOld, namespaceModule, factoryToOld, factoryFromOld, stop, append]

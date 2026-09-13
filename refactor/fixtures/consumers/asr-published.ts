import Artplayer from 'artplayer'
import asr from 'artplayer-plugin-asr'
import * as namespace from 'artplayer-plugin-asr'

interface PublishedChunk {
  pcm: ArrayBuffer
  wav: ArrayBuffer
}

interface PublishedOption {
  length?: number
  interval?: number
  sampleRate?: number
  autoHideTimeout?: number
  onAudioChunk?: (chunk: PublishedChunk) => void | Promise<void>
}

interface PublishedResult {
  name: 'artplayerPluginAsr'
  stop: () => void
  hide: () => void
  append: (subtitle: string) => void
}

type PublishedFactory = (option?: PublishedOption) => (art: Artplayer) => PublishedResult
const option: Parameters<typeof asr>[0] = {
  length: 3,
  interval: 100,
  sampleRate: 16000,
  autoHideTimeout: 10000,
  onAudioChunk(chunk) {
    const pcm: ArrayBuffer = chunk.pcm
    const wav: ArrayBuffer = chunk.wav
    void [pcm, wav]
  },
}
const empty: Parameters<typeof asr>[0] = undefined
const asyncOption: PublishedOption = { onAudioChunk: async (_chunk: PublishedChunk): Promise<void> => {} }
const result: ReturnType<ReturnType<typeof asr>> = {
  name: 'artplayerPluginAsr',
  stop() {},
  hide() {},
  append(_subtitle: string) {},
}
const replacement: PublishedFactory = (_option?: PublishedOption) => (_art: Artplayer) => result
const assignToOld: PublishedFactory = asr
const assignFromOld: typeof asr = replacement
const namespaceFactory: PublishedFactory = namespace.default
const art = new Artplayer({ container: '#player', url: '/video.mp4', plugins: [asr(option), asr(asyncOption), asr(), namespace.default(empty)] })
const installed: PublishedResult = asr(option)(art)
const stop: void = installed.stop()
const hide: void = installed.hide()
const append: void = installed.append('Historical subtitle.')
const callback: ((chunk: PublishedChunk) => void | Promise<void>) | undefined = option.onAudioChunk
void [assignToOld, assignFromOld, namespaceFactory, stop, hide, append, callback]

import type Artplayer from 'artplayer'

export interface AudioChunk {
  pcm: ArrayBuffer
  wav: ArrayBuffer
}

export interface AsrPluginOption {
  length?: number
  interval?: number
  sampleRate?: number
  autoHideTimeout?: number
  onAudioChunk?: (chunk: AudioChunk) => void | Promise<void>
}

export interface AsrPluginInstance {
  name: 'artplayerPluginAsr'
  stop: () => void
  hide: () => void
  append: (subtitle: string) => void
}

/** Historical factory shape, including void stop and callback results. */
export type Factory = (option?: AsrPluginOption) => (art: Artplayer) => AsrPluginInstance

/** Accurate asynchronous view available through the /runtime entry. */
export interface RuntimeOption extends Omit<AsrPluginOption, 'onAudioChunk'> {
  onAudioChunk?: (chunk: AudioChunk) => string | void | null | Promise<string | void | null>
}

export interface RuntimeResult extends Omit<AsrPluginInstance, 'stop'> {
  stop: () => Promise<void>
}

export interface RuntimeFactory {
  (option?: RuntimeOption): (art: Artplayer) => RuntimeResult
  readonly default: RuntimeFactory
}

declare function artplayerPluginAsr(option?: AsrPluginOption): (art: Artplayer) => AsrPluginInstance

export default artplayerPluginAsr

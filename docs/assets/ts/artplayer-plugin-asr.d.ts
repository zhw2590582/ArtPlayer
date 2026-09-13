// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
declare namespace artplayerPluginAsrDefinitions {
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
    /** Capture the media stream without taking ownership of its playback route. */
    audioInput?: {
      type: 'capture'
    }
    onAudioChunk?: (chunk: AudioChunk) => string | void | null | Promise<string | void | null>
  }
  export interface RuntimeResult extends Omit<AsrPluginInstance, 'stop'> {
    stop: () => Promise<void>
  }
  export interface RuntimeFactory {
    (option?: RuntimeOption): (art: Artplayer) => RuntimeResult
    readonly default: RuntimeFactory
  }
  export function artplayerPluginAsr(option?: AsrPluginOption): (art: Artplayer) => AsrPluginInstance
}
declare const artplayerPluginAsr: typeof artplayerPluginAsrDefinitions.artplayerPluginAsr
declare namespace artplayerPluginAsr {
  export type AudioChunk = artplayerPluginAsrDefinitions.AudioChunk
  export type AsrPluginOption = artplayerPluginAsrDefinitions.AsrPluginOption
  export type AsrPluginInstance = artplayerPluginAsrDefinitions.AsrPluginInstance
  export type Factory = artplayerPluginAsrDefinitions.Factory
  export type RuntimeOption = artplayerPluginAsrDefinitions.RuntimeOption
  export type RuntimeResult = artplayerPluginAsrDefinitions.RuntimeResult
  export type RuntimeFactory = artplayerPluginAsrDefinitions.RuntimeFactory
}
export = artplayerPluginAsr
export as namespace artplayerPluginAsr;

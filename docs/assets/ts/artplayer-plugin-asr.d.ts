interface AudioChunk {
  pcm: ArrayBuffer
  wav: ArrayBuffer
}

interface AsrPluginOption {
  length?: number
  interval?: number
  sampleRate?: number
  autoHideTimeout?: number
  onAudioChunk?: (chunk: AudioChunk) => void | Promise<void>
}

interface AsrPluginInstance {
  name: 'artplayerPluginAsr'
  stop: () => void
  hide: () => void
  append: (subtitle: string) => void
}

declare function artplayerPluginAsr(option?: AsrPluginOption): (art: Artplayer) => AsrPluginInstance

export default artplayerPluginAsr

export = artplayerPluginAsr;
export as namespace artplayerPluginAsr;
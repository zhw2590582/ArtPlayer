export interface AudioChunk {
  pcm: ArrayBuffer
  wav: ArrayBuffer
}

export interface AsrOptions {
  audioInput?: { type: 'capture' }
  length?: number
  interval?: number
  sampleRate?: number
  autoHideTimeout?: number
  onAudioChunk?: (chunk: AudioChunk) => unknown
}

export interface AsrResult {
  name: 'artplayerPluginAsr'
  stop: () => Promise<void>
  hide: () => void
  append: (subtitle: string) => void
}

export interface CaptureVideo extends HTMLVideoElement {
  captureStream?: () => MediaStream
  mozCaptureStream?: () => MediaStream
}

export interface CaptureOptions {
  captureOnly?: boolean
  interval: number
  sampleRate: number
  onAudioChunk: (chunk: AudioChunk) => unknown
}

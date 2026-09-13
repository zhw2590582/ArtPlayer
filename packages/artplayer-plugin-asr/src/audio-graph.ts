import type { CaptureVideo } from './types'
import { recorderProcessorCode } from './worklet'

export class AudioGraph {
  private context: AudioContext | undefined
  private source: AudioNode | undefined
  private stream: MediaStream | undefined
  private recorder: AudioWorkletNode | undefined
  private gain: GainNode | undefined
  private preparation: Promise<void> | undefined
  private blobUrl: string | undefined
  private closed = false
  private direct = false
  private workletLoaded = false

  constructor(private readonly video: CaptureVideo, private readonly sampleRate: number) {}

  private assertOpen() {
    if (this.closed)
      throw new Error('Audio capture was closed')
  }

  private revokeWorklet() {
    if (this.blobUrl !== undefined) {
      URL.revokeObjectURL(this.blobUrl)
      this.blobUrl = undefined
    }
  }

  private async initialize() {
    this.assertOpen()
    const platform = window as Window & { webkitAudioContext?: typeof AudioContext }
    const Context = window.AudioContext || platform.webkitAudioContext
    if (!Context)
      throw new Error('AudioContext is not supported')
    const context = this.context ??= new Context({ sampleRate: this.sampleRate })
    if (context.state === 'suspended')
      await context.resume()
    this.assertOpen()
    if (!this.workletLoaded) {
      this.blobUrl = URL.createObjectURL(new Blob([recorderProcessorCode], { type: 'application/javascript' }))
      try {
        await context.audioWorklet.addModule(this.blobUrl)
        this.workletLoaded = true
      }
      finally {
        this.revokeWorklet()
      }
    }
    this.assertOpen()
    if (!this.source) {
      try {
        this.source = context.createMediaElementSource(this.video)
        this.direct = true
      }
      catch (error) {
        console.warn('[artplayerPluginAsr] Direct connection failed:', error)
        const capture = this.video.captureStream || this.video.mozCaptureStream
        if (!capture)
          throw new Error('Could not establish audio source')
        this.stream = capture.call(this.video)
        this.source = context.createMediaStreamSource(this.stream)
      }
    }
  }

  prepare() {
    this.preparation ??= this.initialize().catch((error: unknown) => {
      this.preparation = undefined
      throw error
    })
    return this.preparation
  }

  get ownsMediaConnection() {
    return this.direct
  }

  idle() {
    const gain = this.gain
    this.disconnect()
    // A media element cannot be reattached after its original context is closed.
    // Keep its audio route alive until the player releases the element itself.
    if (this.direct && this.context && this.source) {
      this.gain = gain || this.context.createGain()
      if (!gain)
        this.gain.gain.value = 1
      this.source.connect(this.gain)
      this.gain.connect(this.context.destination)
    }
  }

  connect(receive: (samples: Float32Array) => void) {
    this.assertOpen()
    const context = this.context
    const source = this.source
    if (!context || !source)
      throw new Error('Audio capture is not prepared')
    const previousGain = this.gain
    this.disconnect()
    const gain = this.gain = previousGain || context.createGain()
    if (!previousGain)
      gain.gain.value = 1
    const recorder = this.recorder = new AudioWorkletNode(context, 'recorder-processor')
    recorder.port.onmessage = (event: MessageEvent<Float32Array>) => {
      if (!this.closed && this.recorder === recorder)
        receive(event.data)
    }
    source.connect(recorder)
    source.connect(gain)
    gain.connect(context.destination)
  }

  volume(value: number) {
    if (this.gain)
      this.gain.gain.value = value
  }

  disconnect() {
    if (this.recorder) {
      this.recorder.port.onmessage = null
      this.recorder.disconnect()
      this.recorder = undefined
    }
    this.gain?.disconnect()
    this.gain = undefined
    this.source?.disconnect()
  }

  async close() {
    if (this.closed)
      return
    this.closed = true
    this.disconnect()
    this.revokeWorklet()
    this.stream?.getTracks().forEach(track => track.stop())
    this.stream = undefined
    const context = this.context
    this.context = undefined
    this.source = undefined
    if (context && context.state !== 'closed')
      await context.close()
  }
}

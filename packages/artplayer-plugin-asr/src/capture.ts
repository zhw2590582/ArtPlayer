import type { CaptureOptions, CaptureVideo } from './types'
import { AudioGraph } from './audio-graph'
import { encodeAudio } from './encoding'
import { SampleQueue } from './sample-queue'

export class Capture {
  private graph: AudioGraph | undefined
  private readonly queue = new SampleQueue()
  private timer: ReturnType<typeof setInterval> | undefined
  private starting: Promise<void> | undefined
  private closing: Promise<void> = Promise.resolve()
  private running = false
  private terminal = false
  private epoch = 0
  private pending: object | undefined

  constructor(private readonly video: CaptureVideo, private readonly options: CaptureOptions, private readonly append: (text: unknown) => void) {}

  private reset() {
    this.epoch++
    this.pending = undefined
    this.queue.clear()
  }

  pause() {
    this.reset()
    this.running = false
    clearInterval(this.timer)
    this.timer = undefined
    this.starting = undefined
    this.graph?.idle()
  }

  restart() {
    const active = this.running || Boolean(this.starting)
    this.pause()
    if (this.graph && !this.graph.ownsMediaConnection)
      return this.stop().then(() => active ? this.start() : undefined)
    return active ? this.start() : Promise.resolve()
  }

  start(): Promise<void> {
    if (this.terminal || this.running)
      return Promise.resolve()
    if (this.starting)
      return this.starting
    const epoch = this.epoch
    const current = () => !this.terminal && this.epoch === epoch
    const operation = (async () => {
      await this.closing
      if (!current())
        return
      const { sampleRate, interval } = this.options
      const count = Math.floor(sampleRate * interval / 1000)
      if (!Number.isSafeInteger(count) || count < 1 || !Number.isFinite(interval) || interval <= 0)
        throw new Error('Audio chunk length must be positive and finite')
      const graph = this.graph ??= new AudioGraph(this.video, sampleRate)
      await graph.prepare()
      if (!current()) {
        if (!this.running && this.graph === graph)
          graph.idle()
        return
      }
      graph.connect((samples) => {
        if (!this.running || this.graph !== graph)
          return
        // Stop overload explicitly instead of retaining an unbounded recognition backlog.
        if (this.queue.length + samples.length > Math.max(sampleRate * 60, count * 2)) {
          console.error('[artplayerPluginAsr] Audio callback backlog exceeded its capture limit')
          this.pause()
          return
        }
        this.queue.push(samples)
      })
      this.running = true
      this.timer = setInterval(() => this.tick(count), interval)
    })().catch(async (error: unknown) => {
      if (current()) {
        console.error('[artplayerPluginAsr] Initialization failed:', error)
        await this.stop()
      }
    }).finally(() => {
      if (this.starting === operation)
        this.starting = undefined
    })
    this.starting = operation
    return operation
  }

  private async tick(count: number) {
    if (!this.running || this.pending)
      return
    const samples = this.queue.take(count)
    if (!samples)
      return
    const epoch = this.epoch
    const pending = this.pending = {}
    try {
      const text = await this.options.onAudioChunk(encodeAudio(samples, this.options.sampleRate))
      if (this.running && !this.terminal && this.epoch === epoch)
        this.append(text)
    }
    catch (error) {
      if (this.epoch === epoch && !this.terminal)
        console.error('[artplayerPluginAsr] Audio callback failed:', error)
    }
    finally {
      if (this.pending === pending)
        this.pending = undefined
    }
  }

  volume(value: number) {
    this.graph?.volume(value)
  }

  stop(terminal = false) {
    this.terminal ||= terminal
    this.pause()
    const graph = this.graph
    if (terminal || !graph?.ownsMediaConnection) {
      this.graph = undefined
      this.closing = Promise.all([this.closing, graph?.close()]).then(() => undefined)
    }
    return this.closing
  }
}

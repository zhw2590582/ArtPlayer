import type { AudioBufferSink, WrappedAudioBuffer } from 'mediabunny'
import type ContextOwner from './audio-context'
import type NodeQueue from './audio-nodes'
import type EventTarget from './EventTarget'
import AudioTask, { CANCELLED } from './audio-task'
import { publish } from './readiness'

export type AudioIterator = Pick<AsyncGenerator<WrappedAudioBuffer, void, unknown>, 'next' | 'return'>
export interface PumpHost {
  audioSink: AudioBufferSink | null
  audioIterator: AudioIterator | null
  audioContext: AudioContext | null
  paused: boolean
  asyncId: number
  readonly currentTime: number
  latestScheduledEndTime: number
  events: EventTarget
}

export default class AudioPump {
  private task: AudioTask | null = null
  private closing = new WeakMap<AudioIterator, Promise<void>>()

  constructor(private host: PumpHost, private contexts: ContextOwner, private nodes: NodeQueue) {}

  async stopIterator(): Promise<void> {
    const iterator = this.host.audioIterator
    this.host.audioIterator = null
    if (!iterator)
      return
    let pending = this.closing.get(iterator)
    if (!pending) {
      pending = Promise.resolve().then(() => iterator.return()).then(() => {})
      this.closing.set(iterator, pending)
    }
    await pending
  }

  cancel(): void {
    this.task?.cancel()
    this.task = null
    void this.stopIterator().catch(error => console.warn('MediaBunny audio iterator cleanup:', error))
  }

  async run(id: number): Promise<void> {
    if (this.host.asyncId !== id)
      return
    this.cancel()
    const sink = this.host.audioSink
    const context = this.host.audioContext
    if (!sink || !context || this.host.paused || this.host.asyncId !== id)
      return
    const task = new AudioTask()
    this.task = task
    let iterator: AudioIterator | null = null
    const current = () => !task.cancelled && this.task === task && this.host.asyncId === id && !this.host.paused && this.host.audioContext === context && (!iterator || this.host.audioIterator === iterator)
    try {
      iterator = sink.buffers(this.host.currentTime)
      this.host.audioIterator = iterator
      while (current()) {
        const batch: WrappedAudioBuffer[] = []
        let done = false
        for (let index = 0; index < 16; index++) {
          const result = await task.wait(iterator.next())
          if (result === CANCELLED || !current())
            return
          if (result.done) {
            done = true
            break
          }
          batch.push(result.value)
        }
        if (batch.length && context.state === 'suspended') {
          const resumed = await task.wait(this.contexts.resume(context))
          if (resumed === CANCELLED || !current())
            return
          publish(this.host.events, current, ['canplay', 'playing'])
        }
        for (const buffer of batch) {
          if (!current())
            return
          this.nodes.schedule(buffer)
        }
        if (done)
          return
        if (!(await task.delay(0)) || !current())
          return
        while (this.host.latestScheduledEndTime - this.host.currentTime > 1) {
          if (!(await task.delay(50)) || !current())
            return
        }
      }
    }
    catch (error) {
      if (current())
        throw error
    }
    finally {
      task.cancel()
      if (this.task === task) {
        this.task = null
        void this.stopIterator().catch(error => console.warn('MediaBunny audio iterator cleanup:', error))
      }
    }
  }
}

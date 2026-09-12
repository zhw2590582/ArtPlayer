import type { WrappedAudioBuffer } from 'mediabunny'
import type { AudioClock } from './audio-clock'
import { bufferTiming } from './audio-clock'

interface QueueHost extends AudioClock {
  gainNode: GainNode | null
  queuedNodes: Set<AudioBufferSourceNode>
  latestScheduledEndTime: number
}

export default class NodeQueue {
  constructor(private host: QueueHost) {}

  private release(node: AudioBufferSourceNode, stop: boolean): void {
    this.host.queuedNodes.delete(node)
    node.onended = null
    let failed = false
    let failure: unknown
    try {
      if (stop)
        node.stop()
    }
    catch (error) {
      failed = true
      failure = error
    }
    try {
      node.disconnect()
    }
    catch (error) {
      if (!failed) {
        failed = true
        failure = error
      }
    }
    if (failed)
      throw failure
  }

  stop(): void {
    const failures: unknown[] = []
    for (const node of [...this.host.queuedNodes]) {
      try {
        this.release(node, true)
      }
      catch (error) { failures.push(error) }
    }
    if (failures.length)
      throw failures[0]
  }

  schedule({ buffer, timestamp }: WrappedAudioBuffer): void {
    const context = this.host.audioContext
    const gain = this.host.gainNode
    if (!context || !gain)
      return
    const timing = bufferTiming(this.host, timestamp, buffer.duration, context.currentTime)
    if (timing.offset !== null && timing.offset >= buffer.duration)
      return
    const node = context.createBufferSource()
    this.host.queuedNodes.add(node)
    try {
      node.buffer = buffer
      node.connect(gain)
      node.playbackRate.value = this.host.playbackRate
      node.onended = () => {
        if (!this.host.queuedNodes.has(node))
          return
        try {
          this.release(node, false)
        }
        catch (error) { console.warn('MediaBunny ended node cleanup:', error) }
      }
      if (timing.offset === null)
        node.start(timing.startAt)
      else
        node.start(timing.startAt, timing.offset)
      this.host.latestScheduledEndTime = Math.max(this.host.latestScheduledEndTime, timing.endMediaTime)
    }
    catch (error) {
      try {
        this.release(node, true)
      }
      catch (failure) { console.warn('MediaBunny audio node cleanup:', failure) }
      throw error
    }
  }
}

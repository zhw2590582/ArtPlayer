interface ContextHost {
  audioContext: AudioContext | null
  gainNode: GainNode | null
  volume: number
  muted: boolean
}

export default class ContextOwner {
  private closed = false
  private resumes = new WeakMap<AudioContext, Promise<void>>()

  constructor(private host: ContextHost) {}

  ensure(sampleRate?: number): AudioContext | null {
    if (this.closed)
      return null
    if (this.host.audioContext)
      return this.host.audioContext
    const Context = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    let context: AudioContext
    try {
      context = new Context({ sampleRate })
    }
    catch {
      context = new Context()
    }
    if (this.closed) {
      void context.close().catch(error => console.warn('MediaBunny obsolete context cleanup:', error))
      return null
    }
    let gain: GainNode | null = null
    try {
      gain = context.createGain()
      gain.connect(context.destination)
      const volume = this.host.muted ? 0 : this.host.volume
      gain.gain.value = volume * volume
      if (this.closed) {
        gain.disconnect()
        void context.close().catch(error => console.warn('MediaBunny obsolete context cleanup:', error))
        return null
      }
      this.host.audioContext = context
      this.host.gainNode = gain
      return context
    }
    catch (error) {
      try {
        gain?.disconnect()
      }
      catch (failure) { console.warn('MediaBunny gain setup cleanup:', failure) }
      void context.close().catch(failure => console.warn('MediaBunny context setup cleanup:', failure))
      throw error
    }
  }

  updateGain(): void {
    if (!this.host.gainNode)
      return
    const volume = this.host.muted ? 0 : this.host.volume
    this.host.gainNode.gain.value = volume * volume
  }

  resume(context: AudioContext): Promise<void> {
    const previous = this.resumes.get(context)
    if (previous)
      return previous
    const pending = context.resume()
    this.resumes.set(context, pending)
    const clear = () => {
      if (this.resumes.get(context) === pending)
        this.resumes.delete(context)
    }
    pending.then(clear, clear)
    return pending
  }

  destroy(): void {
    if (this.closed)
      return
    this.closed = true
    const { audioContext: context, gainNode: gain } = this.host
    this.host.audioContext = null
    this.host.gainNode = null
    try {
      gain?.disconnect()
    }
    finally {
      if (context)
        void context.close().catch(error => console.warn('MediaBunny context close error:', error))
    }
  }
}

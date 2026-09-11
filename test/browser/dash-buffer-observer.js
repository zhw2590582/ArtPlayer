// Runs inside the page. Every SDK operation still uses the native SourceBuffer.
export function observeDashBuffers() {
  const buffers = []
  const events = []
  const ranges = value => Array.from({ length: value.length }, (_, index) => [value.start(index), value.end(index)])
  function snapshot() {
    const video = window.art?.video || window.nativeVideo
    const dash = window.art?.dash || window.nativeDash
    const metrics = dash?.getDashMetrics()
    let processors
    try {
      processors = dash?.getActiveStream()?.getProcessors().map((processor) => {
        const buffer = processor.getBufferController()
        return { type: processor.getType(), level: processor.getBufferLevel(), target: processor.getScheduleController().getBufferTarget(), complete: processor.isBufferingCompleted(), pruning: buffer.getIsPruningInProgress(), hasTarget: video ? buffer.hasBufferAtTime(video.currentTime) : null }
      })
    }
    catch (error) {
      // SDK initialization/teardown and generations expose different internals.
      processors = { unavailable: String(error) }
    }
    return {
      time: video?.currentTime,
      paused: video?.paused,
      seeking: video?.seeking,
      readyState: video?.readyState,
      video: video ? ranges(video.buffered) : [],
      levels: metrics ? { video: metrics.getCurrentBufferLevel('video'), audio: metrics.getCurrentBufferLevel('audio') } : null,
      processors,
      buffers: buffers.map(({ source, buffer, mime }) => {
        try {
          return { mime, sourceState: source.readyState, updating: buffer.updating, ranges: ranges(buffer.buffered), timestampOffset: buffer.timestampOffset }
        }
        catch (error) {
          return { mime, sourceState: source.readyState, error: error.name }
        }
      }),
    }
  }
  const mark = name => events.push({ name, at: performance.now(), ...snapshot() })
  for (const Source of new Set([window.MediaSource, window.ManagedMediaSource].filter(Boolean))) {
    const addSourceBuffer = Source.prototype.addSourceBuffer
    Source.prototype.addSourceBuffer = function (...args) {
      const buffer = Reflect.apply(addSourceBuffer, this, args)
      buffers.push({ source: this, buffer, mime: args[0] })
      buffer.addEventListener('updateend', () => mark('sourcebuffer:updateend'))
      return buffer
    }
  }
  window.dashBuffers = { snapshot, mark, events }
}

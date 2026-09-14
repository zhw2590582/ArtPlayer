// Page-only counterfactuals, called after a failed SDK assertion. Never production recovery.

export function probeBufferGetter() {
  const dash = window.art?.dash || window.nativeDash
  const video = window.art?.video || window.nativeVideo
  const before = window.dashBuffers.snapshot()
  const records = []
  window.dashGetterRestores = []
  for (const processor of dash.getActiveStream().getProcessors()) {
    const buffer = processor.getBufferController()
    const original = buffer.getBufferLevel
    const record = { type: processor.getType(), reads: 0, adjusted: 0 }
    const wrapped = function (...args) {
      const cached = Reflect.apply(original, this, args)
      record.reads++
      const time = video.currentTime
      const range = buffer.getRangeAt(time)
      if (video.seeking && cached > 0 && (!range || range.end <= time) && !buffer.getIsPruningInProgress() && buffer.getAllRangesWithSafetyFactor(time).length === 0) {
        record.adjusted++
        return 0
      }
      return cached
    }
    buffer.getBufferLevel = wrapped
    records.push(record)
    window.dashGetterRestores.push(() => {
      if (buffer.getBufferLevel === wrapped)
        buffer.getBufferLevel = original
    })
  }
  window.dashGetterRecords = records
  return { before, mode: 'conditional-buffer-getter', acceptance: false }
}

export function probeBufferMetric() {
  const dash = window.art?.dash || window.nativeDash
  const video = window.art?.video || window.nativeVideo
  const metrics = dash.getDashMetrics()
  const before = window.dashBuffers.snapshot()
  const settings = JSON.stringify(dash.getSettings())
  const records = []
  for (const processor of dash.getActiveStream().getProcessors()) {
    const type = processor.getType()
    const buffer = processor.getBufferController()
    const time = video.currentTime
    const cached = metrics.getCurrentBufferLevel(type)
    const range = buffer.getRangeAt(time)
    if (video.seeking && cached > 0 && (!range || range.end <= time) && !buffer.getIsPruningInProgress() && buffer.getAllRangesWithSafetyFactor(time).length === 0) {
      metrics.addBufferLevel(type, new Date(), 0)
      records.push({ type, cached, corrected: metrics.getCurrentBufferLevel(type), time, range })
    }
  }
  return { before, mode: 'measured-empty-buffer-metric', acceptance: false, records, afterMetric: window.dashBuffers.snapshot(), settingsUnchanged: settings === JSON.stringify(dash.getSettings()) }
}

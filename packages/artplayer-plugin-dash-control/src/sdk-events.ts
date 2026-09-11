import type { Cleanup, Dash, SDKEventName } from './types'

interface Binding<Level extends object, Track extends object> {
  dash: Dash<Level, Track>
  off: NonNullable<Dash<Level, Track>['off']>
  callbacks: [SDKEventName, Cleanup][]
  epoch: number
  queued: boolean
  running: boolean
  suspended: boolean
  automatic: boolean
}

export function observeSDK<Level extends object, Track extends object>(options: {
  active: (dash: Dash<Level, Track>) => boolean
  refresh: Cleanup
  reset: Cleanup
}) {
  let binding: Binding<Level, Track> | undefined
  const active = (record: Binding<Level, Track>) => binding === record && options.active(record.dash)
  const automatic = (record: Binding<Level, Track>) => record.dash.getSettings().streaming.abr.autoSwitchBitrate.video

  function release(): void {
    const record = binding
    if (!record)
      return
    binding = undefined
    record.epoch++
    let failure: unknown
    for (const [name, callback] of record.callbacks.splice(0)) {
      try {
        record.off.call(record.dash, name, callback)
      }
      catch (error) {
        failure ||= error
      }
    }
    if (failure)
      throw failure
  }

  function fail(record: Binding<Level, Track>, error: unknown): void {
    if (binding === record) {
      try {
        release()
      }
      catch (cleanupError) {
        console.warn('ArtPlayer DASH subscription cleanup failed:', cleanupError)
      }
      if (!binding && options.active(record.dash)) {
        try {
          options.reset()
        }
        catch (cleanupError) {
          console.warn('ArtPlayer DASH cleanup failed:', cleanupError)
        }
      }
    }
    console.warn('ArtPlayer DASH refresh failed:', error)
  }

  function schedule(record: Binding<Level, Track>): void {
    if (!active(record) || record.suspended || record.queued || record.running)
      return
    record.queued = true
    const epoch = record.epoch
    void Promise.resolve().then(() => {
      if (!active(record) || record.epoch !== epoch || record.suspended)
        return
      record.queued = false
      record.running = true
      try {
        record.automatic = automatic(record)
        if (active(record))
          options.refresh()
      }
      catch (error) {
        fail(record, error)
      }
      finally {
        record.running = false
      }
    })
  }

  function bind(dash: Dash<Level, Track>): void {
    const previous = binding
    if (previous?.dash === dash) {
      const value = automatic(previous)
      if (active(previous)) {
        previous.automatic = value
        previous.suspended = false
      }
      return
    }
    release()
    // An off callback may synchronously install a newer binding.
    if (binding || !options.active(dash) || typeof dash.on !== 'function' || typeof dash.off !== 'function')
      return
    const record: Binding<Level, Track> = { dash, off: dash.off, callbacks: [], epoch: 0, queued: false, running: false, suspended: false, automatic: false }
    binding = record
    const on = dash.on
    try {
      record.automatic = automatic(record)
      const changed: SDKEventName[] = ['qualityChangeRequested', 'qualityChangeRendered', 'trackChangeRendered', 'streamUpdated', 'streamInitialized']
      const entries: [SDKEventName, Cleanup][] = changed.map(name => [name, () => {
        if (name === 'streamUpdated' || name === 'streamInitialized')
          record.suspended = false
        schedule(record)
      }])
      entries.push(['playbackTimeUpdated', () => {
        if (!active(record) || record.suspended)
          return
        try {
          const value = automatic(record)
          if (active(record) && value !== record.automatic) {
            record.automatic = value
            schedule(record)
          }
        }
        catch (error) {
          fail(record, error)
        }
      }])
      entries.push(['streamTeardownComplete', () => {
        if (!active(record))
          return
        record.epoch++
        record.queued = false
        record.suspended = true
        try {
          options.reset()
        }
        catch (error) {
          fail(record, error)
        }
      }])
      for (const entry of entries) {
        if (!active(record))
          break
        record.callbacks.push(entry)
        on.call(dash, ...entry)
      }
    }
    catch (error) {
      if (binding === record) {
        try {
          release()
        }
        catch (cleanupError) {
          console.warn('ArtPlayer DASH subscription cleanup failed:', cleanupError)
        }
      }
      throw error
    }
  }

  return { bind, release }
}

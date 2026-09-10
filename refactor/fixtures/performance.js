/* global Artplayer, artplayerPluginChapter */
(() => {
  const container = document.querySelector('.player')
  const status = document.querySelector('#status')
  const now = () => performance.now()
  const options = chapter => ({ container, url: '/assets/sample/video.mp4', muted: true, plugins: chapter ? [artplayerPluginChapter({ chapters: [{ start: 0, end: 10, title: 'First' }, { start: 10, end: Infinity, title: 'Second' }] })] : [] })
  function waitFor(test, timeout = 12000) {
    const started = now()
    return new Promise((resolve, reject) => {
      const poll = () => {
        if (test()) resolve()
        else if (now() - started > timeout) reject(new Error('State timeout'))
        else requestAnimationFrame(poll)
      }
      poll()
    })
  }
  function timers() {
    const original = Object.fromEntries(['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame', 'cancelAnimationFrame'].map(name => [name, window[name]]))
    const active = new Map()
    const late = []
    let destroyed = false
    const capture = (kind, callback, delay, args) => {
      if (typeof callback !== 'function') throw new Error('Timer probe only supports function callbacks')
      let handle
      const wrapped = function (...values) {
        if (kind !== 'interval') active.delete(`${kind}:${handle}`)
        if (destroyed) late.push({ kind, delay })
        return callback.apply(this, values)
      }
      handle = kind === 'raf' ? original.requestAnimationFrame.call(window, wrapped) : original[kind === 'timeout' ? 'setTimeout' : 'setInterval'].call(window, wrapped, delay, ...args)
      active.set(`${kind}:${handle}`, { kind, delay })
      return handle
    }
    window.setTimeout = (callback, delay = 0, ...args) => capture('timeout', callback, delay, args)
    window.setInterval = (callback, delay = 0, ...args) => capture('interval', callback, delay, args)
    window.requestAnimationFrame = callback => capture('raf', callback, null, [])
    for (const clear of ['clearTimeout', 'clearInterval']) window[clear] = (handle) => {
      active.delete(`timeout:${handle}`)
      active.delete(`interval:${handle}`)
      return original[clear].call(window, handle)
    }
    window.cancelAnimationFrame = (handle) => {
      active.delete(`raf:${handle}`)
      return original.cancelAnimationFrame.call(window, handle)
    }
    return {
      snapshot: () => [...active.values()], late,
      markDestroyed: () => { destroyed = true },
      wait: ms => new Promise(resolve => original.setTimeout.call(window, resolve, ms)),
      restore: () => {
        // Probe-owned cleanup only after recording; never count it as library cleanup.
        for (const key of active.keys()) {
          const [kind, handle] = key.split(':')
          original[kind === 'raf' ? 'cancelAnimationFrame' : kind === 'interval' ? 'clearInterval' : 'clearTimeout'].call(window, Number(handle))
        }
        Object.assign(window, original)
        active.clear()
      },
    }
  }
  document.querySelector('#run').onclick = async () => {
    document.querySelector('#run').disabled = true
    const report = {
      kind: 'performance',
      environment: { userAgent: navigator.userAgent, language: navigator.language, hardwareConcurrency: navigator.hardwareConcurrency, deviceMemory: navigator.deviceMemory ?? null, devicePixelRatio, viewport: { width: innerWidth, height: innerHeight }, visibility: document.visibilityState },
      scripts: [...document.scripts].map(script => new URL(script.src).pathname),
      samples: [], resources: [], errors: [], unhandled: [], visibilityChanges: [],
    }
    const onError = event => report.errors.push(event.message)
    const onUnhandled = event => report.unhandled.push(String(event.reason))
    const onVisibility = () => report.visibilityChanges.push(document.visibilityState)
    addEventListener('error', onError)
    addEventListener('unhandledrejection', onUnhandled)
    document.addEventListener('visibilitychange', onVisibility)
    let art
    const originalRaf = Artplayer.USE_RAF
    try {
      if (document.visibilityState !== 'visible') throw new Error('Keep benchmark tab visible')
      if (originalRaf !== false) throw new Error('Unexpected published default USE_RAF')
      // Interleave configurations, retaining one warm-up per configuration separately.
      for (let round = 0; round < 6; round++) {
        for (const chapter of [false, true]) {
          status.textContent = `Timing ${round + 1}/6: ${chapter ? 'core + chapter' : 'core'}`
          const started = now()
          art = new Artplayer(options(chapter))
          const constructorMs = now() - started
          await waitFor(() => art.isReady)
          const readyMs = now() - started
          const playbackStarted = now()
          await art.play()
          const playResolvedMs = now() - playbackStarted
          const startTime = art.currentTime
          await waitFor(() => art.currentTime >= startTime + 0.15)
          const playbackObservedMs = now() - playbackStarted
          const mediaProgress = art.currentTime - startTime
          art.pause()
          const nodes = container.querySelectorAll('*').length
          const proxyCleanupEntries = art.events.destroyEvents.size
          const video = art.video
          const videoWidth = video.videoWidth
          const destroyStarted = now()
          art.destroy()
          const destroyMs = now() - destroyStarted
          report.samples.push({ configuration: chapter ? 'chapter' : 'core', warmup: round === 0, round, constructorMs, readyMs, playResolvedMs, playbackObservedMs, mediaProgress, videoWidth, nodes, proxyCleanupEntries, destroyMs,
            afterDestroy: { nodes: container.querySelectorAll('*').length, instances: Artplayer.instances.length, proxyCleanupEntries: art.events.destroyEvents.size, paused: video.paused, sourceAttribute: video.getAttribute('src') } })
          art = null
        }
      }
      // Instrumentation is deliberately excluded from the timing samples above.
      for (let round = 0; round < 3; round++) {
        for (const chapter of [false, true]) {
          status.textContent = `Resources ${round + 1}/3: ${chapter ? 'core + chapter' : 'core'}`
          const probe = timers()
          let destroyed = false
          let lateResizeEvents = 0
          let proxyCalls = 0
          let frames = 0
          try {
            Artplayer.USE_RAF = true
            art = new Artplayer(options(chapter))
            art.on('raf', () => frames++)
            art.on('resize', () => { if (destroyed) lateResizeEvents++ })
            art.proxy(document, 'art-baseline-resource', () => proxyCalls++)
            await waitFor(() => art.isReady)
            await art.play()
            await waitFor(() => frames >= 2)
            art.notice.show = 'Resource probe'
            document.dispatchEvent(new Event('art-baseline-resource'))
            // Controlled pending debounce before teardown, not a trusted user resize.
            window.dispatchEvent(new Event('resize'))
            const before = { timers: probe.snapshot(), proxyCleanupEntries: art.events.destroyEvents.size, frames, proxyCalls }
            art.destroy()
            destroyed = true
            probe.markDestroyed()
            const immediatelyAfter = probe.snapshot()
            const atDestroyFrames = frames
            document.dispatchEvent(new Event('art-baseline-resource'))
            const waitStarted = now()
            await probe.wait(350)
            report.resources.push({ configuration: chapter ? 'chapter' : 'core', round, useRaf: true, before, immediatelyAfter,
              after: { observedMs: now() - waitStarted, timers: probe.snapshot(), lateCallbacks: [...probe.late], lateResizeEvents, framesAfterDestroy: frames - atDestroyFrames, proxyCalls, proxyCleanupEntries: art.events.destroyEvents.size, nodes: container.querySelectorAll('*').length, instances: Artplayer.instances.length } })
            art = null
          }
          finally {
            if (art && Artplayer.instances.includes(art)) art.destroy()
            probe.restore()
            Artplayer.USE_RAF = originalRaf
          }
        }
      }
    }
    catch (error) { report.errors.push(error.message) }
    finally {
      if (art && Artplayer.instances.includes(art)) art.destroy()
      Artplayer.USE_RAF = originalRaf
      removeEventListener('error', onError)
      removeEventListener('unhandledrejection', onUnhandled)
      document.removeEventListener('visibilitychange', onVisibility)
    }
    report.remainingInstances = Artplayer.instances.length
    document.querySelector('#result').textContent = JSON.stringify(report, null, 2)
    const response = await fetch('/reports/performance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(report) })
    status.textContent = response.ok ? `Saved ${report.samples.length} timing samples and ${report.resources.length} resource probes; errors ${report.errors.length}` : 'Save failed'
  }
})()

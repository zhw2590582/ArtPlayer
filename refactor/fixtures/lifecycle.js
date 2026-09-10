/* global Artplayer, artplayerPluginChapter */
document.getElementById('run').addEventListener('click', async (event) => {
  event.currentTarget.disabled = true
  document.getElementById('status').textContent = 'Running real-media checks...'
  const report = { kind: 'lifecycle', environment: { userAgent: navigator.userAgent, language: navigator.language }, scripts: [...document.scripts].map(script => new URL(script.src).pathname), checks: [], observations: {}, findings: [], trace: [], errors: [], unhandled: [] }
  const players = []
  let phase = 'emitter'
  const expectedRejections = new Set()
  report.observations.expectedUnhandled = []
  const check = (id, passed) => {
    report.checks.push({ id, passed: Boolean(passed) })
    if (!passed) throw new Error(id)
  }
  const unhandled = event => {
    if (expectedRejections.has(event.reason)) {
      report.observations.expectedUnhandled.push({ phase, message: event.reason.message })
      event.preventDefault()
    }
    else report.unhandled.push(String(event.reason?.message || event.reason))
  }
  window.addEventListener('unhandledrejection', unhandled)
  const bounded = (promise, label, ms = 12000) => {
    let timer
    return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`Timeout: ${label}`)), ms) })])
      .finally(() => clearTimeout(timer))
  }
  const eventAfter = (art, name, action = () => {}) => {
    let listener
    const promise = new Promise((resolve, reject) => {
      listener = resolve
      art.on(name, listener)
      try { action() } catch (error) { reject(error) }
    })
    return bounded(promise, name).finally(() => art.off(name, listener))
  }
  const advance = (art, start) => {
    let listener
    const promise = new Promise((resolve) => {
      listener = () => { if (art.currentTime >= start + 0.1) resolve(art.currentTime) }
      art.on('video:timeupdate', listener)
      listener()
    })
    return bounded(promise, 'media time advance').finally(() => art.off('video:timeupdate', listener))
  }
  const observeFrames = callback => bounded(new Promise((resolve) => {
    const start = performance.now()
    const frame = () => {
      callback()
      if (performance.now() - start >= 250) resolve(performance.now() - start)
      else requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }), 'frame observation')
  const create = (option = {}, ready) => {
    const container = document.createElement('div')
    container.className = 'player'
    document.getElementById('players').append(container)
    const art = new Artplayer({ container, url: '/assets/sample/video.mp4', muted: true, mutex: false, plugins: [artplayerPluginChapter()], ...option }, ready)
    players.push(art)
    for (const name of ['ready', 'restart', 'play', 'pause', 'destroy', 'video:loadstart', 'video:loadedmetadata', 'video:loadeddata', 'video:canplay', 'video:play', 'video:playing', 'video:pause', 'video:seeking', 'video:seeked', 'video:error']) {
      art.on(name, (...args) => report.trace.push({ phase, event: name, time: art.currentTime, paused: art.video.paused, ready: art.isReady, source: art.video.getAttribute('src'), argument: typeof args[0] === 'string' ? args[0] : args[0]?.type || null }))
    }
    return art
  }
  try {
    check('LIFE.version', Artplayer.version === '5.4.0')
    const emitter = new Artplayer.Emitter()
    const ctx = {}
    let correctContext = false
    check('EVENT.chain', emitter.on('ctx', function (a, b) { correctContext = this === ctx && a === 3 && b === 'value' }, ctx).emit('ctx', 3, 'value').off('ctx') === emitter)
    check('EVENT.context-arguments', correctContext)
    let onceCount = 0
    emitter.once('once', () => { onceCount += 1; emitter.emit('once') })
    emitter.emit('once')
    check('EVENT.once-reentry', onceCount === 1)
    const order = []
    const second = () => order.push('second')
    const later = () => order.push('later')
    emitter.on('order', () => { order.push('first'); emitter.off('order', second); emitter.on('order', later) }).on('order', second)
    emitter.emit('order').emit('order')
    report.observations.emitterOrder = order
    check('EVENT.dispatch-snapshot', JSON.stringify(order) === JSON.stringify(['first', 'second', 'first', 'later']))
    let removedOnce = 0
    const original = () => { removedOnce += 1 }
    emitter.once('removed', original).off('removed', original).emit('removed')
    check('EVENT.off-original-once', removedOnce === 0)
    const marker = new Error('expected emitter probe')
    let caught
    let afterThrow = 0
    emitter.on('throw', () => { throw marker }).on('throw', () => { afterThrow += 1 })
    try { emitter.emit('throw') } catch (error) { caught = error }
    check('EVENT.throw-propagation', caught === marker && afterThrow === 0)

    phase = 'initial'
    let readyCount = 0
    let callbackArt
    let callbackContext
    const art = create({}, function (value) { readyCount += 1; callbackArt = value; callbackContext = this })
    await eventAfter(art, 'ready')
    check('LIFE.ready-callback', readyCount === 1 && callbackArt === art && callbackContext === art && art.isReady)
    check('MEDIA.metadata', art.duration > 2 && art.video.videoWidth > 0 && art.video.readyState >= 2)
    phase = 'play'
    const playStart = art.currentTime
    const playResult = art.play()
    check('MEDIA.play-promise', playResult instanceof Promise)
    check('MEDIA.play-result', await bounded(playResult, 'play') === undefined)
    const progressed = await advance(art, playStart)
    report.observations.playback = { start: playStart, progressed, duration: art.duration, width: art.video.videoWidth, height: art.video.videoHeight }
    check('MEDIA.time-advances', progressed > playStart && !art.video.paused)
    phase = 'pause'
    let pauseResult
    await eventAfter(art, 'video:pause', () => { pauseResult = art.pause() })
    const pausedAt = art.currentTime
    let maxDelta = 0
    const pausedWindow = await observeFrames(() => { maxDelta = Math.max(maxDelta, Math.abs(art.currentTime - pausedAt)) })
    report.observations.pause = { at: pausedAt, observedMs: pausedWindow, maxDelta }
    check('MEDIA.pause-sync-stable', pauseResult === undefined && art.video.paused && maxDelta < 0.02)
    phase = 'seek'
    const target = Math.min(2, art.duration / 3)
    await eventAfter(art, 'video:seeked', () => { art.seek = target })
    check('MEDIA.seek', Math.abs(art.currentTime - target) < 0.1)

    phase = 'quality-paused'
    const qualityResult = await bounded(art.switchQuality('/assets/sample/video2.mp4'), 'paused quality switch')
    check('MEDIA.quality-preserves-time', qualityResult === undefined && art.video.paused && Math.abs(art.currentTime - target) < 0.1)
    phase = 'url-playing'
    await bounded(art.play(), 'resume')
    await advance(art, art.currentTime)
    const switchResult = await bounded(art.switchUrl('/assets/sample/video.mp4?normal-switch'), 'playing URL switch')
    check('MEDIA.url-resets-resumes', switchResult === undefined && !art.video.paused && art.currentTime < 1)
    await advance(art, art.currentTime)
    art.pause()
    check('LIFE.ready-once-after-switches', readyCount === 1)
    report.observations.readyCallbacks = readyCount
    report.observations.restarts = report.trace.filter(item => item.event === 'restart').map(item => item.argument)
    check('LIFE.restart-url', report.observations.restarts.includes('/assets/sample/video2.mp4') && report.observations.restarts.includes('/assets/sample/video.mp4?normal-switch'))

    phase = 'controlled-play-rejection'
    const playError = new Error('controlled media play rejection')
    let publicRejection
    art.video.play = () => Promise.reject(playError)
    try { await bounded(art.play(), 'controlled public rejection') } catch (error) { publicRejection = error }
    finally { delete art.video.play }
    check('MEDIA.play-rejects-original', publicRejection === playError)
    phase = 'controlled-resume-rejection'
    await bounded(art.play(), 'play before rejected resume')
    await advance(art, art.currentTime)
    const resumeError = new Error('controlled switch resume rejection')
    expectedRejections.add(resumeError)
    let resumeSwitchState = 'pending'
    art.video.play = () => Promise.reject(resumeError)
    try {
      await eventAfter(art, 'video:canplay', () => {
        art.switchUrl('/assets/sample/video2.mp4?resume-rejection').then(() => { resumeSwitchState = 'fulfilled' }, () => { resumeSwitchState = 'rejected' })
      })
      const observedMs = await observeFrames(() => {})
      report.observations.rejectedResume = { mode: 'controlled video.play rejection after real canplay', switchState: resumeSwitchState, observedMs, expectedUnhandled: report.observations.expectedUnhandled.length }
      if (resumeSwitchState === 'pending' && report.observations.expectedUnhandled.length) report.findings.push({ id: 'BASE-LIFE-06', observation: 'Published switch leaves an unhandled rejection and an unsettled promise when resume fails', owner: 'CORE-09' })
    }
    finally { delete art.video.play }
    art.pause()

    phase = 'plugins'
    let pluginContext
    let pluginArgument
    const pluginPromise = art.plugins.add(function (value) { pluginContext = this; pluginArgument = value; return Promise.resolve({ name: 'asyncProbe' }) })
    check('PLUGIN.async-promise', pluginPromise instanceof Promise && !Object.hasOwn(art.plugins, 'asyncProbe'))
    check('PLUGIN.async-registry', await bounded(pluginPromise, 'async plugin') === art.plugins && pluginContext === art && pluginArgument === art)
    let duplicate
    try { art.plugins.add(() => ({ name: 'asyncProbe' })) } catch (error) { duplicate = error }
    check('PLUGIN.duplicate-throws', duplicate instanceof Error && art.plugins.asyncProbe.name === 'asyncProbe')

    phase = 'concurrent-switch'
    const first = art.switchUrl('/assets/sample/video.mp4?race-first')
    const last = art.switchUrl('/assets/sample/video2.mp4?race-last')
    const outcomes = await bounded(Promise.allSettled([first, last]), 'concurrent switches')
    report.observations.concurrentSwitch = { outcomes: outcomes.map(item => item.status), finalSource: art.video.getAttribute('src'), canplayEvents: report.trace.filter(item => item.phase === phase && item.event === 'video:canplay').length }
    check('MEDIA.latest-source', outcomes[1].status === 'fulfilled' && art.url.endsWith('video2.mp4?race-last'))
    if (outcomes[0].status === 'fulfilled') report.findings.push({ id: 'BASE-LIFE-01', observation: 'Superseded switch resolves along with the latest source', owner: 'CORE-09' })

    phase = 'destroy-pending'
    let pendingState = 'pending'
    art.switchUrl('/assets/sample/video.mp4?destroy-pending').then(() => { pendingState = 'fulfilled' }, () => { pendingState = 'rejected' })
    let finishPlugin
    const latePlugin = art.plugins.add(() => new Promise(resolve => { finishPlugin = resolve }))
    let listenerCalls = 0
    art.proxy(art.video, 'baseline-listener', () => { listenerCalls += 1 })
    art.video.dispatchEvent(new Event('baseline-listener'))
    const retainedNode = art.template.$player
    art.destroy(false)
    art.video.dispatchEvent(new Event('baseline-listener'))
    check('LIFE.destroy-retains-markup', retainedNode.isConnected && retainedNode.classList.contains('art-destroy'))
    check('LIFE.destroy-cleans-proxy', listenerCalls === 1 && art.events.destroyEvents.size === 0 && !Artplayer.instances.includes(art) && art.isDestroy)
    finishPlugin({ name: 'lateProbe' })
    await bounded(latePlugin, 'late plugin')
    const pendingWindow = await observeFrames(() => {})
    report.observations.destroyPending = { switchState: pendingState, observedMs: pendingWindow, latePluginRegistered: Object.hasOwn(art.plugins, 'lateProbe') }
    if (pendingState === 'pending') report.findings.push({ id: 'BASE-LIFE-02', observation: 'Switch remains unsettled during the bounded observation after destroy', owner: 'CORE-09' })
    if (report.observations.destroyPending.latePluginRegistered) report.findings.push({ id: 'BASE-LIFE-03', observation: 'Async plugin registers its result after destroy', owner: 'CORE-08' })

    phase = 'duplicate-destroy'
    const removed = create()
    const survivor = create()
    removed.destroy(true)
    check('LIFE.destroy-removes-markup', removed.template.$container.childElementCount === 0)
    const survivorBefore = Artplayer.instances.includes(survivor)
    removed.destroy(true)
    const survivorAfter = Artplayer.instances.includes(survivor)
    report.observations.repeatedDestroy = { survivorBefore, survivorAfter }
    if (survivorBefore && !survivorAfter) report.findings.push({ id: 'BASE-LIFE-04', observation: 'Destroying an instance twice unregisters a different live instance', owner: 'CORE-04' })
    survivor.destroy(true)

    phase = 'constructor-failure'
    let partial
    const failedContainer = document.createElement('div')
    document.getElementById('players').append(failedContainer)
    let initializationError
    try {
      new Artplayer({ container: failedContainer, url: '/assets/sample/video.mp4', muted: true, plugins: [value => { partial = value; throw new Error('expected initialization probe') }] })
    }
    catch (error) { initializationError = error }
    check('LIFE.constructor-plugin-error', initializationError?.message === 'expected initialization probe')
    report.observations.failedConstructor = { hasMarkup: Boolean(failedContainer.querySelector('.art-video-player')), listeners: partial?.events.destroyEvents.size, registered: Artplayer.instances.includes(partial) }
    if (partial) { players.push(partial); partial.destroy(true) }
    if (report.observations.failedConstructor.hasMarkup || report.observations.failedConstructor.listeners) report.findings.push({ id: 'BASE-LIFE-05', observation: 'Failed constructor leaves initialized markup/listeners until explicit probe cleanup', owner: 'CORE-04' })
  }
  catch (error) { report.errors.push({ phase, message: error.message }) }
  finally {
    for (const art of players) {
      if (!art.isDestroy) {
        try { art.destroy(true) } catch (error) { report.errors.push({ phase: 'cleanup', message: error.message }) }
      }
    }
    window.removeEventListener('unhandledrejection', unhandled)
  }
  report.observations.remainingInstances = Artplayer.instances.length
  const response = await fetch('/reports/lifecycle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(report) })
  document.getElementById('status').textContent = response.ok && !report.errors.length && !report.unhandled.length && report.checks.every(item => item.passed) ? `CAPTURE COMPLETE: ${report.checks.length} checks, ${report.findings.length} historical findings` : 'CAPTURE FAILED: inspect report'
  document.getElementById('result').textContent = JSON.stringify({ checks: report.checks, observations: report.observations, findings: report.findings, errors: report.errors, unhandled: report.unhandled }, null, 2)
})

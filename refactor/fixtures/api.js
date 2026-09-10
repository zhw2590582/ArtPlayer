/* global Artplayer, artplayerPluginChapter */
(async () => {
  const report = { kind: 'public-api', environment: { userAgent: navigator.userAgent }, checks: [], errors: [] }
  const check = (name, result) => {
    report.checks.push({ name, passed: Boolean(result) })
    if (!result) throw new Error(name)
  }
  function descriptors(object) {
    return Object.fromEntries(Object.getOwnPropertyNames(object).sort().map((name) => {
      const d = Object.getOwnPropertyDescriptor(object, name)
      return [name, {
        enumerable: d.enumerable,
        configurable: d.configurable,
        ...(Object.hasOwn(d, 'value') ? { writable: d.writable, type: typeof d.value } : { get: typeof d.get, set: typeof d.set }),
      }]
    }))
  }
  function valueOf(input) {
    if (typeof input === 'function') return { $function: true }
    if (input === undefined) return { $undefined: true }
    if (typeof input === 'number' && !Number.isFinite(input)) return { $number: String(input) }
    if (Array.isArray(input)) return input.map(valueOf)
    if (input && typeof input === 'object') return Object.fromEntries(Object.keys(input).sort().map(key => [key, valueOf(input[key])]))
    return input
  }
  let art
  try {
    check('published core version', Artplayer.version === '5.4.0')
    const defaults = valueOf(Artplayer.option)
    art = new Artplayer({ container: '.player', url: '/assets/sample/video.mp4', muted: true, plugins: [artplayerPluginChapter()] })
    check('constructor registers exact instance', Artplayer.instances.includes(art))
    check('native media element exposed', art.video instanceof HTMLVideoElement)
    check('chapter registered synchronously', art.plugins.artplayerPluginChapter?.name === 'artplayerPluginChapter')
    const plugin = { name: 'baselineProbe', ping: () => 'pong' }
    const added = art.plugins.add(() => plugin)
    check('plugins.add returns synchronous registry', added === art.plugins)
    check('plugin result methods callable', art.plugins.baselineProbe.ping() === 'pong')
    let received = 0
    const handler = amount => { received += amount }
    check('on is chainable', art.on('baseline:event', handler) === art)
    art.emit('baseline:event', 3)
    art.off('baseline:event', handler)
    art.emit('baseline:event', 7)
    check('custom event on/emit/off', received === 3)
    const integrations = {}
    for (const name of ['template', 'events', 'controls', 'setting', 'contextmenu', 'layers', 'plugins', 'storage', 'subtitle', 'i18n']) {
      integrations[name] = { own: descriptors(art[name]), prototype: descriptors(Object.getPrototypeOf(art[name])) }
    }
    report.snapshot = {
      static: descriptors(Artplayer),
      prototype: descriptors(Artplayer.prototype),
      emitterPrototype: descriptors(Object.getPrototypeOf(Artplayer.prototype)),
      defaults,
      config: valueOf(Artplayer.config),
      utilityDescriptors: descriptors(Artplayer.utils),
      instance: descriptors(art),
      chapterFactory: descriptors(artplayerPluginChapter),
      chapterResult: descriptors(art.plugins.artplayerPluginChapter),
      integrations,
    }
  }
  catch (error) {
    report.errors.push(error.message)
  }
  finally {
    if (art) {
      art.destroy(true)
      report.checks.push({ name: 'instance cleanup', passed: !Artplayer.instances.includes(art) })
    }
  }
  const response = await fetch('/reports/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(report) })
  document.getElementById('status').textContent = response.ok && !report.errors.length && report.checks.every(c => c.passed) ? 'PASS: published API captured' : 'FAIL: inspect report'
  document.getElementById('result').textContent = JSON.stringify({ environment: report.environment, checks: report.checks, errors: report.errors }, null, 2)
})()

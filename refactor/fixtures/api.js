/* global Artplayer, artplayerPluginChapter */
(async () => {
  const report = {
    kind: 'public-api',
    environment: { userAgent: navigator.userAgent, language: navigator.language },
    scripts: [...document.scripts].map(script => new URL(script.src).pathname),
    checks: [], errors: [],
  }
  const check = (id, result) => {
    report.checks.push({ id, passed: Boolean(result) })
    if (!result) throw new Error(id)
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
  function resolvedDescriptors(object) {
    const result = new Map()
    for (let current = object; current && current !== Object.prototype; current = Object.getPrototypeOf(current)) {
      for (const [name, descriptor] of Object.entries(descriptors(current))) {
        if (!result.has(name)) result.set(name, descriptor)
      }
    }
    return Object.fromEntries([...result].sort(([a], [b]) => a.localeCompare(b)))
  }
  let art
  try {
    check('API-01.version', Artplayer.version === '5.4.0')
    const defaults = valueOf(Artplayer.option)
    check('API-01.defaults-independent', Artplayer.option !== Artplayer.option && Artplayer.option.subtitle !== Artplayer.option.subtitle)
    check('API-01.default-language', defaults.lang === navigator.language.toLowerCase())
    defaults.lang = { $environment: 'navigator.language.toLowerCase()' }
    const constants = Object.fromEntries(Object.getOwnPropertyNames(Artplayer).sort()
      .filter(name => /^[A-Z_]+$/.test(name) && name !== 'STYLE')
      .map(name => [name, valueOf(Artplayer[name])]))
    art = new Artplayer({ container: '.player', url: '/assets/sample/video.mp4', muted: true, plugins: [artplayerPluginChapter()] })
    check('API-01.instance-registration', Artplayer.instances.includes(art))
    check('API-01.container-selector', art.template.$container === document.querySelector('.player'))
    check('API-02.video', art.video instanceof HTMLVideoElement && art.video === art.template.$video)
    const query = art.query
    check('API-02.bound-query', query('.art-video') === art.video)
    check('API-06.sync-chapter', art.plugins.artplayerPluginChapter?.name === 'artplayerPluginChapter')
    const plugin = { name: 'baselineProbe', ping: () => 'pong' }
    const added = art.plugins.add(() => plugin)
    check('API-06.add-return', added === art.plugins)
    check('API-06.result-call', art.plugins.baselineProbe.ping() === 'pong')
    let received = 0
    const handler = amount => { received += amount }
    check('API-04.on-return', art.on('baseline:event', handler) === art)
    art.emit('baseline:event', 3)
    art.off('baseline:event', handler)
    art.emit('baseline:event', 7)
    check('API-04.off', received === 3)
    const integrations = {}
    for (const name of ['template', 'events', 'controls', 'setting', 'contextmenu', 'layers', 'plugins', 'storage', 'subtitle', 'i18n']) {
      integrations[name] = { own: descriptors(art[name]), prototype: descriptors(Object.getPrototypeOf(art[name])), resolved: resolvedDescriptors(art[name]) }
    }
    report.snapshot = {
      static: descriptors(Artplayer),
      prototype: descriptors(Artplayer.prototype),
      emitterPrototype: descriptors(Object.getPrototypeOf(Artplayer.prototype)),
      defaults,
      constants,
      config: valueOf(Artplayer.config),
      utilityDescriptors: descriptors(Artplayer.utils),
      instance: descriptors(art),
      instanceResolved: resolvedDescriptors(art),
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
      try {
        check('API-05.destroy-return', art.destroy(true) === undefined)
        check('API-05.instance-cleanup', !Artplayer.instances.includes(art))
      }
      catch (error) {
        report.errors.push(error.message)
      }
    }
  }
  const response = await fetch('/reports/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(report) })
  document.getElementById('status').textContent = response.ok && !report.errors.length && report.checks.every(c => c.passed) ? 'PASS: published API captured' : 'FAIL: inspect report'
  document.getElementById('result').textContent = JSON.stringify({ environment: report.environment, checks: report.checks, errors: report.errors }, null, 2)
})()

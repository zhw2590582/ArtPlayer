/* global Artplayer, artplayerPluginChapter */
document.querySelector('#run').onclick = async () => {
  const report = { kind: 'ssr', environment: { userAgent: navigator.userAgent, language: navigator.language }, scripts: [...document.scripts].map(script => new URL(script.src).pathname), checks: [], errors: [], unhandled: [] }
  const check = (id, passed) => { report.checks.push({ id, passed: Boolean(passed) }); if (!passed) throw new Error(id) }
  const onError = event => report.errors.push(event.message)
  const onUnhandled = event => report.unhandled.push(String(event.reason))
  addEventListener('error', onError)
  addEventListener('unhandledrejection', onUnhandled)
  let art
  try {
    const container = document.querySelector('.player')
    container.innerHTML = Artplayer.html
    const player = container.querySelector('.art-video-player')
    const video = container.querySelector('.art-video')
    player.dataset.serverMarker = 'preserved'
    art = new Artplayer({ container, url: '/assets/sample/video.mp4', useSSR: true, muted: true, plugins: [artplayerPluginChapter({})] })
    check('SSR.browser-reuses-player', art.template.$player === player && player.dataset.serverMarker === 'preserved')
    check('SSR.browser-reuses-video', art.video === video && container.querySelectorAll('.art-video-player').length === 1)
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('SSR ready timeout')), 10000)
      art.once('ready', () => { clearTimeout(timer); resolve() })
    })
    check('SSR.browser-ready', art.isReady && video.videoWidth > 0 && video.duration > 0)
    check('SSR.browser-plugin', art.plugins.artplayerPluginChapter.name === 'artplayerPluginChapter')
    report.observations = { videoWidth: video.videoWidth, duration: video.duration, serverMarker: player.dataset.serverMarker }
    art.destroy()
    check('SSR.browser-cleanup', container.children.length === 0 && Artplayer.instances.length === 0)
  }
  catch (error) { report.errors.push(error.message) }
  finally {
    if (art && Artplayer.instances.includes(art)) art.destroy()
    removeEventListener('error', onError)
    removeEventListener('unhandledrejection', onUnhandled)
  }
  document.querySelector('#result').textContent = JSON.stringify(report, null, 2)
  const response = await fetch('/reports/ssr', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(report) })
  document.querySelector('#status').textContent = response.ok ? `Saved ${report.checks.length} checks; errors ${report.errors.length}` : 'Save failed'
  document.querySelector('#run').disabled = true
}

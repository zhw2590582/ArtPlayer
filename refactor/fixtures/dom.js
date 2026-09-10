/* global Artplayer, artplayerPluginChapter */
(() => {
  const report = {
    kind: 'dom', environment: { userAgent: navigator.userAgent, language: navigator.language },
    scripts: [...document.scripts].map(script => new URL(script.src).pathname),
    checks: [], errors: [], unhandled: [], interactions: [], observations: {},
  }
  const status = document.querySelector('#status')
  const check = (id, passed) => {
    if (report.checks.some(item => item.id === id)) return
    report.checks.push({ id, passed: Boolean(passed) })
    if (!passed) throw new Error(id)
    status.textContent = report.checks.map(item => item.id).join(' | ')
  }
  addEventListener('error', event => report.errors.push(event.message))
  addEventListener('unhandledrejection', event => report.unhandled.push(String(event.reason)))
  function tree(element) {
    return {
      tag: element.tagName.toLowerCase(),
      attributes: Object.fromEntries([...element.attributes].filter(attr => /^(class|role|aria-.+|tabindex|data-tooltip|type)$/.test(attr.name)).map(attr => [attr.name, attr.value])),
      children: element.tagName.toLowerCase() === 'svg' ? [] : [...element.children].map(tree),
    }
  }
  function layout() {
    const player = art.template.$player
    const rect = player.getBoundingClientRect()
    return {
      width: rect.width, height: rect.height, scrollWidth: player.scrollWidth,
      controls: [...player.querySelectorAll('.art-control')].map(el => {
        const r = el.getBoundingClientRect()
        return { class: el.className, width: Math.round(r.width * 100) / 100, withinPlayer: r.left >= rect.left - 1 && r.right <= rect.right + 1, display: getComputedStyle(el).display }
      }),
    }
  }
  const art = new Artplayer({
    container: '.player', url: '/assets/sample/video.mp4', muted: true, lang: 'en',
    setting: true, playbackRate: true, aspectRatio: true, fullscreenWeb: true, hotkey: true,
    controls: [{ name: 'compat', position: 'right', html: 'Probe control', tooltip: 'Probe control', click(component, event) {
      check('DOM.control-click', this === art && component === art.controls && event.isTrusted)
    } }],
    layers: [{ name: 'compat', html: '<label class="user-hook">User layer <input aria-label="Typing probe" value="abc"></label>', style: { top: '12px', left: '12px' } }],
    settings: [{ name: 'compat-setting', html: 'Baseline selector', selector: [{ html: 'Low', default: true }, { html: 'High' }], onSelect(item, element, event) {
      check('DOM.setting-select', this === art && item.html === 'High' && element.classList.contains('art-current') && event.isTrusted)
      report.observations.selected = { html: item.html, defaults: item.$parent.selector.map(value => value.default) }
      return item.html
    } }],
    plugins: [artplayerPluginChapter({ chapters: [{ start: 0, end: 10, title: 'First' }, { start: 10, end: Infinity, title: 'Second' }] })],
  })
  let ready = false
  art.once('ready', () => {
    check('DOM.version-template', Artplayer.version === '5.4.0' && art.query('.art-video') === art.video)
    art.cssVar('--art-theme', 'rgb(1, 2, 3)')
    check('DOM.user-style', getComputedStyle(art.query('.user-hook')).color === 'rgb(12, 34, 56)' && art.cssVar('--art-theme').trim() === 'rgb(1, 2, 3)')
    const chapters = [...art.query('.art-chapters').children].map(el => ({ class: el.className, start: Number(el.dataset.start), end: Number(el.dataset.end), title: el.dataset.title }))
    check('DOM.chapter-markup', chapters.length === 2 && chapters[0].title === 'First' && chapters[1].title === 'Second')
    report.snapshot = {
      template: Artplayer.html, tree: tree(art.template.$player),
      cssVariables: [...new Set(Artplayer.STYLE.match(/--art-[\w-]+/g))].sort(),
      cssClasses: [...new Set(Artplayer.STYLE.match(/\.art-[\w-]+/g))].sort(),
      chapters,
      controlAttributes: [...art.template.$player.querySelectorAll('.art-control')].map(el => ({ class: el.className, tag: el.tagName, tabIndex: el.tabIndex, role: el.getAttribute('role'), ariaLabel: el.getAttribute('aria-label'), tooltip: el.getAttribute('data-tooltip'), title: el.getAttribute('title') })),
      chapterStylePresent: Boolean(document.getElementById('artplayer-plugin-chapter')),
    }
    report.observations.wide = layout()
    ready = true
  })
  let beforeKey
  let hotkeys = 0
  document.addEventListener('keydown', event => {
    beforeKey = { time: art.currentTime, hotkeys, focused: art.isFocus, target: event.target.tagName, code: event.code, trusted: event.isTrusted }
  }, true)
  art.on('hotkey', () => hotkeys++)
  document.addEventListener('keydown', event => {
    if (!ready) return
    const after = { ...beforeKey, afterTime: art.currentTime, afterHotkeys: hotkeys, activeTag: document.activeElement.tagName, activeLabel: document.activeElement.getAttribute('aria-label') }
    report.interactions.push(after)
    if (event.code === 'ArrowRight' && beforeKey.target !== 'INPUT') check('DOM.keyboard-seek', beforeKey.trusted && beforeKey.focused && hotkeys === beforeKey.hotkeys + 1 && Math.abs(art.currentTime - beforeKey.time - Artplayer.SEEK_STEP) < 0.05)
    if (event.code === 'ArrowRight' && beforeKey.target === 'INPUT') check('DOM.input-ignores-hotkey', beforeKey.trusted && beforeKey.focused && hotkeys === beforeKey.hotkeys && art.currentTime === beforeKey.time)
  })
  document.addEventListener('focusin', event => report.interactions.push({ focus: event.target.tagName, label: event.target.getAttribute('aria-label'), id: event.target.id }))
  art.on('fullscreenWeb', value => {
    if (value) check('DOM.fullscreen-web-enter', art.template.$player.parentElement === document.body && art.template.$player.classList.contains('art-fullscreen-web'))
    else check('DOM.fullscreen-web-exit', art.template.$player.parentElement === art.template.$container && !art.template.$player.classList.contains('art-fullscreen-web'))
  })
  document.querySelector('#narrow').onclick = () => {
    document.querySelector('.player').style.cssText = 'width:320px;height:180px'
    requestAnimationFrame(() => {
      report.observations.narrow = layout()
      check('DOM.narrow-container', report.observations.narrow.width === 320 && report.observations.narrow.height === 180)
    })
  }
  document.querySelector('#finish').onclick = async () => {
    try {
      const previous = art.controls.compat
      const updateResult = art.controls.update({ name: 'compat', html: 'Updated control' })
      const replacement = art.controls.compat
      check('DOM.control-update', updateResult === undefined && replacement instanceof HTMLElement && !previous.isConnected && art.template.$player.querySelectorAll('.art-control-compat').length === 1)
      art.controls.remove('compat')
      check('DOM.control-remove', !replacement.isConnected && !art.controls.compat)
      art.setting.update({ name: 'compat-setting', html: 'Updated selector' })
      check('DOM.setting-update', art.setting.find('compat-setting').html === 'Updated selector')
      art.setting.remove('compat-setting')
      check('DOM.setting-remove', !art.setting.find('compat-setting'))
      art.layers.remove('compat')
      check('DOM.layer-remove', !art.query('.user-hook'))
      art.destroy()
      check('DOM.destroy', document.querySelector('.player').children.length === 0 && Artplayer.instances.length === 0)
    }
    catch (error) {
      report.errors.push(error.message)
      if (Artplayer.instances.includes(art)) art.destroy()
    }
    report.checks.sort((a, b) => a.id.localeCompare(b.id))
    document.querySelector('#result').textContent = JSON.stringify(report, null, 2)
    const response = await fetch('/reports/dom', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(report) })
    status.textContent = response.ok ? `Saved ${report.checks.length} checks; errors ${report.errors.length}` : `Save failed: ${response.status}`
    document.querySelector('#finish').disabled = true
  }
})()

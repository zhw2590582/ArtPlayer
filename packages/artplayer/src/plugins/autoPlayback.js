import { append, query, secondToTime, setStyle, silencePromise } from '../utils'

export default function autoPlayback(art) {
  const {
    i18n,
    icons,
    storage,
    constructor,
    proxy,
    template: { $poster },
  } = art

  const $autoPlayback = art.layers.add({
    name: 'auto-playback',
    html: `
            <div class="art-auto-playback-close"></div>
            <div class="art-auto-playback-last"></div>
            <div class="art-auto-playback-jump"></div>
        `,
  })

  const $last = query('.art-auto-playback-last', $autoPlayback)
  const $jump = query('.art-auto-playback-jump', $autoPlayback)
  const $close = query('.art-auto-playback-close', $autoPlayback)
  append($close, icons.close)

  let timer = null
  let lastSeenTime = 0
  let lastSaved = 0

  art.on('video:timeupdate', () => {
    if (!art.playing)
      return
    const now = Date.now()
    if (now - lastSaved < 3000)
      return
    lastSaved = now
    const times = storage.get('times') || {}
    const keys = Object.keys(times)
    if (keys.length > constructor.AUTO_PLAYBACK_MAX) {
      delete times[keys[0]]
    }
    times[art.option.id || art.option.url] = art.currentTime
    storage.set('times', times)
  })

  proxy($close, 'click', () => {
    setStyle($autoPlayback, 'display', 'none')
  })

  proxy($jump, 'click', () => {
    if (lastSeenTime < constructor.AUTO_PLAYBACK_MIN)
      return
    // Jump restores the position recorded when the popup was shown, not the
    // live playhead (which kept moving while the popup was visible).
    art.seek = lastSeenTime
    silencePromise(art.play())
    setStyle($poster, 'display', 'none')
    setStyle($autoPlayback, 'display', 'none')
  })

  function init() {
    const times = storage.get('times') || {}
    lastSeenTime = times[art.option.id || art.option.url] || 0

    clearTimeout(timer)
    setStyle($autoPlayback, 'display', 'none')

    if (lastSeenTime && lastSeenTime >= constructor.AUTO_PLAYBACK_MIN) {
      setStyle($autoPlayback, 'display', 'flex')

      $last.textContent = `${i18n.get('Last Seen')} ${secondToTime(lastSeenTime)}`
      $jump.textContent = i18n.get('Jump Play')

      art.once('video:timeupdate', () => {
        timer = setTimeout(() => {
          setStyle($autoPlayback, 'display', 'none')
        }, constructor.AUTO_PLAYBACK_TIMEOUT)
      })
    }
  }

  art.on('ready', init)
  art.on('restart', init)

  return {
    name: 'auto-playback',
    get times() {
      return storage.get('times') || {}
    },
    clear() {
      return storage.del('times')
    },
    delete(id) {
      const times = storage.get('times') || {}
      delete times[id]
      storage.set('times', times)
      return times
    },
  }
}

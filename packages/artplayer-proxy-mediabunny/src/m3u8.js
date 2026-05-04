import $audio from '../../artplayer-plugin-hls-control/src/audio.svg?raw'
import $quality from '../../artplayer-plugin-hls-control/src/quality.svg?raw'

function uniqBy(array, property) {
  const seen = new Map()
  return array.filter((item) => {
    const key = item[property]
    if (key === undefined) {
      return true
    }
    return !seen.has(key) && seen.set(key, 1)
  })
}

export function setupM3u8Controls({ art, shim, option }) {
  if (!option.m3u8)
    return

  function removeControl(name) {
    if (art.controls.cache.has(name)) {
      art.controls.remove(name)
    }
  }

  function removeSetting(name) {
    if (art.setting.find(name)) {
      art.setting.remove(name)
    }
  }

  function clearQuality() {
    removeControl('mediabunny-quality')
    removeSetting('mediabunny-quality')
  }

  function clearAudio() {
    removeControl('mediabunny-audio')
    removeSetting('mediabunny-audio')
  }

  function canRender(config = {}) {
    return config.control || config.setting
  }

  async function updateQuality(state) {
    const config = option.m3u8?.quality || {}
    if (!canRender(config) || !state?.levels.length) {
      clearQuality()
      return
    }

    const auto = config.auto || 'Auto'
    const title = config.title || 'Quality'
    const getName = config.getName || (level => level.name || `${level.height}P`)
    const defaultHtml = state.currentLevel
      ? getName(state.currentLevel)
      : auto

    const selector = uniqBy(
      state.levels.map((item) => {
        return {
          html: getName(item),
          value: item.id,
          default: state.currentLevel?.id === item.id,
        }
      }),
      'html',
    ).sort((a, b) => {
      const left = state.levels.find(item => item.id === a.value)
      const right = state.levels.find(item => item.id === b.value)
      return (right?.height || 0) - (left?.height || 0)
    })

    selector.push({
      html: auto,
      value: 'auto',
      default: !state.currentLevel,
    })

    const onSelect = async (item) => {
      await shim.switchM3u8Quality(item.value)
      art.notice.show = `${title}: ${item.html}`
      await update()
      return item.html
    }

    if (config.control) {
      art.controls.update({
        name: 'mediabunny-quality',
        position: 'right',
        html: defaultHtml,
        style: { padding: '0 10px' },
        selector,
        onSelect,
      })
    }

    if (config.setting) {
      art.setting.update({
        name: 'mediabunny-quality',
        tooltip: defaultHtml,
        html: title,
        icon: $quality,
        width: 200,
        selector,
        onSelect,
      })
    }
  }

  async function updateAudio(state) {
    const config = option.m3u8?.audio || {}
    if (!canRender(config) || !state?.audios.length || state.audios.length < 2) {
      clearAudio()
      return
    }

    const auto = config.auto || 'Auto'
    const title = config.title || 'Audio'
    const getName = config.getName || (track => track.name || track.lang || track.language)
    const defaultHtml = state.currentAudio
      ? getName(state.currentAudio)
      : auto

    const selector = uniqBy(
      state.audios.map((item) => {
        return {
          html: getName(item),
          value: item.id,
          default: state.currentAudio?.id === item.id,
        }
      }),
      'html',
    )

    selector.push({
      html: auto,
      value: 'auto',
      default: !state.currentAudio,
    })

    const onSelect = async (item) => {
      await shim.switchM3u8Audio(item.value)
      art.notice.show = `${title}: ${item.html}`
      await update()
      return item.html
    }

    if (config.control) {
      art.controls.update({
        name: 'mediabunny-audio',
        position: 'right',
        html: defaultHtml,
        style: { padding: '0 10px' },
        selector,
        onSelect,
      })
    }

    if (config.setting) {
      art.setting.update({
        name: 'mediabunny-audio',
        tooltip: defaultHtml,
        html: title,
        icon: $audio,
        width: 200,
        selector,
        onSelect,
      })
    }
  }

  async function update() {
    const state = await shim.getM3u8State()
    if (!state) {
      clearQuality()
      clearAudio()
      return
    }

    await Promise.all([
      updateQuality(state),
      updateAudio(state),
    ])
  }

  art.on('video:loadedmetadata', update)
  art.on('restart', update)

  return { update }
}

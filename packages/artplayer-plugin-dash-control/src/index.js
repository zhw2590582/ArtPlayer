import $audio from './audio.svg?raw'
import { audioModel, qualityModel } from './mapping'
import { createMenu } from './menu'
import $quality from './quality.svg?raw'

export default function artplayerPluginDashControl(option = {}) {
  return (art) => {
    const { $video } = art.template
    const { errorHandle } = art.constructor.utils
    let closed = false
    let revision = 0
    const quality = createMenu(art, 'dash-quality', $quality)
    const audio = createMenu(art, 'dash-audio', $audio)
    const subscriptions = []

    function clear(current = () => true) {
      let failure
      for (const cleanup of [quality.clear, audio.clear]) {
        if (!current())
          break
        try {
          cleanup()
        }
        catch (error) {
          failure ||= error
        }
      }
      if (failure)
        throw failure
    }

    function update() {
      if (closed || art.isDestroy)
        return
      const version = ++revision
      const dash = art.dash
      const current = () => !closed && !art.isDestroy && version === revision && art.dash === dash
      const valid = () => current() && dash.getVideoElement() === $video && current()
      try {
        errorHandle(dash.getVideoElement() === $video, 'Cannot find instance of DASH from "art.dash"')
        if (!current())
          return
        const qualityConfig = option.quality || {}
        const qualities = qualityModel(dash, qualityConfig, valid)
        if (!valid())
          return
        quality.update(qualityConfig, qualities, valid)
        if (!valid())
          return
        const audioConfig = option.audio || {}
        const tracks = audioModel(dash, audioConfig, valid)
        if (valid())
          audio.update(audioConfig, tracks, valid)
      }
      catch (error) {
        if (current()) {
          const cleanupVersion = ++revision
          try {
            clear(() => revision === cleanupVersion)
          }
          catch (cleanupError) {
            console.warn('ArtPlayer DASH cleanup failed:', cleanupError)
          }
        }
        throw error
      }
    }

    function destroy() {
      if (closed)
        return
      closed = true
      revision++
      let failure
      const actions = [clear, ...subscriptions.splice(0).map(([name, callback]) => () => art.off(name, callback))]
      for (const action of actions) {
        try {
          action()
        }
        catch (error) {
          failure ||= error
        }
      }
      if (failure)
        throw failure
    }

    try {
      for (const entry of [['ready', update], ['restart', update], ['destroy', destroy]]) {
        if (closed)
          break
        subscriptions.push(entry)
        art.on(...entry)
      }
    }
    catch (error) {
      try {
        destroy()
      }
      catch (cleanupError) {
        console.warn('ArtPlayer DASH subscription cleanup failed:', cleanupError)
      }
      throw error
    }
    return { name: 'artplayerPluginDashControl', update }
  }
}

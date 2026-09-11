import $audio from './audio.svg?raw'
import { audioModel, qualityModel } from './mapping'
import { createMenu } from './menu'
import $quality from './quality.svg?raw'
import { subscribeHls } from './sdk-events'

export default function artplayerPluginHlsControl(option = {}) {
  return (art) => {
    const { $video } = art.template
    const { errorHandle } = art.constructor.utils
    let closed = false
    let revision = 0
    let engine
    let unsubscribe = () => {}
    let selecting = 0
    let pending
    const retired = new WeakSet()
    const active = hls => !closed && !retired.has(hls) && art.hls === hls && hls.media === $video
    const quality = createMenu(art, 'hls-quality', 'currentLevel', $quality, active, select)
    const audio = createMenu(art, 'hls-audio', 'audioTrack', $audio, active, select)

    function select(callback) {
      selecting++
      let succeeded = false
      try {
        const result = callback()
        succeeded = true
        return result
      }
      finally {
        selecting--
        if (!selecting) {
          const hls = pending
          pending = undefined
          if (succeeded && hls)
            refresh(hls, false)
        }
      }
    }

    function refresh(hls, force) {
      if (!active(hls))
        return
      const version = ++revision
      const config = option.quality || {}
      const model = qualityModel(hls, config)
      if (!active(hls) || version !== revision)
        return
      quality.update(hls, config, model, force)
      if (!active(hls) || version !== revision)
        return
      const audioConfig = option.audio || {}
      const audioView = audioModel(hls, audioConfig)
      if (active(hls) && version === revision)
        audio.update(hls, audioConfig, audioView, force)
    }

    function update() {
      if (closed)
        return
      const hls = art.hls
      errorHandle(hls?.media === $video, 'Cannot find instance of HLS from "art.hls"')
      if (retired.has(hls))
        return
      if (engine !== hls) {
        unsubscribe()
        engine = hls
        try {
          unsubscribe = subscribeHls(hls, () => {
            if (selecting)
              pending = hls
            else
              refresh(hls, false)
          }, () => {
            retired.add(hls)
            unsubscribe()
            if (engine === hls) {
              engine = undefined
              if (!closed) {
                quality.clear()
                audio.clear()
              }
            }
          })
        }
        catch (error) {
          engine = undefined
          throw error
        }
      }
      refresh(hls, true)
    }

    function destroy() {
      if (closed)
        return
      closed = true
      revision++
      pending = undefined
      quality.invalidate()
      audio.invalidate()
      unsubscribe()
      art.off('ready', update)
      art.off('restart', update)
      art.off('destroy', destroy)
    }

    art.on('ready', update)
    art.on('restart', update)
    art.on('destroy', destroy)
    return { name: 'artplayerPluginHlsControl', update }
  }
}

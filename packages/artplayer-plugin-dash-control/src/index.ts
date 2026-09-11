import type Artplayer from 'artplayer'
import type { AudioTrack, Option, QualityLevel, Result } from '../types/artplayer-plugin-dash-control'
import type { AudioItem, Cleanup, EventName, Host, QualityItem, Valid } from './types'
import $audio from './audio.svg?raw'
import { audioModel, qualityModel } from './mapping'
import { createMenu } from './menu'
import $quality from './quality.svg?raw'
import { observeSDK } from './sdk-events'

export default function artplayerPluginDashControl<Level extends object = QualityLevel, Track extends object = AudioTrack>(option: Option<Level, Track> = {}) {
  return (player: Artplayer): Result => {
    // art.dash is caller-owned; update keeps the historical SDK/media validation boundary.
    const art = player as unknown as Host<Level, Track>
    const { $video } = art.template
    const { errorHandle } = art.constructor.utils
    let closed = false
    let revision = 0
    const quality = createMenu<QualityItem>(art, 'dash-quality', $quality)
    const audio = createMenu<AudioItem<Track>>(art, 'dash-audio', $audio)
    const subscriptions: [EventName, Cleanup][] = []
    const observer = observeSDK<Level, Track>({
      active: dash => !closed && !art.isDestroy && art.dash === dash,
      refresh: update,
      reset() {
        const version = ++revision
        clear(() => version === revision)
      },
    })

    function clear(current: Valid = () => true): void {
      let failure: unknown
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

    function update(): void {
      if (closed || art.isDestroy)
        return
      const version = ++revision
      const dash = art.dash!
      const current = () => !closed && !art.isDestroy && version === revision && art.dash === dash
      const valid = () => current() && dash.getVideoElement() === $video && current()
      try {
        errorHandle(dash.getVideoElement() === $video, 'Cannot find instance of DASH from "art.dash"')
        if (!current())
          return
        observer.bind(dash)
        if (!valid())
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
          for (const cleanup of [observer.release, () => clear(() => revision === cleanupVersion)]) {
            try {
              cleanup()
            }
            catch (cleanupError) {
              console.warn('ArtPlayer DASH cleanup failed:', cleanupError)
            }
          }
        }
        throw error
      }
    }

    function destroy(): void {
      if (closed)
        return
      closed = true
      revision++
      let failure: unknown
      const actions = [observer.release, clear, ...subscriptions.splice(0).map(([name, callback]) => () => art.off(name, callback))]
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
      const entries: [EventName, Cleanup][] = [['ready', update], ['restart', update], ['destroy', destroy]]
      for (const entry of entries) {
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

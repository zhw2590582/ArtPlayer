import type Artplayer from 'artplayer'
import type { Option, RuntimeResult, UpdateOption } from '../types/artplayer-plugin-audio-track'
import { createAudioTrack } from './track'

type AudioEvent = 'play' | 'pause' | 'seek' | 'destroy' | 'video:pause' | 'video:ended' | 'video:waiting' | 'video:emptied' | 'video:seeking' | 'video:seeked' | 'video:timeupdate' | 'video:ratechange' | 'video:volumechange' | 'video:playing'

export default function artplayerPluginAudioTrack(option: Option) {
  return (art: Artplayer): RuntimeResult => {
    const track = createAudioTrack(option)
    const { audio } = track
    const subscriptions: [AudioEvent, () => void][] = []
    let active = true

    function syncAudio() {
      if (art.video)
        track.sync(art.currentTime)
    }

    function listen(event: AudioEvent, callback: () => void) {
      const listener = () => {
        if (active)
          callback()
      }
      subscriptions.push([event, listener])
      art.on(event, listener)
    }

    function destroy() {
      if (!active)
        return
      active = false
      const failures: unknown[] = []
      for (const [event, listener] of subscriptions.splice(0)) {
        try {
          art.off(event, listener)
        }
        catch (error) { failures.push(error) }
      }
      try {
        track.destroy()
      }
      catch (error) { failures.push(error) }
      if (failures.length)
        throw failures[0]
    }

    try {
      listen('play', () => {
        syncAudio()
        track.play()
      })
      for (const event of ['pause', 'video:pause', 'video:ended', 'video:waiting', 'video:emptied', 'video:seeking'] as const)
        listen(event, track.pause)
      listen('seek', syncAudio)
      listen('video:seeked', () => {
        syncAudio()
        if (art.playing)
          track.play()
      })
      listen('video:timeupdate', () => {
        if (art.playing)
          syncAudio()
      })
      listen('video:ratechange', () => {
        audio.playbackRate = art.video.playbackRate
      })
      listen('video:volumechange', () => {
        audio.volume = art.volume
        audio.muted = art.muted
      })
      listen('video:playing', () => {
        if (art.playing) {
          syncAudio()
          track.play()
        }
      })
      listen('destroy', destroy)
      audio.volume = art.volume
      audio.muted = art.muted
      audio.playbackRate = art.video?.playbackRate || 1
    }
    catch (error) {
      try {
        destroy()
      }
      catch {}
      throw error
    }

    return {
      name: 'artplayerPluginAudioTrack',
      audio,
      update(newOption: UpdateOption) {
        if (active)
          track.update(newOption, art.playing)
      },
    }
  }
}

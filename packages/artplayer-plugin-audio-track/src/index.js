import { createAudioTrack } from './track'

export default function artplayerPluginAudioTrack(option) {
  return (art) => {
    const track = createAudioTrack(option)
    const { audio } = track
    const subscriptions = []
    let active = true

    function syncAudio() {
      if (art.video)
        track.sync(art.currentTime)
    }

    function listen(event, callback) {
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
      const failures = []
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
      for (const event of ['pause', 'video:pause', 'video:ended', 'video:waiting', 'video:emptied', 'video:seeking'])
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
      update(newOption) {
        if (active)
          track.update(newOption, art.playing)
      },
    }
  }
}

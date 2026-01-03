export default function artplayerPluginAudioTrack(option) {
  return (art) => {
    const { url, offset = 0, sync = 0.3 } = option

    if (!url) {
      return {
        name: 'artplayerPluginAudioTrack',
      }
    }

    const audio = new Audio()
    audio.src = url
    audio.preload = 'auto'

    function syncAudio() {
      if (!art.video)
        return

      const videoTime = art.currentTime
      const targetTime = videoTime + offset

      if (Math.abs(audio.currentTime - targetTime) > sync) {
        audio.currentTime = targetTime
      }
    }

    art.on('play', () => {
      syncAudio()
      audio.play().catch((err) => {
        console.warn(err)
      })
    })

    art.on('pause', () => {
      audio.pause()
    })

    art.on('seek', () => {
      syncAudio()
    })

    art.on('video:timeupdate', () => {
      if (art.playing) {
        syncAudio()
      }
    })

    art.on('video:ratechange', () => {
      audio.playbackRate = art.video.playbackRate
    })

    art.on('video:volumechange', () => {
      audio.volume = art.volume
      audio.muted = art.muted
    })

    art.on('destroy', () => {
      audio.pause()
      audio.src = ''
      audio.load()
    })

    audio.volume = art.volume
    audio.muted = art.muted
    audio.playbackRate = art.video?.playbackRate || 1

    return {
      name: 'artplayerPluginAudioTrack',
      audio,
    }
  }
}

if (typeof window !== 'undefined') {
  window.artplayerPluginAudioTrack = artplayerPluginAudioTrack
}

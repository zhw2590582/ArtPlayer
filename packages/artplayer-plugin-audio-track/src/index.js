export default function artplayerPluginAudioTrack(option) {
  return (art) => {
    let { url, offset = 0, sync = 0.3 } = option

    const audio = new Audio()
    audio.preload = 'auto'
    if (url) {
      audio.src = url
    }

    function syncAudio() {
      if (!art.video || !url)
        return

      const videoTime = art.currentTime
      const targetTime = videoTime + offset

      if (Math.abs(audio.currentTime - targetTime) > sync) {
        audio.currentTime = targetTime
      }
    }

    art.on('play', () => {
      if (!url)
        return
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

    function update(newOption) {
      if (newOption.url && newOption.url !== url) {
        url = newOption.url
        audio.src = url
        if (art.playing) {
          audio.play().catch(err => console.warn(err))
        }
      }

      if (newOption.offset !== undefined) {
        offset = newOption.offset
      }

      if (newOption.sync !== undefined) {
        sync = newOption.sync
      }
    }

    audio.volume = art.volume
    audio.muted = art.muted
    audio.playbackRate = art.video?.playbackRate || 1

    return {
      name: 'artplayerPluginAudioTrack',
      audio,
      update,
    }
  }
}

if (typeof window !== 'undefined') {
  window.artplayerPluginAudioTrack = artplayerPluginAudioTrack
}

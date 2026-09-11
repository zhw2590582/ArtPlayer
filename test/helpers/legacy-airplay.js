// Frozen own-source fixture: ccf77c4e packages/artplayer/src/player/airplayMix.js
// Original file SHA-256: b9ce49489e75045b6a1df4d8ed28f123c1b105ac4c04fefaabcffe4353ad004d
// Only the relative utils import is relocated; the function body is unchanged.
import { def } from '../../packages/artplayer/src/utils'

export default function airplayMix(art) {
  const {
    i18n,
    notice,
    proxy,
    template: { $video },
  } = art

  let available = true

  if (window.WebKitPlaybackTargetAvailabilityEvent && $video.webkitShowPlaybackTargetPicker) {
    proxy($video, 'webkitplaybacktargetavailabilitychanged', (event) => {
      switch (event.availability) {
        case 'available':
          available = true
          break
        case 'not-available':
          available = false
          break
      }
    })
  }
  else {
    available = false
  }

  def(art, 'airplay', {
    value() {
      if (available) {
        $video.webkitShowPlaybackTargetPicker()
        art.emit('airplay')
      }
      else {
        notice.show = i18n.get('AirPlay Not Available')
      }
    },
  })
}

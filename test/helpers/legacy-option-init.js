// Frozen own-source fixture: ccf77c4e packages/artplayer/src/player/optionInit.js
// Original file SHA-256: 9d1d9d276da2403a580498c62f947373e000d9cd6e4bef5831d272c3055b5592
// Only the relative utils import is relocated; the function body is unchanged.
import { clamp, setStyle } from '../../packages/artplayer/src/utils'

export default function optionInit(art) {
  const {
    option,
    storage,
    template: { $video, $poster },
  } = art

  for (const key in option.moreVideoAttr) {
    art.attr(key, option.moreVideoAttr[key])
  }

  if (option.muted) {
    art.muted = option.muted
  }

  if (option.volume) {
    $video.volume = clamp(option.volume, 0, 1)
  }

  const volumeStorage = storage.get('volume')
  if (typeof volumeStorage === 'number') {
    $video.volume = clamp(volumeStorage, 0, 1)
  }

  if (option.poster) {
    setStyle($poster, 'backgroundImage', `url(${option.poster})`)
  }

  if (option.autoplay) {
    $video.autoplay = option.autoplay
  }

  if (option.playsInline) {
    $video.playsInline = true
    $video['webkit-playsinline'] = true
  }

  if (option.theme) {
    option.cssVar['--art-theme'] = option.theme
  }

  for (const key in option.cssVar) {
    art.cssVar(key, option.cssVar[key])
  }

  art.url = option.url
}

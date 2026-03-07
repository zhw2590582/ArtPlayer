import { def, getIcon } from '../utils'
import airplay from './airplay.svg?raw'
import arrowLeft from './arrow-left.svg?raw'
import arrowRight from './arrow-right.svg?raw'
import aspectRatio from './aspect-ratio.svg?raw'
import check from './check.svg?raw'
import close from './close.svg?raw'
import config from './config.svg?raw'
import error from './error.svg?raw'
import flip from './flip.svg?raw'
import fullscreenOff from './fullscreen-off.svg?raw'
import fullscreenOn from './fullscreen-on.svg?raw'
import fullscreenWebOff from './fullscreen-web-off.svg?raw'
import fullscreenWebOn from './fullscreen-web-on.svg?raw'
import loading from './loading.svg?raw'
import lock from './lock.svg?raw'
import pause from './pause.svg?raw'
import pip from './pip.svg?raw'
import play from './play.svg?raw'
import playbackRate from './playback-rate.svg?raw'
import screenshot from './screenshot.svg?raw'
import setting from './setting.svg?raw'
import state from './state.svg?raw'
import switchOff from './switch-off.svg?raw'
import switchOn from './switch-on.svg?raw'
import unlock from './unlock.svg?raw'
import volumeClose from './volume-close.svg?raw'
import volume from './volume.svg?raw'

export default class Icons {
  constructor(art) {
    const icons = {
      loading,
      state,
      play,
      pause,
      check,
      volume,
      volumeClose,
      screenshot,
      setting,
      pip,
      arrowLeft,
      arrowRight,
      playbackRate,
      aspectRatio,
      config,
      lock,
      flip,
      unlock,
      fullscreenOff,
      fullscreenOn,
      fullscreenWebOff,
      fullscreenWebOn,
      switchOn,
      switchOff,
      error,
      close,
      airplay,
      ...art.option.icons,
    }

    for (const key in icons) {
      def(this, key, {
        get: () => getIcon(key, icons[key]),
      })
    }
  }
}

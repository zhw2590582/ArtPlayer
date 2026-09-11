import type { MediaSurface } from '../media/types'
import type { UrlHost } from '../source/types'
import { isClosing } from '../lifecycle/instance'
import airplayMix from './airplayMix'
import aspectRatioMix from './aspectRatioMix'
import attrMix from './attrMix'
import autoHeightMix from './autoHeightMix'
import autoSizeMix from './autoSizeMix'
import cssVarMix from './cssVarMix'
import currentTimeMix from './currentTimeMix'
import durationMix from './durationMix'
import eventInit from './eventInit'
import flipMix from './flipMix'
import fullscreenMix from './fullscreenMix'
import fullscreenWebMix from './fullscreenWebMix'
import loadedMix from './loadedMix'
import miniMix from './miniMix'
import optionInit from './optionInit'
import pauseMix from './pauseMix'
import pipMix from './pipMix'
import playbackRateMix from './playbackRateMix'
import playedMix from './playedMix'
import playingMix from './playingMix'
import playMix from './playMix'
import posterMix from './posterMix'
import qualityMix from './qualityMix'
import rectMix from './rectMix'
import screenshotMix from './screenshotMix'
import seekMix from './seekMix'
import stateMix from './stateMix'
import subtitleOffsetMix from './subtitleOffsetMix'
import switchMix from './switchMix'
import themeMix from './themeMix'
import thumbnailsMix from './thumbnailsMix'
import toggleMix from './toggleMix'
import typeMix from './typeMix'
import urlMix from './urlMix'
import volumeMix from './volumeMix'

// Installation requirements come from the owning modules. Some properties are
// installed here and consumed only by later callbacks, after construction.
type PlayerDependencies = Parameters<typeof airplayMix>[0]
  & Parameters<typeof aspectRatioMix>[0]
  & Parameters<typeof attrMix>[0]
  & Parameters<typeof autoHeightMix>[0]
  & Parameters<typeof autoSizeMix>[0]
  & Parameters<typeof cssVarMix>[0]
  & Parameters<typeof currentTimeMix>[0]
  & Parameters<typeof durationMix>[0]
  & Parameters<typeof eventInit>[0]
  & Parameters<typeof flipMix>[0]
  & Parameters<typeof fullscreenMix>[0]
  & Parameters<typeof fullscreenWebMix>[0]
  & Parameters<typeof loadedMix>[0]
  & Parameters<typeof miniMix>[0]
  & Parameters<typeof optionInit>[0]
  & Parameters<typeof pauseMix>[0]
  & Parameters<typeof pipMix>[0]
  & Parameters<typeof playbackRateMix>[0]
  & Parameters<typeof playedMix>[0]
  & Parameters<typeof playingMix>[0]
  & Parameters<typeof playMix>[0]
  & Parameters<typeof posterMix>[0]
  & Parameters<typeof qualityMix>[0]
  & Parameters<typeof rectMix>[0]
  & Parameters<typeof screenshotMix>[0]
  & Parameters<typeof seekMix>[0]
  & Parameters<typeof stateMix>[0]
  & Parameters<typeof subtitleOffsetMix>[0]
  & Parameters<typeof switchMix>[0]
  & Parameters<typeof themeMix>[0]
  & Parameters<typeof thumbnailsMix>[0]
  & Parameters<typeof toggleMix>[0]
  & Parameters<typeof typeMix>[0]
  & Parameters<typeof volumeMix>[0]

// The order is observable through descriptors, subscriptions and option writes.
const installers: readonly ((art: PlayerDependencies) => void)[] = [
  attrMix,
  playMix,
  pauseMix,
  toggleMix,
  seekMix,
  volumeMix,
  currentTimeMix,
  durationMix,
  switchMix,
  playbackRateMix,
  aspectRatioMix,
  screenshotMix,
  fullscreenMix,
  fullscreenWebMix,
  pipMix,
  loadedMix,
  playedMix,
  playingMix,
  autoSizeMix,
  rectMix,
  flipMix,
  miniMix,
  posterMix,
  autoHeightMix,
  cssVarMix,
  themeMix,
  typeMix,
  stateMix,
  subtitleOffsetMix,
  airplayMix,
  qualityMix,
  thumbnailsMix,
  eventInit,
  optionInit,
]

export type PlayerHost<Host> = UrlHost<MediaSurface, Host> & PlayerDependencies

export default class Player<Host extends PlayerHost<Host>> {
  constructor(art: Host) {
    if (isClosing(art))
      return
    urlMix<MediaSurface, Host>(art)
    for (const install of installers) {
      if (isClosing(art))
        return
      install(art)
    }
  }
}

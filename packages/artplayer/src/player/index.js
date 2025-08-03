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

export default class Player {
  constructor(art) {
    urlMix(art)
    attrMix(art)
    playMix(art)
    pauseMix(art)
    toggleMix(art)
    seekMix(art)
    volumeMix(art)
    currentTimeMix(art)
    durationMix(art)
    switchMix(art)
    playbackRateMix(art)
    aspectRatioMix(art)
    screenshotMix(art)
    fullscreenMix(art)
    fullscreenWebMix(art)
    pipMix(art)
    loadedMix(art)
    playedMix(art)
    playingMix(art)
    autoSizeMix(art)
    rectMix(art)
    flipMix(art)
    miniMix(art)
    posterMix(art)
    autoHeightMix(art)
    cssVarMix(art)
    themeMix(art)
    typeMix(art)
    stateMix(art)
    subtitleOffsetMix(art)
    airplayMix(art)
    qualityMix(art)
    thumbnailsMix(art)
    eventInit(art)
    optionInit(art)
  }
}

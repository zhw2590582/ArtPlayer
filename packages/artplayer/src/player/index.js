import attachUrlMix from './attachUrlMix';
import attrInit from './attrInit';
import eventInit from './eventInit';
import playMix from './playMix';
import pauseMin from './pauseMin';
import toggleMix from './toggleMix';
import seekMix from './seekMix';
import volumeMix from './volumeMix';
import currentTimeMix from './currentTimeMix';
import durationMix from './durationMix';
import switchQualityMix from './switchQualityMix';
import playbackRateMix from './playbackRateMix';
import aspectRatioMix from './aspectRatioMix';
import screenshotMix from './screenshotMix';
import fullscreenMix from './fullscreenMix';
import fullscreenWebMix from './fullscreenWebMix';
import pipMix from './pipMix';
import loadedMix from './loadedMix';
import playedMix from './playedMix';
import playingMix from './playingMix';
import autoSizeMix from './autoSizeMix';
import flipMix from './flipMix';

export default class Player {
    constructor(art) {
        attachUrlMix(art, this);
        eventInit(art, this);
        attrInit(art, this);
        playMix(art, this);
        pauseMin(art, this);
        toggleMix(art, this);
        seekMix(art, this);
        volumeMix(art, this);
        currentTimeMix(art, this);
        durationMix(art, this);
        switchQualityMix(art, this);
        playbackRateMix(art, this);
        aspectRatioMix(art, this);
        screenshotMix(art, this);
        fullscreenMix(art, this);
        fullscreenWebMix(art, this);
        pipMix(art, this);
        loadedMix(art, this);
        playedMix(art, this);
        playingMix(art, this);
        autoSizeMix(art, this);
        flipMix(art, this);
    }
}

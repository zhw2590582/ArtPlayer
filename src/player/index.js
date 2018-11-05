import attrInit from './attrInit';
import eventInit from './eventInit';
import playMix from './playMix';
import pauseMin from './pauseMin';
import toggleMix from './toggleMix';
import seekMix from './seekMix';
import volumeMix from './volumeMix';
import currentTimeMix from './currentTimeMix';
import durationMix from './durationMix';
import switchMix from './switchMix';
import playbackRateMix from './playbackRateMix';
import aspectRatioMix from './aspectRatioMix';

export default class Player {
  constructor(art) {
    this.reconnectTime = 0;
    this.maxReconnectTime = 5;

    attrInit(art, this);
    eventInit(art, this);
    playMix(art, this);
    pauseMin(art, this);
    toggleMix(art, this);
    seekMix(art, this);
    volumeMix(art, this);
    currentTimeMix(art, this);
    durationMix(art, this);
    switchMix(art, this);
    playbackRateMix(art, this);
    aspectRatioMix(art, this);
  }
}

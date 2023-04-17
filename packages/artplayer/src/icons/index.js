import { def, getIcon } from '../utils';
import loading from 'bundle-text:./loading.svg';
import state from 'bundle-text:./state.svg';
import check from 'bundle-text:./check.svg';
import play from 'bundle-text:./play.svg';
import pause from 'bundle-text:./pause.svg';
import volume from 'bundle-text:./volume.svg';
import volumeClose from 'bundle-text:./volume-close.svg';
import screenshot from 'bundle-text:./screenshot.svg';
import setting from 'bundle-text:./setting.svg';
import arrowLeft from 'bundle-text:./arrow-left.svg';
import arrowRight from 'bundle-text:./arrow-right.svg';
import playbackRate from 'bundle-text:./playback-rate.svg';
import aspectRatio from 'bundle-text:./aspect-ratio.svg';
import config from 'bundle-text:./config.svg';
import pip from 'bundle-text:./pip.svg';
import lock from 'bundle-text:./lock.svg';
import unlock from 'bundle-text:./unlock.svg';
import fullscreenOff from 'bundle-text:./fullscreen-off.svg';
import fullscreenOn from 'bundle-text:./fullscreen-on.svg';
import fullscreenWebOff from 'bundle-text:./fullscreen-web-off.svg';
import fullscreenWebOn from 'bundle-text:./fullscreen-web-on.svg';
import switchOn from 'bundle-text:./switch-on.svg';
import switchOff from 'bundle-text:./switch-off.svg';
import flip from 'bundle-text:./flip.svg';
import error from 'bundle-text:./error.svg';
import close from 'bundle-text:./close.svg';
import airplay from 'bundle-text:./airplay.svg';

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
        };

        for (const key in icons) {
            def(this, key, {
                get: () => getIcon(key, icons[key]),
            });
        }
    }
}

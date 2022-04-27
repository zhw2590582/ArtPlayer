import { append, def, addClass } from '../utils';
import loading from './loading.svg';
import state from './state.svg';
import check from './check.svg';
import play from './play.svg';
import pause from './pause.svg';
import volume from './volume.svg';
import volumeClose from './volume-close.svg';
import subtitle from './subtitle.svg';
import screenshot from './screenshot.svg';
import setting from './setting.svg';
import fullscreen from './fullscreen.svg';
import fullscreenWeb from './fullscreen-web.svg';
import arrowLeft from './arrow-left.svg';
import arrowRight from './arrow-right.svg';
import playbackRate from './playback-rate.svg';
import aspectRatio from './aspect-ratio.svg';
import config from './config.svg';
import pip from './pip.svg';
import lock from './lock.svg';
import unlock from './unlock.svg';
import fastForward from './fast-forward.svg';

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
            subtitle,
            screenshot,
            setting,
            fullscreen,
            fullscreenWeb,
            pip,
            arrowLeft,
            arrowRight,
            playbackRate,
            aspectRatio,
            config,
            lock,
            unlock,
            fastForward,
            ...art.option.icons,
        };

        Object.keys(icons).forEach((key) => {
            def(this, key, {
                get: () => {
                    const icon = document.createElement('i');
                    addClass(icon, 'art-icon');
                    addClass(icon, `art-icon-${key}`);
                    append(icon, icons[key]);
                    return icon;
                },
            });
        });
    }
}

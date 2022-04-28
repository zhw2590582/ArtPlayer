import { append, def, addClass } from '../utils';
import loading from 'bundle-text:./loading.svg';
import state from 'bundle-text:./state.svg';
import check from 'bundle-text:./check.svg';
import play from 'bundle-text:./play.svg';
import pause from 'bundle-text:./pause.svg';
import volume from 'bundle-text:./volume.svg';
import volumeClose from 'bundle-text:./volume-close.svg';
import subtitle from 'bundle-text:./subtitle.svg';
import screenshot from 'bundle-text:./screenshot.svg';
import setting from 'bundle-text:./setting.svg';
import fullscreen from 'bundle-text:./fullscreen.svg';
import fullscreenWeb from 'bundle-text:./fullscreen-web.svg';
import arrowLeft from 'bundle-text:./arrow-left.svg';
import arrowRight from 'bundle-text:./arrow-right.svg';
import playbackRate from 'bundle-text:./playback-rate.svg';
import aspectRatio from 'bundle-text:./aspect-ratio.svg';
import config from 'bundle-text:./config.svg';
import pip from 'bundle-text:./pip.svg';
import lock from 'bundle-text:./lock.svg';
import unlock from 'bundle-text:./unlock.svg';

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

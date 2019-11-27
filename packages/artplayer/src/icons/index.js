import { append } from '../utils';
import loading from './loading.svg';
import state from './state.svg';
import play from './play.svg';
import pause from './pause.svg';
import volume from './volume.svg';
import volumeClose from './volume-close.svg';
import subtitle from './subtitle.svg';
import screenshot from './screenshot.svg';
import setting from './setting.svg';
import fullscreen from './fullscreen.svg';
import fullscreenWeb from './fullscreen-web.svg';
import pip from './pip.svg';

export default class Icons {
    constructor(art) {
        const icons = Object.assign(
            {
                loading,
                state,
                play,
                pause,
                volume,
                volumeClose,
                subtitle,
                screenshot,
                setting,
                fullscreen,
                fullscreenWeb,
                pip,
            },
            art.option.icons,
        );

        Object.keys(icons).forEach(key => {
            const icon = document.createElement('i');
            icon.classList.add('art-icon');
            icon.classList.add(`art-icon-${key}`);
            append(icon, icons[key]);
            this[key] = icon;
        });
    }
}

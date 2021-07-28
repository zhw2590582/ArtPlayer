import { append, def, addClass } from '../utils';
import loading from './loading.svg';
import state from './state.svg';
import play from './play.svg';
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
        const icons = {
            loading,
            state,
            play,
            volume,
            volumeClose,
            subtitle,
            screenshot,
            setting,
            fullscreen,
            fullscreenWeb,
            pip,
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

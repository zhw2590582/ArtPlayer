import { errorHandle } from '../utils';
import loading from './loading.svg';
import playBig from './play-big.svg';
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
import prev from './prev.svg';
import next from './next.svg';

export default class Icons {
    constructor(art) {
        const icons = Object.assign(
            {
                loading,
                playBig,
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
                prev,
                next,
            },
            art.option.icons,
        );

        Object.keys(icons).forEach(key => {
            errorHandle(typeof icons[key] === 'string', 'Custom icon values ​​only support string types.');
            const icon = document.createElement('i');
            icon.classList.add('art-icon');
            icon.classList.add(`art-icon-${key}`);
            icon.innerHTML = icons[key];
            this[key] = icon;
        });
    }
}

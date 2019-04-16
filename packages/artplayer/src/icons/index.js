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

const icons = {};
const svgs = {
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
};

Object.keys(svgs).forEach(key => {
    Object.defineProperty(icons, key, {
        get() {
            const tmp = document.createElement('div');
            tmp.innerHTML = `<i class="art-icon art-icon-${key}">${svgs[key]}</i>`;
            return tmp.childNodes[0];
        },
    });
});

export default icons;

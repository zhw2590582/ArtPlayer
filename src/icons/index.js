import loading from './loading.svg';
import playBig from './play-big.svg';
import play from './play.svg';
import pause from './pause.svg';
import volume from './volume.svg';
import volumeClose from './volume-close.svg';
import subtitle from './subtitle.svg';
import subtitleClose from './subtitle-close.svg';
import screenshot from './screenshot.svg';
import danmu from './danmu.svg';
import danmuClose from './danmu-close.svg';

const icons = {
  loading,
  playBig,
  play,
  pause,
  volume,
  volumeClose,
  subtitle,
  subtitleClose,
  screenshot,
  danmu,
  danmuClose
};

function creatDomFromSvg(map) {
  const result = {};
  Object.keys(map).forEach(name => {
    const tmp = document.createElement('div');
    tmp.innerHTML = `<i class="art-icon art-icon-${name}">${map[name]}</i>`;
    [result[name]] = tmp.childNodes;
  });
  return result;
}

export default creatDomFromSvg(icons);

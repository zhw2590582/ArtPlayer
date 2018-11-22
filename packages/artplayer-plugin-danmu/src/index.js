import './index.scss';
import i18nMix from './i18nMix';
import contextmenuMix from './contextmenuMix';
import settingMix from './settingMix';
import ControlMix from './controlMix';

function artplayerPluginDanmu(Artplayer) {
    const art = Artplayer.prototype;
    i18nMix(art);
    contextmenuMix(art);
    settingMix(art);
    ControlMix(art);
}

window.artplayerPluginDanmu = artplayerPluginDanmu;
export default artplayerPluginDanmu;

import './index.scss';

function i18nMix() {
    //
}

function contextmenuMix(art) {
    //
}

function settingMix(art) {
    //
}

function controlMix(art) {
    //
}

function artplayerPluginDanmu(Artplayer) {
    const art = Artplayer.prototype;
    i18nMix(art);
    contextmenuMix(art);
    settingMix(art);
    controlMix(art);
}

window.artplayerPluginDanmu = artplayerPluginDanmu;
export default artplayerPluginDanmu;

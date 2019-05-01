import * as bilibili from './bilibiliDanmuParse';
import Danmuku from './danmuku';
import i18n from './i18n';
import settingOpacity from './settingOpacity';
import settingSpeed from './settingSpeed';
import settingSize from './settingSize';

function artplayerPluginDanmuku(option) {
    return art => {
        const danmuku = new Danmuku(art, option);
        art.i18n.update(i18n);
        art.setting.add(settingOpacity);
        art.setting.add(settingSpeed);
        art.setting.add(settingSize);
        return {
            name: 'artplayerPluginDanmuku',
            emit: danmuku.addToQueue.bind(danmuku),
            config: danmuku.config.bind(danmuku),
            start: danmuku.start.bind(danmuku),
            stop: danmuku.stop.bind(danmuku),
            hide: danmuku.hide.bind(danmuku),
            show: danmuku.show.bind(danmuku),
        };
    };
}

artplayerPluginDanmuku.bilibili = bilibili;
export default artplayerPluginDanmuku;

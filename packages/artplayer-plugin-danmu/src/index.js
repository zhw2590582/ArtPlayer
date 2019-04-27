import { bilibiliDanmuParseFromXml, bilibiliDanmuParseFromAv, bilibiliDanmuParseFromUrl } from './bilibiliDanmuParse';
import Danmuku from './danmuku';

function artplayerPluginDanmu(option) {
    return art => {
        const danmuku = new Danmuku(art, option);
        return {
            name: 'artplayerPluginDanmu',
            emit: danmuku.addToQueue.bind(danmuku),
            config: danmuku.config.bind(danmuku),
            start: danmuku.start.bind(danmuku),
            stop: danmuku.stop.bind(danmuku),
            hide: danmuku.hide.bind(danmuku),
            show: danmuku.show.bind(danmuku),
        };
    };
}

artplayerPluginDanmu.bilibiliDanmuParseFromXml = bilibiliDanmuParseFromXml;
artplayerPluginDanmu.bilibiliDanmuParseFromAv = bilibiliDanmuParseFromAv;
artplayerPluginDanmu.bilibiliDanmuParseFromUrl = bilibiliDanmuParseFromUrl;
window.artplayerPluginDanmu = artplayerPluginDanmu;
export default artplayerPluginDanmu;

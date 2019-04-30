import { bilibiliDanmuParseFromXml, bilibiliDanmuParseFromAv, bilibiliDanmuParseFromUrl } from './bilibiliDanmuParse';
import Danmuku from './danmuku';

function artplayerPluginDanmuku(option) {
    return art => {
        const danmuku = new Danmuku(art, option);
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

artplayerPluginDanmuku.bilibiliDanmuParseFromXml = bilibiliDanmuParseFromXml;
artplayerPluginDanmuku.bilibiliDanmuParseFromAv = bilibiliDanmuParseFromAv;
artplayerPluginDanmuku.bilibiliDanmuParseFromUrl = bilibiliDanmuParseFromUrl;
window.artplayerPluginDanmuku = artplayerPluginDanmuku;
export default artplayerPluginDanmuku;

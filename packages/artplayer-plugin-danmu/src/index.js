import Danmuku from './danmuku';
import bilibiliDanmuParse from './bilibiliDanmuParse';

function artplayerPluginDanmu(option) {
    return art => {
        const danmuku = new Danmuku(art, option);
        return {
            name: 'artplayerPluginDanmu',
            emit: danmuku.emit.bind(danmuku),
            start: danmuku.start.bind(danmuku),
            stop: danmuku.stop.bind(danmuku),
            hide: danmuku.hide.bind(danmuku),
            show: danmuku.show.bind(danmuku),
            config: danmuku.config.bind(danmuku),
        };
    };
}

artplayerPluginDanmu.bilibiliDanmuParse = bilibiliDanmuParse;
window.artplayerPluginDanmu = artplayerPluginDanmu;
export default artplayerPluginDanmu;

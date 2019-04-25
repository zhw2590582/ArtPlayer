import Danmuku from './danmuku';
import bilibiliDanmuParse from './bilibiliDanmuParse';

function artplayerPluginDanmu(option) {
    return art => {
        const danmuku = new Danmuku(art, option);
        return {
            name: 'artplayerPluginDanmu',
            emit: danmuku.emit,
            start: danmuku.start,
            stop: danmuku.stop,
            hide: danmuku.hide,
            show: danmuku.show,
            config: danmuku.config,
        };
    };
}

artplayerPluginDanmu.bilibiliDanmuParse = bilibiliDanmuParse;
window.artplayerPluginDanmu = artplayerPluginDanmu;
export default artplayerPluginDanmu;

import Danmuku from './danmuku';

export default function artplayerPluginDanmuku(option) {
    return art => {
        const danmuku = new Danmuku(art, option);
        return {
            name: 'artplayerPluginDanmuku',
            emit: danmuku.emit.bind(danmuku),
            config: danmuku.config.bind(danmuku),
            start: danmuku.start.bind(danmuku),
            stop: danmuku.stop.bind(danmuku),
            hide: danmuku.hide.bind(danmuku),
            show: danmuku.show.bind(danmuku),
        };
    };
}
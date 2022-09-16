import Danmuku from './danmuku';
import setting from './setting';

function checkVersion(art) {
    const {
        version,
        utils: { errorHandle },
    } = art.constructor;
    const arr = version.split('.').map(Number);
    const major = arr[0];
    const minor = arr[1] / 100;
    errorHandle(major + minor >= 4.04, `Artplayer.js@${version} 不兼容该弹幕库，请更新到 4.4.x 版本以上`);
}

export default function artplayerPluginDanmuku(option) {
    return (art) => {
        checkVersion(art);
        const danmuku = new Danmuku(art, option);
        setting(art, danmuku);
        return {
            name: 'artplayerPluginDanmuku',
            emit: danmuku.emit.bind(danmuku),
            load: danmuku.load.bind(danmuku),
            config: danmuku.config.bind(danmuku),
            hide: danmuku.hide.bind(danmuku),
            show: danmuku.show.bind(danmuku),
            reset: danmuku.reset.bind(danmuku),
            get option() {
                return danmuku.option;
            },
            get isHide() {
                return danmuku.isHide;
            },
            get isStop() {
                return danmuku.isStop;
            },
        };
    };
}

artplayerPluginDanmuku.env = process.env.NODE_ENV;
artplayerPluginDanmuku.version = process.env.APP_VER;
artplayerPluginDanmuku.build = process.env.BUILD_DATE;

if (typeof window !== 'undefined') {
    window['artplayerPluginDanmuku'] = artplayerPluginDanmuku;
}

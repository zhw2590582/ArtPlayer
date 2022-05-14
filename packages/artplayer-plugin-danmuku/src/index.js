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
    errorHandle(major + minor >= 4.04, `弹幕库：Artplayer.js@${version} 版本不兼容，请更新到 4.4.x 版本以上`);
}

export default function artplayerPluginDanmuku(option) {
    return (art) => {
        checkVersion(art);
        const danmuku = new Danmuku(art, option);
        setting(art, danmuku);
        return {
            name: 'artplayerPluginDanmuku',
            emit: danmuku.emit.bind(danmuku),
            config: danmuku.config.bind(danmuku),
            hide: danmuku.hide.bind(danmuku),
            show: danmuku.show.bind(danmuku),
            get isHide() {
                return danmuku.isHide;
            },
            get isStop() {
                return danmuku.isStop;
            },
        };
    };
}

window['artplayerPluginDanmuku'] = artplayerPluginDanmuku;

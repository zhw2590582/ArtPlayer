import Danmuku from './danmuku';
import Control from './control';

export default function artplayerPluginDanmuku(option) {
    return (art) => {
        const danmuku = new Danmuku(art, option);
        const control = new Control(art, danmuku);

        return {
            name: 'artplayerPluginDanmuku',
            emit: danmuku.emit.bind(danmuku),
            config: danmuku.config.bind(danmuku),
            hide: danmuku.hide.bind(danmuku),
            show: danmuku.show.bind(danmuku),
            mount: control.mount.bind(control),
            unmount: control.unmount.bind(control),
            get isHide() {
                return danmuku.isHide;
            },
        };
    };
}

window['artplayerPluginDanmuku'] = artplayerPluginDanmuku;

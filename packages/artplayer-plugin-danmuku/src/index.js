import Danmuku from './danmuku';
import setting from './setting';
import heatmap from './heatmap';

export default function artplayerPluginDanmuku(option) {
    return (art) => {
        const danmuku = new Danmuku(art, option);

        // 返回挂载函数，用于手动挂载
        const { mount } = setting(art, danmuku);

        if (option.heatmap) {
            heatmap(art, danmuku, option.heatmap);
        }

        return {
            name: 'artplayerPluginDanmuku',
            emit: danmuku.emit.bind(danmuku),
            load: danmuku.load.bind(danmuku),
            config: danmuku.config.bind(danmuku),
            hide: danmuku.hide.bind(danmuku),
            show: danmuku.show.bind(danmuku),
            reset: danmuku.reset.bind(danmuku),
            mount,
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

if (typeof window !== 'undefined') {
    window['artplayerPluginDanmuku'] = artplayerPluginDanmuku;
}

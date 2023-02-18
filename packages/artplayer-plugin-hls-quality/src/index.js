import image from 'bundle-text:./image.svg';

export default function artplayerPluginHlsQuality(option) {
    return (art) => {
        const { $video } = art.template;
        const { errorHandle } = art.constructor.utils;

        function update() {
            const hls = art.hls || window.hls;
            errorHandle(hls && hls.media === $video, 'Cannot find instance of HLS from "art.hls" or "window.hls"');
            const auto = option.auto || 'Auto';
            const title = option.title || 'Quality';
            const getResolution = option.getResolution || ((level) => (level.height || 'Unknown ') + 'P');
            const defaultLevel = hls.levels[hls.currentLevel];
            const defaultHtml = defaultLevel ? getResolution(defaultLevel) : auto;

            if (option.control) {
                art.controls.add({
                    name: 'hls-quality',
                    position: 'right',
                    html: defaultHtml,
                    style: { padding: '0 10px' },
                    selector: hls.levels.map((item, index) => {
                        return {
                            html: getResolution(item),
                            level: item.level || index,
                            default: defaultLevel === item,
                        };
                    }),
                    onSelect(item) {
                        hls.nextLevel = item.level;
                        return item.html;
                    },
                });
            }

            if (option.setting) {
                art.setting.add({
                    name: 'hls-quality',
                    tooltip: defaultHtml,
                    html: title,
                    icon: image,
                    width: 200,
                    selector: hls.levels.map((item, index) => {
                        return {
                            html: getResolution(item),
                            level: item.level || index,
                            default: defaultLevel === item,
                        };
                    }),
                    onSelect: function (item) {
                        hls.nextLevel = item.level;
                        return item.html;
                    },
                });
            }
        }

        art.on('ready', update);

        return {
            name: 'artplayerPluginHlsQuality',
        };
    };
}

artplayerPluginHlsQuality.env = process.env.NODE_ENV;
artplayerPluginHlsQuality.version = process.env.APP_VER;
artplayerPluginHlsQuality.build = process.env.BUILD_DATE;

if (typeof window !== 'undefined') {
    window['artplayerPluginHlsQuality'] = artplayerPluginHlsQuality;
}

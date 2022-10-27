export default function artplayerPluginHlsQuality(option) {
    return (art) => {
        const { errorHandle } = art.constructor.utils;
        const { $video } = art.template;

        function update() {
            const hls = art.hls || window.hls;

            errorHandle(
                hls && hls.media === $video,
                'Cannot find instance of HLS from "option.hls", "art.hls" or "window.hls"',
            );

            // https://github.com/video-dev/hls.js/blob/master/docs/API.md#runtime-events
            // const Hls = hls.constructor;

            const defaultLevel = hls.levels[hls.currentLevel];
            const defaultHtml = defaultLevel ? defaultLevel.height + 'P' : 'Auto';

            if (option.control) {
                art.controls.add({
                    name: 'hls-quality',
                    position: 'right',
                    html: defaultHtml,
                    style: { padding: '0 10px' },
                    selector: hls.levels.map((item, index) => {
                        return {
                            html: item.height + 'P',
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
                    html: option.name || 'Quality',
                    selector: hls.levels.map((item, index) => {
                        return {
                            html: item.height + 'P',
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

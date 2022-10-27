export default function artplayerPluginHlsQuality(option) {
    return (art) => {
        const { errorHandle } = art.constructor.utils;
        const { $video } = art.template;

        function update() {
            const hls = option.hls || art.hls || window.hls;

            errorHandle(
                hls && hls.media === $video,
                'Cannot find instance of HLS from "option.hls", "art.hls" or "window.hls"',
            );

            if (hls.levels.length === 0) return;

            if (option.control) {
                art.controls.add({
                    name: 'hls-quality',
                    position: 'right',
                    html: '360P',
                    selector: hls.levels.map((item, index) => {
                        return {
                            html: item.height + 'P',
                            level: item.level || index,
                        };
                    }),
                    onSelect(item) {
                        hls.nextLevel = item.level;
                        return item.html;
                    },
                });
            }

            if (option.setting) {
                // art.setting.add({
                //     name: 'hls-quality',
                // });
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

import image from 'bundle-text:./image.svg';

function checkVersion(art) {
    const {
        version,
        utils: { errorHandle },
    } = art.constructor;
    const arr = version.split('.').map(Number);
    const major = arr[0];
    const minor = arr[1] / 100;
    errorHandle(
        major + minor >= 5,
        `Artplayer.js@${version} is not compatible the artplayerPluginHlsQuality@${artplayerPluginHlsQuality.version}. Please update it to version Artplayer.js@5.x.x`,
    );
}

export default function artplayerPluginHlsQuality(option) {
    return (art) => {
        checkVersion(art);

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
                art.controls.update({
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
                        hls.currentLevel = item.level;
                        art.loading.show = true;
                        return item.html;
                    },
                });
            }

            if (option.setting) {
                art.setting.update({
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
                        hls.currentLevel = item.level;
                        art.loading.show = true;
                        return item.html;
                    },
                });
            }
        }

        art.on('ready', update);
        art.on('restart', update);

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

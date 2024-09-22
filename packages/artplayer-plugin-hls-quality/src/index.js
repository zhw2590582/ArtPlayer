import $quality from 'bundle-text:./quality.svg';

export default function artplayerPluginHlsQuality(option) {
    return (art) => {
        const { $video } = art.template;
        const { errorHandle } = art.constructor.utils;

        function updateQuality(hls) {
            const auto = option.auto || 'Auto';
            const title = option.title || 'Quality';

            const getResolution = option.getResolution || ((level) => (level.height || 'Unknown ') + 'P');
            const defaultLevel = hls.levels[hls.currentLevel];
            const defaultHtml = defaultLevel ? getResolution(defaultLevel) : auto;

            const selector = hls.levels
                .map((item, index) => {
                    return {
                        html: getResolution(item),
                        level: item.level || index,
                        default: defaultLevel === item,
                    };
                })
                .sort((a, b) => b.level - a.level);

            selector.push({
                html: auto,
                level: -1,
                default: defaultLevel === -1,
            });

            const onSelect = (item) => {
                hls.currentLevel = item.level;
                art.loading.show = true;
                art.notice.show = `${title}: ${item.html}`;
                return item.html;
            };

            if (option.control) {
                art.controls.update({
                    name: 'hls-quality',
                    position: 'right',
                    html: defaultHtml,
                    style: { padding: '0 10px' },
                    selector: selector,
                    onSelect: onSelect,
                });
            }

            if (option.setting) {
                art.setting.update({
                    name: 'hls-quality',
                    tooltip: defaultHtml,
                    html: title,
                    icon: $quality,
                    width: 200,
                    selector: selector,
                    onSelect: onSelect,
                });
            }
        }

        function updateAudio(hls) {
            //
        }

        function update() {
            const hls = art.hls || window.hls;
            errorHandle(hls && hls.media === $video, 'Cannot find instance of HLS from "art.hls" or "window.hls"');
            updateQuality(hls);
            updateAudio(hls);
        }

        art.on('ready', update);
        art.on('restart', update);

        return {
            name: 'artplayerPluginHlsQuality',
            update,
        };
    };
}

if (typeof window !== 'undefined') {
    window['artplayerPluginHlsQuality'] = artplayerPluginHlsQuality;
}

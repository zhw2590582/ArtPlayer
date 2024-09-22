import $quality from 'bundle-text:./quality.svg';
import $audio from 'bundle-text:./audio.svg';

export default function artplayerPluginHlsControl(option = {}) {
    return (art) => {
        const { $video } = art.template;
        const { errorHandle } = art.constructor.utils;

        function updateQuality(hls) {
            if (!hls.levels.length) return;

            const config = option.quality || {};
            const auto = config.auto || 'Auto';
            const title = config.title || 'Quality';
            const getName = config.getName || ((level) => (level.height || 'Unknown ') + 'P');
            const defaultLevel = hls.levels[hls.currentLevel];
            const defaultHtml = defaultLevel ? getName(defaultLevel) : auto;

            const selector = hls.levels
                .map((item, index) => {
                    return {
                        html: getName(item, index),
                        value: index,
                        default: hls.currentLevel === index,
                    };
                })
                .sort((a, b) => b.value - a.value);

            selector.push({
                html: auto,
                value: -1,
                default: hls.currentLevel === -1,
            });

            const onSelect = (item) => {
                hls.currentLevel = item.value;
                art.loading.show = true;
                art.notice.show = `${title}: ${item.html}`;
                return item.html;
            };

            if (config.control) {
                art.controls.update({
                    name: 'hls-quality',
                    position: 'right',
                    html: defaultHtml,
                    style: { padding: '0 10px' },
                    selector: selector,
                    onSelect: onSelect,
                });
            }

            if (config.setting) {
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
            if (!hls.audioTracks.length) return;

            const config = option.audio || {};
            const auto = config.auto || 'Auto';
            const title = config.title || 'Audio';
            const getName = config.getName || ((track, index) => track.name || `Track ${index + 1}`);
            const defaultTrack = hls.audioTracks[hls.audioTrack];
            const defaultHtml = defaultTrack ? getName(defaultTrack) : auto;

            const selector = hls.audioTracks.map((item, index) => {
                return {
                    html: getName(item, index),
                    value: index,
                    default: hls.audioTrack === index,
                };
            });

            const onSelect = (item) => {
                hls.audioTrack = item.value;
                art.loading.show = true;
                art.notice.show = `${title}: ${item.html}`;
                return item.html;
            };

            if (config.control) {
                art.controls.update({
                    name: 'hls-audio',
                    position: 'right',
                    html: defaultHtml,
                    style: { padding: '0 10px' },
                    selector: selector,
                    onSelect: onSelect,
                });
            }

            if (config.setting) {
                art.setting.update({
                    name: 'hls-audio',
                    tooltip: defaultHtml,
                    html: title,
                    icon: $audio,
                    width: 200,
                    selector: selector,
                    onSelect: onSelect,
                });
            }
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
            name: 'artplayerPluginHlsControl',
            update,
        };
    };
}

if (typeof window !== 'undefined') {
    window['artplayerPluginHlsControl'] = artplayerPluginHlsControl;
}

import $quality from 'bundle-text:./quality.svg';
import $audio from 'bundle-text:./audio.svg';

function uniqBy(array, property) {
    const seen = new Map();
    return array.filter((item) => {
        const key = item[property];
        if (key === undefined) {
            return true;
        }
        return !seen.has(key) && seen.set(key, 1);
    });
}

export default function artplayerPluginDashControl(option = {}) {
    return (art) => {
        const { $video } = art.template;
        const { errorHandle } = art.constructor.utils;

        function updateQuality(dash) {
            const qualities = dash.getBitrateInfoListFor('video');
            if (!qualities || !qualities.length) return;

            const config = option.quality || {};
            const auto = config.auto || 'Auto';
            const title = config.title || 'Quality';
            const getName = config.getName || ((level) => `${level.height}p`);
            const currentQuality = dash.getQualityFor('video');
            const currentAuto = dash.getSettings().streaming.abr.autoSwitchBitrate['video'];
            const defaultHtml = currentAuto ? auto : getName(qualities[currentQuality]);

            const selector = uniqBy(
                qualities.map((item) => {
                    return {
                        html: getName(item),
                        value: item.qualityIndex,
                        default: currentQuality === item.qualityIndex && !currentAuto,
                    };
                }),
                'html',
            ).sort((a, b) => b.value - a.value);

            selector.push({
                html: auto,
                value: 'auto',
                default: currentAuto,
            });

            const onSelect = (item) => {
                if (item.value === 'auto') {
                    dash.updateSettings({
                        streaming: {
                            abr: {
                                autoSwitchBitrate: {
                                    video: true,
                                },
                            },
                        },
                    });
                } else {
                    dash.updateSettings({
                        streaming: {
                            abr: {
                                autoSwitchBitrate: {
                                    video: false,
                                },
                            },
                        },
                    });
                    dash.setQualityFor('video', item.value);
                }
                art.notice.show = `${title}: ${item.html}`;
                if (config.control) art.controls.check(item);
                if (config.setting) art.setting.check(item);
                return item.html;
            };

            if (config.control) {
                art.controls.update({
                    name: 'dash-quality',
                    position: 'right',
                    html: defaultHtml,
                    style: { padding: '0 10px' },
                    selector: selector,
                    onSelect: onSelect,
                });
            }

            if (config.setting) {
                art.setting.update({
                    name: 'dash-quality',
                    tooltip: defaultHtml,
                    html: title,
                    icon: $quality,
                    width: 200,
                    selector: selector,
                    onSelect: onSelect,
                });
            }
        }

        function updateAudio(dash) {
            const audioTracks = dash.getTracksFor('audio');
            if (!audioTracks || !audioTracks.length) return;

            const config = option.audio || {};
            const auto = config.auto || 'Auto';
            const title = config.title || 'Audio';
            const getName = config.getName || ((track) => track.lang || track.id);
            const currentTrack = dash.getCurrentTrackFor('audio') || audioTracks[0];
            const defaultHtml = currentTrack ? getName(currentTrack) : auto;

            const selector = uniqBy(
                audioTracks.map((item) => {
                    return {
                        html: getName(item),
                        value: item,
                        default: currentTrack === item,
                    };
                }),
                'html',
            );

            const onSelect = (item) => {
                dash.setCurrentTrack(item.value);
                art.notice.show = `${title}: ${item.html}`;
                if (config.control) art.controls.check(item);
                if (config.setting) art.setting.check(item);
                return item.html;
            };

            if (config.control) {
                art.controls.update({
                    name: 'dash-audio',
                    position: 'right',
                    html: defaultHtml,
                    style: { padding: '0 10px' },
                    selector: selector,
                    onSelect: onSelect,
                });
            }

            if (config.setting) {
                art.setting.update({
                    name: 'dash-audio',
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
            errorHandle(art.dash.getVideoElement() === $video, 'Cannot find instance of DASH from "art.dash"');
            updateQuality(art.dash);
            updateAudio(art.dash);
        }

        art.on('ready', update);
        art.on('restart', update);

        return {
            name: 'artplayerPluginDashControl',
            update,
        };
    };
}

if (typeof window !== 'undefined') {
    window['artplayerPluginDashControl'] = artplayerPluginDashControl;
}

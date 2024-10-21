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

        function updateQuality(dashPlayer) {
            const qualities = dashPlayer.getBitrateInfoListFor('video');
            if (!qualities.length) return;

            const config = option.quality || {};
            const auto = config.auto || 'Auto';
            const title = config.title || 'Quality';
            const getName = config.getName || ((level) => `${level.height}p`);
            const currentQuality = dashPlayer.getQualityFor('video');
            const defaultLevel = qualities[currentQuality];
            const defaultHtml = defaultLevel ? getName(defaultLevel) : auto;

            const selector = uniqBy(
                qualities.map((item, index) => {
                    return {
                        html: getName(item, index),
                        value: index,
                        default: currentQuality === index,
                    };
                }),
                'html',
            ).sort((a, b) => b.value - a.value);

            selector.push({
                html: auto,
                value: 'auto',
                default: dashPlayer.getSettings().streaming.abr.autoSwitchBitrate['video'],
            });

            const onSelect = (item) => {
                if (item.value === 'auto') {
                    dashPlayer.updateSettings({
                        streaming: {
                            abr: {
                                autoSwitchBitrate: {
                                    video: true,
                                },
                            },
                        },
                    });
                } else {
                    dashPlayer.updateSettings({
                        streaming: {
                            abr: {
                                autoSwitchBitrate: {
                                    video: false,
                                },
                            },
                        },
                    });
                    dashPlayer.setQualityFor('video', item.value);
                }
                art.notice.show = `${title}: ${item.html}`;
                art.emit('artplayerPluginDashControl:quality', item);
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
                    mounted: () => {
                        art.on('artplayerPluginDashControl:quality', (item) => {
                            art.controls.check(item);
                        });
                    },
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
                    mounted: () => {
                        art.on('artplayerPluginDashControl:quality', (item) => {
                            art.setting.check(item);
                        });
                    },
                });
            }
        }

        function updateAudio(dashPlayer) {
            const audioTracks = dashPlayer.getTracksFor('audio');
            if (!audioTracks.length) return;

            const config = option.audio || {};
            const title = config.title || 'Audio';
            const getName = config.getName || ((track) => track.lang || track.id);
            const currentTrack = dashPlayer.getCurrentTrackFor('audio');
            const defaultHtml = currentTrack ? getName(currentTrack) : 'Default';

            const selector = uniqBy(
                audioTracks.map((item) => {
                    return {
                        html: getName(item),
                        value: item.id,
                        default: currentTrack && currentTrack.id === item.id,
                    };
                }),
                'html',
            );

            const onSelect = (item) => {
                dashPlayer.setCurrentTrack(audioTracks.find((track) => track.id === item.value));
                art.loading.show = true;
                art.notice.show = `${title}: ${item.html}`;
                art.emit('artplayerPluginDashControl:audio', item);
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
                    mounted: () => {
                        art.on('artplayerPluginDashControl:audio', (item) => {
                            art.controls.check(item);
                        });
                    },
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
                    mounted: () => {
                        art.on('artplayerPluginDashControl:audio', (item) => {
                            art.setting.check(item);
                        });
                    },
                });
            }
        }

        function update() {
            errorHandle(art.dash?.getVideoElement() === $video, 'Cannot find instance of DASH from "art.dash"');
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

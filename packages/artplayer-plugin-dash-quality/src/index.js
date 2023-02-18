import image from 'bundle-text:./image.svg';

export default function artplayerPluginDashQuality(option) {
    return (art) => {
        const { $video } = art.template;
        const { errorHandle } = art.constructor.utils;

        function update() {
            const dash = art.dash || window.dash;
            errorHandle(
                dash && dash.getVideoElement() === $video,
                'Cannot find instance of Dash from "art.dash" or "window.dash"',
            );
            const auto = option.auto || 'Auto';
            const title = option.title || 'Quality';
            const levels = dash.getBitrateInfoListFor('video');
            const currentLevel = dash.getQualityFor('video');
            const getResolution = option.getResolution || ((level) => (level.height || 'Unknown ') + 'P');
            const settings = dash.getSettings();
            const defaultLevel = levels[currentLevel];
            const defaultHtml = settings?.streaming?.abr?.autoSwitchBitrate?.video ? auto : getResolution(defaultLevel);

            const cfg = {
                streaming: {
                    abr: {
                        autoSwitchBitrate: {},
                    },
                },
            };

            if (option.control) {
                art.controls.add({
                    name: 'dash-quality',
                    position: 'right',
                    html: defaultHtml,
                    style: { padding: '0 10px' },
                    selector: levels.map((item, index) => {
                        return {
                            html: getResolution(item),
                            level: index,
                            default: defaultLevel === item,
                        };
                    }),
                    onSelect(item) {
                        cfg.streaming.abr.autoSwitchBitrate['video'] = false;
                        dash.updateSettings(cfg);
                        dash.setQualityFor('video', item.level, true);
                        return item.html;
                    },
                });
            }

            if (option.setting) {
                art.setting.add({
                    name: 'dash-quality',
                    tooltip: defaultHtml,
                    html: title,
                    icon: image,
                    width: 200,
                    selector: levels.map((item, index) => {
                        return {
                            html: getResolution(item),
                            level: index,
                            default: defaultLevel === item,
                        };
                    }),
                    onSelect: function (item) {
                        cfg.streaming.abr.autoSwitchBitrate['video'] = false;
                        dash.updateSettings(cfg);
                        dash.setQualityFor('video', item.level, true);
                        return item.html;
                    },
                });
            }
        }

        art.on('ready', update);

        return {
            name: 'artplayerPluginDashQuality',
        };
    };
}

artplayerPluginDashQuality.env = process.env.NODE_ENV;
artplayerPluginDashQuality.version = process.env.APP_VER;
artplayerPluginDashQuality.build = process.env.BUILD_DATE;

if (typeof window !== 'undefined') {
    window['artplayerPluginDashQuality'] = artplayerPluginDashQuality;
}

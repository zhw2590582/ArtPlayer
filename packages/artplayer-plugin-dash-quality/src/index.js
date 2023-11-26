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
        `Artplayer.js@${version} is not compatible the artplayerPluginDashQuality@${artplayerPluginDashQuality.version}. Please update it to version Artplayer.js@5.x.x`,
    );
}

export default function artplayerPluginDashQuality(option) {
    return (art) => {
        checkVersion(art);

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
                art.controls.update({
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
                art.setting.update({
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
        art.on('restart', update);

        return {
            name: 'artplayerPluginDashQuality',
        };
    };
}

if (typeof window !== 'undefined') {
    window['artplayerPluginDashQuality'] = artplayerPluginDashQuality;
}

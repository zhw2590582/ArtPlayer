export function opacity(art) {
    const {
        i18n,
        events: { proxy },
    } = art;

    return {
        name: 'danmuku-opacity',
        index: 10,
        html: `
            <div class="art-setting-header">
                ${i18n.get('Danmu opacity')}: <span class="art-value">100</span>%
            </div>
            <div class="art-setting-range">
                <input type="range" value="1" min="0.1" max="1" step="0.1">
            </div>
        `,
        mounted: $setting => {
            const $range = $setting.querySelector('input[type=range]');
            const $value = $setting.querySelector('.art-value');
            proxy($range, 'change', () => {
                const { value } = $range;
                $value.innerText = Number(value) * 100;

                art.plugins.artplayerPluginDanmuku.config({
                    opacity: Number(value),
                });
            });

            art.on('artplayerPluginDanmuku:config', config => {
                if ($range.value !== config.opacity) {
                    $range.value = config.opacity;
                    $value.innerText = config.opacity * 100;
                }
            });
        },
    };
}

export function size(art) {
    const {
        i18n,
        events: { proxy },
    } = art;

    return {
        name: 'danmuku-size',
        index: 11,
        html: `
            <div class="art-setting-header">
                ${i18n.get('Danmu size')}: <span class="art-value">25</span>px
            </div>
            <div class="art-setting-range">
                <input type="range" value="25" min="14" max="30" step="1">
            </div>
        `,
        mounted: $setting => {
            const $range = $setting.querySelector('input[type=range]');
            const $value = $setting.querySelector('.art-value');
            proxy($range, 'change', () => {
                const { value } = $range;
                $value.innerText = value;

                art.plugins.artplayerPluginDanmuku.config({
                    fontSize: Number(value),
                });
            });

            art.on('artplayerPluginDanmuku:config', config => {
                if ($range.value !== config.fontSize) {
                    $range.value = config.fontSize;
                    $value.innerText = config.fontSize;
                }
            });
        },
    };
}

export function speed(art) {
    const {
        i18n,
        events: { proxy },
    } = art;

    return {
        name: 'danmuku-speed',
        index: 12,
        html: `
            <div class="art-setting-header">
                ${i18n.get('Danmu speed')}: <span class="art-value">5</span>s
            </div>
            <div class="art-setting-range">
                <input type="range" value="5" min="1" max="10" step="1">
            </div>
        `,
        mounted: $setting => {
            const $range = $setting.querySelector('input[type=range]');
            const $value = $setting.querySelector('.art-value');
            proxy($range, 'change', () => {
                const { value } = $range;
                $value.innerText = value;

                art.plugins.artplayerPluginDanmuku.config({
                    speed: Number(value),
                });
            });

            art.on('artplayerPluginDanmuku:config', config => {
                if ($range.value !== config.speed) {
                    $range.value = config.speed;
                    $value.innerText = config.speed;
                }
            });
        },
    };
}

export function synchronousPlayback(art) {
    const {
        i18n,
        events: { proxy },
    } = art;
    return {
        name: 'danmuku-synchronousPlayback',
        index: 13,
        html: `
            <label class="art-setting-checkbox">
                <input type="checkbox"/>${i18n.get('Danmu speed synchronous playback multiple')}
            </label>
        `,
        mounted: $setting => {
            const $checkbox = $setting.querySelector('input[type=checkbox]');
            proxy($checkbox, 'change', () => {
                art.plugins.artplayerPluginDanmuku.config({
                    synchronousPlayback: $checkbox.checked,
                });
            });

            art.on('artplayerPluginDanmuku:config', config => {
                if ($checkbox.checked !== config.synchronousPlayback) {
                    $checkbox.checked = config.synchronousPlayback;
                }
            });
        },
    };
}

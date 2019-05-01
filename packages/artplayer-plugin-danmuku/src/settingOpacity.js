export default function setting(art) {
    const {
        i18n,
        events: { proxy },
    } = art;

    return {
        name: 'danmuku-opacity',
        index: 30,
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

                art.on('artplayerPluginDanmuku:config', config => {
                    if ($range.value !== config.opacity) {
                        $range.value = config.opacity;
                        $value.innerText = config.opacity * 100;
                    }
                });
            });
        },
    };
}

export default function setting(art) {
    const {
        i18n,
        events: { proxy },
    } = art;

    return {
        name: 'danmuku-speed',
        index: 40,
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

                art.on('artplayerPluginDanmuku:config', config => {
                    if ($range.value !== config.speed) {
                        $range.value = config.speed;
                        $value.innerText = config.speed;
                    }
                });
            });
        },
    };
}

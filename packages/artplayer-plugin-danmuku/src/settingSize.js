export default function setting(art) {
    const {
        i18n,
        events: { proxy },
    } = art;

    return {
        name: 'danmuku-size',
        index: 50,
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

                art.on('artplayerPluginDanmuku:config', config => {
                    if ($range.value !== config.fontSize) {
                        $range.value = config.fontSize;
                        $value.innerText = config.fontSize;
                    }
                });
            });
        },
    };
}

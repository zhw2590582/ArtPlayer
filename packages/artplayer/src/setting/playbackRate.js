export default function playbackRate(settingOption) {
    return art => {
        const {
            i18n,
            player,
            events: { proxy },
        } = art;
        return {
            ...settingOption,
            html: `
                <div class="art-setting-header">
                    ${i18n.get('Play speed')}: <span class="art-subtitle-value">1.0</span>x
                </div>
                <div class="art-setting-range">
                    <input class="art-subtitle-range" value="1" type="range" min="0.5" max="2" step="0.25">
                </div>
            `,
            mounted: $setting => {
                const $range = $setting.querySelector('.art-setting-range input');
                const $value = $setting.querySelector('.art-subtitle-value');
                proxy($range, 'change', () => {
                    const { value } = $range;
                    $value.innerText = value;
                    player.playbackRate(Number(value));
                });

                art.on('playbackRateChange', rate => {
                    if ($range.value !== rate) {
                        $range.value = rate;
                        $value.innerText = rate;
                    }
                });
            },
        };
    };
}

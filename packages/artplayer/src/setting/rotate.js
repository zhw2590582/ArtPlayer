import { query } from '../utils';

export default function rotate(option) {
    return (art) => {
        const { i18n, player } = art;
        return {
            ...option,
            html: `
                <div class="art-setting-header">
                    ${i18n.get('Rotate')}: <span class="art-rotate-value">0°</span>
                </div>
                <div class="art-setting-radio">
                    <div class="art-radio-item">
                        <button type="button" data-value="90">+90°</button>
                    </div>
                    <div class="art-radio-item">
                        <button type="button" data-value="-90">-90°</button>
                    </div>
                </div>
            `,
            click: (setting, event) => {
                const { value } = event.target.dataset;
                if (value) {
                    const deg = player.rotate + Number(value);
                    if (deg === 360 || deg === -360) {
                        player.rotate = 0;
                    } else {
                        player.rotate = deg;
                    }
                } else {
                    player.rotate = 0;
                }
            },
            mounted: ($setting) => {
                const $value = query('.art-rotate-value', $setting);
                art.on('rotate', (rotate) => {
                    $value.innerText = `${rotate}°`;
                });
            },
        };
    };
}

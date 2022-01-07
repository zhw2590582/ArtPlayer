import { query } from '../utils';

export default function rotate(option) {
    return (art) => {
        const { i18n } = art;
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
                    const deg = art.rotate + Number(value);
                    if (deg === 360 || deg === -360) {
                        art.rotate = 0;
                    } else {
                        art.rotate = deg;
                    }
                } else {
                    art.rotate = 0;
                }
            },
            mounted: ($setting) => {
                const $value = query('.art-rotate-value', $setting);
                art.on('rotate', (rotate) => {
                    $value.innerText = `${rotate || 0}°`;
                });
            },
        };
    };
}

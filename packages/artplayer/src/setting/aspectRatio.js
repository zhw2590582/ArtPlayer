import { inverseClass } from '../utils';

export default function aspectRatio(settingOption) {
    return art => {
        const { i18n, player } = art;
        return {
            ...settingOption,
            html: `
                <div class="art-setting-header">${i18n.get('Aspect ratio')}</div>
                <div class="art-setting-radio">
                    <div class="art-radio-item current">
                        <button type="button" data-value="default">${i18n.get('Default')}</button>
                    </div>
                    <div class="art-radio-item">
                        <button type="button" data-value="4:3">4:3</button>
                    </div>
                    <div class="art-radio-item">
                        <button type="button" data-value="16:9">16:9</button>
                    </div>
                </div>
            `,
            click: event => {
                const { value } = event.target.dataset;
                if (value) {
                    player.aspectRatio = value;
                }
            },
            mounted: $setting => {
                art.on('aspectRatioChange', ratio => {
                    const $current = Array.from($setting.querySelectorAll('button')).find(
                        item => item.dataset.value === ratio,
                    );
                    inverseClass($current.parentElement, 'current');
                });
            },
        };
    };
}

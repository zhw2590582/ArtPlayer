import { inverseClass } from '../utils';

export default function flip(settingOption) {
    return art => {
        const { i18n, player } = art;
        return {
            ...settingOption,
            html: `
                <div class="art-setting-header">${i18n.get('Flip')}</div>
                <div class="art-setting-radio">
                    <div class="art-radio-item current">
                        <button type="button" data-value="normal">${i18n.get('Normal')}</button>
                    </div>
                    <div class="art-radio-item">
                        <button type="button" data-value="horizontal">${i18n.get('Horizontal')}</button>
                    </div>
                    <div class="art-radio-item">
                        <button type="button" data-value="vertical">${i18n.get('Vertical')}</button>
                    </div>
                </div>
            `,
            click: event => {
                const { value } = event.target.dataset;
                if (value) {
                    player.flip(value);
                }
            },
            mounted: $setting => {
                art.on('flipChange', flip => {
                    const $current = Array.from($setting.querySelectorAll('button')).find(
                        item => item.dataset.value === flip,
                    );
                    inverseClass($current.parentElement, 'current');
                });
            },
        };
    };
}

import { inverseClass, queryAll } from '../utils';

export default function flip(option) {
    return (art) => {
        const { i18n } = art;
        return {
            ...option,
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
            click: (_, event) => {
                const { value } = event.target.dataset;
                if (value) {
                    art.flip = value;
                }
            },
            mounted: ($setting) => {
                art.on('flip', (flip) => {
                    const $current = queryAll('button', $setting).find((item) => item.dataset.value === flip);
                    if ($current) {
                        inverseClass($current.parentElement, 'current');
                    }
                });
            },
        };
    };
}

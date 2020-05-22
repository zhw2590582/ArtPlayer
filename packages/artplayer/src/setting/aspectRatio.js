import { inverseClass, queryAll } from '../utils';

export default function aspectRatio(option) {
    return art => {
        const { i18n, player } = art;
        return {
            ...option,
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
            click: (setting, event) => {
                const { value } = event.target.dataset;
                if (value) {
                    player.aspectRatio = value;
                }
            },
            mounted: $setting => {
                art.on('aspectRatio', ratio => {
                    const $current = queryAll('button', $setting).find(item => item.dataset.value === ratio);
                    if ($current) {
                        inverseClass($current.parentElement, 'current');
                    }
                });
            },
        };
    };
}

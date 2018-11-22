import { inverseClass } from '../utils';

export default function flip(settingOption) {
    return art => {
        const { i18n, player } = art;
        return {
            ...settingOption,
            html: `
                <div class="art-setting-header">${i18n.get(settingOption.title)}</div>
                <div class="art-setting-body">
                    <div class="art-setting-btns">
                        <div class="art-setting-btn current">
                            <span data-flip="normal">${i18n.get('Normal')}</span>
                        </div>
                        <div class="art-setting-btn">
                            <span data-flip="horizontal">${i18n.get('Horizontal')}</span>
                        </div>
                        <div class="art-setting-btn">
                            <span data-flip="vertical">${i18n.get('Vertical')}</span>
                        </div>
                    </div>
                </div>
            `,
            click: event => {
                const { target } = event;
                const { flip } = target.dataset;
                if (flip) {
                    player.flip(flip);
                }
            },
            mounted: $setting => {
                art.on('flipChange', flip => {
                    const $current = Array.from($setting.querySelectorAll('span')).find(
                        item => item.dataset.flip === flip,
                    );
                    inverseClass($current.parentElement, 'current');
                });
            },
        };
    };
}

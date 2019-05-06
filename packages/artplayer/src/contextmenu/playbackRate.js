import { inverseClass } from '../utils';

export default function playbackRate(menuOption) {
    return art => {
        const { i18n, player } = art;
        return {
            ...menuOption,
            html: `
                ${i18n.get('Play speed')}:
                <span data-rate="0.5">0.5</span>
                <span data-rate="0.75">0.75</span>
                <span data-rate="1.0" class="normal current">${i18n.get('Normal')}</span>
                <span data-rate="1.25">1.25</span>
                <span data-rate="1.5">1.5</span>
                <span data-rate="1.75">1.75</span>
                <span data-rate="2.0">2.0</span>
            `,
            click: event => {
                const { target } = event;
                const { rate } = target.dataset;
                if (rate) {
                    player.playbackRate(Number(rate));
                    art.contextmenu.hide();
                }
            },
            mounted: $menu => {
                art.on('playbackRateChange', rate => {
                    const $current = Array.from($menu.querySelectorAll('span')).find(
                        item => Number(item.dataset.rate) === rate,
                    );
                    inverseClass($current, 'current');
                });
            },
        };
    };
}

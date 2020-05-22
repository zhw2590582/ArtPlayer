import { inverseClass, queryAll } from '../utils';

export default function playbackRate(option) {
    return (art) => {
        const { i18n, player } = art;
        return {
            ...option,
            html: `${i18n.get('Play speed')}:
                <span data-rate="0.5">0.5</span>
                <span data-rate="0.75">0.75</span>
                <span data-rate="1.0" class="art-current">${i18n.get('Normal')}</span>
                <span data-rate="1.25">1.25</span>
                <span data-rate="1.5">1.5</span>
                <span data-rate="2.0">2.0</span>
            `,
            click: (contextmenu, event) => {
                const { rate } = event.target.dataset;
                if (rate) {
                    player.playbackRate = Number(rate);
                    contextmenu.show = false;
                }
            },
            mounted: ($menu) => {
                art.on('playbackRate', (rate) => {
                    const $current = queryAll('span', $menu).find((item) => Number(item.dataset.rate) === rate);
                    if ($current) {
                        inverseClass($current, 'art-current');
                    }
                });
            },
        };
    };
}

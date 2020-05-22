import { inverseClass, queryAll } from '../utils';

export default function aspectRatio(option) {
    return (art) => {
        const { i18n, player } = art;
        return {
            ...option,
            html: `${i18n.get('Aspect ratio')}:
                <span data-ratio="default" class="art-current">${i18n.get('Default')}</span>
                <span data-ratio="4:3">4:3</span>
                <span data-ratio="16:9">16:9</span>
            `,
            click: (contextmenu, event) => {
                const { ratio } = event.target.dataset;
                if (ratio) {
                    player.aspectRatio = ratio;
                    contextmenu.show = false;
                }
            },
            mounted: ($menu) => {
                art.on('aspectRatio', (ratio) => {
                    const $current = queryAll('span', $menu).find((item) => item.dataset.ratio === ratio);
                    if ($current) {
                        inverseClass($current, 'art-current');
                    }
                });
            },
        };
    };
}

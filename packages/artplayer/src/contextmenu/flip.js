import { inverseClass, queryAll } from '../utils';

export default function flip(option) {
    return (art) => {
        const { i18n } = art;
        return {
            ...option,
            html: `${i18n.get('Video Flip')}:
                <span data-flip="normal" class="art-current">${i18n.get('Normal')}</span>
                <span data-flip="horizontal">${i18n.get('Horizontal')}</span>
                <span data-flip="vertical">${i18n.get('Vertical')}</span>
            `,
            click: (contextmenu, event) => {
                const { flip } = event.target.dataset;
                if (flip) {
                    art.flip = flip;
                    contextmenu.show = false;
                }
            },
            mounted: ($menu) => {
                art.on('flip', (flip) => {
                    const $current = queryAll('span', $menu).find((item) => item.dataset.flip === flip);
                    if ($current) {
                        inverseClass($current, 'art-current');
                    }
                });
            },
        };
    };
}

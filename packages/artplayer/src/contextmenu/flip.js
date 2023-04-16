import { inverseClass, query, queryAll, capitalize } from '../utils';

export default function flip(option) {
    return (art) => {
        const {
            i18n,
            constructor: { FLIP },
        } = art;

        const html = FLIP.map((item) => `<span data-value="${item}">${i18n.get(capitalize(item))}</span>`).join('');

        return {
            ...option,
            html: `${i18n.get('Video Flip')}: ${html}`,
            click: (contextmenu, event) => {
                const { value } = event.target.dataset;
                if (value) {
                    art.flip = value.toLowerCase();
                    contextmenu.show = false;
                }
            },
            mounted: ($panel) => {
                const $default = query('[data-value="normal"]', $panel);
                if ($default) {
                    inverseClass($default, 'art-current');
                }
                art.on('flip', (value) => {
                    const $current = queryAll('span', $panel).find((item) => item.dataset.value === value);
                    if ($current) {
                        inverseClass($current, 'art-current');
                    }
                });
            },
        };
    };
}

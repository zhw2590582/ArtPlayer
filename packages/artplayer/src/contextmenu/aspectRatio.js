import { inverseClass, query, queryAll } from '../utils';

export default function aspectRatio(option) {
    return (art) => {
        const {
            i18n,
            constructor: { ASPECT_RATIO },
        } = art;

        const html = ASPECT_RATIO.map(
            (item) => `<span data-value="${item}">${item === 'default' ? i18n.get('Default') : item}</span>`,
        ).join('');

        return {
            ...option,
            html: `${i18n.get('Aspect Ratio')}: ${html}`,
            click: (contextmenu, event) => {
                const { value } = event.target.dataset;
                if (value) {
                    art.aspectRatio = value;
                    contextmenu.show = false;
                }
            },
            mounted: ($panel) => {
                const $default = query('[data-value="default"]', $panel);
                if ($default) {
                    inverseClass($default, 'art-current');
                }
                art.on('aspectRatio', (value) => {
                    const $current = queryAll('span', $panel).find((item) => item.dataset.value === value);
                    if ($current) {
                        inverseClass($current, 'art-current');
                    }
                });
            },
        };
    };
}

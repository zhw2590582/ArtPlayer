import { inverseClass, queryAll } from '../utils';

export default function aspectRatio(option) {
    return (art) => {
        const { i18n } = art;
        return {
            ...option,
            html: `${i18n.get('Aspect Ratio')}:
                <span data-value="default" class="art-current">${i18n.get('Default')}</span>
                <span data-value="4:3">4:3</span>
                <span data-value="16:9">16:9</span>
            `,
            click: (contextmenu, event) => {
                const { value } = event.target.dataset;
                if (value) {
                    art.aspectRatio = value;
                    contextmenu.show = false;
                }
            },
            mounted: ($panel) => {
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

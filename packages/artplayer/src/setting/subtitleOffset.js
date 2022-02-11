import { inverseClass, queryAll } from '../utils';

export default function subtitleOffset(art) {
    const { i18n, icons } = art;

    return {
        width: 150,
        html: i18n.get('Subtitle Offset'),
        icon: icons.subtitle,
        selector: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((item) => {
            return {
                value: item,
                default: item === art.subtitleOffset,
                html: item === 0 ? i18n.get('Normal') : item,
            };
        }),
        onSelect(item) {
            art.subtitleOffset = item.value;
        },
        mounted: ($panel) => {
            art.on('subtitleOffset', (value) => {
                const $current = queryAll('.art-setting-item', $panel).find((item) => item.dataset.value === value);
                if ($current) {
                    inverseClass($current, 'art-current');
                }
            });
        },
    };
}

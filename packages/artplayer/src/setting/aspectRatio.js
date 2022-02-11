import { inverseClass, queryAll } from '../utils';

export default function aspectRatio(art) {
    const { i18n, icons } = art;

    console.log(art.aspectRatio);

    return {
        width: 150,
        html: i18n.get('Aspect Ratio'),
        icon: icons.aspectRatio,
        selector: ['default', '4:3', '16:9'].map((item) => {
            return {
                value: item,
                default: item === art.aspectRatio,
                html: item === 'default' ? i18n.get('Default') : item,
            };
        }),
        onSelect(item) {
            art.aspectRatio = item.value;
        },
        mounted: ($panel) => {
            art.on('aspectRatio', (value) => {
                const $current = queryAll('.art-setting-item', $panel).find((item) => item.dataset.value === value);
                if ($current) {
                    inverseClass($current, 'art-current');
                }
            });
        },
    };
}

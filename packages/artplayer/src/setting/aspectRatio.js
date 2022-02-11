import { inverseClass, query, queryAll } from '../utils';

export default function aspectRatio(art) {
    const { i18n, icons } = art;

    function getI18n(value) {
        return value === 'default' ? i18n.get('Default') : value;
    }

    return {
        width: 150,
        html: i18n.get('Aspect Ratio'),
        icon: icons.aspectRatio,
        desc: getI18n(art.aspectRatio),
        selector: ['default', '4:3', '16:9'].map((item) => {
            return {
                value: item,
                default: item === art.aspectRatio,
                html: getI18n(item),
            };
        }),
        onSelect(item) {
            art.aspectRatio = item.value;
        },
        mounted: ($panel, item) => {
            const $desc = query('.art-setting-item-right-desc', item.$item);
            $desc.innerText = getI18n(art.aspectRatio);

            art.on('aspectRatio', (value) => {
                $desc.innerText = getI18n(art.aspectRatio);
                const $current = queryAll('.art-setting-item', $panel).find((item) => item.dataset.value === value);
                if ($current) {
                    inverseClass($current, 'art-current');
                }
            });
        },
    };
}

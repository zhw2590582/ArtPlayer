import { inverseClass, queryAll } from '../utils';

export default function aspectRatio(art) {
    const { i18n, icons } = art;

    function getI18n(value) {
        return value === 'default' ? i18n.get('Default') : value;
    }

    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = getI18n(value);
        const $current = queryAll('.art-setting-item', $panel).find((item) => item.dataset.value === value);
        if ($current) inverseClass($current, 'art-current');
    }

    return {
        width: 200,
        html: i18n.get('Aspect Ratio'),
        icon: icons.aspectRatio,
        tooltip: getI18n(art.aspectRatio),
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
            update($panel, item._$tooltip, art.aspectRatio);
            art.on('aspectRatio', () => {
                update($panel, item._$tooltip, art.aspectRatio);
            });
        },
    };
}

import { inverseClass, queryAll } from '../utils';

export default function aspectRatio(art) {
    const {
        i18n,
        icons,
        constructor: { SETTING_ITEM_WIDTH, ASPECT_RATIO },
    } = art;

    function getI18n(value) {
        return value === 'default' ? i18n.get('Default') : value;
    }

    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = getI18n(value);
        const $current = queryAll('.art-setting-item', $panel).find((item) => item.dataset.value === value);
        if ($current) inverseClass($current, 'art-current');
    }

    return {
        width: SETTING_ITEM_WIDTH,
        html: i18n.get('Aspect Ratio'),
        icon: icons.aspectRatio,
        tooltip: getI18n(art.aspectRatio),
        selector: ASPECT_RATIO.map((item) => {
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
            update($panel, item.$tooltip, art.aspectRatio);
            art.on('aspectRatio', () => {
                update($panel, item.$tooltip, art.aspectRatio);
            });
        },
    };
}

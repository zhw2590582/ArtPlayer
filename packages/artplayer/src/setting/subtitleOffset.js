import { inverseClass, queryAll } from '../utils';

export default function subtitleOffset(art) {
    const { i18n, icons, constructor } = art;

    function getI18n(value) {
        return value === 0 ? i18n.get('Normal') : value;
    }

    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = getI18n(value);
        const $current = queryAll('.art-setting-item', $panel).find((item) => Number(item.dataset.value) === value);
        if ($current) inverseClass($current, 'art-current');
    }

    return {
        width: constructor.SETTING_ITEM_WIDTH,
        html: i18n.get('Subtitle Offset'),
        tooltip: getI18n(art.subtitleOffset),
        icon: icons.subtitle,
        selector: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((item) => {
            return {
                value: item,
                default: item === art.subtitleOffset,
                html: getI18n(item),
            };
        }),
        onSelect(item) {
            art.subtitleOffset = item.value;
        },
        mounted: ($panel, item) => {
            update($panel, item.$tooltip, art.subtitleOffset);
            art.on('subtitleOffset', () => {
                update($panel, item.$tooltip, art.subtitleOffset);
            });
        },
    };
}

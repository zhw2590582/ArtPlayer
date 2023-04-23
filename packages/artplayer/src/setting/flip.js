import { inverseClass, queryAll, capitalize } from '../utils';

export default function flip(art) {
    const {
        i18n,
        icons,
        constructor: { SETTING_ITEM_WIDTH, FLIP },
    } = art;

    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = i18n.get(capitalize(value));
        const $current = queryAll('.art-setting-item', $panel).find((item) => item.dataset.value === value);
        if ($current) inverseClass($current, 'art-current');
    }

    return {
        width: SETTING_ITEM_WIDTH,
        name: 'flip',
        html: i18n.get('Video Flip'),
        tooltip: i18n.get(capitalize(art.flip)),
        icon: icons.flip,
        selector: FLIP.map((item) => {
            return {
                value: item,
                name: `aspect-ratio-${item}`,
                default: item === art.flip,
                html: i18n.get(capitalize(item)),
            };
        }),
        onSelect(item) {
            art.flip = item.value;
            return item.html;
        },
        mounted: ($panel, item) => {
            update($panel, item.$tooltip, art.flip);
            art.on('flip', () => {
                update($panel, item.$tooltip, art.flip);
            });
        },
    };
}

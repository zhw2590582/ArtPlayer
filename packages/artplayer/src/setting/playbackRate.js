import { inverseClass, queryAll } from '../utils';

export default function playbackRate(art) {
    const {
        i18n,
        icons,
        constructor: { SETTING_ITEM_WIDTH, PLAYBACK_RATE },
    } = art;

    function getI18n(value) {
        return value === 1.0 ? i18n.get('Normal') : value.toFixed(1);
    }

    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = getI18n(value);
        const $current = queryAll('.art-setting-item', $panel).find((item) => Number(item.dataset.value) === value);
        if ($current) inverseClass($current, 'art-current');
    }

    return {
        width: SETTING_ITEM_WIDTH,
        name: 'playback-rate',
        html: i18n.get('Play Speed'),
        tooltip: getI18n(art.playbackRate),
        icon: icons.playbackRate,
        selector: PLAYBACK_RATE.map((item) => {
            return {
                value: item,
                name: `aspect-ratio-${item}`,
                default: item === art.playbackRate,
                html: getI18n(item),
            };
        }),
        onSelect(item) {
            art.playbackRate = item.value;
            return item.html;
        },
        mounted: ($panel, item) => {
            update($panel, item.$tooltip, art.playbackRate);
            art.on('video:ratechange', () => {
                update($panel, item.$tooltip, art.playbackRate);
            });
        },
    };
}

import Setting from './';

export default function playbackRate(art) {
    const {
        i18n,
        icons,
        constructor: { SETTING_ITEM_WIDTH, PLAYBACK_RATE },
    } = art;

    function getI18n(value) {
        return value === 1.0 ? i18n.get('Normal') : value.toFixed(1);
    }

    function update(item) {
        const tooltip = getI18n(art.playbackRate);
        Setting.select(item, art.playbackRate, tooltip);
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
                get default() {
                    return item === art.playbackRate;
                },
                html: getI18n(item),
            };
        }),
        onSelect(item) {
            art.playbackRate = item.value;
            return item.html;
        },
        mounted: (_, item) => {
            update(item);
            art.on('video:ratechange', () => update(item));
        },
    };
}

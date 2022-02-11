import { inverseClass, queryAll } from '../utils';

export default function playbackRate(art) {
    const { i18n, icons } = art;

    function getI18n(value) {
        return value === 1.0 ? i18n.get('Normal') : value;
    }

    return {
        width: 200,
        html: i18n.get('Play Speed'),
        desc: getI18n(art.playbackRate),
        icon: icons.playbackRate,
        selector: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((item) => {
            return {
                value: item,
                default: item === art.playbackRate,
                html: getI18n(item),
            };
        }),
        onSelect(item) {
            art.playbackRate = item.value;
        },
        mounted: ($panel, item) => {
            item.$desc.innerText = getI18n(art.playbackRate);

            art.on('playbackRate', (value) => {
                item.$desc.innerText = getI18n(art.playbackRate);

                const $current = queryAll('.art-setting-item', $panel).find(
                    (item) => Number(item.dataset.value) === value,
                );

                if ($current) {
                    inverseClass($current, 'art-current');
                }
            });
        },
    };
}

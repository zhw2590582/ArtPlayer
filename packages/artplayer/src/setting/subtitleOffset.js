import { inverseClass, query, queryAll } from '../utils';

export default function subtitleOffset(art) {
    const { i18n, icons } = art;

    function getI18n(value) {
        return value === 0 ? i18n.get('Normal') : value;
    }

    return {
        width: 150,
        html: i18n.get('Subtitle Offset'),
        desc: getI18n(art.subtitleOffset),
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
            const $desc = query('.art-setting-item-right-desc', item.$item);
            $desc.innerText = getI18n(art.subtitleOffset);

            art.on('subtitleOffset', (value) => {
                const $current = queryAll('.art-setting-item', $panel).find(
                    (item) => Number(item.dataset.value) === value,
                );
                if ($current) {
                    inverseClass($current, 'art-current');
                    $desc.innerText = getI18n(art.subtitleOffset);
                }
            });
        },
    };
}

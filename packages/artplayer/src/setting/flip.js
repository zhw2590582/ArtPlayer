import { inverseClass, query, queryAll } from '../utils';

export default function flip(art) {
    const { i18n, icons } = art;

    const keys = {
        normal: 'Normal',
        horizontal: 'Horizontal',
        vertical: 'Vertical',
    };

    return {
        width: 150,
        html: i18n.get('Video Flip'),
        desc: i18n.get(keys[art.flip]),
        icon: icons.config,
        selector: Object.keys(keys).map((item) => {
            return {
                value: item,
                default: item === art.flip,
                html: i18n.get(keys[item]),
            };
        }),
        onSelect(item) {
            art.flip = item.value;
        },
        mounted: ($panel, item) => {
            const $desc = query('.art-setting-item-right-desc', item.$item);
            $desc.innerText = i18n.get(keys[art.flip]);

            art.on('flip', (value) => {
                $desc.innerText = i18n.get(keys[art.flip]);
                const $current = queryAll('.art-setting-item', $panel).find((item) => item.dataset.value === value);
                if ($current) {
                    inverseClass($current, 'art-current');
                }
            });
        },
    };
}

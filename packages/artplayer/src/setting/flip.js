import { inverseClass, queryAll } from '../utils';

export default function flip(art) {
    const { i18n, icons } = art;

    const keys = {
        normal: 'Normal',
        horizontal: 'Horizontal',
        vertical: 'Vertical',
    };

    function update($panel, $desc, value) {
        if ($desc) $desc.innerText = i18n.get(keys[value]);
        const $current = queryAll('.art-setting-item', $panel).find((item) => item.dataset.value === value);
        if ($current) inverseClass($current, 'art-current');
    }

    return {
        width: 200,
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
            update($panel, item.$desc, art.flip);
            art.on('flip', () => {
                update($panel, item.$desc, art.flip);
            });
        },
    };
}

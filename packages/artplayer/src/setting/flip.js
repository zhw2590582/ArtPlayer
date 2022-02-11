import { inverseClass, queryAll } from '../utils';

export default function flip(art) {
    const { i18n, icons } = art;

    const keys = {
        normal: 'Normal',
        horizontal: 'Horizontal',
        vertical: 'Vertical',
    };

    function update($panel, $description, value) {
        if ($description) $description.innerText = i18n.get(keys[value]);
        const $current = queryAll('.art-setting-item', $panel).find((item) => item.dataset.value === value);
        if ($current) inverseClass($current, 'art-current');
    }

    return {
        width: 200,
        html: i18n.get('Video Flip'),
        description: i18n.get(keys[art.flip]),
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
            update($panel, item._$description, art.flip);
            art.on('flip', () => {
                update($panel, item._$description, art.flip);
            });
        },
    };
}

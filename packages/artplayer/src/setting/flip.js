import { inverseClass, queryAll } from '../utils';

export default function flip(art) {
    const { i18n } = art;

    const keys = {
        normal: 'Normal',
        horizontal: 'Horizontal',
        vertical: 'Vertical',
    };

    return {
        width: 150,
        html: i18n.get('Video Flip'),
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
        mounted: ($panel) => {
            art.on('flip', (value) => {
                const $current = queryAll('.art-setting-item', $panel).find((item) => item.dataset.value === value);
                if ($current) {
                    inverseClass($current, 'art-current');
                }
            });
        },
    };
}

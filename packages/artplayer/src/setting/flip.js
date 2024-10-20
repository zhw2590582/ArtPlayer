import Setting from './';
import { capitalize } from '../utils';

export default function flip(art) {
    const {
        i18n,
        icons,
        constructor: { SETTING_ITEM_WIDTH, FLIP },
    } = art;

    function getI18n(value) {
        return i18n.get(capitalize(value));
    }

    function update(item) {
        const tooltip = getI18n(art.flip);
        Setting.select(item, art.flip, tooltip);
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
                get default() {
                    return item === art.flip;
                },
                html: i18n.get(capitalize(item)),
            };
        }),
        onSelect(item) {
            art.flip = item.value;
            return item.html;
        },
        mounted: (_, item) => {
            update(item);
            art.on('flip', () => update(item));
        },
    };
}

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

    function update() {
        const target = art.setting.find(`flip-${art.flip}`);
        art.setting.check(target);
    }

    return {
        width: SETTING_ITEM_WIDTH,
        name: 'flip',
        html: i18n.get('Video Flip'),
        tooltip: getI18n(art.flip),
        icon: icons.flip,
        selector: FLIP.map((item) => {
            return {
                value: item,
                name: `flip-${item}`,
                default: item === art.flip,
                html: getI18n(item),
            };
        }),
        onSelect(item) {
            art.flip = item.value;
            return item.html;
        },
        mounted: () => {
            update();
            art.on('flip', () => update());
        },
    };
}

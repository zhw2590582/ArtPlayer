export default function subtitleOffset(art) {
    const { i18n, icons, constructor } = art;

    return {
        width: constructor.SETTING_ITEM_WIDTH,
        name: 'subtitle-offset',
        html: i18n.get('Subtitle Offset'),
        icon: icons.subtitle,
        tooltip: '0s',
        range: [0, -5, 5, 0.1],
        onChange(item) {
            art.subtitleOffset = item.range[0];
            return item.range[0] + 's';
        },
    };
}

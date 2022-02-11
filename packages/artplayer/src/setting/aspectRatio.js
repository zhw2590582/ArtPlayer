export default function aspectRatio(art) {
    const { i18n, icons } = art;

    return {
        width: 150,
        html: i18n.get('Aspect Ratio'),
        icon: icons.aspectRatio,
        children: ['default', '4:3', '16:9'].map((item) => {
            return {
                html: item === 'default' ? i18n.get('Default') : item,
                current: item === 'default',
                click() {
                    art.aspectRatio = item;
                },
            };
        }),
    };
}

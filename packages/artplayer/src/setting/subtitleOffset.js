export default function subtitleOffset(art) {
    const { i18n } = art;

    return {
        width: 150,
        html: i18n.get('Subtitle offset time'),
        items: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((item) => {
            return {
                html: item === 0 ? i18n.get('Normal') : item,
                current: item === 0,
                click() {
                    art.subtitleOffset = item;
                },
            };
        }),
    };
}

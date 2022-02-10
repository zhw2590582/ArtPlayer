export default function playbackRate(art) {
    const { i18n } = art;

    const keys = {
        normal: 'Normal',
        horizontal: 'Horizontal',
        vertical: 'Vertical',
    };

    return {
        width: 150,
        html: i18n.get('Flip'),
        items: Object.keys(keys).map((key) => {
            return {
                html: i18n.get(keys[key]),
                current: key === 'normal',
                click() {
                    art.flip = key;
                },
            };
        }),
    };
}

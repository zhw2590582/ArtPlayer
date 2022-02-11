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
        selector: Object.keys(keys).map((key) => {
            return {
                html: i18n.get(keys[key]),
                default: key === 'normal',
                onSelect() {
                    art.flip = key;
                },
            };
        }),
    };
}

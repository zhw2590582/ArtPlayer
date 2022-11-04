export default function info(option) {
    return (art) => ({
        ...option,
        html: art.i18n.get('Video Info'),
        click: (contextmenu) => {
            art.info.show = true;
            contextmenu.show = false;
        },
    });
}

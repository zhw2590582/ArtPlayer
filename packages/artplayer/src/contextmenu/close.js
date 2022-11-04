export default function close(option) {
    return (art) => ({
        ...option,
        html: art.i18n.get('Close'),
        click: (contextmenu) => {
            contextmenu.show = false;
        },
    });
}

export default function close(art) {
    return {
        disable: false,
        name: 'close',
        index: 50,
        html: art.i18n.get('Close'),
        click: () => {
            art.contextmenu.hide();
        },
    };
}

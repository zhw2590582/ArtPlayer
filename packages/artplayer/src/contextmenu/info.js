export default function info(art) {
    return {
        disable: false,
        name: 'info',
        index: 30,
        html: art.i18n.get('Video info'),
        click: () => {
            art.info.show();
            art.contextmenu.hide();
        },
    };
}

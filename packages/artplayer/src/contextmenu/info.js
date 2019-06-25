export default function info(menuOption) {
    return art => ({
        ...menuOption,
        html: art.i18n.get('Video info'),
        click: contextmenu => {
            art.info.show = true;
            contextmenu.show = false;
        },
    });
}

export default function info(menuOption) {
    return art => ({
        ...menuOption,
        html: art.i18n.get('Video info'),
        click: () => {
            art.info.show = true;
            art.contextmenu.show = false;
        },
    });
}

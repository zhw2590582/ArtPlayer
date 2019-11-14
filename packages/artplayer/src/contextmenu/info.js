export default function info(option) {
    return art => ({
        ...option,
        html: art.i18n.get('Video info'),
        click: contextmenu => {
            art.info.show = true;
            contextmenu.show = false;
        },
    });
}

export default function light(option) {
    return art => {
        const { i18n, player } = art;
        return {
            ...option,
            html: i18n.get('Light Off'),
            click: contextmenu => {
                player.light = !player.light;
                contextmenu.show = false;
            },
            mounted: $menu => {
                art.on('light', value => {
                    $menu.innerText = i18n.get(value ? 'Light On' : 'Light Off');
                });
            },
        };
    };
}

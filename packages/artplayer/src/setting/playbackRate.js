export default function playbackRate(art) {
    const { i18n } = art;

    return {
        html: i18n.get('Play speed'),
        click: () => console.log(0),
        items: [
            {
                html: '111',
                click: () => console.log(1),
            },
            {
                html: '222',
                click: () => console.log(2),
                items: [
                    {
                        html: '333',
                        click: () => console.log(3),
                    },
                    {
                        html: '444',
                        click: () => console.log(4),
                    },
                ],
            },
        ],
    };
}

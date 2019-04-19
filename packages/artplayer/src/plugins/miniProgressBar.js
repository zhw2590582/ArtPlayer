export default function miniProgressBar(art) {
    const {
        layers,
        player,
        option: { theme },
    } = art;

    layers.add({
        style: {
            display: 'none',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '3px',
            background: theme,
        },
        mounted($progressBar) {
            art.on('hoverenter', () => {
                $progressBar.style.display = 'none';
            });
            art.on('hoverleave', () => {
                if (player.playing) {
                    $progressBar.style.display = 'block';
                }
            });
            art.on('video:timeupdate', () => {
                $progressBar.style.width = `${player.played * 100}%`;
            });
        },
    });

    return {
        name: 'miniProgressBar',
    };
}

export default function miniProgressBar(art) {
    const {
        layers,
        player,
        option: { theme },
    } = art;

    layers.add({
        name: 'miniProgressBar',
        style: {
            display: 'none',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '2px',
            background: theme,
        },
        mounted($progressBar) {
            art.on('control', value => {
                $progressBar.style.display = value ? 'none' : 'block';
            });

            art.on('destroy', () => {
                $progressBar.style.display = 'none';
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

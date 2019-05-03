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
            height: '3px',
            background: theme,
        },
        mounted($progressBar) {
            art.on('controls:show', () => {
                $progressBar.style.display = 'none';
            });

            art.on('controls:hide', () => {
                $progressBar.style.display = 'block';
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

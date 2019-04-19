export default function miniProgressBar(art) {
    const {
        layers,
        player,
        option: { theme },
    } = art;

    let timer = null;

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
            function hide() {
                if (timer) {
                    clearTimeout(timer);
                }
                $progressBar.style.display = 'none';
            }

            function show() {
                if (player.playing) {
                    timer = setTimeout(() => {
                        $progressBar.style.display = 'block';
                    }, 200);
                }
            }

            art.on('controls:show', () => {
                hide();
            });
            art.on('hoverenter', () => {
                hide();
            });
            art.on('hoverleave', () => {
                show();
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

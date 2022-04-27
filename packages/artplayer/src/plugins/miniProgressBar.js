export default function miniProgressBar(art) {
    const { layers } = art;

    layers.add({
        name: 'miniProgressBar',
        mounted($progressBar) {
            art.on('destroy', () => {
                $progressBar.style.display = 'none';
            });

            art.on('video:timeupdate', () => {
                $progressBar.style.width = `${art.played * 100}%`;
            });
        },
    });

    return {
        name: 'miniProgressBar',
    };
}

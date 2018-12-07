'use strict';

(function() {
    consola.creat({
        target: '.part-bottom',
        size: '100%',
        zIndex: 99,
    });

    console.info('Welcome, if you like it, consider star it, thank you.');
    console.info('https://github.com/zhw2590582/ArtPlayer');
    console.warn('For web video, this plugin depends on the network, so the results are not necessarily ideal.');

    window.addEventListener('error', function(err) {
        console.error(err.message);
    });

    var art = new Artplayer({
        container: '.artplayer',
        url: 'https://blog.zhw-island.com/assets-cdn/video/one-more-time-one-more-chance-480p.mp4',
        title: '【新海诚动画】『秒速5センチメートル』',
        autoSize: true,
        controls: [
            {
                name: 'preview',
                position: 'right',
                html: '打开',
                mounted: $preview => {
                    art.plugins.localPreview.attach($preview);
                },
            },
        ],
        plugins: [artplayerPluginGif]
    });

    var $preview = document.querySelector('.preview');
    art.on('artplayerPluginGif', image => {
        var animatedImage = document.createElement('img');
        animatedImage.src = image;
        $preview.innerHTML = '';
        $preview.appendChild(animatedImage);
    });
})();

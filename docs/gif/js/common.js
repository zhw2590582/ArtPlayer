'use strict';

(function() {
    consola.creat({
        target: '.part-bottom',
        size: '100%',
        zIndex: 99,
    });

    console.info('Welcome, if you like it, consider star it, thank you.');
    console.info('https://github.com/zhw2590582/ArtPlayer');

    window.addEventListener('error', function(err) {
        console.error(err.message);
    });

    var art = new Artplayer({
        container: '.artplayer',
        url: 'https://blog.zhw-island.com/assets-cdn/video/one-more-time-one-more-chance-480p.mp4',
        autoSize: true,
        controls: [
            {
                name: 'preview',
                position: 'right',
                html: '打开'
            },
        ],
        plugins: [artplayerPluginGif]
    });

    art.on('firstCanplay', () => {
        var preview = document.querySelector('.art-control-preview');
        art.plugins.localPreview.attach(preview);
        art.plugins.artplayerPluginGif.create({}, image => {
            var animatedImage = document.createElement('img');
            animatedImage.src = image;
            document.querySelector('.preview').appendChild(animatedImage);
        });
    });
})();

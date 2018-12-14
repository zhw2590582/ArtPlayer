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

    var $urlInput = document.querySelector('.urlInput');
    var $playBtn = document.querySelector('.playBtn');

    function creatPlayer() {
        Artplayer.instances.forEach(function(art) {
            art.destroy(true);
        });

        new Artplayer({
            container: '.artplayer',
            url: function () {
                return this.plugins.artplayerPluginFlv.attach($urlInput.value)
            },
            plugins: [artplayerPluginFlv]
        });
    }

    creatPlayer();
    $playBtn.addEventListener('click', creatPlayer);
})();

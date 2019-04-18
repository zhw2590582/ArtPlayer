'use strict';

(function() {
    var art = new Artplayer({
        container: '.artplayer',
        url: 'https://zhw2590582.github.io/assets-cdn/video/ambilight.mp4',
        autoSize: true,
        moreVideoAttr: {
            crossOrigin: 'anonymous'
        },
        plugins: [artplayerPluginBacklight]
    });
})();

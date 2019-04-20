var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    autoSize: true,
    moreVideoAttr: {
        crossOrigin: 'anonymous',
    },
    plugins: [artplayerPluginBacklight],
});
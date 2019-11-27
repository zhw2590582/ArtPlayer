var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/your-name.mp4',
    autoSize: true,
    localVideo: true,
    moreVideoAttr: {
        crossOrigin: 'anonymous',
    },
    controls: [
        {
            name: 'open',
            position: 'right',
            html: 'Local Video',
            mounted: $open => {
                art.plugins.localVideo.attach($open);
            },
        },
    ],
    plugins: [artplayerPluginBacklight],
});

var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/your-name.mp4',
    autoSize: true,
    moreVideoAttr: {
        crossOrigin: 'anonymous',
    },
    layers: [
        {
            style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200px',
                height: '200px',
                margin: '-100px 0 0 -100px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            mounted($layer) {
                art.plugins.artplayerPluginBlur.attach($layer);
            },
        },
    ],
    plugins: [artplayerPluginBlur],
});

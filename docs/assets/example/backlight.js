var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
    light: true,
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

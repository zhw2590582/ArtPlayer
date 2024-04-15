var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginChromecast({
            // sdk: '', // The URL of the Cast SDK
            // mimeType: '', // The MIME type of the media
        }),
    ],
});
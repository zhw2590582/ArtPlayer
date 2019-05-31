var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/your-name.mp4',
    autoSize: true,
    setting: true,
    playbackRate: true,
    fullscreenWeb: true,
    plugins: [artplayerPluginDanmuku({
        danmuku: url + '/danmuku/your-name.xml',
        speed: 5,
        maxlength: 50,
        margin: [10, 100],
        opacity: 1,
        fontSize: 25,
        synchronousPlayback: false,
    })],
});
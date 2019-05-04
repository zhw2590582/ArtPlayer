var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/you-name.mp4',
    autoSize: true,
    setting: true,
    fullscreenWeb: true,
    plugins: [artplayerPluginDanmuku({
        danmuku: url + '/danmuku/you-name.xml',
        speed: 5,
        maxlength: 50,
        margin: [10, 100],
        opacity: 1,
        fontSize: 25,
    })],
});
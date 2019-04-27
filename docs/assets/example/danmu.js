var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/you-name.mp4',
    autoSize: true,
    plugins: [artplayerPluginDanmu({
        danmus: url + '/danmuku/you-name.xml',
        speed: 5,
        opacity: 1,
        color: '#fff',
        size: 25,
        maxlength: 50,
        margin: [10, 100],
    })],
});

console.info('弹幕加载中...');
art.on('artplayerPluginDanmu:loaded', () => {
    console.info('弹幕准备就绪');
});
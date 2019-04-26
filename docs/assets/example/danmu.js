var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/you-name.mp4',
    autoSize: true,
    plugins: [artplayerPluginDanmu({
        // 弹幕样本：https://www.bilibili.com/video/av7185185
        danmus: () => artplayerPluginDanmu.bilibiliDanmuParseFromAv(7185185),
        speed: 5,
        opacity: 1,
        color: '#fff',
        size: 14,
        maxlength: 50,
    })],
});
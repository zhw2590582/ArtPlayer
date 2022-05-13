// 使用文档
// https://artplayer.org/document/zh-cn/Plugins/danmuku

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
    fullscreen: true,
    fullscreenWeb: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    setting: true,
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku-v2.xml',
            speed: 5, // 弹幕持续时间，单位秒，范围在[1 ~ 10]
            opacity: 1, // 弹幕透明度，范围在[0 ~ 1]
            fontSize: 25, // 字体大小，支持数字和百分比
            margin: ['2%', 60], // 弹幕上下边距，支持数字和百分比
            antiOverlap: true, // 是否防重叠
            useWorker: true, // 是否使用 web worker
            synchronousPlayback: false, // 是否同步到播放速度
            filter: (danmu) => danmu.text.length < 50, // 弹幕过滤函数
        }),
    ],
});

// 监听手动输入的弹幕，保存到数据库
art.on('artplayerPluginDanmuku:emit', (danmu) => {
    console.info(danmu);
});

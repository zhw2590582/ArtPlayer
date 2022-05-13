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
    controls: [
        {
            position: 'right',
            html: '发送',
            click: function () {
                var text = prompt('请输入弹幕文本', '弹幕测试文本');
                if (!text || !text.trim()) return;
                var color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
                art.plugins.artplayerPluginDanmuku.emit({
                    text: text,
                    color: color,
                    border: true,
                });
            },
        },
    ],
});

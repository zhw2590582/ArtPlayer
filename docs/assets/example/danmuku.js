var art = new Artplayer(
    {
        container: '.artplayer-app',
        url: '/assets/sample/video.mp4',
        autoSize: true,
        fullscreen: true,
        fullscreenWeb: true,
        plugins: [
            artplayerPluginDanmuku({
                danmuku: '/assets/sample/danmuku-v2.xml',
                speed: 5, // 弹幕持续时间，单位秒
                opacity: 1, // 弹幕透明度
                margin: ['10%', 60], // 弹幕上下边距
                antiOverlap: true, // 是否防重叠
                useWorker: true, // 是否使用 web worker
                synchronousPlayback: false, // 是否同步到播放速度
                filter: (danmu) => danmu.text.length < 50, // 弹幕过滤函数
            }),
        ],
    },
    function () {
        const danmuku = document.querySelector('.artplayer-danmuku');
        art.plugins.artplayerPluginDanmuku.mount(danmuku);
    },
);

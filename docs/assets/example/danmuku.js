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
                speed: 5,
                opacity: 1,
                fontSize: 20,
                maxlength: 100,
                margin: ['10%', 60],
                antiOverlap: true,
                useWorker: true,
                synchronousPlayback: false,
                filter: (danmu) => danmu.text.length < 50,
            }),
        ],
    },
    function () {
        const danmuku = document.querySelector('.artplayer-danmuku');
        art.plugins.artplayerPluginDanmuku.mount(danmuku);
    },
);

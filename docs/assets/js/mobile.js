var vConsole = new VConsole();
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    title: 'One More Time One More Chance',
    poster: '/assets/sample/poster.jpg',
    autoSize: true,
    loop: true,
    mutex: true,
    theme: '#ffad00',
    fullscreenWeb: true,
    miniProgressBar: true,
    moreVideoAttr: {
        playsInline: true,
        'webkit-playsinline': true,
        'x5-video-player-type': 'h5',
        'x5-video-player-fullscreen': false,
        'x5-video-orientation': 'portraint',
    },
    subtitle: {
        url: '/assets/sample/subtitle.srt',
        style: {
            color: '#fff',
            fontSize: '14px',
        },
    },
    layers: [
        {
            html: `<img style="width: 50px" src="/assets/sample/layer.png">`,
            click: function () {
                console.info('You clicked on the custom layer');
            },
            style: {
                position: 'absolute',
                top: '10px',
                right: '10px',
                opacity: '.9',
            },
        },
    ],
    icons: {
        loading: '<img src="./assets/img/ploading.gif">',
        state: '<img src="./assets/img/state.png">',
    },
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
            speed: 5,
            maxlength: 100,
            margin: [10, 70],
            opacity: 1,
            fontSize: 14,
            synchronousPlayback: false,
        }),
    ],
    whitelist: ['*'],
});

Artplayer.config.events.forEach(function (item) {
    art.on('video:' + item, function (event) {
        console.log('video: ' + event.type);
    });
});

if (art.isWechat) {
    document.querySelector('.tip').textContent = '微信环境需手动触发播放';
}

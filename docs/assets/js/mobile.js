var vConsole = new VConsole();

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    title: 'One More Time One More Chance',
    poster: '/assets/sample/poster.jpg',
    autoSize: true,
    loop: true,
    mutex: true,
    setting: true,
    flip: true,
    lock: true,
    playbackRate: true,
    aspectRatio: true,
    theme: '#ff0057',
    fullscreen: true,
    fullscreenWeb: true,
    miniProgressBar: true,
    moreVideoAttr: {
        preload: 'auto',
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
            html: `<img width="50" src="/assets/sample/layer.png">`,
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
        loading: '<img src="/assets/img/ploading.gif">',
        state: '<img width="150" heigth="150" src="/assets/img/state.svg">',
        indicator: '<img width="16" heigth="16" src="/assets/img/indicator.svg">',
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
    settings: [
        {
            width: 200,
            html: '自定义设置',
            tooltip: '提示',
            icon: '<img width="22" heigth="22" src="/assets/img/indicator.svg">',
            selector: [
                {
                    default: true,
                    html: '设置 01',
                },
                {
                    html: '设置 02',
                },
            ],
            onSelect: function (item) {
                console.info('你点击了', item.html);
                return item.html;
            },
        },
    ],
    whitelist: ['*'],
});

Artplayer.config.events.forEach(function (item) {
    art.on('video:' + item, function (event) {
        console.log('video: ' + event.type);
    });
});

if (Artplayer.utils.isWechat) {
    document.querySelector('.tip').textContent = '微信环境需手动触发播放';
}

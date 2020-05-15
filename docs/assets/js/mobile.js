var vConsole = new VConsole();
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    poster: url + '/image/one-more-time-one-more-chance-poster.jpg',
    autoSize: true,
    loop: true,
    mutex: true,
    theme: '#ffad00',
    miniProgressBar: true,
    moreVideoAttr: {
        playsInline: true,
        'webkit-playsinline': true,
        'x5-video-player-type': 'h5',
        'x5-video-player-fullscreen': false,
        'x5-video-orientation': 'portraint',
    },
    subtitle: {
        url: url + '/subtitle/one-more-time-one-more-chance.srt',
        style: {
            color: '#03A9F4',
            fontSize: '14px',
        },
    },
    layers: [
        {
            html: `<img style="width: 50px" src="${url}/image/your-name.png">`,
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

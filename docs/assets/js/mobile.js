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
    fullscreenWeb: true,
    miniProgressBar: true,
    lang: navigator.language.toLowerCase(),
    moreVideoAttr: {
        'webkit-playsinline': true,
        playsInline: true,
        crossOrigin: 'anonymous',
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
    // whitelist: ['iPhone'],
    // whitelist: [(ua)=>{ return /iPhone OS 11/gi.test(ua); }],
    // whitelist: [/iPhone OS 11/gi]
});

Artplayer.config.events.forEach(function (item) {
    art.on('video:' + item, function (event) {
        console.log('video: ' + event.type);
    });
});

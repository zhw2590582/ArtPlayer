var vConsole = new VConsole();
var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    moreVideoAttr: {
        'webkit-playsinline': true,
        playsInline: true,
    },
    // whitelist: ['iPhone'],
    // whitelist: [(ua)=>{ return /iPhone OS 11/gi.test(ua); }],
    // whitelist: [/iPhone OS 11/gi]
});

Artplayer.config.events.forEach(function (item) {
    art.on('video:' + item, function (event) {
        console.log('video: ' + event.type);
    });
});

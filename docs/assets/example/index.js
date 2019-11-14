var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    title: 'One More Time One More Chance',
    poster: url + '/image/one-more-time-one-more-chance-poster.jpg',
    volume: 0.5,
    isLive: false,
    muted: false,
    autoplay: false,
    pip: true,
    autoSize: true,
    screenshot: true,
    setting: true,
    loop: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    fullscreen: true,
    fullscreenWeb: true,
    subtitleOffset: true,
    miniProgressBar: true,
    localVideo: true,
    localSubtitle: true,
    networkMonitor: false,
    autoPip: true,
    mutex: true,
    theme: '#ffad00',
    lang: navigator.language.toLowerCase(),
    moreVideoAttr: {
        crossOrigin: 'anonymous',
    },
    contextmenu: [
        {
            html: 'Custom menu',
            click: function(contextmenu) {
                console.info('You clicked on the custom menu');
                contextmenu.show = false;
            },
        },
    ],
    layers: [
        {
            html: `<img style="width: 100px" src="${url}/image/your-name.png">`,
            click: function() {
                art.destroy(true);
                art = new Artplayer({
                    autoplay: true,
                    container: '.artplayer-app',
                    url: url + '/video/your-name.mp4',
                });
            },
            style: {
                position: 'absolute',
                top: '20px',
                right: '20px',
                opacity: '.9',
            },
        },
    ],
    quality: [
        {
            default: true,
            name: 'SD 480P',
            url: url + '/video/one-more-time-one-more-chance-480p.mp4',
        },
        {
            name: 'HD 720P',
            url: url + '/video/one-more-time-one-more-chance-720p.mp4',
        },
    ],
    thumbnails: {
        url: url + '/image/one-more-time-one-more-chance-thumbnails.png',
        number: 100,
        width: 160,
        height: 90,
        column: 10,
    },
    subtitle: {
        url: url + '/subtitle/one-more-time-one-more-chance.srt',
        style: {
            color: '#03A9F4',
        },
    },
    highlight: [
        {
            time: 60,
            text: 'One more chance',
        },
        {
            time: 120,
            text: '谁でもいいはずなのに',
        },
        {
            time: 180,
            text: '夏の想い出がまわる',
        },
        {
            time: 240,
            text: 'こんなとこにあるはずもないのに',
        },
        {
            time: 300,
            text: '终わり',
        },
    ],
    controls: [
        {
            name: 'localVideo',
            position: 'right',
            html: 'VIDEO',
            tooltip: 'Open Local Video',
            mounted: $preview => {
                art.plugins.localVideo.attach($preview);
            },
        },
        {
            name: 'localSubtitle',
            position: 'right',
            html: 'SUBTITLE',
            tooltip: 'Open Local Subtitle',
            mounted: $preview => {
                art.plugins.localSubtitle.attach($preview);
            },
        },
    ],
    icons: {
        loading: '<img src="./assets/img/ploading.gif">',
        state: '<img src="./assets/img/state.png">',
    },
});

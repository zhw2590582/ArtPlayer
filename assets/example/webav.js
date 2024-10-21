// From: https://github.com/bilibili/WebAV
// npm i artplayer-proxy-webav
// import artplayerProxyWebAV from 'artplayer-proxy-webav';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/bbb-video.mp4',
    volume: 0.5,
    autoplay: false,
    autoSize: false,
    screenshot: true,
    setting: true,
    loop: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    fullscreen: true,
    fullscreenWeb: true,
    miniProgressBar: true,
    autoPlayback: true,
    thumbnails: {
        url: '/assets/sample/bbb-sprite.jpg',
        number: 121,
        column: 11,
        width: 128,
        height: 72,
    },
    proxy: artplayerProxyWebAV({
        //
    }),
});
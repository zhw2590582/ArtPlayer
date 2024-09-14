// npm i artplayer-proxy-canvas
// import artplayerProxyCanvas from 'artplayer-proxy-canvas';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    poster: '/assets/sample/poster.jpg',
    volume: 0.5,
    autoplay: false,
    autoSize: false,
    screenshot: true,
    setting: true,
    loop: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    fullscreenWeb: true,
    miniProgressBar: true,
    autoPlayback: true,
    autoOrientation: true,
    thumbnails: {
        url: '/assets/sample/thumbnails.png',
        number: 60,
        column: 10,
        scale: 0.85,
    },
    controls: [
        {
            position: 'right',
            html: 'play',
            index: 1,
            click: function () {
                window.video.play();
            },
        },
        {
            position: 'right',
            html: 'pause',
            index: 2,
            click: function () {
                window.video.pause();
            },
        },
    ],
    proxy: artplayerProxyCanvas(),
});
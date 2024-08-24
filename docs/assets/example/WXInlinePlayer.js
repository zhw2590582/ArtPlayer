// From: https://github.com/ErosZy/WXInlinePlayer
// npm i artplayer-proxy-flv
// import artplayerProxyFlv from 'artplayer-proxy-flv';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.flv',
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
    proxy: artplayerProxyFlv({
        asmUrl: '/assets/js/WXInlinePlayer/prod.all.asm.combine.js',
        wasmUrl: '/assets/js/WXInlinePlayer/prod.all.wasm.combine.js',
        hasVideo: true,
        hasAudio: true,
        volume: 1.0,
        muted: false,
        autoplay: false,
        loop: true,
        isLive: false,
        chunkSize: 128 * 1024,
        preloadTime: 5e2,
        bufferingTime: 1e3,
        cacheSegmentCount: 64,
        customLoader: null
    }),
});
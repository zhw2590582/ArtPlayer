// npm i artplayer-proxy-mediabunny
// import artplayerProxyMediabunny from 'artplayer-proxy-mediabunny';

const art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/frag_bunny.mp4',
    autoSize: false,
    screenshot: true,
    setting: true,
    loop: true,
    flip: true,
    playbackRate: true,
    fullscreen: true,
    fullscreenWeb: true,
    miniProgressBar: true,
    autoPlayback: true,
    autoOrientation: true,
    proxy: artplayerProxyMediabunny(),
})

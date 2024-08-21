// From: https://github.com/bilibili/WebAV
// npm i artplayer-proxy-webav
// import artplayerProxyWebAV from 'artplayer-proxy-webav';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/frag_bunny.mp4',
    proxy: artplayerProxyWebAV({
        //
    }),
});
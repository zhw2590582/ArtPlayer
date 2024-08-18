// npm i artplayer-proxy-webav
// import artplayerProxyWebAV from 'artplayer-proxy-webav';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    proxy: artplayerProxyWebAV({
        //
    }),
});
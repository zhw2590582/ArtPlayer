// npm i artplayer-proxy-libmedia
// import artplayerProxyLibmedia from 'artplayer-proxy-libmedia';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    proxy: artplayerProxyLibmedia({
        //
    }),
});
// npm i artplayer-proxy-mediabunny
// import artplayerProxyMediabunny from 'artplayer-proxy-mediabunny';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerProxyMediabunny({
            //
        }),
    ],
});
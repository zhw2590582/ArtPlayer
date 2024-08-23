// npm i artplayer-plugin-vast
// import artplayerPluginVast from 'artplayer-plugin-vast';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginVast(({ playUrl }) => {
            //
        }),
    ],
});
// npm i artplayer-plugin-vast
// import ArtplayerPluginVast from 'artplayer-plugin-vast';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        ArtplayerPluginVast({
            url: '/assets/sample/vast.xml',
        }),
    ],
});
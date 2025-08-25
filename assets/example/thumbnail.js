// npm i artplayer-plugin-thumbnail
// import artplayerPluginThumbnail from 'artplayer-plugin-thumbnail';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginThumbnail({
            width: 160,
            number: 100,
            scale: 1,
        }),
    ],
});
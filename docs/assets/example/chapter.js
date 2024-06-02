// npm i artplayer-plugin-chapter
// import artplayerPluginChapter from 'artplayer-plugin-chapter';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginChapter({
            //
        }),
    ],
});
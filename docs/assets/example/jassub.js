// npm i artplayer-plugin-jassub
// import artplayerPluginJassub from 'artplayer-plugin-jassub';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginJassub({
            //
        }),
    ],
});
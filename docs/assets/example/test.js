// npm i artplayer-plugin-test
// import artplayerPluginTest from 'artplayer-plugin-test';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginTest({
            //
        }),
    ],
});
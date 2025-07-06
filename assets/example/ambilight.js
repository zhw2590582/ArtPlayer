// npm i artplayer-plugin-ambilight
// import artplayerPluginAmbilight from 'artplayer-plugin-ambilight';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
    plugins: [
        artplayerPluginAmbilight({
            blur: '50px', 
            opacity: 1, 
            frequency: 10, 
            duration: 0.3,
        }),
    ],
});
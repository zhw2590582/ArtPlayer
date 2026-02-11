// npm i artplayer-plugin-websr
// import artplayerPluginWebsr from 'artplayer-plugin-websr';

var art = new Artplayer({
    container: ".artplayer-app",
    url: "/assets/sample/video3.mp4",
    fullscreenWeb: true,
    plugins: [
        artplayerPluginWebsr({
            networkSize: 'medium',
            weightsBaseUrl: '/assets/websr/weights',
            workerUrl: '/assets/websr/worker/main.js',
            compare: true,
        }),
    ],
});

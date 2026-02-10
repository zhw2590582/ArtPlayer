// npm i artplayer-plugin-websr
// import artplayerPluginWebsr from 'artplayer-plugin-websr';

var art = new Artplayer({
    container: ".artplayer-app",
    url: "/assets/sample/video3.mp4",
    fullscreenWeb: true,
    plugins: [
        artplayerPluginWebsr({
            scale: 2,
            compare: true,
            weights: "/assets/websr/cnn-2x-m-an.json",
            networkName: "anime4k/cnn-2x-m",
        }),
    ],
});

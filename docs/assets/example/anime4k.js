// https://github.com/Anime4KWebBoost/Anime4K-WebGPU
// npm i artplayer-plugin-anime4k
// import artplayerPluginAnime4k from 'artplayer-plugin-anime4k';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video3.mp4',
    fullscreenWeb: true,
    autoSize: true,
    plugins: [
        artplayerPluginAnime4k({
            preset: 'modeA',
            compare: true,
        }),
    ],
});
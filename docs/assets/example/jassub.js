// https://github.com/ThaUnknown/jassub
// npm i artplayer-plugin-jassub
// import artplayerPluginJassub from 'artplayer-plugin-jassub';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/jassub/FateGrandOrderBabylonia-OP1v2-NCBD1080.webm',
    autoSize: true,
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginJassub({
            subUrl: '/assets/jassub/FGOBD.ass',
            workerUrl: '/assets/jassub/jassub-worker.js',
            wasmUrl: '/assets/jassub/jassub-worker.wasm',
            modernWasmUrl: '/assets/jassub/jassub-worker-modern.wasm',
            availableFonts: {
                'liberation sans': '/assets/jassub/default.woff2'
            },
            fonts: [
                '/assets/jassub/fonts/Averia Sans Libre Light.ttf',
                '/assets/jassub/fonts/Averia Serif Simple Light.ttf',
                '/assets/jassub/fonts/Gramond.ttf'
            ],
            timeOffset: -0.041
        }),
    ],
});
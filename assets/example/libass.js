// npm i artplayer-plugin-libass
// import artplayerPluginLibass from 'artplayer-plugin-libass';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
    subtitle: {
        url: '/assets/sample/style-test.ass',
    },
    plugins: [
        artplayerPluginLibass({
            // debug: true,
            workerUrl: 'https://unpkg.com/libass-wasm@4.1.0/dist/js/subtitles-octopus-worker.js',
            // wasmUrl: 'https://unpkg.com/libass-wasm@4.1.0/dist/js/subtitles-octopus-worker.wasm',
            fallbackFont: '/assets/misc/SourceHanSansCN-Bold.woff2'
        }),
    ],
});

// init
art.on('artplayerPluginLibass:init', (adapter) => {
    console.info('artplayerPluginLibass:init', adapter);
});

// subtitle switch
art.on('artplayerPluginLibass:switch', (url) => {
    console.info('artplayerPluginLibass:switch', url);
})

// subtitle visible
art.on('artplayerPluginLibass:visible', (visible) => {
    console.info('artplayerPluginLibass:visible', visible);
})

// subtitle timeOffset
art.on('artplayerPluginLibass:timeOffset', (timeOffset) => {
    console.info('artplayerPluginLibass:timeOffset', timeOffset);
})

// destroy
art.on('artplayerPluginLibass:destroy', () => {
    console.info('artplayerPluginLibass:destroy');
})

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    poster: '/assets/sample/poster.jpg',
    volume: 0.5,
    isLive: false,
    muted: false,
    autoplay: false,
    pip: true,
    autoSize: true,
    autoMini: true,
    screenshot: true,
    setting: true,
    loop: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    fullscreen: true,
    fullscreenWeb: true,
    subtitleOffset: true,
    miniProgressBar: true,
    mutex: true,
    backdrop: true,
    playsInline: true,
    autoPlayback: true,
    airplay: true,
    theme: '#23ade5',
    lang: navigator.language.toLowerCase(),
    moreVideoAttr: {
        crossOrigin: 'anonymous',
    },
    settings: [
        {
            width: 200,
            html: 'Subtitle',
            tooltip: 'Bilingual',
            icon: '<img width="22" heigth="22" src="/assets/img/subtitle.svg">',
            selector: [
                {
                    html: 'Display',
                    tooltip: 'Show',
                    switch: true,
                    onSwitch: function (item) {
                        item.tooltip = item.switch ? 'Hide' : 'Show';
                        art.subtitle.show = !item.switch;
                        return !item.switch;
                    },
                },
                {
                    html: 'Style Test',
                    url: '/assets/sample/style-test.ass',
                },
                {
                    default: true,
                    html: 'Bilingual',
                    url: '/assets/sample/subtitle.ass',
                },
                {
                    html: 'subtitle.srt',
                    url: '/assets/sample/subtitle.srt',
                },
            ],
            onSelect: function (item) {
                art.subtitle.switch(item.url, {
                    name: item.html,
                });
                return item.html;
            },
        },
    ],
    subtitle: {
        url: '/assets/sample/subtitle.ass',
        style: {
            color: '#48aff0',
            fontSize: '16px',
        },
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

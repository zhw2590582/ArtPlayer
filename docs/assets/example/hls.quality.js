var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    setting: true,
    plugins: [
        artplayerPluginHlsQuality({
            // Show quality in control
            control: true,

            // Show quality in setting
            setting: true,

            // I18n
            title: 'Quality',
            auto: 'Auto',
        }),
    ],
    customType: {
        m3u8: function (video, url) {
            // Attach the Hls instance to the Artplayer instance
            art.hls = new Hls();
            art.hls.loadSource(url);
            art.hls.attachMedia(video);
        },
    },
});

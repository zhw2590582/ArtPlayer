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

            // Get the resolution text from level
			getResolution: (level) => level.height + 'P',

            // I18n
            title: 'Quality',
            auto: 'Auto',
        }),
    ],
    customType: {
        m3u8: function playM3u8(video, url, art) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
                art.hls = hls;
                art.once('url', () => hls.destroy());
                art.once('destroy', () => hls.destroy());
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else {
                art.notice.show = 'Unsupported playback format: m3u8';
            }
        }
    },
});

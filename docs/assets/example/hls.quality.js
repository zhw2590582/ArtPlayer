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
            if (Hls.isSupported()) {
                // Destroy the last decoder instance before switching url
                if (art.hls) art.hls.destroy();

                // When the player is destroyed, the decoder instance must also be destroyed
                art.on('destroy', () => {
                    if (art.hls) art.hls.destroy();
                });

                // Attach the Hls instance to the Artplayer instance
                art.hls = new Hls();
                art.hls.loadSource(url);
                art.hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else {
                art.notice.show = 'Does not support playback of m3u8';
            }
        },
    },
});

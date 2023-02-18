var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
    setting: true,
    plugins: [
        artplayerPluginDashQuality({
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
        mpd: function playMpd(video, url, art) {
            if (dashjs.supportsMediaSource()) {
                const dash = dashjs.MediaPlayer().create();
                dash.initialize(video, url, art.option.autoplay);
                art.dash = dash; 
                art.once('url', () => dash.destroy());
                art.once('destroy', () => dash.destroy());
            } else {
                art.notice.show = 'Unsupported playback format: mpd';
            }
        }
    },
});

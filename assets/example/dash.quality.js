// npm i dashjs
// npm i artplayer-plugin-dash-quality

// import dashjs from 'dashjs';
// import artplayerPluginDashQuality from 'artplayer-plugin-dash-quality';

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
                if (art.dash) art.dash.destroy();
                const dash = dashjs.MediaPlayer().create();
                dash.initialize(video, url, art.option.autoplay);
                art.dash = dash; 
                art.on('destroy', () => dash.destroy());
            } else {
                art.notice.show = 'Unsupported playback format: mpd';
            }
        }
    },
});

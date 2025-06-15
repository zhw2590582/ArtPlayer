// npm i dashjs
// npm i artplayer-plugin-dash-control

// import dashjs from 'dashjs';
// import artplayerPluginDashControl from 'artplayer-plugin-dash-control';

var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://media.axprod.net/TestVectors/v7-Clear/Manifest_1080p.mpd',
    setting: true,
    plugins: [
        artplayerPluginDashControl({
            quality: {
                // Show qualitys in control
                control: true,
                // Show qualitys in setting
                setting: true,
                // Get the quality name from level
                getName: (level) => level.height + 'P',
                // I18n
                title: 'Quality',
                auto: 'Auto',
            },
            audio: {
                // Show audios in control
                control: true,
                // Show audios in setting
                setting: true,
                // Get the audio name from track
                getName: (track) => track.lang.toUpperCase(),
                // I18n
                title: 'Audio',
                auto: 'Auto',
            }
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

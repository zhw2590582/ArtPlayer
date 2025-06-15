// npm i hls.js
// npm i artplayer-plugin-hls-control

// import Hls from 'hls.js';
// import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';

var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://playertest.longtailvideo.com/adaptive/elephants_dream_v4/index.m3u8',
    setting: true,
    plugins: [
        artplayerPluginHlsControl({
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
                getName: (track) => track.name,
                // I18n
                title: 'Audio',
                auto: 'Auto',
            }
        }),
    ],
    customType: {
        m3u8: function playM3u8(video, url, art) {
            if (Hls.isSupported()) {
				if (art.hls) art.hls.destroy();
				const hls = new Hls();
				hls.loadSource(url);
				hls.attachMedia(video);
				art.hls = hls;
				art.on('destroy', () => hls.destroy());
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else {
                art.notice.show = 'Unsupported playback format: m3u8';
            }
        }
    },
});

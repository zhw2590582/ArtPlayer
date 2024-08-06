// npm i hls.js
// npm i artplayer-plugin-hls-quality

// import Hls from 'hls.js';
// import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality';

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

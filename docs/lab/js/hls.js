var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
    customType: {
        m3u8: function(video, url) {
            var hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        },
    },
});
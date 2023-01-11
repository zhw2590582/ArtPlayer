# hls.js

👉 [https://github.com/video-dev/hls.js](https://github.com/video-dev/hls.js)

<div className="run-code" data-libs="https://cdnjs.cloudflare.com/ajax/libs/hls.js/8.0.0-beta.3/hls.min.js">
    ▶ Run Code
</div>

```js{21-24,28}
function playM3u8(video, url, art) {
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);

        // optional
        art.hls = hls;
        art.once('url', () => hls.destroy());
        art.once('destroy', () => hls.destroy());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
    } else {
        art.notice.show = 'Unsupported playback format: m3u8';
    }
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type: 'm3u8',
    customType: {
        m3u8: playM3u8,
    },
});

art.on('ready', () => {
    console.info(art.hls);
});
```
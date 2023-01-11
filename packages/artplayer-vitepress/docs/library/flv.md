# flv.js

👉 [https://github.com/Bilibili/flv.js](https://github.com/Bilibili/flv.js)

<div className="run-code" data-libs="https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.6.2/flv.min.js">
    ▶ Run Code
</div>

```js{19-22,26}
function playFlv(video, url, art) {
    if (flvjs.isSupported()) {
        const flv = flvjs.createPlayer({ type: 'flv', url });
        flv.attachMediaElement(video);
        flv.load();

        // optional
        art.flv = flv; 
        art.once('url', () => flv.destroy());
        art.once('destroy', () => flv.destroy());
    } else {
        art.notice.show = 'Unsupported playback format: flv';
    }
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.flv',
    type: 'flv',
    customType: {
        flv: playFlv,
    },
});

art.on('ready', () => {
    console.info(art.flv);
});
```
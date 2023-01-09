# dash.js

[https://github.com/Dash-Industry-Forum/dash.js](https://github.com/Dash-Industry-Forum/dash.js)

<div className="run-code" data-libs="https://cdnjs.cloudflare.com/ajax/libs/dashjs/4.5.2/dash.all.min.js">
    ▶ Run Code
</div>

```js{15-18}
function playMpd(video, url, art) {
    if (dashjs.supportsMediaSource()) {
        const dash = dashjs.MediaPlayer().create();
        dash.initialize(video, url, art.option.autoplay);
        art.once('url', () => dash.destroy());
        art.once('destroy', () => dash.destroy());
    } else {
        art.notice.show = 'Unsupported playback format: mpd';
    }
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd',
    type: 'mpd',
    customType: {
        mpd: playMpd
    },
});
```
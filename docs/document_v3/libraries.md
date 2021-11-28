## flv.js

-   HomePage: [https://github.com/Bilibili/flv.js](https://github.com/Bilibili/flv.js)

[Run Code](/lib=https://cdn.bootcss.com/flv.js/1.4.2/flv.js)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    autoplay: true,
    url: '/assets/sample/video.flv',
    customType: {
        flv: function (video, url) {
            const flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: url,
            });
            flvPlayer.attachMediaElement(video);
            flvPlayer.load();
        },
    },
});
```

## hls.js

-   HomePage: [https://github.com/video-dev/hls.js](https://github.com/video-dev/hls.js)

[Run Code](/lib=https://cdn.bootcss.com/hls.js/0.10.1/hls.js)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    autoplay: true,
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    customType: {
        m3u8: function (video, url) {
            var hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
        },
    },
});
```

## dash.js

-   HomePage: [https://github.com/Dash-Industry-Forum/dash.js](https://github.com/Dash-Industry-Forum/dash.js)

[Run Code](/lib=https://cdn.bootcss.com/dashjs/2.9.2/dash.all.min.js)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    autoplay: true,
    url: 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd',
    customType: {
        mpd: function (video, url) {
            var player = dashjs.MediaPlayer().create();
            player.initialize(video, url, true);
        },
    },
});
```

## shaka-player

-   HomePage: [https://github.com/google/shaka-player](https://github.com/google/shaka-player)

[Run Code](/lib=https://cdn.bootcss.com/shaka-player/2.5.0-beta/shaka-player.compiled.js)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    autoplay: true,
    url: '//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
    customType: {
        mpd: function (video, url) {
            shaka.polyfill.installAll();
            var player = new shaka.Player(video);
            player.load(url);
        },
    },
});
```

## webtorrent

-   HomePage: [https://github.com/webtorrent/webtorrent](https://github.com/webtorrent/webtorrent)

[Run Code](/lib=https://cdn.bootcss.com/webtorrent/0.102.4/webtorrent.min.js)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    autoplay: true,
    url:
        'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4',
    type: 'torrent',
    customType: {
        torrent: function (video, url, art) {
            var client = new WebTorrent();
            art.loading.show = true;
            client.add(url, function (torrent) {
                var file = torrent.files[0];
                file.renderTo(video, {
                    autoplay: true,
                });
            });
        },
    },
});
```

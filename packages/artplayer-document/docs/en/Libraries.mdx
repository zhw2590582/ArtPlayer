---
title: Third party librarys
sidebar_position: 7
slug: /libraries
---

## flv.js

-   Homepage: [https://github.com/Bilibili/flv.js](https://github.com/Bilibili/flv.js)

<div className="run-code" data-libs="https://cdn.jsdelivr.net/npm/flv.js@1.6.2/dist/flv.min.js">▶ Run Code</div>

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

-   Homepage: [https://github.com/video-dev/hls.js](https://github.com/video-dev/hls.js)

<div className="run-code" data-libs="https://cdn.jsdelivr.net/npm/hls.js@1.1.1/dist/hls.min.js">▶ Run Code</div>

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

-   Homepage: [https://github.com/Dash-Industry-Forum/dash.js](https://github.com/Dash-Industry-Forum/dash.js)

<div className="run-code" data-libs="https://cdn.jsdelivr.net/npm/dashjs@4.1.0/dist/dash.all.debug.min.js">▶ Run Code</div>

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

-   Homepage: [https://github.com/google/shaka-player](https://github.com/google/shaka-player)

<div className="run-code" data-libs="https://cdn.jsdelivr.net/npm/shaka-player@3.2.1/dist/shaka-player.compiled.min.js">▶ Run Code</div>

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

-   Homepage: [https://github.com/webtorrent/webtorrent](https://github.com/webtorrent/webtorrent)

<div className="run-code" data-libs="https://cdn.jsdelivr.net/npm/webtorrent@1.5.8/webtorrent.min.js">▶ Run Code</div>

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

art.on('ready', () => {
    art.template.$video.controls = false;
});
```

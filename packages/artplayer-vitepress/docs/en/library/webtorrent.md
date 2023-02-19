# webtorrent.js

👉 [https://github.com/webtorrent/webtorrent](https://github.com/webtorrent/webtorrent)

<div className="run-code" data-libs="https://cdn.jsdelivr.net/npm/webtorrent@2.0.13/index.min.js">
    ▶ Run Code
</div>

```js{21-24,28}
function playTorrent(video, url, art) {
    const torrent = new WebTorrent();
    torrent.add(url, function (torrent) {
        var file = torrent.files[0];
        file.renderTo(video, {
            autoplay: art.option.autoplay,
        });
    });

    // optional
    art.torrent = torrent;
    art.once('url', () => torrent.destroy());
    art.once('destroy', () => torrent.destroy());
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: 'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4',
    type: 'torrent',
    customType: {
        torrent: playTorrent,
    },
});

art.on('ready', () => {
    art.video.controls = false;
    console.info(art.torrent);
});
```
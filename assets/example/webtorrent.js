// npm i webtorrent
// import WebTorrent from 'webtorrent';

async function playTorrent(video, url, art) {
    if (WebTorrent.WEBRTC_SUPPORT) {
        if (art.torrent) art.torrent.destroy();
        art.torrent = new WebTorrent();

        await navigator.serviceWorker.register('/webtorrent.sw.min.js');
        art.torrent.loadWorker(navigator.serviceWorker.controller);

        art.torrent.add(url, (torrent) => {
            const file = torrent.files.find((file) => {
                return file.name.endsWith('.mp4');
            });
            file.streamTo(video);
        });

        art.on('destroy', () => art.torrent.destroy());
    } else {
        art.notice.show = 'Unsupported playback format: torrent';
    }
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent',
    type: 'torrent',
    customType: {
        torrent: playTorrent,
    },
});

art.on('ready', () => {
    console.info(art.torrent);
});

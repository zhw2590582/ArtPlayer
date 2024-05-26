// npm i flv.js
// import flvjs from 'flv.js';

function playFlv(video, url, art) {
    if (flvjs.isSupported()) {
        if (art.flv) art.flv.destroy();
        const flv = flvjs.createPlayer({ type: 'flv', url });
        flv.attachMediaElement(video);
        flv.load();
        art.flv = flv; 
        art.on('destroy', () => flv.destroy());
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
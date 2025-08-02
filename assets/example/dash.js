// npm i dashjs
// import dashjs from 'dashjs';

function playMpd(video, url, art) {
    if (dashjs.supportsMediaSource()) {
        if (art.dash) art.dash.destroy();
        const dash = dashjs.MediaPlayer().create();
        dash.initialize(video, url, art.option.autoplay);
        art.dash = dash; 
        art.on('destroy', () => dash.destroy());
    } else {
        art.notice.show = 'Unsupported playback format: mpd';
    }
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
    type: 'mpd',
    customType: {
        mpd: playMpd
    },
});

art.on('ready', () => {
    console.info(art.dash);
});
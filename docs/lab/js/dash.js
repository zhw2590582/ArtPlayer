var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd',
    customType: {
        mpd: function(video, url) {
            var player = dashjs.MediaPlayer().create();
            player.initialize(video, url, true);
        },
    },
});
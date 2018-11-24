var art = new Artplayer({
    container: '.artplayer-app',
    url: '//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
    customType: {
        mpd: function(video, url) {
            shaka.polyfill.installAll();
            var player = new shaka.Player(video);
            player.load(url);
        },
    },
});
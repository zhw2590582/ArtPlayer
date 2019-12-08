var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/your-name.mp4',
    poster: url + '/image/one-more-time-one-more-chance-poster.jpg',
    autoSize: true,
    controls: [
        {
            name: 'playlist',
            position: 'right',
            html: 'Playlist',
            click: () => {
                art.plugins.artplayerPluginPlaylist.show();
            },
        },
        {
            name: 'prev',
            position: 'right',
            html: 'Prev',
            click: () => {
                art.plugins.artplayerPluginPlaylist.prev();
            },
        },
        {
            name: 'next',
            position: 'right',
            html: 'Next',
            click: () => {
                art.plugins.artplayerPluginPlaylist.next();
            },
        },
    ],
    plugins: [
        artplayerPluginPlaylist([
            {
                title: 'Your name',
                url: url + '/video/your-name.mp4',
            },
            {
                title: 'One more time one more chance',
                url: url + '/video/one-more-time-one-more-chance-480p.mp4',
            },
        ]),
    ],
});

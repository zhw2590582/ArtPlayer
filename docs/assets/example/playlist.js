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
            html: '播放列表',
            click: () => {
                art.plugins.artplayerPluginPlaylist.show();
            },
            style: {
                marginRight: '15px',
            },
        },
        {
            name: 'prev',
            position: 'right',
            html: '上一个',
            click: () => {
                art.plugins.artplayerPluginPlaylist.prev();
            },
            style: {
                marginRight: '15px',
            },
        },
        {
            name: 'next',
            position: 'right',
            html: '下一个',
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

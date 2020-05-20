var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
    setting: true,
    playbackRate: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
            speed: 5,
            maxlength: 50,
            margin: [10, 100],
            opacity: 1,
            fontSize: 25,
            synchronousPlayback: false,
        }),
    ],
    controls: [
        {
            position: 'right',
            html: 'Hide',
            click: function () {
                art.plugins.artplayerPluginDanmuku.hide();
            },
        },
        {
            position: 'right',
            html: 'Show',
            click: function () {
                art.plugins.artplayerPluginDanmuku.show();
            },
        },
        {
            position: 'right',
            html: 'Send',
            click: function () {
                var text = prompt('Please enter', 'Danmu text');
                if (!text || !text.trim()) return;
                var color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
                art.plugins.artplayerPluginDanmuku.emit({
                    text: text,
                    color: color,
                    border: true,
                });
            },
        },
    ],
});

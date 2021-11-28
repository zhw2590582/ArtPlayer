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
            html: '隐藏弹幕',
            click: function (_, event) {
                if (art.plugins.artplayerPluginDanmuku.isHide) {
                    art.plugins.artplayerPluginDanmuku.show();
                    event.target.innerText = '隐藏弹幕';
                } else {
                    art.plugins.artplayerPluginDanmuku.hide();
                    event.target.innerText = '显示弹幕';
                }
            },
        },
        {
            position: 'right',
            html: '发送弹幕',
            click: function () {
                var text = prompt('请输入弹幕文本', '弹幕测试文本');
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

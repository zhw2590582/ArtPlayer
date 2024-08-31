var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    poster: '/assets/sample/poster.jpg',
    autoSize: true,
    loop: true,
    mutex: true,
    setting: true,
    flip: true,
    lock: true,
    fastForward: true,
    playbackRate: true,
    aspectRatio: true,
    theme: '#ff0057',
    fullscreen: true,
    fullscreenWeb: true,
    miniProgressBar: true,
    autoOrientation: true,
    airplay: true,
    moreVideoAttr: {
        'x5-video-player-type': 'h5',
        'x5-video-player-fullscreen': false,
        'x5-video-orientation': 'portraint',
        preload: "metadata"
    },
    thumbnails: {
        url: '/assets/sample/thumbnails.png',
        number: 60,
        column: 10,
        scale: 0.6
    },
    subtitle: {
        name: '中日双语',
        url: '/assets/sample/subtitle.srt',
        style: {
            color: '#48aff0',
            fontSize: '16px',
        },
    },
    layers: [
        {
            html: `<img width="50" src="/assets/sample/layer.png">`,
            click: function () {
                art.notice.show = "你点击了自定义层";
            },
            style: {
                position: 'absolute',
                top: '10px',
                right: '10px',
                opacity: '.9',
            },
        },
    ],
    icons: {
        loading: '<img src="/assets/img/ploading.gif">',
        state: '<img width="150" heigth="150" src="/assets/img/state.svg">',
        indicator: '<img width="16" heigth="16" src="/assets/img/indicator.svg">',
    },
    settings: [
        {
            width: 200,
            html: '切换字幕',
            tooltip: '双语',
            icon: '<img width="22" heigth="22" src="/assets/img/subtitle.svg">',
            selector: [
                {
                    html: '开关',
                    switch: true,
                    tooltip: '显示',
                    onSwitch: function (item) {
                        item.tooltip = item.switch ? '隐藏' : '显示';
                        art.subtitle.show = !item.switch;
                        return !item.switch;
                    },
                },
                {
                    default: true,
                    html: '双语',
                    url: '/assets/sample/subtitle.srt'
                },
                {
                    html: '中文',
                    url: '/assets/sample/subtitle.cn.srt'
                },
                {
                    html: '日文',
                    url: '/assets/sample/subtitle.jp.srt'
                },
            ],
            onSelect: function (item) {
                art.subtitle.switch(item.url, {
                    name: item.html
                });
                return item.html;
            },
        },
    ],
});
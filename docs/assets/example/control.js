var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    pip: true,
    screenshot: true,
    setting: true,
    loop: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    fullscreen: true,
    fullscreenWeb: true,
    subtitleOffset: true,
    miniProgressBar: true,
    airplay: true,
    theme: '#23ade5',
    thumbnails: {
        url: '/assets/sample/thumbnails.png',
        number: 60,
        column: 10,
    },
    subtitle: {
        url: '/assets/sample/subtitle.srt',
        type: 'srt',
        style: {
            color: '#fe9200',
            fontSize: '20px',
        },
        encoding: 'utf-8',
    },
    highlight: [
        {
            time: 15,
            text: 'One more chance',
        },
        {
            time: 30,
            text: '谁でもいいはずなのに',
        },
        {
            time: 45,
            text: '夏の想い出がまわる',
        },
        {
            time: 60,
            text: 'こんなとこにあるはずもないのに',
        },
        {
            time: 75,
            text: '终わり',
        },
    ],
    icons: {
        loading: '<img src="/assets/img/ploading.gif">',
        state: '<img width="150" heigth="150" src="/assets/img/state.svg">',
        indicator: '<img width="16" heigth="16" src="/assets/img/indicator.svg">',
    },
    settings: [
        {
            html: 'Control UI',
            icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
            tooltip: 'OFF',
            switch: true,
            onSwitch: async function (item) {
                item.tooltip = item.switch ? 'OFF' : 'ON';
                art.plugins.artplayerPluginControl.enable = !item.switch;
                await Artplayer.utils.sleep(300);
                art.setting.updateStyle();
                return !item.switch;
            },
        },
    ],
    plugins: [
        artplayerPluginControl()
    ],
});

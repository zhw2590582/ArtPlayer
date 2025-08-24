// npm i artplayer-plugin-bil-control
// import artplayerPluginBilControl from 'artplayer-plugin-bil-control';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    volume: 0.5,
    isLive: false,
    muted: false,
    autoplay: false,
    pip: true,
    autoSize: true,
    autoMini: true,
    screenshot: false,
    setting: true,
    loop: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    fullscreen: true,
    fullscreenWeb: true,
    subtitleOffset: false,
    miniProgressBar: true,
    mutex: true,
    backdrop: true,
    playsInline: true,
    autoPlayback: true,
    airplay: true,
    theme: '#23ade5',
    lang: navigator.language.toLowerCase(),
    moreVideoAttr: {
        crossOrigin: 'anonymous',
    },
    plugins: [
        artplayerPluginBilControl({
            //
        })
    ],
    thumbnails: {
        url: '/assets/sample/thumbnails.png',
        number: 60,
        column: 10,
        scale: 0.85,
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
        state: '<img width="150" height="150" src="/assets/img/state.svg">',
        indicator: '<img width="16" height="16" src="/assets/img/indicator.svg">',
    },
});
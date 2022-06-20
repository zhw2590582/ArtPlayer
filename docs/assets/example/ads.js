var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginAds({
            // html广告，假如是视频广告则忽略该值
            html: '<img src="/assets/sample/poster.jpg">',

            // 视频广告的地址
            video: '/assets/sample/test1.mp4',

            // 广告跳转网址，为空则不跳转
            url: 'http://artplayer.org',

            // 必须观看的时长，期间不能被跳过，单位为秒
            playDuration: 5,

            // 广告总时长，单位为秒
            totalDuration: 10,

            // 多语言
            i18n: {
                //
            },
        }),
    ],
});

// 广告被点击
art.on('artplayerPluginAds:click', (ads) => {
    console.info('广告被点击', ads);
});

// 广告被跳过
art.on('artplayerPluginAds:skip', (ads) => {
    console.info('广告被跳过', ads);
});

var art = new Artplayer({
    container: '.artplayer-app',
    url: 'https://artplayer.org/assets/sample/video.mp4',
    muted: true,
    autoSize: true,
    autoplay: true,
    ads: [
        {
            url: '/assets/sample/test1.mp4'
        },
        {
            url: '/assets/sample/test2.webm'
        },
    ],
    controls: [
        {
            position: 'right',
            html: '跳过广告',
            click: function () {
                art.ads.end();
            },
        },
    ],
    layers: [
        {
            html: '跳过广告',
            style: {
                position: 'absolute',
                top: '20px',
                right: '20px',
            },
            click: function () {
                art.ads.end();
            },
        },
    ],
});

// 当每个视频广告播放时触发
art.on('ads:start', function(item) {
    console.info('广告开始播放: ' + item.url);
});

// 当全部视频广告播放完成
art.on('ads:end', function() {
    console.info('广告已经结束');
});

// 当前广告的下标
console.info(art.ads.index);

// 广告是否已经结束
console.info(art.ads.isEnd);

// 广告是否正在播放
console.info(art.ads.playing);

// 上一个广告的对象
console.info(art.ads.prev);

// 当前广告的对象
console.info(art.ads.current);

// 下一个广告的对象
console.info(art.ads.next);
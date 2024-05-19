var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
    fullscreen: true,
    fullscreenWeb: true,
    autoOrientation: true,
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
            speed: 5, // 弹幕持续时间，单位秒，范围在[1 ~ 10]
            opacity: 1, // 弹幕透明度，范围在[0 ~ 1]
            fontSize: 25, // 字体大小，支持数字和百分比
            color: '#FFFFFF', // 默认弹幕颜色，可以被单独弹幕项覆盖
            mode: 0, // 默认弹幕模式: 0: 滚动，1: 顶部，2: 底部
            margin: [10, '25%'], // 弹幕上下边距，支持数字和百分比
            antiOverlap: true, // 是否防重叠
            synchronousPlayback: false, // 是否同步到播放速度
            filter: (danmu) => danmu.text.length < 50, // 弹幕过滤函数，返回 true 则可以发送
            heatmap: true, // 是否开启弹幕热度图, 默认为 false

            // 自定义弹幕输入框样式
            style: {
                //
            },

            // 发送弹幕前的自定义校验，返回 true 则可以发送，支持返回 Promise，可以异步校验
            beforeEmit: (danmu) => !!danmu.text.trim(), 

            // 通过 mount 选项可以自定义输入框挂载的位置，默认挂载于播放器底部
            // mount: document.querySelector('.artplayer-danmuku'),
        }),
    ],
});

// 监听手动输入的弹幕，保存到数据库
art.on('artplayerPluginDanmuku:emit', (danmu) => {
    console.info('新增弹幕', danmu);
});

// 监听即将显示的弹幕，可以对弹幕dom进行操作
art.on('artplayerPluginDanmuku:visible', (danmu) => {
    console.info('显示弹幕', danmu);
});

// 监听加载到的弹幕数组
art.on('artplayerPluginDanmuku:loaded', (danmus) => {
    console.info('加载弹幕', danmus.length);
});

// 监听加载到弹幕的错误
art.on('artplayerPluginDanmuku:error', (error) => {
    console.info('加载错误', error);
});

// 监听弹幕配置变化
art.on('artplayerPluginDanmuku:config', (option) => {
    console.info('配置变化', option);
});

// 监听弹幕停止
art.on('artplayerPluginDanmuku:stop', () => {
    console.info('弹幕停止');
});

// 监听弹幕开始
art.on('artplayerPluginDanmuku:start', () => {
    console.info('弹幕开始');
});

// 监听弹幕隐藏
art.on('artplayerPluginDanmuku:hide', () => {
    console.info('弹幕隐藏');
});

// 监听弹幕显示
art.on('artplayerPluginDanmuku:show', () => {
    console.info('弹幕显示');
});

// 监听弹幕销毁
art.on('artplayerPluginDanmuku:destroy', () => {
    console.info('弹幕销毁');
});

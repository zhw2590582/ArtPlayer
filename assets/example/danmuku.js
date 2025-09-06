// npm i artplayer-plugin-danmuku
// import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
// 使用文档 https://artplayer.org/document/plugin/danmuku.html

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

            // 以下为非必填
            speed: 5, // 弹幕持续时间，范围在[1 ~ 10]
            margin: [10, '25%'], // 弹幕上下边距，支持像素数字和百分比
            opacity: 1, // 弹幕透明度，范围在[0 ~ 1]
            color: '#FFFFFF', // 默认弹幕颜色，可以被单独弹幕项覆盖
            mode: 0, // 默认弹幕模式: 0: 滚动，1: 顶部，2: 底部
            modes: [0, 1, 2], // 弹幕可见的模式
            fontSize: 25, // 弹幕字体大小，支持像素数字和百分比
            antiOverlap: true, // 弹幕是否防重叠
            synchronousPlayback: false, // 是否同步播放速度
            mount: undefined, // 弹幕发射器挂载点, 默认为播放器控制栏中部
            heatmap: true, // 是否开启热力图
            width: 512, // 当播放器宽度小于此值时，弹幕发射器置于播放器底部
            points: [], // 热力图数据
            filter: (danmu) => danmu.text.length <= 100, // 弹幕载入前的过滤器
            beforeVisible: () => true, // 弹幕显示前的过滤器，返回 true 则可以发送
            visible: true, // 弹幕层是否可见
            emitter: true, // 是否开启弹幕发射器
            maxLength: 200, // 弹幕输入框最大长度, 范围在[1 ~ 1000]
            lockTime: 5, // 输入框锁定时间，范围在[1 ~ 60]
            theme: 'dark', // 弹幕主题，支持 dark 和 light，只在自定义挂载时生效
            OPACITY: {}, // 不透明度配置项
            FONT_SIZE: {}, // 弹幕字号配置项
            MARGIN: {}, // 显示区域配置项
            SPEED: {}, // 弹幕速度配置项
            COLOR: [], // 颜色列表配置项

            // 手动发送弹幕前的过滤器，返回 true 则可以发送，可以做存库处理
            beforeEmit(danmu) {
               return new Promise((resolve) => {
                    console.log(danmu);
                    setTimeout(() => {
                        resolve(true);
                    }, 1000);
               });
            },
        }),
    ],
});
// npm i artplayer-plugin-danmuku-mask
// import artplayerPluginDanmukuMask from 'artplayer-plugin-danmuku-mask';

// npm i @mediapipe/selfie_segmentation
// 把 node_modules/@mediapipe/selfie_segmentation 目录复制到你的项目下

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
    fullscreen: true,
    fullscreenWeb: true,
    autoOrientation: true,
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml'
        }),
        artplayerPluginDanmukuMask({
            solutionPath: '/assets/@mediapipe/selfie_segmentation',
        }),
    ],
});
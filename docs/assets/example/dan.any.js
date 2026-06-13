// npm i artplayer-plugin-dan-any
// import artplayerPluginDanAny from 'artplayer-plugin-dan-any';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  autoSize: true,
  fullscreen: true,
  fullscreenWeb: true,
  autoOrientation: true,
  plugins: [
    artplayerPluginDanAny({
      danmuku: {
        url: '/assets/sample/danmuku.xml',
        filename: 'danmuku.xml',
      },

      // 以下为非必填
      modes: ['Normal', 'Reverse', 'Top', 'Bottom'], // 弹幕可见的模式
      speed: 5, // 弹幕持续时间，范围在[1 ~ 10]，数值越小速度越快
      margin: [10, '25%'], // 弹幕上下边距，支持像素数字和百分比
      opacity: 1, // 弹幕透明度，范围在[0 ~ 1]
      color: '#FFFFFF', // 默认弹幕颜色，可以被单独弹幕项覆盖
      fontSize: 'source', // 弹幕字体大小，支持像素数字、百分比和源文件字号
      antiOverlap: true, // 弹幕是否防重叠
      synchronousPlayback: false, // 是否同步视频播放速度
      mount: undefined, // 弹幕控制面板挂载点，默认为播放器控制栏左侧
      visible: true, // 弹幕层是否可见
      emitter: true, // 是否开启弹幕发射器
      heatmap: true, // 是否开启弹幕热力图
      points: [], // 热力图数据，time 单位为秒；留空时根据已加载弹幕自动生成
      width: 512, // 当播放器宽度小于此值时，控制面板置于播放器底部
      maxLength: 200, // 弹幕输入框最大长度，范围在[1 ~ 1000]
      filter: danmaku => danmaku.content.length <= 100, // 弹幕进入渲染队列前的过滤器
      beforeVisible: () => true, // 弹幕显示前的过滤器，支持返回 Promise<boolean>
      plugins: [], // 载入弹幕后按顺序执行的 @dan-uni/dan-any 插件列表
    }),
  ],
})

art.on('artplayerPluginDanAny:loaded', (udanmakus) => {
  console.info('弹幕加载完成', udanmakus.length)
})

art.on('artplayerPluginDanAny:error', (error) => {
  console.error('弹幕加载失败', error)
})

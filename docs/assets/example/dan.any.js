// npm i artplayer-plugin-dan-any
// import artplayerPluginDanAny from 'artplayer-plugin-dan-any';
// import { MergePluginConfigurator } from '@dan-uni/dan-any/plugins';

// 本地示例不额外加载 @dan-uni/dan-any/plugins，这里保留一个演示插件作为回退。
function DemoMergePluginConfigurator(lifetime = 10) {
  return async (chunk) => {
    const windowTime = Math.max(0, Number(lifetime) || 0) * 1000

    if (!windowTime)
      return chunk

    const danmakus = [...await chunk.$danmakus].sort((prev, next) => {
      return prev.progress - next.progress || prev.ctime.getTime() - next.ctime.getTime()
    })
    const buckets = new Map()
    const groups = []
    const getKey = (danmaku) => {
      return [danmaku.SOID, danmaku.content, danmaku.mode, danmaku.pool, danmaku.platform || ''].join('|')
    }

    danmakus.forEach((danmaku) => {
      const key = getKey(danmaku)
      const bucket = buckets.get(key) || []
      const group = bucket[bucket.length - 1]

      if (group && danmaku.progress - group.lastProgress <= windowTime) {
        group.members.push(danmaku)
        group.lastProgress = danmaku.progress
        return
      }

      const nextGroup = {
        base: danmaku,
        lastProgress: danmaku.progress,
        members: [danmaku],
      }

      bucket.push(nextGroup)
      buckets.set(key, bucket)
      groups.push(nextGroup)
    })

    const output = await chunk.$UniDB.makeChunk({ tmp: true })
    const merged = groups.map((group) => {
      if (group.members.length === 1)
        return group.base

      const senders = []
      group.members.forEach((danmaku) => {
        if (!senders.includes(danmaku.senderID))
          senders.push(danmaku.senderID)
      })

      const extra = {
        ...(group.base.extra || {}),
        danuni: {
          ...((group.base.extra && group.base.extra.danuni) || {}),
          merge: {
            duration: group.lastProgress - group.base.progress,
            count: group.members.length,
            senders,
            taolu_count: group.members.length,
            taolu_senders: senders,
          },
        },
      }
      const attr = group.base.attr.includes('Protect')
        ? [...group.base.attr]
        : [...group.base.attr, 'Protect']
      const next = {
        ...group.base,
        attr,
        extra,
        senderID: 'merge[bot]@dan-any',
      }

      next.DMID = output.$UniDB.DMIDGenerator(next)

      return next
    })

    await output.upsertDanmakus(merged, false)

    return output
  }
}

const mergePlugin = typeof globalThis.MergePluginConfigurator === 'function'
  ? globalThis.MergePluginConfigurator(10)
  : DemoMergePluginConfigurator(10)

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
      typeOptions: {
        color: true, // 是否显示彩色弹幕（false 时统一使用默认颜色）
        count: true, // 是否显示计数弹幕
      }, // 类型过滤选项
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
      emitDefaults: {
        SOID: 'demo-video@artplayer',
        senderID: 'demo-user@artplayer',
        platform: 'artplayer',
        pool: 'Def',
        attr: [],
        weight: 0,
        extra: null,
        fontsize: 25,
        color: 0xFFFFFF,
        mode: 'Normal',
      }, // 发射器发送时补齐完整 UDanmaku 的默认字段
      emitterFontSizes: [
        { size: 18, text: '较小' },
        { size: 25, text: '标准' },
        { size: 36, text: '较大' },
      ], // 发射器字号列表
      emitterColors: [
        0xFFFFFF,
        0xFE0302,
        0xFF7204,
        0xFFAA02,
        0xFFD302,
        0xFFFF00,
        0xA0EE00,
        0x00CD00,
        0x019899,
        0x4266BE,
        0x89D5FF,
        0xCC0273,
        0x222222,
      ], // 发射器颜色列表
      emitterModes: [
        { type: 'Normal', text: '滚动' },
        { type: 'Top', text: '顶部' },
        { type: 'Bottom', text: '底部' },
      ], // 发射器位置列表
      heatmap: true, // 是否开启弹幕热力图
      points: [], // 热力图数据，time 单位为秒；留空时根据已加载弹幕自动生成
      width: 512, // 当播放器宽度小于此值时，控制面板置于播放器底部
      maxLength: 200, // 弹幕输入框最大长度，范围在[1 ~ 1000]
      lockTime: 5, // 发送成功后的锁定时间，范围在[1 ~ 60]
      filter: danmaku => danmaku.content.length <= 100, // 弹幕进入渲染队列前的过滤器
      beforeEmit: danmaku => danmaku.content.trim().length > 0, // 弹幕发送前的过滤器，支持返回 Promise<boolean>
      emit: async (danmaku) => {
        // const response = await fetch('/api/danmaku', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(danmaku),
        // })
        // return response.ok
        return true
      }, // 弹幕发送处理器，返回 false 时不会进入本地渲染队列
      beforeVisible: () => true, // 弹幕显示前的过滤器，支持返回 Promise<boolean>
      plugins: [
        mergePlugin,
      ], // 载入弹幕后按顺序执行的 @dan-uni/dan-any 插件列表
    }),
  ],
})

art.on('artplayerPluginDanAny:loaded', (udanmakus) => {
  console.info('弹幕加载完成', udanmakus.length)
})

art.on('artplayerPluginDanAny:emit', (danmaku) => {
  console.info('弹幕发送完成', danmaku)
})

art.on('artplayerPluginDanAny:error', (error) => {
  console.error('弹幕处理失败', error)
})

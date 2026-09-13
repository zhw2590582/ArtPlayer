import Danmuku from './danmuku'
import heatmap from './heatmap'
import Setting from './setting'

export default function artplayerPluginDanmuku(option) {
  return (art) => {
    const danmuku = new Danmuku(art, option)
    let setting
    try {
      setting = art.isDestroy ? undefined : new Setting(art, danmuku)
      if (!art.isDestroy && danmuku.option.heatmap) {
        heatmap(art, danmuku, danmuku.option.heatmap)
      }
    }
    catch (error) {
      try {
        setting?.destroy()
      }
      catch {}
      try {
        danmuku.destroy()
      }
      catch {}
      throw error
    }

    return {
      name: 'artplayerPluginDanmuku',
      emit: danmuku.emit.bind(danmuku),
      load: danmuku.load.bind(danmuku),
      config: danmuku.config.bind(danmuku),
      hide: danmuku.hide.bind(danmuku),
      show: danmuku.show.bind(danmuku),
      reset: danmuku.reset.bind(danmuku),
      mount: setting ? setting.mount.bind(setting) : () => {},
      get option() {
        return danmuku.option
      },
      get isHide() {
        return danmuku.isHide
      },
      get isStop() {
        return danmuku.isStop
      },
    }
  }
}

artplayerPluginDanmuku.icons = Setting.icons

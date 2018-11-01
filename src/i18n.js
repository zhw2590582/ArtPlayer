let i18nMap = {
  'zh-cn': {
    'About author': '关于作者',
    'Video info': '视频统计信息',
    'Close': '关闭',
    'Video load failed': '视频加载失败',
    'Volume': '音量',
    'Play': '播放',
    'Pause': '暂停',
    'Rate': '速度',
    'Mute': '静音',
    'Reconnect': '重新连接',
    'Hide subtitle': '隐藏字幕',
    'Show subtitle': '显示字幕',
    'Screenshot': '截图',
    'Play speed': '播放速度',
    'Aspect ratio': '画面比例',
    'Default': '默认',
    'Normal': '正常',
    'Switch': '切换'
  },
  'zh-tw': {
    'About author': '關於作者',
    'Video info': '影片統計訊息',
    'Close': '關閉',
    'Video load failed': '影片載入失敗',
    'Volume': '音量',
    'Play': '播放',
    'Pause': '暫停',
    'Rate': '速度',
    'Mute': '靜音',
    'Reconnect': '重新連接',
    'Hide subtitle': '隱藏字幕',
    'Show subtitle': '顯示字幕',
    'Screenshot': '截圖',
    'Play speed': '播放速度',
    'Aspect ratio': '畫面比例',
    'Default': '默認',
    'Normal': '正常',
    'Switch': '切換'
  }
};

export default class I18n {
  constructor({ option }) {
    this.option = option;
    this.init();
  }

  init() {
    this.language = i18nMap[this.option.lang.toLowerCase()] || {};
  }

  get(key) {
    return this.language[key] || key;
  }

  update(callback) {
    i18nMap = callback(i18nMap);
    this.init();
  }
}

const i18nMap = {
  'zh-cn': {
    'About author': '关于作者',
    'Video info': '视频统计信息',
    'Close': '关闭',
    'Video load failed': '视频加载失败',
    'Fast forward 10 seconds': '快进10秒',
    'Rewind 10 seconds': '快退10秒',
    '10% increase in volume': '音量增加10%',
    '10% reduction in volume': '音量减少10%'
  },
  'zh-tw': {
    'About author': '關於作者',
    'Video info': '影片統計訊息',
    'Close': '關閉',
    'Video load failed': '影片載入失敗',
    'Fast forward 10 seconds': '快進10秒',
    'Rewind 10 seconds': '快退10秒',
    '10% increase in volume': '音量增加10%',
    '10% reduction in volume': '音量減少10%'
  }
};

export default class I18n {
  constructor({ option }) {
    this.language = i18nMap[option.lang.toLowerCase()] || {};
  }

  get(key) {
    return this.language[key] || key;
  }
}

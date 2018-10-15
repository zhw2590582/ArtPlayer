const i18nMap = {
  'zh-cn': {
    'About author': '关于作者',
    'Video info': '视频统计信息'
  },
  'zh-tw': {
    'About author': '關於作者',
    'Video info': '影片統計訊息'
  }
};

export default class I18n {
  constructor({ option }) {
    this.language = i18nMap[option.lang.toLowerCase()] || i18nMap.en;
  }

  get(key) {
    return this.language[key] || key;
  }
}

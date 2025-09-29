import style from 'bundle-text:./style/index.less'
import validator from 'option-validator'
import { version } from '../package.json'
import config from './config'
import Contextmenu from './contextmenu'
import Control from './control'
import Events from './events'
import Hotkey from './hotkey'
import I18n from './i18n'
import Icons from './icons'
import Info from './info'
import Layer from './layer'
import Loading from './loading'
import Mask from './mask'
import Notice from './notice'
import Player from './player'
import Plugins from './plugins'
import scheme from './scheme'
import Setting from './setting'
import Storage from './storage'
import Subtitle from './subtitle'
import Template from './template'
import * as utils from './utils'
import Emitter from './utils/emitter'

let id = 0
const instances = []
export default class Artplayer extends Emitter {
  constructor(option, readyCallback) {
    super()

    if (!utils.isBrowser) {
      throw new Error('Artplayer can only be used in the browser environment')
    }

    this.id = ++id

    const mergeOption = utils.mergeDeep(Artplayer.option, option)
    mergeOption.container = option.container

    this.option = validator(mergeOption, scheme)

    this.isLock = false
    this.isReady = false
    this.isFocus = false
    this.isInput = false
    this.isRotate = false
    this.isDestroy = false

    this.template = new Template(this)
    this.events = new Events(this)
    this.storage = new Storage(this)
    this.icons = new Icons(this)
    this.i18n = new I18n(this)
    this.notice = new Notice(this)
    this.player = new Player(this)
    this.layers = new Layer(this)
    this.controls = new Control(this)
    this.contextmenu = new Contextmenu(this)
    this.subtitle = new Subtitle(this)
    this.info = new Info(this)
    this.loading = new Loading(this)
    this.hotkey = new Hotkey(this)
    this.mask = new Mask(this)
    this.setting = new Setting(this)
    this.plugins = new Plugins(this)

    if (typeof readyCallback === 'function') {
      this.on('ready', () => readyCallback.call(this, this))
    }

    if (Artplayer.DEBUG) {
      // eslint-disable-next-line no-console
      const log = msg => console.log(`[ART.${this.id}] -> ${msg}`)
      log(`Version@${Artplayer.version}`)
      for (let index = 0; index < config.events.length; index++) {
        this.on(`video:${config.events[index]}`, event => log(`Event@${event.type}`))
      }
    }

    instances.push(this)
  }

  static get instances() {
    return instances
  }

  static get version() {
    return version
  }

  static get config() {
    return config
  }

  static get utils() {
    return utils
  }

  static get scheme() {
    return scheme
  }

  static get Emitter() {
    return Emitter
  }

  static get validator() {
    return validator
  }

  static get kindOf() {
    return validator.kindOf
  }

  static get html() {
    return Template.html
  }

  static get option() {
    return {
      id: '',
      container: '#artplayer',
      url: '',
      poster: '',
      type: '',
      theme: '#f00',
      volume: 0.7,
      isLive: false,
      muted: false,
      autoplay: false,
      autoSize: false,
      autoMini: false,
      loop: false,
      flip: false,
      playbackRate: false,
      aspectRatio: false,
      screenshot: false,
      setting: false,
      hotkey: true,
      pip: false,
      mutex: true,
      backdrop: true,
      fullscreen: false,
      fullscreenWeb: false,
      subtitleOffset: false,
      miniProgressBar: false,
      useSSR: false,
      playsInline: true,
      lock: false,
      gesture: true,
      fastForward: false,
      autoPlayback: false,
      autoOrientation: false,
      airplay: false,
      proxy: undefined,
      layers: [],
      contextmenu: [],
      controls: [],
      settings: [],
      quality: [],
      highlight: [],
      plugins: [],
      thumbnails: {
        url: '',
        number: 60,
        column: 10,
        width: 0,
        height: 0,
        scale: 1,
      },
      subtitle: {
        url: '',
        type: '',
        style: {},
        name: '',
        escape: true,
        encoding: 'utf-8',
        onVttLoad: vtt => vtt,
      },
      moreVideoAttr: {
        controls: false,
        preload: utils.isSafari ? 'auto' : 'metadata',
      },
      i18n: {},
      icons: {},
      cssVar: {},
      customType: {},
      lang: navigator?.language.toLowerCase(),
    }
  }

  get proxy() {
    return this.events.proxy
  }

  get query() {
    return this.template.query
  }

  get video() {
    return this.template.$video
  }

  destroy(removeHtml = true) {
    if (Artplayer.REMOVE_SRC_WHEN_DESTROY) {
      this.video.removeAttribute('src')
      this.video.load()
    }
    this.events.destroy()
    this.template.destroy(removeHtml)
    instances.splice(instances.indexOf(this), 1)
    this.isDestroy = true
    this.emit('destroy')
  }
}

Artplayer.STYLE = style
Artplayer.DEBUG = false
Artplayer.CONTEXTMENU = true
Artplayer.NOTICE_TIME = 2000
Artplayer.SETTING_WIDTH = 250
Artplayer.SETTING_ITEM_WIDTH = 200
Artplayer.SETTING_ITEM_HEIGHT = 35
Artplayer.RESIZE_TIME = 200
Artplayer.SCROLL_TIME = 200
Artplayer.SCROLL_GAP = 50
Artplayer.AUTO_PLAYBACK_MAX = 10
Artplayer.AUTO_PLAYBACK_MIN = 5
Artplayer.AUTO_PLAYBACK_TIMEOUT = 3000
Artplayer.RECONNECT_TIME_MAX = 5
Artplayer.RECONNECT_SLEEP_TIME = 1000
Artplayer.CONTROL_HIDE_TIME = 3000
Artplayer.DBCLICK_TIME = 300
Artplayer.DBCLICK_FULLSCREEN = true
Artplayer.MOBILE_DBCLICK_PLAY = true
Artplayer.MOBILE_CLICK_PLAY = false
Artplayer.AUTO_ORIENTATION_TIME = 200
Artplayer.INFO_LOOP_TIME = 1000
Artplayer.FAST_FORWARD_VALUE = 3
Artplayer.FAST_FORWARD_TIME = 1000
Artplayer.TOUCH_MOVE_RATIO = 0.5
Artplayer.VOLUME_STEP = 0.1
Artplayer.SEEK_STEP = 5
Artplayer.PLAYBACK_RATE = [0.5, 0.75, 1, 1.25, 1.5, 2]
Artplayer.ASPECT_RATIO = ['default', '4:3', '16:9']
Artplayer.FLIP = ['normal', 'horizontal', 'vertical']
Artplayer.FULLSCREEN_WEB_IN_BODY = true
Artplayer.LOG_VERSION = true
Artplayer.USE_RAF = false
Artplayer.REMOVE_SRC_WHEN_DESTROY = true

if (utils.isBrowser) {
  window.Artplayer = Artplayer

  utils.setStyleText('artplayer-style', style)

  setTimeout(() => {
    if (Artplayer.LOG_VERSION) {
      // eslint-disable-next-line no-console
      console.log(
        `%c ArtPlayer %c ${Artplayer.version} %c https://artplayer.org`,
        'color: #fff; background: #5f5f5f',
        'color: #fff; background: #4bc729',
        '',
      )
    }
  }, 100)
}

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"jHWOm":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexLess = require("bundle-text:./style/index.less");
var _indexLessDefault = parcelHelpers.interopDefault(_indexLess);
var _optionValidator = require("option-validator");
var _optionValidatorDefault = parcelHelpers.interopDefault(_optionValidator);
var _packageJson = require("../package.json");
var _config = require("./config");
var _configDefault = parcelHelpers.interopDefault(_config);
var _contextmenu = require("./contextmenu");
var _contextmenuDefault = parcelHelpers.interopDefault(_contextmenu);
var _control = require("./control");
var _controlDefault = parcelHelpers.interopDefault(_control);
var _events = require("./events");
var _eventsDefault = parcelHelpers.interopDefault(_events);
var _hotkey = require("./hotkey");
var _hotkeyDefault = parcelHelpers.interopDefault(_hotkey);
var _i18N = require("./i18n");
var _i18NDefault = parcelHelpers.interopDefault(_i18N);
var _icons = require("./icons");
var _iconsDefault = parcelHelpers.interopDefault(_icons);
var _info = require("./info");
var _infoDefault = parcelHelpers.interopDefault(_info);
var _layer = require("./layer");
var _layerDefault = parcelHelpers.interopDefault(_layer);
var _loading = require("./loading");
var _loadingDefault = parcelHelpers.interopDefault(_loading);
var _mask = require("./mask");
var _maskDefault = parcelHelpers.interopDefault(_mask);
var _notice = require("./notice");
var _noticeDefault = parcelHelpers.interopDefault(_notice);
var _player = require("./player");
var _playerDefault = parcelHelpers.interopDefault(_player);
var _plugins = require("./plugins");
var _pluginsDefault = parcelHelpers.interopDefault(_plugins);
var _scheme = require("./scheme");
var _schemeDefault = parcelHelpers.interopDefault(_scheme);
var _setting = require("./setting");
var _settingDefault = parcelHelpers.interopDefault(_setting);
var _storage = require("./storage");
var _storageDefault = parcelHelpers.interopDefault(_storage);
var _subtitle = require("./subtitle");
var _subtitleDefault = parcelHelpers.interopDefault(_subtitle);
var _template = require("./template");
var _templateDefault = parcelHelpers.interopDefault(_template);
var _utils = require("./utils");
var _emitter = require("./utils/emitter");
var _emitterDefault = parcelHelpers.interopDefault(_emitter);
let id = 0;
const instances = [];
class Artplayer extends (0, _emitterDefault.default) {
    constructor(option, readyCallback){
        super();
        if (!_utils.isBrowser) throw new Error('Artplayer can only be used in the browser environment');
        this.id = ++id;
        const mergeOption = _utils.mergeDeep(Artplayer.option, option);
        mergeOption.container = option.container;
        this.option = (0, _optionValidatorDefault.default)(mergeOption, (0, _schemeDefault.default));
        this.isLock = false;
        this.isReady = false;
        this.isFocus = false;
        this.isInput = false;
        this.isRotate = false;
        this.isDestroy = false;
        this.template = new (0, _templateDefault.default)(this);
        this.events = new (0, _eventsDefault.default)(this);
        this.storage = new (0, _storageDefault.default)(this);
        this.icons = new (0, _iconsDefault.default)(this);
        this.i18n = new (0, _i18NDefault.default)(this);
        this.notice = new (0, _noticeDefault.default)(this);
        this.player = new (0, _playerDefault.default)(this);
        this.layers = new (0, _layerDefault.default)(this);
        this.controls = new (0, _controlDefault.default)(this);
        this.contextmenu = new (0, _contextmenuDefault.default)(this);
        this.subtitle = new (0, _subtitleDefault.default)(this);
        this.info = new (0, _infoDefault.default)(this);
        this.loading = new (0, _loadingDefault.default)(this);
        this.hotkey = new (0, _hotkeyDefault.default)(this);
        this.mask = new (0, _maskDefault.default)(this);
        this.setting = new (0, _settingDefault.default)(this);
        this.plugins = new (0, _pluginsDefault.default)(this);
        if (typeof readyCallback === 'function') this.on('ready', ()=>readyCallback.call(this, this));
        if (Artplayer.DEBUG) {
            // eslint-disable-next-line no-console
            const log = (msg)=>console.log(`[ART.${this.id}] -> ${msg}`);
            log(`Version@${Artplayer.version}`);
            for(let index = 0; index < (0, _configDefault.default).events.length; index++)this.on(`video:${(0, _configDefault.default).events[index]}`, (event)=>log(`Event@${event.type}`));
        }
        instances.push(this);
    }
    static get instances() {
        return instances;
    }
    static get version() {
        return 0, _packageJson.version;
    }
    static get config() {
        return 0, _configDefault.default;
    }
    static get utils() {
        return _utils;
    }
    static get scheme() {
        return 0, _schemeDefault.default;
    }
    static get Emitter() {
        return 0, _emitterDefault.default;
    }
    static get validator() {
        return 0, _optionValidatorDefault.default;
    }
    static get kindOf() {
        return (0, _optionValidatorDefault.default).kindOf;
    }
    static get html() {
        return (0, _templateDefault.default).html;
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
                scale: 1
            },
            subtitle: {
                url: '',
                type: '',
                style: {},
                name: '',
                escape: true,
                encoding: 'utf-8',
                onVttLoad: (vtt)=>vtt
            },
            moreVideoAttr: {
                controls: false,
                preload: _utils.isSafari ? 'auto' : 'metadata'
            },
            i18n: {},
            icons: {},
            cssVar: {},
            customType: {},
            lang: navigator?.language.toLowerCase()
        };
    }
    get proxy() {
        return this.events.proxy;
    }
    get query() {
        return this.template.query;
    }
    get video() {
        return this.template.$video;
    }
    reset() {
        this.video.removeAttribute('src');
        this.video.load();
    }
    destroy(removeHtml = true) {
        if (Artplayer.REMOVE_SRC_WHEN_DESTROY) this.reset();
        this.events.destroy();
        this.template.destroy(removeHtml);
        instances.splice(instances.indexOf(this), 1);
        this.isDestroy = true;
        this.emit('destroy');
    }
}
exports.default = Artplayer;
Artplayer.STYLE = (0, _indexLessDefault.default);
Artplayer.DEBUG = false;
Artplayer.CONTEXTMENU = true;
Artplayer.NOTICE_TIME = 2000;
Artplayer.SETTING_WIDTH = 250;
Artplayer.SETTING_ITEM_WIDTH = 200;
Artplayer.SETTING_ITEM_HEIGHT = 35;
Artplayer.RESIZE_TIME = 200;
Artplayer.SCROLL_TIME = 200;
Artplayer.SCROLL_GAP = 50;
Artplayer.AUTO_PLAYBACK_MAX = 10;
Artplayer.AUTO_PLAYBACK_MIN = 5;
Artplayer.AUTO_PLAYBACK_TIMEOUT = 3000;
Artplayer.RECONNECT_TIME_MAX = 5;
Artplayer.RECONNECT_SLEEP_TIME = 1000;
Artplayer.CONTROL_HIDE_TIME = 3000;
Artplayer.DBCLICK_TIME = 300;
Artplayer.DBCLICK_FULLSCREEN = true;
Artplayer.MOBILE_DBCLICK_PLAY = true;
Artplayer.MOBILE_CLICK_PLAY = false;
Artplayer.AUTO_ORIENTATION_TIME = 200;
Artplayer.INFO_LOOP_TIME = 1000;
Artplayer.FAST_FORWARD_VALUE = 3;
Artplayer.FAST_FORWARD_TIME = 1000;
Artplayer.TOUCH_MOVE_RATIO = 0.5;
Artplayer.VOLUME_STEP = 0.1;
Artplayer.SEEK_STEP = 5;
Artplayer.PLAYBACK_RATE = [
    0.5,
    0.75,
    1,
    1.25,
    1.5,
    2
];
Artplayer.ASPECT_RATIO = [
    'default',
    '4:3',
    '16:9'
];
Artplayer.FLIP = [
    'normal',
    'horizontal',
    'vertical'
];
Artplayer.FULLSCREEN_WEB_IN_BODY = true;
Artplayer.LOG_VERSION = true;
Artplayer.USE_RAF = false;
Artplayer.REMOVE_SRC_WHEN_DESTROY = true;
if (_utils.isBrowser) {
    window.Artplayer = Artplayer;
    _utils.setStyleText('artplayer-style', (0, _indexLessDefault.default));
    setTimeout(()=>{
        if (Artplayer.LOG_VERSION) // eslint-disable-next-line no-console
        console.log(`%c ArtPlayer %c ${Artplayer.version} %c https://artplayer.org`, 'color: #fff; background: #5f5f5f', 'color: #fff; background: #4bc729', '');
    }, 100);
}

},{"bundle-text:./style/index.less":"bFGMG","option-validator":"9hUEm","../package.json":"3r4tp","./config":"1dlGA","./contextmenu":"dx7Zz","./control":"cNVpy","./events":"dQzlM","./hotkey":"drylQ","./i18n":"3Jf1s","./icons":"avFu3","./info":"gvEup","./layer":"7Oas9","./loading":"glZdQ","./mask":"iGxU6","./notice":"jZEIz","./player":"iA4EC","./plugins":"6P64r","./scheme":"8YPbR","./setting":"7ATN8","./storage":"grHII","./subtitle":"hxr0l","./template":"5JwMQ","./utils":"gGxPm","./utils/emitter":"2qvfs","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"bFGMG":[function(require,module,exports,__globalThis) {
module.exports = ".art-video-player {\n  --art-theme: red;\n  --art-font-color: #fff;\n  --art-background-color: #000;\n  --art-text-shadow-color: #00000080;\n  --art-transition-duration: .2s;\n  --art-padding: 10px;\n  --art-border-radius: 3px;\n  --art-progress-height: 6px;\n  --art-progress-color: #ffffff40;\n  --art-progress-top-gap: 8px;\n  --art-hover-color: #ffffff40;\n  --art-loaded-color: #ffffff40;\n  --art-state-size: 80px;\n  --art-state-opacity: .8;\n  --art-bottom-height: 100px;\n  --art-bottom-offset: 20px;\n  --art-bottom-gap: 5px;\n  --art-highlight-width: 8px;\n  --art-highlight-color: #ffffff80;\n  --art-control-height: 46px;\n  --art-control-opacity: .75;\n  --art-control-icon-size: 36px;\n  --art-control-icon-scale: 1.1;\n  --art-volume-height: 120px;\n  --art-volume-handle-size: 14px;\n  --art-lock-size: 36px;\n  --art-indicator-scale: 0;\n  --art-indicator-size: 16px;\n  --art-fullscreen-web-index: 9999;\n  --art-settings-icon-size: 24px;\n  --art-settings-max-height: 300px;\n  --art-selector-max-height: 300px;\n  --art-contextmenus-min-width: 250px;\n  --art-subtitle-font-size: 20px;\n  --art-subtitle-gap: 5px;\n  --art-subtitle-bottom: 15px;\n  --art-subtitle-border: #000;\n  --art-widget-background: #000000d9;\n  --art-tip-background: #000000b3;\n  --art-scrollbar-size: 4px;\n  --art-scrollbar-background: #ffffff40;\n  --art-scrollbar-background-hover: #ffffff80;\n  --art-mini-progress-height: 2px;\n}\n\n.art-bg-cover {\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n\n.art-bottom-gradient {\n  background-image: linear-gradient(to top, #000, #0006, #0000);\n  background-position: bottom;\n  background-repeat: repeat-x;\n}\n\n.art-backdrop-filter {\n  backdrop-filter: saturate(180%) blur(20px);\n  background-color: #000000bf !important;\n}\n\n.art-truncate {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n.art-video-player {\n  zoom: 1;\n  text-align: left;\n  user-select: none;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  color: var(--art-font-color);\n  background-color: var(--art-background-color);\n  text-shadow: 0 0 2px var(--art-text-shadow-color);\n  -webkit-tap-highlight-color: #0000;\n  -ms-touch-action: manipulation;\n  touch-action: manipulation;\n  -ms-high-contrast-adjust: none;\n  direction: ltr;\n  outline: 0;\n  margin: 0 auto;\n  padding: 0;\n  font-family: PingFang SC, Helvetica Neue, Microsoft YaHei, Roboto, Arial, sans-serif;\n  font-size: 14px;\n  line-height: 1.3;\n  position: relative;\n}\n\n.art-video-player *, .art-video-player :before, .art-video-player :after {\n  box-sizing: border-box;\n}\n\n.art-video-player ::-webkit-scrollbar {\n  width: var(--art-scrollbar-size);\n  height: var(--art-scrollbar-size);\n}\n\n.art-video-player ::-webkit-scrollbar-thumb {\n  background-color: var(--art-scrollbar-background);\n}\n\n.art-video-player ::-webkit-scrollbar-thumb:hover {\n  background-color: var(--art-scrollbar-background-hover);\n}\n\n.art-video-player img {\n  vertical-align: top;\n  max-width: 100%;\n}\n\n.art-video-player svg {\n  fill: var(--art-font-color);\n}\n\n.art-video-player a {\n  color: var(--art-font-color);\n  text-decoration: none;\n}\n\n.art-icon {\n  justify-content: center;\n  align-items: center;\n  line-height: 1;\n  display: flex;\n}\n\n.art-video-player.art-backdrop .art-contextmenus, .art-video-player.art-backdrop .art-info, .art-video-player.art-backdrop .art-settings, .art-video-player.art-backdrop .art-layer-auto-playback, .art-video-player.art-backdrop .art-selector-list, .art-video-player.art-backdrop .art-volume-inner {\n  backdrop-filter: saturate(180%) blur(20px);\n  background-color: #000000bf !important;\n}\n\n.art-video {\n  z-index: 10;\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  inset: 0;\n}\n\n.art-poster {\n  z-index: 11;\n  pointer-events: none;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-subtitle {\n  z-index: 20;\n  text-align: center;\n  pointer-events: none;\n  justify-content: center;\n  align-items: center;\n  gap: var(--art-subtitle-gap);\n  width: 100%;\n  bottom: var(--art-subtitle-bottom);\n  font-size: var(--art-subtitle-font-size);\n  transition: bottom var(--art-transition-duration) ease;\n  text-shadow: var(--art-subtitle-border) 1px 0 1px, var(--art-subtitle-border) 0 1px 1px, var(--art-subtitle-border) -1px 0 1px, var(--art-subtitle-border) 0 -1px 1px, var(--art-subtitle-border) 1px 1px 1px, var(--art-subtitle-border) -1px -1px 1px, var(--art-subtitle-border) 1px -1px 1px, var(--art-subtitle-border) -1px 1px 1px;\n  flex-direction: column;\n  padding: 0 5%;\n  display: none;\n  position: absolute;\n}\n\n.art-video-player.art-subtitle-show .art-subtitle {\n  display: flex;\n}\n\n.art-video-player.art-control-show .art-subtitle {\n  bottom: calc(var(--art-control-height)  + var(--art-subtitle-bottom));\n}\n\n.art-danmuku {\n  z-index: 30;\n  pointer-events: none;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n}\n\n.art-video-player .art-layers {\n  z-index: 40;\n  pointer-events: none;\n  width: 100%;\n  height: 100%;\n  display: none;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-layers .art-layer {\n  pointer-events: auto;\n}\n\n.art-video-player.art-layer-show .art-layers {\n  display: flex;\n}\n\n.art-video-player .art-mask {\n  z-index: 50;\n  pointer-events: none;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-mask .art-state {\n  opacity: 0;\n  width: var(--art-state-size);\n  height: var(--art-state-size);\n  transition: all var(--art-transition-duration) ease;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n  transform: scale(2);\n}\n\n.art-video-player.art-mask-show .art-state {\n  cursor: pointer;\n  pointer-events: auto;\n  opacity: var(--art-state-opacity);\n  transform: scale(1);\n}\n\n.art-video-player.art-loading-show .art-state {\n  display: none;\n}\n\n.art-video-player .art-loading {\n  z-index: 70;\n  pointer-events: none;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  display: none;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player.art-loading-show .art-loading {\n  display: flex;\n}\n\n.art-video-player.art-loading-show .art-mask {\n  display: none;\n}\n\n.art-video-player .art-bottom {\n  z-index: 60;\n  opacity: 0;\n  pointer-events: none;\n  width: 100%;\n  height: 100%;\n  padding: 0 var(--art-padding);\n  transition: all var(--art-transition-duration) ease;\n  background-size: 100% var(--art-bottom-height);\n  background-image: linear-gradient(to top, #000, #0006, #0000);\n  background-position: bottom;\n  background-repeat: repeat-x;\n  flex-direction: column;\n  justify-content: flex-end;\n  display: flex;\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n}\n\n.art-video-player .art-bottom .art-controls, .art-video-player .art-bottom .art-progress {\n  transform: translateY(var(--art-bottom-offset));\n  transition: transform var(--art-transition-duration) ease;\n}\n\n.art-video-player.art-control-show .art-bottom, .art-video-player.art-hover .art-bottom {\n  opacity: 1;\n}\n\n.art-video-player.art-control-show .art-bottom .art-controls, .art-video-player.art-hover .art-bottom .art-controls, .art-video-player.art-control-show .art-bottom .art-progress, .art-video-player.art-hover .art-bottom .art-progress {\n  transform: translateY(0);\n}\n\n.art-bottom .art-progress {\n  z-index: 0;\n  pointer-events: auto;\n  padding-top: var(--art-progress-top-gap);\n  padding-bottom: var(--art-bottom-gap);\n  position: relative;\n}\n\n.art-bottom .art-progress .art-control-progress {\n  cursor: pointer;\n  height: var(--art-progress-height);\n  justify-content: center;\n  align-items: center;\n  display: flex;\n  position: relative;\n}\n\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner {\n  width: 100%;\n  height: 50%;\n  transition: height var(--art-transition-duration) ease;\n  background-color: var(--art-progress-color);\n  align-items: center;\n  display: flex;\n  position: relative;\n}\n\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-hover {\n  z-index: 0;\n  background-color: var(--art-hover-color);\n  width: 0%;\n  height: 100%;\n  position: absolute;\n  inset: 0;\n}\n\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-loaded {\n  z-index: 10;\n  background-color: var(--art-loaded-color);\n  width: 0%;\n  height: 100%;\n  position: absolute;\n  inset: 0;\n}\n\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-played {\n  z-index: 20;\n  background-color: var(--art-theme);\n  width: 0%;\n  height: 100%;\n  position: absolute;\n  inset: 0;\n}\n\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight {\n  z-index: 30;\n  pointer-events: none;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  inset: 0;\n}\n\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight span {\n  z-index: 0;\n  pointer-events: auto;\n  width: 100%;\n  height: 100%;\n  transform: translateX(calc(var(--art-highlight-width) / -2));\n  background-color: var(--art-highlight-color);\n  position: absolute;\n  inset: 0 auto 0 0;\n  width: var(--art-highlight-width) !important;\n}\n\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator {\n  z-index: 40;\n  width: var(--art-indicator-size);\n  height: var(--art-indicator-size);\n  transform: scale(var(--art-indicator-scale));\n  margin-left: calc(var(--art-indicator-size) / -2);\n  transition: transform var(--art-transition-duration) ease;\n  border-radius: 50%;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n  position: absolute;\n  left: 0;\n}\n\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator .art-icon {\n  pointer-events: none;\n  width: 100%;\n  height: 100%;\n}\n\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator:hover {\n  transform: scale(1.2) !important;\n}\n\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator:active {\n  transform: scale(1) !important;\n}\n\n.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-tip {\n  transform-origin: bottom;\n  opacity: 0;\n  z-index: 50;\n  border-radius: var(--art-border-radius);\n  white-space: nowrap;\n  background-color: var(--art-tip-background);\n  transition: transform var(--art-transition-duration) ease, opacity var(--art-transition-duration) ease;\n  padding: 3px 5px;\n  font-size: 12px;\n  line-height: 1;\n  position: absolute;\n  top: -25px;\n  left: 0;\n  transform: scale(.5);\n}\n\n.art-bottom .art-progress .art-control-progress:hover .art-control-progress-inner {\n  height: 100%;\n}\n\n.art-bottom .art-progress .art-control-thumbnails {\n  transform-origin: bottom;\n  opacity: 0;\n  bottom: calc(var(--art-bottom-gap)  + 10px);\n  border-radius: var(--art-border-radius);\n  pointer-events: none;\n  background-color: var(--art-widget-background);\n  transition: transform var(--art-transition-duration) ease, opacity var(--art-transition-duration) ease;\n  position: absolute;\n  left: 0;\n  transform: scale(.5);\n  box-shadow: 0 1px 3px #0003, 0 1px 2px -1px #0003;\n}\n\n.art-bottom:hover .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator {\n  transform: scale(1);\n}\n\n.art-progress-hover .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-tip, .art-progress-hover .art-bottom .art-progress .art-control-thumbnails {\n  opacity: 1;\n  transform: scale(1);\n}\n\n.art-video-player .art-controls {\n  z-index: 10;\n  pointer-events: auto;\n  height: var(--art-control-height);\n  justify-content: space-between;\n  align-items: center;\n  display: flex;\n  position: relative;\n}\n\n.art-video-player .art-controls .art-controls-left, .art-video-player .art-controls .art-controls-right {\n  height: 100%;\n  display: flex;\n}\n\n.art-video-player .art-controls .art-controls-center {\n  flex: 1;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n  padding: 0 10px;\n  display: none;\n}\n\n.art-video-player .art-controls .art-controls-right {\n  justify-content: flex-end;\n}\n\n.art-video-player .art-controls .art-control {\n  cursor: pointer;\n  white-space: nowrap;\n  opacity: var(--art-control-opacity);\n  min-height: var(--art-control-height);\n  min-width: var(--art-control-height);\n  transition: opacity var(--art-transition-duration) ease;\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-controls .art-control .art-icon {\n  height: var(--art-control-icon-size);\n  width: var(--art-control-icon-size);\n  transform: scale(var(--art-control-icon-scale));\n  transition: transform var(--art-transition-duration) ease;\n}\n\n.art-video-player .art-controls .art-control .art-icon:active {\n  transform: scale(calc(var(--art-control-icon-scale) * .8));\n}\n\n.art-video-player .art-controls .art-control:hover {\n  opacity: 1;\n}\n\n.art-control-volume {\n  position: relative;\n}\n\n.art-control-volume .art-volume-panel {\n  text-align: center;\n  cursor: default;\n  opacity: 0;\n  pointer-events: none;\n  left: 0;\n  right: 0;\n  bottom: var(--art-control-height);\n  width: var(--art-control-height);\n  height: var(--art-volume-height);\n  transition: all var(--art-transition-duration) ease;\n  justify-content: center;\n  align-items: center;\n  padding: 0 5px;\n  font-size: 12px;\n  display: flex;\n  position: absolute;\n  transform: translateY(10px);\n}\n\n.art-control-volume .art-volume-panel .art-volume-inner {\n  border-radius: var(--art-border-radius);\n  background-color: var(--art-widget-background);\n  flex-direction: column;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  height: 100%;\n  padding: 10px 0 12px;\n  display: flex;\n}\n\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider {\n  cursor: pointer;\n  flex: 1;\n  justify-content: center;\n  width: 100%;\n  display: flex;\n  position: relative;\n}\n\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider .art-volume-handle {\n  border-radius: var(--art-border-radius);\n  background-color: #ffffff40;\n  justify-content: center;\n  width: 2px;\n  display: flex;\n  position: relative;\n  overflow: hidden;\n}\n\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider .art-volume-handle .art-volume-loaded {\n  z-index: 0;\n  background-color: var(--art-theme);\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  inset: 0;\n}\n\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider .art-volume-indicator {\n  width: var(--art-volume-handle-size);\n  height: var(--art-volume-handle-size);\n  margin-top: calc(var(--art-volume-handle-size) / -2);\n  background-color: var(--art-theme);\n  transition: transform var(--art-transition-duration) ease;\n  border-radius: 100%;\n  flex-shrink: 0;\n  position: absolute;\n  transform: scale(1);\n}\n\n.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider:active .art-volume-indicator {\n  transform: scale(.9);\n}\n\n.art-control-volume:hover .art-volume-panel {\n  opacity: 1;\n  pointer-events: auto;\n  transform: translateY(0);\n}\n\n.art-video-player .art-notice {\n  z-index: 80;\n  width: 100%;\n  height: auto;\n  padding: var(--art-padding);\n  pointer-events: none;\n  display: none;\n  position: absolute;\n  inset: 0 0 auto;\n}\n\n.art-video-player .art-notice .art-notice-inner {\n  border-radius: var(--art-border-radius);\n  background-color: var(--art-tip-background);\n  padding: 5px;\n  line-height: 1;\n  display: inline-flex;\n}\n\n.art-video-player.art-notice-show .art-notice {\n  display: flex;\n}\n\n.art-video-player .art-contextmenus {\n  z-index: 120;\n  border-radius: var(--art-border-radius);\n  background-color: var(--art-widget-background);\n  min-width: var(--art-contextmenus-min-width);\n  flex-direction: column;\n  padding: 5px 0;\n  font-size: 12px;\n  display: none;\n  position: absolute;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu {\n  cursor: pointer;\n  border-bottom: 1px solid #ffffff1a;\n  padding: 10px 15px;\n  display: flex;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu span {\n  padding: 0 8px;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu span:hover, .art-video-player .art-contextmenus .art-contextmenu span.art-current {\n  color: var(--art-theme);\n}\n\n.art-video-player .art-contextmenus .art-contextmenu:hover {\n  background-color: #ffffff1a;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu:last-child {\n  border-bottom: none;\n}\n\n.art-video-player.art-contextmenu-show .art-contextmenus {\n  display: flex;\n}\n\n.art-video-player .art-settings {\n  z-index: 90;\n  border-radius: var(--art-border-radius);\n  max-height: var(--art-settings-max-height);\n  left: auto;\n  right: var(--art-padding);\n  bottom: var(--art-control-height);\n  transition: all var(--art-transition-duration) ease;\n  background-color: var(--art-widget-background);\n  flex-direction: column;\n  display: none;\n  position: absolute;\n  overflow: hidden auto;\n}\n\n.art-video-player .art-settings .art-setting-panel {\n  flex-direction: column;\n  display: none;\n}\n\n.art-video-player .art-settings .art-setting-panel.art-current {\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item {\n  cursor: pointer;\n  transition: background-color var(--art-transition-duration) ease;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 5px;\n  display: flex;\n  overflow: hidden;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item:hover {\n  background-color: #ffffff1a;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item.art-current {\n  color: var(--art-theme);\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-icon-check {\n  visibility: hidden;\n  height: 15px;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item.art-current .art-icon-check {\n  visibility: visible;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left {\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  gap: 5px;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left .art-setting-item-left-icon {\n  height: var(--art-settings-icon-size);\n  width: var(--art-settings-icon-size);\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right {\n  justify-content: center;\n  align-items: center;\n  gap: 5px;\n  font-size: 12px;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-tooltip {\n  white-space: nowrap;\n  color: #ffffff80;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-icon {\n  justify-content: center;\n  align-items: center;\n  min-width: 32px;\n  height: 24px;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-range {\n  appearance: none;\n  background-color: #fff3;\n  outline: none;\n  width: 80px;\n  height: 3px;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item-back {\n  border-bottom: 1px solid #ffffff1a;\n}\n\n.art-video-player.art-setting-show .art-settings {\n  display: flex;\n}\n\n.art-video-player .art-info {\n  left: var(--art-padding);\n  top: var(--art-padding);\n  z-index: 100;\n  border-radius: var(--art-border-radius);\n  background-color: var(--art-widget-background);\n  padding: 10px;\n  font-size: 12px;\n  display: none;\n  position: absolute;\n}\n\n.art-video-player .art-info .art-info-panel {\n  flex-direction: column;\n  gap: 5px;\n  display: flex;\n}\n\n.art-video-player .art-info .art-info-panel .art-info-item {\n  align-items: center;\n  gap: 5px;\n  display: flex;\n}\n\n.art-video-player .art-info .art-info-panel .art-info-item .art-info-title {\n  text-align: right;\n  width: 100px;\n}\n\n.art-video-player .art-info .art-info-panel .art-info-item .art-info-content {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  user-select: all;\n  width: 250px;\n  overflow: hidden;\n}\n\n.art-video-player .art-info .art-info-close {\n  cursor: pointer;\n  position: absolute;\n  top: 5px;\n  right: 5px;\n}\n\n.art-video-player.art-info-show .art-info {\n  display: flex;\n}\n\n.art-hide-cursor * {\n  cursor: none !important;\n}\n\n.art-video-player[data-aspect-ratio] {\n  overflow: hidden;\n}\n\n.art-video-player[data-aspect-ratio] .art-video {\n  object-fit: fill;\n  box-sizing: content-box;\n}\n\n.art-fullscreen {\n  --art-progress-height: 8px;\n  --art-indicator-size: 20px;\n  --art-control-height: 60px;\n  --art-control-icon-scale: 1.3;\n}\n\n.art-fullscreen-web {\n  --art-progress-height: 8px;\n  --art-indicator-size: 20px;\n  --art-control-height: 60px;\n  --art-control-icon-scale: 1.3;\n  z-index: var(--art-fullscreen-web-index);\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  inset: 0;\n}\n\n.art-mini-popup {\n  z-index: 9999;\n  border-radius: var(--art-border-radius);\n  cursor: move;\n  user-select: none;\n  background: #000;\n  width: 320px;\n  height: 180px;\n  transition: opacity .2s;\n  position: fixed;\n  overflow: hidden;\n  box-shadow: 0 0 5px #00000080;\n}\n\n.art-mini-popup svg {\n  fill: #fff;\n}\n\n.art-mini-popup .art-video {\n  pointer-events: none;\n}\n\n.art-mini-popup .art-mini-close {\n  z-index: 20;\n  cursor: pointer;\n  opacity: 0;\n  transition: opacity .2s;\n  position: absolute;\n  top: 10px;\n  right: 10px;\n}\n\n.art-mini-popup .art-mini-state {\n  z-index: 30;\n  pointer-events: none;\n  opacity: 0;\n  background-color: #00000040;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  transition: opacity .2s;\n  display: flex;\n  position: absolute;\n  inset: 0;\n}\n\n.art-mini-popup .art-mini-state .art-icon {\n  opacity: .75;\n  cursor: pointer;\n  pointer-events: auto;\n  transition: transform .2s;\n  transform: scale(3);\n}\n\n.art-mini-popup .art-mini-state .art-icon:active {\n  transform: scale(2.5);\n}\n\n.art-mini-popup.art-mini-dragging {\n  opacity: .9;\n}\n\n.art-mini-popup:hover .art-mini-close, .art-mini-popup:hover .art-mini-state {\n  opacity: 1;\n}\n\n.art-video-player[data-flip=\"horizontal\"] .art-video {\n  transform: scaleX(-1);\n}\n\n.art-video-player[data-flip=\"vertical\"] .art-video {\n  transform: scaleY(-1);\n}\n\n.art-video-player .art-layer-lock {\n  height: var(--art-lock-size);\n  width: var(--art-lock-size);\n  top: 50%;\n  left: var(--art-padding);\n  background-color: var(--art-tip-background);\n  border-radius: 50%;\n  justify-content: center;\n  align-items: center;\n  display: none;\n  position: absolute;\n  transform: translateY(-50%);\n}\n\n.art-video-player .art-layer-auto-playback {\n  border-radius: var(--art-border-radius);\n  left: var(--art-padding);\n  bottom: calc(var(--art-control-height)  + var(--art-bottom-gap)  + 10px);\n  background-color: var(--art-widget-background);\n  align-items: center;\n  gap: 10px;\n  padding: 10px;\n  line-height: 1;\n  display: none;\n  position: absolute;\n}\n\n.art-video-player .art-layer-auto-playback .art-auto-playback-close {\n  cursor: pointer;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-layer-auto-playback .art-auto-playback-close svg {\n  width: 15px;\n  height: 15px;\n  fill: var(--art-theme);\n}\n\n.art-video-player .art-layer-auto-playback .art-auto-playback-jump {\n  color: var(--art-theme);\n  cursor: pointer;\n}\n\n.art-video-player.art-lock .art-subtitle {\n  bottom: var(--art-subtitle-bottom) !important;\n}\n\n.art-video-player.art-mini-progress-bar .art-bottom, .art-video-player.art-lock .art-bottom {\n  opacity: 1;\n  background-image: none;\n  padding: 0;\n}\n\n.art-video-player.art-mini-progress-bar .art-bottom .art-controls, .art-video-player.art-lock .art-bottom .art-controls, .art-video-player.art-mini-progress-bar .art-bottom .art-progress, .art-video-player.art-lock .art-bottom .art-progress {\n  transform: translateY(calc(var(--art-control-height)  + var(--art-bottom-gap)  + var(--art-progress-height) / 4));\n}\n\n.art-video-player.art-mini-progress-bar .art-bottom .art-progress-indicator, .art-video-player.art-lock .art-bottom .art-progress-indicator {\n  display: none !important;\n}\n\n.art-video-player.art-control-show .art-layer-lock {\n  display: flex;\n}\n\n.art-control-selector {\n  justify-content: center;\n  display: flex;\n  position: relative;\n}\n\n.art-control-selector .art-selector-list {\n  text-align: center;\n  border-radius: var(--art-border-radius);\n  opacity: 0;\n  pointer-events: none;\n  bottom: var(--art-control-height);\n  max-height: var(--art-selector-max-height);\n  background-color: var(--art-widget-background);\n  transition: all var(--art-transition-duration) ease;\n  flex-direction: column;\n  align-items: center;\n  display: flex;\n  position: absolute;\n  overflow: hidden auto;\n  transform: translateY(10px);\n}\n\n.art-control-selector .art-selector-list .art-selector-item {\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  padding: 10px 15px;\n  line-height: 1;\n  display: flex;\n}\n\n.art-control-selector .art-selector-list .art-selector-item:hover {\n  background-color: #ffffff1a;\n}\n\n.art-control-selector .art-selector-list .art-selector-item:hover, .art-control-selector .art-selector-list .art-selector-item.art-current {\n  color: var(--art-theme);\n}\n\n.art-control-selector:hover .art-selector-list {\n  opacity: 1;\n  pointer-events: auto;\n  transform: translateY(0);\n}\n\n.art-video-player [class*=\"hint--\"] {\n  font-style: normal;\n  display: inline-block;\n  position: relative;\n}\n\n.art-video-player [class*=\"hint--\"]:before, .art-video-player [class*=\"hint--\"]:after {\n  visibility: hidden;\n  opacity: 0;\n  z-index: 1000000;\n  pointer-events: none;\n  transition: all .3s;\n  position: absolute;\n  transform: translate3d(0, 0, 0);\n}\n\n.art-video-player [class*=\"hint--\"]:hover:before, .art-video-player [class*=\"hint--\"]:hover:after {\n  visibility: visible;\n  opacity: 1;\n  transition-delay: .1s;\n}\n\n.art-video-player [class*=\"hint--\"]:before {\n  content: \"\";\n  z-index: 1000001;\n  background: none;\n  border: 6px solid #0000;\n  position: absolute;\n}\n\n.art-video-player [class*=\"hint--\"]:after {\n  color: #fff;\n  white-space: nowrap;\n  background: #000;\n  padding: 8px 10px;\n  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;\n  font-size: 12px;\n  line-height: 12px;\n}\n\n.art-video-player [class*=\"hint--\"][aria-label]:after {\n  content: attr(aria-label);\n}\n\n.art-video-player [class*=\"hint--\"][data-hint]:after {\n  content: attr(data-hint);\n}\n\n.art-video-player [aria-label=\"\"]:before, .art-video-player [aria-label=\"\"]:after, .art-video-player [data-hint=\"\"]:before, .art-video-player [data-hint=\"\"]:after {\n  display: none !important;\n}\n\n.art-video-player .hint--top-left:before, .art-video-player .hint--top-right:before, .art-video-player .hint--top:before {\n  border-top-color: #000;\n}\n\n.art-video-player .hint--bottom-left:before, .art-video-player .hint--bottom-right:before, .art-video-player .hint--bottom:before {\n  border-bottom-color: #000;\n}\n\n.art-video-player .hint--left:before {\n  border-left-color: #000;\n}\n\n.art-video-player .hint--right:before {\n  border-right-color: #000;\n}\n\n.art-video-player .hint--top:before {\n  margin-bottom: -11px;\n}\n\n.art-video-player .hint--top:before, .art-video-player .hint--top:after {\n  bottom: 100%;\n  left: 50%;\n}\n\n.art-video-player .hint--top:before {\n  left: calc(50% - 6px);\n}\n\n.art-video-player .hint--top:after {\n  transform: translateX(-50%);\n}\n\n.art-video-player .hint--top:hover:before {\n  transform: translateY(-8px);\n}\n\n.art-video-player .hint--top:hover:after {\n  transform: translateX(-50%)translateY(-8px);\n}\n\n.art-video-player .hint--bottom:before {\n  margin-top: -11px;\n}\n\n.art-video-player .hint--bottom:before, .art-video-player .hint--bottom:after {\n  top: 100%;\n  left: 50%;\n}\n\n.art-video-player .hint--bottom:before {\n  left: calc(50% - 6px);\n}\n\n.art-video-player .hint--bottom:after {\n  transform: translateX(-50%);\n}\n\n.art-video-player .hint--bottom:hover:before {\n  transform: translateY(8px);\n}\n\n.art-video-player .hint--bottom:hover:after {\n  transform: translateX(-50%)translateY(8px);\n}\n\n.art-video-player .hint--right:before {\n  margin-bottom: -6px;\n  margin-left: -11px;\n}\n\n.art-video-player .hint--right:after {\n  margin-bottom: -14px;\n}\n\n.art-video-player .hint--right:before, .art-video-player .hint--right:after {\n  bottom: 50%;\n  left: 100%;\n}\n\n.art-video-player .hint--right:hover:before, .art-video-player .hint--right:hover:after {\n  transform: translateX(8px);\n}\n\n.art-video-player .hint--left:before {\n  margin-bottom: -6px;\n  margin-right: -11px;\n}\n\n.art-video-player .hint--left:after {\n  margin-bottom: -14px;\n}\n\n.art-video-player .hint--left:before, .art-video-player .hint--left:after {\n  bottom: 50%;\n  right: 100%;\n}\n\n.art-video-player .hint--left:hover:before, .art-video-player .hint--left:hover:after {\n  transform: translateX(-8px);\n}\n\n.art-video-player .hint--top-left:before {\n  margin-bottom: -11px;\n}\n\n.art-video-player .hint--top-left:before, .art-video-player .hint--top-left:after {\n  bottom: 100%;\n  left: 50%;\n}\n\n.art-video-player .hint--top-left:before {\n  left: calc(50% - 6px);\n}\n\n.art-video-player .hint--top-left:after {\n  margin-left: 12px;\n  transform: translateX(-100%);\n}\n\n.art-video-player .hint--top-left:hover:before {\n  transform: translateY(-8px);\n}\n\n.art-video-player .hint--top-left:hover:after {\n  transform: translateX(-100%)translateY(-8px);\n}\n\n.art-video-player .hint--top-right:before {\n  margin-bottom: -11px;\n}\n\n.art-video-player .hint--top-right:before, .art-video-player .hint--top-right:after {\n  bottom: 100%;\n  left: 50%;\n}\n\n.art-video-player .hint--top-right:before {\n  left: calc(50% - 6px);\n}\n\n.art-video-player .hint--top-right:after {\n  margin-left: -12px;\n  transform: translateX(0);\n}\n\n.art-video-player .hint--top-right:hover:before, .art-video-player .hint--top-right:hover:after {\n  transform: translateY(-8px);\n}\n\n.art-video-player .hint--bottom-left:before {\n  margin-top: -11px;\n}\n\n.art-video-player .hint--bottom-left:before, .art-video-player .hint--bottom-left:after {\n  top: 100%;\n  left: 50%;\n}\n\n.art-video-player .hint--bottom-left:before {\n  left: calc(50% - 6px);\n}\n\n.art-video-player .hint--bottom-left:after {\n  margin-left: 12px;\n  transform: translateX(-100%);\n}\n\n.art-video-player .hint--bottom-left:hover:before {\n  transform: translateY(8px);\n}\n\n.art-video-player .hint--bottom-left:hover:after {\n  transform: translateX(-100%)translateY(8px);\n}\n\n.art-video-player .hint--bottom-right:before {\n  margin-top: -11px;\n}\n\n.art-video-player .hint--bottom-right:before, .art-video-player .hint--bottom-right:after {\n  top: 100%;\n  left: 50%;\n}\n\n.art-video-player .hint--bottom-right:before {\n  left: calc(50% - 6px);\n}\n\n.art-video-player .hint--bottom-right:after {\n  margin-left: -12px;\n  transform: translateX(0);\n}\n\n.art-video-player .hint--bottom-right:hover:before, .art-video-player .hint--bottom-right:hover:after {\n  transform: translateY(8px);\n}\n\n.art-video-player .hint--small:after, .art-video-player .hint--medium:after, .art-video-player .hint--large:after {\n  white-space: normal;\n  word-wrap: break-word;\n  line-height: 1.4em;\n}\n\n.art-video-player .hint--small:after {\n  width: 80px;\n}\n\n.art-video-player .hint--medium:after {\n  width: 150px;\n}\n\n.art-video-player .hint--large:after {\n  width: 300px;\n}\n\n.art-video-player [class*=\"hint--\"]:after {\n  text-shadow: 0 -1px #000;\n  box-shadow: 4px 4px 8px #0000004d;\n}\n\n.art-video-player .hint--error:after {\n  text-shadow: 0 -1px #592726;\n  background-color: #b34e4d;\n}\n\n.art-video-player .hint--error.hint--top-left:before, .art-video-player .hint--error.hint--top-right:before, .art-video-player .hint--error.hint--top:before {\n  border-top-color: #b34e4d;\n}\n\n.art-video-player .hint--error.hint--bottom-left:before, .art-video-player .hint--error.hint--bottom-right:before, .art-video-player .hint--error.hint--bottom:before {\n  border-bottom-color: #b34e4d;\n}\n\n.art-video-player .hint--error.hint--left:before {\n  border-left-color: #b34e4d;\n}\n\n.art-video-player .hint--error.hint--right:before {\n  border-right-color: #b34e4d;\n}\n\n.art-video-player .hint--warning:after {\n  text-shadow: 0 -1px #6c5328;\n  background-color: #c09854;\n}\n\n.art-video-player .hint--warning.hint--top-left:before, .art-video-player .hint--warning.hint--top-right:before, .art-video-player .hint--warning.hint--top:before {\n  border-top-color: #c09854;\n}\n\n.art-video-player .hint--warning.hint--bottom-left:before, .art-video-player .hint--warning.hint--bottom-right:before, .art-video-player .hint--warning.hint--bottom:before {\n  border-bottom-color: #c09854;\n}\n\n.art-video-player .hint--warning.hint--left:before {\n  border-left-color: #c09854;\n}\n\n.art-video-player .hint--warning.hint--right:before {\n  border-right-color: #c09854;\n}\n\n.art-video-player .hint--info:after {\n  text-shadow: 0 -1px #1a3c4d;\n  background-color: #3986ac;\n}\n\n.art-video-player .hint--info.hint--top-left:before, .art-video-player .hint--info.hint--top-right:before, .art-video-player .hint--info.hint--top:before {\n  border-top-color: #3986ac;\n}\n\n.art-video-player .hint--info.hint--bottom-left:before, .art-video-player .hint--info.hint--bottom-right:before, .art-video-player .hint--info.hint--bottom:before {\n  border-bottom-color: #3986ac;\n}\n\n.art-video-player .hint--info.hint--left:before {\n  border-left-color: #3986ac;\n}\n\n.art-video-player .hint--info.hint--right:before {\n  border-right-color: #3986ac;\n}\n\n.art-video-player .hint--success:after {\n  text-shadow: 0 -1px #1a321a;\n  background-color: #458746;\n}\n\n.art-video-player .hint--success.hint--top-left:before, .art-video-player .hint--success.hint--top-right:before, .art-video-player .hint--success.hint--top:before {\n  border-top-color: #458746;\n}\n\n.art-video-player .hint--success.hint--bottom-left:before, .art-video-player .hint--success.hint--bottom-right:before, .art-video-player .hint--success.hint--bottom:before {\n  border-bottom-color: #458746;\n}\n\n.art-video-player .hint--success.hint--left:before {\n  border-left-color: #458746;\n}\n\n.art-video-player .hint--success.hint--right:before {\n  border-right-color: #458746;\n}\n\n.art-video-player .hint--always:after, .art-video-player .hint--always:before {\n  opacity: 1;\n  visibility: visible;\n}\n\n.art-video-player .hint--always.hint--top:before {\n  transform: translateY(-8px);\n}\n\n.art-video-player .hint--always.hint--top:after {\n  transform: translateX(-50%)translateY(-8px);\n}\n\n.art-video-player .hint--always.hint--top-left:before {\n  transform: translateY(-8px);\n}\n\n.art-video-player .hint--always.hint--top-left:after {\n  transform: translateX(-100%)translateY(-8px);\n}\n\n.art-video-player .hint--always.hint--top-right:before, .art-video-player .hint--always.hint--top-right:after {\n  transform: translateY(-8px);\n}\n\n.art-video-player .hint--always.hint--bottom:before {\n  transform: translateY(8px);\n}\n\n.art-video-player .hint--always.hint--bottom:after {\n  transform: translateX(-50%)translateY(8px);\n}\n\n.art-video-player .hint--always.hint--bottom-left:before {\n  transform: translateY(8px);\n}\n\n.art-video-player .hint--always.hint--bottom-left:after {\n  transform: translateX(-100%)translateY(8px);\n}\n\n.art-video-player .hint--always.hint--bottom-right:before, .art-video-player .hint--always.hint--bottom-right:after {\n  transform: translateY(8px);\n}\n\n.art-video-player .hint--always.hint--left:before, .art-video-player .hint--always.hint--left:after {\n  transform: translateX(-8px);\n}\n\n.art-video-player .hint--always.hint--right:before, .art-video-player .hint--always.hint--right:after {\n  transform: translateX(8px);\n}\n\n.art-video-player .hint--rounded:after {\n  border-radius: 4px;\n}\n\n.art-video-player .hint--no-animate:before, .art-video-player .hint--no-animate:after {\n  transition-duration: 0s;\n}\n\n.art-video-player .hint--bounce:before, .art-video-player .hint--bounce:after {\n  -webkit-transition: opacity .3s, visibility .3s, -webkit-transform .3s cubic-bezier(.71, 1.7, .77, 1.24);\n  -moz-transition: opacity .3s, visibility .3s, -moz-transform .3s cubic-bezier(.71, 1.7, .77, 1.24);\n  transition: opacity .3s, visibility .3s, transform .3s cubic-bezier(.71, 1.7, .77, 1.24);\n}\n\n.art-video-player .hint--no-shadow:before, .art-video-player .hint--no-shadow:after {\n  text-shadow: initial;\n  box-shadow: initial;\n}\n\n.art-video-player .hint--no-arrow:before {\n  display: none;\n}\n\n.art-video-player.art-mobile {\n  --art-bottom-gap: 10px;\n  --art-control-height: 38px;\n  --art-control-icon-scale: 1;\n  --art-state-size: 60px;\n  --art-settings-max-height: 180px;\n  --art-selector-max-height: 180px;\n  --art-indicator-scale: 1;\n  --art-control-opacity: 1;\n}\n\n.art-video-player.art-mobile .art-controls-left {\n  margin-left: calc(var(--art-padding) / -1);\n}\n\n.art-video-player.art-mobile .art-controls-right {\n  margin-right: calc(var(--art-padding) / -1);\n}\n";

},{}],"9hUEm":[function(require,module,exports,__globalThis) {
!function(r, t) {
    module.exports = t();
}(this, function() {
    "use strict";
    function e(r) {
        return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
            return typeof r;
        } : function(r) {
            return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
        })(r);
    }
    var n = Object.prototype.toString, c = function(r) {
        if (void 0 === r) return "undefined";
        if (null === r) return "null";
        var t = e(r);
        if ("boolean" === t) return "boolean";
        if ("string" === t) return "string";
        if ("number" === t) return "number";
        if ("symbol" === t) return "symbol";
        if ("function" === t) return function(r) {
            return "GeneratorFunction" === o(r);
        }(r) ? "generatorfunction" : "function";
        if (function(r) {
            return Array.isArray ? Array.isArray(r) : r instanceof Array;
        }(r)) return "array";
        if (function(r) {
            if (r.constructor && "function" == typeof r.constructor.isBuffer) return r.constructor.isBuffer(r);
            return !1;
        }(r)) return "buffer";
        if (function(r) {
            try {
                if ("number" == typeof r.length && "function" == typeof r.callee) return !0;
            } catch (r) {
                if (-1 !== r.message.indexOf("callee")) return !0;
            }
            return !1;
        }(r)) return "arguments";
        if (function(r) {
            return r instanceof Date || "function" == typeof r.toDateString && "function" == typeof r.getDate && "function" == typeof r.setDate;
        }(r)) return "date";
        if (function(r) {
            return r instanceof Error || "string" == typeof r.message && r.constructor && "number" == typeof r.constructor.stackTraceLimit;
        }(r)) return "error";
        if (function(r) {
            return r instanceof RegExp || "string" == typeof r.flags && "boolean" == typeof r.ignoreCase && "boolean" == typeof r.multiline && "boolean" == typeof r.global;
        }(r)) return "regexp";
        switch(o(r)){
            case "Symbol":
                return "symbol";
            case "Promise":
                return "promise";
            case "WeakMap":
                return "weakmap";
            case "WeakSet":
                return "weakset";
            case "Map":
                return "map";
            case "Set":
                return "set";
            case "Int8Array":
                return "int8array";
            case "Uint8Array":
                return "uint8array";
            case "Uint8ClampedArray":
                return "uint8clampedarray";
            case "Int16Array":
                return "int16array";
            case "Uint16Array":
                return "uint16array";
            case "Int32Array":
                return "int32array";
            case "Uint32Array":
                return "uint32array";
            case "Float32Array":
                return "float32array";
            case "Float64Array":
                return "float64array";
        }
        if (function(r) {
            return "function" == typeof r.throw && "function" == typeof r.return && "function" == typeof r.next;
        }(r)) return "generator";
        switch(t = n.call(r)){
            case "[object Object]":
                return "object";
            case "[object Map Iterator]":
                return "mapiterator";
            case "[object Set Iterator]":
                return "setiterator";
            case "[object String Iterator]":
                return "stringiterator";
            case "[object Array Iterator]":
                return "arrayiterator";
        }
        return t.slice(8, -1).toLowerCase().replace(/\s/g, "");
    };
    function o(r) {
        return r.constructor ? r.constructor.name : null;
    }
    function f(r, t) {
        var e = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : [
            "option"
        ];
        return s(r, t, e), y(r, t, e), function(a, i, u) {
            var r = c(i), t = c(a);
            if ("object" === r) {
                if ("object" !== t) throw new Error("[Type Error]: '".concat(u.join("."), "' require 'object' type, but got '").concat(t, "'"));
                Object.keys(i).forEach(function(r) {
                    var t = a[r], e = i[r], n = u.slice();
                    n.push(r), s(t, e, n), y(t, e, n), f(t, e, n);
                });
            }
            if ("array" === r) {
                if ("array" !== t) throw new Error("[Type Error]: '".concat(u.join("."), "' require 'array' type, but got '").concat(t, "'"));
                a.forEach(function(r, t) {
                    var e = a[t], n = i[t] || i[0], o = u.slice();
                    o.push(t), s(e, n, o), y(e, n, o), f(e, n, o);
                });
            }
        }(r, t, e), r;
    }
    function s(r, t, e) {
        if ("string" === c(t)) {
            var n = c(r);
            if ("?" === t[0] && (t = t.slice(1) + "|undefined"), !(-1 < t.indexOf("|") ? t.split("|").map(function(r) {
                return r.toLowerCase().trim();
            }).filter(Boolean).some(function(r) {
                return n === r;
            }) : t.toLowerCase().trim() === n)) throw new Error("[Type Error]: '".concat(e.join("."), "' require '").concat(t, "' type, but got '").concat(n, "'"));
        }
    }
    function y(r, t, e) {
        if ("function" === c(t)) {
            var n = t(r, c(r), e);
            if (!0 !== n) {
                var o = c(n);
                throw "string" === o ? new Error(n) : "error" === o ? n : new Error("[Validator Error]: The scheme for '".concat(e.join("."), "' validator require return true, but got '").concat(n, "'"));
            }
        }
    }
    return f.kindOf = c, f;
});

},{}],"3r4tp":[function(require,module,exports,__globalThis) {
module.exports = JSON.parse("{\"name\":\"artplayer\",\"version\":\"5.3.1-beta.1\",\"description\":\"ArtPlayer.js is a modern and full featured HTML5 video player\",\"author\":\"Harvey Zhao <laozhaochaguan@gmail.com>\",\"license\":\"MIT\",\"homepage\":\"https://artplayer.org\",\"repository\":{\"type\":\"git\",\"url\":\"git+https://github.com/zhw2590582/ArtPlayer.git\"},\"bugs\":{\"url\":\"https://github.com/zhw2590582/ArtPlayer/issues\"},\"keywords\":[\"html5\",\"video\",\"player\"],\"exports\":{\".\":{\"types\":\"./types/artplayer.d.ts\",\"import\":\"./dist/artplayer.mjs\",\"require\":\"./dist/artplayer.js\"},\"./legacy\":{\"types\":\"./types/artplayer.d.ts\",\"import\":\"./dist/artplayer.legacy.js\",\"require\":\"./dist/artplayer.legacy.js\"},\"./i18n/*\":{\"types\":\"./types/i18n.d.ts\",\"import\":\"./dist/i18n/*.mjs\",\"require\":\"./dist/i18n/*.js\"}},\"main\":\"./dist/artplayer.js\",\"module\":\"./dist/artplayer.mjs\",\"types\":\"./types/artplayer.d.ts\",\"typesVersions\":{\"*\":{\"i18n/*\":[\"types/i18n.d.ts\"],\"legacy\":[\"types/artplayer.d.ts\"]}},\"legacy\":\"./dist/artplayer.legacy.js\",\"browserslist\":\"last 1 Chrome version\",\"dependencies\":{\"option-validator\":\"^2.0.6\"}}");

},{}],"1dlGA":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
exports.default = {
    properties: [
        'audioTracks',
        'autoplay',
        'buffered',
        'controller',
        'controls',
        'crossOrigin',
        'currentSrc',
        'currentTime',
        'defaultMuted',
        'defaultPlaybackRate',
        'duration',
        'ended',
        'error',
        'loop',
        'mediaGroup',
        'muted',
        'networkState',
        'paused',
        'playbackRate',
        'played',
        'preload',
        'readyState',
        'seekable',
        'seeking',
        'src',
        'startDate',
        'textTracks',
        'videoTracks',
        'volume'
    ],
    methods: [
        'addTextTrack',
        'canPlayType',
        'load',
        'play',
        'pause'
    ],
    events: [
        'abort',
        'canplay',
        'canplaythrough',
        'durationchange',
        'emptied',
        'ended',
        'error',
        'loadeddata',
        'loadedmetadata',
        'loadstart',
        'pause',
        'play',
        'playing',
        'progress',
        'ratechange',
        'seeked',
        'seeking',
        'stalled',
        'suspend',
        'timeupdate',
        'volumechange',
        'waiting'
    ],
    prototypes: [
        'width',
        'height',
        'videoWidth',
        'videoHeight',
        'poster',
        'webkitDecodedFrameCount',
        'webkitDroppedFrameCount',
        'playsInline',
        'webkitSupportsFullscreen',
        'webkitDisplayingFullscreen',
        'onenterpictureinpicture',
        'onleavepictureinpicture',
        'disablePictureInPicture',
        'cancelVideoFrameCallback',
        'requestVideoFrameCallback',
        'getVideoPlaybackQuality',
        'requestPictureInPicture',
        'webkitEnterFullScreen',
        'webkitEnterFullscreen',
        'webkitExitFullScreen',
        'webkitExitFullscreen'
    ]
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"8oCsH":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"dx7Zz":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
var _component = require("../utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
var _aspectRatio = require("./aspectRatio");
var _aspectRatioDefault = parcelHelpers.interopDefault(_aspectRatio);
var _close = require("./close");
var _closeDefault = parcelHelpers.interopDefault(_close);
var _flip = require("./flip");
var _flipDefault = parcelHelpers.interopDefault(_flip);
var _info = require("./info");
var _infoDefault = parcelHelpers.interopDefault(_info);
var _playbackRate = require("./playbackRate");
var _playbackRateDefault = parcelHelpers.interopDefault(_playbackRate);
var _version = require("./version");
var _versionDefault = parcelHelpers.interopDefault(_version);
class Contextmenu extends (0, _componentDefault.default) {
    constructor(art){
        super(art);
        this.name = 'contextmenu';
        this.$parent = art.template.$contextmenu;
        if (!(0, _utils.isMobile)) this.init();
    }
    init() {
        const { option, proxy, template: { $player, $contextmenu } } = this.art;
        if (option.playbackRate) this.add((0, _playbackRateDefault.default)({
            name: 'playbackRate',
            index: 10
        }));
        if (option.aspectRatio) this.add((0, _aspectRatioDefault.default)({
            name: 'aspectRatio',
            index: 20
        }));
        if (option.flip) this.add((0, _flipDefault.default)({
            name: 'flip',
            index: 30
        }));
        this.add((0, _infoDefault.default)({
            name: 'info',
            index: 40
        }));
        this.add((0, _versionDefault.default)({
            name: 'version',
            index: 50
        }));
        this.add((0, _closeDefault.default)({
            name: 'close',
            index: 60
        }));
        for(let index = 0; index < option.contextmenu.length; index++)this.add(option.contextmenu[index]);
        proxy($player, 'contextmenu', (event)=>{
            if (!this.art.constructor.CONTEXTMENU) return;
            event.preventDefault();
            this.show = true;
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            const { height: cHeight, width: cWidth, left: cLeft, top: cTop } = (0, _utils.getRect)($player);
            const { height: mHeight, width: mWidth } = (0, _utils.getRect)($contextmenu);
            let menuLeft = mouseX - cLeft;
            let menuTop = mouseY - cTop;
            if (mouseX + mWidth > cLeft + cWidth) menuLeft = cWidth - mWidth;
            if (mouseY + mHeight > cTop + cHeight) menuTop = cHeight - mHeight;
            (0, _utils.setStyles)($contextmenu, {
                top: `${menuTop}px`,
                left: `${menuLeft}px`
            });
        });
        proxy($player, 'click', (event)=>{
            if (!(0, _utils.includeFromEvent)(event, $contextmenu)) this.show = false;
        });
        this.art.on('blur', ()=>{
            this.show = false;
        });
    }
}
exports.default = Contextmenu;

},{"../utils":"gGxPm","../utils/component":"1wQH1","./aspectRatio":"iS5RH","./close":"2Iw6R","./flip":"cqZI9","./info":"hbkKl","./playbackRate":"dI4ur","./version":"b5I2V","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"gGxPm":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _compatibility = require("./compatibility");
parcelHelpers.exportAll(_compatibility, exports);
var _dom = require("./dom");
parcelHelpers.exportAll(_dom, exports);
var _error = require("./error");
parcelHelpers.exportAll(_error, exports);
var _file = require("./file");
parcelHelpers.exportAll(_file, exports);
var _format = require("./format");
parcelHelpers.exportAll(_format, exports);
var _property = require("./property");
parcelHelpers.exportAll(_property, exports);
var _subtitle = require("./subtitle");
parcelHelpers.exportAll(_subtitle, exports);
var _time = require("./time");
parcelHelpers.exportAll(_time, exports);

},{"./compatibility":"gWwQj","./dom":"1aVnA","./error":"29G01","./file":"l9MZw","./format":"lbsB4","./property":"84aB7","./subtitle":"9DUE6","./time":"94hvW","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"gWwQj":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "userAgent", ()=>userAgent);
parcelHelpers.export(exports, "isSafari", ()=>isSafari);
parcelHelpers.export(exports, "isIOS", ()=>isIOS);
parcelHelpers.export(exports, "isIOS13", ()=>isIOS13);
parcelHelpers.export(exports, "isMobile", ()=>isMobile);
parcelHelpers.export(exports, "isBrowser", ()=>isBrowser);
const userAgent = globalThis?.CUSTOM_USER_AGENT ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '');
const isSafari = /^(?:(?!chrome|android).)*safari/i.test(userAgent);
const isIOS = /iPad|iPhone|iPod/i.test(userAgent) && !window.MSStream;
const isIOS13 = isIOS || userAgent.includes('Macintosh') && navigator.maxTouchPoints >= 1;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || isIOS13;
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"1aVnA":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "query", ()=>query);
parcelHelpers.export(exports, "queryAll", ()=>queryAll);
parcelHelpers.export(exports, "addClass", ()=>addClass);
parcelHelpers.export(exports, "removeClass", ()=>removeClass);
parcelHelpers.export(exports, "hasClass", ()=>hasClass);
parcelHelpers.export(exports, "append", ()=>append);
parcelHelpers.export(exports, "remove", ()=>remove);
parcelHelpers.export(exports, "setStyle", ()=>setStyle);
parcelHelpers.export(exports, "setStyles", ()=>setStyles);
parcelHelpers.export(exports, "getStyle", ()=>getStyle);
parcelHelpers.export(exports, "siblings", ()=>siblings);
parcelHelpers.export(exports, "inverseClass", ()=>inverseClass);
parcelHelpers.export(exports, "tooltip", ()=>tooltip);
parcelHelpers.export(exports, "isInViewport", ()=>isInViewport);
parcelHelpers.export(exports, "includeFromEvent", ()=>includeFromEvent);
parcelHelpers.export(exports, "replaceElement", ()=>replaceElement);
parcelHelpers.export(exports, "createElement", ()=>createElement);
parcelHelpers.export(exports, "getIcon", ()=>getIcon);
parcelHelpers.export(exports, "setStyleText", ()=>setStyleText);
parcelHelpers.export(exports, "supportsFlex", ()=>supportsFlex);
parcelHelpers.export(exports, "getRect", ()=>getRect);
parcelHelpers.export(exports, "loadImg", ()=>loadImg);
parcelHelpers.export(exports, "getComposedPath", ()=>getComposedPath);
var _compatibility = require("./compatibility");
function query(selector, parent = document) {
    return parent.querySelector(selector);
}
function queryAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}
function addClass(target, className) {
    return target.classList.add(className);
}
function removeClass(target, className) {
    return target.classList.remove(className);
}
function hasClass(target, className) {
    return target.classList.contains(className);
}
function append(parent, child) {
    if (child instanceof Element) parent.appendChild(child);
    else parent.insertAdjacentHTML('beforeend', String(child));
    return parent.lastElementChild || parent.lastChild;
}
function remove(child) {
    return child.parentNode.removeChild(child);
}
function setStyle(element, key, value) {
    element.style[key] = value;
    return element;
}
function setStyles(element, styles) {
    for(const key in styles)setStyle(element, key, styles[key]);
    return element;
}
function getStyle(element, key, numberType = true) {
    const value = window.getComputedStyle(element, null).getPropertyValue(key);
    return numberType ? Number.parseFloat(value) : value;
}
function siblings(target) {
    return Array.from(target.parentElement.children).filter((item)=>item !== target);
}
function inverseClass(target, className) {
    siblings(target).forEach((item)=>removeClass(item, className));
    addClass(target, className);
}
function tooltip(target, msg, pos = 'top') {
    if (0, _compatibility.isMobile) return;
    target.setAttribute('aria-label', msg);
    addClass(target, 'hint--rounded');
    addClass(target, `hint--${pos}`);
}
function isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const vertInView = rect.top - offset <= windowHeight && rect.top + rect.height + offset >= 0;
    const horInView = rect.left - offset <= windowWidth + offset && rect.left + rect.width + offset >= 0;
    return vertInView && horInView;
}
function includeFromEvent(event, target) {
    return getComposedPath(event).includes(target);
}
function replaceElement(newChild, oldChild) {
    oldChild.parentNode.replaceChild(newChild, oldChild);
    return newChild;
}
function createElement(tag) {
    return document.createElement(tag);
}
function getIcon(key = '', html = '') {
    const icon = createElement('i');
    addClass(icon, 'art-icon');
    addClass(icon, `art-icon-${key}`);
    append(icon, html);
    return icon;
}
function setStyleText(id, style) {
    let $style = document.getElementById(id);
    if (!$style) {
        $style = document.createElement('style');
        $style.id = id;
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ()=>{
            document.head.appendChild($style);
        });
        else (document.head || document.documentElement).appendChild($style);
    }
    $style.textContent = style;
}
function supportsFlex() {
    const div = document.createElement('div');
    div.style.display = 'flex';
    return div.style.display === 'flex';
}
function getRect(el) {
    return el.getBoundingClientRect();
}
function loadImg(url, scale) {
    return new Promise((resolve, reject)=>{
        const img = new Image();
        img.onload = function() {
            if (!scale || scale === 1) resolve(img);
            else {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob)=>{
                    const blobUrl = URL.createObjectURL(blob);
                    const scaledImg = new Image();
                    scaledImg.onload = function() {
                        resolve(scaledImg);
                    };
                    scaledImg.onerror = function() {
                        URL.revokeObjectURL(blobUrl);
                        reject(new Error(`Image load failed: ${url}`));
                    };
                    scaledImg.src = blobUrl;
                });
            }
        };
        img.onerror = function() {
            reject(new Error(`Image load failed: ${url}`));
        };
        img.src = url;
    });
}
function getComposedPath(event) {
    if (event.composedPath) return event.composedPath();
    const path = [];
    let node = event.target;
    while(node){
        path.push(node);
        node = node.parentNode;
    }
    if (!path.includes(window) && window !== undefined) path.push(window);
    return path;
}

},{"./compatibility":"gWwQj","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"29G01":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ArtPlayerError", ()=>ArtPlayerError);
parcelHelpers.export(exports, "errorHandle", ()=>errorHandle);
class ArtPlayerError extends Error {
    constructor(message, context){
        super(message);
        if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(this, context || this.constructor);
        this.name = 'ArtPlayerError';
    }
}
function errorHandle(condition, msg) {
    if (!condition) throw new ArtPlayerError(msg);
    return condition;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"l9MZw":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getExt", ()=>getExt);
parcelHelpers.export(exports, "download", ()=>download);
function getExt(url) {
    if (url.includes('?')) return getExt(url.split('?')[0]);
    if (url.includes('#')) return getExt(url.split('#')[0]);
    return url.trim().toLowerCase().split('.').pop();
}
function download(url, name) {
    const elink = document.createElement('a');
    elink.style.display = 'none';
    elink.href = url;
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"lbsB4":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "clamp", ()=>clamp);
parcelHelpers.export(exports, "capitalize", ()=>capitalize);
parcelHelpers.export(exports, "secondToTime", ()=>secondToTime);
parcelHelpers.export(exports, "escape", ()=>escape);
parcelHelpers.export(exports, "unescape", ()=>unescape);
function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function secondToTime(second) {
    if (!second) return '00:00';
    const add0 = (num)=>num < 10 ? `0${num}` : String(num);
    const hour = Math.floor(second / 3600);
    const min = Math.floor((second - hour * 3600) / 60);
    const sec = Math.floor(second - hour * 3600 - min * 60);
    return (hour > 0 ? [
        hour,
        min,
        sec
    ] : [
        min,
        sec
    ]).map(add0).join(':');
}
function escape(str) {
    return str.replace(/[&<>'"]/g, (tag)=>({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '\'': '&#39;',
            '"': '&quot;'
        })[tag] || tag);
}
function unescape(str) {
    const map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#39;': '\'',
        '&quot;': '"'
    };
    const reg = new RegExp(`(${Object.keys(map).join('|')})`, 'g');
    return str.replace(reg, (tag)=>map[tag] || tag);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"84aB7":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "def", ()=>def);
parcelHelpers.export(exports, "has", ()=>has);
parcelHelpers.export(exports, "get", ()=>get);
parcelHelpers.export(exports, "mergeDeep", ()=>mergeDeep);
const def = Object.defineProperty;
const { hasOwnProperty } = Object.prototype;
function has(obj, name) {
    return hasOwnProperty.call(obj, name);
}
function get(obj, name) {
    return Object.getOwnPropertyDescriptor(obj, name);
}
function mergeDeep(...objects) {
    const isObject = (item)=>item && typeof item === 'object' && !Array.isArray(item);
    return objects.reduce((prev, obj)=>{
        Object.keys(obj).forEach((key)=>{
            const pVal = prev[key];
            const oVal = obj[key];
            if (Array.isArray(pVal) && Array.isArray(oVal)) prev[key] = pVal.concat(...oVal);
            else if (isObject(pVal) && isObject(oVal)) prev[key] = mergeDeep(pVal, oVal);
            else prev[key] = oVal;
        });
        return prev;
    }, {});
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"9DUE6":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "srtToVtt", ()=>srtToVtt);
parcelHelpers.export(exports, "vttToBlob", ()=>vttToBlob);
parcelHelpers.export(exports, "assToVtt", ()=>assToVtt);
function fixSrt(srt) {
    return srt.replace(/(\d\d:\d\d:\d\d)[,.](\d+)/g, (_, $1, $2)=>{
        let ms = $2.slice(0, 3);
        if ($2.length === 1) ms = `${$2}00`;
        if ($2.length === 2) ms = `${$2}0`;
        return `${$1},${ms}`;
    });
}
function srtToVtt(srtText) {
    return 'WEBVTT \r\n\r\n'.concat(fixSrt(srtText).replace(/\{\\([ibu])\}/g, '</$1>').replace(/\{\\([ibu])1\}/g, '<$1>').replace(/\{([ibu])\}/g, '<$1>').replace(/\{\/([ibu])\}/g, '</$1>').replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2').replace(/\{[\s\S]*?\}/g, '').concat('\r\n\r\n'));
}
function vttToBlob(vttText) {
    return URL.createObjectURL(new Blob([
        vttText
    ], {
        type: 'text/vtt'
    }));
}
function assToVtt(ass) {
    const reAss = new RegExp("Dialogue:\\s\\d,(\\d+:\\d\\d:\\d\\d.\\d\\d),(\\d+:\\d\\d:\\d\\d.\\d\\d),([^,]*),([^,]*),(?:[^,]*,){4}([\\s\\S]*)$", 'i');
    function fixTime(time = '') {
        return time.split(/[:.]/).map((item, index, arr)=>{
            if (index === arr.length - 1) {
                if (item.length === 1) return `.${item}00`;
                if (item.length === 2) return `.${item}0`;
            } else if (item.length === 1) return (index === 0 ? '0' : ':0') + item;
            return index === 0 ? item : index === arr.length - 1 ? `.${item}` : `:${item}`;
        }).join('');
    }
    return `WEBVTT` + `\n` + `\n${ass.split(/\r?\n/).map((line)=>{
        const m = line.match(reAss);
        if (!m) return null;
        return {
            start: fixTime(m[1].trim()),
            end: fixTime(m[2].trim()),
            text: m[5].replace(/\{[\s\S]*?\}/g, '').replace(/(\\N)/g, '\n').trim().split(/\r?\n/).map((item)=>item.trim()).join('\n')
        };
    }).filter((line)=>line).map((line, index)=>{
        if (line) return `${index + 1}\n` + `${line.start} --> ${line.end}` + `\n` + `${line.text}`;
        return '';
    }).filter((line)=>line.trim()).join('\n\n')}`;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"94hvW":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "sleep", ()=>sleep);
parcelHelpers.export(exports, "debounce", ()=>debounce);
parcelHelpers.export(exports, "throttle", ()=>throttle);
function sleep(ms = 0) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
function debounce(func, duration) {
    let timeout;
    return function(...args) {
        const effect = ()=>{
            timeout = null;
            return func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(effect, duration);
    };
}
function throttle(func, duration) {
    let shouldWait = false;
    return function(...args) {
        if (!shouldWait) {
            func.apply(this, args);
            shouldWait = true;
            setTimeout(()=>{
                shouldWait = false;
            }, duration);
        }
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"1wQH1":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _optionValidator = require("option-validator");
var _optionValidatorDefault = parcelHelpers.interopDefault(_optionValidator);
var _scheme = require("../scheme");
var _dom = require("./dom");
var _error = require("./error");
class Component {
    constructor(art){
        this.id = 0;
        this.art = art;
        this.cache = new Map();
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
    }
    get show() {
        return (0, _dom.hasClass)(this.art.template.$player, `art-${this.name}-show`);
    }
    set show(value) {
        const { $player } = this.art.template;
        const className = `art-${this.name}-show`;
        if (value) (0, _dom.addClass)($player, className);
        else (0, _dom.removeClass)($player, className);
        this.art.emit(this.name, value);
    }
    toggle() {
        this.show = !this.show;
    }
    add(getOption) {
        const option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        option.html = option.html || '';
        (0, _optionValidatorDefault.default)(option, (0, _scheme.ComponentOption));
        if (!this.$parent || !this.name || option.disable) return;
        const name = option.name || `${this.name}${this.id}`;
        (0, _error.errorHandle)(!this.cache.has(name), `Can't add an existing [${name}] to the [${this.name}]`);
        this.id += 1;
        const $ref = (0, _dom.createElement)('div');
        (0, _dom.addClass)($ref, `art-${this.name}`);
        (0, _dom.addClass)($ref, `art-${this.name}-${name}`);
        const childs = Array.from(this.$parent.children);
        $ref.dataset.index = option.index || this.id;
        const nextChild = childs.find((item)=>Number(item.dataset.index) >= Number($ref.dataset.index));
        if (nextChild) nextChild.insertAdjacentElement('beforebegin', $ref);
        else (0, _dom.append)(this.$parent, $ref);
        if (option.html) (0, _dom.append)($ref, option.html);
        if (option.style) (0, _dom.setStyles)($ref, option.style);
        if (option.tooltip) (0, _dom.tooltip)($ref, option.tooltip);
        const events = [];
        if (option.click) {
            const destroyEvent = this.art.events.proxy($ref, 'click', (event)=>{
                event.preventDefault();
                option.click.call(this.art, this, event);
            });
            events.push(destroyEvent);
        }
        if (option.selector && [
            'left',
            'right'
        ].includes(option.position)) this.selector(option, $ref, events);
        this[name] = $ref;
        this.cache.set(name, {
            $ref,
            events,
            option
        });
        if (option.mounted) option.mounted.call(this.art, $ref);
        return $ref;
    }
    remove(name) {
        (0, _error.errorHandle)(this.cache.has(name), `Can't find [${name}] from the [${this.name}]`);
        const item = this.cache.get(name);
        if (item.option.beforeUnmount) item.option.beforeUnmount.call(this.art, item.$ref);
        for (const event of item.events)this.art.events.remove(event);
        this.cache.delete(name);
        delete this[name];
        (0, _dom.remove)(item.$ref);
    }
    update(option) {
        if (this.cache.has(option.name)) {
            const item = this.cache.get(option.name);
            option = Object.assign(item.option, option);
            this.remove(option.name);
        }
        return this.add(option);
    }
}
exports.default = Component;

},{"option-validator":"9hUEm","../scheme":"8YPbR","./dom":"1aVnA","./error":"29G01","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"8YPbR":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ComponentOption", ()=>ComponentOption);
var _utils = require("../utils");
const a = 'array';
const b = 'boolean';
const s = 'string';
const n = 'number';
const o = 'object';
const f = 'function';
function validElement(value, type, paths) {
    return (0, _utils.errorHandle)(type === s || type === n || value instanceof Element, `${paths.join('.')} require '${s}' or 'Element' type`);
}
const ComponentOption = {
    html: validElement,
    disable: `?${b}`,
    name: `?${s}`,
    index: `?${n}`,
    style: `?${o}`,
    click: `?${f}`,
    mounted: `?${f}`,
    tooltip: `?${s}|${n}`,
    width: `?${n}`,
    selector: `?${a}`,
    onSelect: `?${f}`,
    switch: `?${b}`,
    onSwitch: `?${f}`,
    range: `?${a}`,
    onRange: `?${f}`,
    onChange: `?${f}`
};
exports.default = {
    id: s,
    container: validElement,
    url: s,
    poster: s,
    type: s,
    theme: s,
    lang: s,
    volume: n,
    isLive: b,
    muted: b,
    autoplay: b,
    autoSize: b,
    autoMini: b,
    loop: b,
    flip: b,
    playbackRate: b,
    aspectRatio: b,
    screenshot: b,
    setting: b,
    hotkey: b,
    pip: b,
    mutex: b,
    backdrop: b,
    fullscreen: b,
    fullscreenWeb: b,
    subtitleOffset: b,
    miniProgressBar: b,
    useSSR: b,
    playsInline: b,
    lock: b,
    gesture: b,
    fastForward: b,
    autoPlayback: b,
    autoOrientation: b,
    airplay: b,
    proxy: `?${f}`,
    plugins: [
        f
    ],
    layers: [
        ComponentOption
    ],
    contextmenu: [
        ComponentOption
    ],
    settings: [
        ComponentOption
    ],
    controls: [
        {
            ...ComponentOption,
            position: (value, _, paths)=>{
                const position = [
                    'top',
                    'left',
                    'right'
                ];
                return (0, _utils.errorHandle)(position.includes(value), `${paths.join('.')} only accept ${position.toString()} as parameters`);
            }
        }
    ],
    quality: [
        {
            default: `?${b}`,
            html: s,
            url: s
        }
    ],
    highlight: [
        {
            time: n,
            text: s
        }
    ],
    thumbnails: {
        url: s,
        number: n,
        column: n,
        width: n,
        height: n,
        scale: n
    },
    subtitle: {
        url: s,
        name: s,
        type: s,
        style: o,
        escape: b,
        encoding: s,
        onVttLoad: f
    },
    moreVideoAttr: o,
    i18n: o,
    icons: o,
    cssVar: o,
    customType: o
};

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"iS5RH":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>aspectRatio);
var _utils = require("../utils");
function aspectRatio(option) {
    return (art)=>{
        const { i18n, constructor: { ASPECT_RATIO } } = art;
        const html = ASPECT_RATIO.map((item)=>`<span data-value="${item}">${item === 'default' ? i18n.get('Default') : item}</span>`).join('');
        return {
            ...option,
            html: `${i18n.get('Aspect Ratio')}: ${html}`,
            click: (contextmenu, event)=>{
                const { value } = event.target.dataset;
                if (value) {
                    art.aspectRatio = value;
                    contextmenu.show = false;
                }
            },
            mounted: ($panel)=>{
                const $default = (0, _utils.query)('[data-value="default"]', $panel);
                if ($default) (0, _utils.inverseClass)($default, 'art-current');
                art.on('aspectRatio', (value)=>{
                    const $current = (0, _utils.queryAll)('span', $panel).find((item)=>item.dataset.value === value);
                    if ($current) (0, _utils.inverseClass)($current, 'art-current');
                });
            }
        };
    };
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"2Iw6R":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>close);
function close(option) {
    return (art)=>({
            ...option,
            html: art.i18n.get('Close'),
            click: (contextmenu)=>{
                contextmenu.show = false;
            }
        });
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"cqZI9":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>flip);
var _utils = require("../utils");
function flip(option) {
    return (art)=>{
        const { i18n, constructor: { FLIP } } = art;
        const html = FLIP.map((item)=>`<span data-value="${item}">${i18n.get((0, _utils.capitalize)(item))}</span>`).join('');
        return {
            ...option,
            html: `${i18n.get('Video Flip')}: ${html}`,
            click: (contextmenu, event)=>{
                const { value } = event.target.dataset;
                if (value) {
                    art.flip = value.toLowerCase();
                    contextmenu.show = false;
                }
            },
            mounted: ($panel)=>{
                const $default = (0, _utils.query)('[data-value="normal"]', $panel);
                if ($default) (0, _utils.inverseClass)($default, 'art-current');
                art.on('flip', (value)=>{
                    const $current = (0, _utils.queryAll)('span', $panel).find((item)=>item.dataset.value === value);
                    if ($current) (0, _utils.inverseClass)($current, 'art-current');
                });
            }
        };
    };
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"hbkKl":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>info);
function info(option) {
    return (art)=>({
            ...option,
            html: art.i18n.get('Video Info'),
            click: (contextmenu)=>{
                art.info.show = true;
                contextmenu.show = false;
            }
        });
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"dI4ur":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>playbackRate);
var _utils = require("../utils");
function playbackRate(option) {
    return (art)=>{
        const { i18n, constructor: { PLAYBACK_RATE } } = art;
        const html = PLAYBACK_RATE.map((item)=>`<span data-value="${item}">${item === 1 ? i18n.get('Normal') : item.toFixed(1)}</span>`).join('');
        return {
            ...option,
            html: `${i18n.get('Play Speed')}: ${html}`,
            click: (contextmenu, event)=>{
                const { value } = event.target.dataset;
                if (value) {
                    art.playbackRate = Number(value);
                    contextmenu.show = false;
                }
            },
            mounted: ($panel)=>{
                const $default = (0, _utils.query)('[data-value="1"]', $panel);
                if ($default) (0, _utils.inverseClass)($default, 'art-current');
                art.on('video:ratechange', ()=>{
                    const $current = (0, _utils.queryAll)('span', $panel).find((item)=>Number(item.dataset.value) === art.playbackRate);
                    if ($current) (0, _utils.inverseClass)($current, 'art-current');
                });
            }
        };
    };
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"b5I2V":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(option) {
        return {
            ...option,
            html: `<a href="https://artplayer.org" target="_blank" style="width:100%;">ArtPlayer ${0, _packageJson.version}</a>`
        };
    });
var _packageJson = require("../../package.json");

},{"../../package.json":"3r4tp","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"cNVpy":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
var _component = require("../utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
var _airplay = require("./airplay");
var _airplayDefault = parcelHelpers.interopDefault(_airplay);
var _fullscreen = require("./fullscreen");
var _fullscreenDefault = parcelHelpers.interopDefault(_fullscreen);
var _fullscreenWeb = require("./fullscreenWeb");
var _fullscreenWebDefault = parcelHelpers.interopDefault(_fullscreenWeb);
var _pip = require("./pip");
var _pipDefault = parcelHelpers.interopDefault(_pip);
var _playAndPause = require("./playAndPause");
var _playAndPauseDefault = parcelHelpers.interopDefault(_playAndPause);
var _progress = require("./progress");
var _progressDefault = parcelHelpers.interopDefault(_progress);
var _screenshot = require("./screenshot");
var _screenshotDefault = parcelHelpers.interopDefault(_screenshot);
var _setting = require("./setting");
var _settingDefault = parcelHelpers.interopDefault(_setting);
var _time = require("./time");
var _timeDefault = parcelHelpers.interopDefault(_time);
var _volume = require("./volume");
var _volumeDefault = parcelHelpers.interopDefault(_volume);
class Control extends (0, _componentDefault.default) {
    constructor(art){
        super(art);
        this.isHover = false;
        this.name = 'control';
        this.timer = Date.now();
        const { constructor } = art;
        const { $player, $bottom } = this.art.template;
        art.on('mousemove', ()=>{
            if (!(0, _utils.isMobile)) this.show = true;
        });
        art.on('click', ()=>{
            if (0, _utils.isMobile) this.toggle();
            else this.show = true;
        });
        art.on('document:mousemove', (event)=>{
            this.isHover = (0, _utils.includeFromEvent)(event, $bottom);
        });
        art.on('video:timeupdate', ()=>{
            if (!art.setting.show && !this.isHover && !art.isInput && art.playing && this.show && Date.now() - this.timer >= constructor.CONTROL_HIDE_TIME) this.show = false;
        });
        art.on('control', (state)=>{
            if (state) {
                (0, _utils.removeClass)($player, 'art-hide-cursor');
                (0, _utils.addClass)($player, 'art-hover');
                this.timer = Date.now();
            } else {
                (0, _utils.addClass)($player, 'art-hide-cursor');
                (0, _utils.removeClass)($player, 'art-hover');
            }
        });
        this.init();
    }
    init() {
        const { option } = this.art;
        if (!option.isLive) this.add((0, _progressDefault.default)({
            name: 'progress',
            position: 'top',
            index: 10
        }));
        this.add({
            name: 'thumbnails',
            position: 'top',
            index: 20
        });
        this.add((0, _playAndPauseDefault.default)({
            name: 'playAndPause',
            position: 'left',
            index: 10
        }));
        this.add((0, _volumeDefault.default)({
            name: 'volume',
            position: 'left',
            index: 20
        }));
        if (!option.isLive) this.add((0, _timeDefault.default)({
            name: 'time',
            position: 'left',
            index: 30
        }));
        if (option.quality.length) (0, _utils.sleep)().then(()=>{
            this.art.quality = option.quality;
        });
        if (option.screenshot && !(0, _utils.isMobile)) this.add((0, _screenshotDefault.default)({
            name: 'screenshot',
            position: 'right',
            index: 20
        }));
        if (option.setting) this.add((0, _settingDefault.default)({
            name: 'setting',
            position: 'right',
            index: 30
        }));
        if (option.pip) this.add((0, _pipDefault.default)({
            name: 'pip',
            position: 'right',
            index: 40
        }));
        if (option.airplay && window.WebKitPlaybackTargetAvailabilityEvent) this.add((0, _airplayDefault.default)({
            name: 'airplay',
            position: 'right',
            index: 50
        }));
        if (option.fullscreenWeb) this.add((0, _fullscreenWebDefault.default)({
            name: 'fullscreenWeb',
            position: 'right',
            index: 60
        }));
        if (option.fullscreen) this.add((0, _fullscreenDefault.default)({
            name: 'fullscreen',
            position: 'right',
            index: 70
        }));
        for(let index = 0; index < option.controls.length; index++)this.add(option.controls[index]);
    }
    add(getOption) {
        const option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        const { $progress, $controlsLeft, $controlsRight } = this.art.template;
        switch(option.position){
            case 'top':
                this.$parent = $progress;
                break;
            case 'left':
                this.$parent = $controlsLeft;
                break;
            case 'right':
                this.$parent = $controlsRight;
                break;
            default:
                (0, _utils.errorHandle)(false, `Control option.position must one of 'top', 'left', 'right'`);
                break;
        }
        super.add(option);
    }
    check(target) {
        if (!target) return;
        target.$control_value.innerHTML = target.html;
        for(let index = 0; index < target.$control_option.length; index++){
            const item = target.$control_option[index];
            item.default = item === target;
            if (item.default) (0, _utils.inverseClass)(item.$control_item, 'art-current');
        }
    }
    selector(option, $ref, events) {
        const { proxy } = this.art.events;
        (0, _utils.addClass)($ref, 'art-control-selector');
        const $value = (0, _utils.createElement)('div');
        (0, _utils.addClass)($value, 'art-selector-value');
        (0, _utils.append)($value, option.html);
        $ref.textContent = '';
        (0, _utils.append)($ref, $value);
        const $list = (0, _utils.createElement)('div');
        (0, _utils.addClass)($list, 'art-selector-list');
        (0, _utils.append)($ref, $list);
        for(let index = 0; index < option.selector.length; index++){
            const item = option.selector[index];
            const $item = (0, _utils.createElement)('div');
            (0, _utils.addClass)($item, 'art-selector-item');
            if (item.default) (0, _utils.addClass)($item, 'art-current');
            $item.dataset.index = index;
            $item.dataset.value = item.value;
            $item.innerHTML = item.html;
            (0, _utils.append)($list, $item);
            (0, _utils.def)(item, '$control_option', {
                get: ()=>option.selector
            });
            (0, _utils.def)(item, '$control_item', {
                get: ()=>$item
            });
            (0, _utils.def)(item, '$control_value', {
                get: ()=>$value
            });
        }
        const event = proxy($list, 'click', async (event)=>{
            const path = (0, _utils.getComposedPath)(event);
            const item = option.selector.find((item)=>item.$control_item === path.find(($item)=>item.$control_item === $item));
            this.check(item);
            if (option.onSelect) $value.innerHTML = await option.onSelect.call(this.art, item, item.$control_item, event);
        });
        events.push(event);
    }
}
exports.default = Control;

},{"../utils":"gGxPm","../utils/component":"1wQH1","./airplay":"lTlrf","./fullscreen":"hZAUt","./fullscreenWeb":"hI1SN","./pip":"ka0Xr","./playAndPause":"jeo77","./progress":"7uH4F","./screenshot":"2XZ2T","./setting":"d5chS","./time":"4MZ6S","./volume":"eP3Jv","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"lTlrf":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>airplay);
var _utils = require("../utils");
function airplay(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('AirPlay'),
            mounted: ($control)=>{
                const { proxy, icons } = art;
                (0, _utils.append)($control, icons.airplay);
                proxy($control, 'click', ()=>art.airplay());
            }
        });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"hZAUt":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>fullscreen);
var _utils = require("../utils");
function fullscreen(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Fullscreen'),
            mounted: ($control)=>{
                const { proxy, icons, i18n } = art;
                const $fullscreenOn = (0, _utils.append)($control, icons.fullscreenOn);
                const $fullscreenOff = (0, _utils.append)($control, icons.fullscreenOff);
                (0, _utils.setStyle)($fullscreenOff, 'display', 'none');
                proxy($control, 'click', ()=>{
                    art.fullscreen = !art.fullscreen;
                });
                art.on('fullscreen', (state)=>{
                    if (state) {
                        (0, _utils.tooltip)($control, i18n.get('Exit Fullscreen'));
                        (0, _utils.setStyle)($fullscreenOn, 'display', 'none');
                        (0, _utils.setStyle)($fullscreenOff, 'display', 'inline-flex');
                    } else {
                        (0, _utils.tooltip)($control, i18n.get('Fullscreen'));
                        (0, _utils.setStyle)($fullscreenOn, 'display', 'inline-flex');
                        (0, _utils.setStyle)($fullscreenOff, 'display', 'none');
                    }
                });
            }
        });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"hI1SN":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>fullscreenWeb);
var _utils = require("../utils");
function fullscreenWeb(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Web Fullscreen'),
            mounted: ($control)=>{
                const { proxy, icons, i18n } = art;
                const $fullscreenWebOn = (0, _utils.append)($control, icons.fullscreenWebOn);
                const $fullscreenWebOff = (0, _utils.append)($control, icons.fullscreenWebOff);
                (0, _utils.setStyle)($fullscreenWebOff, 'display', 'none');
                proxy($control, 'click', ()=>{
                    art.fullscreenWeb = !art.fullscreenWeb;
                });
                art.on('fullscreenWeb', (value)=>{
                    if (value) {
                        (0, _utils.tooltip)($control, i18n.get('Exit Web Fullscreen'));
                        (0, _utils.setStyle)($fullscreenWebOn, 'display', 'none');
                        (0, _utils.setStyle)($fullscreenWebOff, 'display', 'inline-flex');
                    } else {
                        (0, _utils.tooltip)($control, i18n.get('Web Fullscreen'));
                        (0, _utils.setStyle)($fullscreenWebOn, 'display', 'inline-flex');
                        (0, _utils.setStyle)($fullscreenWebOff, 'display', 'none');
                    }
                });
            }
        });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"ka0Xr":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>pip);
var _utils = require("../utils");
function pip(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('PIP Mode'),
            mounted: ($control)=>{
                const { proxy, icons, i18n } = art;
                (0, _utils.append)($control, icons.pip);
                proxy($control, 'click', ()=>{
                    art.pip = !art.pip;
                });
                art.on('pip', (value)=>{
                    (0, _utils.tooltip)($control, i18n.get(value ? 'Exit PIP Mode' : 'PIP Mode'));
                });
            }
        });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"jeo77":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>playAndPause);
var _utils = require("../utils");
function playAndPause(option) {
    return (art)=>({
            ...option,
            mounted: ($control)=>{
                const { proxy, icons, i18n } = art;
                const $play = (0, _utils.append)($control, icons.play);
                const $pause = (0, _utils.append)($control, icons.pause);
                (0, _utils.tooltip)($play, i18n.get('Play'));
                (0, _utils.tooltip)($pause, i18n.get('Pause'));
                proxy($play, 'click', ()=>{
                    art.play();
                });
                proxy($pause, 'click', ()=>{
                    art.pause();
                });
                function showPlay() {
                    (0, _utils.setStyle)($play, 'display', 'flex');
                    (0, _utils.setStyle)($pause, 'display', 'none');
                }
                function showPause() {
                    (0, _utils.setStyle)($play, 'display', 'none');
                    (0, _utils.setStyle)($pause, 'display', 'flex');
                }
                if (art.playing) showPause();
                else showPlay();
                art.on('video:playing', ()=>{
                    showPause();
                });
                art.on('video:pause', ()=>{
                    showPlay();
                });
            }
        });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"7uH4F":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getPosFromEvent", ()=>getPosFromEvent);
parcelHelpers.export(exports, "setCurrentTime", ()=>setCurrentTime);
parcelHelpers.export(exports, "default", ()=>progress);
var _utils = require("../utils");
function getPosFromEvent(art, event) {
    const { $progress } = art.template;
    const { left } = (0, _utils.getRect)($progress);
    const eventLeft = (0, _utils.isMobile) ? event.touches[0].clientX : event.clientX;
    const width = (0, _utils.clamp)(eventLeft - left, 0, $progress.clientWidth);
    const second = width / $progress.clientWidth * art.duration;
    const time = (0, _utils.secondToTime)(second);
    const percentage = (0, _utils.clamp)(width / $progress.clientWidth, 0, 1);
    return {
        second,
        time,
        width,
        percentage
    };
}
function setCurrentTime(art, event) {
    if (art.isRotate) {
        const percentage = event.touches[0].clientY / art.height;
        const second = percentage * art.duration;
        art.emit('setBar', 'played', percentage, event);
        art.seek = second;
    } else {
        const { second, percentage } = getPosFromEvent(art, event);
        art.emit('setBar', 'played', percentage, event);
        art.seek = second;
    }
}
function progress(options) {
    return (art)=>{
        const { icons, option, proxy } = art;
        const { $player } = art.template;
        return {
            ...options,
            html: `
                <div class="art-control-progress-inner">
                    <div class="art-progress-hover"></div>
                    <div class="art-progress-loaded"></div>
                    <div class="art-progress-played"></div>
                    <div class="art-progress-highlight"></div>
                    <div class="art-progress-indicator"></div>
                    <div class="art-progress-tip">00:00</div>
                </div>
            `,
            mounted: ($control)=>{
                let tipTimer = null;
                let isDragging = false;
                const $hover = (0, _utils.query)('.art-progress-hover', $control);
                const $loaded = (0, _utils.query)('.art-progress-loaded', $control);
                const $played = (0, _utils.query)('.art-progress-played', $control);
                const $highlight = (0, _utils.query)('.art-progress-highlight', $control);
                const $indicator = (0, _utils.query)('.art-progress-indicator', $control);
                const $tip = (0, _utils.query)('.art-progress-tip', $control);
                if (icons.indicator) (0, _utils.append)($indicator, icons.indicator);
                else (0, _utils.setStyle)($indicator, 'backgroundColor', 'var(--art-theme)');
                function showHighlight(event) {
                    const { width } = getPosFromEvent(art, event);
                    const { text } = event.target.dataset;
                    $tip.textContent = text;
                    const tipWidth = $tip.clientWidth;
                    if (width <= tipWidth / 2) (0, _utils.setStyle)($tip, 'left', 0);
                    else if (width > $control.clientWidth - tipWidth / 2) (0, _utils.setStyle)($tip, 'left', `${$control.clientWidth - tipWidth}px`);
                    else (0, _utils.setStyle)($tip, 'left', `${width - tipWidth / 2}px`);
                }
                function showTime(event, touch) {
                    const { width, time } = touch || getPosFromEvent(art, event);
                    $tip.textContent = time || '00:00';
                    const tipWidth = $tip.clientWidth;
                    if (width <= tipWidth / 2) (0, _utils.setStyle)($tip, 'left', 0);
                    else if (width > $control.clientWidth - tipWidth / 2) (0, _utils.setStyle)($tip, 'left', `${$control.clientWidth - tipWidth}px`);
                    else (0, _utils.setStyle)($tip, 'left', `${width - tipWidth / 2}px`);
                }
                function updateHighlight() {
                    $highlight.textContent = '';
                    for(let index = 0; index < option.highlight.length; index++){
                        const item = option.highlight[index];
                        const left = (0, _utils.clamp)(item.time, 0, art.duration) / art.duration * 100;
                        const html = `<span data-text="${item.text}" data-time="${item.time}" style="left: ${left}%"></span>`;
                        (0, _utils.append)($highlight, html);
                    }
                }
                function setBar(type, percentage, event) {
                    const isMobileDragging = type === 'played' && event && (0, _utils.isMobile);
                    if (type === 'loaded') (0, _utils.setStyle)($loaded, 'width', `${percentage * 100}%`);
                    if (type === 'hover') {
                        (0, _utils.setStyle)($hover, 'width', `${percentage * 100}%`);
                        if ((0, _utils.includeFromEvent)(event, $highlight)) showHighlight(event);
                        else showTime(event);
                        if (percentage === 0) (0, _utils.removeClass)($player, 'art-progress-hover');
                        else (0, _utils.addClass)($player, 'art-progress-hover');
                    }
                    if (type === 'played') {
                        (0, _utils.setStyle)($played, 'width', `${percentage * 100}%`);
                        (0, _utils.setStyle)($indicator, 'left', `${percentage * 100}%`);
                    }
                    if (isMobileDragging) {
                        (0, _utils.addClass)($player, 'art-progress-hover');
                        const width = $control.clientWidth * percentage;
                        const time = (0, _utils.secondToTime)(percentage * art.duration);
                        showTime(event, {
                            width,
                            time
                        });
                        clearTimeout(tipTimer);
                        tipTimer = setTimeout(()=>{
                            (0, _utils.removeClass)($player, 'art-progress-hover');
                        }, 500);
                    }
                }
                art.on('setBar', setBar);
                art.on('video:loadedmetadata', updateHighlight);
                if (art.constructor.USE_RAF) art.on('raf', ()=>{
                    art.emit('setBar', 'played', art.played);
                    art.emit('setBar', 'loaded', art.loaded);
                });
                else {
                    art.on('video:timeupdate', ()=>{
                        art.emit('setBar', 'played', art.played);
                    });
                    art.on('video:progress', ()=>{
                        art.emit('setBar', 'loaded', art.loaded);
                    });
                    art.on('video:ended', ()=>{
                        art.emit('setBar', 'played', 1);
                    });
                }
                art.emit('setBar', 'loaded', art.loaded || 0);
                if (!(0, _utils.isMobile)) {
                    proxy($control, 'click', (event)=>{
                        if (event.target !== $indicator) setCurrentTime(art, event);
                    });
                    proxy($control, 'mousemove', (event)=>{
                        const { percentage } = getPosFromEvent(art, event);
                        art.emit('setBar', 'hover', percentage, event);
                    });
                    proxy($control, 'mouseleave', (event)=>{
                        art.emit('setBar', 'hover', 0, event);
                    });
                    proxy($control, 'mousedown', (event)=>{
                        isDragging = event.button === 0;
                    });
                    art.on('document:mousemove', (event)=>{
                        if (isDragging) {
                            const { second, percentage } = getPosFromEvent(art, event);
                            art.emit('setBar', 'played', percentage, event);
                            art.seek = second;
                        }
                    });
                    art.on('document:mouseup', ()=>{
                        if (isDragging) isDragging = false;
                    });
                }
            }
        };
    };
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"2XZ2T":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>screenshot);
var _utils = require("../utils");
function screenshot(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Screenshot'),
            mounted: ($control)=>{
                const { proxy, icons } = art;
                (0, _utils.append)($control, icons.screenshot);
                proxy($control, 'click', ()=>{
                    art.screenshot();
                });
            }
        });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"d5chS":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>setting);
var _utils = require("../utils");
function setting(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Show Setting'),
            mounted: ($control)=>{
                const { proxy, icons, i18n } = art;
                (0, _utils.append)($control, icons.setting);
                proxy($control, 'click', ()=>{
                    art.setting.toggle();
                    art.setting.resize();
                });
                art.on('setting', (value)=>{
                    (0, _utils.tooltip)($control, i18n.get(value ? 'Hide Setting' : 'Show Setting'));
                });
            }
        });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"4MZ6S":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>time);
var _utils = require("../utils");
function time(option) {
    return (art)=>({
            ...option,
            style: (0, _utils.isMobile) ? {
                fontSize: '12px',
                padding: '0 5px'
            } : {
                cursor: 'auto',
                padding: '0 10px'
            },
            mounted: ($control)=>{
                function getTime() {
                    const newTime = `${(0, _utils.secondToTime)(art.currentTime)} / ${(0, _utils.secondToTime)(art.duration)}`;
                    if (newTime !== $control.textContent) $control.textContent = newTime;
                }
                getTime();
                const events = [
                    'video:loadedmetadata',
                    'video:timeupdate',
                    'video:progress'
                ];
                for(let index = 0; index < events.length; index++)art.on(events[index], getTime);
            }
        });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"eP3Jv":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>volume);
var _utils = require("../utils");
function volume(option) {
    return (art)=>({
            ...option,
            mounted: ($control)=>{
                const { proxy, icons } = art;
                const $volume = (0, _utils.append)($control, icons.volume);
                const $close = (0, _utils.append)($control, icons.volumeClose);
                const $panel = (0, _utils.append)($control, '<div class="art-volume-panel"></div>');
                const $inner = (0, _utils.append)($panel, '<div class="art-volume-inner"></div>');
                const $value = (0, _utils.append)($inner, `<div class="art-volume-val"></div>`);
                const $slider = (0, _utils.append)($inner, `<div class="art-volume-slider"></div>`);
                const $handle = (0, _utils.append)($slider, `<div class="art-volume-handle"></div>`);
                const $loaded = (0, _utils.append)($handle, `<div class="art-volume-loaded"></div>`);
                const $indicator = (0, _utils.append)($slider, `<div class="art-volume-indicator"></div>`);
                function getVolumeFromEvent(event) {
                    const { top, height } = (0, _utils.getRect)($slider);
                    return 1 - (event.clientY - top) / height;
                }
                function update() {
                    if (art.muted || art.volume === 0) {
                        (0, _utils.setStyle)($volume, 'display', 'none');
                        (0, _utils.setStyle)($close, 'display', 'flex');
                        (0, _utils.setStyle)($indicator, 'top', '100%');
                        (0, _utils.setStyle)($loaded, 'top', '100%');
                        $value.textContent = 0;
                    } else {
                        const percentage = art.volume * 100;
                        (0, _utils.setStyle)($volume, 'display', 'flex');
                        (0, _utils.setStyle)($close, 'display', 'none');
                        (0, _utils.setStyle)($indicator, 'top', `${100 - percentage}%`);
                        (0, _utils.setStyle)($loaded, 'top', `${100 - percentage}%`);
                        $value.textContent = Math.floor(percentage);
                    }
                }
                update();
                art.on('video:volumechange', update);
                proxy($volume, 'click', ()=>{
                    art.muted = true;
                });
                proxy($close, 'click', ()=>{
                    art.muted = false;
                });
                if (0, _utils.isMobile) (0, _utils.setStyle)($panel, 'display', 'none');
                else {
                    let isDragging = false;
                    proxy($slider, 'mousedown', (event)=>{
                        isDragging = event.button === 0;
                        art.volume = getVolumeFromEvent(event);
                    });
                    art.on('document:mousemove', (event)=>{
                        if (isDragging) {
                            art.muted = false;
                            art.volume = getVolumeFromEvent(event);
                        }
                    });
                    art.on('document:mouseup', ()=>{
                        if (isDragging) isDragging = false;
                    });
                }
            }
        });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"dQzlM":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _clickInit = require("./clickInit");
var _clickInitDefault = parcelHelpers.interopDefault(_clickInit);
var _gestureInit = require("./gestureInit");
var _gestureInitDefault = parcelHelpers.interopDefault(_gestureInit);
var _globalInit = require("./globalInit");
var _globalInitDefault = parcelHelpers.interopDefault(_globalInit);
var _hoverInit = require("./hoverInit");
var _hoverInitDefault = parcelHelpers.interopDefault(_hoverInit);
var _moveInit = require("./moveInit");
var _moveInitDefault = parcelHelpers.interopDefault(_moveInit);
var _resizeInit = require("./resizeInit");
var _resizeInitDefault = parcelHelpers.interopDefault(_resizeInit);
var _updateInit = require("./updateInit");
var _updateInitDefault = parcelHelpers.interopDefault(_updateInit);
var _viewInit = require("./viewInit");
var _viewInitDefault = parcelHelpers.interopDefault(_viewInit);
class Events {
    constructor(art){
        this.destroyEvents = new Set();
        this.proxy = this.proxy.bind(this);
        this.hover = this.hover.bind(this);
        (0, _clickInitDefault.default)(art, this);
        (0, _hoverInitDefault.default)(art, this);
        (0, _moveInitDefault.default)(art, this);
        (0, _resizeInitDefault.default)(art, this);
        (0, _gestureInitDefault.default)(art, this);
        (0, _viewInitDefault.default)(art, this);
        (0, _globalInitDefault.default)(art, this);
        (0, _updateInitDefault.default)(art, this);
    }
    proxy(target, name, callback, option = {}) {
        if (Array.isArray(name)) return name.map((item)=>this.proxy(target, item, callback, option));
        target.addEventListener(name, callback, option);
        const destroy = ()=>target.removeEventListener(name, callback, option);
        this.destroyEvents.add(destroy);
        return destroy;
    }
    hover(target, mouseenter, mouseleave) {
        if (mouseenter) this.proxy(target, 'mouseenter', mouseenter);
        if (mouseleave) this.proxy(target, 'mouseleave', mouseleave);
    }
    remove(destroyEvent) {
        if (this.destroyEvents.has(destroyEvent)) try {
            destroyEvent();
        } catch (error) {
            console.warn('Failed to remove event listener:', error);
        } finally{
            this.destroyEvents.delete(destroyEvent);
        }
    }
    destroy() {
        for (const destroyEvent of this.destroyEvents)try {
            destroyEvent();
        } catch (error) {
            console.warn('Failed to destroy event listener:', error);
        }
        this.destroyEvents.clear();
    }
}
exports.default = Events;

},{"./clickInit":"jci0Q","./gestureInit":"55SCY","./globalInit":"5R6Zc","./hoverInit":"hY9ON","./moveInit":"cJ7iV","./resizeInit":"15qnS","./updateInit":"2iqzD","./viewInit":"lGG7W","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"jci0Q":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>clickInit);
var _utils = require("../utils");
function clickInit(art, events) {
    const { constructor, template: { $player, $video } } = art;
    function onDocumentClick(event) {
        if ((0, _utils.includeFromEvent)(event, $player)) {
            art.isInput = event.target.tagName === 'INPUT';
            art.isFocus = true;
            art.emit('focus', event);
        } else {
            art.isInput = false;
            art.isFocus = false;
            art.emit('blur', event);
        }
    }
    art.on('document:click', onDocumentClick);
    art.on('document:contextmenu', onDocumentClick);
    let clickTimes = [];
    events.proxy($video, 'click', (event)=>{
        const now = Date.now();
        clickTimes.push(now);
        const { MOBILE_CLICK_PLAY, DBCLICK_TIME, MOBILE_DBCLICK_PLAY, DBCLICK_FULLSCREEN } = constructor;
        const clicks = clickTimes.filter((t)=>now - t <= DBCLICK_TIME);
        switch(clicks.length){
            case 1:
                art.emit('click', event);
                if (0, _utils.isMobile) {
                    if (!art.isLock && MOBILE_CLICK_PLAY) art.toggle();
                } else art.toggle();
                clickTimes = clicks;
                break;
            case 2:
                art.emit('dblclick', event);
                if (0, _utils.isMobile) {
                    if (!art.isLock && MOBILE_DBCLICK_PLAY) art.toggle();
                } else if (DBCLICK_FULLSCREEN) art.fullscreen = !art.fullscreen;
                clickTimes = [];
                break;
            default:
                clickTimes = [];
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"55SCY":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>gestureInit);
var _progress = require("../control/progress");
var _utils = require("../utils");
function GetSlideAngle(dx, dy) {
    return Math.atan2(dy, dx) * 180 / Math.PI;
}
function GetSlideDirection(startX, startY, endX, endY) {
    const dy = startY - endY;
    const dx = endX - startX;
    let result = 0;
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return result;
    const angle = GetSlideAngle(dx, dy);
    if (angle >= -45 && angle < 45) result = 4;
    else if (angle >= 45 && angle < 135) result = 1;
    else if (angle >= -135 && angle < -45) result = 2;
    else if (angle >= 135 && angle <= 180 || angle >= -180 && angle < -135) result = 3;
    return result;
}
function gestureInit(art, events) {
    if ((0, _utils.isMobile) && !art.option.isLive) {
        const { $video, $progress } = art.template;
        let touchTarget = null;
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        const onTouchStart = (event)=>{
            if (event.touches.length === 1 && !art.isLock) {
                if (touchTarget === $progress) (0, _progress.setCurrentTime)(art, event);
                isDragging = true;
                const { pageX, pageY } = event.touches[0];
                startX = pageX;
                startY = pageY;
                startTime = art.currentTime;
            }
        };
        const onTouchMove = (event)=>{
            if (event.touches.length === 1 && isDragging && art.duration) {
                const { pageX, pageY } = event.touches[0];
                const direction = GetSlideDirection(startX, startY, pageX, pageY);
                const isHorizontal = [
                    3,
                    4
                ].includes(direction);
                const isVertical = [
                    1,
                    2
                ].includes(direction);
                const isLegal = isHorizontal && !art.isRotate || isVertical && art.isRotate;
                if (isLegal) {
                    const ratioX = (0, _utils.clamp)((pageX - startX) / art.width, -1, 1);
                    const ratioY = (0, _utils.clamp)((pageY - startY) / art.height, -1, 1);
                    const ratio = art.isRotate ? ratioY : ratioX;
                    const TOUCH_MOVE_RATIO = touchTarget === $video ? art.constructor.TOUCH_MOVE_RATIO : 1;
                    const currentTime = (0, _utils.clamp)(startTime + art.duration * ratio * TOUCH_MOVE_RATIO, 0, art.duration);
                    art.seek = currentTime;
                    art.emit('setBar', 'played', (0, _utils.clamp)(currentTime / art.duration, 0, 1), event);
                    art.notice.show = `${(0, _utils.secondToTime)(currentTime)} / ${(0, _utils.secondToTime)(art.duration)}`;
                }
            }
        };
        const onTouchEnd = ()=>{
            if (isDragging) {
                startX = 0;
                startY = 0;
                startTime = 0;
                isDragging = false;
                touchTarget = null;
            }
        };
        if (art.option.gesture) {
            events.proxy($video, 'touchstart', (event)=>{
                touchTarget = $video;
                onTouchStart(event);
            });
            events.proxy($video, 'touchmove', onTouchMove);
        }
        events.proxy($progress, 'touchstart', (event)=>{
            touchTarget = $progress;
            onTouchStart(event);
        });
        events.proxy($progress, 'touchmove', onTouchMove);
        art.on('document:touchend', onTouchEnd);
    }
}

},{"../control/progress":"7uH4F","../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"5R6Zc":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>globalInit);
function globalInit(art, events) {
    const documentEvents = [
        'click',
        'mouseup',
        'keydown',
        'touchend',
        'touchmove',
        'mousemove',
        'pointerup',
        'contextmenu',
        'pointermove',
        'visibilitychange',
        'webkitfullscreenchange'
    ];
    const windowEvents = [
        'resize',
        'scroll',
        'orientationchange'
    ];
    const destroyEvents = [];
    function bindGlobalEvents(source = {}) {
        for(let index = 0; index < destroyEvents.length; index++)events.remove(destroyEvents[index]);
        destroyEvents.length = 0;
        const { $player } = art.template;
        documentEvents.forEach((name)=>{
            const doc = source.document || $player.ownerDocument || document;
            const destroy = events.proxy(doc, name, (event)=>{
                art.emit(`document:${name}`, event);
            });
            destroyEvents.push(destroy);
        });
        windowEvents.forEach((name)=>{
            const win = source.window || $player.ownerDocument?.defaultView || window;
            const destroy = events.proxy(win, name, (event)=>{
                art.emit(`window:${name}`, event);
            });
            destroyEvents.push(destroy);
        });
    }
    bindGlobalEvents();
    events.bindGlobalEvents = bindGlobalEvents;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"hY9ON":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>hoverInit);
var _utils = require("../utils");
function hoverInit(art, events) {
    const { $player } = art.template;
    events.hover($player, (event)=>{
        (0, _utils.addClass)($player, 'art-hover');
        art.emit('hover', true, event);
    }, (event)=>{
        (0, _utils.removeClass)($player, 'art-hover');
        art.emit('hover', false, event);
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"cJ7iV":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>moveInit);
function moveInit(art, events) {
    const { $player } = art.template;
    events.proxy($player, 'mousemove', (event)=>{
        art.emit('mousemove', event);
    });
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"15qnS":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>resizeInit);
var _utils = require("../utils");
function resizeInit(art, events) {
    const { option, constructor } = art;
    art.on('resize', ()=>{
        const { aspectRatio, notice } = art;
        if (art.state === 'standard' && option.autoSize) art.autoSize();
        art.aspectRatio = aspectRatio;
        notice.show = '';
    });
    const resizeFn = (0, _utils.debounce)(()=>art.emit('resize'), constructor.RESIZE_TIME);
    art.on('window:orientationchange', ()=>resizeFn());
    art.on('window:resize', ()=>resizeFn());
    if (screen && screen.orientation && screen.orientation.onchange) events.proxy(screen.orientation, 'change', ()=>resizeFn());
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"2iqzD":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>updateInit);
function updateInit(art) {
    if (art.constructor.USE_RAF) {
        let timer = null;
        (function update() {
            if (art.playing) art.emit('raf');
            if (!art.isDestroy) timer = requestAnimationFrame(update);
        })();
        art.on('destroy', ()=>{
            cancelAnimationFrame(timer);
        });
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"lGG7W":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>viewInit);
var _utils = require("../utils");
function viewInit(art) {
    const { option, constructor, template: { $container } } = art;
    const scrollFn = (0, _utils.throttle)(()=>{
        art.emit('view', (0, _utils.isInViewport)($container, constructor.SCROLL_GAP));
    }, constructor.SCROLL_TIME);
    art.on('window:scroll', ()=>scrollFn());
    art.on('view', (state)=>{
        if (option.autoMini) art.mini = !state;
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"drylQ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
class Hotkey {
    constructor(art){
        this.art = art;
        this.keys = {};
        if (!(0, _utils.isMobile)) this.init();
    }
    init() {
        const { constructor } = this.art;
        if (this.art.option.hotkey) {
            this.add('Escape', ()=>{
                if (this.art.fullscreenWeb) this.art.fullscreenWeb = false;
            });
            this.add('Space', ()=>{
                this.art.toggle();
            });
            this.add('ArrowLeft', ()=>{
                this.art.backward = constructor.SEEK_STEP;
            });
            this.add('ArrowUp', ()=>{
                this.art.volume += constructor.VOLUME_STEP;
            });
            this.add('ArrowRight', ()=>{
                this.art.forward = constructor.SEEK_STEP;
            });
            this.add('ArrowDown', ()=>{
                this.art.volume -= constructor.VOLUME_STEP;
            });
        }
        this.art.on('document:keydown', (event)=>{
            if (this.art.isFocus) {
                const tag = document.activeElement.tagName.toUpperCase();
                const editable = document.activeElement.getAttribute('contenteditable');
                if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true' && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                    const events = this.keys[event.code];
                    if (events) {
                        event.preventDefault();
                        for(let index = 0; index < events.length; index++)events[index].call(this.art, event);
                        this.art.emit('hotkey', event);
                    }
                }
            }
            this.art.emit('keydown', event);
        });
    }
    add(key, event) {
        if (this.keys[key]) {
            if (!this.keys[key].includes(event)) this.keys[key].push(event);
        } else this.keys[key] = [
            event
        ];
        return this;
    }
    remove(key, event) {
        if (this.keys[key]) {
            const index = this.keys[key].indexOf(event);
            if (index !== -1) this.keys[key].splice(index, 1);
            if (this.keys[key].length === 0) delete this.keys[key];
        }
        return this;
    }
}
exports.default = Hotkey;

},{"./utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"3Jf1s":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
var _zhCn = require("./zh-cn");
var _zhCnDefault = parcelHelpers.interopDefault(_zhCn);
class I18n {
    constructor(art){
        this.art = art;
        this.languages = {
            'zh-cn': (0, _zhCnDefault.default)
        };
        this.language = {};
        this.update(art.option.i18n);
    }
    init() {
        const lang = this.art.option.lang.toLowerCase();
        this.language = this.languages[lang] || {};
    }
    get(key) {
        return this.language[key] || key;
    }
    update(value) {
        this.languages = (0, _utils.mergeDeep)(this.languages, value);
        this.init();
    }
}
exports.default = I18n;

},{"../utils":"gGxPm","./zh-cn":"5Zwl9","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"5Zwl9":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const zhCn = {
    'Video Info': "\u7EDF\u8BA1\u4FE1\u606F",
    'Close': "\u5173\u95ED",
    'Video Load Failed': "\u52A0\u8F7D\u5931\u8D25",
    'Volume': "\u97F3\u91CF",
    'Play': "\u64AD\u653E",
    'Pause': "\u6682\u505C",
    'Rate': "\u901F\u5EA6",
    'Mute': "\u9759\u97F3",
    'Video Flip': "\u753B\u9762\u7FFB\u8F6C",
    'Horizontal': "\u6C34\u5E73",
    'Vertical': "\u5782\u76F4",
    'Reconnect': "\u91CD\u65B0\u8FDE\u63A5",
    'Show Setting': "\u663E\u793A\u8BBE\u7F6E",
    'Hide Setting': "\u9690\u85CF\u8BBE\u7F6E",
    'Screenshot': "\u622A\u56FE",
    'Play Speed': "\u64AD\u653E\u901F\u5EA6",
    'Aspect Ratio': "\u753B\u9762\u6BD4\u4F8B",
    'Default': "\u9ED8\u8BA4",
    'Normal': "\u6B63\u5E38",
    'Open': "\u6253\u5F00",
    'Switch Video': "\u5207\u6362",
    'Switch Subtitle': "\u5207\u6362\u5B57\u5E55",
    'Fullscreen': "\u5168\u5C4F",
    'Exit Fullscreen': "\u9000\u51FA\u5168\u5C4F",
    'Web Fullscreen': "\u7F51\u9875\u5168\u5C4F",
    'Exit Web Fullscreen': "\u9000\u51FA\u7F51\u9875\u5168\u5C4F",
    'Mini Player': "\u8FF7\u4F60\u64AD\u653E\u5668",
    'PIP Mode': "\u5F00\u542F\u753B\u4E2D\u753B",
    'Exit PIP Mode': "\u9000\u51FA\u753B\u4E2D\u753B",
    'PIP Not Supported': "\u4E0D\u652F\u6301\u753B\u4E2D\u753B",
    'Fullscreen Not Supported': "\u4E0D\u652F\u6301\u5168\u5C4F",
    'Subtitle Offset': "\u5B57\u5E55\u504F\u79FB",
    'Last Seen': "\u4E0A\u6B21\u770B\u5230",
    'Jump Play': "\u8DF3\u8F6C\u64AD\u653E",
    'AirPlay': "\u9694\u7A7A\u64AD\u653E",
    'AirPlay Not Available': "\u9694\u7A7A\u64AD\u653E\u4E0D\u53EF\u7528"
};
exports.default = zhCn;
if (typeof window !== 'undefined') window['artplayer-i18n-zh-cn'] = zhCn;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"avFu3":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _airplaySvg = require("bundle-text:./airplay.svg");
var _airplaySvgDefault = parcelHelpers.interopDefault(_airplaySvg);
var _arrowLeftSvg = require("bundle-text:./arrow-left.svg");
var _arrowLeftSvgDefault = parcelHelpers.interopDefault(_arrowLeftSvg);
var _arrowRightSvg = require("bundle-text:./arrow-right.svg");
var _arrowRightSvgDefault = parcelHelpers.interopDefault(_arrowRightSvg);
var _aspectRatioSvg = require("bundle-text:./aspect-ratio.svg");
var _aspectRatioSvgDefault = parcelHelpers.interopDefault(_aspectRatioSvg);
var _checkSvg = require("bundle-text:./check.svg");
var _checkSvgDefault = parcelHelpers.interopDefault(_checkSvg);
var _closeSvg = require("bundle-text:./close.svg");
var _closeSvgDefault = parcelHelpers.interopDefault(_closeSvg);
var _configSvg = require("bundle-text:./config.svg");
var _configSvgDefault = parcelHelpers.interopDefault(_configSvg);
var _errorSvg = require("bundle-text:./error.svg");
var _errorSvgDefault = parcelHelpers.interopDefault(_errorSvg);
var _flipSvg = require("bundle-text:./flip.svg");
var _flipSvgDefault = parcelHelpers.interopDefault(_flipSvg);
var _fullscreenOffSvg = require("bundle-text:./fullscreen-off.svg");
var _fullscreenOffSvgDefault = parcelHelpers.interopDefault(_fullscreenOffSvg);
var _fullscreenOnSvg = require("bundle-text:./fullscreen-on.svg");
var _fullscreenOnSvgDefault = parcelHelpers.interopDefault(_fullscreenOnSvg);
var _fullscreenWebOffSvg = require("bundle-text:./fullscreen-web-off.svg");
var _fullscreenWebOffSvgDefault = parcelHelpers.interopDefault(_fullscreenWebOffSvg);
var _fullscreenWebOnSvg = require("bundle-text:./fullscreen-web-on.svg");
var _fullscreenWebOnSvgDefault = parcelHelpers.interopDefault(_fullscreenWebOnSvg);
var _loadingSvg = require("bundle-text:./loading.svg");
var _loadingSvgDefault = parcelHelpers.interopDefault(_loadingSvg);
var _lockSvg = require("bundle-text:./lock.svg");
var _lockSvgDefault = parcelHelpers.interopDefault(_lockSvg);
var _pauseSvg = require("bundle-text:./pause.svg");
var _pauseSvgDefault = parcelHelpers.interopDefault(_pauseSvg);
var _pipSvg = require("bundle-text:./pip.svg");
var _pipSvgDefault = parcelHelpers.interopDefault(_pipSvg);
var _playSvg = require("bundle-text:./play.svg");
var _playSvgDefault = parcelHelpers.interopDefault(_playSvg);
var _playbackRateSvg = require("bundle-text:./playback-rate.svg");
var _playbackRateSvgDefault = parcelHelpers.interopDefault(_playbackRateSvg);
var _screenshotSvg = require("bundle-text:./screenshot.svg");
var _screenshotSvgDefault = parcelHelpers.interopDefault(_screenshotSvg);
var _settingSvg = require("bundle-text:./setting.svg");
var _settingSvgDefault = parcelHelpers.interopDefault(_settingSvg);
var _stateSvg = require("bundle-text:./state.svg");
var _stateSvgDefault = parcelHelpers.interopDefault(_stateSvg);
var _switchOffSvg = require("bundle-text:./switch-off.svg");
var _switchOffSvgDefault = parcelHelpers.interopDefault(_switchOffSvg);
var _switchOnSvg = require("bundle-text:./switch-on.svg");
var _switchOnSvgDefault = parcelHelpers.interopDefault(_switchOnSvg);
var _unlockSvg = require("bundle-text:./unlock.svg");
var _unlockSvgDefault = parcelHelpers.interopDefault(_unlockSvg);
var _volumeCloseSvg = require("bundle-text:./volume-close.svg");
var _volumeCloseSvgDefault = parcelHelpers.interopDefault(_volumeCloseSvg);
var _volumeSvg = require("bundle-text:./volume.svg");
var _volumeSvgDefault = parcelHelpers.interopDefault(_volumeSvg);
var _utils = require("../utils");
class Icons {
    constructor(art){
        const icons = {
            loading: (0, _loadingSvgDefault.default),
            state: (0, _stateSvgDefault.default),
            play: (0, _playSvgDefault.default),
            pause: (0, _pauseSvgDefault.default),
            check: (0, _checkSvgDefault.default),
            volume: (0, _volumeSvgDefault.default),
            volumeClose: (0, _volumeCloseSvgDefault.default),
            screenshot: (0, _screenshotSvgDefault.default),
            setting: (0, _settingSvgDefault.default),
            pip: (0, _pipSvgDefault.default),
            arrowLeft: (0, _arrowLeftSvgDefault.default),
            arrowRight: (0, _arrowRightSvgDefault.default),
            playbackRate: (0, _playbackRateSvgDefault.default),
            aspectRatio: (0, _aspectRatioSvgDefault.default),
            config: (0, _configSvgDefault.default),
            lock: (0, _lockSvgDefault.default),
            flip: (0, _flipSvgDefault.default),
            unlock: (0, _unlockSvgDefault.default),
            fullscreenOff: (0, _fullscreenOffSvgDefault.default),
            fullscreenOn: (0, _fullscreenOnSvgDefault.default),
            fullscreenWebOff: (0, _fullscreenWebOffSvgDefault.default),
            fullscreenWebOn: (0, _fullscreenWebOnSvgDefault.default),
            switchOn: (0, _switchOnSvgDefault.default),
            switchOff: (0, _switchOffSvgDefault.default),
            error: (0, _errorSvgDefault.default),
            close: (0, _closeSvgDefault.default),
            airplay: (0, _airplaySvgDefault.default),
            ...art.option.icons
        };
        for(const key in icons)(0, _utils.def)(this, key, {
            get: ()=>(0, _utils.getIcon)(key, icons[key])
        });
    }
}
exports.default = Icons;

},{"bundle-text:./airplay.svg":"gtvwT","bundle-text:./arrow-left.svg":"lcTQw","bundle-text:./arrow-right.svg":"gFlrD","bundle-text:./aspect-ratio.svg":"jEt3d","bundle-text:./check.svg":"aiplG","bundle-text:./close.svg":"5K1Ys","bundle-text:./config.svg":"e5yY6","bundle-text:./error.svg":"85f9B","bundle-text:./flip.svg":"k6eqp","bundle-text:./fullscreen-off.svg":"abDO6","bundle-text:./fullscreen-on.svg":"053Ce","bundle-text:./fullscreen-web-off.svg":"6YHfk","bundle-text:./fullscreen-web-on.svg":"iUjB4","bundle-text:./loading.svg":"a8tLL","bundle-text:./lock.svg":"KAFOJ","bundle-text:./pause.svg":"J3in3","bundle-text:./pip.svg":"bf3DE","bundle-text:./play.svg":"beYr7","bundle-text:./playback-rate.svg":"j3gVX","bundle-text:./screenshot.svg":"8LOBK","bundle-text:./setting.svg":"8Yj97","bundle-text:./state.svg":"3saNl","bundle-text:./switch-off.svg":"5Q8fg","bundle-text:./switch-on.svg":"90Mh0","bundle-text:./unlock.svg":"gxaqy","bundle-text:./volume-close.svg":"6JUKA","bundle-text:./volume.svg":"ukTSv","../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"gtvwT":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18px\" height=\"18px\" viewBox=\"0 0 18 18\">\n    <g>\n        <path d=\"M16,1 L2,1 C1.447,1 1,1.447 1,2 L1,12 C1,12.553 1.447,13 2,13 L5,13 L5,11 L3,11 L3,3 L15,3 L15,11 L13,11 L13,13 L16,13 C16.553,13 17,12.553 17,12 L17,2 C17,1.447 16.553,1 16,1 L16,1 Z\"/>\n        <polygon points=\"4 17 14 17 9 11\"/>\n    </g>\n</svg>";

},{}],"lcTQw":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"32\" width=\"32\" version=\"1.1\" viewBox=\"0 0 32 32\">\n    <path d=\"M 19.41,20.09 14.83,15.5 19.41,10.91 18,9.5 l -6,6 6,6 z\"/>\n</svg>";

},{}],"gFlrD":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"32\" width=\"32\" version=\"1.1\" viewBox=\"0 0 32 32\">\n    <path d=\"m 12.59,20.34 4.58,-4.59 -4.58,-4.59 1.41,-1.41 6,6 -6,6 z\"/>\n</svg>";

},{}],"jEt3d":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 88 88\" preserveAspectRatio=\"xMidYMid meet\" style=\"width: 100%; height: 100%; transform: translate3d(0, 0, 0)\"><defs><clipPath id=\"__lottie_element_216\"><rect width=\"88\" height=\"88\" x=\"0\" y=\"0\"/></clipPath></defs><g clip-path=\"url(#__lottie_element_216)\"><g transform=\"matrix(1,0,0,1,44,44)\" opacity=\"1\" style=\"display: block\"><g opacity=\"1\" transform=\"matrix(1,0,0,1,0,0)\"><path fill-opacity=\"1\" d=\" M12.437999725341797,-12.70199966430664 C12.437999725341797,-12.70199966430664 9.618000030517578,-9.881999969482422 9.618000030517578,-9.881999969482422 C8.82800006866455,-9.092000007629395 8.82800006866455,-7.831999778747559 9.618000030517578,-7.052000045776367 C9.618000030517578,-7.052000045776367 16.687999725341797,0.017999999225139618 16.687999725341797,0.017999999225139618 C16.687999725341797,0.017999999225139618 9.618000030517578,7.0879998207092285 9.618000030517578,7.0879998207092285 C8.82800006866455,7.877999782562256 8.82800006866455,9.137999534606934 9.618000030517578,9.918000221252441 C9.618000030517578,9.918000221252441 12.437999725341797,12.748000144958496 12.437999725341797,12.748000144958496 C13.227999687194824,13.527999877929688 14.48799991607666,13.527999877929688 15.267999649047852,12.748000144958496 C15.267999649047852,12.748000144958496 26.58799934387207,1.437999963760376 26.58799934387207,1.437999963760376 C27.368000030517578,0.6579999923706055 27.368000030517578,-0.6119999885559082 26.58799934387207,-1.3919999599456787 C26.58799934387207,-1.3919999599456787 15.267999649047852,-12.70199966430664 15.267999649047852,-12.70199966430664 C14.48799991607666,-13.491999626159668 13.227999687194824,-13.491999626159668 12.437999725341797,-12.70199966430664z M-12.442000389099121,-12.70199966430664 C-13.182000160217285,-13.442000389099121 -14.362000465393066,-13.482000350952148 -15.142000198364258,-12.821999549865723 C-15.142000198364258,-12.821999549865723 -15.272000312805176,-12.70199966430664 -15.272000312805176,-12.70199966430664 C-15.272000312805176,-12.70199966430664 -26.582000732421875,-1.3919999599456787 -26.582000732421875,-1.3919999599456787 C-27.32200050354004,-0.6520000100135803 -27.36199951171875,0.5180000066757202 -26.70199966430664,1.3079999685287476 C-26.70199966430664,1.3079999685287476 -26.582000732421875,1.437999963760376 -26.582000732421875,1.437999963760376 C-26.582000732421875,1.437999963760376 -15.272000312805176,12.748000144958496 -15.272000312805176,12.748000144958496 C-14.531999588012695,13.48799991607666 -13.362000465393066,13.527999877929688 -12.571999549865723,12.868000030517578 C-12.571999549865723,12.868000030517578 -12.442000389099121,12.748000144958496 -12.442000389099121,12.748000144958496 C-12.442000389099121,12.748000144958496 -9.612000465393066,9.918000221252441 -9.612000465393066,9.918000221252441 C-8.871999740600586,9.178000450134277 -8.831999778747559,8.008000373840332 -9.501999855041504,7.2179999351501465 C-9.501999855041504,7.2179999351501465 -9.612000465393066,7.0879998207092285 -9.612000465393066,7.0879998207092285 C-9.612000465393066,7.0879998207092285 -16.68199920654297,0.017999999225139618 -16.68199920654297,0.017999999225139618 C-16.68199920654297,0.017999999225139618 -9.612000465393066,-7.052000045776367 -9.612000465393066,-7.052000045776367 C-8.871999740600586,-7.791999816894531 -8.831999778747559,-8.961999893188477 -9.501999855041504,-9.751999855041504 C-9.501999855041504,-9.751999855041504 -9.612000465393066,-9.881999969482422 -9.612000465393066,-9.881999969482422 C-9.612000465393066,-9.881999969482422 -12.442000389099121,-12.70199966430664 -12.442000389099121,-12.70199966430664z M28,-28 C32.41999816894531,-28 36,-24.420000076293945 36,-20 C36,-20 36,20 36,20 C36,24.420000076293945 32.41999816894531,28 28,28 C28,28 -28,28 -28,28 C-32.41999816894531,28 -36,24.420000076293945 -36,20 C-36,20 -36,-20 -36,-20 C-36,-24.420000076293945 -32.41999816894531,-28 -28,-28 C-28,-28 28,-28 28,-28z\" data-darkreader-inline-fill=\"\" style=\"--darkreader-inline-fill: #a8a6a4\"/></g></g></g></svg>";

},{}],"aiplG":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 24 24\" style=\"width: 100%; height: 100%\">\n<path d=\"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z\"/>\n</svg>";

},{}],"5K1Ys":[function(require,module,exports,__globalThis) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" t=\"1655876154826\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" width=\"22\" height=\"22\">\n<path d=\"M571.733333 512l268.8-268.8c17.066667-17.066667 17.066667-42.666667 0-59.733333-17.066667-17.066667-42.666667-17.066667-59.733333 0L512 452.266667 243.2 183.466667c-17.066667-17.066667-42.666667-17.066667-59.733333 0-17.066667 17.066667-17.066667 42.666667 0 59.733333L452.266667 512 183.466667 780.8c-17.066667 17.066667-17.066667 42.666667 0 59.733333 8.533333 8.533333 19.2 12.8 29.866666 12.8s21.333333-4.266667 29.866667-12.8L512 571.733333l268.8 268.8c8.533333 8.533333 19.2 12.8 29.866667 12.8s21.333333-4.266667 29.866666-12.8c17.066667-17.066667 17.066667-42.666667 0-59.733333L571.733333 512z\" p-id=\"2131\">\n</path>\n</svg>";

},{}],"e5yY6":[function(require,module,exports,__globalThis) {
module.exports = "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M15,17h6v1h-6V17z M11,17H3v1h8v2h1v-2v-1v-2h-1V17z M14,8h1V6V5V3h-1v2H3v1h11V8z            M18,5v1h3V5H18z M6,14h1v-2v-1V9H6v2H3v1 h3V14z M10,12h11v-1H10V12z\" data-darkreader-inline-fill=\"\" style=\"--darkreader-inline-fill: #a8a6a4\"/></svg>";

},{}],"85f9B":[function(require,module,exports,__globalThis) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" t=\"1652850026663\" viewBox=\"0 0 1024 1024\" version=\"1.1\" p-id=\"2749\" width=\"50\" height=\"50\">\n<path d=\"M593.8176 168.5504l356.00384 595.21024c26.15296 43.74528 10.73152 99.7376-34.44736 125.05088-14.39744 8.06912-30.72 12.30848-47.37024 12.30848H155.97568C103.75168 901.12 61.44 860.16 61.44 809.61536c0-16.09728 4.38272-31.92832 12.71808-45.8752L430.16192 168.5504c26.17344-43.7248 84.00896-58.65472 129.20832-33.34144a93.0816 93.0816 0 0 1 34.44736 33.34144zM512 819.2a61.44 61.44 0 1 0 0-122.88 61.44 61.44 0 0 0 0 122.88z m0-512a72.31488 72.31488 0 0 0-71.76192 81.3056l25.72288 205.7216a46.40768 46.40768 0 0 0 92.07808 0l25.72288-205.74208A72.31488 72.31488 0 0 0 512 307.2z\" p-id=\"2750\">\n</path>\n</svg>";

},{}],"k6eqp":[function(require,module,exports,__globalThis) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" t=\"1652445277062\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" width=\"24\" height=\"24\">\n<path d=\"M554.666667 810.666667v85.333333h-85.333334v-85.333333h85.333334zM170.666667 178.005333a42.666667 42.666667 0 0 1 34.986666 18.218667l203.904 291.328a42.666667 42.666667 0 0 1 0 48.896l-203.946666 291.328A42.666667 42.666667 0 0 1 128 803.328V220.672a42.666667 42.666667 0 0 1 42.666667-42.666667z m682.666666 0a42.666667 42.666667 0 0 1 42.368 37.717334l0.298667 4.949333v582.656a42.666667 42.666667 0 0 1-74.24 28.629333l-3.413333-4.181333-203.904-291.328a42.666667 42.666667 0 0 1-3.029334-43.861333l3.029334-5.034667 203.946666-291.328A42.666667 42.666667 0 0 1 853.333333 178.005333zM554.666667 640v85.333333h-85.333334v-85.333333h85.333334zM196.266667 319.104V716.8L335.957333 512 196.309333 319.104zM554.666667 469.333333v85.333334h-85.333334v-85.333334h85.333334z m0-170.666666v85.333333h-85.333334V298.666667h85.333334z m0-170.666667v85.333333h-85.333334V128h85.333334z\">\n</path>\n</svg>";

},{}],"abDO6":[function(require,module,exports,__globalThis) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon\" width=\"22\" height=\"22\" viewBox=\"0 0 1024 1024\" version=\"1.1\">\n<path d=\"M768 298.666667h170.666667v85.333333h-256V128h85.333333v170.666667zM341.333333 384H85.333333V298.666667h170.666667V128h85.333333v256z m426.666667 341.333333v170.666667h-85.333333v-256h256v85.333333h-170.666667zM341.333333 640v256H256v-170.666667H85.333333v-85.333333h256z\"/>\n</svg>";

},{}],"053Ce":[function(require,module,exports,__globalThis) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon\" width=\"22\" height=\"22\" viewBox=\"0 0 1024 1024\" version=\"1.1\">\n<path d=\"M625.777778 256h142.222222V398.222222h113.777778V142.222222H625.777778v113.777778zM256 398.222222V256H398.222222v-113.777778H142.222222V398.222222h113.777778zM768 625.777778v142.222222H625.777778v113.777778h256V625.777778h-113.777778zM398.222222 768H256V625.777778h-113.777778v256H398.222222v-113.777778z\"/>\n</svg>";

},{}],"6YHfk":[function(require,module,exports,__globalThis) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon\" width=\"18\" height=\"18\" viewBox=\"0 0 1152 1024\" version=\"1.1\">\n<path d=\"M1075.2 0H76.8A76.8 76.8 0 0 0 0 76.8v870.4A76.8 76.8 0 0 0 76.8 1024h998.4a76.8 76.8 0 0 0 76.8-76.8V76.8A76.8 76.8 0 0 0 1075.2 0zM1024 128v768H128V128h896zM896 512a64 64 0 0 1 7.488 127.552L896 640h-128v128a64 64 0 0 1-56.512 63.552L704 832a64 64 0 0 1-63.552-56.512L640 768V582.592c0-34.496 25.024-66.112 61.632-70.208L709.632 512H896zM256 512a64 64 0 0 1-7.488-127.552L256 384h128V256a64 64 0 0 1 56.512-63.552L448 192a64 64 0 0 1 63.552 56.512L512 256v185.408c0 34.432-25.024 66.112-61.632 70.144L442.368 512H256z\"/>\n</svg>";

},{}],"iUjB4":[function(require,module,exports,__globalThis) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon\" width=\"18\" height=\"18\" viewBox=\"0 0 1152 1024\" version=\"1.1\">\n<path d=\"M1075.2 0H76.8A76.8 76.8 0 0 0 0 76.8v870.4A76.8 76.8 0 0 0 76.8 1024h998.4a76.8 76.8 0 0 0 76.8-76.8V76.8A76.8 76.8 0 0 0 1075.2 0zM1024 128v768H128V128h896zM448 192a64 64 0 0 1 7.488 127.552L448 320H320v128a64 64 0 0 1-56.512 63.552L256 512a64 64 0 0 1-63.552-56.512L192 448V262.592c0-34.432 25.024-66.112 61.632-70.144L261.632 192H448zM704 832a64 64 0 0 1-7.488-127.552L704 704h128V576a64 64 0 0 1 56.512-63.552L896 512a64 64 0 0 1 63.552 56.512L960 576v185.408c0 34.496-25.024 66.112-61.632 70.208l-8 0.384H704z\"/>\n</svg>";

},{}],"a8tLL":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50px\" height=\"50px\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" class=\"uil-default\">\n  <rect x=\"0\" y=\"0\" width=\"100\" height=\"100\" fill=\"none\" class=\"bk\"/>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" transform=\"rotate(0 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-1s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" transform=\"rotate(30 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.9166666666666666s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" transform=\"rotate(60 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.8333333333333334s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" transform=\"rotate(90 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.75s\" repeatCount=\"indefinite\"/></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" transform=\"rotate(120 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.6666666666666666s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" transform=\"rotate(150 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.5833333333333334s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" transform=\"rotate(180 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.5s\" repeatCount=\"indefinite\"/></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" transform=\"rotate(210 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.4166666666666667s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" transform=\"rotate(240 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.3333333333333333s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" transform=\"rotate(270 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.25s\" repeatCount=\"indefinite\"/></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" transform=\"rotate(300 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.16666666666666666s\" repeatCount=\"indefinite\"/>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" transform=\"rotate(330 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.08333333333333333s\" repeatCount=\"indefinite\"/>\n  </rect>\n</svg>";

},{}],"KAFOJ":[function(require,module,exports,__globalThis) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" t=\"1650612139149\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" width=\"20\" height=\"20\">\n<path d=\"M298.666667 426.666667V341.333333a213.333333 213.333333 0 1 1 426.666666 0v85.333334h42.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667z m213.333333-213.333334a128 128 0 0 0-128 128v85.333334h256V341.333333a128 128 0 0 0-128-128z\"/>\n</svg>";

},{}],"J3in3":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zM15 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2z\"/>\n</svg>";

},{}],"bf3DE":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1024 1024\" width=\"22\" height=\"22\">\n<path d=\"M844.8 219.648h-665.6c-6.144 0-10.24 4.608-10.24 10.752v563.2c0 5.632 4.096 10.24 10.24 10.24h256v92.16h-256a102.4 102.4 0 0 1-102.4-102.4v-563.2c0-56.832 45.568-102.4 102.4-102.4h665.6a102.4 102.4 0 0 1 102.4 102.4v204.8h-92.16v-204.8c0-6.144-4.608-10.752-10.24-10.752zM614.4 588.8c-28.672 0-51.2 22.528-51.2 51.2v204.8c0 28.16 22.528 51.2 51.2 51.2h281.6c28.16 0 51.2-23.04 51.2-51.2v-204.8c0-28.672-23.04-51.2-51.2-51.2H614.4z\"/>\n</svg>";

},{}],"beYr7":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n  <path d=\"M17.982 9.275L8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45z\"/>\n</svg>";

},{}],"j3gVX":[function(require,module,exports,__globalThis) {
module.exports = "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z            M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z            M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z            M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z            M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z\" data-darkreader-inline-fill=\"\" style=\"--darkreader-inline-fill: #a8a6a4\"/></svg>";

},{}],"8LOBK":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 50 50\">\n\t<path d=\"M 19.402344 6 C 17.019531 6 14.96875 7.679688 14.5 10.011719 L 14.097656 12 L 9 12 C 6.238281 12 4 14.238281 4 17 L 4 38 C 4 40.761719 6.238281 43 9 43 L 41 43 C 43.761719 43 46 40.761719 46 38 L 46 17 C 46 14.238281 43.761719 12 41 12 L 35.902344 12 L 35.5 10.011719 C 35.03125 7.679688 32.980469 6 30.597656 6 Z M 25 17 C 30.519531 17 35 21.480469 35 27 C 35 32.519531 30.519531 37 25 37 C 19.480469 37 15 32.519531 15 27 C 15 21.480469 19.480469 17 25 17 Z M 25 19 C 20.589844 19 17 22.589844 17 27 C 17 31.410156 20.589844 35 25 35 C 29.410156 35 33 31.410156 33 27 C 33 22.589844 29.410156 19 25 19 Z \"/>\n</svg>";

},{}],"8Yj97":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <circle cx=\"11\" cy=\"11\" r=\"2\"/>\n    <path d=\"M19.164 8.861L17.6 8.6a6.978 6.978 0 0 0-1.186-2.099l.574-1.533a1 1 0 0 0-.436-1.217l-1.997-1.153a1.001 1.001 0 0 0-1.272.23l-1.008 1.225a7.04 7.04 0 0 0-2.55.001L8.716 2.829a1 1 0 0 0-1.272-.23L5.447 3.751a1 1 0 0 0-.436 1.217l.574 1.533A6.997 6.997 0 0 0 4.4 8.6l-1.564.261A.999.999 0 0 0 2 9.847v2.306c0 .489.353.906.836.986l1.613.269a7 7 0 0 0 1.228 2.075l-.558 1.487a1 1 0 0 0 .436 1.217l1.997 1.153c.423.244.961.147 1.272-.23l1.04-1.263a7.089 7.089 0 0 0 2.272 0l1.04 1.263a1 1 0 0 0 1.272.23l1.997-1.153a1 1 0 0 0 .436-1.217l-.557-1.487c.521-.61.94-1.31 1.228-2.075l1.613-.269a.999.999 0 0 0 .835-.986V9.847a.999.999 0 0 0-.836-.986zM11 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z\"/>\n</svg>";

},{}],"3saNl":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\" viewBox=\"0 0 24 24\">\n<path d=\"M9.5 9.325v5.35q0 .575.525.875t1.025-.05l4.15-2.65q.475-.3.475-.85t-.475-.85L11.05 8.5q-.5-.35-1.025-.05t-.525.875ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z\"/>\n</svg>";

},{}],"5Q8fg":[function(require,module,exports,__globalThis) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon\" width=\"26\" height=\"26\" viewBox=\"0 0 1740 1024\" version=\"1.1\">\n    <path d=\"M511.8976 1024h670.5152c282.4192-0.4096 511.1808-229.4784 511.1808-511.8976 0-282.4192-228.7616-511.488-511.1808-511.8976H511.8976C229.4784 0.6144 0.7168 229.6832 0.7168 512.1024c0 282.4192 228.7616 511.488 511.1808 511.8976zM511.3344 48.64A464.5888 464.5888 0 1 1 48.0256 513.024 463.872 463.872 0 0 1 511.3344 48.4352V48.64z\"/>\n</svg>";

},{}],"90Mh0":[function(require,module,exports,__globalThis) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon\" width=\"26\" height=\"26\" viewBox=\"0 0 1664 1024\" version=\"1.1\">\n    <path fill=\"#648FFC\" d=\"M1152 0H512a512 512 0 0 0 0 1024h640a512 512 0 0 0 0-1024z m0 960a448 448 0 1 1 448-448 448 448 0 0 1-448 448z\"/>\n</svg>";

},{}],"gxaqy":[function(require,module,exports,__globalThis) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" t=\"1650612464266\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" width=\"20\" height=\"20\"><path d=\"M666.752 194.517333L617.386667 268.629333A128 128 0 0 0 384 341.333333l0.042667 85.333334h384a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667V341.333333a213.333333 213.333333 0 0 1 368.085333-146.816z\"/></svg>";

},{}],"6JUKA":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z\"/>\n    <path d=\"M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z\"/>\n</svg>";

},{}],"ukTSv":[function(require,module,exports,__globalThis) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M10.188 4.65L6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z\"/>\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z\"/>\n</svg>";

},{}],"gvEup":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
var _component = require("./utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
class Info extends (0, _componentDefault.default) {
    constructor(art){
        super(art);
        this.name = 'info';
        if (!(0, _utils.isMobile)) this.init();
    }
    init() {
        const { proxy, constructor, template: { $infoPanel, $infoClose, $video } } = this.art;
        proxy($infoClose, 'click', ()=>{
            this.show = false;
        });
        let timer = null;
        const $types = (0, _utils.queryAll)('[data-video]', $infoPanel) || [];
        this.art.on('destroy', ()=>clearTimeout(timer));
        function loop() {
            for(let index = 0; index < $types.length; index++){
                const item = $types[index];
                const value = $video[item.dataset.video];
                const textContent = typeof value === 'number' ? value.toFixed(2) : value;
                if (item.textContent !== textContent) item.textContent = textContent;
            }
            timer = setTimeout(loop, constructor.INFO_LOOP_TIME);
        }
        loop();
    }
}
exports.default = Info;

},{"./utils":"gGxPm","./utils/component":"1wQH1","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"7Oas9":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _component = require("./utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
class Layer extends (0, _componentDefault.default) {
    constructor(art){
        super(art);
        const { option, template: { $layer } } = art;
        this.name = 'layer';
        this.$parent = $layer;
        for(let index = 0; index < option.layers.length; index++)this.add(option.layers[index]);
    }
}
exports.default = Layer;

},{"./utils/component":"1wQH1","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"glZdQ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
var _component = require("./utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
class Loading extends (0, _componentDefault.default) {
    constructor(art){
        super(art);
        this.name = 'loading';
        (0, _utils.append)(art.template.$loading, art.icons.loading);
    }
}
exports.default = Loading;

},{"./utils":"gGxPm","./utils/component":"1wQH1","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"iGxU6":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
var _component = require("./utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
class Mask extends (0, _componentDefault.default) {
    constructor(art){
        super(art);
        this.name = 'mask';
        const { template, icons, events } = art;
        const $state = (0, _utils.append)(template.$state, icons.state);
        const $error = (0, _utils.append)(template.$state, icons.error);
        (0, _utils.setStyle)($error, 'display', 'none');
        art.on('destroy', ()=>{
            (0, _utils.setStyle)($state, 'display', 'none');
            (0, _utils.setStyle)($error, 'display', null);
        });
        events.proxy(template.$state, 'click', ()=>art.play());
    }
}
exports.default = Mask;

},{"./utils":"gGxPm","./utils/component":"1wQH1","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"jZEIz":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
class Notice {
    constructor(art){
        this.art = art;
        this.timer = null;
        art.on('destroy', ()=>this.destroy());
    }
    destroy() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
    set show(msg) {
        const { constructor, template: { $player, $noticeInner } } = this.art;
        if (msg) {
            $noticeInner.textContent = msg instanceof Error ? msg.message.trim() : msg;
            (0, _utils.addClass)($player, 'art-notice-show');
            clearTimeout(this.timer);
            this.timer = setTimeout(()=>{
                $noticeInner.textContent = '';
                (0, _utils.removeClass)($player, 'art-notice-show');
            }, constructor.NOTICE_TIME);
        } else (0, _utils.removeClass)($player, 'art-notice-show');
    }
    get show() {
        const { template: { $player } } = this.art;
        return $player.classList.contains('art-notice-show');
    }
}
exports.default = Notice;

},{"./utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"iA4EC":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _airplayMix = require("./airplayMix");
var _airplayMixDefault = parcelHelpers.interopDefault(_airplayMix);
var _aspectRatioMix = require("./aspectRatioMix");
var _aspectRatioMixDefault = parcelHelpers.interopDefault(_aspectRatioMix);
var _attrMix = require("./attrMix");
var _attrMixDefault = parcelHelpers.interopDefault(_attrMix);
var _autoHeightMix = require("./autoHeightMix");
var _autoHeightMixDefault = parcelHelpers.interopDefault(_autoHeightMix);
var _autoSizeMix = require("./autoSizeMix");
var _autoSizeMixDefault = parcelHelpers.interopDefault(_autoSizeMix);
var _cssVarMix = require("./cssVarMix");
var _cssVarMixDefault = parcelHelpers.interopDefault(_cssVarMix);
var _currentTimeMix = require("./currentTimeMix");
var _currentTimeMixDefault = parcelHelpers.interopDefault(_currentTimeMix);
var _durationMix = require("./durationMix");
var _durationMixDefault = parcelHelpers.interopDefault(_durationMix);
var _eventInit = require("./eventInit");
var _eventInitDefault = parcelHelpers.interopDefault(_eventInit);
var _flipMix = require("./flipMix");
var _flipMixDefault = parcelHelpers.interopDefault(_flipMix);
var _fullscreenMix = require("./fullscreenMix");
var _fullscreenMixDefault = parcelHelpers.interopDefault(_fullscreenMix);
var _fullscreenWebMix = require("./fullscreenWebMix");
var _fullscreenWebMixDefault = parcelHelpers.interopDefault(_fullscreenWebMix);
var _loadedMix = require("./loadedMix");
var _loadedMixDefault = parcelHelpers.interopDefault(_loadedMix);
var _miniMix = require("./miniMix");
var _miniMixDefault = parcelHelpers.interopDefault(_miniMix);
var _optionInit = require("./optionInit");
var _optionInitDefault = parcelHelpers.interopDefault(_optionInit);
var _pauseMix = require("./pauseMix");
var _pauseMixDefault = parcelHelpers.interopDefault(_pauseMix);
var _pipMix = require("./pipMix");
var _pipMixDefault = parcelHelpers.interopDefault(_pipMix);
var _playbackRateMix = require("./playbackRateMix");
var _playbackRateMixDefault = parcelHelpers.interopDefault(_playbackRateMix);
var _playedMix = require("./playedMix");
var _playedMixDefault = parcelHelpers.interopDefault(_playedMix);
var _playingMix = require("./playingMix");
var _playingMixDefault = parcelHelpers.interopDefault(_playingMix);
var _playMix = require("./playMix");
var _playMixDefault = parcelHelpers.interopDefault(_playMix);
var _posterMix = require("./posterMix");
var _posterMixDefault = parcelHelpers.interopDefault(_posterMix);
var _qualityMix = require("./qualityMix");
var _qualityMixDefault = parcelHelpers.interopDefault(_qualityMix);
var _rectMix = require("./rectMix");
var _rectMixDefault = parcelHelpers.interopDefault(_rectMix);
var _screenshotMix = require("./screenshotMix");
var _screenshotMixDefault = parcelHelpers.interopDefault(_screenshotMix);
var _seekMix = require("./seekMix");
var _seekMixDefault = parcelHelpers.interopDefault(_seekMix);
var _stateMix = require("./stateMix");
var _stateMixDefault = parcelHelpers.interopDefault(_stateMix);
var _subtitleOffsetMix = require("./subtitleOffsetMix");
var _subtitleOffsetMixDefault = parcelHelpers.interopDefault(_subtitleOffsetMix);
var _switchMix = require("./switchMix");
var _switchMixDefault = parcelHelpers.interopDefault(_switchMix);
var _themeMix = require("./themeMix");
var _themeMixDefault = parcelHelpers.interopDefault(_themeMix);
var _thumbnailsMix = require("./thumbnailsMix");
var _thumbnailsMixDefault = parcelHelpers.interopDefault(_thumbnailsMix);
var _toggleMix = require("./toggleMix");
var _toggleMixDefault = parcelHelpers.interopDefault(_toggleMix);
var _typeMix = require("./typeMix");
var _typeMixDefault = parcelHelpers.interopDefault(_typeMix);
var _urlMix = require("./urlMix");
var _urlMixDefault = parcelHelpers.interopDefault(_urlMix);
var _volumeMix = require("./volumeMix");
var _volumeMixDefault = parcelHelpers.interopDefault(_volumeMix);
class Player {
    constructor(art){
        (0, _urlMixDefault.default)(art);
        (0, _attrMixDefault.default)(art);
        (0, _playMixDefault.default)(art);
        (0, _pauseMixDefault.default)(art);
        (0, _toggleMixDefault.default)(art);
        (0, _seekMixDefault.default)(art);
        (0, _volumeMixDefault.default)(art);
        (0, _currentTimeMixDefault.default)(art);
        (0, _durationMixDefault.default)(art);
        (0, _switchMixDefault.default)(art);
        (0, _playbackRateMixDefault.default)(art);
        (0, _aspectRatioMixDefault.default)(art);
        (0, _screenshotMixDefault.default)(art);
        (0, _fullscreenMixDefault.default)(art);
        (0, _fullscreenWebMixDefault.default)(art);
        (0, _pipMixDefault.default)(art);
        (0, _loadedMixDefault.default)(art);
        (0, _playedMixDefault.default)(art);
        (0, _playingMixDefault.default)(art);
        (0, _autoSizeMixDefault.default)(art);
        (0, _rectMixDefault.default)(art);
        (0, _flipMixDefault.default)(art);
        (0, _miniMixDefault.default)(art);
        (0, _posterMixDefault.default)(art);
        (0, _autoHeightMixDefault.default)(art);
        (0, _cssVarMixDefault.default)(art);
        (0, _themeMixDefault.default)(art);
        (0, _typeMixDefault.default)(art);
        (0, _stateMixDefault.default)(art);
        (0, _subtitleOffsetMixDefault.default)(art);
        (0, _airplayMixDefault.default)(art);
        (0, _qualityMixDefault.default)(art);
        (0, _thumbnailsMixDefault.default)(art);
        (0, _eventInitDefault.default)(art);
        (0, _optionInitDefault.default)(art);
    }
}
exports.default = Player;

},{"./airplayMix":"2xawd","./aspectRatioMix":"3f0n5","./attrMix":"bI9nt","./autoHeightMix":"5MwjN","./autoSizeMix":"cbo97","./cssVarMix":"awlhX","./currentTimeMix":"1nPI2","./durationMix":"gKWyP","./eventInit":"8E0KF","./flipMix":"9KwcF","./fullscreenMix":"bdfra","./fullscreenWebMix":"3ug77","./loadedMix":"lmx0A","./miniMix":"5xcsH","./optionInit":"2TEf9","./pauseMix":"j7SoA","./pipMix":"iz9Aq","./playbackRateMix":"b6rDz","./playedMix":"CTEqN","./playingMix":"jMFse","./playMix":"lsQBb","./posterMix":"iVqmF","./qualityMix":"2gM0L","./rectMix":"iR6EQ","./screenshotMix":"kwHom","./seekMix":"aOXnw","./stateMix":"ls3ui","./subtitleOffsetMix":"exULR","./switchMix":"fhErJ","./themeMix":"61Zjc","./thumbnailsMix":"1gQEa","./toggleMix":"gt5Qh","./typeMix":"gtfHf","./urlMix":"esLaT","./volumeMix":"fIzu0","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"2xawd":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>airplayMix);
var _utils = require("../utils");
function airplayMix(art) {
    const { i18n, notice, proxy, template: { $video } } = art;
    let available = true;
    if (window.WebKitPlaybackTargetAvailabilityEvent && $video.webkitShowPlaybackTargetPicker) proxy($video, 'webkitplaybacktargetavailabilitychanged', (event)=>{
        switch(event.availability){
            case 'available':
                available = true;
                break;
            case 'not-available':
                available = false;
                break;
        }
    });
    else available = false;
    (0, _utils.def)(art, 'airplay', {
        value () {
            if (available) {
                $video.webkitShowPlaybackTargetPicker();
                art.emit('airplay');
            } else notice.show = i18n.get('AirPlay Not Available');
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"3f0n5":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>aspectRatioMix);
var _utils = require("../utils");
function aspectRatioMix(art) {
    const { i18n, notice, template: { $video, $player } } = art;
    (0, _utils.def)(art, 'aspectRatio', {
        get () {
            return $player.dataset.aspectRatio || 'default';
        },
        set (ratio) {
            if (!ratio) ratio = 'default';
            if (ratio === 'default') {
                (0, _utils.setStyle)($video, 'width', null);
                (0, _utils.setStyle)($video, 'height', null);
                (0, _utils.setStyle)($video, 'margin', null);
                delete $player.dataset.aspectRatio;
            } else {
                const ratioArray = ratio.split(':').map(Number);
                const { clientWidth, clientHeight } = $player;
                const playerRatio = clientWidth / clientHeight;
                const setupRatio = ratioArray[0] / ratioArray[1];
                if (playerRatio > setupRatio) {
                    (0, _utils.setStyle)($video, 'width', `${setupRatio * clientHeight}px`);
                    (0, _utils.setStyle)($video, 'height', '100%');
                    (0, _utils.setStyle)($video, 'margin', '0 auto');
                } else {
                    (0, _utils.setStyle)($video, 'width', '100%');
                    (0, _utils.setStyle)($video, 'height', `${clientWidth / setupRatio}px`);
                    (0, _utils.setStyle)($video, 'margin', 'auto 0');
                }
                $player.dataset.aspectRatio = ratio;
            }
            notice.show = `${i18n.get('Aspect Ratio')}: ${ratio === 'default' ? i18n.get('Default') : ratio}`;
            art.emit('aspectRatio', ratio);
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"bI9nt":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>attrMix);
var _utils = require("../utils");
function attrMix(art) {
    const { template: { $video } } = art;
    (0, _utils.def)(art, 'attr', {
        value (key, value) {
            if (value === undefined) return $video[key];
            $video[key] = value;
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"5MwjN":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>autoHeightMix);
var _utils = require("../utils");
function autoHeightMix(art) {
    const { template: { $container, $video } } = art;
    (0, _utils.def)(art, 'autoHeight', {
        value () {
            const { clientWidth } = $container;
            const { videoHeight, videoWidth } = $video;
            const height = videoHeight * (clientWidth / videoWidth);
            (0, _utils.setStyle)($container, 'height', `${height}px`);
            art.emit('autoHeight', height);
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"cbo97":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>autoSizeMix);
var _utils = require("../utils");
function autoSizeMix(art) {
    const { $container, $player, $video } = art.template;
    (0, _utils.def)(art, 'autoSize', {
        value () {
            const { videoWidth, videoHeight } = $video;
            const { width, height } = (0, _utils.getRect)($container);
            const videoRatio = videoWidth / videoHeight;
            const containerRatio = width / height;
            if (containerRatio > videoRatio) {
                const percentage = height * videoRatio / width * 100;
                (0, _utils.setStyle)($player, 'width', `${percentage}%`);
                (0, _utils.setStyle)($player, 'height', '100%');
            } else {
                const percentage = width / videoRatio / height * 100;
                (0, _utils.setStyle)($player, 'width', '100%');
                (0, _utils.setStyle)($player, 'height', `${percentage}%`);
            }
            art.emit('autoSize', {
                width: art.width,
                height: art.height
            });
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"awlhX":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>cssVarMix);
var _utils = require("../utils");
function cssVarMix(art) {
    const { $player } = art.template;
    (0, _utils.def)(art, 'cssVar', {
        value (key, value) {
            if (value) return $player.style.setProperty(key, value);
            else return getComputedStyle($player).getPropertyValue(key);
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"1nPI2":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>currentTimeMix);
var _utils = require("../utils");
function currentTimeMix(art) {
    const { $video } = art.template;
    (0, _utils.def)(art, 'currentTime', {
        get: ()=>$video.currentTime || 0,
        set: (time)=>{
            time = Number.parseFloat(time);
            if (Number.isNaN(time)) return;
            $video.currentTime = (0, _utils.clamp)(time, 0, art.duration);
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"gKWyP":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>durationMix);
var _utils = require("../utils");
function durationMix(art) {
    (0, _utils.def)(art, 'duration', {
        get: ()=>{
            const { duration } = art.template.$video;
            if (duration === Infinity) return 0;
            return duration || 0;
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"8E0KF":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>eventInit);
var _config = require("../config");
var _configDefault = parcelHelpers.interopDefault(_config);
var _utils = require("../utils");
function eventInit(art) {
    const { i18n, notice, option, constructor, proxy, template: { $player, $video, $poster } } = art;
    let reconnectTime = 0;
    for(let index = 0; index < (0, _configDefault.default).events.length; index++)proxy($video, (0, _configDefault.default).events[index], (event)=>{
        art.emit(`video:${event.type}`, event);
    });
    // art.on('video:abort', () => {
    // });
    art.on('video:canplay', ()=>{
        reconnectTime = 0;
        art.loading.show = false;
    });
    art.once('video:canplay', ()=>{
        art.loading.show = false;
        art.controls.show = true;
        art.mask.show = true;
        art.isReady = true;
        art.emit('ready');
    });
    // art.on('video:canplaythrough', () => {
    // });
    // art.on('video:durationchange', () => {
    // });
    // art.on('video:emptied', () => {
    // });
    art.on('video:ended', ()=>{
        if (option.loop) {
            art.seek = 0;
            art.play();
            art.controls.show = false;
            art.mask.show = false;
        } else {
            art.controls.show = true;
            art.mask.show = true;
        }
    });
    art.on('video:error', async (error)=>{
        if (reconnectTime < constructor.RECONNECT_TIME_MAX) {
            await (0, _utils.sleep)(constructor.RECONNECT_SLEEP_TIME);
            reconnectTime += 1;
            art.url = option.url;
            notice.show = `${i18n.get('Reconnect')}: ${reconnectTime}`;
            art.emit('error', error, reconnectTime);
        } else {
            art.mask.show = true;
            art.loading.show = false;
            art.controls.show = true;
            (0, _utils.addClass)($player, 'art-error');
            await (0, _utils.sleep)(constructor.RECONNECT_SLEEP_TIME);
            notice.show = i18n.get('Video Load Failed');
        }
    });
    // art.on('video:loadeddata', () => {
    // });
    art.on('video:loadedmetadata', ()=>{
        art.emit('resize');
        if (0, _utils.isMobile) {
            art.loading.show = false;
            art.controls.show = true;
            art.mask.show = true;
        }
    });
    art.on('video:loadstart', ()=>{
        art.loading.show = true;
        art.mask.show = false;
        art.controls.show = true;
    });
    art.on('video:pause', ()=>{
        art.controls.show = true;
        art.mask.show = true;
    });
    art.on('video:play', ()=>{
        art.mask.show = false;
        (0, _utils.setStyle)($poster, 'display', 'none');
    });
    art.on('video:playing', ()=>{
        art.mask.show = false;
    });
    art.on('video:progress', ()=>{
        if (art.playing) art.loading.show = false;
    });
    // art.on('video:ratechange', () => {
    // });
    art.on('video:seeked', ()=>{
        art.loading.show = false;
        art.mask.show = true;
    });
    art.on('video:seeking', ()=>{
        art.loading.show = true;
        art.mask.show = false;
    });
    // art.on('video:stalled', () => {
    // });
    // art.on('video:suspend', () => {
    // });
    art.on('video:timeupdate', ()=>{
        art.mask.show = false;
    });
    // art.on('video:volumechange', () => {
    // });
    art.on('video:waiting', ()=>{
        art.loading.show = true;
        art.mask.show = false;
    });
}

},{"../config":"1dlGA","../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"9KwcF":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>flipMix);
var _utils = require("../utils");
function flipMix(art) {
    const { template: { $player }, i18n, notice } = art;
    (0, _utils.def)(art, 'flip', {
        get () {
            return $player.dataset.flip || 'normal';
        },
        set (flip) {
            if (!flip) flip = 'normal';
            if (flip === 'normal') delete $player.dataset.flip;
            else $player.dataset.flip = flip;
            notice.show = `${i18n.get('Video Flip')}: ${i18n.get((0, _utils.capitalize)(flip))}`;
            art.emit('flip', flip);
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"bdfra":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>fullscreenMix);
var _screenfull = require("../libs/screenfull");
var _screenfullDefault = parcelHelpers.interopDefault(_screenfull);
var _utils = require("../utils");
function fullscreenMix(art) {
    const { i18n, notice, template: { $video, $player } } = art;
    const nativeScreenfull = (art)=>{
        (0, _screenfullDefault.default).on('change', ()=>{
            art.emit('fullscreen', (0, _screenfullDefault.default).isFullscreen);
            if ((0, _screenfullDefault.default).isFullscreen) {
                art.state = 'fullscreen';
                (0, _utils.addClass)($player, 'art-fullscreen');
            } else (0, _utils.removeClass)($player, 'art-fullscreen');
            art.emit('resize');
        });
        (0, _screenfullDefault.default).on('error', (event)=>{
            art.emit('fullscreenError', event);
        });
        (0, _utils.def)(art, 'fullscreen', {
            get () {
                return (0, _screenfullDefault.default).isFullscreen;
            },
            async set (value) {
                if (value) await (0, _screenfullDefault.default).request($player);
                else await (0, _screenfullDefault.default).exit();
            }
        });
    };
    const webkitScreenfull = (art)=>{
        art.on('document:webkitfullscreenchange', ()=>{
            art.emit('fullscreen', art.fullscreen);
            art.emit('resize');
        });
        (0, _utils.def)(art, 'fullscreen', {
            get () {
                return document.fullscreenElement === $video;
            },
            set (value) {
                if (value) {
                    art.state = 'fullscreen';
                    $video.webkitEnterFullscreen();
                } else $video.webkitExitFullscreen();
            }
        });
    };
    art.once('video:loadedmetadata', ()=>{
        if ((0, _screenfullDefault.default).isEnabled) nativeScreenfull(art);
        else if ($video.webkitSupportsFullscreen) webkitScreenfull(art);
        else (0, _utils.def)(art, 'fullscreen', {
            get () {
                return false;
            },
            set () {
                notice.show = i18n.get('Fullscreen Not Supported');
            }
        });
        // Asynchronous setting
        (0, _utils.def)(art, 'fullscreen', (0, _utils.get)(art, 'fullscreen'));
    });
}

},{"../libs/screenfull":"7G3Ks","../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"7G3Ks":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const methodMap = [
    [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror'
    ],
    // New WebKit
    [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror'
    ],
    // Old WebKit
    [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitCancelFullScreen',
        'webkitfullscreenchange',
        'webkitfullscreenerror'
    ],
    [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror'
    ],
    [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError'
    ]
];
const nativeAPI = (()=>{
    if (typeof document === 'undefined') return false;
    const unprefixedMethods = methodMap[0];
    const returnValue = {};
    for (const methodList of methodMap){
        const exitFullscreenMethod = methodList[1];
        if (exitFullscreenMethod in document) {
            for (const [index, method] of methodList.entries())returnValue[unprefixedMethods[index]] = method;
            return returnValue;
        }
    }
    return false;
})();
const eventNameMap = {
    change: nativeAPI.fullscreenchange,
    error: nativeAPI.fullscreenerror
};
const screenfull = {
    request (element = document.documentElement, options) {
        return new Promise((resolve, reject)=>{
            const onFullScreenEntered = ()=>{
                screenfull.off('change', onFullScreenEntered);
                resolve();
            };
            screenfull.on('change', onFullScreenEntered);
            const returnPromise = element[nativeAPI.requestFullscreen](options);
            if (returnPromise instanceof Promise) returnPromise.then(onFullScreenEntered).catch(reject);
        });
    },
    exit () {
        return new Promise((resolve, reject)=>{
            if (!screenfull.isFullscreen) {
                resolve();
                return;
            }
            const onFullScreenExit = ()=>{
                screenfull.off('change', onFullScreenExit);
                resolve();
            };
            screenfull.on('change', onFullScreenExit);
            const returnPromise = document[nativeAPI.exitFullscreen]();
            if (returnPromise instanceof Promise) returnPromise.then(onFullScreenExit).catch(reject);
        });
    },
    toggle (element, options) {
        return screenfull.isFullscreen ? screenfull.exit() : screenfull.request(element, options);
    },
    onchange (callback) {
        screenfull.on('change', callback);
    },
    onerror (callback) {
        screenfull.on('error', callback);
    },
    on (event, callback) {
        const eventName = eventNameMap[event];
        if (eventName) document.addEventListener(eventName, callback, false);
    },
    off (event, callback) {
        const eventName = eventNameMap[event];
        if (eventName) document.removeEventListener(eventName, callback, false);
    },
    raw: nativeAPI
};
Object.defineProperties(screenfull, {
    isFullscreen: {
        get: ()=>Boolean(document[nativeAPI.fullscreenElement])
    },
    element: {
        enumerable: true,
        get: ()=>document[nativeAPI.fullscreenElement]
    },
    isEnabled: {
        enumerable: true,
        get: ()=>Boolean(document[nativeAPI.fullscreenEnabled])
    }
});
exports.default = screenfull;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"3ug77":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>fullscreenWebMix);
var _utils = require("../utils");
function fullscreenWebMix(art) {
    const { constructor, template: { $container, $player } } = art;
    let cssText = '';
    (0, _utils.def)(art, 'fullscreenWeb', {
        get () {
            return (0, _utils.hasClass)($player, 'art-fullscreen-web');
        },
        set (value) {
            if (value) {
                cssText = $player.style.cssText;
                if (constructor.FULLSCREEN_WEB_IN_BODY) (0, _utils.append)(document.body, $player);
                art.state = 'fullscreenWeb';
                (0, _utils.setStyle)($player, 'width', '100%');
                (0, _utils.setStyle)($player, 'height', '100%');
                (0, _utils.addClass)($player, 'art-fullscreen-web');
                art.emit('fullscreenWeb', true);
            } else {
                if (constructor.FULLSCREEN_WEB_IN_BODY) (0, _utils.append)($container, $player);
                if (cssText) {
                    $player.style.cssText = cssText;
                    cssText = '';
                }
                (0, _utils.removeClass)($player, 'art-fullscreen-web');
                art.emit('fullscreenWeb', false);
            }
            art.emit('resize');
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"lmx0A":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>loadedMix);
var _utils = require("../utils");
function loadedMix(art) {
    const { $video } = art.template;
    (0, _utils.def)(art, 'loaded', {
        get: ()=>art.loadedTime / $video.duration
    });
    (0, _utils.def)(art, 'loadedTime', {
        get: ()=>{
            return $video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0;
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"5xcsH":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>miniMix);
var _utils = require("../utils");
function miniMix(art) {
    const { icons, proxy, storage, template: { $player, $video } } = art;
    let isDragging = false;
    let lastPageX = 0;
    let lastPageY = 0;
    function hideMini() {
        const { $mini } = art.template;
        if ($mini) {
            (0, _utils.removeClass)($player, 'art-mini');
            (0, _utils.setStyle)($mini, 'display', 'none');
            $player.prepend($video);
            art.emit('mini', false);
        }
    }
    function initState($play, $pause) {
        if (art.playing) {
            (0, _utils.setStyle)($play, 'display', `none`);
            (0, _utils.setStyle)($pause, 'display', `flex`);
        } else {
            (0, _utils.setStyle)($play, 'display', `flex`);
            (0, _utils.setStyle)($pause, 'display', `none`);
        }
    }
    function createMini() {
        const { $mini } = art.template;
        if ($mini) {
            (0, _utils.append)($mini, $video);
            return (0, _utils.setStyle)($mini, 'display', 'flex');
        } else {
            const $mini = (0, _utils.createElement)('div');
            (0, _utils.addClass)($mini, 'art-mini-popup');
            (0, _utils.append)(document.body, $mini);
            art.template.$mini = $mini;
            (0, _utils.append)($mini, $video);
            const $close = (0, _utils.append)($mini, `<div class="art-mini-close"></div>`);
            (0, _utils.append)($close, icons.close);
            proxy($close, 'click', hideMini);
            const $state = (0, _utils.append)($mini, `<div class="art-mini-state"></div>`);
            const $play = (0, _utils.append)($state, icons.play);
            const $pause = (0, _utils.append)($state, icons.pause);
            proxy($play, 'click', ()=>art.play());
            proxy($pause, 'click', ()=>art.pause());
            initState($play, $pause);
            art.on('video:playing', ()=>initState($play, $pause));
            art.on('video:pause', ()=>initState($play, $pause));
            art.on('video:timeupdate', ()=>initState($play, $pause));
            proxy($mini, 'mousedown', (event)=>{
                isDragging = event.button === 0;
                lastPageX = event.pageX;
                lastPageY = event.pageY;
            });
            art.on('document:mousemove', (event)=>{
                if (isDragging) {
                    (0, _utils.addClass)($mini, 'art-mini-dragging');
                    const x = event.pageX - lastPageX;
                    const y = event.pageY - lastPageY;
                    (0, _utils.setStyle)($mini, 'transform', `translate(${x}px, ${y}px)`);
                }
            });
            art.on('document:mouseup', ()=>{
                if (isDragging) {
                    isDragging = false;
                    (0, _utils.removeClass)($mini, 'art-mini-dragging');
                    const rect = (0, _utils.getRect)($mini);
                    storage.set('left', rect.left);
                    storage.set('top', rect.top);
                    (0, _utils.setStyle)($mini, 'left', `${rect.left}px`);
                    (0, _utils.setStyle)($mini, 'top', `${rect.top}px`);
                    (0, _utils.setStyle)($mini, 'transform', null);
                }
            });
            return $mini;
        }
    }
    function initMini() {
        const { $mini } = art.template;
        const rect = (0, _utils.getRect)($mini);
        const top = window.innerHeight - rect.height - 50;
        const left = window.innerWidth - rect.width - 50;
        storage.set('top', top);
        storage.set('left', left);
        (0, _utils.setStyle)($mini, 'top', `${top}px`);
        (0, _utils.setStyle)($mini, 'left', `${left}px`);
    }
    (0, _utils.def)(art, 'mini', {
        get () {
            return (0, _utils.hasClass)($player, 'art-mini');
        },
        set (value) {
            if (value) {
                art.state = 'mini';
                (0, _utils.addClass)($player, 'art-mini');
                const $mini = createMini();
                const top = storage.get('top');
                const left = storage.get('left');
                if (typeof top === 'number' && typeof left === 'number') {
                    (0, _utils.setStyle)($mini, 'top', `${top}px`);
                    (0, _utils.setStyle)($mini, 'left', `${left}px`);
                    if (!(0, _utils.isInViewport)($mini)) initMini();
                } else initMini();
                art.emit('mini', true);
            } else hideMini();
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"2TEf9":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>optionInit);
var _utils = require("../utils");
function optionInit(art) {
    const { option, storage, template: { $video, $poster } } = art;
    for(const key in option.moreVideoAttr)art.attr(key, option.moreVideoAttr[key]);
    if (option.muted) art.muted = option.muted;
    if (option.volume) $video.volume = (0, _utils.clamp)(option.volume, 0, 1);
    const volumeStorage = storage.get('volume');
    if (typeof volumeStorage === 'number') $video.volume = (0, _utils.clamp)(volumeStorage, 0, 1);
    if (option.poster) (0, _utils.setStyle)($poster, 'backgroundImage', `url(${option.poster})`);
    if (option.autoplay) $video.autoplay = option.autoplay;
    if (option.playsInline) {
        $video.playsInline = true;
        $video['webkit-playsinline'] = true;
    }
    if (option.theme) option.cssVar['--art-theme'] = option.theme;
    for(const key in option.cssVar)art.cssVar(key, option.cssVar[key]);
    art.url = option.url;
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"j7SoA":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>pauseMix);
var _utils = require("../utils");
function pauseMix(art) {
    const { template: { $video }, i18n, notice } = art;
    (0, _utils.def)(art, 'pause', {
        value () {
            const result = $video.pause();
            notice.show = i18n.get('Pause');
            art.emit('pause');
            return result;
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"iz9Aq":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>pipMix);
var _utils = require("../utils");
function nativePip(art) {
    const { template: { $video }, proxy, notice } = art;
    $video.disablePictureInPicture = false;
    (0, _utils.def)(art, 'pip', {
        get () {
            return document.pictureInPictureElement;
        },
        set (value) {
            if (value) {
                art.state = 'pip';
                $video.requestPictureInPicture().catch((err)=>{
                    notice.show = err;
                    throw err;
                });
            } else document.exitPictureInPicture().catch((err)=>{
                notice.show = err;
                throw err;
            });
        }
    });
    proxy($video, 'enterpictureinpicture', ()=>{
        art.emit('pip', true);
    });
    proxy($video, 'leavepictureinpicture', ()=>{
        art.emit('pip', false);
    });
}
function webkitPip(art) {
    const { $video } = art.template;
    $video.webkitSetPresentationMode('inline');
    (0, _utils.def)(art, 'pip', {
        get () {
            return $video.webkitPresentationMode === 'picture-in-picture';
        },
        set (value) {
            if (value) {
                art.state = 'pip';
                $video.webkitSetPresentationMode('picture-in-picture');
                art.emit('pip', true);
            } else {
                $video.webkitSetPresentationMode('inline');
                art.emit('pip', false);
            }
        }
    });
}
function pipMix(art) {
    const { i18n, notice, template: { $video } } = art;
    if (document.pictureInPictureEnabled) nativePip(art);
    else if ($video.webkitSupportsPresentationMode) webkitPip(art);
    else (0, _utils.def)(art, 'pip', {
        get () {
            return false;
        },
        set () {
            notice.show = i18n.get('PIP Not Supported');
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"b6rDz":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>playbackRateMix);
var _utils = require("../utils");
function playbackRateMix(art) {
    const { template: { $video }, i18n, notice } = art;
    (0, _utils.def)(art, 'playbackRate', {
        get () {
            return $video.playbackRate;
        },
        set (rate) {
            if (rate) {
                if (rate === $video.playbackRate) return;
                $video.playbackRate = rate;
                notice.show = `${i18n.get('Rate')}: ${rate === 1.0 ? i18n.get('Normal') : `${rate}x`}`;
            } else art.playbackRate = 1;
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"CTEqN":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>playedMix);
var _utils = require("../utils");
function playedMix(art) {
    (0, _utils.def)(art, 'played', {
        get: ()=>art.currentTime / art.duration
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"jMFse":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>playingMix);
var _utils = require("../utils");
function playingMix(art) {
    const { $video } = art.template;
    (0, _utils.def)(art, 'playing', {
        get: ()=>{
            if (typeof $video.playing === 'boolean') return $video.playing;
            return !!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2);
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"lsQBb":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>playMix);
var _utils = require("../utils");
function playMix(art) {
    const { i18n, notice, option, constructor: { instances }, template: { $video } } = art;
    (0, _utils.def)(art, 'play', {
        async value () {
            const result = await $video.play();
            notice.show = i18n.get('Play');
            art.emit('play');
            if (option.mutex) for(let index = 0; index < instances.length; index++){
                const instance = instances[index];
                if (instance !== art) instance.pause();
            }
            return result;
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"iVqmF":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>posterMix);
var _utils = require("../utils");
function posterMix(art) {
    const { template: { $poster } } = art;
    (0, _utils.def)(art, 'poster', {
        get: ()=>{
            try {
                return $poster.style.backgroundImage.match(/"(.*)"/)[1];
            } catch  {
                return '';
            }
        },
        set (url) {
            (0, _utils.setStyle)($poster, 'backgroundImage', `url(${url})`);
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"2gM0L":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>qualityMix);
var _utils = require("../utils");
function qualityMix(art) {
    (0, _utils.def)(art, 'quality', {
        set (quality) {
            const { controls, notice, i18n } = art;
            const qualityDefault = quality.find((item)=>item.default) || quality[0];
            controls.update({
                name: 'quality',
                position: 'right',
                index: 10,
                style: {
                    marginRight: '10px'
                },
                html: qualityDefault?.html || '',
                selector: quality,
                async onSelect (item) {
                    await art.switchQuality(item.url);
                    notice.show = `${i18n.get('Switch Video')}: ${item.html}`;
                    return item.html;
                }
            });
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"iR6EQ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>rectMix);
var _utils = require("../utils");
function rectMix(art) {
    (0, _utils.def)(art, 'rect', {
        get: ()=>{
            return (0, _utils.getRect)(art.template.$player);
        }
    });
    const keys = [
        'bottom',
        'height',
        'left',
        'right',
        'top',
        'width'
    ];
    for(let index = 0; index < keys.length; index++){
        const key = keys[index];
        (0, _utils.def)(art, key, {
            get: ()=>{
                return art.rect[key];
            }
        });
    }
    (0, _utils.def)(art, 'x', {
        get: ()=>{
            return art.left + window.pageXOffset;
        }
    });
    (0, _utils.def)(art, 'y', {
        get: ()=>{
            return art.top + window.pageYOffset;
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"kwHom":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>screenshotMix);
var _utils = require("../utils");
function screenshotMix(art) {
    const { notice, template: { $video } } = art;
    const $canvas = (0, _utils.createElement)('canvas');
    (0, _utils.def)(art, 'getDataURL', {
        value: ()=>new Promise((resolve, reject)=>{
                try {
                    $canvas.width = $video.videoWidth;
                    $canvas.height = $video.videoHeight;
                    $canvas.getContext('2d').drawImage($video, 0, 0);
                    resolve($canvas.toDataURL('image/png'));
                } catch (err) {
                    notice.show = err;
                    reject(err);
                }
            })
    });
    (0, _utils.def)(art, 'getBlobUrl', {
        value: ()=>new Promise((resolve, reject)=>{
                try {
                    $canvas.width = $video.videoWidth;
                    $canvas.height = $video.videoHeight;
                    $canvas.getContext('2d').drawImage($video, 0, 0);
                    $canvas.toBlob((blob)=>{
                        resolve(URL.createObjectURL(blob));
                    });
                } catch (err) {
                    notice.show = err;
                    reject(err);
                }
            })
    });
    (0, _utils.def)(art, 'screenshot', {
        value: async (name)=>{
            const dataUri = await art.getDataURL();
            const fileName = name || `artplayer_${(0, _utils.secondToTime)($video.currentTime)}`;
            (0, _utils.download)(dataUri, `${fileName}.png`);
            art.emit('screenshot', dataUri);
            return dataUri;
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"aOXnw":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>seekMix);
var _utils = require("../utils");
function seekMix(art) {
    const { notice } = art;
    (0, _utils.def)(art, 'seek', {
        set (time) {
            art.currentTime = time;
            if (art.duration) notice.show = `${(0, _utils.secondToTime)(art.currentTime)} / ${(0, _utils.secondToTime)(art.duration)}`;
            art.emit('seek', art.currentTime, time);
        }
    });
    (0, _utils.def)(art, 'forward', {
        set (time) {
            art.seek = art.currentTime + time;
        }
    });
    (0, _utils.def)(art, 'backward', {
        set (time) {
            art.seek = art.currentTime - time;
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"ls3ui":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>stateMix);
var _utils = require("../utils");
function stateMix(art) {
    const states = [
        'mini',
        'pip',
        'fullscreen',
        'fullscreenWeb'
    ];
    (0, _utils.def)(art, 'state', {
        get: ()=>states.find((name)=>art[name]) || 'standard',
        set (name) {
            for(let index = 0; index < states.length; index++){
                const prop = states[index];
                if (prop !== name && art[prop]) art[prop] = false;
            }
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"exULR":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>subtitleOffsetMix);
var _utils = require("../utils");
function subtitleOffsetMix(art) {
    const { notice, i18n, template } = art;
    (0, _utils.def)(art, 'subtitleOffset', {
        get () {
            return template.$track?.offset || 0;
        },
        set (value) {
            const { cues } = art.subtitle;
            if (!template.$track || cues.length === 0) return;
            const offset = (0, _utils.clamp)(value, -10, 10);
            template.$track.offset = offset;
            for(let index = 0; index < cues.length; index++){
                const cue = cues[index];
                cue.originalStartTime = cue.originalStartTime ?? cue.startTime;
                cue.originalEndTime = cue.originalEndTime ?? cue.endTime;
                cue.startTime = (0, _utils.clamp)(cue.originalStartTime + offset, 0, art.duration);
                cue.endTime = (0, _utils.clamp)(cue.originalEndTime + offset, 0, art.duration);
            }
            art.subtitle.update();
            notice.show = `${i18n.get('Subtitle Offset')}: ${value}s`;
            art.emit('subtitleOffset', value);
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"fhErJ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>switchMix);
var _utils = require("../utils");
function switchMix(art) {
    function switchUrl(url, currentTime) {
        return new Promise((resolve, reject)=>{
            if (url === art.url) {
                resolve();
                return;
            }
            const { playing, aspectRatio, playbackRate } = art;
            art.pause();
            art.url = url;
            art.notice.show = '';
            const handlers = {};
            handlers.error = (error)=>{
                art.off('video:canplay', handlers.canplay);
                art.off('video:loadedmetadata', handlers.metadata);
                reject(error);
            };
            handlers.metadata = ()=>{
                art.currentTime = currentTime;
            };
            handlers.canplay = async ()=>{
                art.off('video:error', handlers.error);
                art.playbackRate = playbackRate;
                art.aspectRatio = aspectRatio;
                if (playing) await art.play();
                art.notice.show = '';
                resolve();
            };
            art.once('video:error', handlers.error);
            art.once('video:loadedmetadata', handlers.metadata);
            art.once('video:canplay', handlers.canplay);
        });
    }
    (0, _utils.def)(art, 'switchQuality', {
        value: (url)=>{
            return switchUrl(url, art.currentTime);
        }
    });
    (0, _utils.def)(art, 'switchUrl', {
        value: (url)=>{
            return switchUrl(url, 0);
        }
    });
    (0, _utils.def)(art, 'switch', {
        set: art.switchUrl
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"61Zjc":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>themeMix);
var _utils = require("../utils");
function themeMix(art) {
    (0, _utils.def)(art, 'theme', {
        get () {
            return art.cssVar('--art-theme');
        },
        set (theme) {
            art.cssVar('--art-theme', theme);
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"1gQEa":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>thumbnailsMix);
var _utils = require("../utils");
function thumbnailsMix(art) {
    const { option, template: { $progress, $video } } = art;
    let timer = null;
    let loding = false;
    let image = null;
    function reset() {
        clearTimeout(timer);
        timer = null;
        loding = false;
        image = null;
    }
    function showThumbnails(posWidth) {
        const $thumbnails = art.controls?.thumbnails;
        if (!$thumbnails) return;
        const { number, column, width, height, scale } = option.thumbnails;
        const width2 = width * scale || image.naturalWidth / column;
        const height2 = height * scale || width2 / ($video.videoWidth / $video.videoHeight);
        const perWidth = $progress.clientWidth / number;
        const perIndex = Math.floor(posWidth / perWidth);
        const yIndex = Math.ceil(perIndex / column) - 1;
        const xIndex = perIndex % column || column - 1;
        (0, _utils.setStyle)($thumbnails, 'backgroundImage', `url(${image.src})`);
        (0, _utils.setStyle)($thumbnails, 'height', `${height2}px`);
        (0, _utils.setStyle)($thumbnails, 'width', `${width2}px`);
        (0, _utils.setStyle)($thumbnails, 'backgroundPosition', `-${xIndex * width2}px -${yIndex * height2}px`);
        if (posWidth <= width2 / 2) (0, _utils.setStyle)($thumbnails, 'left', 0);
        else if (posWidth > $progress.clientWidth - width2 / 2) (0, _utils.setStyle)($thumbnails, 'left', `${$progress.clientWidth - width2}px`);
        else (0, _utils.setStyle)($thumbnails, 'left', `${posWidth - width2 / 2}px`);
    }
    art.on('setBar', async (type, percentage, event)=>{
        const $thumbnails = art.controls?.thumbnails;
        const { url, scale } = option.thumbnails;
        if (!$thumbnails || !url) return;
        const isMobileDragging = type === 'played' && event && (0, _utils.isMobile);
        if (type === 'hover' || isMobileDragging) {
            if (!image && !loding) {
                loding = true;
                image = await (0, _utils.loadImg)(url, scale);
                loding = false;
            }
            if (!image) return;
            const width = $progress.clientWidth * percentage;
            if (width > 0 && width < $progress.clientWidth) showThumbnails(width);
        }
    });
    (0, _utils.def)(art, 'thumbnails', {
        get () {
            return art.option.thumbnails;
        },
        set (thumbnails) {
            if (thumbnails.url && !art.option.isLive) {
                art.option.thumbnails = thumbnails;
                reset();
            }
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"gt5Qh":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>toggleMix);
var _utils = require("../utils");
function toggleMix(art) {
    (0, _utils.def)(art, 'toggle', {
        value () {
            if (art.playing) return art.pause();
            else return art.play();
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"gtfHf":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>typeMix);
var _utils = require("../utils");
function typeMix(art) {
    (0, _utils.def)(art, 'type', {
        get () {
            return art.option.type;
        },
        set (type) {
            art.option.type = type;
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"esLaT":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>urlMix);
var _utils = require("../utils");
function urlMix(art) {
    const { option, template: { $video } } = art;
    (0, _utils.def)(art, 'url', {
        get () {
            return $video.src;
        },
        async set (newUrl) {
            if (newUrl) {
                const oldUrl = art.url;
                const typeName = option.type || (0, _utils.getExt)(newUrl);
                const typeCallback = option.customType[typeName];
                if (typeName && typeCallback) {
                    await (0, _utils.sleep)();
                    art.loading.show = true;
                    typeCallback.call(art, $video, newUrl, art);
                } else {
                    URL.revokeObjectURL(oldUrl);
                    $video.src = newUrl;
                }
                if (oldUrl !== art.url) {
                    art.option.url = newUrl;
                    if (art.isReady && oldUrl) art.once('video:canplay', ()=>{
                        art.emit('restart', newUrl);
                    });
                }
            } else {
                await (0, _utils.sleep)();
                art.loading.show = true;
            }
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"fIzu0":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>volumeMix);
var _utils = require("../utils");
function volumeMix(art) {
    const { template: { $video }, i18n, notice, storage } = art;
    (0, _utils.def)(art, 'volume', {
        get: ()=>$video.volume || 0,
        set: (percentage)=>{
            $video.volume = (0, _utils.clamp)(percentage, 0, 1);
            notice.show = `${i18n.get('Volume')}: ${Number.parseInt($video.volume * 100, 10)}`;
            if ($video.volume !== 0) storage.set('volume', $video.volume);
        }
    });
    (0, _utils.def)(art, 'muted', {
        get: ()=>$video.muted,
        set: (muted)=>{
            $video.muted = muted;
            art.emit('muted', muted);
        }
    });
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"6P64r":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
var _autoOrientation = require("./autoOrientation");
var _autoOrientationDefault = parcelHelpers.interopDefault(_autoOrientation);
var _autoPlayback = require("./autoPlayback");
var _autoPlaybackDefault = parcelHelpers.interopDefault(_autoPlayback);
var _fastForward = require("./fastForward");
var _fastForwardDefault = parcelHelpers.interopDefault(_fastForward);
var _lock = require("./lock");
var _lockDefault = parcelHelpers.interopDefault(_lock);
var _miniProgressBar = require("./miniProgressBar");
var _miniProgressBarDefault = parcelHelpers.interopDefault(_miniProgressBar);
class Plugins {
    constructor(art){
        this.art = art;
        this.id = 0;
        const { option } = art;
        if (option.miniProgressBar && !option.isLive) this.add((0, _miniProgressBarDefault.default));
        if (option.lock && (0, _utils.isMobile)) this.add((0, _lockDefault.default));
        if (option.autoPlayback && !option.isLive) this.add((0, _autoPlaybackDefault.default));
        if (option.autoOrientation && (0, _utils.isMobile)) this.add((0, _autoOrientationDefault.default));
        if (option.fastForward && (0, _utils.isMobile) && !option.isLive) this.add((0, _fastForwardDefault.default));
        for(let index = 0; index < option.plugins.length; index++)this.add(option.plugins[index]);
    }
    add(plugin) {
        this.id += 1;
        const result = plugin.call(this.art, this.art);
        if (result instanceof Promise) return result.then((res)=>this.next(plugin, res));
        else return this.next(plugin, result);
    }
    next(plugin, result) {
        const pluginName = result && result.name || plugin.name || `plugin${this.id}`;
        (0, _utils.errorHandle)(!(0, _utils.has)(this, pluginName), `Cannot add a plugin that already has the same name: ${pluginName}`);
        (0, _utils.def)(this, pluginName, {
            value: result
        });
        return this;
    }
}
exports.default = Plugins;

},{"../utils":"gGxPm","./autoOrientation":"kQuMm","./autoPlayback":"5JFuz","./fastForward":"ae4vU","./lock":"aMHP0","./miniProgressBar":"bMAvE","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"kQuMm":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>autoOrientation);
var _utils = require("../utils");
function autoOrientation(art) {
    const { notice, constructor, template: { $player, $video } } = art;
    const WEB_CLASS = 'art-auto-orientation';
    const FS_CLASS = 'art-auto-orientation-fullscreen';
    let fsLocked = false;
    function applyWebRotate() {
        const viewWidth = document.documentElement.clientWidth;
        const viewHeight = document.documentElement.clientHeight;
        (0, _utils.setStyle)($player, 'width', `${viewHeight}px`);
        (0, _utils.setStyle)($player, 'height', `${viewWidth}px`);
        (0, _utils.setStyle)($player, 'transform-origin', '0 0');
        (0, _utils.setStyle)($player, 'transform', `rotate(90deg) translate(0, -${viewWidth}px)`);
        (0, _utils.addClass)($player, WEB_CLASS);
        art.isRotate = true;
        art.emit('resize');
    }
    function clearWebRotate() {
        (0, _utils.setStyle)($player, 'width', '');
        (0, _utils.setStyle)($player, 'height', '');
        (0, _utils.setStyle)($player, 'transform-origin', '');
        (0, _utils.setStyle)($player, 'transform', '');
        (0, _utils.removeClass)($player, WEB_CLASS);
        art.isRotate = false;
        art.emit('resize');
    }
    function needRotate() {
        const { videoWidth, videoHeight } = $video;
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        return videoWidth > videoHeight && vw < vh || videoWidth < videoHeight && vw > vh;
    }
    art.on('fullscreenWeb', (state)=>{
        if (state) {
            if (needRotate()) {
                const delay = Number(constructor.AUTO_ORIENTATION_TIME ?? 0);
                setTimeout(()=>{
                    if (art.fullscreenWeb && !(0, _utils.hasClass)($player, WEB_CLASS)) applyWebRotate();
                }, delay);
            }
        } else if ((0, _utils.hasClass)($player, WEB_CLASS)) clearWebRotate();
    });
    art.on('fullscreen', async (state)=>{
        const canLock = !!screen?.orientation?.lock;
        if (state) {
            if (canLock && needRotate()) try {
                const last = screen.orientation.type;
                const opposite = last.startsWith('portrait') ? 'landscape' : 'portrait';
                await screen.orientation.lock(opposite);
                fsLocked = true;
                (0, _utils.addClass)($player, FS_CLASS);
            } catch (err) {
                fsLocked = false;
                notice.show = err;
            }
        } else {
            if ((0, _utils.hasClass)($player, FS_CLASS)) (0, _utils.removeClass)($player, FS_CLASS);
            if (canLock && fsLocked) {
                try {
                    screen.orientation.unlock();
                } catch  {}
                fsLocked = false;
            }
        }
    });
    return {
        name: 'autoOrientation',
        get state () {
            return (0, _utils.hasClass)($player, WEB_CLASS);
        }
    };
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"5JFuz":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>autoPlayback);
var _utils = require("../utils");
function autoPlayback(art) {
    const { i18n, icons, storage, constructor, proxy, template: { $poster } } = art;
    const $autoPlayback = art.layers.add({
        name: 'auto-playback',
        html: `
            <div class="art-auto-playback-close"></div>
            <div class="art-auto-playback-last"></div>
            <div class="art-auto-playback-jump"></div>
        `
    });
    const $last = (0, _utils.query)('.art-auto-playback-last', $autoPlayback);
    const $jump = (0, _utils.query)('.art-auto-playback-jump', $autoPlayback);
    const $close = (0, _utils.query)('.art-auto-playback-close', $autoPlayback);
    (0, _utils.append)($close, icons.close);
    let timer = null;
    art.on('video:timeupdate', ()=>{
        if (art.playing) {
            const times = storage.get('times') || {};
            const keys = Object.keys(times);
            if (keys.length > constructor.AUTO_PLAYBACK_MAX) delete times[keys[0]];
            times[art.option.id || art.option.url] = art.currentTime;
            storage.set('times', times);
        }
    });
    function init() {
        const times = storage.get('times') || {};
        const currentTime = times[art.option.id || art.option.url];
        clearTimeout(timer);
        (0, _utils.setStyle)($autoPlayback, 'display', 'none');
        if (currentTime && currentTime >= constructor.AUTO_PLAYBACK_MIN) {
            (0, _utils.setStyle)($autoPlayback, 'display', 'flex');
            $last.textContent = `${i18n.get('Last Seen')} ${(0, _utils.secondToTime)(currentTime)}`;
            $jump.textContent = i18n.get('Jump Play');
            proxy($close, 'click', ()=>{
                (0, _utils.setStyle)($autoPlayback, 'display', 'none');
            });
            proxy($jump, 'click', ()=>{
                art.seek = currentTime;
                art.play();
                (0, _utils.setStyle)($poster, 'display', 'none');
                (0, _utils.setStyle)($autoPlayback, 'display', 'none');
            });
            art.once('video:timeupdate', ()=>{
                timer = setTimeout(()=>{
                    (0, _utils.setStyle)($autoPlayback, 'display', 'none');
                }, constructor.AUTO_PLAYBACK_TIMEOUT);
            });
        }
    }
    art.on('ready', init);
    art.on('restart', init);
    return {
        name: 'auto-playback',
        get times () {
            return storage.get('times') || {};
        },
        clear () {
            return storage.del('times');
        },
        delete (id) {
            const times = storage.get('times') || {};
            delete times[id];
            storage.set('times', times);
            return times;
        }
    };
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"ae4vU":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>fastForward);
var _utils = require("../utils");
function fastForward(art) {
    const { constructor, proxy, template: { $player, $video } } = art;
    let timer = null;
    let isPress = false;
    let lastPlaybackRate = 1;
    const onStart = (event)=>{
        if (event.touches.length === 1 && art.playing && !art.isLock) timer = setTimeout(()=>{
            isPress = true;
            lastPlaybackRate = art.playbackRate;
            art.playbackRate = constructor.FAST_FORWARD_VALUE;
            (0, _utils.addClass)($player, 'art-fast-forward');
        }, constructor.FAST_FORWARD_TIME);
    };
    const onStop = ()=>{
        clearTimeout(timer);
        if (isPress) {
            isPress = false;
            art.playbackRate = lastPlaybackRate;
            (0, _utils.removeClass)($player, 'art-fast-forward');
        }
    };
    proxy($video, 'touchstart', onStart);
    art.on('document:touchmove', onStop);
    art.on('document:touchend', onStop);
    return {
        name: 'fastForward',
        get state () {
            return (0, _utils.hasClass)($player, 'art-fast-forward');
        }
    };
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"aMHP0":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>lock);
var _utils = require("../utils");
function lock(art) {
    const { layers, icons, template: { $player } } = art;
    function getState() {
        return (0, _utils.hasClass)($player, 'art-lock');
    }
    function setLock() {
        (0, _utils.addClass)($player, 'art-lock');
        art.isLock = true;
        art.emit('lock', true);
    }
    function setUnlock() {
        (0, _utils.removeClass)($player, 'art-lock');
        art.isLock = false;
        art.emit('lock', false);
    }
    layers.add({
        name: 'lock',
        mounted ($el) {
            const $lock = (0, _utils.append)($el, icons.lock);
            const $unlock = (0, _utils.append)($el, icons.unlock);
            (0, _utils.setStyle)($lock, 'display', 'none');
            art.on('lock', (state)=>{
                if (state) {
                    (0, _utils.setStyle)($lock, 'display', 'inline-flex');
                    (0, _utils.setStyle)($unlock, 'display', 'none');
                } else {
                    (0, _utils.setStyle)($lock, 'display', 'none');
                    (0, _utils.setStyle)($unlock, 'display', 'inline-flex');
                }
            });
        },
        click () {
            if (getState()) setUnlock();
            else setLock();
        }
    });
    return {
        name: 'lock',
        get state () {
            return getState();
        },
        set state (value){
            if (value) setLock();
            else setUnlock();
        }
    };
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"bMAvE":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>miniProgressBar);
var _utils = require("../utils");
function miniProgressBar(art) {
    art.on('control', (state)=>{
        if (state) (0, _utils.removeClass)(art.template.$player, 'art-mini-progress-bar');
        else (0, _utils.addClass)(art.template.$player, 'art-mini-progress-bar');
    });
    return {
        name: 'mini-progress-bar'
    };
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"7ATN8":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
var _component = require("../utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
var _aspectRatio = require("./aspectRatio");
var _aspectRatioDefault = parcelHelpers.interopDefault(_aspectRatio);
var _flip = require("./flip");
var _flipDefault = parcelHelpers.interopDefault(_flip);
var _playbackRate = require("./playbackRate");
var _playbackRateDefault = parcelHelpers.interopDefault(_playbackRate);
var _subtitleOffset = require("./subtitleOffset");
var _subtitleOffsetDefault = parcelHelpers.interopDefault(_subtitleOffset);
class Setting extends (0, _componentDefault.default) {
    constructor(art){
        super(art);
        const { option, controls, template: { $setting } } = art;
        this.name = 'setting';
        this.$parent = $setting;
        this.id = 0;
        this.active = null;
        this.cache = new Map();
        this.option = [
            ...this.builtin,
            ...option.settings
        ];
        if (option.setting) {
            this.format();
            this.render();
            art.on('blur', ()=>{
                if (this.show) {
                    this.show = false;
                    this.render();
                }
            });
            art.on('focus', (event)=>{
                const isControl = (0, _utils.includeFromEvent)(event, controls.setting);
                const isSetting = (0, _utils.includeFromEvent)(event, this.$parent);
                if (this.show && !isControl && !isSetting) {
                    this.show = false;
                    this.render();
                }
            });
            art.on('resize', ()=>this.resize());
        }
    }
    get builtin() {
        const result = [];
        const { option } = this.art;
        if (option.playbackRate) result.push((0, _playbackRateDefault.default)(this.art));
        if (option.aspectRatio) result.push((0, _aspectRatioDefault.default)(this.art));
        if (option.flip) result.push((0, _flipDefault.default)(this.art));
        if (option.subtitleOffset) result.push((0, _subtitleOffsetDefault.default)(this.art));
        return result;
    }
    traverse(callback, option = this.option) {
        for(let index = 0; index < option.length; index++){
            const item = option[index];
            callback(item);
            if (item.selector?.length) this.traverse(callback, item.selector);
        }
    }
    check(target) {
        if (!target) return;
        target.$parent.tooltip = target.html;
        this.traverse((item)=>{
            item.default = item === target;
            if (item.default && item.$item) (0, _utils.inverseClass)(item.$item, 'art-current');
        }, target.$option);
        this.render(target.$parents);
    }
    format(option = this.option, parent, parents, names = []) {
        for(let index = 0; index < option.length; index++){
            const item = option[index];
            if (item?.name) {
                (0, _utils.errorHandle)(!names.includes(item.name), `The [${item.name}] already exists in [setting]`);
                names.push(item.name);
            } else item.name = `setting-${this.id++}`;
            if (!item.$formatted) {
                (0, _utils.def)(item, '$parent', {
                    get: ()=>parent
                });
                (0, _utils.def)(item, '$parents', {
                    get: ()=>parents
                });
                (0, _utils.def)(item, '$option', {
                    get: ()=>option
                });
                const $events = [];
                (0, _utils.def)(item, '$events', {
                    get: ()=>$events
                });
                (0, _utils.def)(item, '$formatted', {
                    get: ()=>true
                });
            }
            this.format(item.selector || [], item, option, names);
        }
        this.option = option;
    }
    find(name = '') {
        let result = null;
        this.traverse((item)=>{
            if (item.name === name) result = item;
        });
        return result;
    }
    resize() {
        const { controls, constructor: { SETTING_WIDTH, SETTING_ITEM_HEIGHT }, template: { $player, $setting } } = this.art;
        if (controls.setting && this.show) {
            const settingWidth = this.active[0]?.$parent?.width || SETTING_WIDTH;
            const { left: controlLeft, width: controlWidth } = (0, _utils.getRect)(controls.setting);
            const { left: playerLeft, width: playerWidth } = (0, _utils.getRect)($player);
            const settingLeft = controlLeft - playerLeft + controlWidth / 2 - settingWidth / 2;
            const settingHeight = this.active === this.option ? this.active.length * SETTING_ITEM_HEIGHT : (this.active.length + 1) * SETTING_ITEM_HEIGHT;
            (0, _utils.setStyle)($setting, 'height', `${settingHeight}px`);
            (0, _utils.setStyle)($setting, 'width', `${settingWidth}px`);
            if (this.art.isRotate || (0, _utils.isMobile)) return;
            if (settingLeft + settingWidth > playerWidth) {
                (0, _utils.setStyle)($setting, 'left', null);
                (0, _utils.setStyle)($setting, 'right', null);
            } else {
                (0, _utils.setStyle)($setting, 'left', `${settingLeft}px`);
                (0, _utils.setStyle)($setting, 'right', 'auto');
            }
        }
    }
    inactivate(item) {
        for(let index = 0; index < item.$events.length; index++)this.art.events.remove(item.$events[index]);
        item.$events.length = 0;
    }
    remove(name) {
        const item = this.find(name);
        (0, _utils.errorHandle)(item, `Can't find [${name}] in the [setting]`);
        const index = item.$option.indexOf(item);
        item.$option.splice(index, 1);
        this.inactivate(item);
        if (item.$item) (0, _utils.remove)(item.$item);
        this.render();
    }
    update(target) {
        const item = this.find(target.name);
        if (item) {
            this.inactivate(item);
            Object.assign(item, target);
            this.format();
            this.createItem(item, true);
            this.render();
            return item;
        } else return this.add(target);
    }
    add(item, option = this.option) {
        option.push(item);
        this.format();
        this.createItem(item);
        this.render();
        return item;
    }
    createHeader(item) {
        if (!this.cache.has(item.$option)) return;
        const $panel = this.cache.get(item.$option);
        const { proxy, icons: { arrowLeft }, constructor: { SETTING_ITEM_HEIGHT } } = this.art;
        const $item = (0, _utils.createElement)('div');
        (0, _utils.setStyle)($item, 'height', `${SETTING_ITEM_HEIGHT}px`);
        (0, _utils.addClass)($item, 'art-setting-item');
        (0, _utils.addClass)($item, 'art-setting-item-back');
        const $left = (0, _utils.append)($item, '<div class="art-setting-item-left"></div>');
        const $icon = (0, _utils.createElement)('div');
        (0, _utils.addClass)($icon, 'art-setting-item-left-icon');
        (0, _utils.append)($icon, arrowLeft);
        (0, _utils.append)($left, $icon);
        (0, _utils.append)($left, item.$parent.html);
        const event = proxy($item, 'click', ()=>this.render(item.$parents));
        item.$parent.$events.push(event);
        (0, _utils.append)($panel, $item);
    }
    createItem(item, isUpdate = false) {
        if (!this.cache.has(item.$option)) return;
        const $panel = this.cache.get(item.$option);
        const oldItem = item.$item;
        let type = 'selector';
        if ((0, _utils.has)(item, 'switch')) type = 'switch';
        if ((0, _utils.has)(item, 'range')) type = 'range';
        if ((0, _utils.has)(item, 'onClick')) type = 'button';
        const { icons, proxy, constructor } = this.art;
        const $item = (0, _utils.createElement)('div');
        (0, _utils.addClass)($item, 'art-setting-item');
        (0, _utils.setStyle)($item, 'height', `${constructor.SETTING_ITEM_HEIGHT}px`);
        $item.dataset.name = item.name || '';
        $item.dataset.value = item.value || '';
        const $left = (0, _utils.append)($item, '<div class="art-setting-item-left"></div>');
        const $right = (0, _utils.append)($item, '<div class="art-setting-item-right"></div>');
        const $icon = (0, _utils.createElement)('div');
        (0, _utils.addClass)($icon, 'art-setting-item-left-icon');
        switch(type){
            case 'button':
            case 'switch':
            case 'range':
                (0, _utils.append)($icon, item.icon || icons.config);
                break;
            case 'selector':
                if (item.selector?.length) (0, _utils.append)($icon, item.icon || icons.config);
                else (0, _utils.append)($icon, icons.check);
                break;
            default:
                break;
        }
        (0, _utils.append)($left, $icon);
        (0, _utils.def)(item, '$icon', {
            configurable: true,
            get: ()=>$icon
        });
        (0, _utils.def)(item, 'icon', {
            configurable: true,
            get () {
                return $icon.innerHTML;
            },
            set (value) {
                $icon.innerHTML = '';
                (0, _utils.append)($icon, value);
            }
        });
        const $html = (0, _utils.createElement)('div');
        (0, _utils.addClass)($html, 'art-setting-item-left-text');
        (0, _utils.append)($html, item.html || '');
        (0, _utils.append)($left, $html);
        (0, _utils.def)(item, '$html', {
            configurable: true,
            get: ()=>$html
        });
        (0, _utils.def)(item, 'html', {
            configurable: true,
            get () {
                return $html.innerHTML;
            },
            set (value) {
                $html.innerHTML = '';
                (0, _utils.append)($html, value);
            }
        });
        const $tooltip = (0, _utils.createElement)('div');
        (0, _utils.addClass)($tooltip, 'art-setting-item-right-tooltip');
        (0, _utils.append)($tooltip, item.tooltip || '');
        (0, _utils.append)($right, $tooltip);
        (0, _utils.def)(item, '$tooltip', {
            configurable: true,
            get: ()=>$tooltip
        });
        (0, _utils.def)(item, 'tooltip', {
            configurable: true,
            get () {
                return $tooltip.innerHTML;
            },
            set (value) {
                $tooltip.innerHTML = '';
                (0, _utils.append)($tooltip, value);
            }
        });
        switch(type){
            case 'switch':
                {
                    const $switch = (0, _utils.createElement)('div');
                    (0, _utils.addClass)($switch, 'art-setting-item-right-icon');
                    const $switchOn = (0, _utils.append)($switch, icons.switchOn);
                    const $switchOff = (0, _utils.append)($switch, icons.switchOff);
                    (0, _utils.setStyle)(item.switch ? $switchOff : $switchOn, 'display', 'none');
                    (0, _utils.append)($right, $switch);
                    (0, _utils.def)(item, '$switch', {
                        configurable: true,
                        get: ()=>$switch
                    });
                    let $switchValue = item.switch;
                    (0, _utils.def)(item, 'switch', {
                        configurable: true,
                        get: ()=>$switchValue,
                        set (value) {
                            $switchValue = value;
                            if (value) {
                                (0, _utils.setStyle)($switchOff, 'display', 'none');
                                (0, _utils.setStyle)($switchOn, 'display', null);
                            } else {
                                (0, _utils.setStyle)($switchOff, 'display', null);
                                (0, _utils.setStyle)($switchOn, 'display', 'none');
                            }
                        }
                    });
                    break;
                }
            case 'range':
                {
                    const $state = (0, _utils.createElement)('div');
                    (0, _utils.addClass)($state, 'art-setting-item-right-icon');
                    const $range = (0, _utils.append)($state, '<input type="range">');
                    $range.value = item.range[0];
                    $range.min = item.range[1];
                    $range.max = item.range[2];
                    $range.step = item.range[3];
                    (0, _utils.addClass)($range, 'art-setting-range');
                    (0, _utils.append)($right, $state);
                    (0, _utils.def)(item, '$range', {
                        configurable: true,
                        get: ()=>$range
                    });
                    let $rangeValue = [
                        ...item.range
                    ];
                    (0, _utils.def)(item, 'range', {
                        configurable: true,
                        get: ()=>$rangeValue,
                        set (value) {
                            $rangeValue = [
                                ...value
                            ];
                            $range.value = value[0];
                            $range.min = value[1];
                            $range.max = value[2];
                            $range.step = value[3];
                        }
                    });
                }
                break;
            case 'selector':
                if (item.selector?.length) {
                    const $state = (0, _utils.createElement)('div');
                    (0, _utils.addClass)($state, 'art-setting-item-right-icon');
                    (0, _utils.append)($state, icons.arrowRight);
                    (0, _utils.append)($right, $state);
                }
                break;
            default:
                break;
        }
        switch(type){
            case 'switch':
                if (item.onSwitch) {
                    const event = proxy($item, 'click', async (event)=>{
                        item.switch = await item.onSwitch.call(this.art, item, $item, event);
                    });
                    item.$events.push(event);
                }
                break;
            case 'range':
                if (item.$range) {
                    if (item.onRange) {
                        const event = proxy(item.$range, 'change', async (event)=>{
                            item.range[0] = item.$range.valueAsNumber;
                            item.tooltip = await item.onRange.call(this.art, item, $item, event);
                        });
                        item.$events.push(event);
                    }
                    if (item.onChange) {
                        const event = proxy(item.$range, 'input', async (event)=>{
                            item.range[0] = item.$range.valueAsNumber;
                            item.tooltip = await item.onChange.call(this.art, item, $item, event);
                        });
                        item.$events.push(event);
                    }
                }
                break;
            case 'selector':
                {
                    const event = proxy($item, 'click', async (event)=>{
                        if (item.selector?.length) this.render(item.selector);
                        else {
                            this.check(item);
                            if (item.$parent.onSelect) item.$parent.tooltip = await item.$parent.onSelect.call(this.art, item, $item, event);
                        }
                    });
                    item.$events.push(event);
                    if (item.default) (0, _utils.addClass)($item, 'art-current');
                }
                break;
            case 'button':
                if (item.onClick) {
                    const event = proxy($item, 'click', async (event)=>{
                        item.tooltip = await item.onClick.call(this.art, item, $item, event);
                    });
                    item.$events.push(event);
                }
                break;
            default:
                break;
        }
        (0, _utils.def)(item, '$item', {
            configurable: true,
            get: ()=>$item
        });
        if (isUpdate) (0, _utils.replaceElement)($item, oldItem);
        else (0, _utils.append)($panel, $item);
        if (item.mounted) setTimeout(()=>item.mounted.call(this.art, item.$item, item), 0);
    }
    render(option = this.option) {
        this.active = option;
        if (this.cache.has(option)) {
            const $panel = this.cache.get(option);
            (0, _utils.inverseClass)($panel, 'art-current');
        } else {
            const $panel = (0, _utils.createElement)('div');
            this.cache.set(option, $panel);
            (0, _utils.addClass)($panel, 'art-setting-panel');
            (0, _utils.append)(this.$parent, $panel);
            (0, _utils.inverseClass)($panel, 'art-current');
            if (option[0]?.$parent) this.createHeader(option[0]);
            for(let index = 0; index < option.length; index++)this.createItem(option[index]);
        }
        this.resize();
    }
}
exports.default = Setting;

},{"../utils":"gGxPm","../utils/component":"1wQH1","./aspectRatio":"g3wkQ","./flip":"dj3LV","./playbackRate":"33vMI","./subtitleOffset":"82BM5","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"g3wkQ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>aspectRatio);
function aspectRatio(art) {
    const { i18n, icons, constructor: { SETTING_ITEM_WIDTH, ASPECT_RATIO } } = art;
    function getI18n(value) {
        return value === 'default' ? i18n.get('Default') : value;
    }
    function update() {
        const target = art.setting.find(`aspect-ratio-${art.aspectRatio}`);
        art.setting.check(target);
    }
    return {
        width: SETTING_ITEM_WIDTH,
        name: 'aspect-ratio',
        html: i18n.get('Aspect Ratio'),
        icon: icons.aspectRatio,
        tooltip: getI18n(art.aspectRatio),
        selector: ASPECT_RATIO.map((item)=>{
            return {
                value: item,
                name: `aspect-ratio-${item}`,
                default: item === art.aspectRatio,
                html: getI18n(item)
            };
        }),
        onSelect (item) {
            art.aspectRatio = item.value;
            return item.html;
        },
        mounted: ()=>{
            update();
            art.on('aspectRatio', ()=>update());
        }
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"dj3LV":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>flip);
var _utils = require("../utils");
function flip(art) {
    const { i18n, icons, constructor: { SETTING_ITEM_WIDTH, FLIP } } = art;
    function getI18n(value) {
        return i18n.get((0, _utils.capitalize)(value));
    }
    function update() {
        const target = art.setting.find(`flip-${art.flip}`);
        art.setting.check(target);
    }
    return {
        width: SETTING_ITEM_WIDTH,
        name: 'flip',
        html: i18n.get('Video Flip'),
        tooltip: getI18n(art.flip),
        icon: icons.flip,
        selector: FLIP.map((item)=>{
            return {
                value: item,
                name: `flip-${item}`,
                default: item === art.flip,
                html: getI18n(item)
            };
        }),
        onSelect (item) {
            art.flip = item.value;
            return item.html;
        },
        mounted: ()=>{
            update();
            art.on('flip', ()=>update());
        }
    };
}

},{"../utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"33vMI":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>playbackRate);
function playbackRate(art) {
    const { i18n, icons, constructor: { SETTING_ITEM_WIDTH, PLAYBACK_RATE } } = art;
    function getI18n(value) {
        return value === 1.0 ? i18n.get('Normal') : value.toFixed(1);
    }
    function update() {
        const target = art.setting.find(`playback-rate-${art.playbackRate}`);
        art.setting.check(target);
    }
    return {
        width: SETTING_ITEM_WIDTH,
        name: 'playback-rate',
        html: i18n.get('Play Speed'),
        tooltip: getI18n(art.playbackRate),
        icon: icons.playbackRate,
        selector: PLAYBACK_RATE.map((item)=>{
            return {
                value: item,
                name: `playback-rate-${item}`,
                default: item === art.playbackRate,
                html: getI18n(item)
            };
        }),
        onSelect (item) {
            art.playbackRate = item.value;
            return item.html;
        },
        mounted: ()=>{
            update();
            art.on('video:ratechange', ()=>update());
        }
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"82BM5":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>subtitleOffset);
function subtitleOffset(art) {
    const { i18n, icons, constructor } = art;
    return {
        width: constructor.SETTING_ITEM_WIDTH,
        name: 'subtitle-offset',
        html: i18n.get('Subtitle Offset'),
        icon: icons.subtitle,
        tooltip: '0s',
        range: [
            0,
            -10,
            10,
            0.1
        ],
        onChange (item) {
            art.subtitleOffset = item.range[0];
            return `${item.range[0]}s`;
        },
        mounted: (_, item)=>{
            art.on('subtitleOffset', (value)=>{
                item.$range.value = value;
                item.tooltip = `${value}s`;
            });
        }
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"grHII":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class Storage {
    constructor(){
        this.name = 'artplayer_settings';
        this.settings = {};
    }
    get(key) {
        try {
            const storage = JSON.parse(window.localStorage.getItem(this.name)) || {};
            return key ? storage[key] : storage;
        } catch  {
            return key ? this.settings[key] : this.settings;
        }
    }
    set(key, value) {
        try {
            const storage = Object.assign({}, this.get(), {
                [key]: value
            });
            window.localStorage.setItem(this.name, JSON.stringify(storage));
        } catch  {
            this.settings[key] = value;
        }
    }
    del(key) {
        try {
            const storage = this.get();
            delete storage[key];
            window.localStorage.setItem(this.name, JSON.stringify(storage));
        } catch  {
            delete this.settings[key];
        }
    }
    clear() {
        try {
            window.localStorage.removeItem(this.name);
        } catch  {
            this.settings = {};
        }
    }
}
exports.default = Storage;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"hxr0l":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _optionValidator = require("option-validator");
var _optionValidatorDefault = parcelHelpers.interopDefault(_optionValidator);
var _scheme = require("./scheme");
var _schemeDefault = parcelHelpers.interopDefault(_scheme);
var _utils = require("./utils");
var _component = require("./utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
class Subtitle extends (0, _componentDefault.default) {
    constructor(art){
        super(art);
        this.name = 'subtitle';
        this.option = null;
        this.destroyEvent = ()=>null;
        this.init(art.option.subtitle);
        let lastState = false;
        art.on('video:timeupdate', ()=>{
            if (!this.url) return;
            const state = this.art.template.$video.webkitDisplayingFullscreen;
            if (typeof state !== 'boolean') return;
            if (state !== lastState) {
                lastState = state;
                this.createTrack(state ? 'subtitles' : 'metadata', this.url);
            }
        });
    }
    get url() {
        return this.art.template.$track.src;
    }
    set url(url) {
        this.switch(url);
    }
    get textTrack() {
        return this.art.template.$video?.textTracks?.[0];
    }
    get activeCues() {
        if (!this.textTrack) return [];
        return Array.from(this.textTrack.activeCues);
    }
    get cues() {
        if (!this.textTrack) return [];
        return Array.from(this.textTrack.cues);
    }
    style(key, value) {
        const { $subtitle } = this.art.template;
        if (typeof key === 'object') return (0, _utils.setStyles)($subtitle, key);
        return (0, _utils.setStyle)($subtitle, key, value);
    }
    update() {
        const { option: { subtitle }, template: { $subtitle } } = this.art;
        $subtitle.innerHTML = '';
        if (!this.activeCues.length) return;
        this.art.emit('subtitleBeforeUpdate', this.activeCues);
        $subtitle.innerHTML = this.activeCues.map((cue, index)=>cue.text.split(/\r?\n/).filter((line)=>line.trim()).map((line)=>`<div class="art-subtitle-line" data-group="${index}">
                                ${subtitle.escape ? (0, _utils.escape)(line) : line}
                            </div>`).join('')).join('');
        this.art.emit('subtitleAfterUpdate', this.activeCues);
    }
    async switch(url, newOption = {}) {
        const { i18n, notice, option } = this.art;
        const subtitleOption = {
            ...option.subtitle,
            ...newOption,
            url
        };
        const subUrl = await this.init(subtitleOption);
        if (newOption.name) notice.show = `${i18n.get('Switch Subtitle')}: ${newOption.name}`;
        return subUrl;
    }
    createTrack(kind, url) {
        const { template, proxy, option } = this.art;
        const { $video, $track } = template;
        const $newTrack = (0, _utils.createElement)('track');
        $newTrack.default = true;
        $newTrack.kind = kind;
        $newTrack.src = url;
        $newTrack.label = option.subtitle.name || 'Artplayer';
        $newTrack.track.mode = 'hidden';
        $newTrack.onload = ()=>{
            this.art.emit('subtitleLoad', this.cues, this.option);
        };
        this.art.events.remove(this.destroyEvent);
        $track.onload = null;
        (0, _utils.remove)($track);
        (0, _utils.append)($video, $newTrack);
        template.$track = $newTrack;
        this.destroyEvent = proxy(this.textTrack, 'cuechange', ()=>this.update());
    }
    async init(subtitleOption) {
        const { notice, template: { $subtitle } } = this.art;
        if (!this.textTrack) return null;
        (0, _optionValidatorDefault.default)(subtitleOption, (0, _schemeDefault.default).subtitle);
        if (!subtitleOption.url) return;
        this.option = subtitleOption;
        this.style(subtitleOption.style);
        return fetch(subtitleOption.url).then((response)=>response.arrayBuffer()).then((buffer)=>{
            const decoder = new TextDecoder(subtitleOption.encoding);
            const text = decoder.decode(buffer);
            switch(subtitleOption.type || (0, _utils.getExt)(subtitleOption.url)){
                case 'srt':
                    {
                        const vtt = (0, _utils.srtToVtt)(text);
                        const vttNew = subtitleOption.onVttLoad(vtt);
                        return (0, _utils.vttToBlob)(vttNew);
                    }
                case 'ass':
                    {
                        const vtt = (0, _utils.assToVtt)(text);
                        const vttNew = subtitleOption.onVttLoad(vtt);
                        return (0, _utils.vttToBlob)(vttNew);
                    }
                case 'vtt':
                    {
                        const vttNew = subtitleOption.onVttLoad(text);
                        return (0, _utils.vttToBlob)(vttNew);
                    }
                default:
                    return subtitleOption.url;
            }
        }).then((subUrl)=>{
            $subtitle.innerHTML = '';
            if (this.url === subUrl) return subUrl;
            URL.revokeObjectURL(this.url);
            this.createTrack('metadata', subUrl);
            return subUrl;
        }).catch((err)=>{
            $subtitle.innerHTML = '';
            notice.show = err;
            throw err;
        });
    }
}
exports.default = Subtitle;

},{"option-validator":"9hUEm","./scheme":"8YPbR","./utils":"gGxPm","./utils/component":"1wQH1","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"5JwMQ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _packageJson = require("../package.json");
var _utils = require("./utils");
class Template {
    constructor(art){
        this.art = art;
        const { option, constructor } = art;
        if (option.container instanceof Element) this.$container = option.container;
        else {
            this.$container = (0, _utils.query)(option.container);
            (0, _utils.errorHandle)(this.$container, `No container element found by ${option.container}`);
        }
        (0, _utils.errorHandle)((0, _utils.supportsFlex)(), 'The current browser does not support flex layout');
        const type = this.$container.tagName.toLowerCase();
        (0, _utils.errorHandle)(type === 'div', `Unsupported container element type, only support 'div' but got '${type}'`);
        (0, _utils.errorHandle)(constructor.instances.every((ins)=>ins.template.$container !== this.$container), 'Cannot mount multiple instances on the same dom element');
        this.query = this.query.bind(this);
        this.$container.dataset.artId = art.id;
        this.init();
    }
    static get html() {
        return `
          <div class="art-video-player art-subtitle-show art-layer-show art-control-show art-mask-show">
            <video class="art-video">
              <track default kind="metadata" src=""></track>
            </video>
            <div class="art-poster"></div>
            <div class="art-subtitle"></div>
            <div class="art-danmuku"></div>
            <div class="art-layers"></div>
            <div class="art-mask">
              <div class="art-state"></div>
            </div>
            <div class="art-bottom">
              <div class="art-progress"></div>
              <div class="art-controls">
                <div class="art-controls-left"></div>
                <div class="art-controls-center"></div>
                <div class="art-controls-right"></div>
              </div>
            </div>
            <div class="art-loading"></div>
            <div class="art-notice">
              <div class="art-notice-inner"></div>
            </div>
            <div class="art-settings"></div>
            <div class="art-info">
              <div class="art-info-panel">
                <div class="art-info-item">
                  <div class="art-info-title">Player version:</div>
                  <div class="art-info-content">${0, _packageJson.version}</div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video url:</div>
                  <div class="art-info-content" data-video="currentSrc"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video volume:</div>
                  <div class="art-info-content" data-video="volume"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video time:</div>
                  <div class="art-info-content" data-video="currentTime"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video duration:</div>
                  <div class="art-info-content" data-video="duration"></div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video resolution:</div>
                  <div class="art-info-content">
                    <span data-video="videoWidth"></span> x <span data-video="videoHeight"></span>
                  </div>
                </div>
              </div>
              <div class="art-info-close">[x]</div>
            </div>
            <div class="art-contextmenus"></div>
          </div>
        `;
    }
    query(className) {
        return (0, _utils.query)(className, this.$container);
    }
    init() {
        const { option } = this.art;
        if (!option.useSSR) this.$container.innerHTML = Template.html;
        this.$player = this.query('.art-video-player');
        this.$video = this.query('.art-video');
        this.$track = this.query('track');
        this.$poster = this.query('.art-poster');
        this.$subtitle = this.query('.art-subtitle');
        this.$danmuku = this.query('.art-danmuku');
        this.$bottom = this.query('.art-bottom');
        this.$progress = this.query('.art-progress');
        this.$controls = this.query('.art-controls');
        this.$controlsLeft = this.query('.art-controls-left');
        this.$controlsCenter = this.query('.art-controls-center');
        this.$controlsRight = this.query('.art-controls-right');
        this.$layer = this.query('.art-layers');
        this.$loading = this.query('.art-loading');
        this.$notice = this.query('.art-notice');
        this.$noticeInner = this.query('.art-notice-inner');
        this.$mask = this.query('.art-mask');
        this.$state = this.query('.art-state');
        this.$setting = this.query('.art-settings');
        this.$info = this.query('.art-info');
        this.$infoPanel = this.query('.art-info-panel');
        this.$infoClose = this.query('.art-info-close');
        this.$contextmenu = this.query('.art-contextmenus');
        if (option.proxy) {
            const video = option.proxy.call(this.art, this.art);
            (0, _utils.errorHandle)(video instanceof HTMLVideoElement || video instanceof HTMLCanvasElement, `Function 'option.proxy' needs to return 'HTMLVideoElement' or 'HTMLCanvasElement'`);
            (0, _utils.replaceElement)(video, this.$video);
            video.className = 'art-video';
            this.$video = video;
        }
        if (option.backdrop) (0, _utils.addClass)(this.$player, 'art-backdrop');
        if (0, _utils.isMobile) (0, _utils.addClass)(this.$player, 'art-mobile');
    }
    destroy(removeHtml) {
        if (removeHtml) this.$container.innerHTML = '';
        else (0, _utils.addClass)(this.$player, 'art-destroy');
    }
}
exports.default = Template;

},{"../package.json":"3r4tp","./utils":"gGxPm","@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}],"2qvfs":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class Emitter {
    on(name, fn, ctx) {
        const e = this.e || (this.e = {});
        (e[name] || (e[name] = [])).push({
            fn,
            ctx
        });
        return this;
    }
    once(name, fn, ctx) {
        const self = this;
        function listener(...args) {
            self.off(name, listener);
            fn.apply(ctx, args);
        }
        listener._ = fn;
        return this.on(name, listener, ctx);
    }
    emit(name, ...data) {
        const evtArr = ((this.e || (this.e = {}))[name] || []).slice();
        for(let i = 0; i < evtArr.length; i += 1)evtArr[i].fn.apply(evtArr[i].ctx, data);
        return this;
    }
    off(name, callback) {
        const e = this.e || (this.e = {});
        const evts = e[name];
        const liveEvents = [];
        if (evts && callback) {
            for(let i = 0, len = evts.length; i < len; i += 1)if (evts[i].fn !== callback && evts[i].fn._ !== callback) liveEvents.push(evts[i]);
        }
        if (liveEvents.length) e[name] = liveEvents;
        else delete e[name];
        return this;
    }
}
exports.default = Emitter;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"8oCsH"}]},["jHWOm"], "jHWOm", "parcelRequire4dc0", {})

//# sourceMappingURL=index.js.map

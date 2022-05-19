// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
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

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
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
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

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

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"eFv8l":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _indexLess = require("bundle-text:./style/index.less");
var _indexLessDefault = parcelHelpers.interopDefault(_indexLess);
var _optionValidator = require("option-validator");
var _optionValidatorDefault = parcelHelpers.interopDefault(_optionValidator);
var _emitter = require("./utils/emitter");
var _emitterDefault = parcelHelpers.interopDefault(_emitter);
var _utils = require("./utils");
var _scheme = require("./scheme");
var _schemeDefault = parcelHelpers.interopDefault(_scheme);
var _config = require("./config");
var _configDefault = parcelHelpers.interopDefault(_config);
var _whitelist = require("./whitelist");
var _whitelistDefault = parcelHelpers.interopDefault(_whitelist);
var _template = require("./template");
var _templateDefault = parcelHelpers.interopDefault(_template);
var _i18N = require("./i18n");
var _i18NDefault = parcelHelpers.interopDefault(_i18N);
var _player = require("./player");
var _playerDefault = parcelHelpers.interopDefault(_player);
var _control = require("./control");
var _controlDefault = parcelHelpers.interopDefault(_control);
var _contextmenu = require("./contextmenu");
var _contextmenuDefault = parcelHelpers.interopDefault(_contextmenu);
var _info = require("./info");
var _infoDefault = parcelHelpers.interopDefault(_info);
var _subtitle = require("./subtitle");
var _subtitleDefault = parcelHelpers.interopDefault(_subtitle);
var _events = require("./events");
var _eventsDefault = parcelHelpers.interopDefault(_events);
var _hotkey = require("./hotkey");
var _hotkeyDefault = parcelHelpers.interopDefault(_hotkey);
var _layer = require("./layer");
var _layerDefault = parcelHelpers.interopDefault(_layer);
var _loading = require("./loading");
var _loadingDefault = parcelHelpers.interopDefault(_loading);
var _notice = require("./notice");
var _noticeDefault = parcelHelpers.interopDefault(_notice);
var _mask = require("./mask");
var _maskDefault = parcelHelpers.interopDefault(_mask);
var _icons = require("./icons");
var _iconsDefault = parcelHelpers.interopDefault(_icons);
var _setting = require("./setting");
var _settingDefault = parcelHelpers.interopDefault(_setting);
var _storage = require("./storage");
var _storageDefault = parcelHelpers.interopDefault(_storage);
var _plugins = require("./plugins");
var _pluginsDefault = parcelHelpers.interopDefault(_plugins);
var _ads = require("./ads");
var _adsDefault = parcelHelpers.interopDefault(_ads);
var _mobile = require("./mobile");
var _mobileDefault = parcelHelpers.interopDefault(_mobile);
let id = 0;
const instances = [];
class Artplayer extends _emitterDefault.default {
    constructor(option, readyCallback){
        super();
        this.id = ++id;
        const mergeOption = _utils.mergeDeep(Artplayer.option, option);
        this.option = _optionValidatorDefault.default(mergeOption, _schemeDefault.default);
        this.isLock = false;
        this.isReady = false;
        this.isFocus = false;
        this.isInput = false;
        this.isDestroy = false;
        this.whitelist = new _whitelistDefault.default(this);
        this.template = new _templateDefault.default(this);
        this.events = new _eventsDefault.default(this);
        if (this.whitelist.state) {
            this.storage = new _storageDefault.default(this);
            this.icons = new _iconsDefault.default(this);
            this.i18n = new _i18NDefault.default(this);
            this.notice = new _noticeDefault.default(this);
            this.player = new _playerDefault.default(this);
            this.layers = new _layerDefault.default(this);
            this.controls = new _controlDefault.default(this);
            this.contextmenu = new _contextmenuDefault.default(this);
            this.subtitle = new _subtitleDefault.default(this);
            this.ads = new _adsDefault.default(this);
            this.info = new _infoDefault.default(this);
            this.loading = new _loadingDefault.default(this);
            this.hotkey = new _hotkeyDefault.default(this);
            this.mask = new _maskDefault.default(this);
            this.setting = new _settingDefault.default(this);
            this.plugins = new _pluginsDefault.default(this);
        } else this.mobile = new _mobileDefault.default(this);
        if (typeof readyCallback === 'function') this.on('ready', ()=>readyCallback.call(this)
        );
        instances.push(this);
    }
    static get instances() {
        return instances;
    }
    static get version() {
        return "4.4.2";
    }
    static get env() {
        return "development";
    }
    static get build() {
        return "1652921858729";
    }
    static get config() {
        return _configDefault.default;
    }
    static get utils() {
        return _utils;
    }
    static get scheme() {
        return _schemeDefault.default;
    }
    static get Emitter() {
        return _emitterDefault.default;
    }
    static get validator() {
        return _optionValidatorDefault.default;
    }
    static get kindOf() {
        return _optionValidatorDefault.default.kindOf;
    }
    static get html() {
        return _templateDefault.default.html;
    }
    static get option() {
        return {
            container: '#artplayer',
            url: '',
            poster: '',
            title: '',
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
            fastForward: false,
            autoPlayback: false,
            autoOrientation: false,
            ads: [],
            layers: [],
            contextmenu: [],
            controls: [],
            settings: [],
            quality: [],
            highlight: [],
            plugins: [],
            whitelist: [],
            thumbnails: {
                url: '',
                number: 60,
                column: 10
            },
            subtitle: {
                url: '',
                type: '',
                style: {},
                encoding: 'utf-8'
            },
            moreVideoAttr: {
                controls: false,
                preload: _utils.isSafari ? 'auto' : 'metadata'
            },
            icons: {},
            customType: {},
            lang: navigator.language.toLowerCase()
        };
    }
    get proxy() {
        return this.events.proxy;
    }
    get query() {
        return this.template.query;
    }
    destroy(removeHtml = true) {
        this.events.destroy();
        this.template.destroy(removeHtml);
        instances.splice(instances.indexOf(this), 1);
        this.isDestroy = true;
        this.emit('destroy');
    }
}
exports.default = Artplayer;
Artplayer.NOTICE_TIME = 2000;
Artplayer.SETTING_WIDTH = 250;
Artplayer.SETTING_ITEM_WIDTH = 200;
Artplayer.SETTING_ITEM_HEIGHT = 35;
Artplayer.INDICATOR_SIZE = 14;
Artplayer.INDICATOR_SIZE_ICON = 16;
Artplayer.INDICATOR_SIZE_MOBILE = 18;
Artplayer.INDICATOR_SIZE_MOBILE_ICON = 20;
Artplayer.VOLUME_PANEL_WIDTH = 60;
Artplayer.VOLUME_HANDLE_WIDTH = 12;
Artplayer.RESIZE_TIME = 500;
Artplayer.SCROLL_TIME = 200;
Artplayer.SCROLL_GAP = 50;
Artplayer.AUTO_PLAYBACK_MAX = 10;
Artplayer.RECONNECT_TIME_MAX = 5;
Artplayer.RECONNECT_SLEEP_TIME = 1000;
Artplayer.CONTROL_HIDE_TIME = 3000;
Artplayer.DB_CLICE_TIME = 300;
Artplayer.MOBILE_AUTO_PLAYBACKRATE = 3;
Artplayer.MOBILE_AUTO_PLAYBACKRATE_TIME = 1000;
Artplayer.MOBILE_AUTO_ORIENTATION_TIME = 200;
Artplayer.INFO_LOOP_TIME = 1000;
Artplayer.FAST_FORWARD_VALUE = 3;
Artplayer.FAST_FORWARD_TIME = 1000;
if (typeof document !== 'undefined') {
    if (!document.getElementById('artplayer-style')) {
        const $style = document.createElement('style');
        $style.id = 'artplayer-style';
        $style.textContent = _indexLessDefault.default;
        document.head.appendChild($style);
    }
}
if (typeof window !== 'undefined') window['Artplayer'] = Artplayer;
// eslint-disable-next-line no-console
console.log(`%c ArtPlayer %c ${Artplayer.version} %c https://artplayer.org`, 'color: #fff; background: #5f5f5f', 'color: #fff; background: #4bc729', '');

},{"bundle-text:./style/index.less":"SvnDa","option-validator":"i7tUx","./utils/emitter":"elSLF","./utils":"jmgNb","./scheme":"gL38d","./config":"2ZnKD","./whitelist":"gd0pl","./template":"bDTDS","./i18n":"k0CtI","./player":"35XKf","./control":"faO0X","./contextmenu":"5npaZ","./info":"6vVKE","./subtitle":"4exyO","./events":"dz5ul","./hotkey":"1nFqF","./layer":"fvy8V","./loading":"h8KPY","./notice":"cr1XY","./mask":"llnR4","./icons":"gP6M7","./setting":"e5Aaq","./storage":"feFxw","./plugins":"h1hfO","./ads":"gqroK","./mobile":"c9n1Y","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"SvnDa":[function(require,module,exports) {
module.exports = ".art-video-player {\n  z-index: 20;\n  width: 100%;\n  height: 100%;\n  zoom: 1;\n  color: #eee;\n  text-align: left;\n  direction: ltr;\n  user-select: none;\n  -webkit-tap-highlight-color: #0000;\n  touch-action: manipulation;\n  -ms-high-contrast-adjust: none;\n  background-color: #000;\n  outline: none;\n  margin: 0 auto;\n  font-family: Roboto, Arial, Helvetica, sans-serif;\n  font-size: 14px;\n  line-height: 1.3;\n  display: flex;\n  position: relative;\n}\n\n.art-video-player *, .art-video-player :before, .art-video-player :after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\n.art-video-player ::-webkit-scrollbar {\n  width: 5px;\n  height: 5px;\n}\n\n.art-video-player ::-webkit-scrollbar-thumb {\n  background-color: #666;\n}\n\n.art-video-player ::-webkit-scrollbar-thumb:hover {\n  background-color: #ccc;\n}\n\n.art-video-player .art-icon {\n  justify-content: center;\n  align-items: center;\n  line-height: 1.5;\n  display: inline-flex;\n}\n\n.art-video-player .art-icon svg {\n  fill: #fff;\n}\n\n.art-video-player img {\n  max-width: 100%;\n  vertical-align: top;\n}\n\n@supports ((-webkit-backdrop-filter: initial) or (backdrop-filter: initial)) {\n  .art-video-player .art-backdrop-filter {\n    -webkit-backdrop-filter: saturate(180%) blur(20px);\n    backdrop-filter: saturate(180%) blur(20px);\n    background-color: #000000b3 !important;\n  }\n}\n\n.art-video-player .art-video {\n  z-index: 10;\n  width: 100%;\n  height: 100%;\n  cursor: pointer;\n  background-color: #000;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-poster {\n  z-index: 11;\n  width: 100%;\n  height: 100%;\n  user-select: none;\n  pointer-events: none;\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-subtitle {\n  z-index: 20;\n  width: 100%;\n  text-align: center;\n  color: #fff;\n  pointer-events: none;\n  text-shadow: 1px 0 1px #000, 0 1px 1px #000, -1px 0 1px #000, 0 -1px 1px #000, 1px 1px 1px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000;\n  padding: 0 20px;\n  font-size: 20px;\n  display: none;\n  position: absolute;\n  bottom: 10px;\n}\n\n.art-video-player .art-subtitle p {\n  word-break: break-all;\n  height: fit-content;\n  margin: 5px 0 0;\n  line-height: 1.2;\n}\n\n.art-video-player.art-subtitle-show .art-subtitle {\n  display: block;\n}\n\n.art-video-player.art-control-show .art-subtitle {\n  bottom: 50px;\n}\n\n.art-video-player .art-danmuku {\n  z-index: 30;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n}\n\n.art-video-player .art-layers {\n  z-index: 40;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  display: none;\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n}\n\n.art-video-player .art-layers .art-layer {\n  pointer-events: auto;\n}\n\n.art-video-player.art-layer-show .art-layers {\n  display: block;\n}\n\n.art-video-player .art-mask {\n  z-index: 50;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  justify-content: center;\n  align-items: center;\n  display: none;\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n}\n\n.art-video-player .art-mask .art-state {\n  width: 60px;\n  height: 60px;\n  opacity: .85;\n  cursor: pointer;\n  pointer-events: all;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n  position: absolute;\n  bottom: 65px;\n  right: 30px;\n}\n\n.art-video-player.art-mask-show .art-mask {\n  display: flex;\n}\n\n.art-video-player.art-mobile .art-state {\n  position: static;\n}\n\n.art-video-player .art-loading {\n  z-index: 70;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  justify-content: center;\n  align-items: center;\n  display: none;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player.art-loading-show .art-loading {\n  display: flex;\n}\n\n.art-video-player .art-bottom {\n  z-index: 60;\n  height: 100px;\n  opacity: 0;\n  visibility: hidden;\n  pointer-events: none;\n  background-image: linear-gradient(to top, #000, #0006, #0000);\n  background-position: bottom;\n  background-repeat: repeat-x;\n  flex-direction: column;\n  justify-content: space-between;\n  padding: 50px 10px 0;\n  transition: all .2s ease-in-out;\n  display: flex;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n}\n\n.art-video-player .art-bottom .art-progress {\n  z-index: 0;\n  pointer-events: auto;\n  flex: 1;\n  position: relative;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress {\n  height: 4px;\n  cursor: pointer;\n  flex-direction: row;\n  align-items: center;\n  display: flex;\n  position: relative;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner {\n  height: 50%;\n  width: 100%;\n  background: #fff3;\n  align-items: center;\n  display: flex;\n  position: relative;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-loaded {\n  z-index: 10;\n  height: 100%;\n  width: 0;\n  background: #fff6;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-played {\n  z-index: 20;\n  height: 100%;\n  width: 0;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight {\n  z-index: 30;\n  height: 100%;\n  pointer-events: none;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight span {\n  width: 7px;\n  height: 100%;\n  pointer-events: auto;\n  background: #fff;\n  display: inline-block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator {\n  visibility: hidden;\n  z-index: 40;\n  border-radius: 50%;\n  justify-content: center;\n  align-items: center;\n  transition: transform .1s ease-in-out;\n  position: absolute;\n  transform: scale(.1);\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator .art-icon {\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  user-select: none;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-tip {\n  z-index: 50;\n  height: 20px;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  background: #000000b3;\n  border-radius: 3px;\n  padding: 0 5px;\n  font-size: 12px;\n  font-weight: bold;\n  line-height: 20px;\n  display: none;\n  position: absolute;\n  top: -25px;\n  left: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-thumbnails {\n  pointer-events: none;\n  background-color: #000000b3;\n  display: none;\n  position: absolute;\n  bottom: 8px;\n  left: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-loop {\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  display: none;\n  position: absolute;\n  inset: 0;\n}\n\n.art-video-player .art-bottom .art-progress .art-control-loop .art-loop-point {\n  width: 2px;\n  height: 8px;\n  background: #ffffffbf;\n  position: absolute;\n  top: -2px;\n  left: 0;\n}\n\n.art-video-player .art-bottom .art-controls {\n  z-index: 1;\n  pointer-events: auto;\n  height: 45px;\n  justify-content: space-between;\n  align-items: center;\n  display: flex;\n  position: relative;\n}\n\n.art-video-player .art-bottom .art-controls .art-controls-left, .art-video-player .art-bottom .art-controls .art-controls-right {\n  display: flex;\n}\n\n.art-video-player .art-bottom .art-controls .art-controls-center {\n  height: 100%;\n  flex: 1;\n  justify-content: center;\n  align-items: center;\n  padding: 0 10px;\n  display: flex;\n}\n\n.art-video-player .art-bottom .art-controls .art-controls-right {\n  justify-content: flex-end;\n}\n\n.art-video-player .art-bottom .art-controls .art-control {\n  opacity: .9;\n  min-height: 36px;\n  min-width: 36px;\n  text-align: center;\n  cursor: pointer;\n  white-space: nowrap;\n  justify-content: center;\n  align-items: center;\n  font-size: 12px;\n  line-height: 1;\n  display: flex;\n}\n\n.art-video-player .art-bottom .art-controls .art-control .art-icon {\n  float: left;\n  height: 36px;\n  width: 36px;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-bottom .art-controls .art-control:hover {\n  opacity: 1;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-onlyText {\n  padding: 0 10px;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel {\n  float: left;\n  width: 0;\n  height: 100%;\n  transition: margin .2s cubic-bezier(.4, 0, 1, 1), width .2s cubic-bezier(.4, 0, 1, 1);\n  position: relative;\n  overflow: hidden;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle {\n  width: 12px;\n  height: 12px;\n  background: #fff;\n  border-radius: 12px;\n  margin-top: -6px;\n  position: absolute;\n  top: 50%;\n  left: 0;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:before {\n  background: #fff;\n  left: -54px;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:after {\n  background: #fff3;\n  left: 6px;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:before, .art-video-player .art-bottom .art-controls .art-control-volume .art-volume-panel .art-volume-slider-handle:after {\n  content: \"\";\n  height: 3px;\n  width: 60px;\n  margin-top: -2px;\n  display: block;\n  position: absolute;\n  top: 50%;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-volume:hover .art-volume-panel {\n  width: 60px;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-quality {\n  z-index: 30;\n  position: relative;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-quality .art-qualitys {\n  width: 100px;\n  text-align: center;\n  color: #fff;\n  background: #000c;\n  border-radius: 3px;\n  padding: 5px 0;\n  display: none;\n  position: absolute;\n  bottom: 35px;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-quality .art-qualitys .art-quality-item {\n  height: 30px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  text-shadow: 0 0 2px #00000080;\n  line-height: 30px;\n  overflow: hidden;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-quality .art-qualitys .art-quality-item:hover {\n  background-color: #ffffff1a;\n}\n\n.art-video-player .art-bottom .art-controls .art-control-quality:hover .art-qualitys {\n  display: block;\n}\n\n.art-video-player .art-bottom:hover .art-progress .art-control-progress .art-control-progress-inner {\n  height: 100%;\n}\n\n.art-video-player .art-bottom:hover .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator {\n  visibility: visible;\n  transform: scale(1);\n}\n\n.art-video-player.art-control-show .art-bottom, .art-video-player.art-hover .art-bottom {\n  opacity: 1;\n  visibility: visible;\n}\n\n.art-video-player.art-error .art-progress-indicator, .art-video-player.art-destroy .art-progress-indicator, .art-video-player.art-error .art-progress-tip, .art-video-player.art-destroy .art-progress-tip {\n  display: none !important;\n}\n\n.art-video-player.art-mobile .art-bottom {\n  padding: 50px 7px 0;\n}\n\n.art-video-player.art-mobile .art-bottom .art-controls {\n  height: 40px;\n}\n\n.art-video-player.art-mobile .art-bottom .art-progress-indicator {\n  visibility: visible !important;\n  transform: scale(1) !important;\n}\n\n.art-video-player .art-notice {\n  z-index: 80;\n  width: 100%;\n  pointer-events: none;\n  padding: 10px;\n  font-size: 14px;\n  display: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.art-video-player .art-notice .art-notice-inner {\n  color: #fff;\n  background-color: #0009;\n  border-radius: 3px;\n  padding: 5px 10px;\n  display: inline-block;\n}\n\n.art-video-player.art-notice-show .art-notice {\n  display: flex;\n}\n\n.art-video-player .art-contextmenus {\n  z-index: 120;\n  min-width: 200px;\n  background-color: #000000e6;\n  border-radius: 3px;\n  flex-direction: column;\n  padding: 5px 0;\n  display: none;\n  position: absolute;\n  top: 10px;\n  left: 10px;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu {\n  cursor: pointer;\n  color: #fff;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  text-shadow: 0 0 2px #00000080;\n  border-bottom: 1px solid #ffffff1a;\n  padding: 10px 15px;\n  font-size: 12px;\n  display: block;\n  overflow: hidden;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu a {\n  color: #fff;\n  text-decoration: none;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu span {\n  padding: 0 7px;\n  display: inline-block;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu span:hover, .art-video-player .art-contextmenus .art-contextmenu span.art-current {\n  color: #00c9ff;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu:hover {\n  background-color: #ffffff1a;\n}\n\n.art-video-player .art-contextmenus .art-contextmenu:last-child {\n  border-bottom: none;\n}\n\n.art-video-player.art-contextmenu-show .art-contextmenus {\n  display: flex;\n}\n\n.art-video-player .art-settings {\n  z-index: 90;\n  height: auto;\n  max-height: 300px;\n  background-color: #000000e6;\n  border-radius: 3px;\n  font-size: 13px;\n  transition: all .2s;\n  display: none;\n  position: absolute;\n  bottom: 50px;\n  right: 10px;\n  overflow: auto;\n}\n\n.art-video-player .art-settings .art-setting-panel {\n  display: none;\n}\n\n.art-video-player .art-settings .art-setting-panel.art-current {\n  display: block;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item {\n  height: 35px;\n  cursor: pointer;\n  color: #fffc;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 5px;\n  line-height: 1;\n  display: flex;\n  overflow: hidden;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item:hover, .art-video-player .art-settings .art-setting-panel .art-setting-item.art-current {\n  color: #fff;\n  background-color: #ffffff1a;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-icon {\n  width: 30px;\n  height: 30px;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-icon-check {\n  visibility: hidden;\n  height: 15px;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item.art-current .art-icon-check {\n  visibility: visible;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left {\n  white-space: nowrap;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left .art-setting-item-left-icon {\n  height: 24px;\n  width: 24px;\n  justify-content: center;\n  align-items: center;\n  margin-right: 10px;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right {\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-tooltip {\n  white-space: nowrap;\n  color: #ffffff80;\n  margin-right: 5px;\n  font-size: 12px;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-icon {\n  height: 24px;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-range {\n  height: 3px;\n  width: 80px;\n  appearance: none;\n  background-color: #fff3;\n  outline: none;\n}\n\n.art-video-player .art-settings .art-setting-panel .art-setting-item-back {\n  border-bottom: 1px solid #ffffff1a;\n}\n\n.art-video-player.art-setting-show .art-settings {\n  display: block;\n}\n\n.art-video-player.art-mobile .art-settings {\n  max-height: 200px;\n}\n\n.art-video-player .art-info {\n  z-index: 100;\n  width: 350px;\n  color: #fff;\n  -webkit-font-smoothing: antialiased;\n  background-color: #000000e6;\n  flex-direction: column;\n  padding: 10px;\n  font-family: Noto Sans CJK SC DemiLight, Roboto, Segoe UI, Tahoma, Arial, Helvetica, sans-serif;\n  font-size: 12px;\n  display: none;\n  position: absolute;\n  top: 10px;\n  left: 10px;\n}\n\n.art-video-player .art-info .art-info-item {\n  margin-bottom: 5px;\n  display: flex;\n}\n\n.art-video-player .art-info .art-info-item .art-info-title {\n  width: 100px;\n  text-align: right;\n}\n\n.art-video-player .art-info .art-info-item .art-info-content {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n  padding-left: 5px;\n  overflow: hidden;\n}\n\n.art-video-player .art-info .art-info-item:last-child {\n  margin-bottom: 0;\n}\n\n.art-video-player .art-info .art-info-close {\n  cursor: pointer;\n  position: absolute;\n  top: 5px;\n  right: 5px;\n}\n\n.art-video-player.art-info-show .art-info {\n  display: flex;\n}\n\n.art-video-player.art-hide-cursor * {\n  cursor: none !important;\n}\n\n.art-video-player[data-aspect-ratio] video {\n  box-sizing: content-box;\n  object-fit: fill;\n}\n\n.art-video-player.art-fullscreen-web {\n  z-index: 9999;\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  inset: 0;\n}\n\n.art-video-player .art-mini-header {\n  z-index: 110;\n  height: 35px;\n  color: #fff;\n  opacity: 0;\n  visibility: hidden;\n  background-color: #00000080;\n  justify-content: space-between;\n  align-items: center;\n  line-height: 35px;\n  transition: all .2s ease-in-out;\n  display: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n}\n\n.art-video-player .art-mini-header .art-mini-title {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: move;\n  flex: 1;\n  padding: 0 10px;\n  overflow: hidden;\n}\n\n.art-video-player .art-mini-header .art-mini-close {\n  width: 35px;\n  text-align: center;\n  cursor: pointer;\n  font-size: 22px;\n}\n\n.art-video-player.art-is-dragging {\n  opacity: .7;\n}\n\n.art-video-player.art-mini {\n  z-index: 9999;\n  width: 400px;\n  height: 225px;\n  position: fixed;\n  box-shadow: 0 2px 5px #00000029, 0 3px 6px #0003;\n}\n\n.art-video-player.art-mini .art-mini-header {\n  user-select: none;\n  display: flex;\n}\n\n.art-video-player.art-mini.art-hover .art-mini-header {\n  opacity: 1;\n  visibility: visible;\n}\n\n.art-video-player.art-mini .art-mask .art-state {\n  position: static;\n}\n\n.art-video-player.art-mini .art-contextmenu, .art-video-player.art-mini .art-bottom, .art-video-player.art-mini .art-danmu, .art-video-player.art-mini .art-info, .art-video-player.art-mini .art-layers, .art-video-player.art-mini .art-notice, .art-video-player.art-mini .art-settings, .art-video-player.art-mini .art-subtitle {\n  display: none !important;\n}\n\n.art-auto-size {\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-video-player[data-flip=\"horizontal\"] .art-video {\n  transform: scaleX(-1);\n}\n\n.art-video-player[data-flip=\"vertical\"] .art-video {\n  transform: scaleY(-1);\n}\n\n.art-video-player .art-layer-miniProgressBar {\n  height: 2px;\n  background-color: var(--theme);\n  display: block;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n}\n\n.art-video-player .art-layer-lock {\n  height: 34px;\n  width: 34px;\n  color: #fff;\n  background-color: #00000080;\n  border-radius: 50%;\n  justify-content: center;\n  align-items: center;\n  display: none;\n  position: absolute;\n  top: calc(50% - 17px);\n  left: 15px;\n}\n\n.art-video-player.art-lock .art-bottom {\n  display: none !important;\n}\n\n.art-video-player.art-lock .art-subtitle {\n  bottom: 10px !important;\n}\n\n.art-video-player.art-lock .art-layer-miniProgressBar {\n  display: block !important;\n}\n\n.art-video-player.art-control-show .art-layer-miniProgressBar {\n  display: none;\n}\n\n.art-video-player.art-control-show .art-layer-lock {\n  display: flex;\n}\n\n.art-video-player .art-control-selector {\n  position: relative;\n}\n\n.art-video-player .art-control-selector .art-selector-list {\n  min-width: 100px;\n  max-width: 200px;\n  max-height: 200px;\n  text-align: center;\n  color: #fff;\n  background-color: #000c;\n  border-radius: 3px;\n  padding: 5px 0;\n  display: none;\n  position: absolute;\n  bottom: 35px;\n  overflow: auto;\n}\n\n.art-video-player .art-control-selector .art-selector-list .art-selector-item {\n  height: 30px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  text-shadow: 0 0 2px #00000080;\n  padding: 0 5px;\n  line-height: 30px;\n  overflow: hidden;\n}\n\n.art-video-player .art-control-selector .art-selector-list .art-selector-item:hover {\n  background-color: #ffffff1a;\n}\n\n.art-video-player .art-control-selector .art-selector-list .art-selector-item:hover, .art-video-player .art-control-selector .art-selector-list .art-selector-item.art-current {\n  color: #00c9ff;\n}\n\n.art-video-player .art-control-selector:hover .art-selector-list {\n  display: block;\n}\n\n[class*=\"hint--\"] {\n  font-style: normal;\n  display: inline-block;\n  position: relative;\n}\n\n[class*=\"hint--\"]:before, [class*=\"hint--\"]:after {\n  visibility: hidden;\n  opacity: 0;\n  z-index: 1000000;\n  pointer-events: none;\n  transition: all .3s;\n  transition-delay: 0s;\n  position: absolute;\n  transform: translate3d(0, 0, 0);\n}\n\n[class*=\"hint--\"]:hover:before, [class*=\"hint--\"]:hover:after {\n  visibility: visible;\n  opacity: 1;\n  transition-delay: .1s;\n}\n\n[class*=\"hint--\"]:before {\n  content: \"\";\n  z-index: 1000000;\n  background: none;\n  border: 6px solid #0000;\n  position: absolute;\n}\n\n[class*=\"hint--\"]:after {\n  color: #fff;\n  white-space: nowrap;\n  background: #000;\n  padding: 8px 10px;\n  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;\n  font-size: 12px;\n  line-height: 12px;\n}\n\n[class*=\"hint--\"][aria-label]:after {\n  content: attr(aria-label);\n}\n\n[class*=\"hint--\"][data-hint]:after {\n  content: attr(data-hint);\n}\n\n[aria-label=\"\"]:before, [aria-label=\"\"]:after, [data-hint=\"\"]:before, [data-hint=\"\"]:after {\n  display: none !important;\n}\n\n.hint--top-left:before, .hint--top-right:before, .hint--top:before {\n  border-top-color: #000;\n}\n\n.hint--bottom-left:before, .hint--bottom-right:before, .hint--bottom:before {\n  border-bottom-color: #000;\n}\n\n.hint--left:before {\n  border-left-color: #000;\n}\n\n.hint--right:before {\n  border-right-color: #000;\n}\n\n.hint--top:before {\n  margin-bottom: -11px;\n}\n\n.hint--top:before, .hint--top:after {\n  bottom: 100%;\n  left: 50%;\n}\n\n.hint--top:before {\n  left: calc(50% - 6px);\n}\n\n.hint--top:after {\n  transform: translateX(-50%);\n}\n\n.hint--top:hover:before {\n  transform: translateY(-8px);\n}\n\n.hint--top:hover:after {\n  transform: translateX(-50%)translateY(-8px);\n}\n\n.hint--bottom:before {\n  margin-top: -11px;\n}\n\n.hint--bottom:before, .hint--bottom:after {\n  top: 100%;\n  left: 50%;\n}\n\n.hint--bottom:before {\n  left: calc(50% - 6px);\n}\n\n.hint--bottom:after {\n  transform: translateX(-50%);\n}\n\n.hint--bottom:hover:before {\n  transform: translateY(8px);\n}\n\n.hint--bottom:hover:after {\n  transform: translateX(-50%)translateY(8px);\n}\n\n.hint--right:before {\n  margin-bottom: -6px;\n  margin-left: -11px;\n}\n\n.hint--right:after {\n  margin-bottom: -14px;\n}\n\n.hint--right:before, .hint--right:after {\n  bottom: 50%;\n  left: 100%;\n}\n\n.hint--right:hover:before, .hint--right:hover:after {\n  transform: translateX(8px);\n}\n\n.hint--left:before {\n  margin-bottom: -6px;\n  margin-right: -11px;\n}\n\n.hint--left:after {\n  margin-bottom: -14px;\n}\n\n.hint--left:before, .hint--left:after {\n  bottom: 50%;\n  right: 100%;\n}\n\n.hint--left:hover:before, .hint--left:hover:after {\n  transform: translateX(-8px);\n}\n\n.hint--top-left:before {\n  margin-bottom: -11px;\n}\n\n.hint--top-left:before, .hint--top-left:after {\n  bottom: 100%;\n  left: 50%;\n}\n\n.hint--top-left:before {\n  left: calc(50% - 6px);\n}\n\n.hint--top-left:after {\n  margin-left: 12px;\n  transform: translateX(-100%);\n}\n\n.hint--top-left:hover:before {\n  transform: translateY(-8px);\n}\n\n.hint--top-left:hover:after {\n  transform: translateX(-100%)translateY(-8px);\n}\n\n.hint--top-right:before {\n  margin-bottom: -11px;\n}\n\n.hint--top-right:before, .hint--top-right:after {\n  bottom: 100%;\n  left: 50%;\n}\n\n.hint--top-right:before {\n  left: calc(50% - 6px);\n}\n\n.hint--top-right:after {\n  margin-left: -12px;\n  transform: translateX(0);\n}\n\n.hint--top-right:hover:before, .hint--top-right:hover:after {\n  transform: translateY(-8px);\n}\n\n.hint--bottom-left:before {\n  margin-top: -11px;\n}\n\n.hint--bottom-left:before, .hint--bottom-left:after {\n  top: 100%;\n  left: 50%;\n}\n\n.hint--bottom-left:before {\n  left: calc(50% - 6px);\n}\n\n.hint--bottom-left:after {\n  margin-left: 12px;\n  transform: translateX(-100%);\n}\n\n.hint--bottom-left:hover:before {\n  transform: translateY(8px);\n}\n\n.hint--bottom-left:hover:after {\n  transform: translateX(-100%)translateY(8px);\n}\n\n.hint--bottom-right:before {\n  margin-top: -11px;\n}\n\n.hint--bottom-right:before, .hint--bottom-right:after {\n  top: 100%;\n  left: 50%;\n}\n\n.hint--bottom-right:before {\n  left: calc(50% - 6px);\n}\n\n.hint--bottom-right:after {\n  margin-left: -12px;\n  transform: translateX(0);\n}\n\n.hint--bottom-right:hover:before, .hint--bottom-right:hover:after {\n  transform: translateY(8px);\n}\n\n.hint--small:after, .hint--medium:after, .hint--large:after {\n  white-space: normal;\n  word-wrap: break-word;\n  line-height: 1.4em;\n}\n\n.hint--small:after {\n  width: 80px;\n}\n\n.hint--medium:after {\n  width: 150px;\n}\n\n.hint--large:after {\n  width: 300px;\n}\n\n[class*=\"hint--\"]:after {\n  text-shadow: 0 -1px #000;\n  box-shadow: 4px 4px 8px #0000004d;\n}\n\n.hint--error:after {\n  text-shadow: 0 -1px #592726;\n  background-color: #b34e4d;\n}\n\n.hint--error.hint--top-left:before, .hint--error.hint--top-right:before, .hint--error.hint--top:before {\n  border-top-color: #b34e4d;\n}\n\n.hint--error.hint--bottom-left:before, .hint--error.hint--bottom-right:before, .hint--error.hint--bottom:before {\n  border-bottom-color: #b34e4d;\n}\n\n.hint--error.hint--left:before {\n  border-left-color: #b34e4d;\n}\n\n.hint--error.hint--right:before {\n  border-right-color: #b34e4d;\n}\n\n.hint--warning:after {\n  text-shadow: 0 -1px #6c5328;\n  background-color: #c09854;\n}\n\n.hint--warning.hint--top-left:before, .hint--warning.hint--top-right:before, .hint--warning.hint--top:before {\n  border-top-color: #c09854;\n}\n\n.hint--warning.hint--bottom-left:before, .hint--warning.hint--bottom-right:before, .hint--warning.hint--bottom:before {\n  border-bottom-color: #c09854;\n}\n\n.hint--warning.hint--left:before {\n  border-left-color: #c09854;\n}\n\n.hint--warning.hint--right:before {\n  border-right-color: #c09854;\n}\n\n.hint--info:after {\n  text-shadow: 0 -1px #1a3c4d;\n  background-color: #3986ac;\n}\n\n.hint--info.hint--top-left:before, .hint--info.hint--top-right:before, .hint--info.hint--top:before {\n  border-top-color: #3986ac;\n}\n\n.hint--info.hint--bottom-left:before, .hint--info.hint--bottom-right:before, .hint--info.hint--bottom:before {\n  border-bottom-color: #3986ac;\n}\n\n.hint--info.hint--left:before {\n  border-left-color: #3986ac;\n}\n\n.hint--info.hint--right:before {\n  border-right-color: #3986ac;\n}\n\n.hint--success:after {\n  text-shadow: 0 -1px #1a321a;\n  background-color: #458746;\n}\n\n.hint--success.hint--top-left:before, .hint--success.hint--top-right:before, .hint--success.hint--top:before {\n  border-top-color: #458746;\n}\n\n.hint--success.hint--bottom-left:before, .hint--success.hint--bottom-right:before, .hint--success.hint--bottom:before {\n  border-bottom-color: #458746;\n}\n\n.hint--success.hint--left:before {\n  border-left-color: #458746;\n}\n\n.hint--success.hint--right:before {\n  border-right-color: #458746;\n}\n\n.hint--always:after, .hint--always:before {\n  opacity: 1;\n  visibility: visible;\n}\n\n.hint--always.hint--top:before {\n  transform: translateY(-8px);\n}\n\n.hint--always.hint--top:after {\n  transform: translateX(-50%)translateY(-8px);\n}\n\n.hint--always.hint--top-left:before {\n  transform: translateY(-8px);\n}\n\n.hint--always.hint--top-left:after {\n  transform: translateX(-100%)translateY(-8px);\n}\n\n.hint--always.hint--top-right:before, .hint--always.hint--top-right:after {\n  transform: translateY(-8px);\n}\n\n.hint--always.hint--bottom:before {\n  transform: translateY(8px);\n}\n\n.hint--always.hint--bottom:after {\n  transform: translateX(-50%)translateY(8px);\n}\n\n.hint--always.hint--bottom-left:before {\n  transform: translateY(8px);\n}\n\n.hint--always.hint--bottom-left:after {\n  transform: translateX(-100%)translateY(8px);\n}\n\n.hint--always.hint--bottom-right:before, .hint--always.hint--bottom-right:after {\n  transform: translateY(8px);\n}\n\n.hint--always.hint--left:before, .hint--always.hint--left:after {\n  transform: translateX(-8px);\n}\n\n.hint--always.hint--right:before, .hint--always.hint--right:after {\n  transform: translateX(8px);\n}\n\n.hint--rounded:after {\n  border-radius: 4px;\n}\n\n.hint--no-animate:before, .hint--no-animate:after {\n  transition-duration: 0s;\n}\n\n.hint--bounce:before, .hint--bounce:after {\n  -webkit-transition: opacity .3s, visibility .3s, -webkit-transform .3s cubic-bezier(.71, 1.7, .77, 1.24);\n  -moz-transition: opacity .3s, visibility .3s, -moz-transform .3s cubic-bezier(.71, 1.7, .77, 1.24);\n  transition: opacity .3s, visibility .3s, transform .3s cubic-bezier(.71, 1.7, .77, 1.24);\n}\n\n.hint--no-shadow:before, .hint--no-shadow:after {\n  text-shadow: initial;\n  box-shadow: initial;\n}\n\n.hint--no-arrow:before {\n  display: none;\n}\n\n";

},{}],"i7tUx":[function(require,module,exports) {
!function(r, t) {
    module.exports = t();
}(this, function() {
    "use strict";
    function e1(r1) {
        return (e1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
            return typeof r;
        } : function(r) {
            return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
        })(r1);
    }
    var n1 = Object.prototype.toString, c = function(r2) {
        if (void 0 === r2) return "undefined";
        if (null === r2) return "null";
        var t = e1(r2);
        if ("boolean" === t) return "boolean";
        if ("string" === t) return "string";
        if ("number" === t) return "number";
        if ("symbol" === t) return "symbol";
        if ("function" === t) return function(r) {
            return "GeneratorFunction" === o1(r);
        }(r2) ? "generatorfunction" : "function";
        if (function(r) {
            return Array.isArray ? Array.isArray(r) : r instanceof Array;
        }(r2)) return "array";
        if (function(r) {
            if (r.constructor && "function" == typeof r.constructor.isBuffer) return r.constructor.isBuffer(r);
            return !1;
        }(r2)) return "buffer";
        if (function(r) {
            try {
                if ("number" == typeof r.length && "function" == typeof r.callee) return !0;
            } catch (r3) {
                if (-1 !== r3.message.indexOf("callee")) return !0;
            }
            return !1;
        }(r2)) return "arguments";
        if (function(r) {
            return r instanceof Date || "function" == typeof r.toDateString && "function" == typeof r.getDate && "function" == typeof r.setDate;
        }(r2)) return "date";
        if (function(r) {
            return r instanceof Error || "string" == typeof r.message && r.constructor && "number" == typeof r.constructor.stackTraceLimit;
        }(r2)) return "error";
        if (function(r) {
            return r instanceof RegExp || "string" == typeof r.flags && "boolean" == typeof r.ignoreCase && "boolean" == typeof r.multiline && "boolean" == typeof r.global;
        }(r2)) return "regexp";
        switch(o1(r2)){
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
        }(r2)) return "generator";
        switch(t = n1.call(r2)){
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
    function o1(r) {
        return r.constructor ? r.constructor.name : null;
    }
    function f(r4, t1) {
        var e2 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : [
            "option"
        ];
        return s(r4, t1, e2), y(r4, t1, e2), function(a, i, u) {
            var r5 = c(i), t2 = c(a);
            if ("object" === r5) {
                if ("object" !== t2) throw new Error("[Type Error]: '".concat(u.join("."), "' require 'object' type, but got '").concat(t2, "'"));
                Object.keys(i).forEach(function(r) {
                    var t = a[r], e = i[r], n = u.slice();
                    n.push(r), s(t, e, n), y(t, e, n), f(t, e, n);
                });
            }
            if ("array" === r5) {
                if ("array" !== t2) throw new Error("[Type Error]: '".concat(u.join("."), "' require 'array' type, but got '").concat(t2, "'"));
                a.forEach(function(r, t) {
                    var e = a[t], n = i[t] || i[0], o = u.slice();
                    o.push(t), s(e, n, o), y(e, n, o), f(e, n, o);
                });
            }
        }(r4, t1, e2), r4;
    }
    function s(r6, t, e) {
        if ("string" === c(t)) {
            var n = c(r6);
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

},{}],"elSLF":[function(require,module,exports) {
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"5dUr6":[function(require,module,exports) {
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
        if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) return;
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

},{}],"jmgNb":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _dom = require("./dom");
parcelHelpers.exportAll(_dom, exports);
var _error = require("./error");
parcelHelpers.exportAll(_error, exports);
var _subtitle = require("./subtitle");
parcelHelpers.exportAll(_subtitle, exports);
var _file = require("./file");
parcelHelpers.exportAll(_file, exports);
var _property = require("./property");
parcelHelpers.exportAll(_property, exports);
var _time = require("./time");
parcelHelpers.exportAll(_time, exports);
var _format = require("./format");
parcelHelpers.exportAll(_format, exports);
var _compatibility = require("./compatibility");
parcelHelpers.exportAll(_compatibility, exports);

},{"./dom":"dNynC","./error":"622b3","./subtitle":"bGuws","./file":"luB4T","./property":"91nLd","./time":"f9kBR","./format":"eWip5","./compatibility":"gotDS","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"dNynC":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "query", ()=>query
);
parcelHelpers.export(exports, "queryAll", ()=>queryAll
);
parcelHelpers.export(exports, "addClass", ()=>addClass
);
parcelHelpers.export(exports, "removeClass", ()=>removeClass
);
parcelHelpers.export(exports, "hasClass", ()=>hasClass
);
parcelHelpers.export(exports, "append", ()=>append
);
parcelHelpers.export(exports, "remove", ()=>remove
);
parcelHelpers.export(exports, "setStyle", ()=>setStyle
);
parcelHelpers.export(exports, "setStyles", ()=>setStyles
);
parcelHelpers.export(exports, "getStyle", ()=>getStyle
);
parcelHelpers.export(exports, "sublings", ()=>sublings
);
parcelHelpers.export(exports, "inverseClass", ()=>inverseClass
);
parcelHelpers.export(exports, "tooltip", ()=>tooltip
);
parcelHelpers.export(exports, "isInViewport", ()=>isInViewport
);
parcelHelpers.export(exports, "includeFromEvent", ()=>includeFromEvent
);
parcelHelpers.export(exports, "replaceElement", ()=>replaceElement
);
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
    Object.keys(styles).forEach((key)=>{
        setStyle(element, key, styles[key]);
    });
    return element;
}
function getStyle(element, key, numberType = true) {
    const value = window.getComputedStyle(element, null).getPropertyValue(key);
    return numberType ? parseFloat(value) : value;
}
function sublings(target) {
    return Array.from(target.parentElement.children).filter((item)=>item !== target
    );
}
function inverseClass(target, className) {
    sublings(target).forEach((item)=>removeClass(item, className)
    );
    addClass(target, className);
}
function tooltip(target, msg, pos = 'top') {
    if (_compatibility.isMobile) return;
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
    return event.composedPath && event.composedPath().indexOf(target) > -1;
}
function replaceElement(newChild, oldChild) {
    oldChild.parentNode.replaceChild(newChild, oldChild);
    return newChild;
}

},{"./compatibility":"gotDS","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"gotDS":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "userAgent", ()=>userAgent
);
parcelHelpers.export(exports, "isMobile", ()=>isMobile
);
parcelHelpers.export(exports, "isSafari", ()=>isSafari
);
parcelHelpers.export(exports, "isWechat", ()=>isWechat
);
parcelHelpers.export(exports, "isIE", ()=>isIE
);
parcelHelpers.export(exports, "isAndroid", ()=>isAndroid
);
parcelHelpers.export(exports, "isIOS", ()=>isIOS
);
const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
const isWechat = /MicroMessenger/i.test(userAgent);
const isIE = /MSIE|Trident/i.test(userAgent);
const isAndroid = /android/i.test(userAgent);
const isIOS = /iPad|iPhone|iPod/i.test(userAgent) && !window.MSStream;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"622b3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ArtPlayerError", ()=>ArtPlayerError
);
parcelHelpers.export(exports, "errorHandle", ()=>errorHandle
);
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"bGuws":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "srtToVtt", ()=>srtToVtt
);
parcelHelpers.export(exports, "vttToBlob", ()=>vttToBlob
);
parcelHelpers.export(exports, "assToVtt", ()=>assToVtt
);
function fixSrt(srt) {
    return srt.replace(/(\d\d:\d\d:\d\d)[,.](\d+)/g, (_, $1, $2)=>{
        let ms = $2.slice(0, 3);
        if ($2.length === 1) ms = $2 + '00';
        if ($2.length === 2) ms = $2 + '0';
        return `${$1},${ms}`;
    });
}
function srtToVtt(srtText) {
    return 'WEBVTT \r\n\r\n'.concat(fixSrt(srtText).replace(/\{\\([ibu])\}/g, '</$1>').replace(/\{\\([ibu])1\}/g, '<$1>').replace(/\{([ibu])\}/g, '<$1>').replace(/\{\/([ibu])\}/g, '</$1>').replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2').replace(/{[\s\S]*?}/g, '').concat('\r\n\r\n'));
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
            // eslint-disable-next-line no-nested-ternary
            return index === 0 ? item : index === arr.length - 1 ? `.${item}` : `:${item}`;
        }).join('');
    }
    return `WEBVTT\n\n${ass.split(/\r?\n/).map((line)=>{
        const m = line.match(reAss);
        if (!m) return null;
        return {
            start: fixTime(m[1].trim()),
            end: fixTime(m[2].trim()),
            text: m[5].replace(/{[\s\S]*?}/g, '').replace(/(\\N)/g, '\n').trim().split(/\r?\n/).map((item)=>item.trim()
            ).join('\n')
        };
    }).filter((line)=>line
    ).map((line, index)=>{
        if (line) return `${index + 1}\n${line.start} --> ${line.end}\n${line.text}`;
        return '';
    }).filter((line)=>line.trim()
    ).join('\n\n')}`;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"luB4T":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getExt", ()=>getExt
);
parcelHelpers.export(exports, "download", ()=>download
);
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

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"91nLd":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "def", ()=>def
);
parcelHelpers.export(exports, "has", ()=>has
);
parcelHelpers.export(exports, "get", ()=>get
);
parcelHelpers.export(exports, "mergeDeep", ()=>mergeDeep
);
const def = Object.defineProperty;
const { hasOwnProperty  } = Object.prototype;
function has(obj, name) {
    return hasOwnProperty.call(obj, name);
}
function get(obj, name) {
    return Object.getOwnPropertyDescriptor(obj, name);
}
function mergeDeep(...objects) {
    const isObject = (item)=>item && typeof item === 'object' && !Array.isArray(item)
    ;
    return objects.reduce((prev, obj)=>{
        Object.keys(obj).forEach((key)=>{
            const pVal = prev[key];
            const oVal = obj[key];
            if (Array.isArray(pVal) && Array.isArray(oVal)) prev[key] = pVal.concat(...oVal);
            else if (isObject(pVal) && isObject(oVal) && !(oVal instanceof Element)) prev[key] = mergeDeep(pVal, oVal);
            else prev[key] = oVal;
        });
        return prev;
    }, {});
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"f9kBR":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "sleep", ()=>sleep
);
parcelHelpers.export(exports, "debounce", ()=>debounce
);
parcelHelpers.export(exports, "throttle", ()=>throttle
);
function sleep(ms = 0) {
    return new Promise((resolve)=>setTimeout(resolve, ms)
    );
}
function debounce(func, wait, context) {
    let timeout;
    function fn(...args) {
        const later = function later() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    }
    fn.clearTimeout = function ct() {
        clearTimeout(timeout);
    };
    return fn;
}
function throttle(callback, delay) {
    let isThrottled = false;
    let args;
    let context;
    function fn(...args2) {
        if (isThrottled) {
            args = args2;
            context = this;
            return;
        }
        isThrottled = true;
        callback.apply(this, args2);
        setTimeout(()=>{
            isThrottled = false;
            if (args) {
                fn.apply(context, args);
                args = null;
                context = null;
            }
        }, delay);
    }
    return fn;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"eWip5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "clamp", ()=>clamp
);
parcelHelpers.export(exports, "secondToTime", ()=>secondToTime
);
parcelHelpers.export(exports, "escape", ()=>escape
);
function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}
function secondToTime(second) {
    const add0 = (num)=>num < 10 ? `0${num}` : String(num)
    ;
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
            "'": '&#39;',
            '"': '&quot;'
        })[tag] || tag
    );
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"gL38d":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ComponentOption", ()=>ComponentOption
);
var _utils = require("../utils");
const a = 'array';
const b = 'boolean';
const s = 'string';
const n = 'number';
const o = 'object';
const f = 'function';
const r = 'regexp';
function validElement(value, type, paths) {
    return _utils.errorHandle(type === s || type === n || value instanceof Element, `${paths.join('.')} require '${s}' or 'Element' type`);
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
    onRange: `?${f}`
};
exports.default = {
    container: validElement,
    url: s,
    poster: s,
    title: s,
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
    fastForward: b,
    autoPlayback: b,
    autoOrientation: b,
    ads: [
        {
            url: s
        }, 
    ],
    plugins: [
        f
    ],
    whitelist: [
        `${s}|${f}|${r}`
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
                return _utils.errorHandle(position.includes(value), `${paths.join('.')} only accept ${position.toString()} as parameters`);
            }
        }, 
    ],
    quality: [
        {
            default: `?${b}`,
            html: s,
            url: s
        }, 
    ],
    highlight: [
        {
            time: n,
            text: s
        }, 
    ],
    thumbnails: {
        url: s,
        number: n,
        column: n
    },
    subtitle: {
        url: s,
        type: s,
        style: o,
        encoding: s
    },
    moreVideoAttr: o,
    icons: o,
    customType: o
};

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"2ZnKD":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
exports.default = {
    propertys: [
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
        'volume', 
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
        'waiting', 
    ],
    prototypes: [
        "width",
        "height",
        "videoWidth",
        "videoHeight",
        "poster",
        "webkitDecodedFrameCount",
        "webkitDroppedFrameCount",
        "playsInline",
        "webkitSupportsFullscreen",
        "webkitDisplayingFullscreen",
        "onenterpictureinpicture",
        "onleavepictureinpicture",
        "disablePictureInPicture",
        "cancelVideoFrameCallback",
        "requestVideoFrameCallback",
        "getVideoPlaybackQuality",
        "requestPictureInPicture",
        "webkitEnterFullScreen",
        "webkitEnterFullscreen",
        "webkitExitFullScreen",
        "webkitExitFullscreen", 
    ]
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"gd0pl":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
class Whitelist {
    constructor(art){
        this.art = art;
    }
    get state() {
        const { option , constructor: { kindOf  } ,  } = this.art;
        return !_utils.isMobile || option.whitelist.some((item)=>{
            switch(kindOf(item)){
                case 'string':
                    return item === '*' || _utils.userAgent.indexOf(item) > -1;
                case 'function':
                    return item(_utils.userAgent);
                case 'regexp':
                    return item.test(_utils.userAgent);
                default:
                    return false;
            }
        });
    }
}
exports.default = Whitelist;

},{"./utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"bDTDS":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
class Template {
    constructor(art){
        this.art = art;
        const { option , constructor , whitelist  } = art;
        if (option.container instanceof Element) this.$container = option.container;
        else {
            this.$container = _utils.query(option.container);
            _utils.errorHandle(this.$container, `No container element found by ${option.container}`);
        }
        const type = this.$container.tagName.toLowerCase();
        _utils.errorHandle(type === 'div', `Unsupported container element type, only support 'div' but got '${type}'`);
        _utils.errorHandle(constructor.instances.every((ins)=>ins.template.$container !== this.$container
        ), 'Cannot mount multiple instances on the same dom element');
        this.query = this.query.bind(this);
        this.$container.dataset.artId = art.id;
        this.$original = this.$container.cloneNode(true);
        if (whitelist.state) this.desktop();
        else this.mobile();
    }
    static get html() {
        return `
          <div class="art-video-player art-subtitle-show art-layer-show art-control-show art-mask-show">
            <video class="art-video"></video>
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
                  <div class="art-info-content">${"4.4.2"}</div>
                </div>
                <div class="art-info-item">
                  <div class="art-info-title">Video url:</div>
                  <div class="art-info-content" data-video="src"></div>
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
            <div class="art-mini-header">
              <div class="art-mini-title"></div>
              <div class="art-mini-close">×</div>
            </div>
            <div class="art-contextmenus"></div>
          </div>
        `;
    }
    query(className) {
        return _utils.query(className, this.$container);
    }
    desktop() {
        const { option  } = this.art;
        if (!option.useSSR) this.$container.innerHTML = Template.html;
        this.$player = this.query('.art-video-player');
        this.$video = this.query('.art-video');
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
        this.$miniHeader = this.query('.art-mini-header');
        this.$miniTitle = this.query('.art-mini-title');
        this.$miniClose = this.query('.art-mini-close');
        this.$contextmenu = this.query('.art-contextmenus');
        if (option.backdrop) {
            _utils.addClass(this.$setting, 'art-backdrop-filter');
            _utils.addClass(this.$contextmenu, 'art-backdrop-filter');
            _utils.addClass(this.$info, 'art-backdrop-filter');
        }
        if (_utils.isMobile) _utils.addClass(this.$player, 'art-mobile');
    }
    mobile() {
        this.$container.innerHTML = `
          <div class="art-video-player">
            <video class="art-video"></video>
          </div>
        `;
        this.$player = this.query('.art-video-player');
        this.$video = this.query('.art-video');
    }
    destroy(removeHtml) {
        if (removeHtml) _utils.replaceElement(this.$original, this.$container);
        else _utils.addClass(this.$player, 'art-destroy');
    }
}
exports.default = Template;

},{"./utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"k0CtI":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
var _zhCnJson = require("./zh-cn.json");
var _zhCnJsonDefault = parcelHelpers.interopDefault(_zhCnJson);
var _zhTwJson = require("./zh-tw.json");
var _zhTwJsonDefault = parcelHelpers.interopDefault(_zhTwJson);
var _plJson = require("./pl.json");
var _plJsonDefault = parcelHelpers.interopDefault(_plJson);
var _csJson = require("./cs.json");
var _csJsonDefault = parcelHelpers.interopDefault(_csJson);
class I18n {
    constructor(art){
        this.art = art;
        this.languages = {
            'zh-cn': _zhCnJsonDefault.default,
            'zh-tw': _zhTwJsonDefault.default,
            'pl': _plJsonDefault.default,
            'cs': _csJsonDefault.default
        };
        this.init();
    }
    init() {
        const lang = this.art.option.lang.toLowerCase();
        this.language = this.languages[lang] || {};
    }
    get(key) {
        return this.language[key] || key;
    }
    update(value) {
        this.languages = _utils.mergeDeep(this.languages, value);
        this.init();
    }
}
exports.default = I18n;

},{"../utils":"jmgNb","./zh-cn.json":"cVMb8","./zh-tw.json":"fS55m","./pl.json":"1JuQe","./cs.json":"4wwD8","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"cVMb8":[function(require,module,exports) {
module.exports = JSON.parse("{\"Video Info\":\"统计信息\",\"Close\":\"关闭\",\"Video Load Failed\":\"加载失败\",\"Volume\":\"音量\",\"Play\":\"播放\",\"Pause\":\"暂停\",\"Rate\":\"速度\",\"Mute\":\"静音\",\"Video Flip\":\"画面翻转\",\"Horizontal\":\"水平\",\"Vertical\":\"垂直\",\"Reconnect\":\"重新连接\",\"Show Setting\":\"显示设置\",\"Hide Setting\":\"隐藏设置\",\"Screenshot\":\"截图\",\"Play Speed\":\"播放速度\",\"Aspect Ratio\":\"画面比例\",\"Default\":\"默认\",\"Normal\":\"正常\",\"Open\":\"打开\",\"Switch Video\":\"切换\",\"Switch Subtitle\":\"切换字幕\",\"Fullscreen\":\"全屏\",\"Exit Fullscreen\":\"退出全屏\",\"Web Fullscreen\":\"网页全屏\",\"Exit Web Fullscreen\":\"退出网页全屏\",\"Mini Player\":\"迷你播放器\",\"PIP Mode\":\"开启画中画\",\"Exit PIP Mode\":\"退出画中画\",\"PIP Not Supported\":\"不支持画中画\",\"Fullscreen Not Supported\":\"不支持全屏\",\"Subtitle Offset\":\"字幕偏移\",\"Auto playback at\":\"已为您定位至\"}");

},{}],"fS55m":[function(require,module,exports) {
module.exports = JSON.parse("{\"Video Info\":\"統計訊息\",\"Close\":\"關閉\",\"Video Load Failed\":\"載入失敗\",\"Volume\":\"音量\",\"Play\":\"播放\",\"Pause\":\"暫停\",\"Rate\":\"速度\",\"Mute\":\"靜音\",\"Video Flip\":\"畫面翻轉\",\"Horizontal\":\"水平\",\"Vertical\":\"垂直\",\"Reconnect\":\"重新連接\",\"Show Setting\":\"顯示设置\",\"Hide Setting\":\"隱藏设置\",\"Screenshot\":\"截圖\",\"Play Speed\":\"播放速度\",\"Aspect Ratio\":\"畫面比例\",\"Default\":\"默認\",\"Normal\":\"正常\",\"Open\":\"打開\",\"Switch Video\":\"切換\",\"Switch Subtitle\":\"切換字幕\",\"Fullscreen\":\"全屏\",\"Exit Fullscreen\":\"退出全屏\",\"Web Fullscreen\":\"網頁全屏\",\"Exit Web Fullscreen\":\"退出網頁全屏\",\"Mini Player\":\"迷你播放器\",\"PIP Mode\":\"開啟畫中畫\",\"Exit PIP Mode\":\"退出畫中畫\",\"PIP Not Supported\":\"不支持畫中畫\",\"Fullscreen Not Supported\":\"不支持全屏\",\"Subtitle Offset\":\"字幕偏移\",\"Auto playback at\":\"已為您定位至\"}");

},{}],"1JuQe":[function(require,module,exports) {
module.exports = JSON.parse("{\"Video Info\":\"Informacje o wideo\",\"Close\":\"Zamknij\",\"Video Load Failed\":\"Błąd ładowania wideo\",\"Volume\":\"Głośność\",\"Play\":\"Odtwórz\",\"Pause\":\"Wstrzymaj\",\"Rate\":\"Oceń\",\"Mute\":\"Wycisz\",\"Video Flip\":\"Rotacja wideo\",\"Horizontal\":\"Pozioma\",\"Vertical\":\"Pionowa\",\"Reconnect\":\"Połącz ponownie\",\"Show Setting\":\"Pokaż ustawienia\",\"Hide Setting\":\"Ukryj ustawienia\",\"Screenshot\":\"Zrzut ekranu\",\"Play Speed\":\"Prędkość odtwarzania\",\"Aspect Ratio\":\"Współczynnik proporcji\",\"Default\":\"Domyślny\",\"Normal\":\"Normalny\",\"Open\":\"Otwórz\",\"Switch Video\":\"Przełącz wideo\",\"Switch Subtitle\":\"Przełącz napisy\",\"Fullscreen\":\"Pełny ekran\",\"Exit Fullscreen\":\"Zamknij pełny ekran\",\"Web Fullscreen\":\"Tryb pełnej strony\",\"Exit Web Fullscreen\":\"Zamknij tryb pełnej strony\",\"Mini Player\":\"Miniodtwarzacz\",\"PIP Mode\":\"Tryb PiP\",\"Exit PIP Mode\":\"Zamknij tryb PiP\",\"PIP Not Supported\":\"Tryb PiP nieobsługiwany\",\"Fullscreen Not Supported\":\"Pełny ekran nieobsługiwany\",\"Subtitle Offset\":\"Przesunięcie napisów\",\"Auto playback at\":\"Automatyczne odtwarzanie za\"}");

},{}],"4wwD8":[function(require,module,exports) {
module.exports = JSON.parse("{\"Video Info\":\"Info o videu\",\"Close\":\"Zavřít\",\"Video Load Failed\":\"Nahrání videa selhalo\",\"Volume\":\"Hlasitost\",\"Play\":\"Přehrát\",\"Pause\":\"Pozastavit\",\"Rate\":\"Hodnocení\",\"Mute\":\"Ztlumit\",\"Video Flip\":\"Otočit video\",\"Horizontal\":\"Horizontálně\",\"Vertical\":\"Vertikálně\",\"Reconnect\":\"Opětovné připojení\",\"Show Setting\":\"Zobrazit nastavení\",\"Hide Setting\":\"Skrýt nastavení\",\"Screenshot\":\"Snímek obrazovky\",\"Play Speed\":\"Rychlost přehrávání\",\"Aspect Ratio\":\"Poměr stran\",\"Default\":\"Výchozí\",\"Normal\":\"Normální\",\"Open\":\"Otevřít\",\"Switch Video\":\"Přepnout video\",\"Switch Subtitle\":\"Přepnout titulky\",\"Fullscreen\":\"Celá obrazovka\",\"Exit Fullscreen\":\"Opustit režim celé obrazovky\",\"Web Fullscreen\":\"Celá stránka\",\"Exit Web Fullscreen\":\"Zavřít režim celé stránky\",\"Mini Player\":\"Mini přehrávač\",\"PIP Mode\":\"Režim PIP\",\"Exit PIP Mode\":\"Opustit režim PIP\",\"PIP Not Supported\":\"Režim PIP není podporován\",\"Fullscreen Not Supported\":\"Režim celé obrazovky není podporován\",\"Subtitle Offset\":\"Posun titulků\",\"Auto playback at\":\"Automatické přehrávání za\"}");

},{}],"35XKf":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _urlMix = require("./urlMix");
var _urlMixDefault = parcelHelpers.interopDefault(_urlMix);
var _attrMix = require("./attrMix");
var _attrMixDefault = parcelHelpers.interopDefault(_attrMix);
var _playMix = require("./playMix");
var _playMixDefault = parcelHelpers.interopDefault(_playMix);
var _pauseMix = require("./pauseMix");
var _pauseMixDefault = parcelHelpers.interopDefault(_pauseMix);
var _toggleMix = require("./toggleMix");
var _toggleMixDefault = parcelHelpers.interopDefault(_toggleMix);
var _seekMix = require("./seekMix");
var _seekMixDefault = parcelHelpers.interopDefault(_seekMix);
var _volumeMix = require("./volumeMix");
var _volumeMixDefault = parcelHelpers.interopDefault(_volumeMix);
var _currentTimeMix = require("./currentTimeMix");
var _currentTimeMixDefault = parcelHelpers.interopDefault(_currentTimeMix);
var _durationMix = require("./durationMix");
var _durationMixDefault = parcelHelpers.interopDefault(_durationMix);
var _switchMix = require("./switchMix");
var _switchMixDefault = parcelHelpers.interopDefault(_switchMix);
var _playbackRateMix = require("./playbackRateMix");
var _playbackRateMixDefault = parcelHelpers.interopDefault(_playbackRateMix);
var _aspectRatioMix = require("./aspectRatioMix");
var _aspectRatioMixDefault = parcelHelpers.interopDefault(_aspectRatioMix);
var _screenshotMix = require("./screenshotMix");
var _screenshotMixDefault = parcelHelpers.interopDefault(_screenshotMix);
var _fullscreenMix = require("./fullscreenMix");
var _fullscreenMixDefault = parcelHelpers.interopDefault(_fullscreenMix);
var _fullscreenWebMix = require("./fullscreenWebMix");
var _fullscreenWebMixDefault = parcelHelpers.interopDefault(_fullscreenWebMix);
var _pipMix = require("./pipMix");
var _pipMixDefault = parcelHelpers.interopDefault(_pipMix);
var _loadedMix = require("./loadedMix");
var _loadedMixDefault = parcelHelpers.interopDefault(_loadedMix);
var _playedMix = require("./playedMix");
var _playedMixDefault = parcelHelpers.interopDefault(_playedMix);
var _playingMix = require("./playingMix");
var _playingMixDefault = parcelHelpers.interopDefault(_playingMix);
var _autoSizeMix = require("./autoSizeMix");
var _autoSizeMixDefault = parcelHelpers.interopDefault(_autoSizeMix);
var _rectMix = require("./rectMix");
var _rectMixDefault = parcelHelpers.interopDefault(_rectMix);
var _flipMix = require("./flipMix");
var _flipMixDefault = parcelHelpers.interopDefault(_flipMix);
var _miniMix = require("./miniMix");
var _miniMixDefault = parcelHelpers.interopDefault(_miniMix);
var _loopMix = require("./loopMix");
var _loopMixDefault = parcelHelpers.interopDefault(_loopMix);
var _posterMix = require("./posterMix");
var _posterMixDefault = parcelHelpers.interopDefault(_posterMix);
var _autoHeightMix = require("./autoHeightMix");
var _autoHeightMixDefault = parcelHelpers.interopDefault(_autoHeightMix);
var _themeMix = require("./themeMix");
var _themeMixDefault = parcelHelpers.interopDefault(_themeMix);
var _titleMix = require("./titleMix");
var _titleMixDefault = parcelHelpers.interopDefault(_titleMix);
var _normalSizeMix = require("./normalSizeMix");
var _normalSizeMixDefault = parcelHelpers.interopDefault(_normalSizeMix);
var _subtitleOffsetMix = require("./subtitleOffsetMix");
var _subtitleOffsetMixDefault = parcelHelpers.interopDefault(_subtitleOffsetMix);
var _optionInit = require("./optionInit");
var _optionInitDefault = parcelHelpers.interopDefault(_optionInit);
var _eventInit = require("./eventInit");
var _eventInitDefault = parcelHelpers.interopDefault(_eventInit);
class Player {
    constructor(art){
        _urlMixDefault.default(art);
        _attrMixDefault.default(art);
        _playMixDefault.default(art);
        _pauseMixDefault.default(art);
        _toggleMixDefault.default(art);
        _seekMixDefault.default(art);
        _volumeMixDefault.default(art);
        _currentTimeMixDefault.default(art);
        _durationMixDefault.default(art);
        _switchMixDefault.default(art);
        _playbackRateMixDefault.default(art);
        _aspectRatioMixDefault.default(art);
        _screenshotMixDefault.default(art);
        _fullscreenMixDefault.default(art);
        _fullscreenWebMixDefault.default(art);
        _pipMixDefault.default(art);
        _loadedMixDefault.default(art);
        _playedMixDefault.default(art);
        _playingMixDefault.default(art);
        _autoSizeMixDefault.default(art);
        _rectMixDefault.default(art);
        _flipMixDefault.default(art);
        _miniMixDefault.default(art);
        _loopMixDefault.default(art);
        _posterMixDefault.default(art);
        _autoHeightMixDefault.default(art);
        _themeMixDefault.default(art);
        _titleMixDefault.default(art);
        _normalSizeMixDefault.default(art);
        _subtitleOffsetMixDefault.default(art);
        _eventInitDefault.default(art);
        _optionInitDefault.default(art);
    }
}
exports.default = Player;

},{"./urlMix":"aIS34","./attrMix":"jDj6f","./playMix":"agXpy","./pauseMix":"zMuGC","./toggleMix":"fvNrm","./seekMix":"3CiN1","./volumeMix":"1LKRL","./currentTimeMix":"bjUCm","./durationMix":"l8grT","./switchMix":"bIvi5","./playbackRateMix":"3EFen","./aspectRatioMix":"8ucW5","./screenshotMix":"12WvT","./fullscreenMix":"gNUzM","./fullscreenWebMix":"f2xmf","./pipMix":"i5i0P","./loadedMix":"8X9EY","./playedMix":"1ziBX","./playingMix":"9898W","./autoSizeMix":"b1yGg","./rectMix":"eKKgI","./flipMix":"ad3ay","./miniMix":"hUF3v","./loopMix":"gXFcr","./posterMix":"6j7ij","./autoHeightMix":"8Mzuu","./themeMix":"dv3lF","./titleMix":"5I0kK","./normalSizeMix":"9U4Nw","./subtitleOffsetMix":"lTNEf","./optionInit":"9Us4p","./eventInit":"4hZCW","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"aIS34":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function urlMix(art) {
    const { option , template: { $video  } ,  } = art;
    _utils.def(art, 'url', {
        get () {
            return $video.currentSrc;
        },
        async set (url) {
            const typeName = option.type || _utils.getExt(url);
            const typeCallback = option.customType[typeName];
            if (typeName && typeCallback) {
                await _utils.sleep();
                art.loading.show = true;
                typeCallback.call(art, $video, url, art);
            } else {
                if (art.url && art.url !== url) art.once('video:canplay', ()=>{
                    if (art.isReady) art.emit('restart');
                });
                $video.src = url;
                art.option.url = url;
                art.emit('url', url);
            }
        }
    });
}
exports.default = urlMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"jDj6f":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function attrMix(art) {
    const { template: { $video  } ,  } = art;
    _utils.def(art, 'attr', {
        value (key, value) {
            if (value === undefined) return $video[key];
            $video[key] = value;
        }
    });
}
exports.default = attrMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"agXpy":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function playMix(art) {
    const { i18n , notice , option , constructor: { instances  } , template: { $video  } ,  } = art;
    _utils.def(art, 'play', {
        value () {
            const promise = $video.play();
            if (promise && promise.then) promise.then().catch((err)=>{
                notice.show = err;
                throw err;
            });
            if (option.mutex) for(let index = 0; index < instances.length; index++){
                const instance = instances[index];
                if (instance !== art) instance.pause();
            }
            notice.show = i18n.get('Play');
            art.emit('play');
            return promise;
        }
    });
}
exports.default = playMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"zMuGC":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function pauseMix(art) {
    const { template: { $video  } , i18n , notice ,  } = art;
    _utils.def(art, 'pause', {
        value () {
            const result = $video.pause();
            notice.show = i18n.get('Pause');
            art.emit('pause');
            return result;
        }
    });
}
exports.default = pauseMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"fvNrm":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function toggleMix(art) {
    _utils.def(art, 'toggle', {
        value () {
            if (art.playing) return art.pause();
            else return art.play();
        }
    });
}
exports.default = toggleMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"3CiN1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function seekMix(art) {
    const { notice  } = art;
    _utils.def(art, 'seek', {
        set (time) {
            art.currentTime = time;
            art.emit('seek', art.currentTime);
            if (art.duration) notice.show = `${_utils.secondToTime(art.currentTime)} / ${_utils.secondToTime(art.duration)}`;
        }
    });
    _utils.def(art, 'forward', {
        set (time) {
            art.seek = art.currentTime + time;
        }
    });
    _utils.def(art, 'backward', {
        set (time) {
            art.seek = art.currentTime - time;
        }
    });
}
exports.default = seekMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"1LKRL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function volumeMix(art) {
    const { template: { $video  } , i18n , notice , storage ,  } = art;
    _utils.def(art, 'volume', {
        get: ()=>$video.volume || 0
        ,
        set: (percentage)=>{
            $video.volume = _utils.clamp(percentage, 0, 1);
            notice.show = `${i18n.get('Volume')}: ${parseInt($video.volume * 100, 10)}`;
            if ($video.volume !== 0) storage.set('volume', $video.volume);
            art.emit('volume', $video.volume);
        }
    });
    _utils.def(art, 'muted', {
        get: ()=>$video.muted
        ,
        set: (muted)=>{
            $video.muted = muted;
            art.emit('volume', $video.volume);
        }
    });
}
exports.default = volumeMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"bjUCm":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function currentTimeMix(art) {
    const { $video  } = art.template;
    _utils.def(art, 'currentTime', {
        get: ()=>$video.currentTime || 0
        ,
        set: (time)=>{
            time = parseFloat(time);
            if (Number.isNaN(time)) return;
            $video.currentTime = _utils.clamp(time, 0, art.duration);
        }
    });
}
exports.default = currentTimeMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"l8grT":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function durationMix(art) {
    _utils.def(art, 'duration', {
        get: ()=>{
            const { duration  } = art.template.$video;
            if (duration === Infinity) return 0;
            return duration || 0;
        }
    });
}
exports.default = durationMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"bIvi5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function switchMix(art) {
    const { i18n , option , notice  } = art;
    function switchUrl(url, name, currentTime) {
        return new Promise((resolve)=>{
            if (url === art.url) return resolve(url);
            const { playing  } = art;
            art.pause();
            URL.revokeObjectURL(art.url);
            art.url = url;
            art.once('video:canplay', ()=>{
                art.playbackRate = false;
                art.aspectRatio = false;
                art.flip = 'normal';
                art.autoSize = option.autoSize;
                art.currentTime = currentTime;
                art.notice.show = '';
                if (playing) art.play();
                if (name) notice.show = `${i18n.get('Switch Video')}: ${name}`;
                art.emit('switch', url);
                resolve(url);
            });
        });
    }
    _utils.def(art, 'switchQuality', {
        value: (url, name)=>{
            return switchUrl(url, name, art.currentTime);
        }
    });
    _utils.def(art, 'switchUrl', {
        value: (url, name)=>{
            return switchUrl(url, name, 0);
        }
    });
}
exports.default = switchMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"3EFen":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function playbackRateMix(art) {
    const { template: { $video  } , i18n , notice ,  } = art;
    _utils.def(art, 'playbackRate', {
        get () {
            return $video.playbackRate;
        },
        set (rate) {
            if (rate) {
                if (rate === $video.playbackRate) return;
                const rateList = [
                    0.25,
                    0.5,
                    0.75,
                    1.0,
                    1.25,
                    1.5,
                    1.75,
                    2.0,
                    3.0,
                    4.0
                ];
                _utils.errorHandle(rateList.includes(rate), `'playbackRate' only accept ${rateList.toString()} as parameters`);
                $video.playbackRate = rate;
                notice.show = `${i18n.get('Rate')}: ${rate === 1.0 ? i18n.get('Normal') : `${rate}x`}`;
                art.emit('playbackRate', rate);
            } else {
                art.playbackRate = 1;
                art.emit('playbackRate');
            }
        }
    });
}
exports.default = playbackRateMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"8ucW5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function aspectRatioMix(art) {
    const { template: { $video , $player  } , i18n , notice ,  } = art;
    _utils.def(art, 'aspectRatio', {
        get () {
            return $player.dataset.aspectRatio || 'default';
        },
        set (ratio) {
            if (!ratio) ratio = 'default';
            const ratioList = [
                'default',
                '4:3',
                '16:9'
            ];
            _utils.errorHandle(ratioList.includes(ratio), `'aspectRatio' only accept ${ratioList.toString()} as parameters`);
            if (ratio === 'default') {
                _utils.setStyle($video, 'width', null);
                _utils.setStyle($video, 'height', null);
                _utils.setStyle($video, 'padding', null);
                delete $player.dataset.aspectRatio;
            } else {
                const ratioArray = ratio.split(':').map(Number);
                const { videoWidth , videoHeight  } = $video;
                const { clientWidth , clientHeight  } = $player;
                const videoRatio = videoWidth / videoHeight;
                const setupRatio = ratioArray[0] / ratioArray[1];
                if (videoRatio > setupRatio) {
                    const percentage = setupRatio * videoHeight / videoWidth;
                    _utils.setStyle($video, 'width', `${percentage * 100}%`);
                    _utils.setStyle($video, 'height', '100%');
                    _utils.setStyle($video, 'padding', `0 ${(clientWidth - clientWidth * percentage) / 2}px`);
                } else {
                    const percentage = videoWidth / setupRatio / videoHeight;
                    _utils.setStyle($video, 'width', '100%');
                    _utils.setStyle($video, 'height', `${percentage * 100}%`);
                    _utils.setStyle($video, 'padding', `${(clientHeight - clientHeight * percentage) / 2}px 0`);
                }
                $player.dataset.aspectRatio = ratio;
            }
            notice.show = `${i18n.get('Aspect Ratio')}: ${ratio === 'default' ? i18n.get('Default') : ratio}`;
            art.emit('aspectRatio', ratio);
        }
    });
    _utils.def(art, 'aspectRatioReset', {
        set (value) {
            if (value) {
                const { aspectRatio  } = art;
                art.aspectRatio = aspectRatio;
            }
        }
    });
}
exports.default = aspectRatioMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"12WvT":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function screenshotMix(art) {
    const { option , notice , template: { $video  } ,  } = art;
    const $canvas = document.createElement('canvas');
    _utils.def(art, 'getDataURL', {
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
    _utils.def(art, 'getBlobUrl', {
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
    _utils.def(art, 'screenshot', {
        value: async ()=>{
            const dataUri = await art.getDataURL();
            _utils.download(dataUri, `${option.title || 'artplayer'}_${_utils.secondToTime($video.currentTime)}.png`);
            art.emit('screenshot', dataUri);
            return dataUri;
        }
    });
}
exports.default = screenshotMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"gNUzM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _screenfull = require("../libs/screenfull");
var _screenfullDefault = parcelHelpers.interopDefault(_screenfull);
var _utils = require("../utils");
function fullscreenMix(art1) {
    const { i18n , notice , template: { $video , $player  } ,  } = art1;
    const screenfull = _screenfullDefault.default();
    const nativeScreenfull = (art)=>{
        screenfull.on('change', ()=>art.emit('fullscreen', screenfull.isFullscreen)
        );
        _utils.def(art, 'fullscreen', {
            get () {
                return screenfull.isFullscreen;
            },
            async set (value) {
                if (value) {
                    art.normalSize = 'fullscreen';
                    art.aspectRatioReset = true;
                    art.autoSize = false;
                    await screenfull.request($player);
                    _utils.addClass($player, 'art-fullscreen');
                    art.emit('resize');
                    art.emit('fullscreen', true);
                    notice.show = '';
                } else {
                    art.aspectRatioReset = true;
                    art.autoSize = art.option.autoSize;
                    await screenfull.exit();
                    _utils.removeClass($player, 'art-fullscreen');
                    art.emit('resize');
                    art.emit('fullscreen');
                    notice.show = '';
                }
            }
        });
    };
    const webkitScreenfull = (art)=>{
        _utils.def(art, 'fullscreen', {
            get () {
                return $video.webkitDisplayingFullscreen;
            },
            set (value) {
                if (value) {
                    art.normalSize = 'fullscreen';
                    $video.webkitEnterFullscreen();
                    art.emit('fullscreen', true);
                    notice.show = '';
                } else {
                    $video.webkitExitFullscreen();
                    art.emit('fullscreen');
                    notice.show = '';
                }
            }
        });
    };
    art1.once('video:loadedmetadata', ()=>{
        if (screenfull.isEnabled) nativeScreenfull(art1);
        else if (document.fullscreenEnabled || $video.webkitSupportsFullscreen) webkitScreenfull(art1);
        else _utils.def(art1, 'fullscreen', {
            get () {
                return false;
            },
            set () {
                notice.show = i18n.get('Fullscreen Not Supported');
            }
        });
        // Asynchronous setting
        _utils.def(art1, 'fullscreen', _utils.get(art1, 'fullscreen'));
    });
}
exports.default = fullscreenMix;

},{"../libs/screenfull":"eQous","../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"eQous":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
function getScreenfull() {
    const methodMap = [
        [
            'requestFullscreen',
            'exitFullscreen',
            'fullscreenElement',
            'fullscreenEnabled',
            'fullscreenchange',
            'fullscreenerror', 
        ],
        // New WebKit
        [
            'webkitRequestFullscreen',
            'webkitExitFullscreen',
            'webkitFullscreenElement',
            'webkitFullscreenEnabled',
            'webkitfullscreenchange',
            'webkitfullscreenerror', 
        ],
        // Old WebKit
        [
            'webkitRequestFullScreen',
            'webkitCancelFullScreen',
            'webkitCurrentFullScreenElement',
            'webkitCancelFullScreen',
            'webkitfullscreenchange',
            'webkitfullscreenerror', 
        ],
        [
            'mozRequestFullScreen',
            'mozCancelFullScreen',
            'mozFullScreenElement',
            'mozFullScreenEnabled',
            'mozfullscreenchange',
            'mozfullscreenerror', 
        ],
        [
            'msRequestFullscreen',
            'msExitFullscreen',
            'msFullscreenElement',
            'msFullscreenEnabled',
            'MSFullscreenChange',
            'MSFullscreenError', 
        ], 
    ];
    const nativeAPI = (()=>{
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
    let screenfull = {
        // eslint-disable-next-line default-param-last
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
            // Coerce to boolean in case of old WebKit.
            get: ()=>Boolean(document[nativeAPI.fullscreenEnabled])
        }
    });
    if (!nativeAPI) screenfull = {
        isEnabled: false
    };
    return screenfull;
}
exports.default = getScreenfull;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"f2xmf":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function fullscreenWebMix(art) {
    const { notice , template: { $player  } ,  } = art;
    _utils.def(art, 'fullscreenWeb', {
        get () {
            return _utils.hasClass($player, 'art-fullscreen-web');
        },
        set (value) {
            if (value) {
                art.normalSize = 'fullscreenWeb';
                _utils.addClass($player, 'art-fullscreen-web');
                art.aspectRatioReset = true;
                art.autoSize = false;
                art.emit('resize');
                art.emit('fullscreenWeb', true);
                notice.show = '';
            } else {
                _utils.removeClass($player, 'art-fullscreen-web');
                art.aspectRatioReset = true;
                art.autoSize = art.option.autoSize;
                art.emit('resize');
                art.emit('fullscreenWeb');
                notice.show = '';
            }
        }
    });
}
exports.default = fullscreenWebMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"i5i0P":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function nativePip(art) {
    const { template: { $video  } , events: { proxy  } , notice ,  } = art;
    $video.disablePictureInPicture = false;
    _utils.def(art, 'pip', {
        get () {
            return document.pictureInPictureElement;
        },
        set (value) {
            if (value) {
                art.normalSize = 'pip';
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
        art.emit('pip');
    });
}
function webkitPip(art) {
    const { $video  } = art.template;
    $video.webkitSetPresentationMode('inline');
    _utils.def(art, 'pip', {
        get () {
            return $video.webkitPresentationMode === 'picture-in-picture';
        },
        set (value) {
            if (value) {
                art.normalSize = 'pip';
                $video.webkitSetPresentationMode('picture-in-picture');
                art.emit('pip', true);
            } else {
                $video.webkitSetPresentationMode('inline');
                art.emit('pip');
            }
        }
    });
}
function pipMix(art) {
    const { i18n , notice , template: { $video  } ,  } = art;
    if (document.pictureInPictureEnabled) nativePip(art);
    else if ($video.webkitSupportsPresentationMode) webkitPip(art);
    else _utils.def(art, 'pip', {
        get () {
            return false;
        },
        set () {
            notice.show = i18n.get('PIP Not Supported');
        }
    });
}
exports.default = pipMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"8X9EY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function seekMix(art) {
    const { $video  } = art.template;
    _utils.def(art, 'loaded', {
        get: ()=>art.loadedTime / $video.duration
    });
    _utils.def(art, 'loadedTime', {
        get: ()=>$video.buffered.length ? $video.buffered.end($video.buffered.length - 1) : 0
    });
}
exports.default = seekMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"1ziBX":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function playedMix(art) {
    _utils.def(art, 'played', {
        get: ()=>art.currentTime / art.duration
    });
}
exports.default = playedMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"9898W":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function playingMix(art) {
    const { $video  } = art.template;
    _utils.def(art, 'playing', {
        get: ()=>!!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2)
    });
}
exports.default = playingMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"b1yGg":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function resizeMix(art) {
    const { $container , $player , $video  } = art.template;
    _utils.def(art, 'autoSize', {
        get () {
            return _utils.hasClass($container, 'art-auto-size');
        },
        set (value) {
            if (value) {
                const { videoWidth , videoHeight  } = $video;
                const { width , height  } = $container.getBoundingClientRect();
                const videoRatio = videoWidth / videoHeight;
                const containerRatio = width / height;
                _utils.addClass($container, 'art-auto-size');
                if (containerRatio > videoRatio) {
                    const percentage = height * videoRatio / width * 100;
                    _utils.setStyle($player, 'width', `${percentage}%`);
                    _utils.setStyle($player, 'height', '100%');
                } else {
                    const percentage = width / videoRatio / height * 100;
                    _utils.setStyle($player, 'width', '100%');
                    _utils.setStyle($player, 'height', `${percentage}%`);
                }
                art.emit('autoSize', {
                    width: art.width,
                    height: art.height
                });
            } else {
                _utils.removeClass($container, 'art-auto-size');
                _utils.setStyle($player, 'width', null);
                _utils.setStyle($player, 'height', null);
                art.emit('autoSize');
            }
        }
    });
}
exports.default = resizeMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"eKKgI":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function rectMix(art) {
    _utils.def(art, 'rect', {
        get: ()=>{
            return art.template.$player.getBoundingClientRect();
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
        _utils.def(art, key, {
            get: ()=>{
                return art.rect[key];
            }
        });
    }
    _utils.def(art, 'x', {
        get: ()=>{
            return art.left + window.pageXOffset;
        }
    });
    _utils.def(art, 'y', {
        get: ()=>{
            return art.top + window.pageYOffset;
        }
    });
}
exports.default = rectMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"ad3ay":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function flipMix(art) {
    const { template: { $player  } , i18n , notice ,  } = art;
    _utils.def(art, 'flip', {
        get () {
            return $player.dataset.flip || 'normal';
        },
        set (flip) {
            if (!flip) flip = 'normal';
            const flipList = [
                'normal',
                'horizontal',
                'vertical'
            ];
            _utils.errorHandle(flipList.includes(flip), `'flip' only accept ${flipList.toString()} as parameters`);
            if (flip === 'normal') delete $player.dataset.flip;
            else $player.dataset.flip = flip;
            const word = flip.replace(flip[0], flip[0].toUpperCase());
            notice.show = `${i18n.get('Video Flip')}: ${i18n.get(word)}`;
            art.emit('flip', flip);
        }
    });
}
exports.default = flipMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"hUF3v":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function miniMix(art) {
    const { i18n , option , storage , events: { proxy  } , template: { $player , $miniClose , $miniTitle , $miniHeader  } ,  } = art;
    let cacheStyle = '';
    let isDroging = false;
    let lastPageX = 0;
    let lastPageY = 0;
    let lastPlayerLeft = 0;
    let lastPlayerTop = 0;
    proxy($miniHeader, 'mousedown', (event)=>{
        isDroging = true;
        lastPageX = event.pageX;
        lastPageY = event.pageY;
        lastPlayerLeft = art.left;
        lastPlayerTop = art.top;
    });
    proxy(document, 'mousemove', (event)=>{
        if (isDroging) {
            _utils.addClass($player, 'art-is-dragging');
            const top = lastPlayerTop + event.pageY - lastPageY;
            const left = lastPlayerLeft + event.pageX - lastPageX;
            _utils.setStyle($player, 'top', `${top}px`);
            _utils.setStyle($player, 'left', `${left}px`);
            storage.set('top', top);
            storage.set('left', left);
        }
    });
    proxy(document, 'mouseup', ()=>{
        isDroging = false;
        _utils.removeClass($player, 'art-is-dragging');
    });
    proxy($miniClose, 'click', ()=>{
        art.mini = false;
        isDroging = false;
        _utils.removeClass($player, 'art-is-dragging');
    });
    _utils.append($miniTitle, option.title || i18n.get('Mini Player'));
    _utils.def(art, 'mini', {
        get () {
            return _utils.hasClass($player, 'art-mini');
        },
        set (value) {
            if (value) {
                art.normalSize = 'mini';
                art.autoSize = false;
                cacheStyle = $player.style.cssText;
                _utils.addClass($player, 'art-mini');
                const top = storage.get('top');
                const left = storage.get('left');
                if (top && left) {
                    _utils.setStyle($player, 'top', `${top}px`);
                    _utils.setStyle($player, 'left', `${left}px`);
                    if (!_utils.isInViewport($miniHeader)) {
                        storage.del('top');
                        storage.del('left');
                        art.mini = true;
                    }
                } else {
                    const $body = document.body;
                    const top = $body.clientHeight - art.height - 50;
                    const left = $body.clientWidth - art.width - 50;
                    storage.set('top', top);
                    storage.set('left', left);
                    _utils.setStyle($player, 'top', `${top}px`);
                    _utils.setStyle($player, 'left', `${left}px`);
                }
                art.aspectRatio = false;
                art.playbackRate = false;
                art.notice.show = '';
                art.emit('mini', true);
            } else {
                $player.style.cssText = cacheStyle;
                _utils.removeClass($player, 'art-mini');
                _utils.setStyle($player, 'top', null);
                _utils.setStyle($player, 'left', null);
                art.aspectRatio = false;
                art.playbackRate = false;
                art.autoSize = option.autoSize;
                art.notice.show = '';
                art.emit('mini');
            }
        }
    });
}
exports.default = miniMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"gXFcr":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function loopMix(art) {
    let interval = [];
    _utils.def(art, 'loop', {
        get: ()=>interval
        ,
        set: (value)=>{
            if (Array.isArray(value) && typeof value[0] === 'number' && typeof value[1] === 'number') {
                const start = _utils.clamp(value[0], 0, Math.min(value[1], art.duration));
                const end = _utils.clamp(value[1], start, art.duration);
                if (end - start >= 1) {
                    interval = [
                        start,
                        end
                    ];
                    art.emit('loop', interval);
                } else {
                    interval = [];
                    art.emit('loop');
                }
            } else {
                interval = [];
                art.emit('loop');
            }
        }
    });
    art.on('video:timeupdate', ()=>{
        if (interval.length) {
            if (art.currentTime < interval[0] || art.currentTime > interval[1]) art.seek = interval[0];
        }
    });
}
exports.default = loopMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"6j7ij":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function posterMix(art) {
    const { option , template: { $poster  } ,  } = art;
    _utils.def(art, 'poster', {
        get: ()=>option.poster
        ,
        set (url) {
            option.poster = url;
            _utils.setStyle($poster, 'backgroundImage', `url(${url})`);
        }
    });
}
exports.default = posterMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"8Mzuu":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function autoHeightMix(art) {
    const { option , template: { $container , $video  } ,  } = art;
    const heightCache = $container.style.height;
    _utils.def(art, 'autoHeight', {
        get () {
            return _utils.hasClass($container, 'art-auto-height');
        },
        set (value) {
            if (value) {
                const { clientWidth  } = $container;
                const { videoHeight , videoWidth  } = $video;
                const height = videoHeight * (clientWidth / videoWidth);
                _utils.setStyle($container, 'height', height + 'px');
                _utils.addClass($container, 'art-auto-height');
                art.autoSize = option.autoSize;
                art.emit('autoHeight', height);
            } else {
                _utils.setStyle($container, 'height', heightCache);
                _utils.removeClass($container, 'art-auto-height');
                art.autoSize = option.autoSize;
                art.emit('autoHeight');
            }
        }
    });
}
exports.default = autoHeightMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"dv3lF":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function themeMix(art) {
    const { option , template: { $player  } ,  } = art;
    _utils.def(art, 'theme', {
        get () {
            return getComputedStyle($player).getPropertyValue('--theme');
        },
        set (theme) {
            option.theme = theme;
            $player.style.setProperty('--theme', theme);
        }
    });
}
exports.default = themeMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"5I0kK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function titleMix(art) {
    _utils.def(art, 'title', {
        get () {
            return art.option.title;
        },
        set (title) {
            art.option.title = title;
        }
    });
}
exports.default = titleMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"9U4Nw":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function normalSizeMix(art) {
    const sizeProps = [
        'mini',
        'pip',
        'fullscreen',
        'fullscreenWeb'
    ];
    _utils.def(art, 'normalSize', {
        get () {
            return sizeProps.every((name)=>!art[name]
            );
        },
        set (name) {
            sizeProps.filter((item)=>item !== name
            ).forEach((item)=>{
                if (art[item]) art[item] = false;
            });
        }
    });
}
exports.default = normalSizeMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"lTNEf":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function subtitleOffsetMix(art) {
    const { clamp  } = art.constructor.utils;
    const { notice , template , i18n  } = art;
    let offsetCache = 0;
    let cuesCache = [];
    art.on('subtitle:switch', ()=>{
        cuesCache = [];
    });
    _utils.def(art, 'subtitleOffset', {
        get () {
            return offsetCache;
        },
        set (value) {
            if (template.$track && template.$track.track) {
                const cues = Array.from(template.$track.track.cues);
                offsetCache = clamp(value, -5, 5);
                for(let index = 0; index < cues.length; index++){
                    const cue = cues[index];
                    if (!cuesCache[index]) cuesCache[index] = {
                        startTime: cue.startTime,
                        endTime: cue.endTime
                    };
                    cue.startTime = clamp(cuesCache[index].startTime + offsetCache, 0, art.duration);
                    cue.endTime = clamp(cuesCache[index].endTime + offsetCache, 0, art.duration);
                }
                art.subtitle.update();
                notice.show = `${i18n.get('Subtitle Offset')}: ${value}s`;
                art.emit('subtitleOffset', value);
            } else art.emit('subtitleOffset', 0);
        }
    });
}
exports.default = subtitleOffsetMix;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"9Us4p":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function attrInit(art) {
    const { option , storage , template: { $video , $poster  } ,  } = art;
    Object.keys(option.moreVideoAttr).forEach((key)=>{
        art.attr(key, option.moreVideoAttr[key]);
    });
    if (option.muted) art.muted = option.muted;
    if (option.volume) $video.volume = _utils.clamp(option.volume, 0, 1);
    const volumeStorage = storage.get('volume');
    if (typeof volumeStorage === 'number') $video.volume = _utils.clamp(volumeStorage, 0, 1);
    if (option.poster) _utils.setStyle($poster, 'backgroundImage', `url(${option.poster})`);
    if (option.autoplay) $video.autoplay = option.autoplay;
    if (option.playsInline) {
        $video.playsInline = true;
        $video['webkit-playsinline'] = true;
    }
    if (option.theme) art.theme = option.theme;
    if (option.ads.length === 0) art.url = option.url;
}
exports.default = attrInit;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"4hZCW":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _config = require("../config");
var _configDefault = parcelHelpers.interopDefault(_config);
var _utils = require("../utils");
function eventInit(art) {
    const { i18n , notice , option , constructor , events: { proxy  } , template: { $player , $video , $poster  } ,  } = art;
    let reconnectTime = 0;
    for(let index = 0; index < _configDefault.default.events.length; index++)proxy($video, _configDefault.default.events[index], (event)=>{
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
    art.on('video:error', async ()=>{
        if (reconnectTime < constructor.RECONNECT_TIME_MAX) {
            await _utils.sleep(constructor.RECONNECT_SLEEP_TIME);
            reconnectTime += 1;
            art.url = option.url;
            notice.show = `${i18n.get('Reconnect')}: ${reconnectTime}`;
            art.emit('error', reconnectTime);
        } else {
            art.mask.show = true;
            art.loading.show = false;
            art.controls.show = true;
            _utils.addClass($player, 'art-error');
            await _utils.sleep(constructor.RECONNECT_SLEEP_TIME);
            notice.show = i18n.get('Video Load Failed');
            art.destroy(false);
        }
    });
    // art.on('video:loadeddata', () => {
    // });
    art.on('video:loadedmetadata', ()=>{
        art.autoSize = option.autoSize;
        if (_utils.isMobile) {
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
        _utils.setStyle($poster, 'display', 'none');
    });
    art.on('video:playing', ()=>{
        art.mask.show = false;
    });
    // art.on('video:progress', () => {
    // });
    // art.on('video:ratechange', () => {
    // });
    art.on('video:seeked', ()=>{
        art.loading.show = false;
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
exports.default = eventInit;

},{"../config":"2ZnKD","../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"faO0X":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
var _component = require("../utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
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
var _time = require("./time");
var _timeDefault = parcelHelpers.interopDefault(_time);
var _volume = require("./volume");
var _volumeDefault = parcelHelpers.interopDefault(_volume);
var _setting = require("./setting");
var _settingDefault = parcelHelpers.interopDefault(_setting);
var _thumbnails = require("./thumbnails");
var _thumbnailsDefault = parcelHelpers.interopDefault(_thumbnails);
var _screenshot = require("./screenshot");
var _screenshotDefault = parcelHelpers.interopDefault(_screenshot);
var _quality = require("./quality");
var _qualityDefault = parcelHelpers.interopDefault(_quality);
var _loop = require("./loop");
var _loopDefault = parcelHelpers.interopDefault(_loop);
class Control extends _componentDefault.default {
    constructor(art){
        super(art);
        this.name = 'control';
        const { constructor , events: { proxy  } , template: { $player  } ,  } = art;
        let activeTime = Date.now();
        proxy($player, [
            'click',
            'mousemove',
            'touchstart',
            'touchmove'
        ], ()=>{
            this.show = true;
            _utils.removeClass($player, 'art-hide-cursor');
            _utils.addClass($player, 'art-hover');
            activeTime = Date.now();
        });
        art.on('video:timeupdate', ()=>{
            if (!art.isInput && art.playing && this.show && Date.now() - activeTime >= constructor.CONTROL_HIDE_TIME) {
                this.show = false;
                _utils.addClass($player, 'art-hide-cursor');
                _utils.removeClass($player, 'art-hover');
            }
        });
        this.init();
    }
    init() {
        const { option  } = this.art;
        this.add(_progressDefault.default({
            name: 'progress',
            disable: option.isLive,
            position: 'top',
            index: 10
        }));
        this.add(_thumbnailsDefault.default({
            name: 'thumbnails',
            disable: !option.thumbnails.url || option.isLive || _utils.isMobile,
            position: 'top',
            index: 20
        }));
        this.add(_loopDefault.default({
            name: 'loop',
            disable: false,
            position: 'top',
            index: 30
        }));
        this.add(_playAndPauseDefault.default({
            name: 'playAndPause',
            disable: false,
            position: 'left',
            index: 10
        }));
        this.add(_volumeDefault.default({
            name: 'volume',
            disable: false,
            position: 'left',
            index: 20
        }));
        this.add(_timeDefault.default({
            name: 'time',
            disable: option.isLive,
            position: 'left',
            index: 30
        }));
        this.add(_qualityDefault.default({
            name: 'quality',
            disable: option.quality.length === 0,
            position: 'right',
            index: 10
        }));
        this.add(_screenshotDefault.default({
            name: 'screenshot',
            disable: !option.screenshot || _utils.isMobile,
            position: 'right',
            index: 20
        }));
        this.add(_settingDefault.default({
            name: 'setting',
            disable: !option.setting,
            position: 'right',
            index: 30
        }));
        this.add(_pipDefault.default({
            name: 'pip',
            disable: !option.pip,
            position: 'right',
            index: 40
        }));
        this.add(_fullscreenWebDefault.default({
            name: 'fullscreenWeb',
            disable: !option.fullscreenWeb,
            position: 'right',
            index: 50
        }));
        this.add(_fullscreenDefault.default({
            name: 'fullscreen',
            disable: !option.fullscreen,
            position: 'right',
            index: 60
        }));
        for(let index = 0; index < option.controls.length; index++)this.add(option.controls[index]);
    }
    add(getOption) {
        const option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        const { $progress , $controlsLeft , $controlsRight  } = this.art.template;
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
                _utils.errorHandle(false, `Control option.position must one of 'top', 'left', 'right'`);
                break;
        }
        super.add(option);
    }
}
exports.default = Control;

},{"../utils":"jmgNb","../utils/component":"bgug2","./fullscreen":"bHDMy","./fullscreenWeb":"8HUSd","./pip":"5nd2H","./playAndPause":"gt2F0","./progress":"aHyb0","./time":"hL9ry","./volume":"3G9Wa","./setting":"jQ9Bw","./thumbnails":"8HBQN","./screenshot":"aA6wc","./quality":"5Zppa","./loop":"3bPO6","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"bgug2":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _dom = require("./dom");
var _optionValidator = require("option-validator");
var _optionValidatorDefault = parcelHelpers.interopDefault(_optionValidator);
var _scheme = require("../scheme");
var _property = require("./property");
var _error = require("./error");
class Component {
    constructor(art){
        this.id = 0;
        this.art = art;
        this.add = this.add.bind(this);
    }
    get show() {
        return _dom.hasClass(this.art.template.$player, `art-${this.name}-show`);
    }
    set show(value) {
        const { $player  } = this.art.template;
        const className = `art-${this.name}-show`;
        if (value) _dom.addClass($player, className);
        else _dom.removeClass($player, className);
        this.art.emit(this.name, value);
    }
    set toggle(value) {
        if (value) this.show = !this.show;
    }
    add(getOption) {
        const option = typeof getOption === 'function' ? getOption(this.art) : getOption;
        option.html = option.html || '';
        _optionValidatorDefault.default(option, _scheme.ComponentOption);
        if (!this.$parent || !this.name || option.disable) return;
        const name = option.name || `${this.name}${this.id}`;
        _error.errorHandle(!_property.has(this, name), `Cannot add an existing name [${name}] to the [${this.name}]`);
        this.id += 1;
        const $ref = document.createElement('div');
        _dom.addClass($ref, `art-${this.name}`);
        _dom.addClass($ref, `art-${this.name}-${name}`);
        const childs = Array.from(this.$parent.children);
        $ref.dataset.index = option.index || this.id;
        const nextChild = childs.find((item)=>Number(item.dataset.index) >= Number($ref.dataset.index)
        );
        if (nextChild) nextChild.insertAdjacentElement('beforebegin', $ref);
        else _dom.append(this.$parent, $ref);
        if (option.html) _dom.append($ref, option.html);
        if (option.style) _dom.setStyles($ref, option.style);
        if (option.tooltip) _dom.tooltip($ref, option.tooltip);
        if (option.click) this.art.events.proxy($ref, 'click', (event)=>{
            event.preventDefault();
            option.click.call(this.art, this, event);
        });
        if (option.selector && [
            'left',
            'right'
        ].includes(option.position)) this.selector(option, $ref);
        if (option.mounted) option.mounted.call(this.art, $ref);
        if ($ref.childNodes.length === 1 && $ref.childNodes[0].nodeType === 3) _dom.addClass($ref, 'art-control-onlyText');
        _property.def(this, name, {
            value: $ref
        });
        return $ref;
    }
    selector(option, $ref) {
        const { hover , proxy  } = this.art.events;
        _dom.addClass($ref, 'art-control-selector');
        const $value = document.createElement('div');
        _dom.addClass($value, 'art-selector-value');
        _dom.append($value, option.html);
        $ref.innerText = '';
        _dom.append($ref, $value);
        const list = option.selector.map((item, index)=>`<div class="art-selector-item ${item.default ? 'art-current' : ''}" data-index="${index}">${item.html}</div>`
        ).join('');
        const $list = document.createElement('div');
        _dom.addClass($list, 'art-selector-list');
        _dom.append($list, list);
        _dom.append($ref, $list);
        const setLeft = ()=>{
            const left = _dom.getStyle($ref, 'width') / 2 - _dom.getStyle($list, 'width') / 2;
            $list.style.left = `${left}px`;
        };
        hover($ref, setLeft);
        proxy($list, 'click', async (event)=>{
            const path = event.composedPath() || [];
            const $item = path.find((item)=>_dom.hasClass(item, 'art-selector-item')
            );
            if (!$item) return;
            _dom.inverseClass($item, 'art-current');
            const index = Number($item.dataset.index);
            const find = option.selector[index] || {};
            $value.innerText = $item.innerText;
            if (option.onSelect) {
                const result = await option.onSelect.call(this.art, find, $item, event);
                if (typeof result === 'string' || typeof result === 'number') $value.innerHTML = result;
            }
            setLeft();
            this.art.emit('selector', find, $item);
        });
    }
}
exports.default = Component;

},{"./dom":"dNynC","option-validator":"i7tUx","../scheme":"gL38d","./property":"91nLd","./error":"622b3","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"bHDMy":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function fullscreen(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Fullscreen'),
            mounted: ($control)=>{
                const { events: { proxy  } , icons , i18n ,  } = art;
                const $fullscreenOn = _utils.append($control, icons.fullscreenOn);
                const $fullscreenOff = _utils.append($control, icons.fullscreenOff);
                _utils.setStyle($fullscreenOff, 'display', 'none');
                proxy($control, 'click', ()=>{
                    art.fullscreen = !art.fullscreen;
                });
                art.on('fullscreen', (value)=>{
                    if (value) {
                        _utils.tooltip($control, i18n.get('Exit Fullscreen'));
                        _utils.setStyle($fullscreenOn, 'display', 'none');
                        _utils.setStyle($fullscreenOff, 'display', 'inline-flex');
                    } else {
                        _utils.tooltip($control, i18n.get('Fullscreen'));
                        _utils.setStyle($fullscreenOn, 'display', 'inline-flex');
                        _utils.setStyle($fullscreenOff, 'display', 'none');
                    }
                });
            }
        })
    ;
}
exports.default = fullscreen;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"8HUSd":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function fullscreenWeb(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Web Fullscreen'),
            mounted: ($control)=>{
                const { events: { proxy  } , icons , i18n ,  } = art;
                const $fullscreenWebOn = _utils.append($control, icons.fullscreenWebOn);
                const $fullscreenWebOff = _utils.append($control, icons.fullscreenWebOff);
                _utils.setStyle($fullscreenWebOff, 'display', 'none');
                proxy($control, 'click', ()=>{
                    art.fullscreenWeb = !art.fullscreenWeb;
                });
                art.on('fullscreenWeb', (value)=>{
                    if (value) {
                        _utils.tooltip($control, i18n.get('Exit Web Fullscreen'));
                        _utils.setStyle($fullscreenWebOn, 'display', 'none');
                        _utils.setStyle($fullscreenWebOff, 'display', 'inline-flex');
                    } else {
                        _utils.tooltip($control, i18n.get('Web Fullscreen'));
                        _utils.setStyle($fullscreenWebOn, 'display', 'inline-flex');
                        _utils.setStyle($fullscreenWebOff, 'display', 'none');
                    }
                });
            }
        })
    ;
}
exports.default = fullscreenWeb;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"5nd2H":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function pip(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('PIP Mode'),
            mounted: ($control)=>{
                const { events: { proxy  } , icons , i18n ,  } = art;
                _utils.append($control, icons.pip);
                proxy($control, 'click', ()=>{
                    art.pip = !art.pip;
                });
                art.on('pip', (value)=>{
                    _utils.tooltip($control, i18n.get(value ? 'Exit PIP Mode' : 'PIP Mode'));
                });
            }
        })
    ;
}
exports.default = pip;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"gt2F0":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function playAndPause(option) {
    return (art)=>({
            ...option,
            mounted: ($control)=>{
                const { events: { proxy  } , icons , i18n ,  } = art;
                const $play = _utils.append($control, icons.play);
                const $pause = _utils.append($control, icons.pause);
                _utils.tooltip($play, i18n.get('Play'));
                _utils.tooltip($pause, i18n.get('Pause'));
                proxy($play, 'click', ()=>{
                    art.play();
                });
                proxy($pause, 'click', ()=>{
                    art.pause();
                });
                function showPlay() {
                    _utils.setStyle($play, 'display', 'flex');
                    _utils.setStyle($pause, 'display', 'none');
                }
                function showPause() {
                    _utils.setStyle($play, 'display', 'none');
                    _utils.setStyle($pause, 'display', 'flex');
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
        })
    ;
}
exports.default = playAndPause;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"aHyb0":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getPosFromEvent", ()=>getPosFromEvent
);
var _utils = require("../utils");
function getPosFromEvent(art, event) {
    const { $progress  } = art.template;
    const { left  } = $progress.getBoundingClientRect();
    const eventLeft = event.pageX;
    const width = _utils.clamp(eventLeft - left, 0, $progress.clientWidth);
    const second = width / $progress.clientWidth * art.duration;
    const time = _utils.secondToTime(second);
    const percentage = _utils.clamp(width / $progress.clientWidth, 0, 1);
    return {
        second,
        time,
        width,
        percentage
    };
}
function progress(options) {
    return (art)=>{
        const { icons , option , events: { proxy  } ,  } = art;
        return {
            ...options,
            html: `
                <div class="art-control-progress-inner">
                    <div class="art-progress-loaded"></div>
                    <div class="art-progress-played"></div>
                    <div class="art-progress-highlight"></div>
                    <div class="art-progress-indicator"></div>
                    <div class="art-progress-tip"></div>
                </div>
            `,
            mounted: ($control)=>{
                let isDroging = false;
                const $loaded = _utils.query('.art-progress-loaded', $control);
                const $played = _utils.query('.art-progress-played', $control);
                const $highlight = _utils.query('.art-progress-highlight', $control);
                const $indicator = _utils.query('.art-progress-indicator', $control);
                const $tip = _utils.query('.art-progress-tip', $control);
                _utils.setStyle($played, 'backgroundColor', 'var(--theme)');
                let indicatorSize = art.constructor.INDICATOR_SIZE;
                if (icons.indicator) {
                    indicatorSize = art.constructor.INDICATOR_SIZE_ICON;
                    _utils.append($indicator, icons.indicator);
                } else _utils.setStyles($indicator, {
                    backgroundColor: 'var(--theme)'
                });
                if (_utils.isMobile) {
                    indicatorSize = art.constructor.INDICATOR_SIZE_MOBILE;
                    if (icons.indicator) indicatorSize = art.constructor.INDICATOR_SIZE_MOBILE_ICON;
                }
                _utils.setStyles($indicator, {
                    left: `-${indicatorSize / 2}px`,
                    width: `${indicatorSize}px`,
                    height: `${indicatorSize}px`
                });
                function showHighlight(event) {
                    const { width  } = getPosFromEvent(art, event);
                    const { text  } = event.target.dataset;
                    $tip.innerHTML = text;
                    const tipWidth = $tip.clientWidth;
                    if (width <= tipWidth / 2) _utils.setStyle($tip, 'left', 0);
                    else if (width > $control.clientWidth - tipWidth / 2) _utils.setStyle($tip, 'left', `${$control.clientWidth - tipWidth}px`);
                    else _utils.setStyle($tip, 'left', `${width - tipWidth / 2}px`);
                }
                function showTime(event) {
                    const { width , time  } = getPosFromEvent(art, event);
                    $tip.innerHTML = time;
                    const tipWidth = $tip.clientWidth;
                    if (width <= tipWidth / 2) _utils.setStyle($tip, 'left', 0);
                    else if (width > $control.clientWidth - tipWidth / 2) _utils.setStyle($tip, 'left', `${$control.clientWidth - tipWidth}px`);
                    else _utils.setStyle($tip, 'left', `${width - tipWidth / 2}px`);
                }
                function setBar(type, percentage) {
                    if (type === 'loaded') _utils.setStyle($loaded, 'width', `${percentage * 100}%`);
                    if (type === 'played') {
                        _utils.setStyle($played, 'width', `${percentage * 100}%`);
                        _utils.setStyle($indicator, 'left', `calc(${percentage * 100}% - ${indicatorSize / 2}px)`);
                    }
                }
                art.on('video:loadedmetadata', ()=>{
                    for(let index = 0; index < option.highlight.length; index++){
                        const item = option.highlight[index];
                        const left = _utils.clamp(item.time, 0, art.duration) / art.duration * 100;
                        _utils.append($highlight, `<span data-text="${item.text}" data-time="${item.time}" style="left: ${left}%"></span>`);
                    }
                });
                setBar('loaded', art.loaded);
                art.on('setBar', (type, percentage)=>{
                    setBar(type, percentage);
                });
                art.on('video:progress', ()=>{
                    setBar('loaded', art.loaded);
                });
                art.on('video:timeupdate', ()=>{
                    setBar('played', art.played);
                });
                art.on('video:ended', ()=>{
                    setBar('played', 1);
                });
                if (!_utils.isMobile) {
                    proxy($control, 'click', (event)=>{
                        if (event.target !== $indicator) {
                            const { second , percentage  } = getPosFromEvent(art, event);
                            setBar('played', percentage);
                            art.seek = second;
                        }
                    });
                    proxy($control, 'mousemove', (event)=>{
                        _utils.setStyle($tip, 'display', 'block');
                        if (_utils.includeFromEvent(event, $highlight)) showHighlight(event);
                        else showTime(event);
                    });
                    proxy($control, 'mouseout', ()=>{
                        _utils.setStyle($tip, 'display', 'none');
                    });
                    proxy($indicator, 'mousedown', ()=>{
                        isDroging = true;
                    });
                    proxy(document, 'mousemove', (event)=>{
                        if (isDroging) {
                            const { second , percentage  } = getPosFromEvent(art, event);
                            setBar('played', percentage);
                            art.seek = second;
                        }
                    });
                    proxy(document, 'mouseup', ()=>{
                        if (isDroging) isDroging = false;
                    });
                }
            }
        };
    };
}
exports.default = progress;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"hL9ry":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function time(option) {
    return (art)=>({
            ...option,
            style: {
                cursor: 'auto'
            },
            mounted: ($control)=>{
                function getTime() {
                    const newTime = `${_utils.secondToTime(art.currentTime)} / ${_utils.secondToTime(art.duration)}`;
                    if (newTime !== $control.innerText) $control.innerText = newTime;
                }
                getTime();
                const events = [
                    'video:loadedmetadata',
                    'video:timeupdate',
                    'video:progress'
                ];
                for(let index = 0; index < events.length; index++)art.on(events[index], getTime);
            }
        })
    ;
}
exports.default = time;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"3G9Wa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function volume(option) {
    return (art)=>({
            ...option,
            mounted: ($control)=>{
                const { events: { proxy  } , icons , i18n ,  } = art;
                let isDroging = false;
                const panelWidth = art.constructor.VOLUME_PANEL_WIDTH;
                const handleWidth = art.constructor.VOLUME_HANDLE_WIDTH;
                const $volume = _utils.append($control, icons.volume);
                const $volumeClose = _utils.append($control, icons.volumeClose);
                const $volumePanel = _utils.append($control, '<div class="art-volume-panel"></div>');
                const $volumeHandle = _utils.append($volumePanel, '<div class="art-volume-slider-handle"></div>');
                _utils.tooltip($volume, i18n.get('Mute'));
                _utils.setStyle($volumeClose, 'display', 'none');
                if (_utils.isMobile) _utils.setStyle($volumePanel, 'display', 'none');
                function volumeChangeFromEvent(event) {
                    const { left: panelLeft  } = $volumePanel.getBoundingClientRect();
                    const percentage = _utils.clamp(event.pageX - panelLeft - handleWidth / 2, 0, panelWidth - handleWidth / 2) / (panelWidth - handleWidth);
                    return percentage;
                }
                function setVolumeHandle(percentage = 0.7) {
                    if (art.muted || percentage === 0) {
                        _utils.setStyle($volume, 'display', 'none');
                        _utils.setStyle($volumeClose, 'display', 'flex');
                        _utils.setStyle($volumeHandle, 'left', '0');
                    } else {
                        const width = (panelWidth - handleWidth) * percentage;
                        _utils.setStyle($volume, 'display', 'flex');
                        _utils.setStyle($volumeClose, 'display', 'none');
                        _utils.setStyle($volumeHandle, 'left', `${width}px`);
                    }
                }
                setVolumeHandle(art.volume);
                art.on('video:volumechange', ()=>{
                    setVolumeHandle(art.volume);
                });
                proxy($volume, 'click', ()=>{
                    art.muted = true;
                });
                proxy($volumeClose, 'click', ()=>{
                    art.muted = false;
                });
                proxy($volumePanel, 'click', (event)=>{
                    art.muted = false;
                    art.volume = volumeChangeFromEvent(event);
                });
                proxy($volumeHandle, 'mousedown', ()=>{
                    isDroging = true;
                });
                proxy($control, 'mousemove', (event)=>{
                    if (isDroging) {
                        art.muted = false;
                        art.volume = volumeChangeFromEvent(event);
                    }
                });
                proxy(document, 'mouseup', ()=>{
                    if (isDroging) isDroging = false;
                });
            }
        })
    ;
}
exports.default = volume;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"jQ9Bw":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function setting(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Show Setting'),
            mounted: ($control)=>{
                const { events: { proxy  } , icons , i18n ,  } = art;
                _utils.append($control, icons.setting);
                proxy($control, 'click', ()=>{
                    art.setting.toggle = true;
                });
                art.on('setting', (value)=>{
                    _utils.tooltip($control, i18n.get(value ? 'Hide Setting' : 'Show Setting'));
                });
            }
        })
    ;
}
exports.default = setting;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"8HBQN":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
var _progress = require("./progress");
function thumbnails(options) {
    return (art)=>({
            ...options,
            mounted: ($control)=>{
                const { option , template: { $progress , $video  } , events: { proxy , loadImg  } ,  } = art;
                let image = null;
                let loading = false;
                let isLoad = false;
                function showThumbnails(event) {
                    const { width: posWidth  } = _progress.getPosFromEvent(art, event);
                    const { url , number , column  } = option.thumbnails;
                    const width = image.naturalWidth / column;
                    const height = width / ($video.videoWidth / $video.videoHeight);
                    const perWidth = $progress.clientWidth / number;
                    const perIndex = Math.floor(posWidth / perWidth);
                    const yIndex = Math.ceil(perIndex / column) - 1;
                    const xIndex = perIndex % column || column - 1;
                    _utils.setStyle($control, 'backgroundImage', `url(${url})`);
                    _utils.setStyle($control, 'height', `${height}px`);
                    _utils.setStyle($control, 'width', `${width}px`);
                    _utils.setStyle($control, 'backgroundPosition', `-${xIndex * width}px -${yIndex * height}px`);
                    if (posWidth <= width / 2) _utils.setStyle($control, 'left', 0);
                    else if (posWidth > $progress.clientWidth - width / 2) _utils.setStyle($control, 'left', `${$progress.clientWidth - width}px`);
                    else _utils.setStyle($control, 'left', `${posWidth - width / 2}px`);
                }
                proxy($progress, 'mousemove', async (event)=>{
                    if (!loading) {
                        loading = true;
                        const img = await loadImg(option.thumbnails.url);
                        image = img;
                        isLoad = true;
                    }
                    if (isLoad) {
                        _utils.setStyle($control, 'display', 'block');
                        showThumbnails(event);
                    }
                });
                proxy($progress, 'mouseout', ()=>{
                    _utils.setStyle($control, 'display', 'none');
                });
            }
        })
    ;
}
exports.default = thumbnails;

},{"../utils":"jmgNb","./progress":"aHyb0","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"aA6wc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function screenshot(option) {
    return (art)=>({
            ...option,
            tooltip: art.i18n.get('Screenshot'),
            mounted: ($control)=>{
                const { events: { proxy  } , icons ,  } = art;
                _utils.append($control, icons.screenshot);
                proxy($control, 'click', ()=>{
                    art.screenshot();
                });
            }
        })
    ;
}
exports.default = screenshot;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"5Zppa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
function quality(option) {
    return (art)=>{
        const qualityOption = art.option.quality;
        const qualityDefault = qualityOption.find((item)=>item.default
        ) || qualityOption[0];
        return {
            ...option,
            html: qualityDefault ? qualityDefault.html : '',
            selector: qualityOption,
            onSelect (item) {
                art.switchQuality(item.url, item.html);
            }
        };
    };
}
exports.default = quality;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"3bPO6":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function loop(option) {
    return (art)=>({
            ...option,
            mounted: ($control)=>{
                const $left = _utils.append($control, `<span class="art-loop-point"></span>`);
                const $right = _utils.append($control, `<span class="art-loop-point"></span>`);
                art.on('loop', (value)=>{
                    if (value) {
                        _utils.setStyle($control, 'display', 'block');
                        _utils.setStyle($left, 'left', `calc(${value[0] / art.duration * 100}% - ${$left.clientWidth}px)`);
                        _utils.setStyle($right, 'left', `${value[1] / art.duration * 100}%`);
                    } else _utils.setStyle($control, 'display', 'none');
                });
            }
        })
    ;
}
exports.default = loop;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"5npaZ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
var _component = require("../utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
var _playbackRate = require("./playbackRate");
var _playbackRateDefault = parcelHelpers.interopDefault(_playbackRate);
var _aspectRatio = require("./aspectRatio");
var _aspectRatioDefault = parcelHelpers.interopDefault(_aspectRatio);
var _flip = require("./flip");
var _flipDefault = parcelHelpers.interopDefault(_flip);
var _info = require("./info");
var _infoDefault = parcelHelpers.interopDefault(_info);
var _version = require("./version");
var _versionDefault = parcelHelpers.interopDefault(_version);
var _close = require("./close");
var _closeDefault = parcelHelpers.interopDefault(_close);
class Contextmenu extends _componentDefault.default {
    constructor(art){
        super(art);
        this.name = 'contextmenu';
        this.$parent = art.template.$contextmenu;
        if (!_utils.isMobile) this.init();
    }
    init() {
        const { option , template: { $player , $contextmenu  } , events: { proxy  } ,  } = this.art;
        this.add(_playbackRateDefault.default({
            disable: !option.playbackRate,
            name: 'playbackRate',
            index: 10
        }));
        this.add(_aspectRatioDefault.default({
            disable: !option.aspectRatio,
            name: 'aspectRatio',
            index: 20
        }));
        this.add(_flipDefault.default({
            disable: !option.flip,
            name: 'flip',
            index: 30
        }));
        this.add(_infoDefault.default({
            disable: false,
            name: 'info',
            index: 40
        }));
        this.add(_versionDefault.default({
            disable: false,
            name: 'version',
            index: 50
        }));
        this.add(_closeDefault.default({
            disable: false,
            name: 'close',
            index: 60
        }));
        for(let index = 0; index < option.contextmenu.length; index++)this.add(option.contextmenu[index]);
        proxy($player, 'contextmenu', (event)=>{
            event.preventDefault();
            this.show = true;
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            const { height: cHeight , width: cWidth , left: cLeft , top: cTop  } = $player.getBoundingClientRect();
            const { height: mHeight , width: mWidth  } = $contextmenu.getBoundingClientRect();
            let menuLeft = mouseX - cLeft;
            let menuTop = mouseY - cTop;
            if (mouseX + mWidth > cLeft + cWidth) menuLeft = cWidth - mWidth;
            if (mouseY + mHeight > cTop + cHeight) menuTop = cHeight - mHeight;
            _utils.setStyles($contextmenu, {
                top: `${menuTop}px`,
                left: `${menuLeft}px`
            });
        });
        proxy($player, 'click', (event)=>{
            if (!_utils.includeFromEvent(event, $contextmenu)) this.show = false;
        });
        this.art.on('blur', ()=>{
            this.show = false;
        });
    }
}
exports.default = Contextmenu;

},{"../utils":"jmgNb","../utils/component":"bgug2","./playbackRate":"eoKzP","./aspectRatio":"7ejUt","./flip":"dAW0A","./info":"1jWhq","./version":"dapbx","./close":"9E5SI","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"eoKzP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function playbackRate(option) {
    return (art)=>{
        const { i18n  } = art;
        return {
            ...option,
            html: `${i18n.get('Play Speed')}:
                <span data-value="0.5">0.5</span>
                <span data-value="0.75">0.75</span>
                <span data-value="1.0" class="art-current">${i18n.get('Normal')}</span>
                <span data-value="1.25">1.25</span>
                <span data-value="1.5">1.5</span>
                <span data-value="2.0">2.0</span>
            `,
            click: (contextmenu, event)=>{
                const { value  } = event.target.dataset;
                if (value) {
                    art.playbackRate = Number(value);
                    contextmenu.show = false;
                }
            },
            mounted: ($panel)=>{
                art.on('playbackRate', (value)=>{
                    const $current = _utils.queryAll('span', $panel).find((item)=>Number(item.dataset.value) === value
                    );
                    if ($current) _utils.inverseClass($current, 'art-current');
                });
            }
        };
    };
}
exports.default = playbackRate;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"7ejUt":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function aspectRatio(option) {
    return (art)=>{
        const { i18n  } = art;
        return {
            ...option,
            html: `${i18n.get('Aspect Ratio')}:
                <span data-value="default" class="art-current">${i18n.get('Default')}</span>
                <span data-value="4:3">4:3</span>
                <span data-value="16:9">16:9</span>
            `,
            click: (contextmenu, event)=>{
                const { value  } = event.target.dataset;
                if (value) {
                    art.aspectRatio = value;
                    contextmenu.show = false;
                }
            },
            mounted: ($panel)=>{
                art.on('aspectRatio', (value)=>{
                    const $current = _utils.queryAll('span', $panel).find((item)=>item.dataset.value === value
                    );
                    if ($current) _utils.inverseClass($current, 'art-current');
                });
            }
        };
    };
}
exports.default = aspectRatio;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"dAW0A":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function flip(option) {
    return (art)=>{
        const { i18n  } = art;
        return {
            ...option,
            html: `${i18n.get('Video Flip')}:
                <span data-value="normal" class="art-current">${i18n.get('Normal')}</span>
                <span data-value="horizontal">${i18n.get('Horizontal')}</span>
                <span data-value="vertical">${i18n.get('Vertical')}</span>
            `,
            click: (contextmenu, event)=>{
                const { value  } = event.target.dataset;
                if (value) {
                    art.flip = value;
                    contextmenu.show = false;
                }
            },
            mounted: ($panel)=>{
                art.on('flip', (value)=>{
                    const $current = _utils.queryAll('span', $panel).find((item)=>item.dataset.value === value
                    );
                    if ($current) _utils.inverseClass($current, 'art-current');
                });
            }
        };
    };
}
exports.default = flip;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"1jWhq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
function info(option) {
    return (art)=>({
            ...option,
            html: art.i18n.get('Video Info'),
            click: (contextmenu)=>{
                art.info.show = true;
                contextmenu.show = false;
            }
        })
    ;
}
exports.default = info;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"dapbx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
function version(option) {
    return {
        ...option,
        html: `<a href="https://artplayer.org" target="_blank">ArtPlayer ${"4.4.2"}</a>`
    };
}
exports.default = version;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"9E5SI":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
function close(option) {
    return (art)=>({
            ...option,
            html: art.i18n.get('Close'),
            click: (contextmenu)=>{
                contextmenu.show = false;
            }
        })
    ;
}
exports.default = close;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"6vVKE":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
var _component = require("./utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
class Info extends _componentDefault.default {
    constructor(art){
        super(art);
        this.name = 'info';
        if (!_utils.isMobile) this.init();
    }
    init() {
        const { constructor , events: { proxy  } , template: { $infoPanel , $infoClose , $video  } ,  } = this.art;
        proxy($infoClose, 'click', ()=>{
            this.show = false;
        });
        let timer = null;
        const $types = _utils.queryAll('[data-video]', $infoPanel) || [];
        this.art.on('destroy', ()=>{
            clearTimeout(timer);
        });
        function loop() {
            for(let index = 0; index < $types.length; index++){
                const item = $types[index];
                const value = $video[item.dataset.video];
                const innerText = typeof value === 'number' ? value.toFixed(2) : value;
                if (item.innerText !== innerText) item.innerText = innerText;
            }
            timer = setTimeout(loop, constructor.INFO_LOOP_TIME);
        }
        loop();
    }
}
exports.default = Info;

},{"./utils":"jmgNb","./utils/component":"bgug2","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"4exyO":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
var _component = require("./utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
var _optionValidator = require("option-validator");
var _optionValidatorDefault = parcelHelpers.interopDefault(_optionValidator);
var _scheme = require("./scheme");
var _schemeDefault = parcelHelpers.interopDefault(_scheme);
class Subtitle extends _componentDefault.default {
    constructor(art){
        super(art);
        this.name = 'subtitle';
        this.init(art.option.subtitle);
    }
    get url() {
        return this.art.template.$track.src;
    }
    set url(url) {
        this.switch(url);
    }
    get textTrack() {
        return this.art.template.$video.textTracks[0];
    }
    get activeCue() {
        return this.textTrack.activeCues[0];
    }
    style(key, value) {
        const { $subtitle  } = this.art.template;
        if (typeof key === 'object') return _utils.setStyles($subtitle, key);
        return _utils.setStyle($subtitle, key, value);
    }
    update() {
        const { $subtitle  } = this.art.template;
        $subtitle.innerHTML = '';
        if (this.activeCue) {
            $subtitle.innerHTML = this.activeCue.text.split(/\r?\n/).map((item)=>`<p>${_utils.escape(item)}</p>`
            ).join('');
            this.art.emit('subtitleUpdate', this.activeCue.text);
        }
    }
    async switch(url, newOption = {}) {
        const { i18n , notice , option  } = this.art;
        const subtitleOption = {
            ...option.subtitle,
            ...newOption,
            url
        };
        const subUrl = await this.init(subtitleOption);
        if (newOption.name) notice.show = `${i18n.get('Switch Subtitle')}: ${newOption.name}`;
        return subUrl;
    }
    init(subtitleOption) {
        _optionValidatorDefault.default(subtitleOption, _schemeDefault.default.subtitle);
        if (!subtitleOption.url) return;
        const { notice , events: { proxy  } , template: { $subtitle , $video , $track  } ,  } = this.art;
        if (!$track) {
            const $track = document.createElement('track');
            $track.default = true;
            $track.kind = 'metadata';
            $video.appendChild($track);
            this.art.template.$track = $track;
            proxy(this.textTrack, 'cuechange', this.update.bind(this));
        }
        this.style(subtitleOption.style);
        _utils.errorHandle(window.fetch, 'fetch not support');
        return fetch(subtitleOption.url).then((response)=>response.arrayBuffer()
        ).then((buffer)=>{
            _utils.errorHandle(window.TextDecoder, 'TextDecoder not support');
            const decoder = new TextDecoder(subtitleOption.encoding);
            const text = decoder.decode(buffer);
            this.art.emit('subtitleLoad', subtitleOption.url);
            switch(subtitleOption.type || _utils.getExt(subtitleOption.url)){
                case 'srt':
                    return _utils.vttToBlob(_utils.srtToVtt(text));
                case 'ass':
                    return _utils.vttToBlob(_utils.assToVtt(text));
                case 'vtt':
                    return _utils.vttToBlob(text);
                default:
                    return subtitleOption.url;
            }
        }).then((subUrl)=>{
            $subtitle.innerHTML = '';
            if (this.url === subUrl) return subUrl;
            URL.revokeObjectURL(this.url);
            this.art.template.$track.src = subUrl;
            this.art.emit('subtitleSwitch', subUrl);
            return subUrl;
        }).catch((err)=>{
            notice.show = err;
            throw err;
        });
    }
}
exports.default = Subtitle;

},{"./utils":"jmgNb","./utils/component":"bgug2","option-validator":"i7tUx","./scheme":"gL38d","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"dz5ul":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _error = require("../utils/error");
var _clickInit = require("./clickInit");
var _clickInitDefault = parcelHelpers.interopDefault(_clickInit);
var _hoverInit = require("./hoverInit");
var _hoverInitDefault = parcelHelpers.interopDefault(_hoverInit);
var _mousemoveInit = require("./mousemoveInit");
var _mousemoveInitDefault = parcelHelpers.interopDefault(_mousemoveInit);
var _resizeInit = require("./resizeInit");
var _resizeInitDefault = parcelHelpers.interopDefault(_resizeInit);
var _gestureInit = require("./gestureInit");
var _gestureInitDefault = parcelHelpers.interopDefault(_gestureInit);
var _viewInit = require("./viewInit");
var _viewInitDefault = parcelHelpers.interopDefault(_viewInit);
class Events {
    constructor(art){
        this.destroyEvents = [];
        this.proxy = this.proxy.bind(this);
        this.hover = this.hover.bind(this);
        this.loadImg = this.loadImg.bind(this);
        if (art.whitelist.state) {
            _clickInitDefault.default(art, this);
            _hoverInitDefault.default(art, this);
            _mousemoveInitDefault.default(art, this);
            _resizeInitDefault.default(art, this);
            _gestureInitDefault.default(art, this);
            _viewInitDefault.default(art, this);
        }
    }
    proxy(target, name, callback, option = {}) {
        if (Array.isArray(name)) return name.map((item)=>this.proxy(target, item, callback, option)
        );
        target.addEventListener(name, callback, option);
        const destroy = ()=>target.removeEventListener(name, callback, option)
        ;
        this.destroyEvents.push(destroy);
        return destroy;
    }
    hover(target, mouseenter, mouseleave) {
        if (mouseenter) this.proxy(target, 'mouseenter', mouseenter);
        if (mouseleave) this.proxy(target, 'mouseleave', mouseleave);
    }
    loadImg(img) {
        return new Promise((resolve, reject)=>{
            let image;
            if (img instanceof HTMLImageElement) image = img;
            else if (typeof img === 'string') {
                image = new Image();
                image.src = img;
            } else return reject(new _error.ArtPlayerError('Unable to get Image'));
            if (image.complete) return resolve(image);
            this.proxy(image, 'load', ()=>resolve(image)
            );
            this.proxy(image, 'error', ()=>reject(new _error.ArtPlayerError(`Failed to load Image: ${image.src}`))
            );
        });
    }
    destroy() {
        for(let index = 0; index < this.destroyEvents.length; index++)this.destroyEvents[index]();
    }
}
exports.default = Events;

},{"../utils/error":"622b3","./clickInit":"3fsfH","./hoverInit":"jr1ic","./mousemoveInit":"bH4JU","./resizeInit":"2r19L","./gestureInit":"2IPOb","./viewInit":"fmrIX","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"3fsfH":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function clickInit(art, events) {
    const { constructor , template: { $player , $video  } ,  } = art;
    events.proxy(document, [
        'click',
        'contextmenu'
    ], (event)=>{
        if (_utils.includeFromEvent(event, $player)) {
            art.isInput = event.target.tagName === 'INPUT';
            art.isFocus = true;
            art.emit('focus');
        } else {
            art.isInput = false;
            art.isFocus = false;
            art.emit('blur');
        }
    });
    let clickTime = 0;
    events.proxy($video, 'click', ()=>{
        const now = Date.now();
        if (now - clickTime <= constructor.DB_CLICE_TIME) {
            art.emit('dblclick');
            if (_utils.isMobile) {
                if (!art.isLock) art.toggle();
            } else art.fullscreen = !art.fullscreen;
        } else {
            art.emit('click');
            if (!_utils.isMobile) art.toggle();
        }
        clickTime = now;
    });
}
exports.default = clickInit;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"jr1ic":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function hoverInit(art, events) {
    const { $player  } = art.template;
    events.hover($player, ()=>{
        _utils.addClass($player, 'art-hover');
        art.emit('hover', true);
    }, ()=>{
        _utils.removeClass($player, 'art-hover');
        art.emit('hover');
    });
}
exports.default = hoverInit;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"bH4JU":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
function mousemoveInitInit(art, events) {
    const { $player  } = art.template;
    events.proxy($player, 'mousemove', (event)=>{
        art.emit('mousemove', event);
    });
}
exports.default = mousemoveInitInit;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"2r19L":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function resizeInit(art, events) {
    const { option  } = art;
    const resizeFn = _utils.throttle(()=>{
        if (art.normalSize) art.autoSize = option.autoSize;
        art.aspectRatioReset = true;
        art.notice.show = '';
        art.emit('resize');
    }, art.constructor.RESIZE_TIME);
    events.proxy(window, [
        'orientationchange',
        'resize'
    ], ()=>{
        resizeFn();
    });
    if (screen && screen.orientation && screen.orientation.onchange) events.proxy(screen.orientation, 'change', ()=>{
        resizeFn();
    });
}
exports.default = resizeInit;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"2IPOb":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function gestureInit(art, events) {
    if (_utils.isMobile && !art.option.isLive) {
        const { $video , $bottom , $controls  } = art.template;
        let isDroging = false;
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        const onTouchStart = (event)=>{
            if (event.touches.length === 1 && !art.isLock) {
                isDroging = true;
                const { clientX , clientY  } = event.touches[0];
                startX = clientX;
                startY = clientY;
                startTime = art.currentTime;
            }
        };
        const onTouchMove = (event)=>{
            if (event.touches.length === 1 && isDroging && art.duration) {
                const autoOrientation = art.plugins.autoOrientation && art.plugins.autoOrientation.state;
                const { clientX , clientY  } = event.touches[0];
                const ratioX = _utils.clamp((clientX - startX) / art.width, -1, 1);
                const ratioY = _utils.clamp((clientY - startY) / art.height, -1, 1);
                const ratio = autoOrientation ? ratioY : ratioX;
                const currentTime = _utils.clamp(startTime + art.duration * ratio / 2, 0, art.duration);
                art.seek = currentTime;
                art.emit('setBar', 'played', _utils.clamp(currentTime / art.duration, 0, 1));
                art.notice.show = `${_utils.secondToTime(currentTime)} / ${_utils.secondToTime(art.duration)}`;
            }
        };
        const onTouchEnd = ()=>{
            if (isDroging) {
                startX = 0;
                startY = 0;
                startTime = 0;
                isDroging = false;
            }
        };
        events.proxy($bottom, 'touchstart', (event)=>{
            if (!_utils.includeFromEvent(event, $controls)) onTouchStart(event);
        });
        events.proxy($bottom, 'touchmove', onTouchMove);
        events.proxy($video, 'touchstart', onTouchStart);
        events.proxy($video, 'touchmove', onTouchMove);
        events.proxy(document, 'touchend', onTouchEnd);
    }
}
exports.default = gestureInit;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"fmrIX":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function viewInit(art, events) {
    const { option , constructor , template: { $container  } ,  } = art;
    const scrollFn = _utils.throttle(()=>{
        art.emit('view', _utils.isInViewport($container, constructor.SCROLL_GAP));
    }, constructor.SCROLL_TIME);
    events.proxy(window, 'scroll', ()=>{
        scrollFn();
    });
    art.on('view', (state)=>{
        if (option.autoMini) art.mini = !state;
    });
}
exports.default = viewInit;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"1nFqF":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
class Hotkey {
    constructor(art){
        this.art = art;
        this.keys = {};
        if (art.option.hotkey && !_utils.isMobile) this.init();
    }
    init() {
        const { proxy  } = this.art.events;
        this.add(27, ()=>{
            if (this.art.fullscreenWeb) this.art.fullscreenWeb = false;
        });
        this.add(32, ()=>{
            this.art.toggle();
        });
        this.add(37, ()=>{
            this.art.backward = 5;
        });
        this.add(38, ()=>{
            this.art.volume += 0.1;
        });
        this.add(39, ()=>{
            this.art.forward = 5;
        });
        this.add(40, ()=>{
            this.art.volume -= 0.1;
        });
        proxy(window, 'keydown', (event)=>{
            if (this.art.isFocus) {
                const tag = document.activeElement.tagName.toUpperCase();
                const editable = document.activeElement.getAttribute('contenteditable');
                if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
                    const events = this.keys[event.keyCode];
                    if (events) {
                        event.preventDefault();
                        for(let index = 0; index < events.length; index++)events[index].call(this.art, event);
                        this.art.emit('hotkey', event);
                    }
                }
            }
        });
    }
    add(key, event) {
        if (this.keys[key]) this.keys[key].push(event);
        else this.keys[key] = [
            event
        ];
        return this;
    }
    remove(key, event) {
        if (this.keys[key]) {
            const index = this.keys[key].indexOf(event);
            if (index !== -1) this.keys[key].splice(index, 1);
        }
        return this;
    }
}
exports.default = Hotkey;

},{"./utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"fvy8V":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _component = require("./utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
class Layer extends _componentDefault.default {
    constructor(art){
        super(art);
        const { option , template: { $layer  } ,  } = art;
        this.name = 'layer';
        this.$parent = $layer;
        for(let index = 0; index < option.layers.length; index++)this.add(option.layers[index]);
    }
}
exports.default = Layer;

},{"./utils/component":"bgug2","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"h8KPY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
var _component = require("./utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
class Loading extends _componentDefault.default {
    constructor(art){
        super(art);
        this.name = 'loading';
        _utils.append(art.template.$loading, art.icons.loading);
    }
}
exports.default = Loading;

},{"./utils":"jmgNb","./utils/component":"bgug2","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"cr1XY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
class Notice {
    constructor(art){
        this.art = art;
        this.timer = null;
    }
    set show(msg) {
        const { constructor , template: { $player , $noticeInner  } ,  } = this.art;
        if (msg) {
            $noticeInner.innerText = msg instanceof Error ? msg.message.trim() : msg;
            _utils.addClass($player, 'art-notice-show');
            clearTimeout(this.timer);
            this.timer = setTimeout(()=>{
                $noticeInner.innerText = '';
                _utils.removeClass($player, 'art-notice-show');
            }, constructor.NOTICE_TIME);
        } else _utils.removeClass($player, 'art-notice-show');
    }
}
exports.default = Notice;

},{"./utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"llnR4":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("./utils");
var _component = require("./utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
class Mask extends _componentDefault.default {
    constructor(art){
        super(art);
        this.name = 'mask';
        const { template , icons , events  } = art;
        const $state = _utils.append(template.$state, icons.state);
        const $error = _utils.append(template.$state, icons.error);
        _utils.setStyle($error, 'display', 'none');
        art.on('destroy', ()=>{
            _utils.setStyle($state, 'display', 'none');
            _utils.setStyle($error, 'display', null);
        });
        events.proxy(template.$state, 'click', ()=>art.play()
        );
    }
}
exports.default = Mask;

},{"./utils":"jmgNb","./utils/component":"bgug2","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"gP6M7":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
var _loadingSvg = require("bundle-text:./loading.svg");
var _loadingSvgDefault = parcelHelpers.interopDefault(_loadingSvg);
var _stateSvg = require("bundle-text:./state.svg");
var _stateSvgDefault = parcelHelpers.interopDefault(_stateSvg);
var _checkSvg = require("bundle-text:./check.svg");
var _checkSvgDefault = parcelHelpers.interopDefault(_checkSvg);
var _playSvg = require("bundle-text:./play.svg");
var _playSvgDefault = parcelHelpers.interopDefault(_playSvg);
var _pauseSvg = require("bundle-text:./pause.svg");
var _pauseSvgDefault = parcelHelpers.interopDefault(_pauseSvg);
var _volumeSvg = require("bundle-text:./volume.svg");
var _volumeSvgDefault = parcelHelpers.interopDefault(_volumeSvg);
var _volumeCloseSvg = require("bundle-text:./volume-close.svg");
var _volumeCloseSvgDefault = parcelHelpers.interopDefault(_volumeCloseSvg);
var _screenshotSvg = require("bundle-text:./screenshot.svg");
var _screenshotSvgDefault = parcelHelpers.interopDefault(_screenshotSvg);
var _settingSvg = require("bundle-text:./setting.svg");
var _settingSvgDefault = parcelHelpers.interopDefault(_settingSvg);
var _arrowLeftSvg = require("bundle-text:./arrow-left.svg");
var _arrowLeftSvgDefault = parcelHelpers.interopDefault(_arrowLeftSvg);
var _arrowRightSvg = require("bundle-text:./arrow-right.svg");
var _arrowRightSvgDefault = parcelHelpers.interopDefault(_arrowRightSvg);
var _playbackRateSvg = require("bundle-text:./playback-rate.svg");
var _playbackRateSvgDefault = parcelHelpers.interopDefault(_playbackRateSvg);
var _aspectRatioSvg = require("bundle-text:./aspect-ratio.svg");
var _aspectRatioSvgDefault = parcelHelpers.interopDefault(_aspectRatioSvg);
var _configSvg = require("bundle-text:./config.svg");
var _configSvgDefault = parcelHelpers.interopDefault(_configSvg);
var _pipSvg = require("bundle-text:./pip.svg");
var _pipSvgDefault = parcelHelpers.interopDefault(_pipSvg);
var _lockSvg = require("bundle-text:./lock.svg");
var _lockSvgDefault = parcelHelpers.interopDefault(_lockSvg);
var _unlockSvg = require("bundle-text:./unlock.svg");
var _unlockSvgDefault = parcelHelpers.interopDefault(_unlockSvg);
var _fullscreenOffSvg = require("bundle-text:./fullscreen-off.svg");
var _fullscreenOffSvgDefault = parcelHelpers.interopDefault(_fullscreenOffSvg);
var _fullscreenOnSvg = require("bundle-text:./fullscreen-on.svg");
var _fullscreenOnSvgDefault = parcelHelpers.interopDefault(_fullscreenOnSvg);
var _fullscreenWebOffSvg = require("bundle-text:./fullscreen-web-off.svg");
var _fullscreenWebOffSvgDefault = parcelHelpers.interopDefault(_fullscreenWebOffSvg);
var _fullscreenWebOnSvg = require("bundle-text:./fullscreen-web-on.svg");
var _fullscreenWebOnSvgDefault = parcelHelpers.interopDefault(_fullscreenWebOnSvg);
var _switchOnSvg = require("bundle-text:./switch-on.svg");
var _switchOnSvgDefault = parcelHelpers.interopDefault(_switchOnSvg);
var _switchOffSvg = require("bundle-text:./switch-off.svg");
var _switchOffSvgDefault = parcelHelpers.interopDefault(_switchOffSvg);
var _flipSvg = require("bundle-text:./flip.svg");
var _flipSvgDefault = parcelHelpers.interopDefault(_flipSvg);
var _errorSvg = require("bundle-text:./error.svg");
var _errorSvgDefault = parcelHelpers.interopDefault(_errorSvg);
class Icons {
    constructor(art){
        const icons = {
            loading: _loadingSvgDefault.default,
            state: _stateSvgDefault.default,
            play: _playSvgDefault.default,
            pause: _pauseSvgDefault.default,
            check: _checkSvgDefault.default,
            volume: _volumeSvgDefault.default,
            volumeClose: _volumeCloseSvgDefault.default,
            screenshot: _screenshotSvgDefault.default,
            setting: _settingSvgDefault.default,
            pip: _pipSvgDefault.default,
            arrowLeft: _arrowLeftSvgDefault.default,
            arrowRight: _arrowRightSvgDefault.default,
            playbackRate: _playbackRateSvgDefault.default,
            aspectRatio: _aspectRatioSvgDefault.default,
            config: _configSvgDefault.default,
            lock: _lockSvgDefault.default,
            flip: _flipSvgDefault.default,
            unlock: _unlockSvgDefault.default,
            fullscreenOff: _fullscreenOffSvgDefault.default,
            fullscreenOn: _fullscreenOnSvgDefault.default,
            fullscreenWebOff: _fullscreenWebOffSvgDefault.default,
            fullscreenWebOn: _fullscreenWebOnSvgDefault.default,
            switchOn: _switchOnSvgDefault.default,
            switchOff: _switchOffSvgDefault.default,
            error: _errorSvgDefault.default,
            ...art.option.icons
        };
        Object.keys(icons).forEach((key)=>{
            _utils.def(this, key, {
                get: ()=>{
                    const icon = document.createElement('i');
                    _utils.addClass(icon, 'art-icon');
                    _utils.addClass(icon, `art-icon-${key}`);
                    _utils.append(icon, icons[key]);
                    return icon;
                }
            });
        });
    }
}
exports.default = Icons;

},{"../utils":"jmgNb","bundle-text:./loading.svg":"kQAWs","bundle-text:./state.svg":"fv62Y","bundle-text:./check.svg":"hpwmG","bundle-text:./play.svg":"ez3XI","bundle-text:./pause.svg":"cXb2s","bundle-text:./volume.svg":"9ziFm","bundle-text:./volume-close.svg":"gHdy5","bundle-text:./screenshot.svg":"7uQ3x","bundle-text:./setting.svg":"23jGe","bundle-text:./arrow-left.svg":"2m0J3","bundle-text:./arrow-right.svg":"d9iPY","bundle-text:./playback-rate.svg":"iFVXO","bundle-text:./aspect-ratio.svg":"4qJAN","bundle-text:./config.svg":"6iK2N","bundle-text:./pip.svg":"f0XBL","bundle-text:./lock.svg":"kCaVg","bundle-text:./unlock.svg":"lWIPo","bundle-text:./fullscreen-off.svg":"a6qSz","bundle-text:./fullscreen-on.svg":"2cUeR","bundle-text:./fullscreen-web-off.svg":"9P4Tw","bundle-text:./fullscreen-web-on.svg":"lv7bb","bundle-text:./switch-on.svg":"iaKl1","bundle-text:./switch-off.svg":"47VYR","bundle-text:./flip.svg":"kQBsA","bundle-text:./error.svg":"gHC6Z","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"kQAWs":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50px\" height=\"50px\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" class=\"uil-default\">\n  <rect x=\"0\" y=\"0\" width=\"100\" height=\"100\" fill=\"none\" class=\"bk\"></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(0 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-1s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(30 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.9166666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(60 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.8333333333333334s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(90 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.75s\" repeatCount=\"indefinite\"></animate></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(120 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.6666666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(150 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.5833333333333334s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(180 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.5s\" repeatCount=\"indefinite\"></animate></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(210 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.4166666666666667s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(240 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.3333333333333333s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(270 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.25s\" repeatCount=\"indefinite\"></animate></rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(300 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.16666666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n  <rect x=\"47\" y=\"40\" width=\"6\" height=\"20\" rx=\"5\" ry=\"5\" fill=\"#ffffff\" transform=\"rotate(330 50 50) translate(0 -30)\">\n    <animate attributeName=\"opacity\" from=\"1\" to=\"0\" dur=\"1s\" begin=\"-0.08333333333333333s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</svg>";

},{}],"fv62Y":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"60\" width=\"60\" style=\"filter: drop-shadow(0 1px 1px #000)\" viewBox=\"0 0 24 24\">\n    <path d=\"M20,2H4C1.8,2,0,3.8,0,6v12c0,2.2,1.8,4,4,4h16c2.2,0,4-1.8,4-4V6C24,3.8,22.2,2,20,2z M15.6,12.8L10.5,16 C9.9,16.5,9,16,9,15.2V8.8C9,8,9.9,7.5,10.5,8l5.1,3.2C16.3,11.5,16.3,12.5,15.6,12.8z\"></path>\n</svg>";

},{}],"hpwmG":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 24 24\" style=\"width: 100%; height: 100%\">\n<path d=\"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z\" fill=\"#fff\"></path>\n</svg>";

},{}],"ez3XI":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n  <path d=\"M17.982 9.275L8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45z\"></path>\n</svg>";

},{}],"cXb2s":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zM15 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2z\"></path>\n</svg>";

},{}],"9ziFm":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M10.188 4.65L6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z\"></path>\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z\"></path>\n</svg>";

},{}],"gHdy5":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <path d=\"M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z\"></path>\n    <path d=\"M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z\"></path>\n</svg>";

},{}],"7uQ3x":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 50 50\">\n\t<path d=\"M 19.402344 6 C 17.019531 6 14.96875 7.679688 14.5 10.011719 L 14.097656 12 L 9 12 C 6.238281 12 4 14.238281 4 17 L 4 38 C 4 40.761719 6.238281 43 9 43 L 41 43 C 43.761719 43 46 40.761719 46 38 L 46 17 C 46 14.238281 43.761719 12 41 12 L 35.902344 12 L 35.5 10.011719 C 35.03125 7.679688 32.980469 6 30.597656 6 Z M 25 17 C 30.519531 17 35 21.480469 35 27 C 35 32.519531 30.519531 37 25 37 C 19.480469 37 15 32.519531 15 27 C 15 21.480469 19.480469 17 25 17 Z M 25 19 C 20.589844 19 17 22.589844 17 27 C 17 31.410156 20.589844 35 25 35 C 29.410156 35 33 31.410156 33 27 C 33 22.589844 29.410156 19 25 19 Z \"></path>\n</svg>\n";

},{}],"23jGe":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"22\" width=\"22\" viewBox=\"0 0 22 22\">\n    <circle cx=\"11\" cy=\"11\" r=\"2\"></circle>\n    <path d=\"M19.164 8.861L17.6 8.6a6.978 6.978 0 0 0-1.186-2.099l.574-1.533a1 1 0 0 0-.436-1.217l-1.997-1.153a1.001 1.001 0 0 0-1.272.23l-1.008 1.225a7.04 7.04 0 0 0-2.55.001L8.716 2.829a1 1 0 0 0-1.272-.23L5.447 3.751a1 1 0 0 0-.436 1.217l.574 1.533A6.997 6.997 0 0 0 4.4 8.6l-1.564.261A.999.999 0 0 0 2 9.847v2.306c0 .489.353.906.836.986l1.613.269a7 7 0 0 0 1.228 2.075l-.558 1.487a1 1 0 0 0 .436 1.217l1.997 1.153c.423.244.961.147 1.272-.23l1.04-1.263a7.089 7.089 0 0 0 2.272 0l1.04 1.263a1 1 0 0 0 1.272.23l1.997-1.153a1 1 0 0 0 .436-1.217l-.557-1.487c.521-.61.94-1.31 1.228-2.075l1.613-.269a.999.999 0 0 0 .835-.986V9.847a.999.999 0 0 0-.836-.986zM11 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z\"></path>\n</svg>";

},{}],"2m0J3":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"100%\" version=\"1.1\" viewBox=\"0 0 32 32\" width=\"100%\">\n    <path d=\"M 19.41,20.09 14.83,15.5 19.41,10.91 18,9.5 l -6,6 6,6 z\" fill=\"#fff\"></path>\n</svg>";

},{}],"d9iPY":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"100%\" version=\"1.1\" viewBox=\"0 0 32 32\" width=\"100%\">\n    <path d=\"m 12.59,20.34 4.58,-4.59 -4.58,-4.59 1.41,-1.41 6,6 -6,6 z\" fill=\"#fff\"></path>\n</svg>";

},{}],"iFVXO":[function(require,module,exports) {
module.exports = "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z            M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z            M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z            M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z            M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1 C18.2,21.5,22,17.2,22,12z\" fill=\"white\" data-darkreader-inline-fill=\"\" style=\"--darkreader-inline-fill: #a8a6a4\"></path></svg>";

},{}],"4qJAN":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 88 88\" preserveAspectRatio=\"xMidYMid meet\" style=\"width: 100%; height: 100%; transform: translate3d(0, 0, 0)\"><defs><clipPath id=\"__lottie_element_216\"><rect width=\"88\" height=\"88\" x=\"0\" y=\"0\"></rect></clipPath></defs><g clip-path=\"url('#__lottie_element_216')\"><g transform=\"matrix(1,0,0,1,44,44)\" opacity=\"1\" style=\"display: block\"><g opacity=\"1\" transform=\"matrix(1,0,0,1,0,0)\"><path fill=\"rgb(255,255,255)\" fill-opacity=\"1\" d=\" M12.437999725341797,-12.70199966430664 C12.437999725341797,-12.70199966430664 9.618000030517578,-9.881999969482422 9.618000030517578,-9.881999969482422 C8.82800006866455,-9.092000007629395 8.82800006866455,-7.831999778747559 9.618000030517578,-7.052000045776367 C9.618000030517578,-7.052000045776367 16.687999725341797,0.017999999225139618 16.687999725341797,0.017999999225139618 C16.687999725341797,0.017999999225139618 9.618000030517578,7.0879998207092285 9.618000030517578,7.0879998207092285 C8.82800006866455,7.877999782562256 8.82800006866455,9.137999534606934 9.618000030517578,9.918000221252441 C9.618000030517578,9.918000221252441 12.437999725341797,12.748000144958496 12.437999725341797,12.748000144958496 C13.227999687194824,13.527999877929688 14.48799991607666,13.527999877929688 15.267999649047852,12.748000144958496 C15.267999649047852,12.748000144958496 26.58799934387207,1.437999963760376 26.58799934387207,1.437999963760376 C27.368000030517578,0.6579999923706055 27.368000030517578,-0.6119999885559082 26.58799934387207,-1.3919999599456787 C26.58799934387207,-1.3919999599456787 15.267999649047852,-12.70199966430664 15.267999649047852,-12.70199966430664 C14.48799991607666,-13.491999626159668 13.227999687194824,-13.491999626159668 12.437999725341797,-12.70199966430664z M-12.442000389099121,-12.70199966430664 C-13.182000160217285,-13.442000389099121 -14.362000465393066,-13.482000350952148 -15.142000198364258,-12.821999549865723 C-15.142000198364258,-12.821999549865723 -15.272000312805176,-12.70199966430664 -15.272000312805176,-12.70199966430664 C-15.272000312805176,-12.70199966430664 -26.582000732421875,-1.3919999599456787 -26.582000732421875,-1.3919999599456787 C-27.32200050354004,-0.6520000100135803 -27.36199951171875,0.5180000066757202 -26.70199966430664,1.3079999685287476 C-26.70199966430664,1.3079999685287476 -26.582000732421875,1.437999963760376 -26.582000732421875,1.437999963760376 C-26.582000732421875,1.437999963760376 -15.272000312805176,12.748000144958496 -15.272000312805176,12.748000144958496 C-14.531999588012695,13.48799991607666 -13.362000465393066,13.527999877929688 -12.571999549865723,12.868000030517578 C-12.571999549865723,12.868000030517578 -12.442000389099121,12.748000144958496 -12.442000389099121,12.748000144958496 C-12.442000389099121,12.748000144958496 -9.612000465393066,9.918000221252441 -9.612000465393066,9.918000221252441 C-8.871999740600586,9.178000450134277 -8.831999778747559,8.008000373840332 -9.501999855041504,7.2179999351501465 C-9.501999855041504,7.2179999351501465 -9.612000465393066,7.0879998207092285 -9.612000465393066,7.0879998207092285 C-9.612000465393066,7.0879998207092285 -16.68199920654297,0.017999999225139618 -16.68199920654297,0.017999999225139618 C-16.68199920654297,0.017999999225139618 -9.612000465393066,-7.052000045776367 -9.612000465393066,-7.052000045776367 C-8.871999740600586,-7.791999816894531 -8.831999778747559,-8.961999893188477 -9.501999855041504,-9.751999855041504 C-9.501999855041504,-9.751999855041504 -9.612000465393066,-9.881999969482422 -9.612000465393066,-9.881999969482422 C-9.612000465393066,-9.881999969482422 -12.442000389099121,-12.70199966430664 -12.442000389099121,-12.70199966430664z M28,-28 C32.41999816894531,-28 36,-24.420000076293945 36,-20 C36,-20 36,20 36,20 C36,24.420000076293945 32.41999816894531,28 28,28 C28,28 -28,28 -28,28 C-32.41999816894531,28 -36,24.420000076293945 -36,20 C-36,20 -36,-20 -36,-20 C-36,-24.420000076293945 -32.41999816894531,-28 -28,-28 C-28,-28 28,-28 28,-28z\" data-darkreader-inline-fill=\"\" style=\"--darkreader-inline-fill: #a8a6a4\"></path></g></g></g></svg>";

},{}],"6iK2N":[function(require,module,exports) {
module.exports = "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M15,17h6v1h-6V17z M11,17H3v1h8v2h1v-2v-1v-2h-1V17z M14,8h1V6V5V3h-1v2H3v1h11V8z            M18,5v1h3V5H18z M6,14h1v-2v-1V9H6v2H3v1 h3V14z M10,12h11v-1H10V12z\" fill=\"white\" data-darkreader-inline-fill=\"\" style=\"--darkreader-inline-fill: #a8a6a4\"></path></svg>";

},{}],"f0XBL":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\" height=\"32\" width=\"32\">\n    <path d=\"M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z\"></path>\n</svg>";

},{}],"kCaVg":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg t=\"1650612139149\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"12683\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"20\" height=\"20\"><defs>\n<style type=\"text/css\"></style></defs><path d=\"M298.666667 426.666667V341.333333a213.333333 213.333333 0 1 1 426.666666 0v85.333334h42.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667z m213.333333-213.333334a128 128 0 0 0-128 128v85.333334h256V341.333333a128 128 0 0 0-128-128z\" fill=\"#ffffff\" p-id=\"12684\"></path>\n</svg>";

},{}],"lWIPo":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg t=\"1650612464266\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"14150\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"20\" height=\"20\"><defs>\n<style type=\"text/css\"></style></defs><path d=\"M666.752 194.517333L617.386667 268.629333A128 128 0 0 0 384 341.333333l0.042667 85.333334h384a85.333333 85.333333 0 0 1 85.333333 85.333333v256a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 1-85.333333-85.333333v-256a85.333333 85.333333 0 0 1 85.333333-85.333333h42.666667V341.333333a213.333333 213.333333 0 0 1 368.085333-146.816z\" fill=\"#ffffff\" p-id=\"14151\"></path></svg>";

},{}],"a6qSz":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg class=\"icon\" width=\"22\" height=\"22\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill=\"#ffffff\" d=\"M768 298.666667h170.666667v85.333333h-256V128h85.333333v170.666667zM341.333333 384H85.333333V298.666667h170.666667V128h85.333333v256z m426.666667 341.333333v170.666667h-85.333333v-256h256v85.333333h-170.666667zM341.333333 640v256H256v-170.666667H85.333333v-85.333333h256z\"></path>\n</svg>";

},{}],"2cUeR":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg class=\"icon\" width=\"22\" height=\"22\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill=\"#ffffff\" d=\"M625.777778 256h142.222222V398.222222h113.777778V142.222222H625.777778v113.777778zM256 398.222222V256H398.222222v-113.777778H142.222222V398.222222h113.777778zM768 625.777778v142.222222H625.777778v113.777778h256V625.777778h-113.777778zM398.222222 768H256V625.777778h-113.777778v256H398.222222v-113.777778z\"></path>\n</svg>";

},{}],"9P4Tw":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg class=\"icon\" width=\"18\" height=\"18\" viewBox=\"0 0 1152 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill=\"#ffffff\" d=\"M1075.2 0H76.8A76.8 76.8 0 0 0 0 76.8v870.4A76.8 76.8 0 0 0 76.8 1024h998.4a76.8 76.8 0 0 0 76.8-76.8V76.8A76.8 76.8 0 0 0 1075.2 0zM1024 128v768H128V128h896zM896 512a64 64 0 0 1 7.488 127.552L896 640h-128v128a64 64 0 0 1-56.512 63.552L704 832a64 64 0 0 1-63.552-56.512L640 768V582.592c0-34.496 25.024-66.112 61.632-70.208L709.632 512H896zM256 512a64 64 0 0 1-7.488-127.552L256 384h128V256a64 64 0 0 1 56.512-63.552L448 192a64 64 0 0 1 63.552 56.512L512 256v185.408c0 34.432-25.024 66.112-61.632 70.144L442.368 512H256z\"></path>\n</svg>";

},{}],"lv7bb":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg class=\"icon\" width=\"18\" height=\"18\" viewBox=\"0 0 1152 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill=\"#ffffff\" d=\"M1075.2 0H76.8A76.8 76.8 0 0 0 0 76.8v870.4A76.8 76.8 0 0 0 76.8 1024h998.4a76.8 76.8 0 0 0 76.8-76.8V76.8A76.8 76.8 0 0 0 1075.2 0zM1024 128v768H128V128h896zM448 192a64 64 0 0 1 7.488 127.552L448 320H320v128a64 64 0 0 1-56.512 63.552L256 512a64 64 0 0 1-63.552-56.512L192 448V262.592c0-34.432 25.024-66.112 61.632-70.144L261.632 192H448zM704 832a64 64 0 0 1-7.488-127.552L704 704h128V576a64 64 0 0 1 56.512-63.552L896 512a64 64 0 0 1 63.552 56.512L960 576v185.408c0 34.496-25.024 66.112-61.632 70.208l-8 0.384H704z\"></path>\n</svg>";

},{}],"iaKl1":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg class=\"icon\" width=\"26\" height=\"26\" viewBox=\"0 0 1664 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n    <path fill=\"#648FFC\" d=\"M1152 0H512a512 512 0 0 0 0 1024h640a512 512 0 0 0 0-1024z m0 960a448 448 0 1 1 448-448 448 448 0 0 1-448 448z\"></path>\n</svg>";

},{}],"47VYR":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg class=\"icon\" width=\"26\" height=\"26\" viewBox=\"0 0 1740 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n    <path fill=\"#ffffff\" d=\"M511.8976 1024h670.5152c282.4192-0.4096 511.1808-229.4784 511.1808-511.8976 0-282.4192-228.7616-511.488-511.1808-511.8976H511.8976C229.4784 0.6144 0.7168 229.6832 0.7168 512.1024c0 282.4192 228.7616 511.488 511.1808 511.8976zM511.3344 48.64A464.5888 464.5888 0 1 1 48.0256 513.024 463.872 463.872 0 0 1 511.3344 48.4352V48.64z\"></path>\n</svg>";

},{}],"kQBsA":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg t=\"1652445277062\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"6034\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"24\" height=\"24\">\n<path d=\"M554.666667 810.666667v85.333333h-85.333334v-85.333333h85.333334zM170.666667 178.005333a42.666667 42.666667 0 0 1 34.986666 18.218667l203.904 291.328a42.666667 42.666667 0 0 1 0 48.896l-203.946666 291.328A42.666667 42.666667 0 0 1 128 803.328V220.672a42.666667 42.666667 0 0 1 42.666667-42.666667z m682.666666 0a42.666667 42.666667 0 0 1 42.368 37.717334l0.298667 4.949333v582.656a42.666667 42.666667 0 0 1-74.24 28.629333l-3.413333-4.181333-203.904-291.328a42.666667 42.666667 0 0 1-3.029334-43.861333l3.029334-5.034667 203.946666-291.328A42.666667 42.666667 0 0 1 853.333333 178.005333zM554.666667 640v85.333333h-85.333334v-85.333333h85.333334zM196.266667 319.104V716.8L335.957333 512 196.309333 319.104zM554.666667 469.333333v85.333334h-85.333334v-85.333334h85.333334z m0-170.666666v85.333333h-85.333334V298.666667h85.333334z m0-170.666667v85.333333h-85.333334V128h85.333334z\" fill=\"#ffffff\" p-id=\"6035\">\n</path>\n</svg>";

},{}],"gHC6Z":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg t=\"1652850026663\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2749\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"50\" height=\"50\">\n<path d=\"M593.8176 168.5504l356.00384 595.21024c26.15296 43.74528 10.73152 99.7376-34.44736 125.05088-14.39744 8.06912-30.72 12.30848-47.37024 12.30848H155.97568C103.75168 901.12 61.44 860.16 61.44 809.61536c0-16.09728 4.38272-31.92832 12.71808-45.8752L430.16192 168.5504c26.17344-43.7248 84.00896-58.65472 129.20832-33.34144a93.0816 93.0816 0 0 1 34.44736 33.34144zM512 819.2a61.44 61.44 0 1 0 0-122.88 61.44 61.44 0 0 0 0 122.88z m0-512a72.31488 72.31488 0 0 0-71.76192 81.3056l25.72288 205.7216a46.40768 46.40768 0 0 0 92.07808 0l25.72288-205.74208A72.31488 72.31488 0 0 0 512 307.2z\" p-id=\"2750\">\n</path>\n</svg>";

},{}],"e5Aaq":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _flip = require("./flip");
var _flipDefault = parcelHelpers.interopDefault(_flip);
var _aspectRatio = require("./aspectRatio");
var _aspectRatioDefault = parcelHelpers.interopDefault(_aspectRatio);
var _playbackRate = require("./playbackRate");
var _playbackRateDefault = parcelHelpers.interopDefault(_playbackRate);
var _subtitleOffset = require("./subtitleOffset");
var _subtitleOffsetDefault = parcelHelpers.interopDefault(_subtitleOffset);
var _component = require("../utils/component");
var _componentDefault = parcelHelpers.interopDefault(_component);
var _utils = require("../utils");
function makeRecursion(option, parentItem, parentList) {
    for(let index = 0; index < option.length; index++){
        const item = option[index];
        item.$parentItem = parentItem;
        item.$parentList = parentList;
        if (item.selector) makeRecursion(item.selector, item, option);
    }
    return option;
}
function isStringOrNumber(val) {
    return [
        'string',
        'number'
    ].includes(typeof val);
}
class Setting extends _componentDefault.default {
    constructor(art){
        super(art);
        const { option , events: { proxy  } , template: { $setting , $player  } ,  } = art;
        this.name = 'setting';
        this.$parent = $setting;
        this.option = [];
        this.events = [];
        this.cache = new Map();
        if (option.setting) {
            if (option.playbackRate) this.option.push(_playbackRateDefault.default(art));
            if (option.aspectRatio) this.option.push(_aspectRatioDefault.default(art));
            if (option.flip) this.option.push(_flipDefault.default(art));
            if (option.subtitleOffset) this.option.push(_subtitleOffsetDefault.default(art));
            for(let index = 0; index < option.settings.length; index++)this.option.push(option.settings[index]);
            this.option = makeRecursion(this.option);
            this.init(this.option);
            art.on('blur', ()=>{
                if (this.show) {
                    this.show = false;
                    this.init(this.option);
                }
            });
            proxy($player, 'click', (event)=>{
                if (this.show && !_utils.includeFromEvent(event, art.controls.setting) && !_utils.includeFromEvent(event, this.$parent)) {
                    this.show = false;
                    this.init(this.option);
                }
            });
        }
    }
    add(callback) {
        if (typeof callback === 'function') this.option.push(callback(this.art));
        else this.option.push(callback);
        this.cache = new Map();
        this.events.forEach((event)=>event()
        );
        this.events = [];
        this.$parent.innerHTML = '';
        this.option = makeRecursion(this.option);
        this.init(this.option);
    }
    creatHeader(item) {
        const { icons , events: { proxy  } ,  } = this.art;
        const $item = document.createElement('div');
        _utils.addClass($item, 'art-setting-item');
        _utils.addClass($item, 'art-setting-item-back');
        const $left = _utils.append($item, '<div class="art-setting-item-left"></div>');
        const $icon = document.createElement('div');
        _utils.addClass($icon, 'art-setting-item-left-icon');
        _utils.append($icon, icons.arrowLeft);
        _utils.append($left, $icon);
        _utils.append($left, item.$parentItem.html);
        const event = proxy($item, 'click', ()=>{
            this.init(item.$parentList);
        });
        this.events.push(event);
        return $item;
    }
    creatItem(type, item) {
        const { icons , events: { proxy  } ,  } = this.art;
        const $item = document.createElement('div');
        _utils.addClass($item, 'art-setting-item');
        if (isStringOrNumber(item.name)) $item.dataset.name = item.name;
        if (isStringOrNumber(item.value)) $item.dataset.value = item.value;
        const $left = _utils.append($item, '<div class="art-setting-item-left"></div>');
        const $right = _utils.append($item, '<div class="art-setting-item-right"></div>');
        const $icon = document.createElement('div');
        _utils.addClass($icon, 'art-setting-item-left-icon');
        switch(type){
            case 'switch':
            case 'range':
                _utils.append($icon, isStringOrNumber(item.icon) || item.icon instanceof Element ? item.icon : icons.config);
                break;
            case 'selector':
                if (item.selector && item.selector.length) _utils.append($icon, isStringOrNumber(item.icon) || item.icon instanceof Element ? item.icon : icons.config);
                else _utils.append($icon, icons.check);
                break;
            default:
                break;
        }
        _utils.append($left, $icon);
        item.$icon = $icon;
        _utils.def(item, 'icon', {
            get () {
                return $icon.innerHTML;
            },
            set (value) {
                if (isStringOrNumber(value)) $icon.innerHTML = value;
            }
        });
        const $html = document.createElement('div');
        _utils.addClass($html, 'art-setting-item-left-text');
        _utils.append($html, item.html || '');
        _utils.append($left, $html);
        item.$html = $html;
        _utils.def(item, 'html', {
            get () {
                return $html.innerHTML;
            },
            set (value) {
                if (isStringOrNumber(value)) $html.innerHTML = value;
            }
        });
        const $tooltip = document.createElement('div');
        _utils.addClass($tooltip, 'art-setting-item-right-tooltip');
        _utils.append($tooltip, item.tooltip || '');
        _utils.append($right, $tooltip);
        item.$tooltip = $tooltip;
        _utils.def(item, 'tooltip', {
            get () {
                return $tooltip.innerHTML;
            },
            set (value) {
                if (isStringOrNumber(value)) $tooltip.innerHTML = value;
            }
        });
        switch(type){
            case 'switch':
                {
                    const $state = document.createElement('div');
                    _utils.addClass($state, 'art-setting-item-right-icon');
                    const $switchOn = _utils.append($state, icons.switchOn);
                    const $switchOff = _utils.append($state, icons.switchOff);
                    _utils.setStyle(item.switch ? $switchOff : $switchOn, 'display', 'none');
                    _utils.append($right, $state);
                    item.$switch = item.switch;
                    _utils.def(item, 'switch', {
                        get () {
                            return item.$switch;
                        },
                        set (value) {
                            item.$switch = value;
                            if (value) {
                                _utils.setStyle($switchOff, 'display', 'none');
                                _utils.setStyle($switchOn, 'display', null);
                            } else {
                                _utils.setStyle($switchOff, 'display', null);
                                _utils.setStyle($switchOn, 'display', 'none');
                            }
                        }
                    });
                    break;
                }
            case 'range':
                {
                    const $state = document.createElement('div');
                    _utils.addClass($state, 'art-setting-item-right-icon');
                    const $range = _utils.append($state, '<input type="range">');
                    $range.value = item.range[0] || 0;
                    $range.min = item.range[1] || 0;
                    $range.max = item.range[2] || 10;
                    $range.step = item.range[3] || 1;
                    _utils.addClass($range, 'art-setting-range');
                    _utils.append($right, $state);
                    item.$range = $range;
                    _utils.def(item, 'range', {
                        get () {
                            return $range.valueAsNumber;
                        },
                        set (value) {
                            $range.value = Number(value);
                        }
                    });
                }
                break;
            case 'selector':
                if (item.selector && item.selector.length) {
                    const $state = document.createElement('div');
                    _utils.addClass($state, 'art-setting-item-right-icon');
                    _utils.append($state, icons.arrowRight);
                    _utils.append($right, $state);
                }
                break;
            default:
                break;
        }
        switch(type){
            case 'switch':
                if (item.onSwitch) {
                    const event1 = proxy($item, 'click', async (event)=>{
                        item.switch = await item.onSwitch.call(this.art, item, $item, event);
                    });
                    this.events.push(event1);
                }
                break;
            case 'range':
                if (item.onRange && item.$range) {
                    const event3 = proxy(item.$range, 'change', async (event)=>{
                        item.tooltip = await item.onRange.call(this.art, item, $item, event);
                    });
                    this.events.push(event3);
                }
                break;
            case 'selector':
                {
                    const event5 = proxy($item, 'click', async (event)=>{
                        if (item.selector && item.selector.length) this.init(item.selector, item.width);
                        else {
                            _utils.inverseClass($item, 'art-current');
                            if (item.$parentList) this.init(item.$parentList);
                            if (item.$parentItem && item.$parentItem.onSelect) {
                                const result = await item.$parentItem.onSelect.call(this.art, item, $item, event);
                                if (item.$parentItem.$tooltip && isStringOrNumber(result)) item.$parentItem.$tooltip.innerHTML = result;
                            }
                        }
                    });
                    this.events.push(event5);
                    if (item.default) _utils.addClass($item, 'art-current');
                }
                break;
            default:
                break;
        }
        return $item;
    }
    init(option, width) {
        const { constructor  } = this.art;
        if (this.cache.has(option)) {
            const $panel = this.cache.get(option);
            _utils.inverseClass($panel, 'art-current');
            _utils.setStyle(this.$parent, 'width', `${$panel.dataset.width}px`);
            _utils.setStyle(this.$parent, 'height', `${$panel.dataset.height}px`);
        } else {
            const $panel = document.createElement('div');
            _utils.addClass($panel, 'art-setting-panel');
            $panel.dataset.width = width || constructor.SETTING_WIDTH;
            $panel.dataset.height = option.length * constructor.SETTING_ITEM_HEIGHT;
            if (option[0] && option[0].$parentItem) {
                _utils.append($panel, this.creatHeader(option[0]));
                $panel.dataset.height = Number($panel.dataset.height) + constructor.SETTING_ITEM_HEIGHT;
            }
            for(let index = 0; index < option.length; index++){
                const item = option[index];
                if (_utils.has(item, 'switch')) _utils.append($panel, this.creatItem('switch', item));
                else if (_utils.has(item, 'range')) _utils.append($panel, this.creatItem('range', item));
                else _utils.append($panel, this.creatItem('selector', item));
            }
            _utils.append(this.$parent, $panel);
            this.cache.set(option, $panel);
            _utils.inverseClass($panel, 'art-current');
            _utils.setStyle(this.$parent, 'width', `${$panel.dataset.width}px`);
            _utils.setStyle(this.$parent, 'height', `${$panel.dataset.height}px`);
            if (option[0] && option[0].$parentItem && option[0].$parentItem.mounted) option[0].$parentItem.mounted.call(this.art, $panel, option[0].$parentItem);
        }
    }
}
exports.default = Setting;

},{"./flip":"7rVpZ","./aspectRatio":"9hfUt","./playbackRate":"8RIYy","./subtitleOffset":"aVPfi","../utils/component":"bgug2","../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"7rVpZ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function flip(art) {
    const { i18n , icons , constructor  } = art;
    const keys = {
        normal: 'Normal',
        horizontal: 'Horizontal',
        vertical: 'Vertical'
    };
    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = i18n.get(keys[value]);
        const $current = _utils.queryAll('.art-setting-item', $panel).find((item)=>item.dataset.value === value
        );
        if ($current) _utils.inverseClass($current, 'art-current');
    }
    return {
        width: constructor.SETTING_ITEM_WIDTH,
        html: i18n.get('Video Flip'),
        tooltip: i18n.get(keys[art.flip]),
        icon: icons.flip,
        selector: Object.keys(keys).map((item)=>{
            return {
                value: item,
                default: item === art.flip,
                html: i18n.get(keys[item])
            };
        }),
        onSelect (item) {
            art.flip = item.value;
        },
        mounted: ($panel, item)=>{
            update($panel, item.$tooltip, art.flip);
            art.on('flip', ()=>{
                update($panel, item.$tooltip, art.flip);
            });
        }
    };
}
exports.default = flip;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"9hfUt":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function aspectRatio(art) {
    const { i18n , icons , constructor  } = art;
    function getI18n(value) {
        return value === 'default' ? i18n.get('Default') : value;
    }
    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = getI18n(value);
        const $current = _utils.queryAll('.art-setting-item', $panel).find((item)=>item.dataset.value === value
        );
        if ($current) _utils.inverseClass($current, 'art-current');
    }
    return {
        width: constructor.SETTING_ITEM_WIDTH,
        html: i18n.get('Aspect Ratio'),
        icon: icons.aspectRatio,
        tooltip: getI18n(art.aspectRatio),
        selector: [
            'default',
            '4:3',
            '16:9'
        ].map((item)=>{
            return {
                value: item,
                default: item === art.aspectRatio,
                html: getI18n(item)
            };
        }),
        onSelect (item) {
            art.aspectRatio = item.value;
        },
        mounted: ($panel, item)=>{
            update($panel, item.$tooltip, art.aspectRatio);
            art.on('aspectRatio', ()=>{
                update($panel, item.$tooltip, art.aspectRatio);
            });
        }
    };
}
exports.default = aspectRatio;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"8RIYy":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function playbackRate(art) {
    const { i18n , icons , constructor  } = art;
    function getI18n(value) {
        return value === 1.0 ? i18n.get('Normal') : value;
    }
    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = getI18n(value);
        const $current = _utils.queryAll('.art-setting-item', $panel).find((item)=>Number(item.dataset.value) === value
        );
        if ($current) _utils.inverseClass($current, 'art-current');
    }
    return {
        width: constructor.SETTING_ITEM_WIDTH,
        html: i18n.get('Play Speed'),
        tooltip: getI18n(art.playbackRate),
        icon: icons.playbackRate,
        selector: [
            0.5,
            0.75,
            1.0,
            1.25,
            1.5,
            2.0
        ].map((item)=>{
            return {
                value: item,
                default: item === art.playbackRate,
                html: getI18n(item)
            };
        }),
        onSelect (item) {
            art.playbackRate = item.value;
        },
        mounted: ($panel, item)=>{
            update($panel, item.$tooltip, art.playbackRate);
            art.on('playbackRate', ()=>{
                update($panel, item.$tooltip, art.playbackRate);
            });
        }
    };
}
exports.default = playbackRate;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"aVPfi":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function subtitleOffset(art) {
    const { i18n , icons , constructor  } = art;
    function getI18n(value) {
        return value === 0 ? i18n.get('Normal') : value;
    }
    function update($panel, $tooltip, value) {
        if ($tooltip) $tooltip.innerText = getI18n(value);
        const $current = _utils.queryAll('.art-setting-item', $panel).find((item)=>Number(item.dataset.value) === value
        );
        if ($current) _utils.inverseClass($current, 'art-current');
    }
    return {
        width: constructor.SETTING_ITEM_WIDTH,
        html: i18n.get('Subtitle Offset'),
        tooltip: getI18n(art.subtitleOffset),
        icon: icons.subtitle,
        selector: [
            -5,
            -4,
            -3,
            -2,
            -1,
            0,
            1,
            2,
            3,
            4,
            5
        ].map((item)=>{
            return {
                value: item,
                default: item === art.subtitleOffset,
                html: getI18n(item)
            };
        }),
        onSelect (item) {
            art.subtitleOffset = item.value;
        },
        mounted: ($panel, item)=>{
            update($panel, item.$tooltip, art.subtitleOffset);
            art.on('subtitleOffset', ()=>{
                update($panel, item.$tooltip, art.subtitleOffset);
            });
        }
    };
}
exports.default = subtitleOffset;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"feFxw":[function(require,module,exports) {
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
        } catch (error) {
            return key ? this.settings[key] : this.settings;
        }
    }
    set(key, value) {
        try {
            const storage = Object.assign({}, this.get(), {
                [key]: value
            });
            window.localStorage.setItem(this.name, JSON.stringify(storage));
        } catch (error) {
            this.settings[key] = value;
        }
    }
    del(key) {
        try {
            const storage = this.get();
            delete storage[key];
            window.localStorage.setItem(this.name, JSON.stringify(storage));
        } catch (error) {
            delete this.settings[key];
        }
    }
    clear() {
        try {
            window.localStorage.removeItem(this.name);
        } catch (error) {
            this.settings = {};
        }
    }
}
exports.default = Storage;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"h1hfO":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
var _miniProgressBar = require("./miniProgressBar");
var _miniProgressBarDefault = parcelHelpers.interopDefault(_miniProgressBar);
var _autoOrientation = require("./autoOrientation");
var _autoOrientationDefault = parcelHelpers.interopDefault(_autoOrientation);
var _autoPlayback = require("./autoPlayback");
var _autoPlaybackDefault = parcelHelpers.interopDefault(_autoPlayback);
var _fastForward = require("./fastForward");
var _fastForwardDefault = parcelHelpers.interopDefault(_fastForward);
var _lock = require("./lock");
var _lockDefault = parcelHelpers.interopDefault(_lock);
class Plugins {
    constructor(art){
        this.art = art;
        this.id = 0;
        const { option  } = art;
        if (option.miniProgressBar && !option.isLive) this.add(_miniProgressBarDefault.default);
        if (option.lock && _utils.isMobile) this.add(_lockDefault.default);
        if (option.autoPlayback) this.add(_autoPlaybackDefault.default);
        if (option.autoOrientation && _utils.isMobile) this.add(_autoOrientationDefault.default);
        if (option.fastForward && _utils.isMobile && !option.isLive) this.add(_fastForwardDefault.default);
        for(let index = 0; index < option.plugins.length; index++)this.add(option.plugins[index]);
    }
    add(plugin) {
        this.id += 1;
        const result = plugin.call(this, this.art);
        const pluginName = result && result.name || plugin.name || `plugin${this.id}`;
        _utils.errorHandle(!_utils.has(this, pluginName), `Cannot add a plugin that already has the same name: ${pluginName}`);
        _utils.def(this, pluginName, {
            value: result
        });
        return this;
    }
}
exports.default = Plugins;

},{"../utils":"jmgNb","./miniProgressBar":"dMA6v","./autoOrientation":"aROGj","./autoPlayback":"kQ2fc","./fastForward":"fgbhT","./lock":"j2mDF","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"dMA6v":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
function miniProgressBar(art) {
    art.on('ready', ()=>{
        art.layers.add({
            name: 'miniProgressBar',
            mounted ($progressBar) {
                art.on('destroy', ()=>{
                    $progressBar.style.display = 'none';
                });
                art.on('video:timeupdate', ()=>{
                    $progressBar.style.width = `${art.played * 100}%`;
                });
                art.on('setBar', (type, percentage)=>{
                    if (type === 'played') $progressBar.style.width = `${percentage * 100}%`;
                });
            }
        });
    });
    return {
        name: 'miniProgressBar'
    };
}
exports.default = miniProgressBar;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"aROGj":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function autoOrientation(art) {
    const { option , constructor , template: { $player , $video  } ,  } = art;
    art.on('fullscreenWeb', (state)=>{
        if (state) {
            const { videoWidth , videoHeight  } = $video;
            const { clientWidth: viewWidth , clientHeight: viewHeight  } = document.documentElement;
            if (videoWidth > videoHeight && viewWidth < viewHeight || videoWidth < videoHeight && viewWidth > viewHeight) // There is a conflict with the fullscreen event, and it is changed to asynchronous execution
            setTimeout(()=>{
                _utils.setStyle($player, 'width', `${viewHeight}px`);
                _utils.setStyle($player, 'height', `${viewWidth}px`);
                _utils.setStyle($player, 'transform-origin', '0 0');
                _utils.setStyle($player, 'transform', `rotate(90deg) translate(0, -${viewWidth}px)`);
                _utils.addClass($player, 'art-auto-orientation');
                art.emit('resize');
            }, constructor.MOBILE_AUTO_ORIENTATION_TIME);
        } else if (_utils.hasClass($player, 'art-auto-orientation')) {
            _utils.setStyle($player, 'width', null);
            _utils.setStyle($player, 'height', null);
            _utils.setStyle($player, 'transform', null);
            _utils.setStyle($player, 'transform-origin', null);
            _utils.removeClass($player, 'art-auto-orientation');
            art.aspectRatioReset = true;
            art.autoSize = option.autoSize;
            art.notice.show = '';
            art.emit('resize');
        }
    });
    art.on('fullscreen', async (state)=>{
        const lastOrientation = screen.orientation.type;
        if (state) {
            const { videoWidth , videoHeight  } = $video;
            const { clientWidth: viewWidth , clientHeight: viewHeight  } = document.documentElement;
            if (videoWidth > videoHeight && viewWidth < viewHeight || videoWidth < videoHeight && viewWidth > viewHeight) {
                const oppositeOrientation = lastOrientation.startsWith('portrait') ? 'landscape' : 'portrait';
                await screen.orientation.lock(oppositeOrientation);
                _utils.addClass($player, 'art-auto-orientation-fullscreen');
            }
        } else if (_utils.hasClass($player, 'art-auto-orientation-fullscreen')) {
            await screen.orientation.lock(lastOrientation);
            _utils.removeClass($player, 'art-auto-orientation-fullscreen');
        }
    });
    return {
        name: 'autoOrientation',
        get state () {
            return _utils.hasClass($player, 'art-auto-orientation');
        }
    };
}
exports.default = autoOrientation;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"kQ2fc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function autoPlayback(art) {
    const { i18n , storage , constructor , template: { $poster  } ,  } = art;
    art.on('video:timeupdate', ()=>{
        const times = storage.get('times') || {};
        const keys = Object.keys(times);
        if (keys.length > constructor.AUTO_PLAYBACK_MAX) delete times[keys[0]];
        times[art.option.url] = art.currentTime;
        storage.set('times', times);
    });
    art.on('ready', ()=>{
        const times = storage.get('times') || {};
        const currentTime = times[art.option.url];
        if (currentTime) {
            art.seek = currentTime;
            _utils.setStyle($poster, 'display', 'none');
            art.notice.show = `${i18n.get('Auto playback at')} ${_utils.secondToTime(currentTime)}`;
        }
    });
    return {
        name: 'autoPlayback',
        get times () {
            return storage.get('times') || {};
        },
        clear () {
            return storage.del('times');
        }
    };
}
exports.default = autoPlayback;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"fgbhT":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function fastForward(art) {
    const { constructor , events: { proxy  } , template: { $player , $video  } ,  } = art;
    let timer = null;
    let isPress = false;
    const onStart = (event)=>{
        if (event.touches.length === 1 && art.playing && !art.isLock) timer = setTimeout(()=>{
            isPress = true;
            art.playbackRate = constructor.FAST_FORWARD_VALUE;
            _utils.addClass($player, 'art-fast-forward');
        }, constructor.FAST_FORWARD_TIME);
    };
    const onStop = ()=>{
        clearTimeout(timer);
        if (isPress) {
            isPress = false;
            art.playbackRate = 1;
            _utils.removeClass($player, 'art-fast-forward');
        }
    };
    proxy($video, 'touchstart', onStart);
    proxy(document, 'touchmove', onStop);
    proxy(document, 'touchend', onStop);
    return {
        name: 'fastForward',
        get state () {
            return _utils.hasClass($player, 'art-fast-forward');
        }
    };
}
exports.default = fastForward;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"j2mDF":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _utils = require("../utils");
function lock(art) {
    const { layers , icons , template: { $player  } ,  } = art;
    layers.add({
        name: 'lock',
        mounted ($el) {
            const $lock = _utils.append($el, icons.lock);
            const $unlock = _utils.append($el, icons.unlock);
            _utils.setStyle($lock, 'display', 'none');
            art.on('lock', (state)=>{
                if (state) {
                    _utils.setStyle($lock, 'display', 'inline-flex');
                    _utils.setStyle($unlock, 'display', 'none');
                } else {
                    _utils.setStyle($lock, 'display', 'none');
                    _utils.setStyle($unlock, 'display', 'inline-flex');
                }
            });
        },
        click () {
            if (_utils.hasClass($player, 'art-lock')) {
                _utils.removeClass($player, 'art-lock');
                this.isLock = false;
                art.emit('lock', false);
            } else {
                _utils.addClass($player, 'art-lock');
                this.isLock = true;
                art.emit('lock', true);
            }
        }
    });
    return {
        name: 'lock',
        get state () {
            return _utils.hasClass($player, 'art-lock');
        }
    };
}
exports.default = lock;

},{"../utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"gqroK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class Ads {
    constructor(art){
        this.art = art;
        this.init();
    }
    get current() {
        return this.art.option.ads[this.index];
    }
    get prev() {
        return this.art.option.ads[this.index - 1];
    }
    get next() {
        return this.art.option.ads[this.index + 1];
    }
    init() {
        this.index = 0;
        this.isEnd = false;
        this.playing = false;
        this.urlCache = this.art.option.url;
        if (this.current) {
            this.playing = true;
            this.play(this.current);
        }
    }
    play(item = {}) {
        if (this.isEnd) return;
        this.art.switchUrl(item.url);
        this.art.once('video:timeupdate', ()=>{
            this.art.emit('ads:start', item);
        });
        this.art.once('video:ended', ()=>{
            const next = this.next;
            if (next) {
                this.index += 1;
                this.play(next);
            } else this.end();
        });
    }
    end() {
        if (this.isEnd) return;
        this.isEnd = true;
        this.playing = false;
        this.art.option.url = this.urlCache;
        this.art.switchUrl(this.urlCache);
        this.art.emit('ads:end');
    }
}
exports.default = Ads;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"c9n1Y":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _config = require("./config");
var _configDefault = parcelHelpers.interopDefault(_config);
var _utils = require("./utils");
class Mobile {
    constructor(art){
        const { option , events: { proxy  } , template: { $video  } ,  } = art;
        for(let index = 0; index < _configDefault.default.events.length; index++)proxy($video, _configDefault.default.events[index], (event)=>{
            art.emit(`video:${event.type}`, event);
        });
        Object.keys(option.moreVideoAttr).forEach((key)=>{
            $video[key] = option.moreVideoAttr[key];
        });
        if (option.muted) $video.muted = option.muted;
        if (option.volume) $video.volume = _utils.clamp(option.volume, 0, 1);
        if (option.poster) $video.poster = option.poster;
        if (option.autoplay) $video.autoplay = option.autoplay;
        if (option.playsInline) {
            $video.playsInline = true;
            $video['webkit-playsinline'] = true;
        }
        const typeName = option.type || _utils.getExt(option.url);
        const typeCallback = option.customType[typeName];
        if (typeName && typeCallback) {
            typeCallback($video, option.url, art);
            art.emit('customType', typeName);
        } else {
            $video.src = option.url;
            art.emit('url', $video.src);
        }
    }
}
exports.default = Mobile;

},{"./config":"2ZnKD","./utils":"jmgNb","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}]},["eFv8l"], "eFv8l", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map

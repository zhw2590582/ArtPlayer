(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.artplayer = {})));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var assertThisInitialized = _assertThisInitialized;

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
      return call;
    }

    return assertThisInitialized(self);
  }

  var possibleConstructorReturn = _possibleConstructorReturn;

  var getPrototypeOf = createCommonjsModule(function (module) {
  function _getPrototypeOf(o) {
    module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  module.exports = _getPrototypeOf;
  });

  var setPrototypeOf = createCommonjsModule(function (module) {
  function _setPrototypeOf(o, p) {
    module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  module.exports = _setPrototypeOf;
  });

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) setPrototypeOf(subClass, superClass);
  }

  var inherits = _inherits;

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  var isNativeFunction = _isNativeFunction;

  var construct = createCommonjsModule(function (module) {
  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      module.exports = _construct = Reflect.construct;
    } else {
      module.exports = _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  module.exports = _construct;
  });

  var wrapNativeSuper = createCommonjsModule(function (module) {
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return construct(Class, arguments, getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  module.exports = _wrapNativeSuper;
  });

  var ArtPlayerError =
  /*#__PURE__*/
  function (_Error) {
    inherits(ArtPlayerError, _Error);

    function ArtPlayerError(message) {
      var _this;

      classCallCheck(this, ArtPlayerError);

      _this = possibleConstructorReturn(this, getPrototypeOf(ArtPlayerError).call(this, message));
      Error.captureStackTrace(assertThisInitialized(assertThisInitialized(_this)), _this.constructor);
      _this.name = 'ArtPlayerError';
      return _this;
    }

    return ArtPlayerError;
  }(wrapNativeSuper(Error));

  function errorHandle(condition, msg) {
    if (!condition) {
      throw new ArtPlayerError(msg);
    }
  }
  function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
  }

  function verification(option) {
    errorHandle(option.container, '\'container\' option is required.');
    errorHandle(option.url, '\'url\' option is required.');
    errorHandle(option.container instanceof Element, "'container' option require 'Element' type, but got '".concat(_typeof_1(option.container), "'."));
    errorHandle(typeof option.url === 'string', "'url' option require 'string' type, but got '".concat(_typeof_1(option.url), "'."));
    errorHandle(typeof option.poster === 'string', "'poster' option require 'string' type, but got '".concat(_typeof_1(option.poster), "'."));
    errorHandle(typeof option.volume === 'number', "'volume' option require 'number' type, but got '".concat(_typeof_1(option.volume), "'."));
    errorHandle(typeof option.autoplay === 'boolean', "'autoplay' option require 'boolean' type, but got '".concat(_typeof_1(option.autoplay), "'."));
    errorHandle(['none', 'metadata', 'auto'].indexOf(option.preload) > -1, '\'preload\' option require one of \'none、metadata、auto\'.');
    errorHandle(typeof option.lang === 'string', "'lang' option require 'string' type, but got '".concat(_typeof_1(option.lang), "'."));
  }

  function E () {
    // Keep this empty so it's easier to inherit from
    // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
  }

  E.prototype = {
    on: function (name, callback, ctx) {
      var e = this.e || (this.e = {});

      (e[name] || (e[name] = [])).push({
        fn: callback,
        ctx: ctx
      });

      return this;
    },

    once: function (name, callback, ctx) {
      var self = this;
      function listener () {
        self.off(name, listener);
        callback.apply(ctx, arguments);
      }
      listener._ = callback;
      return this.on(name, listener, ctx);
    },

    emit: function (name) {
      var data = [].slice.call(arguments, 1);
      var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
      var i = 0;
      var len = evtArr.length;

      for (i; i < len; i++) {
        evtArr[i].fn.apply(evtArr[i].ctx, data);
      }

      return this;
    },

    off: function (name, callback) {
      var e = this.e || (this.e = {});
      var evts = e[name];
      var liveEvents = [];

      if (evts && callback) {
        for (var i = 0, len = evts.length; i < len; i++) {
          if (evts[i].fn !== callback && evts[i].fn._ !== callback)
            liveEvents.push(evts[i]);
        }
      }

      // Remove event from queue to prevent memory leak
      // Suggested by https://github.com/lazd
      // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

      (liveEvents.length)
        ? e[name] = liveEvents
        : delete e[name];

      return this;
    }
  };

  var tinyEmitter = E;

  var Template =
  /*#__PURE__*/
  function () {
    function Template(art) {
      classCallCheck(this, Template);

      this.art = art;
      this.init();
    }

    createClass(Template, [{
      key: "init",
      value: function init() {
        this.art.refs.$container.innerHTML = "\n        <div class=\"artplayer-wrap\">\n          <video class=\"artplayer-video\" webkit-playsinline playsinline></video>\n          <div class=\"artplayer-controls\"></div>\n          <div class=\"artplayer-layers\"></div>\n          <div class=\"artplayer-loading\"></div>\n          <div class=\"artplayer-notice\"></div>\n        </div>\n      ";
        this.art.refs.$wrap = this.art.refs.$container.querySelector('.artplayer-wrap');
        this.art.refs.$video = this.art.refs.$container.querySelector('.artplayer-video');
        this.art.refs.$controls = this.art.refs.$container.querySelector('.artplayer-controls');
        this.art.refs.$layers = this.art.refs.$container.querySelector('.artplayer-layers');
        this.art.refs.$loading = this.art.refs.$container.querySelector('.artplayer-loading');
        this.art.refs.$notice = this.art.refs.$container.querySelector('.artplayer-notice');
      }
    }]);

    return Template;
  }();

  var ZHCN = {};

  var ZHTW = {};

  var EN = {};

  var JP = {};

  var i18nMap = {
    zh: ZHCN,
    'zh-cn': ZHCN,
    'zh-tw': ZHTW,
    en: EN,
    jp: JP
  };

  var I18n =
  /*#__PURE__*/
  function () {
    function I18n(_ref) {
      var option = _ref.option;

      classCallCheck(this, I18n);

      this.language = i18nMap[option.lang.toLowerCase()] || i18nMap.en;
    }

    createClass(I18n, [{
      key: "get",
      value: function get(key) {
        return this.language[key] || key;
      }
    }]);

    return I18n;
  }();

  var Player =
  /*#__PURE__*/
  function () {
    function Player(art) {
      classCallCheck(this, Player);

      this.art = art;
      this.init();
    }

    createClass(Player, [{
      key: "init",
      value: function init() {
        var option = this.art.option;
        var $video = this.art.refs.$video;
        $video.controls = false;
        $video.poster = option.poster;
        $video.volume = clamp(option.volume, 0, 1);
        $video.autoplay = option.autoplay;
        $video.preload = option.preload;
        $video.src = option.url;
      }
    }]);

    return Player;
  }();

  var Controls = function Controls(_ref) {//

    var option = _ref.option;

    classCallCheck(this, Controls);
  };

  var Contextmenu = function Contextmenu(_ref) {//

    var option = _ref.option;

    classCallCheck(this, Contextmenu);
  };

  var Danmu = function Danmu(_ref) {//

    var option = _ref.option;

    classCallCheck(this, Danmu);
  };

  var Info = function Info(_ref) {//

    var option = _ref.option;

    classCallCheck(this, Info);
  };

  var Captions = function Captions(_ref) {//

    var option = _ref.option;

    classCallCheck(this, Captions);
  };

  var Events = function Events(_ref) {//

    var option = _ref.option;

    classCallCheck(this, Events);
  };

  var Hotkey = function Hotkey(_ref) {//

    var option = _ref.option;

    classCallCheck(this, Hotkey);
  };

  var id = 0;
  var instances = [];

  var Artplayer =
  /*#__PURE__*/
  function (_Emitter) {
    inherits(Artplayer, _Emitter);

    function Artplayer(option) {
      var _this;

      classCallCheck(this, Artplayer);

      _this = possibleConstructorReturn(this, getPrototypeOf(Artplayer).call(this));
      _this.option = Object.assign({}, Artplayer.DEFAULTS, option);
      verification(_this.option);

      _this.init();

      return _this;
    }

    createClass(Artplayer, [{
      key: "init",
      value: function init() {
        this.refs = {
          $container: this.option.container
        };
        this.destroyEvents = [];
        this.template = new Template(this);
        this.i18n = new I18n(this);
        this.player = new Player(this);
        this.controls = new Controls(this);
        this.contextmenu = new Contextmenu(this);
        this.danmaku = new Danmu(this);
        this.subtitle = new Captions(this);
        this.info = new Info(this);
        this.events = new Events(this);
        this.hotkey = new Hotkey(this);
        this.id = id++;
        instances.push(this);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.destroyEvents.forEach(function (event) {
          return event.destroy();
        });
        this.refs.container.innerHTML = '';
        instances.splice(instances.indexOf(this), 1);
      }
    }], [{
      key: "use",
      value: function use(plugin) {
        var installedPlugins = this.plugins || (this.plugins = []);

        if (installedPlugins.indexOf(plugin) > -1) {
          return this;
        }

        var args = Array.from(arguments).slice(1);
        args.unshift(this);

        if (typeof plugin.install === 'function') {
          plugin.install.apply(plugin, args);
        } else if (typeof plugin === 'function') {
          plugin.apply(null, args);
        }

        installedPlugins.push(plugin);
        return this;
      }
    }, {
      key: "version",
      get: function get() {
        return '1.0.0';
      }
    }, {
      key: "DEFAULTS",
      get: function get() {
        return {
          container: document.querySelector('.artplayer'),
          url: '',
          poster: '',
          volume: 0.7,
          autoplay: false,
          preload: 'auto',
          lang: navigator.language.toLowerCase()
        };
      }
    }]);

    return Artplayer;
  }(tinyEmitter);

  window.Artplayer = Artplayer;

  exports.instances = instances;
  exports.default = Artplayer;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=artplayer.js.map

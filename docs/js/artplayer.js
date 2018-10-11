(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@babel/runtime/helpers/classCallCheck'), require('@babel/runtime/helpers/createClass'), require('@babel/runtime/helpers/possibleConstructorReturn'), require('@babel/runtime/helpers/getPrototypeOf'), require('@babel/runtime/helpers/inherits')) :
    typeof define === 'function' && define.amd ? define(['exports', '@babel/runtime/helpers/classCallCheck', '@babel/runtime/helpers/createClass', '@babel/runtime/helpers/possibleConstructorReturn', '@babel/runtime/helpers/getPrototypeOf', '@babel/runtime/helpers/inherits'], factory) :
    (factory((global.artplayer = {}),global._classCallCheck,global._createClass,global._possibleConstructorReturn,global._getPrototypeOf,global._inherits));
}(this, (function (exports,_classCallCheck,_createClass,_possibleConstructorReturn,_getPrototypeOf,_inherits) { 'use strict';

    _classCallCheck = _classCallCheck && _classCallCheck.hasOwnProperty('default') ? _classCallCheck['default'] : _classCallCheck;
    _createClass = _createClass && _createClass.hasOwnProperty('default') ? _createClass['default'] : _createClass;
    _possibleConstructorReturn = _possibleConstructorReturn && _possibleConstructorReturn.hasOwnProperty('default') ? _possibleConstructorReturn['default'] : _possibleConstructorReturn;
    _getPrototypeOf = _getPrototypeOf && _getPrototypeOf.hasOwnProperty('default') ? _getPrototypeOf['default'] : _getPrototypeOf;
    _inherits = _inherits && _inherits.hasOwnProperty('default') ? _inherits['default'] : _inherits;

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

    function verification(option) {//
    }

    var ZHCN = {};

    var ZHTW = {};

    var EN = {};

    var JP = {};

    var i18nMap = {
      "zh": ZHCN,
      "zh-CN": ZHCN,
      "zh-TW": ZHTW,
      "en": EN,
      "jp": JP
    };

    var I18n =
    /*#__PURE__*/
    function () {
      function I18n(_ref) {
        var option = _ref.option;

        _classCallCheck(this, I18n);

        this.language = i18nMap[option.language] || i18nMap.en;
      }

      _createClass(I18n, [{
        key: "get",
        value: function get(key) {
          return this.language[key] || key;
        }
      }]);

      return I18n;
    }();

    var Player = function Player(_ref) {//

      var option = _ref.option;

      _classCallCheck(this, Player);
    };

    var Controls = function Controls(_ref) {//

      var option = _ref.option;

      _classCallCheck(this, Controls);
    };

    var Contextmenu = function Contextmenu(_ref) {//

      var option = _ref.option;

      _classCallCheck(this, Contextmenu);
    };

    var Danmu = function Danmu(_ref) {//

      var option = _ref.option;

      _classCallCheck(this, Danmu);
    };

    var Info = function Info(_ref) {//

      var option = _ref.option;

      _classCallCheck(this, Info);
    };

    var Captions = function Captions(_ref) {//

      var option = _ref.option;

      _classCallCheck(this, Captions);
    };

    var Events = function Events(_ref) {//

      var option = _ref.option;

      _classCallCheck(this, Events);
    };

    var Hotkey = function Hotkey(_ref) {//

      var option = _ref.option;

      _classCallCheck(this, Hotkey);
    };

    var id = 0;
    var instances = [];

    var Artplayer =
    /*#__PURE__*/
    function (_Emitter) {
      _inherits(Artplayer, _Emitter);

      function Artplayer(option) {
        var _this;

        _classCallCheck(this, Artplayer);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Artplayer).call(this));
        _this.option = Object.assign({}, Artplayer.DEFAULTS, option);
        verification(_this.option);

        _this.init();

        return _this;
      }

      _createClass(Artplayer, [{
        key: "init",
        value: function init() {
          this.refs = {};
          this.destroyEvents = [];
          this.i18n = new I18n(this);
          this.player = new Player(this);
          this.controls = new Controls(this);
          this.contextmenu = new Contextmenu(this);
          this.danmu = new Danmu(this);
          this.captions = new Captions(this);
          this.info = new Info(this);
          this.events = new Events(this);
          this.hotkey = new Hotkey(this);
          this.id = id++;
          instances.push(this);
          console.log(this);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this.destroyEvents.forEach(function (event) {
            return event.destroy();
          });
          this.refs.container.innerHTML = "";
        }
      }], [{
        key: "version",
        get: function get() {
          return "1.0.0";
        }
      }, {
        key: "DEFAULTS",
        get: function get() {
          return {//
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

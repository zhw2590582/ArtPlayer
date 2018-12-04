(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['artplayer-tool-thumbnail'] = {})));
}(this, (function (exports) { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var objectSpread = _objectSpread;

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

  function errorHandle(condition, msg) {
    if (!condition) {
      throw new Error(msg);
    }
  }

  var ArtplayerToolThumbnail =
  /*#__PURE__*/
  function () {
    function ArtplayerToolThumbnail(option) {
      classCallCheck(this, ArtplayerToolThumbnail);

      if (option.fileInput) {
        errorHandle(option.fileInput.tagName === 'INPUT' && option.fileInput.type === 'file', 'This fileInput is not a file input');
      }

      if (option.videoElement) {
        errorHandle(option.fileInput.tagName === 'VIDEO', 'This videoElement is not a video element');
      }

      if (option.callbackVideoUrl) {
        errorHandle(typeof option.callbackVideoUrl === 'function', 'This callbackVideoUrl is not a function');
      }

      if (option.callbackThumbnailUrl) {
        errorHandle(typeof option.callbackThumbnailUrl === 'function', 'This callbackThumbnailUrl is not a function');
      }

      this.option = option;
      this.init();
    }

    createClass(ArtplayerToolThumbnail, [{
      key: "init",
      value: function init() {
        var _this = this;

        var fileType = ['video/mp4', 'video/ogg', 'video/webm'];
        this.option.fileInput.addEventListener('change', function () {
          var file = _this.option.fileInput.files[0];

          if (file) {
            errorHandle(fileType.includes(file.type), "Only file types are supported: ".concat(fileType.toString()));
            var videoUrl = URL.createObjectURL(file);
            _this.videoUrl = videoUrl;

            if (_this.option.callbackVideoUrl) {
              _this.option.callbackVideoUrl(videoUrl);
            }
          }
        });
      }
    }, {
      key: "setup",
      value: function setup() {
        var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        this.option = objectSpread({}, this.option, option);
      }
    }]);

    return ArtplayerToolThumbnail;
  }();

  window.ArtplayerToolThumbnail = ArtplayerToolThumbnail;

  exports.default = ArtplayerToolThumbnail;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

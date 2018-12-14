(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['artplayer-plugin-flv'] = {})));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function checkSupport(art) {
    var _art$constructor = art.constructor,
        errorHandle = _art$constructor.utils.errorHandle,
        mimeCodec = _art$constructor.config.mimeCodec;
    var $video = art.template.$video;
    var canPlay = $video.canPlayType(mimeCodec.mp4);
    errorHandle(window.MediaSource && window.MediaSource.isTypeSupported(mimeCodec.mp4) && (canPlay === 'probably' || canPlay === 'maybe'), "Unsupported MIME type or codec: ".concat(mimeCodec.mp4));
  }

  var CreatMediaSource = function CreatMediaSource(art) {
    classCallCheck(this, CreatMediaSource);

    this.mediaSource = new MediaSource();
    this.url = URL.createObjectURL(this.mediaSource);
  };

  var Flv = function Flv(art) {
    classCallCheck(this, Flv);

    checkSupport(art);
    this.mediaSource = new CreatMediaSource(art);

    this.load = function (url) {
      console.log(url);
    };
  };

  function artplayerPluginFlv(art) {
    var flv = new Flv(art);
    return {
      load: function load(url) {
        return new Promise(function (resolve) {
          flv.load(url);
          return resolve(flv.mediaSource.url);
        });
      }
    };
  }

  window.artplayerPluginFlv = artplayerPluginFlv;

  exports.default = artplayerPluginFlv;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=artplayer-plugin-flv.js.map

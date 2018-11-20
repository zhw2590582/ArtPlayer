(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['artplayer-plugin-danmu'] = {})));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  var ArtplayerPluginDanmu = function ArtplayerPluginDanmu() {
    classCallCheck(this, ArtplayerPluginDanmu);

    console.log(this);
  };

  window.ArtplayerPluginDanmu = ArtplayerPluginDanmu;

  exports.default = ArtplayerPluginDanmu;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=artplayer-plugin-danmu.js.map

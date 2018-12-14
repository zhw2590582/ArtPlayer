(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global['artplayer-plugin-flv'] = {})));
}(this, (function (exports) { 'use strict';

    function artplayerPluginFlv(art) {
      return {
        load: function load(url) {
          return new Promise(function (resolve) {
            resolve('https://blog.zhw-island.com/assets-cdn/video/one-more-time-one-more-chance-480p.mp4');
          });
        }
      };
    }

    window.artplayerPluginFlv = artplayerPluginFlv;

    exports.default = artplayerPluginFlv;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=artplayer-plugin-flv.js.map

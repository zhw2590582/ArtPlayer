(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global['artplayer-plugin-danmu'] = {})));
}(this, (function (exports) { 'use strict';

    function artplayerPluginDanmu(Artplayer) {
      var art = Artplayer.prototype;
      console.log(art);
    }

    window.artplayerPluginDanmu = artplayerPluginDanmu;

    exports.default = artplayerPluginDanmu;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

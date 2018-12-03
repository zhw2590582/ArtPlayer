(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['artplayer-tool-thumbnail'] = {})));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  var ArtplayerToolThumbnail = function ArtplayerToolThumbnail(el) {
    classCallCheck(this, ArtplayerToolThumbnail);

    this.el = el;
    console.log(this);
  };

  window.ArtplayerToolThumbnail = ArtplayerToolThumbnail;

  exports.default = ArtplayerToolThumbnail;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

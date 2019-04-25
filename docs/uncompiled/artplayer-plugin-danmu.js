(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global['artplayer-plugin-danmu'] = factory());
}(this, function () { 'use strict';

    function artplayerPluginDanmu(art) {
      var layers = art.layers;
      var _art$constructor$util = art.constructor.utils,
          append = _art$constructor$util.append,
          errorHandle = _art$constructor$util.errorHandle,
          setStyles = _art$constructor$util.setStyles;
      var layer = layers.add({
        name: 'danmu',
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }
      });
      var danmuList = [];

      function emit() {
        var $danmu = document.createElement('div');
        $danmu.innerText = '23333';
        setStyles($danmu, {
          'user-select': 'none',
          'position': 'absolute',
          'white-space': 'pre',
          'pointer-events': 'none',
          'perspective': '500px',
          'display': 'inline-block',
          'will-change': 'transform',
          'font-size': '25px',
          'color': 'rgb(254, 241, 2)',
          'font-family': 'SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif',
          'font-weight': 'normal',
          'line-height': '1.125',
          'opacity': '1',
          'text-shadow': 'rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px',
          'left': '638px',
          'top': '0px',
          'transform': 'translateX(-626.14px) translateY(0px) translateZ(0px)',
          'transition': '-webkit-transform 0s linear 0s'
        });
        danmuList.push(append(layer.$ref, $danmu));
      }

      emit({});
      return {
        name: 'artplayerPluginDanmu',
        config: function config(option) {},
        emit: function emit() {}
      };
    }

    window.artplayerPluginDanmu = artplayerPluginDanmu;

    return artplayerPluginDanmu;

}));
//# sourceMappingURL=artplayer-plugin-danmu.js.map

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.artplayerPluginBacklight = factory());
}(this, (function () { 'use strict';

    function matrixCallback(callback) {
      var result = [];
      var x = 10;
      var y = 5;

      for (var xIndex = 0; xIndex < x; xIndex += 1) {
        for (var yIndex = 0; yIndex < y; yIndex += 1) {
          if (xIndex === 0 || xIndex === x - 1 || yIndex === 0 || yIndex === y - 1) {
            result.push(callback(xIndex, yIndex, x, y));
          }
        }
      }

      return result;
    }

    function getColors($canvas, $video, width, height) {
      var ctx = $canvas.getContext('2d');
      $canvas.width = width;
      $canvas.height = height;
      ctx.drawImage($video, 0, 0);
      return matrixCallback(function (xIndex, yIndex, x, y) {
        var itemW = width / x;
        var itemH = height / y;
        var itemX = xIndex * itemW;
        var itemY = yIndex * itemH;

        var _ctx$getImageData = ctx.getImageData(itemX, itemY, itemW, itemH),
            data = _ctx$getImageData.data;

        var r = 0;
        var g = 0;
        var b = 0;

        for (var i = 0, l = data.length; i < l; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        r = Math.floor(r / (data.length / 4));
        g = Math.floor(g / (data.length / 4));
        b = Math.floor(b / (data.length / 4));
        return {
          r: r,
          g: g,
          b: b
        };
      });
    }

    function creatMatrix(parent) {
      return matrixCallback(function (xIndex, yIndex, x, y) {
        var $box = document.createElement('div');
        $box.style.position = 'absolute';
        $box.style.left = "".concat(xIndex * 100 / x, "%");
        $box.style.top = "".concat(yIndex * 100 / y, "%");
        $box.style.width = "".concat(100 / x, "%");
        $box.style.height = "".concat(100 / y, "%");
        $box.style.webkitBorderRadius = '50%';
        $box.style.borderRadius = '50%';
        $box.style.webkitTransition = 'all .2s ease';
        $box.style.transition = 'all .2s ease';
        parent.appendChild($box);
        return {
          $box: $box,
          left: xIndex === 0,
          right: xIndex === x - 1,
          top: yIndex === 0,
          bottom: yIndex === y - 1
        };
      });
    }

    function artplayerPluginBacklight(art) {
      var setStyles = art.constructor.utils.setStyles;
      var _art$template = art.template,
          $player = _art$template.$player,
          $video = _art$template.$video,
          player = art.player;
      var $backlight = document.createElement('div');
      $backlight.classList.add('artplayer-backlight');
      setStyles($backlight, {
        position: 'absolute',
        zIndex: 9,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%'
      });
      var matrix = creatMatrix($backlight);
      var $canvas = document.createElement('canvas');
      $player.insertBefore($backlight, $video);

      (function loop() {
        setTimeout(function () {
          if (player.playing) {
            var clientWidth = $video.clientWidth,
                clientHeight = $video.clientHeight;
            var colors = getColors($canvas, $video, clientWidth, clientHeight);
            colors.forEach(function (_ref, index) {
              var r = _ref.r,
                  g = _ref.g,
                  b = _ref.b;
              var _matrix$index = matrix[index],
                  $box = _matrix$index.$box,
                  left = _matrix$index.left,
                  right = _matrix$index.right,
                  top = _matrix$index.top,
                  bottom = _matrix$index.bottom; // eslint-disable-next-line no-nested-ternary

              var x = left ? '-64px' : right ? '64px' : '0'; // eslint-disable-next-line no-nested-ternary

              var y = top ? '-64px' : bottom ? '64px' : '0';
              $box.style.webkitBoxShadow = "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ") ").concat(x, " ").concat(y, " 128px");
              $box.style.boxShadow = "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ") ").concat(x, " ").concat(y, " 128px");
            });
          }

          if (!art.isDestroy) {
            loop();
          }
        }, 200);
      })();

      return {
        name: 'artplayerPluginBacklight'
      };
    }

    return artplayerPluginBacklight;

})));
//# sourceMappingURL=artplayer-plugin-backlight.js.map

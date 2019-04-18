(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global['artplayer-plugin-backlight'] = factory());
}(this, function () { 'use strict';

    function getAverageColor(img, left, top, width, height) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, -left, -top);
      var imageData = ctx.getImageData(0, 0, width, height);
      var data = imageData.data;
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
    }

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

    function getColors($img, width, height) {
      return matrixCallback(function (xIndex, yIndex, x, y) {
        return getAverageColor($img, xIndex * width / x, yIndex * height / y, width / x, height / y);
      });
    }

    function creatMatrix(parent, width, height) {
      return matrixCallback(function (xIndex, yIndex, x, y) {
        var $box = document.createElement('div');
        $box.style.position = 'absolute';
        $box.style.left = "".concat(xIndex * width / x, "px");
        $box.style.top = "".concat(yIndex * height / y, "px");
        $box.style.width = "".concat(100 / x, "%");
        $box.style.height = "".concat(100 / y, "%");
        $box.style['-webkit-transition'] = 'all .2s ease';
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
      $player.insertBefore($backlight, $video);
      art.on('firstCanplay', function () {
        var clientWidth = $video.clientWidth,
            clientHeight = $video.clientHeight;
        var matrix = creatMatrix($backlight, clientWidth, clientHeight);
        art.on('video:timeupdate', function () {
          var dataUri = player.getScreenshotDataURL();
          var $img = document.createElement('img');

          $img.onload = function () {
            var colors = getColors($img, clientWidth, clientHeight);
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

              var x = left ? '-60px' : right ? '60px' : '0'; // eslint-disable-next-line no-nested-ternary

              var y = top ? '-60px' : bottom ? '60px' : '0';
              $box.style['-webkit-box-shadow'] = "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ") ").concat(x, " ").concat(y, " 120px");
              $box.style.boxShadow = "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ") ").concat(x, " ").concat(y, " 120px");
            });
          };

          $img.src = dataUri;
        });
      });
      return {
        name: 'artplayerPluginBacklight'
      };
    }

    window.artplayerPluginBacklight = artplayerPluginBacklight;

    return artplayerPluginBacklight;

}));
//# sourceMappingURL=artplayer-plugin-backlight.js.map

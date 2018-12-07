(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global['artplayer-plugin-gif'] = {})));
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

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var gifshot = createCommonjsModule(function (module, exports) {

    (function (window, document, navigator, undefined) {
      /*
        utils.js
        ========
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */

      var utils = {
        URL: window.URL || window.webkitURL || window.mozURL || window.msURL,
        getUserMedia: function () {
          var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
          return getUserMedia ? getUserMedia.bind(navigator) : getUserMedia;
        }(),
        requestAnimFrame: window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame,
        requestTimeout: function requestTimeout(callback, delay) {
          callback = callback || utils.noop;
          delay = delay || 0;

          if (!utils.requestAnimFrame) {
            return setTimeout(callback, delay);
          }

          var start = new Date().getTime();
          var handle = new Object();
          var requestAnimFrame = utils.requestAnimFrame;

          var loop = function loop() {
            var current = new Date().getTime();
            var delta = current - start;
            delta >= delay ? callback.call() : handle.value = requestAnimFrame(loop);
          };

          handle.value = requestAnimFrame(loop);
          return handle;
        },
        Blob: window.Blob || window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder,
        btoa: function () {
          var btoa = window.btoa || function (input) {
            var output = '';
            var i = 0;
            var l = input.length;
            var key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var chr1 = void 0;
            var chr2 = void 0;
            var chr3 = void 0;
            var enc1 = void 0;
            var enc2 = void 0;
            var enc3 = void 0;
            var enc4 = void 0;

            while (i < l) {
              chr1 = input.charCodeAt(i++);
              chr2 = input.charCodeAt(i++);
              chr3 = input.charCodeAt(i++);
              enc1 = chr1 >> 2;
              enc2 = (chr1 & 3) << 4 | chr2 >> 4;
              enc3 = (chr2 & 15) << 2 | chr3 >> 6;
              enc4 = chr3 & 63;

              if (isNaN(chr2)) {
                enc3 = enc4 = 64;
              } else if (isNaN(chr3)) {
                enc4 = 64;
              }

              output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
            }

            return output;
          };

          return btoa ? btoa.bind(window) : utils.noop;
        }(),
        isObject: function isObject(obj) {
          return obj && Object.prototype.toString.call(obj) === '[object Object]';
        },
        isEmptyObject: function isEmptyObject(obj) {
          return utils.isObject(obj) && !Object.keys(obj).length;
        },
        isArray: function isArray(arr) {
          return arr && Array.isArray(arr);
        },
        isFunction: function isFunction(func) {
          return func && typeof func === 'function';
        },
        isElement: function isElement(elem) {
          return elem && elem.nodeType === 1;
        },
        isString: function isString(value) {
          return typeof value === 'string' || Object.prototype.toString.call(value) === '[object String]';
        },
        isSupported: {
          canvas: function canvas() {
            var el = document.createElement('canvas');
            return el && el.getContext && el.getContext('2d');
          },
          webworkers: function webworkers() {
            return window.Worker;
          },
          blob: function blob() {
            return utils.Blob;
          },
          Uint8Array: function Uint8Array() {
            return window.Uint8Array;
          },
          Uint32Array: function Uint32Array() {
            return window.Uint32Array;
          },
          videoCodecs: function () {
            var testEl = document.createElement('video');
            var supportObj = {
              'mp4': false,
              'h264': false,
              'ogv': false,
              'ogg': false,
              'webm': false
            };

            try {
              if (testEl && testEl.canPlayType) {
                // Check for MPEG-4 support
                supportObj.mp4 = testEl.canPlayType('video/mp4; codecs="mp4v.20.8"') !== ''; // Check for h264 support

                supportObj.h264 = (testEl.canPlayType('video/mp4; codecs="avc1.42E01E"') || testEl.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) !== ''; // Check for Ogv support

                supportObj.ogv = testEl.canPlayType('video/ogg; codecs="theora"') !== ''; // Check for Ogg support

                supportObj.ogg = testEl.canPlayType('video/ogg; codecs="theora"') !== ''; // Check for Webm support

                supportObj.webm = testEl.canPlayType('video/webm; codecs="vp8, vorbis"') !== -1;
              }
            } catch (e) {}

            return supportObj;
          }()
        },
        noop: function noop() {},
        each: function each(collection, callback) {
          var x = void 0;
          var len = void 0;

          if (utils.isArray(collection)) {
            x = -1;
            len = collection.length;

            while (++x < len) {
              if (callback(x, collection[x]) === false) {
                break;
              }
            }
          } else if (utils.isObject(collection)) {
            for (x in collection) {
              if (collection.hasOwnProperty(x)) {
                if (callback(x, collection[x]) === false) {
                  break;
                }
              }
            }
          }
        },
        mergeOptions: function mergeOptions(defaultOptions, userOptions) {
          if (!utils.isObject(defaultOptions) || !utils.isObject(userOptions) || !Object.keys) {
            return;
          }

          var newObj = {};
          utils.each(defaultOptions, function (key, val) {
            newObj[key] = defaultOptions[key];
          });
          utils.each(userOptions, function (key, val) {
            var currentUserOption = userOptions[key];

            if (!utils.isObject(currentUserOption)) {
              newObj[key] = currentUserOption;
            } else {
              if (!defaultOptions[key]) {
                newObj[key] = currentUserOption;
              } else {
                newObj[key] = utils.mergeOptions(defaultOptions[key], currentUserOption);
              }
            }
          });
          return newObj;
        },
        setCSSAttr: function setCSSAttr(elem, attr, val) {
          if (!utils.isElement(elem)) {
            return;
          }

          if (utils.isString(attr) && utils.isString(val)) {
            elem.style[attr] = val;
          } else if (utils.isObject(attr)) {
            utils.each(attr, function (key, val) {
              elem.style[key] = val;
            });
          }
        },
        removeElement: function removeElement(node) {
          if (!utils.isElement(node)) {
            return;
          }

          if (node.parentNode) {
            node.parentNode.removeChild(node);
          }
        },
        createWebWorker: function createWebWorker(content) {
          if (!utils.isString(content)) {
            return {};
          }

          try {
            var blob = new utils.Blob([content], {
              'type': 'text/javascript'
            });
            var objectUrl = utils.URL.createObjectURL(blob);
            var worker = new Worker(objectUrl);
            return {
              'objectUrl': objectUrl,
              'worker': worker
            };
          } catch (e) {
            return '' + e;
          }
        },
        getExtension: function getExtension(src) {
          return src.substr(src.lastIndexOf('.') + 1, src.length);
        },
        getFontSize: function getFontSize() {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          if (!document.body || options.resizeFont === false) {
            return options.fontSize;
          }

          var text = options.text;
          var containerWidth = options.gifWidth;
          var fontSize = parseInt(options.fontSize, 10);
          var minFontSize = parseInt(options.minFontSize, 10);
          var div = document.createElement('div');
          var span = document.createElement('span');
          div.setAttribute('width', containerWidth);
          div.appendChild(span);
          span.innerHTML = text;
          span.style.fontSize = fontSize + 'px';
          span.style.textIndent = '-9999px';
          span.style.visibility = 'hidden';
          document.body.appendChild(span);

          while (span.offsetWidth > containerWidth && fontSize >= minFontSize) {
            span.style.fontSize = --fontSize + 'px';
          }

          document.body.removeChild(span);
          return fontSize + 'px';
        },
        webWorkerError: false
      };
      var utils$2 = Object.freeze({
        default: utils
      });
      /*
        error.js
        ========
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Dependencies

      var error = {
        validate: function validate(skipObj) {
          skipObj = utils.isObject(skipObj) ? skipObj : {};
          var errorObj = {};
          utils.each(error.validators, function (indece, currentValidator) {
            var errorCode = currentValidator.errorCode;

            if (!skipObj[errorCode] && !currentValidator.condition) {
              errorObj = currentValidator;
              errorObj.error = true;
              return false;
            }
          });
          delete errorObj.condition;
          return errorObj;
        },
        isValid: function isValid(skipObj) {
          var errorObj = error.validate(skipObj);
          var isValid = errorObj.error !== true ? true : false;
          return isValid;
        },
        validators: [{
          condition: utils.isFunction(utils.getUserMedia),
          errorCode: 'getUserMedia',
          errorMsg: 'The getUserMedia API is not supported in your browser'
        }, {
          condition: utils.isSupported.canvas(),
          errorCode: 'canvas',
          errorMsg: 'Canvas elements are not supported in your browser'
        }, {
          condition: utils.isSupported.webworkers(),
          errorCode: 'webworkers',
          errorMsg: 'The Web Workers API is not supported in your browser'
        }, {
          condition: utils.isFunction(utils.URL),
          errorCode: 'window.URL',
          errorMsg: 'The window.URL API is not supported in your browser'
        }, {
          condition: utils.isSupported.blob(),
          errorCode: 'window.Blob',
          errorMsg: 'The window.Blob File API is not supported in your browser'
        }, {
          condition: utils.isSupported.Uint8Array(),
          errorCode: 'window.Uint8Array',
          errorMsg: 'The window.Uint8Array function constructor is not supported in your browser'
        }, {
          condition: utils.isSupported.Uint32Array(),
          errorCode: 'window.Uint32Array',
          errorMsg: 'The window.Uint32Array function constructor is not supported in your browser'
        }],
        messages: {
          videoCodecs: {
            errorCode: 'videocodec',
            errorMsg: 'The video codec you are trying to use is not supported in your browser'
          }
        }
      };
      var error$2 = Object.freeze({
        default: error
      });
      /*
        defaultOptions.js
        =================
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Helpers

      var noop = function noop() {};

      var defaultOptions = {
        sampleInterval: 10,
        numWorkers: 2,
        filter: '',
        gifWidth: 200,
        gifHeight: 200,
        interval: 0.1,
        numFrames: 10,
        frameDuration: 1,
        keepCameraOn: false,
        images: [],
        video: null,
        webcamVideoElement: null,
        cameraStream: null,
        text: '',
        fontWeight: 'normal',
        fontSize: '16px',
        minFontSize: '10px',
        resizeFont: false,
        fontFamily: 'sans-serif',
        fontColor: '#ffffff',
        textAlign: 'center',
        textBaseline: 'bottom',
        textXCoordinate: null,
        textYCoordinate: null,
        progressCallback: noop,
        completeCallback: noop,
        saveRenderingContexts: false,
        savedRenderingContexts: [],
        crossOrigin: 'Anonymous'
      };
      var defaultOptions$2 = Object.freeze({
        default: defaultOptions
      });
      /*
        isSupported.js
        ==============
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Dependencies

      function isSupported() {
        return error.isValid();
      }
      /*
        isWebCamGIFSupported.js
        =======================
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */


      function isWebCamGIFSupported() {
        return error.isValid();
      }
      /*
        isSupported.js
        ==============
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Dependencies


      function isSupported$1() {
        var options = {
          getUserMedia: true
        };
        return error.isValid(options);
      }
      /*
        isExistingVideoGIFSupported.js
        ==============================
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Dependencies


      function isExistingVideoGIFSupported(codecs) {
        var hasValidCodec = false;

        if (utils.isArray(codecs) && codecs.length) {
          utils.each(codecs, function (indece, currentCodec) {
            if (utils.isSupported.videoCodecs[currentCodec]) {
              hasValidCodec = true;
            }
          });

          if (!hasValidCodec) {
            return false;
          }
        } else if (utils.isString(codecs) && codecs.length) {
          if (!utils.isSupported.videoCodecs[codecs]) {
            return false;
          }
        }

        return error.isValid({
          'getUserMedia': true
        });
      }
      /*
        NeuQuant.js
        ===========
      */

      /*
       * NeuQuant Neural-Net Quantization Algorithm
       * ------------------------------------------
       *
       * Copyright (c) 1994 Anthony Dekker
       *
       * NEUQUANT Neural-Net quantization algorithm by Anthony Dekker, 1994. See
       * "Kohonen neural networks for optimal colour quantization" in "Network:
       * Computation in Neural Systems" Vol. 5 (1994) pp 351-367. for a discussion of
       * the algorithm.
       *
       * Any party obtaining a copy of these files from the author, directly or
       * indirectly, is granted, free of charge, a full and unrestricted irrevocable,
       * world-wide, paid up, royalty-free, nonexclusive right and license to deal in
       * this software and documentation files (the "Software"), including without
       * limitation the rights to use, copy, modify, merge, publish, distribute,
       * sublicense, and/or sell copies of the Software, and to permit persons who
       * receive copies from any such party to do so, with the only requirement being
       * that this copyright notice remain intact.
       */

      /*
       * This class handles Neural-Net quantization algorithm
       * @author Kevin Weiner (original Java version - kweiner@fmsware.com)
       * @author Thibault Imbert (AS3 version - bytearray.org)
       * @version 0.1 AS3 implementation
       * @version 0.2 JS->AS3 "translation" by antimatter15
       * @version 0.3 JS clean up + using modern JS idioms by sole - http://soledadpenades.com
       * Also implement fix in color conversion described at http://stackoverflow.com/questions/16371712/neuquant-js-javascript-color-quantization-hidden-bug-in-js-conversion
       */


      function NeuQuant() {
        var netsize = 256; // number of colours used
        // four primes near 500 - assume no image has a length so large
        // that it is divisible by all four primes

        var prime1 = 499;
        var prime2 = 491;
        var prime3 = 487;
        var prime4 = 503; // minimum size for input image

        var minpicturebytes = 3 * prime4; // Network Definitions

        var maxnetpos = netsize - 1;
        var netbiasshift = 4; // bias for colour values

        var ncycles = 100; // no. of learning cycles
        // defs for freq and bias

        var intbiasshift = 16; // bias for fractions

        var intbias = 1 << intbiasshift;
        var gammashift = 10; // gamma = 1024
        var betashift = 10;
        var beta = intbias >> betashift; // beta = 1/1024

        var betagamma = intbias << gammashift - betashift; // defs for decreasing radius factor
        // For 256 colors, radius starts at 32.0 biased by 6 bits
        // and decreases by a factor of 1/30 each cycle

        var initrad = netsize >> 3;
        var radiusbiasshift = 6;
        var radiusbias = 1 << radiusbiasshift;
        var initradius = initrad * radiusbias;
        var radiusdec = 30; // defs for decreasing alpha factor
        // Alpha starts at 1.0 biased by 10 bits

        var alphabiasshift = 10;
        var initalpha = 1 << alphabiasshift;
        var alphadec; // radbias and alpharadbias used for radpower calculation

        var radbiasshift = 8;
        var radbias = 1 << radbiasshift;
        var alpharadbshift = alphabiasshift + radbiasshift;
        var alpharadbias = 1 << alpharadbshift; // Input image

        var thepicture; // Height * Width * 3

        var lengthcount; // Sampling factor 1..30

        var samplefac; // The network itself

        var network;
        var netindex = []; // for network lookup - really 256

        var bias = []; // bias and freq arrays for learning

        var freq = [];
        var radpower = [];

        function NeuQuantConstructor(thepic, len, sample) {
          var i;
          var p;
          thepicture = thepic;
          lengthcount = len;
          samplefac = sample;
          network = new Array(netsize);

          for (i = 0; i < netsize; i++) {
            network[i] = new Array(4);
            p = network[i];
            p[0] = p[1] = p[2] = (i << netbiasshift + 8) / netsize | 0;
            freq[i] = intbias / netsize | 0; // 1 / netsize

            bias[i] = 0;
          }
        }

        function colorMap() {
          var map = [];
          var index = new Array(netsize);

          for (var i = 0; i < netsize; i++) {
            index[network[i][3]] = i;
          }

          var k = 0;

          for (var l = 0; l < netsize; l++) {
            var j = index[l];
            map[k++] = network[j][0];
            map[k++] = network[j][1];
            map[k++] = network[j][2];
          }

          return map;
        } // Insertion sort of network and building of netindex[0..255]
        // (to do after unbias)


        function inxbuild() {
          var i;
          var j;
          var smallpos;
          var smallval;
          var p;
          var q;
          var previouscol;
          var startpos;
          previouscol = 0;
          startpos = 0;

          for (i = 0; i < netsize; i++) {
            p = network[i];
            smallpos = i;
            smallval = p[1]; // index on g
            // find smallest in i..netsize-1

            for (j = i + 1; j < netsize; j++) {
              q = network[j];

              if (q[1] < smallval) {
                // index on g
                smallpos = j;
                smallval = q[1]; // index on g
              }
            }

            q = network[smallpos]; // swap p (i) and q (smallpos) entries

            if (i != smallpos) {
              j = q[0];
              q[0] = p[0];
              p[0] = j;
              j = q[1];
              q[1] = p[1];
              p[1] = j;
              j = q[2];
              q[2] = p[2];
              p[2] = j;
              j = q[3];
              q[3] = p[3];
              p[3] = j;
            } // smallval entry is now in position i


            if (smallval != previouscol) {
              netindex[previouscol] = startpos + i >> 1;

              for (j = previouscol + 1; j < smallval; j++) {
                netindex[j] = i;
              }

              previouscol = smallval;
              startpos = i;
            }
          }

          netindex[previouscol] = startpos + maxnetpos >> 1;

          for (j = previouscol + 1; j < 256; j++) {
            netindex[j] = maxnetpos; // really 256
          }
        } // Main Learning Loop


        function learn() {
          var i;
          var j;
          var b;
          var g;
          var r;
          var radius;
          var rad;
          var alpha;
          var step;
          var delta;
          var samplepixels;
          var p;
          var pix;
          var lim;

          if (lengthcount < minpicturebytes) {
            samplefac = 1;
          }

          alphadec = 30 + (samplefac - 1) / 3;
          p = thepicture;
          pix = 0;
          lim = lengthcount;
          samplepixels = lengthcount / (3 * samplefac);
          delta = samplepixels / ncycles | 0;
          alpha = initalpha;
          radius = initradius;
          rad = radius >> radiusbiasshift;

          if (rad <= 1) {
            rad = 0;
          }

          for (i = 0; i < rad; i++) {
            radpower[i] = alpha * ((rad * rad - i * i) * radbias / (rad * rad));
          }

          if (lengthcount < minpicturebytes) {
            step = 3;
          } else if (lengthcount % prime1 !== 0) {
            step = 3 * prime1;
          } else {
            if (lengthcount % prime2 !== 0) {
              step = 3 * prime2;
            } else {
              if (lengthcount % prime3 !== 0) {
                step = 3 * prime3;
              } else {
                step = 3 * prime4;
              }
            }
          }

          i = 0;

          while (i < samplepixels) {
            b = (p[pix + 0] & 0xff) << netbiasshift;
            g = (p[pix + 1] & 0xff) << netbiasshift;
            r = (p[pix + 2] & 0xff) << netbiasshift;
            j = contest(b, g, r);
            altersingle(alpha, j, b, g, r);

            if (rad !== 0) {
              // Alter neighbours
              alterneigh(rad, j, b, g, r);
            }

            pix += step;

            if (pix >= lim) {
              pix -= lengthcount;
            }

            i++;

            if (delta === 0) {
              delta = 1;
            }

            if (i % delta === 0) {
              alpha -= alpha / alphadec;
              radius -= radius / radiusdec;
              rad = radius >> radiusbiasshift;

              if (rad <= 1) {
                rad = 0;
              }

              for (j = 0; j < rad; j++) {
                radpower[j] = alpha * ((rad * rad - j * j) * radbias / (rad * rad));
              }
            }
          }
        } // Search for BGR values 0..255 (after net is unbiased) and return colour index


        function map(b, g, r) {
          var i;
          var j;
          var dist;
          var a;
          var bestd;
          var p;
          var best; // Biggest possible distance is 256 * 3

          bestd = 1000;
          best = -1;
          i = netindex[g]; // index on g

          j = i - 1; // start at netindex[g] and work outwards

          while (i < netsize || j >= 0) {
            if (i < netsize) {
              p = network[i];
              dist = p[1] - g; // inx key

              if (dist >= bestd) {
                i = netsize; // stop iter
              } else {
                i++;

                if (dist < 0) {
                  dist = -dist;
                }

                a = p[0] - b;

                if (a < 0) {
                  a = -a;
                }

                dist += a;

                if (dist < bestd) {
                  a = p[2] - r;

                  if (a < 0) {
                    a = -a;
                  }

                  dist += a;

                  if (dist < bestd) {
                    bestd = dist;
                    best = p[3];
                  }
                }
              }
            }

            if (j >= 0) {
              p = network[j];
              dist = g - p[1]; // inx key - reverse dif

              if (dist >= bestd) {
                j = -1; // stop iter
              } else {
                j--;

                if (dist < 0) {
                  dist = -dist;
                }

                a = p[0] - b;

                if (a < 0) {
                  a = -a;
                }

                dist += a;

                if (dist < bestd) {
                  a = p[2] - r;

                  if (a < 0) {
                    a = -a;
                  }

                  dist += a;

                  if (dist < bestd) {
                    bestd = dist;
                    best = p[3];
                  }
                }
              }
            }
          }

          return best;
        }

        function process() {
          learn();
          unbiasnet();
          inxbuild();
          return colorMap();
        } // Unbias network to give byte values 0..255 and record position i
        // to prepare for sort


        function unbiasnet() {
          var i;

          for (i = 0; i < netsize; i++) {
            network[i][0] >>= netbiasshift;
            network[i][1] >>= netbiasshift;
            network[i][2] >>= netbiasshift;
            network[i][3] = i; // record colour no
          }
        } // Move adjacent neurons by precomputed alpha*(1-((i-j)^2/[r]^2))
        // in radpower[|i-j|]


        function alterneigh(rad, i, b, g, r) {
          var j;
          var k;
          var lo;
          var hi;
          var a;
          var m;
          var p;
          lo = i - rad;

          if (lo < -1) {
            lo = -1;
          }

          hi = i + rad;

          if (hi > netsize) {
            hi = netsize;
          }

          j = i + 1;
          k = i - 1;
          m = 1;

          while (j < hi || k > lo) {
            a = radpower[m++];

            if (j < hi) {
              p = network[j++];

              try {
                p[0] -= a * (p[0] - b) / alpharadbias | 0;
                p[1] -= a * (p[1] - g) / alpharadbias | 0;
                p[2] -= a * (p[2] - r) / alpharadbias | 0;
              } catch (e) {}
            }

            if (k > lo) {
              p = network[k--];

              try {
                p[0] -= a * (p[0] - b) / alpharadbias | 0;
                p[1] -= a * (p[1] - g) / alpharadbias | 0;
                p[2] -= a * (p[2] - r) / alpharadbias | 0;
              } catch (e) {}
            }
          }
        } // Move neuron i towards biased (b,g,r) by factor alpha


        function altersingle(alpha, i, b, g, r) {
          // alter hit neuron
          var n = network[i];
          var alphaMult = alpha / initalpha;
          n[0] -= alphaMult * (n[0] - b) | 0;
          n[1] -= alphaMult * (n[1] - g) | 0;
          n[2] -= alphaMult * (n[2] - r) | 0;
        } // Search for biased BGR values


        function contest(b, g, r) {
          // finds closest neuron (min dist) and updates freq
          // finds best neuron (min dist-bias) and returns position
          // for frequently chosen neurons, freq[i] is high and bias[i] is negative
          // bias[i] = gamma*((1/netsize)-freq[i])
          var i;
          var dist;
          var a;
          var biasdist;
          var betafreq;
          var bestpos;
          var bestbiaspos;
          var bestd;
          var bestbiasd;
          var n;
          bestd = ~(1 << 31);
          bestbiasd = bestd;
          bestpos = -1;
          bestbiaspos = bestpos;

          for (i = 0; i < netsize; i++) {
            n = network[i];
            dist = n[0] - b;

            if (dist < 0) {
              dist = -dist;
            }

            a = n[1] - g;

            if (a < 0) {
              a = -a;
            }

            dist += a;
            a = n[2] - r;

            if (a < 0) {
              a = -a;
            }

            dist += a;

            if (dist < bestd) {
              bestd = dist;
              bestpos = i;
            }

            biasdist = dist - (bias[i] >> intbiasshift - netbiasshift);

            if (biasdist < bestbiasd) {
              bestbiasd = biasdist;
              bestbiaspos = i;
            }

            betafreq = freq[i] >> betashift;
            freq[i] -= betafreq;
            bias[i] += betafreq << gammashift;
          }

          freq[bestpos] += beta;
          bias[bestpos] -= betagamma;
          return bestbiaspos;
        }

        NeuQuantConstructor.apply(this, arguments);
        var exports = {};
        exports.map = map;
        exports.process = process;
        return exports;
      }
      /*
        processFrameWorker.js
        =====================
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */


      function workerCode() {
        var self = this;

        try {
          self.onmessage = function (ev) {
            var data = ev.data || {};
            var response;

            if (data.gifshot) {
              response = workerMethods.run(data);
              postMessage(response);
            }
          };
        } catch (e) {}

        var workerMethods = {
          dataToRGB: function dataToRGB(data, width, height) {
            var length = width * height * 4;
            var i = 0;
            var rgb = [];

            while (i < length) {
              rgb.push(data[i++]);
              rgb.push(data[i++]);
              rgb.push(data[i++]);
              i++; // for the alpha channel which we don't care about
            }

            return rgb;
          },
          componentizedPaletteToArray: function componentizedPaletteToArray(paletteRGB) {
            paletteRGB = paletteRGB || [];
            var paletteArray = [];

            for (var i = 0; i < paletteRGB.length; i += 3) {
              var r = paletteRGB[i];
              var g = paletteRGB[i + 1];
              var b = paletteRGB[i + 2];
              paletteArray.push(r << 16 | g << 8 | b);
            }

            return paletteArray;
          },
          // This is the "traditional" Animated_GIF style of going from RGBA to indexed color frames
          'processFrameWithQuantizer': function processFrameWithQuantizer(imageData, width, height, sampleInterval) {
            var rgbComponents = this.dataToRGB(imageData, width, height);
            var nq = new NeuQuant(rgbComponents, rgbComponents.length, sampleInterval);
            var paletteRGB = nq.process();
            var paletteArray = new Uint32Array(this.componentizedPaletteToArray(paletteRGB));
            var numberPixels = width * height;
            var indexedPixels = new Uint8Array(numberPixels);
            var k = 0;

            for (var i = 0; i < numberPixels; i++) {
              var r = rgbComponents[k++];
              var g = rgbComponents[k++];
              var b = rgbComponents[k++];
              indexedPixels[i] = nq.map(r, g, b);
            }

            return {
              pixels: indexedPixels,
              palette: paletteArray
            };
          },
          'run': function run(frame) {
            frame = frame || {};
            var _frame = frame,
                height = _frame.height,
                palette = _frame.palette,
                sampleInterval = _frame.sampleInterval,
                width = _frame.width;
            var imageData = frame.data;
            return this.processFrameWithQuantizer(imageData, width, height, sampleInterval);
          }
        };
        return workerMethods;
      }
      /*
        gifWriter.js
        ============
      */
      // (c) Dean McNamee <dean@gmail.com>, 2013.
      //
      // https://github.com/deanm/omggif
      //
      // Permission is hereby granted, free of charge, to any person obtaining a copy
      // of this software and associated documentation files (the "Software"), to
      // deal in the Software without restriction, including without limitation the
      // rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
      // sell copies of the Software, and to permit persons to whom the Software is
      // furnished to do so, subject to the following conditions:
      //
      // The above copyright notice and this permission notice shall be included in
      // all copies or substantial portions of the Software.
      //
      // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
      // FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
      // IN THE SOFTWARE.
      //
      // omggif is a JavaScript implementation of a GIF 89a encoder and decoder,
      // including animation and compression.  It does not rely on any specific
      // underlying system, so should run in the browser, Node, or Plask.


      function gifWriter(buf, width, height, gopts) {
        var p = 0;
        gopts = gopts === undefined ? {} : gopts;
        var loop_count = gopts.loop === undefined ? null : gopts.loop;
        var global_palette = gopts.palette === undefined ? null : gopts.palette;
        if (width <= 0 || height <= 0 || width > 65535 || height > 65535) throw "Width/Height invalid.";

        function check_palette_and_num_colors(palette) {
          var num_colors = palette.length;
          if (num_colors < 2 || num_colors > 256 || num_colors & num_colors - 1) throw "Invalid code/color length, must be power of 2 and 2 .. 256.";
          return num_colors;
        } // - Header.


        buf[p++] = 0x47;
        buf[p++] = 0x49;
        buf[p++] = 0x46; // GIF

        buf[p++] = 0x38;
        buf[p++] = 0x39;
        buf[p++] = 0x61; // 89a
        // Handling of Global Color Table (palette) and background index.

        var gp_num_colors_pow2 = 0;
        var background = 0; // - Logical Screen Descriptor.
        // NOTE(deanm): w/h apparently ignored by implementations, but set anyway.

        buf[p++] = width & 0xff;
        buf[p++] = width >> 8 & 0xff;
        buf[p++] = height & 0xff;
        buf[p++] = height >> 8 & 0xff; // NOTE: Indicates 0-bpp original color resolution (unused?).

        buf[p++] = (global_palette !== null ? 0x80 : 0) | // Global Color Table Flag.
        gp_num_colors_pow2; // NOTE: No sort flag (unused?).

        buf[p++] = background; // Background Color Index.

        buf[p++] = 0; // Pixel aspect ratio (unused?).

        if (loop_count !== null) {
          // Netscape block for looping.
          if (loop_count < 0 || loop_count > 65535) throw "Loop count invalid."; // Extension code, label, and length.

          buf[p++] = 0x21;
          buf[p++] = 0xff;
          buf[p++] = 0x0b; // NETSCAPE2.0

          buf[p++] = 0x4e;
          buf[p++] = 0x45;
          buf[p++] = 0x54;
          buf[p++] = 0x53;
          buf[p++] = 0x43;
          buf[p++] = 0x41;
          buf[p++] = 0x50;
          buf[p++] = 0x45;
          buf[p++] = 0x32;
          buf[p++] = 0x2e;
          buf[p++] = 0x30; // Sub-block

          buf[p++] = 0x03;
          buf[p++] = 0x01;
          buf[p++] = loop_count & 0xff;
          buf[p++] = loop_count >> 8 & 0xff;
          buf[p++] = 0x00; // Terminator.
        }

        var ended = false;

        this.addFrame = function (x, y, w, h, indexed_pixels, opts) {
          if (ended === true) {
            --p;
            ended = false;
          } // Un-end.


          opts = opts === undefined ? {} : opts; // TODO(deanm): Bounds check x, y.  Do they need to be within the virtual
          // canvas width/height, I imagine?

          if (x < 0 || y < 0 || x > 65535 || y > 65535) throw "x/y invalid.";
          if (w <= 0 || h <= 0 || w > 65535 || h > 65535) throw "Width/Height invalid.";
          if (indexed_pixels.length < w * h) throw "Not enough pixels for the frame size.";
          var using_local_palette = true;
          var palette = opts.palette;

          if (palette === undefined || palette === null) {
            using_local_palette = false;
            palette = global_palette;
          }

          if (palette === undefined || palette === null) throw "Must supply either a local or global palette.";
          var num_colors = check_palette_and_num_colors(palette); // Compute the min_code_size (power of 2), destroying num_colors.

          var min_code_size = 0;

          while (num_colors >>= 1) {
            ++min_code_size;
          }

          num_colors = 1 << min_code_size; // Now we can easily get it back.

          var delay = opts.delay === undefined ? 0 : opts.delay; // From the spec:
          //     0 -   No disposal specified. The decoder is
          //           not required to take any action.
          //     1 -   Do not dispose. The graphic is to be left
          //           in place.
          //     2 -   Restore to background color. The area used by the
          //           graphic must be restored to the background color.
          //     3 -   Restore to previous. The decoder is required to
          //           restore the area overwritten by the graphic with
          //           what was there prior to rendering the graphic.
          //  4-7 -    To be defined.
          // NOTE(deanm): Dispose background doesn't really work, apparently most
          // browsers ignore the background palette index and clear to transparency.

          var disposal = opts.disposal === undefined ? 0 : opts.disposal;
          if (disposal < 0 || disposal > 3) // 4-7 is reserved.
            throw "Disposal out of range.";
          var use_transparency = false;
          var transparent_index = 0;

          if (opts.transparent !== undefined && opts.transparent !== null) {
            use_transparency = true;
            transparent_index = opts.transparent;
            if (transparent_index < 0 || transparent_index >= num_colors) throw "Transparent color index.";
          }

          if (disposal !== 0 || use_transparency || delay !== 0) {
            // - Graphics Control Extension
            buf[p++] = 0x21;
            buf[p++] = 0xf9; // Extension / Label.

            buf[p++] = 4; // Byte size.

            buf[p++] = disposal << 2 | (use_transparency === true ? 1 : 0);
            buf[p++] = delay & 0xff;
            buf[p++] = delay >> 8 & 0xff;
            buf[p++] = transparent_index; // Transparent color index.

            buf[p++] = 0; // Block Terminator.
          } // - Image Descriptor


          buf[p++] = 0x2c; // Image Seperator.

          buf[p++] = x & 0xff;
          buf[p++] = x >> 8 & 0xff; // Left.

          buf[p++] = y & 0xff;
          buf[p++] = y >> 8 & 0xff; // Top.

          buf[p++] = w & 0xff;
          buf[p++] = w >> 8 & 0xff;
          buf[p++] = h & 0xff;
          buf[p++] = h >> 8 & 0xff; // NOTE: No sort flag (unused?).
          // TODO(deanm): Support interlace.

          buf[p++] = using_local_palette === true ? 0x80 | min_code_size - 1 : 0; // - Local Color Table

          if (using_local_palette === true) {
            for (var i = 0, il = palette.length; i < il; ++i) {
              var rgb = palette[i];
              buf[p++] = rgb >> 16 & 0xff;
              buf[p++] = rgb >> 8 & 0xff;
              buf[p++] = rgb & 0xff;
            }
          }

          p = GifWriterOutputLZWCodeStream(buf, p, min_code_size < 2 ? 2 : min_code_size, indexed_pixels);
        };

        this.end = function () {
          if (ended === false) {
            buf[p++] = 0x3b; // Trailer.

            ended = true;
          }

          return p;
        }; // Main compression routine, palette indexes -> LZW code stream.
        // |index_stream| must have at least one entry.


        function GifWriterOutputLZWCodeStream(buf, p, min_code_size, index_stream) {
          buf[p++] = min_code_size;
          var cur_subblock = p++; // Pointing at the length field.

          var clear_code = 1 << min_code_size;
          var code_mask = clear_code - 1;
          var eoi_code = clear_code + 1;
          var next_code = eoi_code + 1;
          var cur_code_size = min_code_size + 1; // Number of bits per code.

          var cur_shift = 0; // We have at most 12-bit codes, so we should have to hold a max of 19
          // bits here (and then we would write out).

          var cur = 0;

          function emit_bytes_to_buffer(bit_block_size) {
            while (cur_shift >= bit_block_size) {
              buf[p++] = cur & 0xff;
              cur >>= 8;
              cur_shift -= 8;

              if (p === cur_subblock + 256) {
                // Finished a subblock.
                buf[cur_subblock] = 255;
                cur_subblock = p++;
              }
            }
          }

          function emit_code(c) {
            cur |= c << cur_shift;
            cur_shift += cur_code_size;
            emit_bytes_to_buffer(8);
          } // I am not an expert on the topic, and I don't want to write a thesis.
          // However, it is good to outline here the basic algorithm and the few data
          // structures and optimizations here that make this implementation fast.
          // The basic idea behind LZW is to build a table of previously seen runs
          // addressed by a short id (herein called output code).  All data is
          // referenced by a code, which represents one or more values from the
          // original input stream.  All input bytes can be referenced as the same
          // value as an output code.  So if you didn't want any compression, you
          // could more or less just output the original bytes as codes (there are
          // some details to this, but it is the idea).  In order to achieve
          // compression, values greater then the input range (codes can be up to
          // 12-bit while input only 8-bit) represent a sequence of previously seen
          // inputs.  The decompressor is able to build the same mapping while
          // decoding, so there is always a shared common knowledge between the
          // encoding and decoder, which is also important for "timing" aspects like
          // how to handle variable bit width code encoding.
          //
          // One obvious but very important consequence of the table system is there
          // is always a unique id (at most 12-bits) to map the runs.  'A' might be
          // 4, then 'AA' might be 10, 'AAA' 11, 'AAAA' 12, etc.  This relationship
          // can be used for an effecient lookup strategy for the code mapping.  We
          // need to know if a run has been seen before, and be able to map that run
          // to the output code.  Since we start with known unique ids (input bytes),
          // and then from those build more unique ids (table entries), we can
          // continue this chain (almost like a linked list) to always have small
          // integer values that represent the current byte chains in the encoder.
          // This means instead of tracking the input bytes (AAAABCD) to know our
          // current state, we can track the table entry for AAAABC (it is guaranteed
          // to exist by the nature of the algorithm) and the next character D.
          // Therefor the tuple of (table_entry, byte) is guaranteed to also be
          // unique.  This allows us to create a simple lookup key for mapping input
          // sequences to codes (table indices) without having to store or search
          // any of the code sequences.  So if 'AAAA' has a table entry of 12, the
          // tuple of ('AAAA', K) for any input byte K will be unique, and can be our
          // key.  This leads to a integer value at most 20-bits, which can always
          // fit in an SMI value and be used as a fast sparse array / object key.
          // Output code for the current contents of the index buffer.


          var ib_code = index_stream[0] & code_mask; // Load first input index.

          var code_table = {}; // Key'd on our 20-bit "tuple".

          emit_code(clear_code); // Spec says first code should be a clear code.
          // First index already loaded, process the rest of the stream.

          for (var i = 1, il = index_stream.length; i < il; ++i) {
            var k = index_stream[i] & code_mask;
            var cur_key = ib_code << 8 | k; // (prev, k) unique tuple.

            var cur_code = code_table[cur_key]; // buffer + k.
            // Check if we have to create a new code table entry.

            if (cur_code === undefined) {
              // We don't have buffer + k.
              // Emit index buffer (without k).
              // This is an inline version of emit_code, because this is the core
              // writing routine of the compressor (and V8 cannot inline emit_code
              // because it is a closure here in a different context).  Additionally
              // we can call emit_byte_to_buffer less often, because we can have
              // 30-bits (from our 31-bit signed SMI), and we know our codes will only
              // be 12-bits, so can safely have 18-bits there without overflow.
              // emit_code(ib_code);
              cur |= ib_code << cur_shift;
              cur_shift += cur_code_size;

              while (cur_shift >= 8) {
                buf[p++] = cur & 0xff;
                cur >>= 8;
                cur_shift -= 8;

                if (p === cur_subblock + 256) {
                  // Finished a subblock.
                  buf[cur_subblock] = 255;
                  cur_subblock = p++;
                }
              }

              if (next_code === 4096) {
                // Table full, need a clear.
                emit_code(clear_code);
                next_code = eoi_code + 1;
                cur_code_size = min_code_size + 1;
                code_table = {};
              } else {
                // Table not full, insert a new entry.
                // Increase our variable bit code sizes if necessary.  This is a bit
                // tricky as it is based on "timing" between the encoding and
                // decoder.  From the encoders perspective this should happen after
                // we've already emitted the index buffer and are about to create the
                // first table entry that would overflow our current code bit size.
                if (next_code >= 1 << cur_code_size) ++cur_code_size;
                code_table[cur_key] = next_code++; // Insert into code table.
              }

              ib_code = k; // Index buffer to single input k.
            } else {
              ib_code = cur_code; // Index buffer to sequence in code table.
            }
          }

          emit_code(ib_code); // There will still be something in the index buffer.

          emit_code(eoi_code); // End Of Information.
          // Flush / finalize the sub-blocks stream to the buffer.

          emit_bytes_to_buffer(1); // Finish the sub-blocks, writing out any unfinished lengths and
          // terminating with a sub-block of length 0.  If we have already started
          // but not yet used a sub-block it can just become the terminator.

          if (cur_subblock + 1 === p) {
            // Started but unused.
            buf[cur_subblock] = 0;
          } else {
            // Started and used, write length and additional terminator block.
            buf[cur_subblock] = p - cur_subblock - 1;
            buf[p++] = 0;
          }

          return p;
        }
      }
      /*
        animatedGIF.js
        ==============
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Dependencies
      // Helpers


      var noop$2 = function noop() {};

      var AnimatedGIF = function AnimatedGIF(options) {
        this.canvas = null;
        this.ctx = null;
        this.repeat = 0;
        this.frames = [];
        this.numRenderedFrames = 0;
        this.onRenderCompleteCallback = noop$2;
        this.onRenderProgressCallback = noop$2;
        this.workers = [];
        this.availableWorkers = [];
        this.generatingGIF = false;
        this.options = options; // Constructs and initializes the the web workers appropriately

        this.initializeWebWorkers(options);
      };

      AnimatedGIF.prototype = {
        'workerMethods': workerCode(),
        'initializeWebWorkers': function initializeWebWorkers(options) {
          var self = this;
          var processFrameWorkerCode = NeuQuant.toString() + '(' + workerCode.toString() + '());';
          var webWorkerObj = void 0;
          var objectUrl = void 0;
          var webWorker = void 0;
          var numWorkers = void 0;
          var x = -1;
          var workerError = '';
          numWorkers = options.numWorkers;

          while (++x < numWorkers) {
            webWorkerObj = utils.createWebWorker(processFrameWorkerCode);

            if (utils.isObject(webWorkerObj)) {
              objectUrl = webWorkerObj.objectUrl;
              webWorker = webWorkerObj.worker;
              self.workers.push({
                worker: webWorker,
                objectUrl: objectUrl
              });
              self.availableWorkers.push(webWorker);
            } else {
              workerError = webWorkerObj;
              utils.webWorkerError = !!webWorkerObj;
            }
          }

          this.workerError = workerError;
          this.canvas = document.createElement('canvas');
          this.canvas.width = options.gifWidth;
          this.canvas.height = options.gifHeight;
          this.ctx = this.canvas.getContext('2d');
          this.frames = [];
        },
        // Return a worker for processing a frame
        getWorker: function getWorker() {
          return this.availableWorkers.pop();
        },
        // Restores a worker to the pool
        freeWorker: function freeWorker(worker) {
          this.availableWorkers.push(worker);
        },
        byteMap: function () {
          var byteMap = [];

          for (var i = 0; i < 256; i++) {
            byteMap[i] = String.fromCharCode(i);
          }

          return byteMap;
        }(),
        bufferToString: function bufferToString(buffer) {
          var numberValues = buffer.length;
          var str = '';
          var x = -1;

          while (++x < numberValues) {
            str += this.byteMap[buffer[x]];
          }

          return str;
        },
        onFrameFinished: function onFrameFinished(progressCallback) {
          // The GIF is not written until we're done with all the frames
          // because they might not be processed in the same order
          var self = this;
          var frames = self.frames;
          var options = self.options;
          var hasExistingImages = !!(options.images || []).length;
          var allDone = frames.every(function (frame) {
            return !frame.beingProcessed && frame.done;
          });
          self.numRenderedFrames++;

          if (hasExistingImages) {
            progressCallback(self.numRenderedFrames / frames.length);
          }

          self.onRenderProgressCallback(self.numRenderedFrames * 0.75 / frames.length);

          if (allDone) {
            if (!self.generatingGIF) {
              self.generateGIF(frames, self.onRenderCompleteCallback);
            }
          } else {
            utils.requestTimeout(function () {
              self.processNextFrame();
            }, 1);
          }
        },
        processFrame: function processFrame(position) {
          var AnimatedGifContext = this;
          var options = this.options;
          var _options = this.options,
              progressCallback = _options.progressCallback,
              sampleInterval = _options.sampleInterval;
          var frames = this.frames;
          var frame = void 0;
          var worker = void 0;

          var done = function done() {
            var ev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var data = ev.data; // Delete original data, and free memory

            delete frame.data;
            frame.pixels = Array.prototype.slice.call(data.pixels);
            frame.palette = Array.prototype.slice.call(data.palette);
            frame.done = true;
            frame.beingProcessed = false;
            AnimatedGifContext.freeWorker(worker);
            AnimatedGifContext.onFrameFinished(progressCallback);
          };

          frame = frames[position];

          if (frame.beingProcessed || frame.done) {
            this.onFrameFinished();
            return;
          }

          frame.sampleInterval = sampleInterval;
          frame.beingProcessed = true;
          frame.gifshot = true;
          worker = this.getWorker();

          if (worker) {
            // Process the frame in a web worker
            worker.onmessage = done;
            worker.postMessage(frame);
          } else {
            // Process the frame in the current thread
            done({
              'data': AnimatedGifContext.workerMethods.run(frame)
            });
          }
        },
        startRendering: function startRendering(completeCallback) {
          this.onRenderCompleteCallback = completeCallback;

          for (var i = 0; i < this.options.numWorkers && i < this.frames.length; i++) {
            this.processFrame(i);
          }
        },
        processNextFrame: function processNextFrame() {
          var position = -1;

          for (var i = 0; i < this.frames.length; i++) {
            var frame = this.frames[i];

            if (!frame.done && !frame.beingProcessed) {
              position = i;
              break;
            }
          }

          if (position >= 0) {
            this.processFrame(position);
          }
        },
        // Takes the already processed data in frames and feeds it to a new
        // GifWriter instance in order to get the binary GIF file
        generateGIF: function generateGIF(frames, callback) {
          // TODO: Weird: using a simple JS array instead of a typed array,
          // the files are WAY smaller o_o. Patches/explanations welcome!
          var buffer = []; // new Uint8Array(width * height * frames.length * 5);

          var gifOptions = {
            loop: this.repeat
          };
          var options = this.options;
          var interval = options.interval;
          var frameDuration = options.frameDuration;
          var existingImages = options.images;
          var hasExistingImages = !!existingImages.length;
          var height = options.gifHeight;
          var width = options.gifWidth;
          var gifWriter$$1 = new gifWriter(buffer, width, height, gifOptions);
          var onRenderProgressCallback = this.onRenderProgressCallback;
          var delay = hasExistingImages ? interval * 100 : 0;
          var bufferToString = void 0;
          var gif = void 0;
          this.generatingGIF = true;
          utils.each(frames, function (iterator, frame) {
            var framePalette = frame.palette;
            onRenderProgressCallback(0.75 + 0.25 * frame.position * 1.0 / frames.length);

            for (var i = 0; i < frameDuration; i++) {
              gifWriter$$1.addFrame(0, 0, width, height, frame.pixels, {
                palette: framePalette,
                delay: delay
              });
            }
          });
          gifWriter$$1.end();
          onRenderProgressCallback(1.0);
          this.frames = [];
          this.generatingGIF = false;

          if (utils.isFunction(callback)) {
            bufferToString = this.bufferToString(buffer);
            gif = 'data:image/gif;base64,' + utils.btoa(bufferToString);
            callback(gif);
          }
        },
        // From GIF: 0 = loop forever, null = not looping, n > 0 = loop n times and stop
        setRepeat: function setRepeat(r) {
          this.repeat = r;
        },
        addFrame: function addFrame(element, gifshotOptions) {
          gifshotOptions = utils.isObject(gifshotOptions) ? gifshotOptions : {};
          var self = this;
          var ctx = self.ctx;
          var options = self.options;
          var width = options.gifWidth;
          var height = options.gifHeight;
          var fontSize = utils.getFontSize(gifshotOptions);
          var _gifshotOptions = gifshotOptions,
              filter = _gifshotOptions.filter,
              fontColor = _gifshotOptions.fontColor,
              fontFamily = _gifshotOptions.fontFamily,
              fontWeight = _gifshotOptions.fontWeight,
              gifHeight = _gifshotOptions.gifHeight,
              gifWidth = _gifshotOptions.gifWidth,
              text = _gifshotOptions.text,
              textAlign = _gifshotOptions.textAlign,
              textBaseline = _gifshotOptions.textBaseline;
          var textXCoordinate = gifshotOptions.textXCoordinate ? gifshotOptions.textXCoordinate : textAlign === 'left' ? 1 : textAlign === 'right' ? width : width / 2;
          var textYCoordinate = gifshotOptions.textYCoordinate ? gifshotOptions.textYCoordinate : textBaseline === 'top' ? 1 : textBaseline === 'center' ? height / 2 : height;
          var font = fontWeight + ' ' + fontSize + ' ' + fontFamily;
          var imageData = void 0;

          try {
            ctx.filter = filter;
            ctx.drawImage(element, 0, 0, width, height);

            if (text) {
              ctx.font = font;
              ctx.fillStyle = fontColor;
              ctx.textAlign = textAlign;
              ctx.textBaseline = textBaseline;
              ctx.fillText(text, textXCoordinate, textYCoordinate);
            }

            imageData = ctx.getImageData(0, 0, width, height);
            self.addFrameImageData(imageData);
          } catch (e) {
            return '' + e;
          }
        },
        addFrameImageData: function addFrameImageData() {
          var imageData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var frames = this.frames;
          var imageDataArray = imageData.data;
          this.frames.push({
            'data': imageDataArray,
            'width': imageData.width,
            'height': imageData.height,
            'palette': null,
            'dithering': null,
            'done': false,
            'beingProcessed': false,
            'position': frames.length
          });
        },
        onRenderProgress: function onRenderProgress(callback) {
          this.onRenderProgressCallback = callback;
        },
        isRendering: function isRendering() {
          return this.generatingGIF;
        },
        getBase64GIF: function getBase64GIF(completeCallback) {
          var self = this;

          var onRenderComplete = function onRenderComplete(gif) {
            self.destroyWorkers();
            utils.requestTimeout(function () {
              completeCallback(gif);
            }, 0);
          };

          self.startRendering(onRenderComplete);
        },
        destroyWorkers: function destroyWorkers() {
          if (this.workerError) {
            return;
          }

          var workers = this.workers; // Explicitly ask web workers to die so they are explicitly GC'ed

          utils.each(workers, function (iterator, workerObj) {
            var worker = workerObj.worker;
            var objectUrl = workerObj.objectUrl;
            worker.terminate();
            utils.URL.revokeObjectURL(objectUrl);
          });
        }
      };
      /*
        getBase64GIF.js
        ===============
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */

      function getBase64GIF(animatedGifInstance, callback) {
        // This is asynchronous, rendered with WebWorkers
        animatedGifInstance.getBase64GIF(function (image) {
          callback({
            error: false,
            errorCode: '',
            errorMsg: '',
            image: image
          });
        });
      }
      /*
        existingImages.js
        =================
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */


      function existingImages() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = obj.callback,
            images = obj.images,
            options = obj.options;
        var imagesLength = obj.imagesLength;
        var skipObj = {
          'getUserMedia': true,
          'window.URL': true
        };
        var errorObj = error.validate(skipObj);
        var loadedImages = [];
        var loadedImagesLength = 0;
        var tempImage = void 0;
        var ag = void 0;

        if (errorObj.error) {
          return callback(errorObj);
        } // change workerPath to point to where Animated_GIF.worker.js is


        ag = new AnimatedGIF(options);
        utils.each(images, function (index, image) {
          var currentImage = image;

          if (image.src) {
            currentImage = currentImage.src;
          }

          if (utils.isElement(currentImage)) {
            if (options.crossOrigin) {
              currentImage.crossOrigin = options.crossOrigin;
            }

            loadedImages[index] = currentImage;
            loadedImagesLength += 1;

            if (loadedImagesLength === imagesLength) {
              addLoadedImagesToGif();
            }
          } else if (utils.isString(currentImage)) {
            tempImage = new Image();

            if (options.crossOrigin) {
              tempImage.crossOrigin = options.crossOrigin;
            }

            (function (tempImage) {
              if (image.text) {
                tempImage.text = image.text;
              }

              tempImage.onerror = function (e) {
                var obj = void 0;
                --imagesLength; // skips over images that error out

                if (imagesLength === 0) {
                  obj = {};
                  obj.error = 'None of the requested images was capable of being retrieved';
                  return callback(obj);
                }
              };

              tempImage.onload = function (e) {
                if (image.text) {
                  loadedImages[index] = {
                    img: tempImage,
                    text: tempImage.text
                  };
                } else {
                  loadedImages[index] = tempImage;
                }

                loadedImagesLength += 1;

                if (loadedImagesLength === imagesLength) {
                  addLoadedImagesToGif();
                }

                utils.removeElement(tempImage);
              };

              tempImage.src = currentImage;
            })(tempImage);

            utils.setCSSAttr(tempImage, {
              position: 'fixed',
              opacity: '0'
            });
            document.body.appendChild(tempImage);
          }
        });

        function addLoadedImagesToGif() {
          utils.each(loadedImages, function (index, loadedImage) {
            if (loadedImage) {
              if (loadedImage.text) {
                ag.addFrame(loadedImage.img, options, loadedImage.text);
              } else {
                ag.addFrame(loadedImage, options);
              }
            }
          });
          getBase64GIF(ag, callback);
        }
      }
      /*
        screenShot.js
        =============
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Dependencies
      // Helpers


      var noop$3 = function noop() {};

      var screenShot = {
        getGIF: function getGIF() {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var callback = arguments[1];
          callback = utils.isFunction(callback) ? callback : noop$3;
          var canvas = document.createElement('canvas');
          var context = void 0;
          var existingImages = options.images;
          var hasExistingImages = !!existingImages.length;
          var cameraStream = options.cameraStream,
              crop = options.crop,
              filter = options.filter,
              fontColor = options.fontColor,
              fontFamily = options.fontFamily,
              fontWeight = options.fontWeight,
              keepCameraOn = options.keepCameraOn,
              numWorkers = options.numWorkers,
              progressCallback = options.progressCallback,
              saveRenderingContexts = options.saveRenderingContexts,
              savedRenderingContexts = options.savedRenderingContexts,
              text = options.text,
              textAlign = options.textAlign,
              textBaseline = options.textBaseline,
              videoElement = options.videoElement,
              videoHeight = options.videoHeight,
              videoWidth = options.videoWidth,
              webcamVideoElement = options.webcamVideoElement;
          var gifWidth = Number(options.gifWidth);
          var gifHeight = Number(options.gifHeight);
          var interval = Number(options.interval);
          var sampleInterval = Number(options.sampleInterval);
          var waitBetweenFrames = hasExistingImages ? 0 : interval * 1000;
          var renderingContextsToSave = [];
          var numFrames = savedRenderingContexts.length ? savedRenderingContexts.length : options.numFrames;
          var pendingFrames = numFrames;
          var ag = new AnimatedGIF(options);
          var fontSize = utils.getFontSize(options);
          var textXCoordinate = options.textXCoordinate ? options.textXCoordinate : textAlign === 'left' ? 1 : textAlign === 'right' ? gifWidth : gifWidth / 2;
          var textYCoordinate = options.textYCoordinate ? options.textYCoordinate : textBaseline === 'top' ? 1 : textBaseline === 'center' ? gifHeight / 2 : gifHeight;
          var font = fontWeight + ' ' + fontSize + ' ' + fontFamily;
          var sourceX = crop ? Math.floor(crop.scaledWidth / 2) : 0;
          var sourceWidth = crop ? videoWidth - crop.scaledWidth : 0;
          var sourceY = crop ? Math.floor(crop.scaledHeight / 2) : 0;
          var sourceHeight = crop ? videoHeight - crop.scaledHeight : 0;

          var captureFrames = function captureSingleFrame() {
            var framesLeft = pendingFrames - 1;

            if (savedRenderingContexts.length) {
              context.putImageData(savedRenderingContexts[numFrames - pendingFrames], 0, 0);
              finishCapture();
            } else {
              drawVideo();
            }

            function drawVideo() {
              try {
                // Makes sure the canvas video heights/widths are in bounds
                if (sourceWidth > videoWidth) {
                  sourceWidth = videoWidth;
                }

                if (sourceHeight > videoHeight) {
                  sourceHeight = videoHeight;
                }

                if (sourceX < 0) {
                  sourceX = 0;
                }

                if (sourceY < 0) {
                  sourceY = 0;
                }

                context.filter = filter;
                context.drawImage(videoElement, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, gifWidth, gifHeight);
                finishCapture();
              } catch (e) {
                // There is a Firefox bug that sometimes throws NS_ERROR_NOT_AVAILABLE and
                // and IndexSizeError errors when drawing a video element to the canvas
                if (e.name === 'NS_ERROR_NOT_AVAILABLE') {
                  // Wait 100ms before trying again
                  utils.requestTimeout(drawVideo, 100);
                } else {
                  throw e;
                }
              }
            }

            function finishCapture() {
              var imageData = void 0;

              if (saveRenderingContexts) {
                renderingContextsToSave.push(context.getImageData(0, 0, gifWidth, gifHeight));
              } // If there is text to display, make sure to display it on the canvas after the image is drawn


              if (text) {
                context.font = font;
                context.fillStyle = fontColor;
                context.textAlign = textAlign;
                context.textBaseline = textBaseline;
                context.fillText(text, textXCoordinate, textYCoordinate);
              }

              imageData = context.getImageData(0, 0, gifWidth, gifHeight);
              ag.addFrameImageData(imageData);
              pendingFrames = framesLeft; // Call back with an r value indicating how far along we are in capture

              progressCallback((numFrames - pendingFrames) / numFrames);

              if (framesLeft > 0) {
                // test
                utils.requestTimeout(captureSingleFrame, waitBetweenFrames);
              }

              if (!pendingFrames) {
                ag.getBase64GIF(function (image) {
                  callback({
                    'error': false,
                    'errorCode': '',
                    'errorMsg': '',
                    'image': image,
                    'cameraStream': cameraStream,
                    'videoElement': videoElement,
                    'webcamVideoElement': webcamVideoElement,
                    'savedRenderingContexts': renderingContextsToSave,
                    'keepCameraOn': keepCameraOn
                  });
                });
              }
            }
          };

          numFrames = numFrames !== undefined ? numFrames : 10;
          interval = interval !== undefined ? interval : 0.1; // In seconds

          canvas.width = gifWidth;
          canvas.height = gifHeight;
          context = canvas.getContext('2d');

          (function capture() {
            if (!savedRenderingContexts.length && videoElement.currentTime === 0) {
              utils.requestTimeout(capture, 100);
              return;
            }

            captureFrames();
          })();
        },
        getCropDimensions: function getCropDimensions() {
          var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var width = obj.videoWidth;
          var height = obj.videoHeight;
          var gifWidth = obj.gifWidth;
          var gifHeight = obj.gifHeight;
          var result = {
            width: 0,
            height: 0,
            scaledWidth: 0,
            scaledHeight: 0
          };

          if (width > height) {
            result.width = Math.round(width * (gifHeight / height)) - gifWidth;
            result.scaledWidth = Math.round(result.width * (height / gifHeight));
          } else {
            result.height = Math.round(height * (gifWidth / width)) - gifHeight;
            result.scaledHeight = Math.round(result.height * (width / gifWidth));
          }

          return result;
        }
      };
      /*
        videoStream.js
        ==============
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Dependencies

      var videoStream = {
        loadedData: false,
        defaultVideoDimensions: {
          width: 640,
          height: 480
        },
        findVideoSize: function findVideoSizeMethod(obj) {
          findVideoSizeMethod.attempts = findVideoSizeMethod.attempts || 0;
          var cameraStream = obj.cameraStream,
              completedCallback = obj.completedCallback,
              videoElement = obj.videoElement;

          if (!videoElement) {
            return;
          }

          if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
            videoElement.removeEventListener('loadeddata', videoStream.findVideoSize);
            completedCallback({
              videoElement: videoElement,
              cameraStream: cameraStream,
              videoWidth: videoElement.videoWidth,
              videoHeight: videoElement.videoHeight
            });
          } else {
            if (findVideoSizeMethod.attempts < 10) {
              findVideoSizeMethod.attempts += 1;
              utils.requestTimeout(function () {
                videoStream.findVideoSize(obj);
              }, 400);
            } else {
              completedCallback({
                videoElement: videoElement,
                cameraStream: cameraStream,
                videoWidth: videoStream.defaultVideoDimensions.width,
                videoHeight: videoStream.defaultVideoDimensions.height
              });
            }
          }
        },
        onStreamingTimeout: function onStreamingTimeout(callback) {
          if (utils.isFunction(callback)) {
            callback({
              error: true,
              errorCode: 'getUserMedia',
              errorMsg: 'There was an issue with the getUserMedia API - Timed out while trying to start streaming',
              image: null,
              cameraStream: {}
            });
          }
        },
        stream: function stream(obj) {
          var existingVideo = utils.isArray(obj.existingVideo) ? obj.existingVideo[0] : obj.existingVideo;
          var cameraStream = obj.cameraStream,
              completedCallback = obj.completedCallback,
              streamedCallback = obj.streamedCallback,
              videoElement = obj.videoElement;

          if (utils.isFunction(streamedCallback)) {
            streamedCallback();
          }

          if (existingVideo) {
            if (utils.isString(existingVideo)) {
              videoElement.src = existingVideo;
              videoElement.innerHTML = '<source src="' + existingVideo + '" type="video/' + utils.getExtension(existingVideo) + '" />';
            } else if (existingVideo instanceof Blob) {
              try {
                videoElement.src = utils.URL.createObjectURL(existingVideo);
              } catch (e) {}

              videoElement.innerHTML = '<source src="' + existingVideo + '" type="' + existingVideo.type + '" />';
            }
          } else if (videoElement.mozSrcObject) {
            videoElement.mozSrcObject = cameraStream;
          } else if (utils.URL) {
            try {
              videoElement.srcObject = cameraStream;
              videoElement.src = utils.URL.createObjectURL(cameraStream);
            } catch (e) {
              videoElement.srcObject = cameraStream;
            }
          }

          videoElement.play();
          utils.requestTimeout(function checkLoadedData() {
            checkLoadedData.count = checkLoadedData.count || 0;

            if (videoStream.loadedData === true) {
              videoStream.findVideoSize({
                videoElement: videoElement,
                cameraStream: cameraStream,
                completedCallback: completedCallback
              });
              videoStream.loadedData = false;
            } else {
              checkLoadedData.count += 1;

              if (checkLoadedData.count > 10) {
                videoStream.findVideoSize({
                  videoElement: videoElement,
                  cameraStream: cameraStream,
                  completedCallback: completedCallback
                });
              } else {
                checkLoadedData();
              }
            }
          }, 0);
        },
        startStreaming: function startStreaming(obj) {
          var errorCallback = utils.isFunction(obj.error) ? obj.error : utils.noop;
          var streamedCallback = utils.isFunction(obj.streamed) ? obj.streamed : utils.noop;
          var completedCallback = utils.isFunction(obj.completed) ? obj.completed : utils.noop;
          var crossOrigin = obj.crossOrigin,
              existingVideo = obj.existingVideo,
              lastCameraStream = obj.lastCameraStream,
              options = obj.options,
              webcamVideoElement = obj.webcamVideoElement;
          var videoElement = utils.isElement(existingVideo) ? existingVideo : webcamVideoElement ? webcamVideoElement : document.createElement('video');

          if (crossOrigin) {
            videoElement.crossOrigin = options.crossOrigin;
          }

          videoElement.autoplay = true;
          videoElement.loop = true;
          videoElement.muted = true;
          videoElement.addEventListener('loadeddata', function (event) {
            videoStream.loadedData = true;

            if (options.offset) {
              videoElement.currentTime = options.offset;
            }
          });

          if (existingVideo) {
            videoStream.stream({
              videoElement: videoElement,
              existingVideo: existingVideo,
              completedCallback: completedCallback
            });
          } else if (lastCameraStream) {
            videoStream.stream({
              videoElement: videoElement,
              cameraStream: lastCameraStream,
              streamedCallback: streamedCallback,
              completedCallback: completedCallback
            });
          } else {
            utils.getUserMedia({
              video: true
            }, function (stream) {
              videoStream.stream({
                videoElement: videoElement,
                cameraStream: stream,
                streamedCallback: streamedCallback,
                completedCallback: completedCallback
              });
            }, errorCallback);
          }
        },
        startVideoStreaming: function startVideoStreaming(callback) {
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var timeoutLength = options.timeout !== undefined ? options.timeout : 0;
          var originalCallback = options.callback;
          var webcamVideoElement = options.webcamVideoElement;
          var noGetUserMediaSupportTimeout = void 0; // Some browsers apparently have support for video streaming because of the
          // presence of the getUserMedia function, but then do not answer our
          // calls for streaming.
          // So we'll set up this timeout and if nothing happens after a while, we'll
          // conclude that there's no actual getUserMedia support.

          if (timeoutLength > 0) {
            noGetUserMediaSupportTimeout = utils.requestTimeout(function () {
              videoStream.onStreamingTimeout(originalCallback);
            }, 10000);
          }

          videoStream.startStreaming({
            error: function error() {
              originalCallback({
                error: true,
                errorCode: 'getUserMedia',
                errorMsg: 'There was an issue with the getUserMedia API - the user probably denied permission',
                image: null,
                cameraStream: {}
              });
            },
            streamed: function streamed() {
              // The streaming started somehow, so we can assume there is getUserMedia support
              clearTimeout(noGetUserMediaSupportTimeout);
            },
            completed: function completed() {
              var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
              var cameraStream = obj.cameraStream,
                  videoElement = obj.videoElement,
                  videoHeight = obj.videoHeight,
                  videoWidth = obj.videoWidth;
              callback({
                cameraStream: cameraStream,
                videoElement: videoElement,
                videoHeight: videoHeight,
                videoWidth: videoWidth
              });
            },
            lastCameraStream: options.lastCameraStream,
            webcamVideoElement: webcamVideoElement,
            crossOrigin: options.crossOrigin,
            options: options
          });
        },
        stopVideoStreaming: function stopVideoStreaming(obj) {
          obj = utils.isObject(obj) ? obj : {};
          var _obj = obj,
              keepCameraOn = _obj.keepCameraOn,
              videoElement = _obj.videoElement,
              webcamVideoElement = _obj.webcamVideoElement;
          var cameraStream = obj.cameraStream || {};
          var cameraStreamTracks = cameraStream.getTracks ? cameraStream.getTracks() || [] : [];
          var hasCameraStreamTracks = !!cameraStreamTracks.length;
          var firstCameraStreamTrack = cameraStreamTracks[0];

          if (!keepCameraOn && hasCameraStreamTracks) {
            if (utils.isFunction(firstCameraStreamTrack.stop)) {
              // Stops the camera stream
              firstCameraStreamTrack.stop();
            }
          }

          if (utils.isElement(videoElement) && !webcamVideoElement) {
            // Pauses the video, revokes the object URL (freeing up memory), and remove the video element
            videoElement.pause(); // Destroys the object url

            if (utils.isFunction(utils.URL.revokeObjectURL) && !utils.webWorkerError) {
              if (videoElement.src) {
                utils.URL.revokeObjectURL(videoElement.src);
              }
            } // Removes the video element from the DOM


            utils.removeElement(videoElement);
          }
        }
      };
      /*
        stopVideoStreaming.js
        =====================
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */

      function stopVideoStreaming(options) {
        options = utils.isObject(options) ? options : {};
        videoStream.stopVideoStreaming(options);
      }
      /*
        createAndGetGIF.js
        ==================
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Dependencies


      function createAndGetGIF(obj, callback) {
        var options = obj.options || {};
        var images = options.images,
            video = options.video;
        var gifWidth = Number(options.gifWidth);
        var gifHeight = Number(options.gifHeight);
        var numFrames = Number(options.numFrames);
        var cameraStream = obj.cameraStream,
            videoElement = obj.videoElement,
            videoWidth = obj.videoWidth,
            videoHeight = obj.videoHeight;
        var cropDimensions = screenShot.getCropDimensions({
          videoWidth: videoWidth,
          videoHeight: videoHeight,
          gifHeight: gifHeight,
          gifWidth: gifWidth
        });
        var completeCallback = callback;
        options.crop = cropDimensions;
        options.videoElement = videoElement;
        options.videoWidth = videoWidth;
        options.videoHeight = videoHeight;
        options.cameraStream = cameraStream;

        if (!utils.isElement(videoElement)) {
          return;
        }

        videoElement.width = gifWidth + cropDimensions.width;
        videoElement.height = gifHeight + cropDimensions.height;

        if (!options.webcamVideoElement) {
          utils.setCSSAttr(videoElement, {
            position: 'fixed',
            opacity: '0'
          });
          document.body.appendChild(videoElement);
        } // Firefox doesn't seem to obey autoplay if the element is not in the DOM when the content
        // is loaded, so we must manually trigger play after adding it, or the video will be frozen


        videoElement.play();
        screenShot.getGIF(options, function (obj) {
          if ((!images || !images.length) && (!video || !video.length)) {
            stopVideoStreaming(obj);
          }

          completeCallback(obj);
        });
      }
      /*
        existingVideo.js
        ================
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Dependencies


      function existingVideo() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = obj.callback,
            existingVideo = obj.existingVideo,
            options = obj.options;
        var skipObj = {
          getUserMedia: true,
          'window.URL': true
        };
        var errorObj = error.validate(skipObj);
        var videoType = void 0;
        var videoSrc = void 0;

        if (errorObj.error) {
          return callback(errorObj);
        }

        if (utils.isElement(existingVideo) && existingVideo.src) {
          videoSrc = existingVideo.src;
          videoType = utils.getExtension(videoSrc);

          if (!utils.isSupported.videoCodecs[videoType]) {
            return callback(error.messages.videoCodecs);
          }
        } else if (utils.isArray(existingVideo)) {
          utils.each(existingVideo, function (iterator, videoSrc) {
            if (videoSrc instanceof Blob) {
              videoType = videoSrc.type.substr(videoSrc.type.lastIndexOf('/') + 1, videoSrc.length);
            } else {
              videoType = videoSrc.substr(videoSrc.lastIndexOf('.') + 1, videoSrc.length);
            }

            if (utils.isSupported.videoCodecs[videoType]) {
              existingVideo = videoSrc;
              return false;
            }
          });
        }

        videoStream.startStreaming({
          completed: function completed(obj) {
            obj.options = options || {};
            createAndGetGIF(obj, callback);
          },
          existingVideo: existingVideo,
          crossOrigin: options.crossOrigin,
          options: options
        });
      }
      /*
        existingWebcam.js
        =================
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Dependencies


      function existingWebcam() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = obj.callback,
            lastCameraStream = obj.lastCameraStream,
            options = obj.options,
            webcamVideoElement = obj.webcamVideoElement;

        if (!isWebCamGIFSupported()) {
          return callback(error.validate());
        }

        if (options.savedRenderingContexts.length) {
          screenShot.getGIF(options, function (obj) {
            callback(obj);
          });
          return;
        }

        videoStream.startVideoStreaming(function () {
          var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          obj.options = options || {};
          createAndGetGIF(obj, callback);
        }, {
          lastCameraStream: lastCameraStream,
          callback: callback,
          webcamVideoElement: webcamVideoElement,
          crossOrigin: options.crossOrigin
        });
      }
      /*
        createGIF.js
        ============
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Dependencies


      function createGIF(userOptions, callback) {
        callback = utils.isFunction(userOptions) ? userOptions : callback;
        userOptions = utils.isObject(userOptions) ? userOptions : {};

        if (!utils.isFunction(callback)) {
          return;
        }

        var options = utils.mergeOptions(defaultOptions, userOptions) || {};
        var lastCameraStream = userOptions.cameraStream;
        var images = options.images;
        var imagesLength = images ? images.length : 0;
        var video = options.video;
        var webcamVideoElement = options.webcamVideoElement;
        options = utils.mergeOptions(options, {
          'gifWidth': Math.floor(options.gifWidth),
          'gifHeight': Math.floor(options.gifHeight)
        }); // If the user would like to create a GIF from an existing image(s)

        if (imagesLength) {
          existingImages({
            'images': images,
            'imagesLength': imagesLength,
            'callback': callback,
            'options': options
          });
        } else if (video) {
          // If the user would like to create a GIF from an existing HTML5 video
          existingVideo({
            'existingVideo': video,
            callback: callback,
            options: options
          });
        } else {
          // If the user would like to create a GIF from a webcam stream
          existingWebcam({
            lastCameraStream: lastCameraStream,
            callback: callback,
            webcamVideoElement: webcamVideoElement,
            options: options
          });
        }
      }
      /*
        takeSnapShot.js
        ===============
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */


      function takeSnapShot(userOptions, callback) {
        callback = utils.isFunction(userOptions) ? userOptions : callback;
        userOptions = utils.isObject(userOptions) ? userOptions : {};

        if (!utils.isFunction(callback)) {
          return;
        }

        var mergedOptions = utils.mergeOptions(defaultOptions, userOptions);
        var options = utils.mergeOptions(mergedOptions, {
          'interval': .1,
          'numFrames': 1,
          'gifWidth': Math.floor(mergedOptions.gifWidth),
          'gifHeight': Math.floor(mergedOptions.gifHeight)
        });
        createGIF(options, callback);
      }
      /*
        API.js
        ======
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
      */
      // Dependencies


      var API = {
        'utils': utils$2,
        'error': error$2,
        'defaultOptions': defaultOptions$2,
        'createGIF': createGIF,
        'takeSnapShot': takeSnapShot,
        'stopVideoStreaming': stopVideoStreaming,
        'isSupported': isSupported,
        'isWebCamGIFSupported': isWebCamGIFSupported,
        'isExistingVideoGIFSupported': isExistingVideoGIFSupported,
        'isExistingImagesGIFSupported': isSupported$1,
        'VERSION': '0.4.5'
      };
      /*
        index.js
        ========
      */

      /* Copyright  2017 Yahoo Inc.
       * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
       */
      // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, and plain browser loading

      if (typeof undefined === 'function' && undefined.amd) {
        undefined([], function () {
          return API;
        });
      } else {
        module.exports = API;
      }
    })(typeof window !== "undefined" ? window : {}, typeof document !== "undefined" ? document : {
      createElement: function createElement() {}
    }, typeof window !== "undefined" ? window.navigator : {});
  });

  var b64toBlob = createCommonjsModule(function (module) {
    (function (root, globalName, factory) {
      if (module.exports) {
        // Node:
        module.exports = factory(); // Use module export as simulated ES6 default export:

        module.exports.default = module.exports;
      } else {
        // Browser:
        window[globalName] = factory();
      }
    })(commonjsGlobal, 'b64toBlob', function () {

      return function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);
          var byteNumbers = new Array(slice.length);

          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {
          type: contentType
        });
        return blob;
      };
    });
  });

  function i18nMix(i18n) {
    i18n.update({
      'zh-cn': {
        'Long press, gif length is between 1 second and 10 seconds': '长按，gif 长度为 1 ~ 10 秒',
        'Gif time is too short': 'Gif 时间太短',
        'Start creating gif...': '开始创建 gif...',
        'Create gif successfully': '创建 gif 成功',
        'There is another gif in the processing': '正有另一个 gif 在创建中',
        'Release the mouse to start': '放开鼠标即可开始'
      },
      'zh-tw': {
        'Long press, gif length is between 1 second and 10 seconds': '長按，gif 長度為 1 ~ 10 秒',
        'Gif time is too short': 'Gif 時間太短',
        'Start creating gif...': '開始創建 gif...',
        'Create gif successfully': '創建 gif 成功',
        'There is another gif in the processing': '正有另一個 gif 在創建中',
        'Release the mouse to start': '放開鼠標即可開始'
      }
    });
  }

  function artplayerPluginGif(art) {
    var _art$constructor$util = art.constructor.utils,
        errorHandle = _art$constructor$util.errorHandle,
        clamp = _art$constructor$util.clamp,
        downloadImage = _art$constructor$util.downloadImage;
    var i18n = art.i18n,
        notice = art.notice,
        layers = art.layers,
        controls = art.controls,
        player = art.player,
        loading = art.loading,
        _art$option = art.option,
        theme = _art$option.theme,
        title = _art$option.title,
        proxy = art.events.proxy,
        $video = art.template.$video;
    i18nMix(i18n);
    layers.add({
      name: 'artplayer-plugin-gif-progress',
      html: '<div class="artplayer-plugin-gif-progress"></div>',
      style: {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '3px',
        width: '0%',
        'background-color': theme
      }
    });
    var $progress = layers['artplayer-plugin-gif-progress'].$ref;
    var timeLimit = 10000;
    var isProcessing = false;
    var pressStartTime = 0;
    var progressTimer = null;
    var isPress = false;
    var offset = 0;

    function cleanTimer() {
      $progress.style.width = '0%';
      clearTimeout(progressTimer);
      progressTimer = null;
    }

    function createGif() {
      cleanTimer();
      var pressTime = new Date() - pressStartTime;

      if (isProcessing) {
        notice.show(i18n.get('There is another gif in the processing'));
      } else if (pressTime < 1000) {
        notice.show(i18n.get('Gif time is too short'));
      } else {
        var numFrames = Math.floor(clamp(pressTime, 1000, timeLimit) / 100);
        var videoWidth = $video.videoWidth,
            videoHeight = $video.videoHeight;
        art.plugins.artplayerPluginGif.create({
          numFrames: numFrames,
          offset: Math.floor(offset),
          gifHeight: 200,
          gifWidth: videoWidth / videoHeight * 200
        }, function (image) {
          downloadImage(image, "".concat(title || 'unnamed', ".gif"));
        });
      }
    }

    controls.add({
      name: 'artplayer-plugin-gif',
      position: 'right',
      html: 'GIF',
      mounted: function mounted($gif) {
        proxy($gif, 'mousedown', function () {
          isPress = true;
          cleanTimer();
          offset = player.currentTime;
          pressStartTime = new Date();
          notice.show(i18n.get('Long press, gif length is between 1 second and 10 seconds'));

          (function loop() {
            progressTimer = setTimeout(function () {
              var width = parseInt($progress.style.width, 10);

              if (width <= 100) {
                $progress.style.width = "".concat(width + 1, "%");
                loop();
              } else {
                notice.show(i18n.get('Release the mouse to start'));
              }
            }, timeLimit / 100);
          })();
        });
        proxy(document, 'mouseup', function () {
          if (isPress) {
            isPress = false;
            createGif();
            offset = 0;
          }
        });
      }
    });
    return {
      name: 'artplayerPluginGif',
      create: function create() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments.length > 1 ? arguments[1] : undefined;
        isProcessing = true;
        loading.show();
        art.emit('artplayerPluginGif:start');
        notice.show(i18n.get('Start creating gif...'), false);
        gifshot.createGIF(objectSpread({}, config, {
          video: [$video.src],
          crossOrigin: 'anonymous'
        }), function (obj) {
          if (obj.error) {
            notice.show(obj.errorMsg);
            errorHandle(false, obj.errorMsg);
          } else if (typeof callback === 'function') {
            var base64String = obj.image.split(',')[1];
            var blob = b64toBlob(base64String, 'image/gif');
            var blobUrl = URL.createObjectURL(blob);
            notice.show(i18n.get('Create gif successfully'));
            art.emit('artplayerPluginGif', blobUrl);
            callback(blobUrl);
          }

          isProcessing = false;
          loading.hide();
          art.emit('artplayerPluginGif:end');
        });
      }
    };
  }

  window.artplayerPluginGif = artplayerPluginGif;

  exports.default = artplayerPluginGif;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

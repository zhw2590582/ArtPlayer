// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"gEVO5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _danmuku = require("./danmuku");
var _danmukuDefault = parcelHelpers.interopDefault(_danmuku);
function artplayerPluginDanmuku(option) {
    return (art)=>{
        const danmuku = new _danmukuDefault.default(art, option);
        return {
            name: 'artplayerPluginDanmuku',
            emit: danmuku.emit.bind(danmuku),
            config: danmuku.config.bind(danmuku),
            hide: danmuku.hide.bind(danmuku),
            show: danmuku.show.bind(danmuku),
            get isHide () {
                return danmuku.isHide;
            }
        };
    };
}
exports.default = artplayerPluginDanmuku;
window['artplayerPluginDanmuku'] = artplayerPluginDanmuku;

},{"./danmuku":"igPca","@parcel/transformer-js/src/esmodule-helpers.js":"6SDkN"}],"igPca":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _bilibili = require("./bilibili");
class Danmuku {
    constructor(art, option){
        const { constructor , template  } = art;
        this.utils = constructor.utils;
        this.validator = constructor.validator;
        this.$danmuku = template.$danmuku;
        this.$player = template.$player;
        this.art = art;
        this.queue = [];
        this.option = {};
        this.$refs = [];
        this.isStop = false;
        this.isHide = false;
        this.timer = null;
        this.config(option);
        this.worker = new Worker(require("85d40535eae5f839"));
        art.on('video:play', this.start.bind(this));
        art.on('video:playing', this.start.bind(this));
        art.on('video:pause', this.stop.bind(this));
        art.on('video:waiting', this.stop.bind(this));
        art.on('fullscreen', this.reset.bind(this));
        art.on('fullscreenWeb', this.reset.bind(this));
        art.on('destroy', this.stop.bind(this));
        this.load();
    }
    static get option() {
        return {
            danmuku: [],
            speed: 5,
            margin: [
                10,
                100
            ],
            opacity: 1,
            fontSize: 25,
            filter: ()=>true
            ,
            antiOverlap: true,
            synchronousPlayback: false
        };
    }
    static get scheme() {
        return {
            danmuku: 'array|function|string',
            speed: 'number',
            margin: 'array',
            opacity: 'number',
            fontSize: 'number',
            filter: 'function',
            antiOverlap: 'boolean',
            synchronousPlayback: 'boolean'
        };
    }
    get isRotate() {
        return this.art.plugins.autoOrientation && this.art.plugins.autoOrientation.state;
    }
    get marginTop() {
        const { clamp  } = this.utils;
        const { $player  } = this.art.template;
        const value = this.option.margin[0];
        if (typeof value === 'number') return clamp(value, 0, $player.clientHeight);
        if (typeof value === 'string' && value.endsWith('%')) {
            const ratio = parseFloat(value) / 100;
            return clamp($player.clientHeight * ratio, 0, $player.clientHeight);
        }
        return Danmuku.option.margin[0];
    }
    get marginBottom() {
        const { clamp  } = this.utils;
        const { $player  } = this.art.template;
        const value = this.option.margin[1];
        if (typeof value === 'number') return clamp(value, 0, $player.clientHeight);
        if (typeof value === 'string' && value.endsWith('%')) {
            const ratio = parseFloat(value) / 100;
            return clamp($player.clientHeight * ratio, 0, $player.clientHeight);
        }
        return Danmuku.option.margin[1];
    }
    filter(state, callback) {
        return this.queue.filter((danmu)=>danmu.$state === state
        ).map(callback);
    }
    getLeft($ref) {
        const rect = $ref.getBoundingClientRect();
        return this.isRotate ? rect.top : rect.left;
    }
    getRef() {
        const $refCache = this.$refs.pop();
        if ($refCache) return $refCache;
        const $ref = document.createElement('div');
        $ref.style.cssText = `
            user-select: none;
            position: absolute;
            white-space: pre;
            pointer-events: none;
            perspective: 500px;
            display: inline-block;
            will-change: transform;
            font-weight: normal;
            line-height: 1.125;
            visibility: hidden;
            font-family: SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif;
            text-shadow: rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px;
        `;
        return $ref;
    }
    getReady() {
        const { currentTime  } = this.art;
        return this.queue.filter((danmu)=>{
            return danmu.$state === 'ready' || danmu.$state === 'wait' && currentTime + 0.1 >= danmu.time && danmu.time >= currentTime - 0.1;
        });
    }
    getEmits() {
        const result = [];
        const { clientWidth  } = this.$player;
        const clientLeft = this.getLeft(this.$player);
        this.filter('emit', (danmu)=>{
            const top = danmu.$ref.offsetTop;
            const left = this.getLeft(danmu.$ref) - clientLeft;
            const height = danmu.$ref.clientHeight;
            const width = danmu.$ref.clientWidth;
            const distance = left + width;
            const right = clientWidth - distance;
            const speed = distance / danmu.$restTime;
            const emit = {};
            emit.top = top;
            emit.left = left;
            emit.height = height;
            emit.width = width;
            emit.right = right;
            emit.speed = speed;
            emit.distance = distance;
            emit.time = danmu.$restTime;
            emit.mode = danmu.mode;
            result.push(emit);
        });
        return result;
    }
    postMessage(message = {}) {
        return new Promise((resolve)=>{
            message.id = Date.now();
            this.worker.postMessage(message);
            this.worker.onmessage = (event)=>{
                const { data  } = event;
                if (data.id === message.id) resolve(data);
            };
        });
    }
    async load() {
        try {
            let danmus = [];
            if (typeof this.option.danmuku === 'function') danmus = await this.option.danmuku();
            else if (typeof this.option.danmuku.then === 'function') danmus = await this.option.danmuku;
            else if (typeof this.option.danmuku === 'string') danmus = await _bilibili.bilibiliDanmuParseFromUrl(this.option.danmuku);
            else danmus = this.option.danmuku;
            this.utils.errorHandle(Array.isArray(danmus), 'Danmuku need return an array as result');
            this.art.emit('artplayerPluginDanmuku:loaded', danmus);
            this.queue = [];
            this.$danmuku.innerText = '';
            danmus.forEach((danmu)=>this.emit(danmu)
            );
        } catch (error) {
            this.art.emit('artplayerPluginDanmuku:error', error);
            throw error;
        }
        return this;
    }
    config(option) {
        const { clamp  } = this.utils;
        this.option = Object.assign({}, Danmuku.option, this.option, option);
        this.validator(this.option, Danmuku.scheme);
        if (option.fontSize) this.reset();
        this.option.speed = clamp(this.option.speed, 1, 10);
        this.option.opacity = clamp(this.option.opacity, 0, 1);
        this.option.fontSize = clamp(this.option.fontSize, 12, 100);
        this.art.emit('artplayerPluginDanmuku:config', this.option);
        return this;
    }
    makeWait(danmu) {
        danmu.$state = 'wait';
        if (danmu.$ref) {
            danmu.$ref.style.visibility = 'hidden';
            danmu.$ref.style.marginLeft = '0px';
            danmu.$ref.style.transform = 'translateX(0px)';
            danmu.$ref.style.transition = 'transform 0s linear 0s';
            this.$refs.push(danmu.$ref);
            danmu.$ref = null;
        }
    }
    continue() {
        const { clientWidth  } = this.$player;
        this.filter('stop', (danmu)=>{
            danmu.$state = 'emit';
            danmu.$lastStartTime = Date.now();
            switch(danmu.mode){
                case 0:
                    {
                        const translateX = clientWidth + danmu.$ref.clientWidth;
                        danmu.$ref.style.transform = `translateX(${-translateX}px)`;
                        danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
                        break;
                    }
                default:
                    break;
            }
        });
        return this;
    }
    suspend() {
        const { clientWidth  } = this.$player;
        this.filter('emit', (danmu)=>{
            danmu.$state = 'stop';
            switch(danmu.mode){
                case 0:
                    {
                        const translateX = clientWidth - (this.getLeft(danmu.$ref) - this.getLeft(this.$player));
                        danmu.$ref.style.transform = `translateX(${-translateX}px)`;
                        danmu.$ref.style.transition = 'transform 0s linear 0s';
                        break;
                    }
                default:
                    break;
            }
        });
        return this;
    }
    reset() {
        this.queue.forEach((danmu)=>this.makeWait(danmu)
        );
    }
    update() {
        const { clientWidth  } = this.$player;
        this.timer = window.requestAnimationFrame(async ()=>{
            if (this.art.playing && !this.isHide) {
                this.filter('emit', (danmu)=>{
                    const emitTime = (Date.now() - danmu.$lastStartTime) / 1000;
                    danmu.$restTime -= emitTime;
                    danmu.$lastStartTime = Date.now();
                    if (danmu.$restTime <= 0) this.makeWait(danmu);
                });
                const readys = this.getReady();
                for(let index = 0; index < readys.length; index++){
                    const danmu = readys[index];
                    danmu.$ref = this.getRef();
                    danmu.$ref.innerText = danmu.text;
                    this.$danmuku.appendChild(danmu.$ref);
                    danmu.$ref.style.left = `${clientWidth}px`;
                    danmu.$ref.style.opacity = this.option.opacity;
                    danmu.$ref.style.fontSize = `${this.option.fontSize}px`;
                    danmu.$ref.style.color = danmu.color || '#fff';
                    danmu.$ref.style.border = danmu.border ? `1px solid ${danmu.color || '#fff'}` : 'none';
                    danmu.$ref.style.marginLeft = '0px';
                    danmu.$lastStartTime = Date.now();
                    danmu.$restTime = this.option.synchronousPlayback && this.art.playbackRate ? this.option.speed / Number(this.art.playbackRate) : this.option.speed;
                    const target = {
                        mode: danmu.mode,
                        height: danmu.$ref.clientHeight,
                        speed: (clientWidth + danmu.$ref.clientWidth) / danmu.$restTime
                    };
                    const { top  } = await this.postMessage({
                        target,
                        emits: this.getEmits(),
                        antiOverlap: this.option.antiOverlap,
                        clientWidth: this.$player.clientWidth,
                        clientHeight: this.$player.clientHeight,
                        marginBottom: this.marginBottom,
                        marginTop: this.marginTop
                    });
                    if (!this.isStop && top !== undefined) {
                        danmu.$state = 'emit';
                        danmu.$ref.style.visibility = 'visible';
                        switch(danmu.mode){
                            case 0:
                                {
                                    danmu.$ref.style.top = `${top}px`;
                                    const translateX = clientWidth + danmu.$ref.clientWidth;
                                    danmu.$ref.style.transform = `translateX(${-translateX}px)`;
                                    danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
                                    break;
                                }
                            case 1:
                                danmu.$ref.style.left = '50%';
                                danmu.$ref.style.top = `${top}px`;
                                danmu.$ref.style.marginLeft = `-${danmu.$ref.clientWidth / 2}px`;
                                break;
                            default:
                                break;
                        }
                    } else {
                        danmu.$state = 'ready';
                        this.$refs.push(danmu.$ref);
                        danmu.$ref = null;
                    }
                }
            }
            if (!this.isStop) this.update();
        });
        return this;
    }
    stop() {
        this.isStop = true;
        this.suspend();
        window.cancelAnimationFrame(this.timer);
        this.art.emit('artplayerPluginDanmuku:stop');
        return this;
    }
    start() {
        this.isStop = false;
        this.continue();
        this.update();
        this.art.emit('artplayerPluginDanmuku:start');
        return this;
    }
    show() {
        this.isHide = false;
        this.$danmuku.style.display = 'block';
        this.art.emit('artplayerPluginDanmuku:show');
        return this;
    }
    hide() {
        this.isHide = true;
        this.$danmuku.style.display = 'none';
        this.art.emit('artplayerPluginDanmuku:hide');
        return this;
    }
    emit(danmu) {
        this.validator(danmu, {
            text: 'string',
            mode: 'number|undefined',
            color: 'string|undefined',
            time: 'number|undefined',
            border: 'boolean|undefined'
        });
        if (!danmu.text.trim()) return this;
        if (!this.option.filter(danmu)) return this;
        if (danmu.time) danmu.time = this.utils.clamp(danmu.time, 0, Infinity);
        else danmu.time = this.art.currentTime + 0.5;
        this.queue.push({
            mode: 0,
            ...danmu,
            $state: 'wait',
            $ref: null,
            $restTime: 0,
            $lastStartTime: 0
        });
        return this;
    }
}
exports.default = Danmuku;

},{"./bilibili":"6a8GK","@parcel/transformer-js/src/esmodule-helpers.js":"6SDkN","85d40535eae5f839":"cDlY2"}],"6a8GK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getMode", ()=>getMode
);
parcelHelpers.export(exports, "bilibiliDanmuParseFromXml", ()=>bilibiliDanmuParseFromXml
);
parcelHelpers.export(exports, "bilibiliDanmuParseFromUrl", ()=>bilibiliDanmuParseFromUrl
);
function getMode(key) {
    switch(key){
        case 1:
        case 2:
        case 3:
            return 0;
        case 4:
        case 5:
            return 1;
        default:
            return 0;
    }
}
function bilibiliDanmuParseFromXml(xmlString) {
    if (typeof xmlString !== 'string') return [];
    const srtList = xmlString.match(/<d([\S ]*?>[\S ]*?)<\/d>/gi);
    return srtList && srtList.length ? srtList.map((item)=>{
        const [, attrStr, text] = item.match(/<d p="(.+)">(.+)<\/d>/);
        const attr = attrStr.split(',');
        return attr.length === 8 && text.trim() ? {
            text,
            time: Number(attr[0]),
            mode: getMode(Number(attr[1])),
            fontSize: Number(attr[2]),
            color: `#${Number(attr[3]).toString(16)}`,
            timestamp: Number(attr[4]),
            pool: Number(attr[5]),
            userID: attr[6],
            rowID: Number(attr[7])
        } : null;
    }) : [];
}
function bilibiliDanmuParseFromUrl(url) {
    return fetch(url).then((res)=>res.text()
    ).then((xmlString)=>bilibiliDanmuParseFromXml(xmlString)
    );
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"6SDkN"}],"6SDkN":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"cDlY2":[function(require,module,exports) {
module.exports = "data:application/javascript,function%20getDanmuTop%28%7B%20target%20%2C%20emits%20%2C%20clientWidth%20%2C%20clientHeight%20%2C%20marginBottom%20%2C%20marginTop%20%2C%20antiOverlap%20%20%7D%29%20%7B%0A%20%20%20%20const%20danmus%20%3D%20emits.filter%28%28item%29%3D%3Eitem.mode%20%3D%3D%3D%20target.mode%20%26%26%20item.top%20%3C%3D%20clientHeight%20-%20marginBottom%0A%20%20%20%20%29.sort%28%28prev%2C%20next%29%3D%3Eprev.top%20-%20next.top%0A%20%20%20%20%29%3B%0A%20%20%20%20if%20%28danmus.length%20%3D%3D%3D%200%29%20return%20marginTop%3B%0A%20%20%20%20danmus.unshift%28%7B%0A%20%20%20%20%20%20%20%20top%3A%200%2C%0A%20%20%20%20%20%20%20%20left%3A%200%2C%0A%20%20%20%20%20%20%20%20right%3A%200%2C%0A%20%20%20%20%20%20%20%20height%3A%20marginTop%2C%0A%20%20%20%20%20%20%20%20width%3A%20clientWidth%2C%0A%20%20%20%20%20%20%20%20speed%3A%200%2C%0A%20%20%20%20%20%20%20%20distance%3A%20clientWidth%0A%20%20%20%20%7D%29%3B%0A%20%20%20%20danmus.push%28%7B%0A%20%20%20%20%20%20%20%20top%3A%20clientHeight%20-%20marginBottom%2C%0A%20%20%20%20%20%20%20%20left%3A%200%2C%0A%20%20%20%20%20%20%20%20right%3A%200%2C%0A%20%20%20%20%20%20%20%20height%3A%20marginBottom%2C%0A%20%20%20%20%20%20%20%20width%3A%20clientWidth%2C%0A%20%20%20%20%20%20%20%20speed%3A%200%2C%0A%20%20%20%20%20%20%20%20distance%3A%20clientWidth%0A%20%20%20%20%7D%29%3B%0A%20%20%20%20for%28let%20index%20%3D%201%3B%20index%20%3C%20danmus.length%3B%20index%20%2B%3D%201%29%7B%0A%20%20%20%20%20%20%20%20const%20item%20%3D%20danmus%5Bindex%5D%3B%0A%20%20%20%20%20%20%20%20const%20prev%20%3D%20danmus%5Bindex%20-%201%5D%3B%0A%20%20%20%20%20%20%20%20const%20prevBottom%20%3D%20prev.top%20%2B%20prev.height%3B%0A%20%20%20%20%20%20%20%20const%20diff%20%3D%20item.top%20-%20prevBottom%3B%0A%20%20%20%20%20%20%20%20if%20%28diff%20%3E%3D%20target.height%29%20return%20prevBottom%3B%0A%20%20%20%20%7D%0A%20%20%20%20const%20topMap%20%3D%20%5B%5D%3B%0A%20%20%20%20for%28let%20index1%20%3D%201%3B%20index1%20%3C%20danmus.length%20-%201%3B%20index1%20%2B%3D%201%29%7B%0A%20%20%20%20%20%20%20%20const%20item%20%3D%20danmus%5Bindex1%5D%3B%0A%20%20%20%20%20%20%20%20if%20%28topMap.length%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20const%20last%20%3D%20topMap%5BtopMap.length%20-%201%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20if%20%28last%5B0%5D.top%20%3D%3D%3D%20item.top%29%20last.push%28item%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20else%20topMap.push%28%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20item%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%29%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20topMap.push%28%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20item%0A%20%20%20%20%20%20%20%20%5D%29%3B%0A%20%20%20%20%7D%0A%20%20%20%20if%20%28antiOverlap%29%20switch%28target.mode%29%7B%0A%20%20%20%20%20%20%20%20case%200%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20result%20%3D%20topMap.find%28%28list%29%3D%3E%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20list.every%28%28danmu%29%3D%3E%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20%28clientWidth%20%3C%20danmu.distance%29%20return%20false%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20%28target.speed%20%3C%20danmu.speed%29%20return%20true%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20overlapTime%20%3D%20danmu.right%20%2F%20%28target.speed%20-%20danmu.speed%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20%28overlapTime%20%3E%20danmu.time%29%20return%20true%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20false%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20result%20%26%26%20result%5B0%5D%20%3F%20result%5B0%5D.top%20%3A%20undefined%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20case%201%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20undefined%3B%0A%20%20%20%20%20%20%20%20default%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%7D%0A%20%20%20%20else%20%7B%0A%20%20%20%20%20%20%20%20switch%28target.mode%29%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20case%200%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20topMap.sort%28%28prev%2C%20next%29%3D%3E%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20nextMinRight%20%3D%20Math.min%28...next.map%28%28item%29%3D%3Eitem.right%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%29%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20prevMinRight%20%3D%20Math.min%28...prev.map%28%28item%29%3D%3Eitem.right%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%29%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20nextMinRight%20%2a%20next.length%20-%20prevMinRight%20%2a%20prev.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20case%201%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20topMap.sort%28%28prev%2C%20next%29%3D%3E%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20nextMaxWidth%20%3D%20Math.max%28...next.map%28%28item%29%3D%3Eitem.width%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%29%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20prevMaxWidth%20%3D%20Math.max%28...prev.map%28%28item%29%3D%3Eitem.width%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%29%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20prevMaxWidth%20%2a%20prev.length%20-%20nextMaxWidth%20%2a%20next.length%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20default%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20break%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20return%20topMap%5B0%5D%5B0%5D.top%3B%0A%20%20%20%20%7D%0A%7D%0Aonmessage%20%3D%20%28event%29%3D%3E%7B%0A%20%20%20%20const%20%7B%20data%20%20%7D%20%3D%20event%3B%0A%20%20%20%20const%20top%20%3D%20getDanmuTop%28data%29%3B%0A%20%20%20%20self.postMessage%28%7B%0A%20%20%20%20%20%20%20%20top%2C%0A%20%20%20%20%20%20%20%20id%3A%20data.id%0A%20%20%20%20%7D%29%3B%0A%7D%3B%0A%0A";

},{}]},["gEVO5"], "gEVO5", "parcelRequire93cf")

//# sourceMappingURL=index.js.map

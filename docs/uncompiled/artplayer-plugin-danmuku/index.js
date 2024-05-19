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
})({"lIf7X":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _danmuku = require("./danmuku");
var _danmukuDefault = parcelHelpers.interopDefault(_danmuku);
var _setting = require("./setting");
var _settingDefault = parcelHelpers.interopDefault(_setting);
var _heatmap = require("./heatmap");
var _heatmapDefault = parcelHelpers.interopDefault(_heatmap);
function artplayerPluginDanmuku(option) {
    return (art)=>{
        const danmuku = new (0, _danmukuDefault.default)(art, option);
        let setting = null;
        if (danmuku.option.mount) setting = new (0, _settingDefault.default)(art, danmuku);
        if (option.heatmap) (0, _heatmapDefault.default)(art, danmuku, option.heatmap);
        return {
            name: "artplayerPluginDanmuku",
            emit: danmuku.emit.bind(danmuku),
            load: danmuku.load.bind(danmuku),
            config: danmuku.config.bind(danmuku),
            hide: danmuku.hide.bind(danmuku),
            show: danmuku.show.bind(danmuku),
            reset: danmuku.reset.bind(danmuku),
            mount: setting?.mount,
            get option () {
                return danmuku.option;
            },
            get isHide () {
                return danmuku.isHide;
            },
            get isStop () {
                return danmuku.isStop;
            }
        };
    };
}
exports.default = artplayerPluginDanmuku;
if (typeof window !== "undefined") window["artplayerPluginDanmuku"] = artplayerPluginDanmuku;

},{"./danmuku":"cv7fe","./setting":"cI0ih","./heatmap":"bZziT","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"cv7fe":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _bilibili = require("./bilibili");
var _worker = require("bundle-text:./worker");
var _workerDefault = parcelHelpers.interopDefault(_worker);
class Danmuku {
    constructor(art, option){
        const { constructor , template  } = art;
        this.utils = constructor.utils; // 工具库
        this.validator = constructor.validator; // 配置校验器
        this.$danmuku = template.$danmuku; // 弹幕层容器
        this.$player = template.$player; // 播放器容器
        this.art = art;
        this.danmus = []; // 原始弹幕数据
        this.queue = []; // 实际弹幕队列
        this.option = {}; // 格式化后的配置项
        this.$refs = []; // 弹幕DOM节点池
        this.isStop = false; // 是否停止
        this.isHide = false; // 是否隐藏
        this.timer = null; // 定时器
        this.config(option); // 动态配置
        // 创建 Web Worker, 用于计算弹幕的 top 值
        this.worker = new Worker(URL.createObjectURL(new Blob([
            (0, _workerDefault.default)
        ])));
        // 绑定公用事件
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.reset = this.reset.bind(this);
        this.destroy = this.destroy.bind(this);
        // 监听事件
        art.on("video:play", this.start);
        art.on("video:playing", this.start);
        art.on("video:pause", this.stop);
        art.on("video:waiting", this.stop);
        art.on("resize", this.reset);
        art.on("destroy", this.destroy);
        // 开始加载弹幕
        this.load();
    }
    // 默认配置
    static get option() {
        return {
            danmuku: [],
            speed: 5,
            margin: [
                "2%",
                "25%"
            ],
            opacity: 1,
            color: "#FFFFFF",
            mode: 0,
            fontSize: 25,
            filter: ()=>true,
            antiOverlap: true,
            synchronousPlayback: false,
            mount: ".art-controls-center",
            style: {
                "--art-theme-color": "#FF0000"
            },
            heatmap: false,
            points: [],
            beforeEmit: ()=>true
        };
    }
    // 配置校验
    static get scheme() {
        return {
            danmuku: "array|function|string",
            speed: "number",
            margin: "array",
            opacity: "number",
            color: "string",
            mode: "number",
            fontSize: "number|string",
            filter: "function",
            antiOverlap: "boolean",
            synchronousPlayback: "boolean",
            mount: "?htmldivelement|string",
            style: "object",
            heatmap: "object|boolean",
            points: "array",
            beforeEmit: "function"
        };
    }
    // 初始弹幕样式
    static get cssText() {
        return `
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
    }
    // 是否在移动端使用了自动旋屏，会影响弹幕的left和top值
    get isRotate() {
        return this.art.plugins?.autoOrientation?.state;
    }
    // 计算上空白边距
    get marginTop() {
        const { clamp  } = this.utils;
        const value = this.option.margin[0];
        const { clientHeight  } = this.$player;
        if (typeof value === "number") return clamp(value, 0, clientHeight);
        if (typeof value === "string" && value.endsWith("%")) {
            const ratio = parseFloat(value) / 100;
            return clamp(clientHeight * ratio, 0, clientHeight);
        }
        return Danmuku.option.margin[0];
    }
    // 计算下空白边距
    get marginBottom() {
        const { clamp  } = this.utils;
        const value = this.option.margin[1];
        const { clientHeight  } = this.$player;
        if (typeof value === "number") return clamp(value, 0, clientHeight);
        if (typeof value === "string" && value.endsWith("%")) {
            const ratio = parseFloat(value) / 100;
            return clamp(clientHeight * ratio, 0, clientHeight);
        }
        return Danmuku.option.margin[1];
    }
    // 加载弹幕
    async load() {
        const { errorHandle  } = this.utils;
        try {
            if (typeof this.option.danmuku === "function") this.danmus = await this.option.danmuku();
            else if (typeof this.option.danmuku.then === "function") this.danmus = await this.option.danmuku;
            else if (typeof this.option.danmuku === "string") this.danmus = await (0, _bilibili.bilibiliDanmuParseFromUrl)(this.option.danmuku);
            else this.danmus = this.option.danmuku;
            errorHandle(Array.isArray(this.danmus), "Danmuku need return an array as result");
            this.queue = []; // 清空实际弹幕队列
            this.$danmuku.innerText = ""; // 清空弹幕层
            this.danmus.forEach((danmu)=>this.emit(danmu)); // 逐个验证原始弹幕并转换为实际弹幕
            this.art.emit("artplayerPluginDanmuku:loaded", this.queue);
        // TODO: 按时间从小到大排序，用于减少弹幕的遍历次数，待优化...
        // this.queue = this.queue.sort((a, b) => a.time - b.time);
        } catch (error) {
            this.art.emit("artplayerPluginDanmuku:error", error);
            throw error;
        }
        return this;
    }
    // 把原始弹幕转换为实际弹幕
    emit(danmu) {
        const { clamp  } = this.utils;
        this.validator(danmu, {
            text: "string",
            mode: "?number",
            color: "?string",
            time: "?number",
            border: "?boolean",
            style: "?object",
            escape: "?boolean"
        });
        // 弹幕文本为空则直接忽略
        if (!danmu.text.trim()) return this;
        // 弹幕模式只能是 0, 1, 2
        if (![
            0,
            1,
            2
        ].includes(danmu.mode)) return this;
        // 自定义弹幕过滤函数
        if (!this.option.filter(danmu)) return this;
        // 设置弹幕时间，如果没有则默认为当前时间加 0.5 秒
        if (danmu.time) danmu.time = clamp(danmu.time, 0, Infinity);
        else danmu.time = this.art.currentTime + 0.5;
        // 设置弹幕模式，如果没有则默认为全局配置
        if (danmu.mode === undefined) danmu.mode = this.option.mode;
        // 设置弹幕单独样式，如果没有则默认为空对象
        if (danmu.style === undefined) danmu.style = {};
        // 设置弹幕弹幕是否转义，如果没有则默认为 true，即不会显示 HTML 标签
        if (danmu.escape === undefined) danmu.escape = true;
        // 设置弹幕颜色，如果没有则默认为全局配置
        if (danmu.color === undefined) danmu.color = this.option.color;
        // 添加到实际弹幕队列
        this.queue.push({
            ...danmu,
            $state: "wait",
            $ref: null,
            $restTime: 0,
            $lastStartTime: 0
        });
        // 弹幕有四个状态：
        // - wait: 弹幕还未开始显示，没有被添加到 DOM 中
        // - ready: 弹幕准备好显示，没有被添加到 DOM 中
        // - emit: 弹幕正在显示，已经被添加到 DOM 中
        // - stop: 弹幕正在停止显示，已经被添加到 DOM 中
        return this;
    }
    // 动态配置
    config(option) {
        const { clamp  } = this.utils;
        this.option = Object.assign({}, Danmuku.option, this.option, option);
        this.validator(this.option, Danmuku.scheme);
        this.option.speed = clamp(this.option.speed, 1, 10);
        this.option.opacity = clamp(this.option.opacity, 0, 1);
        this.option.style = Object.assign({}, Danmuku.option.style, this.option.style);
        // 重新计算弹幕字体大小，需要重新渲染
        if (option.fontSize) {
            this.option.fontSize = this.getFontSize(this.option.fontSize);
            this.reset();
        }
        this.art.emit("artplayerPluginDanmuku:config", this.option);
        return this;
    }
    // 计算DOM的left值，受到旋屏影响
    getLeft($ref) {
        const rect = $ref.getBoundingClientRect();
        return this.isRotate ? rect.top : rect.left;
    }
    // 获取弹幕DOM节点
    getRef() {
        const $ref = this.$refs.pop() || document.createElement("div");
        $ref.style.cssText = Danmuku.cssText;
        // 为了移除用户自定义的样式
        $ref.className = "";
        $ref.id = "";
        return $ref;
    }
    // 计算弹幕字体大小
    getFontSize(fontSize) {
        const { clamp  } = this.utils;
        const { clientHeight  } = this.$player;
        if (typeof fontSize === "number") return clamp(fontSize, 12, clientHeight);
        if (typeof fontSize === "string" && fontSize.endsWith("%")) {
            const ratio = parseFloat(fontSize) / 100;
            return clamp(clientHeight * ratio, 12, clientHeight);
        }
        return Danmuku.option.fontSize;
    }
    // 计算弹幕的top值
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
    // 根据状态，获取弹幕队列中的弹幕
    filter(state, callback) {
        return this.queue.filter((danmu)=>danmu.$state === state).map(callback);
    }
    // 获取准备好发送的弹幕：有的是ready状态（如之前因为弹幕太多而暂停发送的弹幕），有的是wait状态
    getReady() {
        const { currentTime  } = this.art;
        return this.queue.filter((danmu)=>{
            return danmu.$state === "ready" || danmu.$state === "wait" && currentTime + 0.1 >= danmu.time && danmu.time >= currentTime - 0.1;
        });
    }
    // 获取正在发送的弹幕，用于计算下一个弹幕的top值
    getEmits() {
        const result = [];
        const { clientWidth  } = this.$player;
        const clientLeft = this.getLeft(this.$player);
        this.filter("emit", (danmu)=>{
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
    // 重置弹幕到wait状态，回收弹幕DOM节点
    makeWait(danmu) {
        danmu.$state = "wait";
        if (danmu.$ref) {
            danmu.$ref.style.cssText = Danmuku.cssText;
            this.$refs.push(danmu.$ref);
            danmu.$ref = null;
        }
    }
    // 实时更新弹幕
    update() {
        const { setStyles  } = this.utils;
        this.timer = window.requestAnimationFrame(async ()=>{
            if (this.art.playing && !this.isHide) {
                // 实时计算弹幕的剩余显示时间
                this.filter("emit", (danmu)=>{
                    const emitTime = (Date.now() - danmu.$lastStartTime) / 1000;
                    danmu.$restTime -= emitTime;
                    danmu.$lastStartTime = Date.now();
                    // 超过时间即重置弹幕
                    if (danmu.$restTime <= 0) this.makeWait(danmu);
                });
                // 获取准备好发送的弹幕
                const readys = this.getReady(); // 可能包含ready和wait状态的弹幕
                const { clientWidth , clientHeight  } = this.$player;
                for(let index = 0; index < readys.length; index++){
                    const danmu = readys[index];
                    danmu.$ref = this.getRef(); // 获取弹幕DOM节点
                    // 设置弹幕文本
                    if (danmu.escape) danmu.$ref.innerText = danmu.text;
                    else danmu.$ref.innerHTML = danmu.text;
                    // 提前添加到弹幕层中，用于计算top值
                    this.$danmuku.appendChild(danmu.$ref);
                    // 设置初始弹幕样式
                    danmu.$ref.style.left = `${clientWidth}px`;
                    danmu.$ref.style.opacity = this.option.opacity;
                    danmu.$ref.style.fontSize = `${this.option.fontSize}px`;
                    danmu.$ref.style.color = danmu.color;
                    danmu.$ref.style.border = danmu.border ? `1px solid ${danmu.color}` : null;
                    danmu.$ref.style.backgroundColor = danmu.border ? "rgb(0 0 0 / 50%)" : null;
                    danmu.$ref.style.marginLeft = "0px";
                    // 设置单独弹幕样式
                    setStyles(danmu.$ref, danmu.style);
                    // 记录弹幕时间戳
                    danmu.$lastStartTime = Date.now();
                    // 计算弹幕剩余时间
                    danmu.$restTime = this.option.synchronousPlayback && this.art.playbackRate ? this.option.speed / Number(this.art.playbackRate) : this.option.speed;
                    // 计算弹幕的top值
                    const { top  } = await this.postMessage({
                        target: {
                            mode: danmu.mode,
                            height: danmu.$ref.clientHeight,
                            speed: (clientWidth + danmu.$ref.clientWidth) / danmu.$restTime
                        },
                        emits: this.getEmits(),
                        antiOverlap: this.option.antiOverlap,
                        clientWidth: clientWidth,
                        clientHeight: clientHeight,
                        marginBottom: this.marginBottom,
                        marginTop: this.marginTop
                    });
                    if (danmu.$ref) {
                        if (!this.isStop && top !== undefined) {
                            danmu.$state = "emit"; // 转换为emit状态
                            danmu.$ref.style.visibility = "visible";
                            switch(danmu.mode){
                                // 滚动的弹幕
                                case 0:
                                    {
                                        danmu.$ref.style.top = `${top}px`;
                                        const translateX = clientWidth + danmu.$ref.clientWidth;
                                        danmu.$ref.style.transform = `translateX(${-translateX}px)`;
                                        danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
                                        break;
                                    }
                                // 顶部的弹幕
                                case 1:
                                // 底部的弹幕
                                case 2:
                                    danmu.$ref.style.left = "50%";
                                    danmu.$ref.style.top = `${top}px`;
                                    danmu.$ref.style.marginLeft = `-${danmu.$ref.clientWidth / 2}px`;
                                    break;
                                default:
                                    break;
                            }
                            this.art.emit("artplayerPluginDanmuku:visible", danmu);
                        } else {
                            // 假如弹幕已经停止或者没有 top 值，则重置弹幕为ready状态，回收弹幕DOM节点，等待下次发送
                            danmu.$state = "ready";
                            this.$refs.push(danmu.$ref);
                            danmu.$ref = null;
                        }
                    }
                }
            }
            // 递归调用
            if (!this.isStop) this.update();
        });
        return this;
    }
    // 继续弹幕
    continue() {
        const { clientWidth  } = this.$player;
        this.filter("stop", (danmu)=>{
            danmu.$state = "emit"; // 转换为emit状态
            danmu.$lastStartTime = Date.now();
            switch(danmu.mode){
                // 继续滚动的弹幕
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
    // 暂停弹幕
    suspend() {
        const { clientWidth  } = this.$player;
        this.filter("emit", (danmu)=>{
            danmu.$state = "stop"; // 转换为stop状态
            switch(danmu.mode){
                // 停止滚动的弹幕
                case 0:
                    {
                        const translateX = clientWidth - (this.getLeft(danmu.$ref) - this.getLeft(this.$player));
                        danmu.$ref.style.transform = `translateX(${-translateX}px)`;
                        danmu.$ref.style.transition = "transform 0s linear 0s";
                        break;
                    }
                default:
                    break;
            }
        });
        return this;
    }
    stop() {
        this.isStop = true;
        this.suspend();
        window.cancelAnimationFrame(this.timer);
        this.art.emit("artplayerPluginDanmuku:stop");
        return this;
    }
    start() {
        this.isStop = false;
        this.continue();
        this.update();
        this.art.emit("artplayerPluginDanmuku:start");
        return this;
    }
    reset() {
        this.queue.forEach((danmu)=>this.makeWait(danmu));
        return this;
    }
    show() {
        this.isHide = false;
        this.start();
        this.$danmuku.style.display = "";
        this.art.emit("artplayerPluginDanmuku:show");
        return this;
    }
    hide() {
        this.isHide = true;
        this.stop();
        this.queue.forEach((item)=>this.makeWait(item));
        this.$danmuku.style.display = "none";
        this.art.emit("artplayerPluginDanmuku:hide");
        return this;
    }
    destroy() {
        this.stop();
        this.worker?.terminate?.();
        this.art.off("video:play", this.start);
        this.art.off("video:playing", this.start);
        this.art.off("video:pause", this.stop);
        this.art.off("video:waiting", this.stop);
        this.art.off("resize", this.reset);
        this.art.off("destroy", this.destroy);
        this.art.emit("artplayerPluginDanmuku:destroy");
    }
}
exports.default = Danmuku;

},{"./bilibili":"95SuC","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6","bundle-text:./worker":"el0Wt"}],"95SuC":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getMode", ()=>getMode);
parcelHelpers.export(exports, "bilibiliDanmuParseFromXml", ()=>bilibiliDanmuParseFromXml);
parcelHelpers.export(exports, "bilibiliDanmuParseFromUrl", ()=>bilibiliDanmuParseFromUrl);
function getMode(key) {
    switch(key){
        case 1:
        case 2:
        case 3:
            return 0; // 滚动
        case 4:
            return 2; // 底部
        case 5:
            return 1; // 顶部
        default:
            return 0;
    }
}
function bilibiliDanmuParseFromXml(xmlString) {
    if (typeof xmlString !== "string") return [];
    const matches = xmlString.matchAll(/<d (?:.*? )??p="(?<p>.+?)"(?: .*?)?>(?<text>.+?)<\/d>/gs);
    return Array.from(matches).map((match)=>{
        const attr = match.groups.p.split(",");
        if (attr.length >= 8) {
            const text = match.groups.text.trim().replaceAll("&quot;", '"').replaceAll("&apos;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
            return {
                text,
                time: Number(attr[0]),
                mode: getMode(Number(attr[1])),
                fontSize: Number(attr[2]),
                color: `#${Number(attr[3]).toString(16)}`,
                timestamp: Number(attr[4]),
                pool: Number(attr[5]),
                userID: attr[6],
                rowID: Number(attr[7])
            };
        } else return null;
    }).filter(Boolean);
}
async function bilibiliDanmuParseFromUrl(url) {
    const res = await fetch(url);
    const xmlString = await res.text();
    return bilibiliDanmuParseFromXml(xmlString);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"5dUr6":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
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

},{}],"el0Wt":[function(require,module,exports) {
module.exports = "// modules are defined as an array\n// [ module function, map of requires ]\n//\n// map of requires is short require name -> numeric require\n//\n// anything defined in a previous bundle is accessed via the\n// orig method which is the require for previous bundles\n\n(function (modules, entry, mainEntry, parcelRequireName, globalName) {\n  /* eslint-disable no-undef */\n  var globalObject =\n    typeof globalThis !== 'undefined'\n      ? globalThis\n      : typeof self !== 'undefined'\n      ? self\n      : typeof window !== 'undefined'\n      ? window\n      : typeof global !== 'undefined'\n      ? global\n      : {};\n  /* eslint-enable no-undef */\n\n  // Save the require from previous bundle to this closure if any\n  var previousRequire =\n    typeof globalObject[parcelRequireName] === 'function' &&\n    globalObject[parcelRequireName];\n\n  var cache = previousRequire.cache || {};\n  // Do not use `require` to prevent Webpack from trying to bundle this call\n  var nodeRequire =\n    typeof module !== 'undefined' &&\n    typeof module.require === 'function' &&\n    module.require.bind(module);\n\n  function newRequire(name, jumped) {\n    if (!cache[name]) {\n      if (!modules[name]) {\n        // if we cannot find the module within our internal map or\n        // cache jump to the current global require ie. the last bundle\n        // that was added to the page.\n        var currentRequire =\n          typeof globalObject[parcelRequireName] === 'function' &&\n          globalObject[parcelRequireName];\n        if (!jumped && currentRequire) {\n          return currentRequire(name, true);\n        }\n\n        // If there are other bundles on this page the require from the\n        // previous one is saved to 'previousRequire'. Repeat this as\n        // many times as there are bundles until the module is found or\n        // we exhaust the require chain.\n        if (previousRequire) {\n          return previousRequire(name, true);\n        }\n\n        // Try the node require function if it exists.\n        if (nodeRequire && typeof name === 'string') {\n          return nodeRequire(name);\n        }\n\n        var err = new Error(\"Cannot find module '\" + name + \"'\");\n        err.code = 'MODULE_NOT_FOUND';\n        throw err;\n      }\n\n      localRequire.resolve = resolve;\n      localRequire.cache = {};\n\n      var module = (cache[name] = new newRequire.Module(name));\n\n      modules[name][0].call(\n        module.exports,\n        localRequire,\n        module,\n        module.exports,\n        this\n      );\n    }\n\n    return cache[name].exports;\n\n    function localRequire(x) {\n      var res = localRequire.resolve(x);\n      return res === false ? {} : newRequire(res);\n    }\n\n    function resolve(x) {\n      var id = modules[name][1][x];\n      return id != null ? id : x;\n    }\n  }\n\n  function Module(moduleName) {\n    this.id = moduleName;\n    this.bundle = newRequire;\n    this.exports = {};\n  }\n\n  newRequire.isParcelRequire = true;\n  newRequire.Module = Module;\n  newRequire.modules = modules;\n  newRequire.cache = cache;\n  newRequire.parent = previousRequire;\n  newRequire.register = function (id, exports) {\n    modules[id] = [\n      function (require, module) {\n        module.exports = exports;\n      },\n      {},\n    ];\n  };\n\n  Object.defineProperty(newRequire, 'root', {\n    get: function () {\n      return globalObject[parcelRequireName];\n    },\n  });\n\n  globalObject[parcelRequireName] = newRequire;\n\n  for (var i = 0; i < entry.length; i++) {\n    newRequire(entry[i]);\n  }\n\n  if (mainEntry) {\n    // Expose entry point to Node, AMD or browser globals\n    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js\n    var mainExports = newRequire(mainEntry);\n\n    // CommonJS\n    if (typeof exports === 'object' && typeof module !== 'undefined') {\n      module.exports = mainExports;\n\n      // RequireJS\n    } else if (typeof define === 'function' && define.amd) {\n      define(function () {\n        return mainExports;\n      });\n\n      // <script>\n    } else if (globalName) {\n      this[globalName] = mainExports;\n    }\n  }\n})({\"fHwfs\":[function(require,module,exports) {\nfunction getDanmuTop({ target , emits , clientWidth , clientHeight , marginBottom , marginTop , antiOverlap  }) {\n    // 弹幕最大高度\n    const maxTop = clientHeight - marginBottom;\n    // 过滤同模式的弹幕，即每种模式各不影响\n    const danmus = emits.filter((item)=>item.mode === target.mode && item.top <= maxTop).sort((prev, next)=>prev.top - next.top);\n    // 如果没有同模式的弹幕，直接返回\n    if (danmus.length === 0) {\n        if (target.mode === 2) return maxTop - target.height;\n        else return marginTop;\n    }\n    // 上下各加一个虚拟弹幕，方便计算\n    danmus.unshift({\n        type: \"top\",\n        top: 0,\n        left: 0,\n        right: 0,\n        height: marginTop,\n        width: clientWidth,\n        speed: 0,\n        distance: clientWidth\n    });\n    danmus.push({\n        type: \"bottom\",\n        top: maxTop,\n        left: 0,\n        right: 0,\n        height: marginBottom,\n        width: clientWidth,\n        speed: 0,\n        distance: clientWidth\n    });\n    // 查找是否有多余的缝隙足以容纳当前弹幕\n    if (target.mode === 2) // 倒序查找\n    for(let index = danmus.length - 2; index >= 0; index -= 1){\n        const item = danmus[index];\n        const prev = danmus[index + 1];\n        const itemBottom = item.top + item.height;\n        const diff = prev.top - itemBottom;\n        if (diff >= target.height) return prev.top - target.height;\n    }\n    else // 顺序查找\n    for(let index = 1; index < danmus.length; index += 1){\n        const item = danmus[index];\n        const prev = danmus[index - 1];\n        const prevBottom = prev.top + prev.height;\n        const diff = item.top - prevBottom;\n        if (diff >= target.height) return prevBottom;\n    }\n    const topMap = [];\n    for(let index = 1; index < danmus.length - 1; index += 1){\n        const item = danmus[index];\n        if (topMap.length) {\n            const last = topMap[topMap.length - 1];\n            if (last[0].top === item.top) last.push(item);\n            else topMap.push([\n                item\n            ]);\n        } else topMap.push([\n            item\n        ]);\n    }\n    if (antiOverlap) switch(target.mode){\n        case 0:\n            {\n                const result = topMap.find((list)=>{\n                    return list.every((danmu)=>{\n                        if (clientWidth < danmu.distance) return false;\n                        if (target.speed < danmu.speed) return true;\n                        const overlapTime = danmu.right / (target.speed - danmu.speed);\n                        if (overlapTime > danmu.time) return true;\n                        return false;\n                    });\n                });\n                return result && result[0] ? result[0].top : undefined;\n            }\n        // 静止弹幕没有重叠问题\n        case 1:\n        case 2:\n            return undefined;\n        default:\n            break;\n    }\n    else {\n        switch(target.mode){\n            case 0:\n                topMap.sort((prev, next)=>{\n                    const nextMinRight = Math.min(...next.map((item)=>item.right));\n                    const prevMinRight = Math.min(...prev.map((item)=>item.right));\n                    return nextMinRight * next.length - prevMinRight * prev.length;\n                });\n                break;\n            case 1:\n            case 2:\n                topMap.sort((prev, next)=>{\n                    const nextMaxWidth = Math.max(...next.map((item)=>item.width));\n                    const prevMaxWidth = Math.max(...prev.map((item)=>item.width));\n                    return prevMaxWidth * prev.length - nextMaxWidth * next.length;\n                });\n                break;\n            default:\n                break;\n        }\n        return topMap[0][0].top;\n    }\n}\nonmessage = (event)=>{\n    const { data  } = event;\n    if (!data.id) return;\n    const top = getDanmuTop(data);\n    self.postMessage({\n        top,\n        id: data.id\n    });\n};\n\n},{}]},[\"fHwfs\"], \"fHwfs\", \"parcelRequire4dc0\")\n\n";

},{}],"cI0ih":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _styleLess = require("bundle-text:./style.less");
var _styleLessDefault = parcelHelpers.interopDefault(_styleLess);
var _danmuOnSvg = require("bundle-text:./img/danmu-on.svg");
var _danmuOnSvgDefault = parcelHelpers.interopDefault(_danmuOnSvg);
var _danmuOffSvg = require("bundle-text:./img/danmu-off.svg");
var _danmuOffSvgDefault = parcelHelpers.interopDefault(_danmuOffSvg);
var _danmuConfigSvg = require("bundle-text:./img/danmu-config.svg");
var _danmuConfigSvgDefault = parcelHelpers.interopDefault(_danmuConfigSvg);
var _danmuStyleSvg = require("bundle-text:./img/danmu-style.svg");
var _danmuStyleSvgDefault = parcelHelpers.interopDefault(_danmuStyleSvg);
class Setting {
    constructor(art, danmuku){
        return {};
        function addEmitter() {
            const colors = [
                "#FE0302",
                "#FF7204",
                "#FFAA02",
                "#FFD302",
                "#FFFF00",
                "#A0EE00",
                "#00CD00",
                "#019899",
                "#4266BE",
                "#89D5FF",
                "#CC0273",
                "#222222",
                "#9B9B9B",
                "#FFFFFF"
            ].map((item)=>{
                const isCurrent = option.color === item ? " art-current" : "";
                return `<div class="art-danmuku-style-panel-color${isCurrent}" data-color="${item}" style="background-color:${item}"></div>`;
            });
            const $emitter = append($controlsCenter, `
            <div class="art-danmuku-emitter" style="max-width: ${option.maxWidth ? `${option.maxWidth}px` : "100%"}">
                <div class="art-danmuku-left">
                    <div class="art-danmuku-style">
                        <div class="art-danmuku-style-panel">
                            <div class="art-danmuku-style-panel-inner">
                                <div class="art-danmuku-style-panel-title">模式</div>
                                <div class="art-danmuku-style-panel-modes">
                                    <div class="art-danmuku-style-panel-mode art-current" data-mode="0">滚动</div>
                                    <div class="art-danmuku-style-panel-mode" data-mode="1">静止</div>
                                </div>
                                <div class="art-danmuku-style-panel-title">颜色</div>
                                <div class="art-danmuku-style-panel-colors">
                                    ${colors.join("")}
                                </div>
                            </div>
                        </div>
                    </div>
                    <input class="art-danmuku-input" maxlength="${option.maxLength}" placeholder="发个弹幕见证当下" />
                </div>
                <div class="art-danmuku-send">发送</div>
            </div>
            `);
            const $style = query(".art-danmuku-style", $emitter);
            const $input = query(".art-danmuku-input", $emitter);
            const $send = query(".art-danmuku-send", $emitter);
            const $panel = query(".art-danmuku-style-panel-inner", $emitter);
            const $modes = query(".art-danmuku-style-panel-modes", $emitter);
            const $colors = query(".art-danmuku-style-panel-colors", $emitter);
            const $layer = option.mount || append($player, '<div class="art-layer-danmuku-emitter"></div>');
            if (art.option.backdrop) addClass($panel, "art-backdrop-filter");
            if (option.theme) addClass($emitter, `art-danmuku-theme-${option.theme}`);
            let timer = null;
            let mode = option.mode;
            let color = option.color;
            append($style, $danmuStyle);
            function countdown(time) {
                if (time <= 0) {
                    timer = null;
                    $send.innerText = "发送";
                    removeClass($send, "art-disabled");
                } else {
                    $send.innerText = time;
                    timer = setTimeout(()=>countdown(time - 1), 1000);
                }
            }
            function onSend() {
                const danmu = {
                    mode,
                    color,
                    border: true,
                    text: $input.value.trim()
                };
                if (timer === null && option.beforeEmit(danmu)) {
                    $input.value = "";
                    danmuku.emit(danmu);
                    addClass($send, "art-disabled");
                    countdown(option.lockTime);
                    art.emit("artplayerPluginDanmuku:emit", danmu);
                }
            }
            function onResize() {
                if ($controlsCenter.clientWidth < option.minWidth) {
                    append($layer, $emitter);
                    setStyle($layer, "display", "flex");
                    addClass($emitter, "art-danmuku-mount");
                    if (!option.mount) setStyle($player, "marginBottom", "40px");
                } else {
                    append($controlsCenter, $emitter);
                    setStyle($layer, "display", "none");
                    removeClass($emitter, "art-danmuku-mount");
                    if (!option.mount) setStyle($player, "marginBottom", null);
                }
            }
            art.proxy($send, "click", onSend);
            art.proxy($input, "keypress", (event)=>{
                if (event.key === "Enter") {
                    event.preventDefault();
                    onSend();
                }
            });
            art.proxy($modes, "click", (event)=>{
                const { dataset  } = event.target;
                if (dataset.mode) {
                    mode = Number(dataset.mode);
                    inverseClass(event.target, "art-current");
                }
            });
            art.proxy($colors, "click", (event)=>{
                const { dataset  } = event.target;
                if (dataset.color) {
                    color = dataset.color;
                    inverseClass(event.target, "art-current");
                }
            });
            onResize();
            art.on("resize", ()=>{
                if (!art.isInput) onResize();
            });
            art.on("destroy", ()=>{
                if (option.mount && $emitter.parentElement === option.mount) option.mount.removeChild($emitter);
            });
        }
        function addControl() {
            art.controls.add({
                position: "right",
                name: "danmuku",
                click: function() {
                    if (danmuku.isHide) {
                        danmuku.show();
                        art.notice.show = "弹幕显示";
                        setStyle($danmuOn, "display", null);
                        setStyle($danmuOff, "display", "none");
                    } else {
                        danmuku.hide();
                        art.notice.show = "弹幕隐藏";
                        setStyle($danmuOn, "display", "none");
                        setStyle($danmuOff, "display", null);
                    }
                },
                mounted ($ref) {
                    append($ref, $danmuOn);
                    append($ref, $danmuOff);
                    tooltip($ref, "弹幕开关");
                    setStyle($danmuOff, "display", "none");
                    art.on("artplayerPluginDanmuku:hide", ()=>{
                        setStyle($danmuOn, "display", "none");
                        setStyle($danmuOff, "display", null);
                    });
                    art.on("artplayerPluginDanmuku:show", ()=>{
                        setStyle($danmuOn, "display", null);
                        setStyle($danmuOff, "display", "none");
                    });
                }
            });
        }
        function addSetting() {
            art.setting.add({
                width: 260,
                name: "danmuku",
                html: "弹幕设置",
                tooltip: "更多",
                icon: $danmuConfig,
                selector: [
                    {
                        width: SETTING_ITEM_WIDTH,
                        html: "播放速度",
                        icon: "",
                        tooltip: "适中",
                        selector: [
                            {
                                html: "极慢",
                                time: 10
                            },
                            {
                                html: "较慢",
                                time: 7.5
                            },
                            {
                                default: true,
                                html: "适中",
                                time: 5
                            },
                            {
                                html: "较快",
                                time: 2.5
                            },
                            {
                                html: "极快",
                                time: 1
                            }
                        ],
                        onSelect: function(item) {
                            danmuku.config({
                                speed: item.time
                            });
                            return item.html;
                        }
                    },
                    {
                        width: SETTING_ITEM_WIDTH,
                        html: "字体大小",
                        icon: "",
                        tooltip: "适中",
                        selector: [
                            {
                                html: "极小",
                                fontSize: "4%"
                            },
                            {
                                html: "较小",
                                fontSize: "5%"
                            },
                            {
                                default: true,
                                html: "适中",
                                fontSize: "6%"
                            },
                            {
                                html: "较大",
                                fontSize: "7%"
                            },
                            {
                                html: "极大",
                                fontSize: "8%"
                            }
                        ],
                        onSelect: function(item) {
                            danmuku.config({
                                fontSize: item.fontSize
                            });
                            return item.html;
                        }
                    },
                    {
                        width: SETTING_ITEM_WIDTH,
                        html: "不透明度",
                        icon: "",
                        tooltip: "100%",
                        selector: [
                            {
                                default: true,
                                opacity: 1,
                                html: "100%"
                            },
                            {
                                opacity: 0.75,
                                html: "75%"
                            },
                            {
                                opacity: 0.5,
                                html: "50%"
                            },
                            {
                                opacity: 0.25,
                                html: "25%"
                            },
                            {
                                opacity: 0,
                                html: "0%"
                            }
                        ],
                        onSelect: function(item) {
                            danmuku.config({
                                opacity: item.opacity
                            });
                            return item.html;
                        }
                    },
                    {
                        width: SETTING_ITEM_WIDTH,
                        html: "显示范围",
                        icon: "",
                        tooltip: "3/4",
                        selector: [
                            {
                                html: "1/4",
                                margin: [
                                    10,
                                    "75%"
                                ]
                            },
                            {
                                html: "半屏",
                                margin: [
                                    10,
                                    "50%"
                                ]
                            },
                            {
                                default: true,
                                html: "3/4",
                                margin: [
                                    10,
                                    "25%"
                                ]
                            },
                            {
                                html: "满屏",
                                margin: [
                                    10,
                                    10
                                ]
                            }
                        ],
                        onSelect: function(item) {
                            danmuku.config({
                                margin: item.margin
                            });
                            return item.html;
                        }
                    },
                    {
                        html: "弹幕防重叠",
                        icon: "",
                        tooltip: option.antiOverlap ? "开启" : "关闭",
                        switch: option.antiOverlap,
                        onSwitch (item) {
                            danmuku.config({
                                antiOverlap: !item.switch
                            });
                            item.tooltip = item.switch ? "关闭" : "开启";
                            return !item.switch;
                        }
                    },
                    {
                        html: "同步视频速度",
                        icon: "",
                        tooltip: option.synchronousPlayback ? "开启" : "关闭",
                        switch: option.synchronousPlayback,
                        onSwitch (item) {
                            danmuku.config({
                                synchronousPlayback: !item.switch
                            });
                            item.tooltip = item.switch ? "关闭" : "开启";
                            return !item.switch;
                        }
                    }
                ]
            });
        }
    }
}
exports.default = Setting;
if (typeof document !== "undefined") {
    if (!document.getElementById("artplayer-plugin-danmuku")) {
        const $style = document.createElement("style");
        $style.id = "artplayer-plugin-danmuku";
        $style.textContent = (0, _styleLessDefault.default);
        document.head.appendChild($style);
    }
}

},{"bundle-text:./style.less":"uaCsY","bundle-text:./img/danmu-on.svg":"qeJXh","bundle-text:./img/danmu-off.svg":"7RwEf","bundle-text:./img/danmu-config.svg":"3yRfx","bundle-text:./img/danmu-style.svg":"hoOta","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}],"uaCsY":[function(require,module,exports) {
module.exports = ".art-danmuku-emitter {\n  height: 32px;\n  width: 100%;\n  max-width: 100%;\n  background-color: #ffffff4d;\n  border-radius: 5px;\n  font-size: 12px;\n  line-height: 1;\n  display: flex;\n  position: relative;\n}\n\n.art-danmuku-emitter .art-backdrop-filter {\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n  backdrop-filter: saturate(180%) blur(20px);\n  background-color: #000000b3 !important;\n}\n\n.art-danmuku-emitter .art-danmuku-left {\n  border-radius: 3px 0 0 3px;\n  flex: 1;\n  display: flex;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style {\n  width: 32px;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n  position: relative;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style .art-danmuku-style-panel {\n  z-index: 999;\n  width: 200px;\n  padding-bottom: 10px;\n  display: none;\n  position: absolute;\n  bottom: 30px;\n  left: -85px;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style .art-danmuku-style-panel .art-danmuku-style-panel-inner {\n  background-color: #000000e6;\n  border-radius: 3px;\n  flex-direction: column;\n  padding: 10px 10px 0;\n  display: flex;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style .art-danmuku-style-panel .art-danmuku-style-panel-inner .art-danmuku-style-panel-title {\n  margin-bottom: 10px;\n  font-size: 13px;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style .art-danmuku-style-panel .art-danmuku-style-panel-inner .art-danmuku-style-panel-modes {\n  justify-content: space-between;\n  margin-bottom: 15px;\n  display: flex;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style .art-danmuku-style-panel .art-danmuku-style-panel-inner .art-danmuku-style-panel-modes .art-danmuku-style-panel-mode {\n  width: 47%;\n  cursor: pointer;\n  color: #fff;\n  border: 1px solid #fff;\n  justify-content: center;\n  padding: 5px 0;\n  display: flex;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style .art-danmuku-style-panel .art-danmuku-style-panel-inner .art-danmuku-style-panel-modes .art-danmuku-style-panel-mode.art-current {\n  background-color: #00a1d6;\n  border: 1px solid #00a1d6;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style .art-danmuku-style-panel .art-danmuku-style-panel-inner .art-danmuku-style-panel-colors {\n  flex-wrap: wrap;\n  justify-content: space-between;\n  gap: 5px;\n  margin-bottom: 10px;\n  display: flex;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style .art-danmuku-style-panel .art-danmuku-style-panel-inner .art-danmuku-style-panel-colors .art-danmuku-style-panel-color {\n  cursor: pointer;\n  width: 20px;\n  height: 20px;\n  border: 1px solid #fff;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style .art-danmuku-style-panel .art-danmuku-style-panel-inner .art-danmuku-style-panel-colors .art-danmuku-style-panel-color.art-current {\n  position: relative;\n  box-shadow: 0 0 2px #fff;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style .art-danmuku-style-panel .art-danmuku-style-panel-inner .art-danmuku-style-panel-colors .art-danmuku-style-panel-color.art-current:before {\n  content: \"\";\n  width: 100%;\n  height: 100%;\n  border: 2px solid #000;\n  position: absolute;\n  inset: 0;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style:hover .art-danmuku-style-panel {\n  display: flex;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style .art-icon {\n  opacity: .75;\n  cursor: pointer;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-style .art-icon:hover {\n  opacity: 1;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-input {\n  width: 100%;\n  color: #fff;\n  background-color: #0000;\n  border: none;\n  outline: none;\n  flex: 1;\n  padding: 0 10px 0 0;\n  display: flex;\n}\n\n.art-danmuku-emitter .art-danmuku-left .art-danmuku-input::placeholder, .art-danmuku-emitter .art-danmuku-left .art-danmuku-input::-webkit-input-placeholder {\n  color: #ffffff80;\n}\n\n.art-danmuku-emitter .art-danmuku-send {\n  width: 50px;\n  cursor: pointer;\n  background-color: #00a1d6;\n  border-radius: 0 5px 5px 0;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.art-danmuku-emitter .art-danmuku-send:hover {\n  background-color: #00b5e5;\n}\n\n.art-danmuku-emitter .art-danmuku-send.art-disabled {\n  opacity: .5;\n  pointer-events: none;\n}\n\n.art-danmuku-emitter.art-danmuku-mount {\n  max-width: 100% !important;\n}\n\n.art-danmuku-emitter.art-danmuku-mount .art-danmuku-left .art-danmuku-style .art-danmuku-style-panel {\n  left: 0;\n}\n\n.art-danmuku-emitter.art-danmuku-mount .art-danmuku-send {\n  width: 60px;\n}\n\n.art-danmuku-emitter.art-danmuku-mount.art-danmuku-theme-light .art-danmuku-left {\n  background: #f4f4f4;\n  border: 1px solid #dadada;\n}\n\n.art-danmuku-emitter.art-danmuku-mount.art-danmuku-theme-light .art-danmuku-left .art-danmuku-style .art-icon svg {\n  fill: #666;\n}\n\n.art-danmuku-emitter.art-danmuku-mount.art-danmuku-theme-light .art-danmuku-left .art-danmuku-input {\n  color: #000;\n}\n\n.art-danmuku-emitter.art-danmuku-mount.art-danmuku-theme-light .art-danmuku-left .art-danmuku-input::placeholder, .art-danmuku-emitter.art-danmuku-mount.art-danmuku-theme-light .art-danmuku-left .art-danmuku-input::-webkit-input-placeholder {\n  color: #00000080;\n}\n\n.art-layer-danmuku-emitter {\n  z-index: 99;\n  width: 100%;\n  position: absolute;\n  bottom: -40px;\n  left: 0;\n  right: 0;\n}\n\n";

},{}],"qeJXh":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg viewBox=\"0 0 1152 1024\" width=\"22\" height=\"22\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill=\"#fff\" d=\"M311.466667 661.333333c0 4.266667-4.266667 8.533333-8.533334 12.8 0 4.266667 0 4.266667-4.266666 8.533334h-12.8c-4.266667 0-8.533333-4.266667-17.066667-8.533334-8.533333-8.533333-17.066667-8.533333-25.6-8.533333-8.533333 0-12.8 4.266667-17.066667 12.8-4.266667 12.8-8.533333 21.333333-4.266666 29.866667 4.266667 8.533333 12.8 17.066667 25.6 21.333333 17.066667 8.533333 34.133333 17.066667 46.933333 17.066667 12.8 0 21.333333-4.266667 34.133333-8.533334 8.533333-4.266667 17.066667-17.066667 25.6-29.866666 8.533333-12.8 12.8-34.133333 17.066667-55.466667 4.266667-21.333333 4.266667-51.2 4.266667-85.333333 0-12.8 0-21.333333-4.266667-29.866667 0-8.533333-4.266667-12.8-8.533333-17.066667-4.266667-4.266667-8.533333-8.533333-12.8-8.533333-4.266667 0-12.8-4.266667-21.333334-4.266667H273.066667s-4.266667-4.266667 0-8.533333l4.266666-38.4c0-4.266667 0-8.533333 4.266667-8.533333h46.933333c17.066667 0 25.6-4.266667 34.133334-12.8 8.533333-8.533333 12.8-21.333333 12.8-42.666667V324.266667c0-17.066667-4.266667-34.133333-8.533334-42.666667-12.8-12.8-25.6-17.066667-42.666666-17.066667H243.2c-8.533333 0-17.066667 0-21.333333 4.266667-4.266667 8.533333-4.266667 12.8-4.266667 25.6 0 8.533333 0 17.066667 4.266667 21.333333 4.266667 4.266667 12.8 8.533333 21.333333 8.533334h64c4.266667 0 8.533333 0 8.533333 4.266666v34.133334c0 8.533333 0 12.8-4.266666 12.8 0 0-4.266667 4.266667-8.533334 4.266666h-34.133333c-8.533333 0-12.8 0-21.333333 4.266667-4.266667 0-8.533333 4.266667-8.533334 4.266667-4.266667 4.266667-8.533333 12.8-8.533333 17.066666 0 8.533333-4.266667 17.066667-4.266667 25.6l-8.533333 72.533334v29.866666c0 8.533333 4.266667 12.8 8.533333 17.066667 4.266667 4.266667 8.533333 4.266667 17.066667 8.533333h68.266667c4.266667 0 8.533333 0 8.533333 4.266667s4.266667 8.533333 4.266667 17.066667c0 21.333333 0 42.666667-4.266667 55.466666 0 8.533333-4.266667 21.333333-8.533333 25.6zM896 486.4c-93.866667 0-174.933333 51.2-217.6 123.733333h-106.666667v-34.133333H640c21.333333 0 34.133333-4.266667 42.666667-12.8 8.533333-8.533333 12.8-21.333333 12.8-42.666667V358.4c0-21.333333-4.266667-34.133333-12.8-42.666667-8.533333-8.533333-21.333333-12.8-42.666667-12.8 0-4.266667 4.266667-4.266667 4.266667-8.533333-4.266667 0-4.266667-4.266667-4.266667-4.266667 4.266667-12.8 8.533333-21.333333 4.266667-25.6 0-8.533333-4.266667-12.8-12.8-21.333333-8.533333-4.266667-17.066667-4.266667-21.333334-4.266667-8.533333 4.266667-12.8 8.533333-21.333333 21.333334-4.266667 8.533333-8.533333 12.8-12.8 21.333333-4.266667 8.533333-8.533333 12.8-12.8 21.333333H512c-4.266667-8.533333-8.533333-17.066667-8.533333-21.333333-4.266667-8.533333-8.533333-12.8-12.8-21.333333-4.266667-12.8-12.8-17.066667-21.333334-17.066667s-17.066667 0-25.6 8.533333c-8.533333 8.533333-12.8 12.8-12.8 21.333334s0 17.066667 8.533334 25.6l4.266666 4.266666 4.266667 4.266667c-17.066667 0-29.866667 4.266667-38.4 12.8-8.533333 4.266667-12.8 21.333333-12.8 38.4v157.866667c0 21.333333 4.266667 34.133333 12.8 42.666666 8.533333 8.533333 21.333333 12.8 42.666667 12.8H512v34.133334H413.866667c-12.8 0-21.333333 0-25.6 4.266666-4.266667 4.266667-8.533333 8.533333-8.533334 21.333334v17.066666c0 4.266667 4.266667 8.533333 4.266667 8.533334 4.266667 0 4.266667 4.266667 8.533333 4.266666H512v55.466667c0 12.8 4.266667 21.333333 8.533333 25.6 4.266667 4.266667 12.8 8.533333 21.333334 8.533333 12.8 0 21.333333-4.266667 25.6-8.533333 4.266667-4.266667 4.266667-12.8 4.266666-25.6v-55.466667h81.066667c-8.533333 25.6-12.8 51.2-12.8 76.8 0 140.8 115.2 256 256 256s256-115.2 256-256-115.2-251.733333-256-251.733333z m-328.533333-128h55.466666c4.266667 0 4.266667 0 4.266667 4.266667v46.933333h-59.733333V358.4z m0 102.4h59.733333V512h-55.466667v-51.2zM512 516.266667h-55.466667V465.066667H512v51.2z m0-102.4h-59.733333V366.933333v-4.266666H512v51.2z m384 499.2c-93.866667 0-170.666667-76.8-170.666667-170.666667s76.8-170.666667 170.666667-170.666667 170.666667 76.8 170.666667 170.666667-76.8 170.666667-170.666667 170.666667z\"></path>\n<path fill=\"#fff\" d=\"M951.466667 669.866667l-72.533334 72.533333-29.866666-25.6c-17.066667-17.066667-42.666667-12.8-59.733334 4.266667-17.066667 17.066667-12.8 42.666667 4.266667 59.733333l59.733333 51.2c8.533333 8.533333 17.066667 8.533333 29.866667 8.533333 12.8 0 21.333333-4.266667 29.866667-12.8l102.4-102.4c17.066667-17.066667 17.066667-42.666667 0-59.733333-21.333333-12.8-46.933333-12.8-64 4.266667zM580.266667 878.933333H213.333333c-72.533333 0-128-55.466667-128-119.466666V230.4c0-64 55.466667-119.466667 128-119.466667h512c72.533333 0 128 55.466667 128 119.466667v140.8c0 25.6 17.066667 42.666667 42.666667 42.666667s42.666667-17.066667 42.666667-42.666667V230.4c0-115.2-93.866667-204.8-213.333334-204.8H213.333333C93.866667 25.6 0 119.466667 0 230.4v529.066667c0 115.2 93.866667 204.8 213.333333 204.8h366.933334c25.6 0 42.666667-17.066667 42.666666-42.666667s-21.333333-42.666667-42.666666-42.666667z\"></path>\n</svg>";

},{}],"7RwEf":[function(require,module,exports) {
module.exports = "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg viewBox=\"0 0 1152 1024\" width=\"22\" height=\"22\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill=\"#fff\" d=\"M311.296 661.504c0 4.096-4.096 8.704-8.704 12.8 0 4.096 0 4.096-4.096 8.704h-12.8c-4.096 0-8.704-4.096-16.896-8.704-8.704-8.704-16.896-8.704-25.6-8.704s-12.8 4.096-16.896 12.8c-4.096 12.8-8.704 21.504-4.096 29.696 4.096 8.704 12.8 16.896 25.6 21.504 16.896 8.704 34.304 16.896 47.104 16.896 12.8 0 21.504-4.096 34.304-8.704 8.704-4.096 16.896-16.896 25.6-29.696 8.704-12.8 12.8-34.304 16.896-55.296 4.096-21.504 4.096-51.2 4.096-85.504 0-12.8 0-21.504-4.096-29.696 0-8.704-4.096-12.8-8.704-16.896-4.096-4.096-8.704-8.704-12.8-8.704s-12.8-4.096-21.504-4.096H272.896s-4.096-4.096 0-8.704l4.096-38.4c0-4.096 0-8.704 4.096-8.704h47.104c16.896 0 25.6-4.096 34.304-12.8 8.704-8.704 12.8-21.504 12.8-42.496V324.096c0-16.896-4.096-34.304-8.704-42.496-12.8-12.8-25.6-16.896-42.496-16.896H243.2c-8.704 0-16.896 0-21.504 4.096-4.096 8.704-4.096 12.8-4.096 25.6 0 8.704 0 16.896 4.096 21.504 4.096 4.096 12.8 8.704 21.504 8.704H307.2c4.096 0 8.704 0 8.704 4.096v34.304c0 8.704 0 12.8-4.096 12.8 0 0-4.096 4.096-8.704 4.096h-34.304c-8.704 0-12.8 0-21.504 4.096-4.096 0-8.704 4.096-8.704 4.096-4.096 4.096-8.704 12.8-8.704 16.896 0 8.704-4.096 16.896-4.096 25.6l-8.704 72.704v29.696c0 8.704 4.096 12.8 8.704 16.896s8.704 4.096 16.896 8.704h68.096c4.096 0 8.704 0 8.704 4.096s4.096 8.704 4.096 16.896c0 21.504 0 42.496-4.096 55.296 0.512 9.216-3.584 22.016-8.192 26.624zM896 486.4c-93.696 0-175.104 51.2-217.6 123.904h-106.496v-34.304H640c21.504 0 34.304-4.096 42.496-12.8 8.704-8.704 12.8-21.504 12.8-42.496V358.4c0-21.504-4.096-34.304-12.8-42.496-8.704-8.704-21.504-12.8-42.496-12.8 0-4.096 4.096-4.096 4.096-8.704-4.096 0-4.096-4.096-4.096-4.096 4.096-12.8 8.704-21.504 4.096-25.6 0-8.704-4.096-12.8-12.8-21.504-8.704-4.096-16.896-4.096-21.504-4.096-8.704 4.096-12.8 8.704-21.504 21.504-4.096 8.704-8.704 12.8-12.8 21.504-4.096 8.704-8.704 12.8-12.8 21.504h-51.2c-4.096-8.704-8.704-16.896-8.704-21.504-4.096-8.704-8.704-12.8-12.8-21.504-4.096-12.8-12.8-16.896-21.504-16.896s-16.896 0-25.6 8.704C434.176 261.12 430.08 265.216 430.08 273.92c0 8.704 0 16.896 8.704 25.6l4.096 4.096 4.096 4.096c-16.896 0-29.696 4.096-38.4 12.8-8.704 4.096-12.8 21.504-12.8 38.4v157.696c0 21.504 4.096 34.304 12.8 42.496 8.704 8.704 21.504 12.8 42.496 12.8H512v34.304H413.696c-12.8 0-21.504 0-25.6 4.096-4.096 4.096-8.704 8.704-8.704 21.504v16.896c0 4.096 4.096 8.704 4.096 8.704 4.096 0 4.096 4.096 8.704 4.096H512V716.8c0 12.8 4.096 21.504 8.704 25.6 4.096 4.096 12.8 8.704 21.504 8.704 12.8 0 21.504-4.096 25.6-8.704 4.096-4.096 4.096-12.8 4.096-25.6v-55.296h80.896c-8.704 25.6-12.8 51.2-12.8 76.8 0 140.8 115.2 256 256 256s256-115.2 256-256S1036.8 486.4 896 486.4z m-328.704-128h55.296c4.096 0 4.096 0 4.096 4.096V409.6h-59.904V358.4z m0 102.4h59.904v51.2h-55.296V460.8h-4.608zM512 516.096H456.704v-51.2H512v51.2z m0-102.4H452.096v-51.2H512v51.2z m384 499.2c-93.696 0-170.496-76.8-170.496-170.496s76.8-170.496 170.496-170.496 170.496 76.8 170.496 170.496-76.8 170.496-170.496 170.496z\"></path>\n<path fill=\"#fff\" d=\"M580.096 879.104H213.504c-72.704 0-128-55.296-128-119.296V230.4c0-64 55.296-119.296 128-119.296h512c72.704 0 128 55.296 128 119.296v140.8c0 25.6 16.896 42.496 42.496 42.496s42.496-16.896 42.496-42.496V230.4c0-115.2-93.696-204.8-213.504-204.8h-512C93.696 25.6 0 119.296 0 230.4v528.896c0 115.2 93.696 204.8 213.504 204.8h367.104c25.6 0 42.496-16.896 42.496-42.496 0-25.6-21.504-42.496-43.008-42.496z m171.52 10.752c-15.36-15.36-15.36-40.96 0-56.32l237.568-237.568c15.36-15.36 40.96-15.36 56.32 0s15.36 40.96 0 56.32l-237.568 237.568c-15.36 15.36-40.448 15.36-56.32 0z\"></path>\n</svg>";

},{}],"3yRfx":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 22 22\" width=\"22\" height=\"22\">\n    <path d=\"M16.5 8c1.289 0 2.49.375 3.5 1.022V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h7.022A6.5 6.5 0 0116.5 8zM7 13H5a1 1 0 010-2h2a1 1 0 010 2zm2-4H5a1 1 0 010-2h4a1 1 0 010 2z\"></path>\n    <path d=\"M20.587 13.696l-.787-.131a3.503 3.503 0 00-.593-1.051l.301-.804a.46.46 0 00-.21-.56l-1.005-.581a.52.52 0 00-.656.113l-.499.607a3.53 3.53 0 00-1.276 0l-.499-.607a.52.52 0 00-.656-.113l-1.005.581a.46.46 0 00-.21.56l.301.804c-.254.31-.456.665-.593 1.051l-.787.131a.48.48 0 00-.413.465v1.209a.48.48 0 00.413.465l.811.135c.144.382.353.733.614 1.038l-.292.78a.46.46 0 00.21.56l1.005.581a.52.52 0 00.656-.113l.515-.626a3.549 3.549 0 001.136 0l.515.626a.52.52 0 00.656.113l1.005-.581a.46.46 0 00.21-.56l-.292-.78c.261-.305.47-.656.614-1.038l.811-.135A.48.48 0 0021 15.37v-1.209a.48.48 0 00-.413-.465zM16.5 16.057a1.29 1.29 0 11.002-2.582 1.29 1.29 0 01-.002 2.582z\"></path>\n</svg>";

},{}],"hoOta":[function(require,module,exports) {
module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 22 22\" width=\"24\" height=\"24\">\n    <path d=\"M17 16H5c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1zM6.96 15c.39 0 .74-.24.89-.6l.65-1.6h5l.66 1.6c.15.36.5.6.89.6.69 0 1.15-.71.88-1.34l-3.88-8.97C11.87 4.27 11.46 4 11 4s-.87.27-1.05.69l-3.88 8.97c-.27.63.2 1.34.89 1.34zM11 5.98L12.87 11H9.13L11 5.98z\"></path>\n</svg>";

},{}],"bZziT":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const lib = {
    map (value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    },
    range (start, end, tick) {
        const s = Math.round(start / tick) * tick;
        return Array.from({
            length: Math.floor((end - start) / tick)
        }, (v, k)=>{
            return k * tick + s;
        });
    }
};
const line = (pointA, pointB)=>{
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    };
};
function heatmap(art, danmuku, option) {
    const { query  } = art.constructor.utils;
    art.controls.add({
        name: "heatmap",
        position: "top",
        html: "",
        style: {
            position: "absolute",
            top: "-100px",
            left: "0px",
            right: "0px",
            height: "100px",
            width: "100%",
            pointerEvents: "none"
        },
        mounted ($heatmap) {
            let $start = null;
            let $stop = null;
            function update(arg = []) {
                $start = null;
                $stop = null;
                $heatmap.innerHTML = "";
                if (!art.duration || art.option.isLive) return;
                const svg = {
                    w: $heatmap.offsetWidth,
                    h: $heatmap.offsetHeight
                };
                const options = {
                    xMin: 0,
                    xMax: svg.w,
                    yMin: 0,
                    yMax: 128,
                    scale: 0.25,
                    opacity: 0.2,
                    minHeight: Math.floor(svg.h * 0.05),
                    sampling: Math.floor(svg.w / 100),
                    smoothing: 0.2,
                    flattening: 0.2
                };
                if (typeof option === "object") Object.assign(options, option);
                let points = [];
                if (Array.isArray(arg) && arg.length) points = [
                    ...arg
                ];
                else {
                    const gap = art.duration / svg.w;
                    for(let x = 0; x <= svg.w; x += options.sampling){
                        const y = danmuku.danmus.filter(({ time  })=>time > x * gap && time <= (x + options.sampling) * gap).length;
                        points.push([
                            x,
                            y
                        ]);
                    }
                }
                if (points.length === 0) return;
                const lastPoint = points[points.length - 1];
                const lastX = lastPoint[0];
                const lastY = lastPoint[1];
                if (lastX !== svg.w) points.push([
                    svg.w,
                    lastY
                ]);
                const yPoints = points.map((point)=>point[1]);
                const yMin = Math.min(...yPoints);
                const yMax = Math.max(...yPoints);
                const yMid = (yMin + yMax) / 2;
                for(let i = 0; i < points.length; i++){
                    const point = points[i];
                    const y = point[1];
                    point[1] = y * (y > yMid ? 1 + options.scale : 1 - options.scale) + options.minHeight;
                }
                const controlPoint = (current, previous, next, reverse)=>{
                    const p = previous || current;
                    const n = next || current;
                    const o = line(p, n);
                    const flat = lib.map(Math.cos(o.angle) * options.flattening, 0, 1, 1, 0);
                    const angle = o.angle * flat + (reverse ? Math.PI : 0);
                    const length = o.length * options.smoothing;
                    const x = current[0] + Math.cos(angle) * length;
                    const y = current[1] + Math.sin(angle) * length;
                    return [
                        x,
                        y
                    ];
                };
                const bezierCommand = (point, i, a)=>{
                    const cps = controlPoint(a[i - 1], a[i - 2], point);
                    const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
                    const close = i === a.length - 1 ? " z" : "";
                    return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}${close}`;
                };
                const pointsPositions = points.map((e)=>{
                    const x = lib.map(e[0], options.xMin, options.xMax, 0, svg.w);
                    const y = lib.map(e[1], options.yMin, options.yMax, svg.h, 0);
                    return [
                        x,
                        y
                    ];
                });
                const pathD = pointsPositions.reduce((acc, e, i, a)=>i === 0 ? `M ${a[a.length - 1][0]},${svg.h} L ${e[0]},${svg.h} L ${e[0]},${e[1]}` : `${acc} ${bezierCommand(e, i, a)}`, "");
                $heatmap.innerHTML = `
                    <svg viewBox="0 0 ${svg.w} ${svg.h}">
                        <defs>
                            <linearGradient id="heatmap-solids" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${options.opacity}" />
                                <stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${options.opacity}" id="heatmap-start" />
                                <stop offset="0%" style="stop-color:var(--art-progress-color);stop-opacity:1" id="heatmap-stop" />
                                <stop offset="100%" style="stop-color:var(--art-progress-color);stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#heatmap-solids)" d="${pathD}"></path>
                    </svg>
                `;
                $start = query("#heatmap-start", $heatmap);
                $stop = query("#heatmap-stop", $heatmap);
                $start.setAttribute("offset", `${art.played * 100}%`);
                $stop.setAttribute("offset", `${art.played * 100}%`);
            }
            art.on("video:timeupdate", ()=>{
                if ($start && $stop) {
                    $start.setAttribute("offset", `${art.played * 100}%`);
                    $stop.setAttribute("offset", `${art.played * 100}%`);
                }
            });
            art.on("setBar", (type, percentage)=>{
                if ($start && $stop && type === "played") {
                    $start.setAttribute("offset", `${percentage * 100}%`);
                    $stop.setAttribute("offset", `${percentage * 100}%`);
                }
            });
            art.on("ready", ()=>update());
            art.on("resize", ()=>update());
            art.on("artplayerPluginDanmuku:loaded", ()=>update());
            art.on("artplayerPluginDanmuku:points", (points)=>update(points));
        }
    });
}
exports.default = heatmap;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6"}]},["lIf7X"], "lIf7X", "parcelRequire4dc0")

//# sourceMappingURL=index.js.map

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
        const setting = new (0, _settingDefault.default)(art, danmuku);
        if (option.heatmap) (0, _heatmapDefault.default)(art, danmuku, option.heatmap);
        return {
            name: "artplayerPluginDanmuku",
            emit: danmuku.emit.bind(danmuku),
            load: danmuku.load.bind(danmuku),
            config: danmuku.config.bind(danmuku),
            hide: danmuku.hide.bind(danmuku),
            show: danmuku.show.bind(danmuku),
            reset: danmuku.reset.bind(danmuku),
            mount: setting.mount,
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
        art.on("destroy", this.destroy);
        // art.on('resize', this.reset);
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
            antiOverlap: true,
            synchronousPlayback: false,
            mount: undefined,
            heatmap: false,
            points: [],
            setting: {},
            filter: ()=>true,
            beforeEmit: ()=>true,
            beforeVisible: ()=>true
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
            mount: "?htmldivelement",
            heatmap: "object|boolean",
            points: "array",
            setting: "object",
            beforeEmit: "function",
            beforeVisible: "function"
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
        $ref.dataset.mode = "";
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
                // 获取准备好发送的弹幕，可能包含ready和wait状态的弹幕
                const readys = this.getReady();
                for(let index = 0; index < readys.length; index++){
                    const danmu = readys[index];
                    // 弹幕发送前的过滤器
                    const state = await this.option.beforeVisible(danmu);
                    if (state) {
                        const { clientWidth , clientHeight  } = this.$player;
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
                                danmu.$ref.dataset.mode = danmu.mode; // CSS控制模式的显示和隐藏
                                this.art.emit("artplayerPluginDanmuku:visible", danmu);
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
                            } else {
                                // 假如弹幕已经停止或者没有 top 值，则重置弹幕为ready状态，回收弹幕DOM节点，等待下次发送
                                danmu.$state = "ready";
                                this.$refs.push(danmu.$ref);
                                danmu.$ref = null;
                            }
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
        this.worker.terminate();
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
var _onSvg = require("bundle-text:./img/on.svg");
var _onSvgDefault = parcelHelpers.interopDefault(_onSvg);
var _offSvg = require("bundle-text:./img/off.svg");
var _offSvgDefault = parcelHelpers.interopDefault(_offSvg);
var _configSvg = require("bundle-text:./img/config.svg");
var _configSvgDefault = parcelHelpers.interopDefault(_configSvg);
var _styleSvg = require("bundle-text:./img/style.svg");
var _styleSvgDefault = parcelHelpers.interopDefault(_styleSvg);
class Setting {
    constructor(art, danmuku){
        this.art = art;
        this.danmuku = danmuku;
        this.utils = art.constructor.utils;
        this.config = {
            ...Setting.DEFAULT,
            ...danmuku.option.setting
        };
        this.template = {
            $container: art.template.$controlsCenter,
            $danmuku: null,
            $toggle: null,
            $toggleOn: null,
            $toggleOff: null,
            $input: null,
            $send: null
        };
        this.initTemplate();
        this.initEvents();
        this.initState();
    }
    static get DEFAULT() {
        return {
            show: true,
            maxLength: 200,
            placeholder: "发个友善的弹幕见证当下",
            toggleOn: "关闭弹幕",
            toggleOff: "开启弹幕",
            send: "发送"
        };
    }
    get TEMPLATE() {
        const { config  } = this;
        return `
            <div class="apd-toggle">
                <div class="apd-icon apd-toggle-on">${0, _onSvgDefault.default}</div>
                <div class="apd-icon apd-toggle-off">${0, _offSvgDefault.default}</div>
            </div>
            <div class="apd-config">
                <div class="apd-config-icon">${0, _configSvgDefault.default}</div>
                <div class="apd-config-panel">
                    <div class="apd-config-panel-inner">1234</div>
                </div>
            </div>
            <div class="apd-emitter">
                <div class="apd-style">
                    <div class="apd-style-icon">${0, _styleSvgDefault.default}</div>
                    <div class="apd-style-panel">
                        <div class="apd-style-panel-inner">1234</div>
                    </div>
                </div>
                <input class="apd-input" placeholder="${config.placeholder}" autocomplete="off" maxLength="${config.maxLength}" />
                <div class="apd-send">${config.send}</div>
            </div>
        `;
    }
    initTemplate() {
        const { setStyle , createElement , query , tooltip  } = this.utils;
        const { $container  } = this.template;
        const { config  } = this;
        const $danmuku = createElement("div");
        $danmuku.className = "artplayer-plugin-danmuku";
        $danmuku.innerHTML = this.TEMPLATE;
        this.template.$danmuku = $danmuku;
        const $toggle = query(".apd-toggle", $danmuku);
        const $toggleOn = query(".apd-toggle-on", $danmuku);
        const $toggleOff = query(".apd-toggle-off", $danmuku);
        this.template.$toggle = $toggle;
        this.template.$toggleOn = $toggleOn;
        this.template.$toggleOff = $toggleOff;
        tooltip($toggleOn, config.toggleOn);
        tooltip($toggleOff, config.toggleOff);
        this.initToggle();
        const $input = query(".apd-input", $danmuku);
        this.template.$input = $input;
        const $send = query(".apd-send", $danmuku);
        this.template.$send = $send;
        this.mount($container);
        setStyle($container, "display", "flex");
    }
    initEvents() {
        const { config  } = this;
        this.art.proxy(this.template.$toggle, "click", ()=>{
            config.show = !config.show;
            this.initToggle();
            this.danmuku[config.show ? "show" : "hide"]();
        });
    }
    initState() {
        const { config  } = this;
        this.danmuku[config.show ? "show" : "hide"]();
    }
    initToggle() {
        const { config  } = this;
        const { setStyle  } = this.utils;
        const { $toggleOn , $toggleOff  } = this.template;
        setStyle(config.show ? $toggleOff : $toggleOn, "display", "none");
        setStyle(config.show ? $toggleOn : $toggleOff, "display", "flex");
    }
    mount(target) {
        target.appendChild(this.template.$danmuku);
    }
}
exports.default = Setting;
if (typeof document !== "undefined") {
    const id = "artplayer-plugin-danmuku";
    const $style = document.getElementById(id);
    if ($style) $style.textContent = (0, _styleLessDefault.default);
    else {
        const $style = document.createElement("style");
        $style.id = id;
        $style.textContent = (0, _styleLessDefault.default);
        document.head.appendChild($style);
    }
}

},{"bundle-text:./style.less":"uaCsY","@parcel/transformer-js/src/esmodule-helpers.js":"5dUr6","bundle-text:./img/on.svg":"a9r0e","bundle-text:./img/off.svg":"luia6","bundle-text:./img/config.svg":"lo6sV","bundle-text:./img/style.svg":"1Aemm"}],"uaCsY":[function(require,module,exports) {
module.exports = ".artplayer-plugin-danmuku {\n  height: 100%;\n  align-items: center;\n  gap: 5px;\n  padding: 8px 0;\n  font-size: 13px;\n  display: flex;\n}\n\n.artplayer-plugin-danmuku .apd-toggle, .artplayer-plugin-danmuku .apd-config, .artplayer-plugin-danmuku .apd-style {\n  opacity: .6;\n  height: 100%;\n  aspect-ratio: 1;\n  justify-content: center;\n  align-items: center;\n  transition: all .2s;\n  display: flex;\n}\n\n.artplayer-plugin-danmuku .apd-toggle svg, .artplayer-plugin-danmuku .apd-config svg, .artplayer-plugin-danmuku .apd-style svg {\n  width: 80%;\n  height: 80%;\n}\n\n.artplayer-plugin-danmuku .apd-toggle:hover, .artplayer-plugin-danmuku .apd-config:hover, .artplayer-plugin-danmuku .apd-style:hover {\n  opacity: 1;\n}\n\n.artplayer-plugin-danmuku .apd-toggle-on, .artplayer-plugin-danmuku .apd-toggle-off, .artplayer-plugin-danmuku .apd-config-icon, .artplayer-plugin-danmuku .apd-style-icon {\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n}\n\n.artplayer-plugin-danmuku .apd-config {\n  position: relative;\n}\n\n.artplayer-plugin-danmuku .apd-config .apd-config-panel {\n  width: 250px;\n  padding: 7px;\n  display: none;\n  position: absolute;\n  bottom: 24px;\n  left: -113px;\n}\n\n.artplayer-plugin-danmuku .apd-config .apd-config-panel .apd-config-panel-inner {\n  width: 100%;\n  background: var(--art-widget-background);\n  border-radius: var(--art-border-radius);\n  background-color: #000;\n  padding: 10px;\n  box-shadow: 0 0 10px #00000080;\n}\n\n.artplayer-plugin-danmuku .apd-config:hover .apd-config-panel {\n  display: flex;\n}\n\n.artplayer-plugin-danmuku .apd-emitter {\n  height: 100%;\n  background-color: #fff3;\n  border-radius: 5px;\n  align-items: center;\n  margin-left: 6px;\n  display: flex;\n}\n\n.artplayer-plugin-danmuku .apd-style {\n  position: relative;\n}\n\n.artplayer-plugin-danmuku .apd-style .apd-style-panel {\n  width: 250px;\n  padding: 7px;\n  display: none;\n  position: absolute;\n  bottom: 24px;\n  left: -113px;\n}\n\n.artplayer-plugin-danmuku .apd-style .apd-style-panel .apd-style-panel-inner {\n  width: 100%;\n  background: var(--art-widget-background);\n  border-radius: var(--art-border-radius);\n  background-color: #000;\n  padding: 10px;\n  box-shadow: 0 0 10px #00000080;\n}\n\n.artplayer-plugin-danmuku .apd-style:hover .apd-style-panel {\n  display: flex;\n}\n\n.artplayer-plugin-danmuku .apd-input {\n  height: 100%;\n  width: 170px;\n  color: #fff;\n  min-width: none;\n  background-color: #0000;\n  border: none;\n  outline: none;\n}\n\n.artplayer-plugin-danmuku .apd-input::placeholder {\n  color: #ffffff80;\n}\n\n.artplayer-plugin-danmuku .apd-send {\n  height: 100%;\n  cursor: pointer;\n  background-color: #00a1d6;\n  border-top-right-radius: 5px;\n  border-bottom-right-radius: 5px;\n  flex-shrink: 0;\n  justify-content: center;\n  align-items: center;\n  padding: 0 12px;\n  display: flex;\n}\n\n.art-fullscreen .artplayer-plugin-danmuku, .art-fullscreen-web .artplayer-plugin-danmuku {\n  padding: 12px 0;\n}\n\n.art-fullscreen .artplayer-plugin-danmuku .apd-input, .art-fullscreen-web .artplayer-plugin-danmuku .apd-input {\n  width: 360px;\n}\n\n";

},{}],"a9r0e":[function(require,module,exports) {
module.exports = "<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" data-pointer=\"none\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><path fill-rule=\"evenodd\" d=\"M11.989 4.828c-.47 0-.975.004-1.515.012l-1.71-2.566a1.008 1.008 0 0 0-1.678 1.118l.999 1.5c-.681.018-1.403.04-2.164.068a4.013 4.013 0 0 0-3.83 3.44c-.165 1.15-.245 2.545-.245 4.185 0 1.965.115 3.67.35 5.116a4.012 4.012 0 0 0 3.763 3.363l.906.046c1.205.063 1.808.095 3.607.095a.988.988 0 0 0 0-1.975c-1.758 0-2.339-.03-3.501-.092l-.915-.047a2.037 2.037 0 0 1-1.91-1.708c-.216-1.324-.325-2.924-.325-4.798 0-1.563.076-2.864.225-3.904.14-.977.96-1.713 1.945-1.747 2.444-.087 4.465-.13 6.063-.131 1.598 0 3.62.044 6.064.13.96.034 1.71.81 1.855 1.814.075.524.113 1.962.141 3.065v.002c.01.342.017.65.025.88a.987.987 0 1 0 1.974-.068c-.008-.226-.016-.523-.025-.856v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507-.9-.032-1.743-.058-2.531-.078l1.05-1.46a1.008 1.008 0 0 0-1.638-1.177l-1.862 2.59c-.38-.004-.744-.007-1.088-.007h-.13Zm.521 4.775h-1.32v4.631h2.222v.847h-2.618v1.078h2.618l.003.678c.36.026.714.163 1.01.407h.11v-1.085h2.694v-1.078h-2.695v-.847H16.8v-4.63h-1.276a8.59 8.59 0 0 0 .748-1.42L15.183 7.8a14.232 14.232 0 0 1-.814 1.804h-1.518l.693-.308a8.862 8.862 0 0 0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364Zm-4.18 3.564.154-1.485h1.98V8.294h-3.2v.98H9.33v1.43H7.472l-.308 3.453h2.277c0 1.166-.044 1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 1.067.062.005c.285.02.551.04.818.04 1.001-.067 1.562-.419 1.694-1.057.11-.638.176-1.903.176-3.795h-2.2Zm7.458.11v-.858h-1.254v.858h1.254Zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2v.902Zm2.321 0v-.902h1.254v.902h-1.254Z\" clip-rule=\"evenodd\" fill=\"#fff\"></path><path fill=\"#00AEEC\" fill-rule=\"evenodd\" d=\"M22.846 14.627a1 1 0 0 0-1.412.075l-5.091 5.703-2.216-2.275-.097-.086-.008-.005a1 1 0 0 0-1.322 1.493l2.963 3.041.093.083.007.005c.407.315 1 .27 1.354-.124l5.81-6.505.08-.102.005-.008a1 1 0 0 0-.166-1.295Z\" clip-rule=\"evenodd\"></path></svg>";

},{}],"luia6":[function(require,module,exports) {
module.exports = "<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" data-pointer=\"none\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><path fill-rule=\"evenodd\" d=\"m8.085 4.891-.999-1.499a1.008 1.008 0 0 1 1.679-1.118l1.709 2.566c.54-.008 1.045-.012 1.515-.012h.13c.345 0 .707.003 1.088.007l1.862-2.59a1.008 1.008 0 0 1 1.637 1.177l-1.049 1.46c.788.02 1.631.046 2.53.078 1.958.069 3.468 1.6 3.74 3.507.088.613.13 2.158.16 3.276l.001.027c.01.333.017.63.025.856a.987.987 0 0 1-1.974.069c-.008-.23-.016-.539-.025-.881v-.002c-.028-1.103-.066-2.541-.142-3.065-.143-1.004-.895-1.78-1.854-1.813-2.444-.087-4.466-.13-6.064-.131-1.598 0-3.619.044-6.063.13a2.037 2.037 0 0 0-1.945 1.748c-.15 1.04-.225 2.341-.225 3.904 0 1.874.11 3.474.325 4.798.154.949.95 1.66 1.91 1.708a97.58 97.58 0 0 0 5.416.139.988.988 0 0 1 0 1.975c-2.196 0-3.61-.047-5.513-.141A4.012 4.012 0 0 1 2.197 17.7c-.236-1.446-.351-3.151-.351-5.116 0-1.64.08-3.035.245-4.184A4.013 4.013 0 0 1 5.92 4.96c.761-.027 1.483-.05 2.164-.069Zm4.436 4.707h-1.32v4.63h2.222v.848h-2.618v1.078h2.431a5.01 5.01 0 0 1 3.575-3.115V9.598h-1.276a8.59 8.59 0 0 0 .748-1.42l-1.089-.384a14.232 14.232 0 0 1-.814 1.804h-1.518l.693-.308a8.862 8.862 0 0 0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364Zm-4.18 3.564.154-1.485h1.98V8.289h-3.2v.979h2.067v1.43H7.483l-.308 3.454h2.277c0 1.166-.044 1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 1.067.062.004c.285.02.551.04.818.04 1.001-.066 1.562-.418 1.694-1.056.11-.638.176-1.903.176-3.795h-2.2Zm7.458.11v-.858h-1.254v.858H15.8Zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2v.902Zm2.321 0v-.902H15.8v.902h-1.254Zm3.517 10.594a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-.002-1.502a2.5 2.5 0 0 1-2.217-3.657l3.326 3.398a2.49 2.49 0 0 1-1.109.259Zm2.5-2.5c0 .42-.103.815-.286 1.162l-3.328-3.401a2.5 2.5 0 0 1 3.614 2.239Z\" clip-rule=\"evenodd\" fill=\"#fff\"></path></svg>";

},{}],"lo6sV":[function(require,module,exports) {
module.exports = "<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" data-pointer=\"none\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><path fill-rule=\"evenodd\" d=\"m15.645 4.881 1.06-1.473a.998.998 0 1 0-1.622-1.166L13.22 4.835a110.67 110.67 0 0 0-1.1-.007h-.131c-.47 0-.975.004-1.515.012L8.783 2.3A.998.998 0 0 0 7.12 3.408l.988 1.484c-.688.019-1.418.042-2.188.069a4.013 4.013 0 0 0-3.83 3.44c-.165 1.15-.245 2.545-.245 4.185 0 1.965.115 3.67.35 5.116a4.012 4.012 0 0 0 3.763 3.363c1.903.094 3.317.141 5.513.141a.988.988 0 0 0 0-1.975 97.58 97.58 0 0 1-5.416-.139 2.037 2.037 0 0 1-1.91-1.708c-.216-1.324-.325-2.924-.325-4.798 0-1.563.076-2.864.225-3.904.14-.977.96-1.713 1.945-1.747 2.444-.087 4.465-.13 6.063-.131 1.598 0 3.62.044 6.064.13.96.034 1.71.81 1.855 1.814.075.524.113 1.962.141 3.065v.002c.005.183.01.07.014-.038.004-.096.008-.189.011-.081a.987.987 0 1 0 1.974-.069c-.004-.105-.007-.009-.011.09-.002.056-.004.112-.007.135l-.002.01a.574.574 0 0 1-.005-.091v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507-.905-.032-1.752-.058-2.543-.079Zm-3.113 4.703h-1.307v4.643h2.2v.04l.651-1.234c.113-.215.281-.389.482-.509v-.11h.235c.137-.049.283-.074.433-.074h1.553V9.584h-1.264a8.5 8.5 0 0 0 .741-1.405l-1.078-.381c-.24.631-.501 1.23-.806 1.786h-1.503l.686-.305c-.228-.501-.5-.959-.806-1.394l-1.034.348c.294.392.566.839.817 1.35Zm-1.7 5.502h2.16l-.564 1.068h-1.595v-1.068Zm-2.498-1.863.152-1.561h1.96V8.289H7.277v.969h2.048v1.435h-1.84l-.306 3.51h2.254c0 1.155-.043 1.906-.12 2.255-.076.348-.38.523-.925.523-.305 0-.61-.022-.893-.055l.294 1.056.061.005c.282.02.546.039.81.039.991-.065 1.547-.414 1.677-1.046.11-.631.175-1.883.175-3.757H8.334Zm5.09-.8v.85h-1.188v-.85h1.187Zm-1.188-.955h1.187v-.893h-1.187v.893Zm2.322.007v-.893h1.241v.893h-1.241Zm.528 2.757a1.26 1.26 0 0 1 1.087-.627l4.003-.009a1.26 1.26 0 0 1 1.094.63l1.721 2.982c.226.39.225.872-.001 1.263l-1.743 3a1.26 1.26 0 0 1-1.086.628l-4.003.009a1.26 1.26 0 0 1-1.094-.63l-1.722-2.982a1.26 1.26 0 0 1 .002-1.263l1.742-3Zm1.967.858a1.26 1.26 0 0 0-1.08.614l-.903 1.513a1.26 1.26 0 0 0-.002 1.289l.885 1.492c.227.384.64.62 1.086.618l2.192-.005a1.26 1.26 0 0 0 1.08-.615l.904-1.518a1.26 1.26 0 0 0 .001-1.288l-.884-1.489a1.26 1.26 0 0 0-1.086-.616l-2.193.005Zm2.517 2.76a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z\" clip-rule=\"evenodd\" fill=\"#fff\"></path></svg>";

},{}],"1Aemm":[function(require,module,exports) {
module.exports = "<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" data-pointer=\"none\" style=\"enable-background: new 0 0 22 22\" viewBox=\"0 0 22 22\" width=\"36\" height=\"24\"><path d=\"M17 16H5c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1zM6.96 15c.39 0 .74-.24.89-.6l.65-1.6h5l.66 1.6c.15.36.5.6.89.6.69 0 1.15-.71.88-1.34l-3.88-8.97C11.87 4.27 11.46 4 11 4s-.87.27-1.05.69l-3.88 8.97c-.27.63.2 1.34.89 1.34zM11 5.98 12.87 11H9.13L11 5.98z\" fill=\"#fff\"></path></svg>";

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

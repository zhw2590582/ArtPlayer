/*!
 * artplayer-plugin-danmuku.js v5.2.1
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
function getMode(key) {
  switch (key) {
    case 1:
    case 2:
    case 3:
      return 0;
    case 4:
      return 2;
    case 5:
      return 1;
    default:
      return 0;
  }
}
function bilibiliDanmuParseFromXml(xmlString) {
  if (typeof xmlString !== "string")
    return [];
  const reg = /<d[^>]*?p="(?<p>[^"]+)"[^>]*>(?<text>.*?)<\/d>/gs;
  const matches = xmlString.matchAll(reg);
  return Array.from(matches).map((match) => {
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
    } else {
      return null;
    }
  }).filter(Boolean);
}
function onmessage({ data }) {
  const { xml, id } = data;
  if (!id || !xml)
    return;
  const danmus = bilibiliDanmuParseFromXml(xml);
  globalThis.postMessage({ danmus, id });
}
function createWorker() {
  const workerText = `
        ${getMode.toString()}
        ${bilibiliDanmuParseFromXml.toString()}
        onmessage = ${onmessage.toString()}
    `;
  const blob2 = new Blob([workerText], { type: "application/javascript" });
  return new Worker(URL.createObjectURL(blob2));
}
function bilibiliDanmuParseFromUrl(url) {
  return new Promise(async (resolve) => {
    const res = await fetch(url);
    const xml = await res.text();
    try {
      const worker = createWorker();
      worker.onmessage = (event) => {
        const { danmus, id } = event.data;
        if (!id || !danmus)
          return;
        resolve(danmus);
        worker.terminate();
      };
      worker.postMessage({ xml, id: Date.now() });
    } catch (error) {
      console.error("Error parsing Bilibili Danmu:", error);
      const danmus = bilibiliDanmuParseFromXml(xml);
      resolve(danmus);
    }
  });
}
const jsContent = '/*!\n * artplayer-plugin-danmuku.js v5.2.1\n * Github: https://github.com/zhw2590582/ArtPlayer\n * (c) 2017-2026 Harvey Zhao\n * Released under the MIT License.\n */\nfunction getDanmuTop({ target, visibles, clientWidth, clientHeight, marginBottom, marginTop, antiOverlap }) {\n  const maxTop = clientHeight - marginBottom;\n  const danmus = visibles.filter((item) => item.mode === target.mode && item.top <= maxTop).sort((prev, next) => prev.top - next.top);\n  if (danmus.length === 0) {\n    if (target.mode === 2) {\n      return maxTop - target.height;\n    } else {\n      return marginTop;\n    }\n  }\n  danmus.unshift({\n    type: "top",\n    top: 0,\n    left: 0,\n    right: 0,\n    height: marginTop,\n    width: clientWidth,\n    speed: 0,\n    distance: clientWidth\n  });\n  danmus.push({\n    type: "bottom",\n    top: maxTop,\n    left: 0,\n    right: 0,\n    height: marginBottom,\n    width: clientWidth,\n    speed: 0,\n    distance: clientWidth\n  });\n  if (target.mode === 2) {\n    for (let index = danmus.length - 2; index >= 0; index -= 1) {\n      const item = danmus[index];\n      const prev = danmus[index + 1];\n      const itemBottom = item.top + item.height;\n      const diff = prev.top - itemBottom;\n      if (diff >= target.height) {\n        return prev.top - target.height;\n      }\n    }\n  } else {\n    for (let index = 1; index < danmus.length; index += 1) {\n      const item = danmus[index];\n      const prev = danmus[index - 1];\n      const prevBottom = prev.top + prev.height;\n      const diff = item.top - prevBottom;\n      if (diff >= target.height) {\n        return prevBottom;\n      }\n    }\n  }\n  const topMap = [];\n  for (let index = 1; index < danmus.length - 1; index += 1) {\n    const item = danmus[index];\n    if (topMap.length) {\n      const last = topMap[topMap.length - 1];\n      if (last[0].top === item.top) {\n        last.push(item);\n      } else {\n        topMap.push([item]);\n      }\n    } else {\n      topMap.push([item]);\n    }\n  }\n  if (antiOverlap) {\n    switch (target.mode) {\n      case 0: {\n        const result = topMap.find((list) => {\n          return list.every((danmu) => {\n            if (clientWidth < danmu.distance)\n              return false;\n            if (target.speed < danmu.speed)\n              return true;\n            const overlapTime = danmu.right / (target.speed - danmu.speed);\n            if (overlapTime > danmu.time)\n              return true;\n            return false;\n          });\n        });\n        return result && result[0] ? result[0].top : void 0;\n      }\n      // 静止弹幕没有重叠问题\n      case 1:\n      case 2:\n        return void 0;\n    }\n  } else {\n    switch (target.mode) {\n      case 0:\n        topMap.sort((prev, next) => {\n          const nextMinRight = Math.min(...next.map((item) => item.right));\n          const prevMinRight = Math.min(...prev.map((item) => item.right));\n          return nextMinRight * next.length - prevMinRight * prev.length;\n        });\n        break;\n      case 1:\n      case 2:\n        topMap.sort((prev, next) => {\n          const nextMaxWidth = Math.max(...next.map((item) => item.width));\n          const prevMaxWidth = Math.max(...prev.map((item) => item.width));\n          return prevMaxWidth * prev.length - nextMaxWidth * next.length;\n        });\n        break;\n    }\n    return topMap[0][0].top;\n  }\n}\nonmessage = (event) => {\n  const { data } = event;\n  if (!data.id || !data.type)\n    return;\n  const fns = { getDanmuTop };\n  const fn = fns[data.type];\n  const result = fn(data);\n  globalThis.postMessage({\n    result,\n    id: data.id\n  });\n};\n';
const blob = typeof self !== "undefined" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", jsContent], { type: "text/javascript;charset=utf-8" });
function WorkerWrapper(options) {
  let objURL;
  try {
    objURL = blob && (self.URL || self.webkitURL).createObjectURL(blob);
    if (!objURL) throw "";
    const worker = new Worker(objURL, {
      type: "module",
      name: options?.name
    });
    worker.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(objURL);
    });
    return worker;
  } catch (e) {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(jsContent),
      {
        type: "module",
        name: options?.name
      }
    );
  }
}
class Danmuku {
  constructor(art, option) {
    const { constructor, template } = art;
    this.utils = constructor.utils;
    this.validator = constructor.validator;
    this.$danmuku = template.$danmuku;
    this.$player = template.$player;
    this.art = art;
    this.queue = [];
    this.$refs = [];
    this.isStop = false;
    this.isHide = false;
    this.timer = null;
    this.index = 0;
    this.option = Danmuku.option;
    this.states = { wait: [], ready: [], emit: [], stop: [] };
    this.config(option, true);
    this.worker = new WorkerWrapper();
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.resize = this.resize.bind(this);
    this.destroy = this.destroy.bind(this);
    art.on("video:play", this.start);
    art.on("video:playing", this.start);
    art.on("video:pause", this.stop);
    art.on("video:waiting", this.stop);
    art.on("destroy", this.destroy);
    art.on("resize", this.resize);
    this.load();
  }
  // 默认配置
  static get option() {
    return {
      danmuku: [],
      // 弹幕数据
      speed: 5,
      // 弹幕持续时间，范围在[1 ~ 10]
      margin: [10, "25%"],
      // 弹幕上下边距，支持像素数字和百分比
      opacity: 1,
      // 弹幕透明度，范围在[0 ~ 1]
      color: "#FFFFFF",
      // 默认弹幕颜色，可以被单独弹幕项覆盖
      mode: 0,
      // 默认弹幕模式: 0: 滚动，1: 顶部，2: 底部
      modes: [0, 1, 2],
      // 弹幕可见的模式
      fontSize: 25,
      // 弹幕字体大小，支持像素数字和百分比
      antiOverlap: true,
      // 弹幕是否防重叠
      synchronousPlayback: false,
      // 是否同步播放速度
      mount: void 0,
      // 弹幕发射器挂载点, 默认为播放器控制栏中部
      heatmap: false,
      // 是否开启热力图
      width: 512,
      // 当播放器宽度小于此值时，弹幕发射器置于播放器底部
      points: [],
      // 热力图数据
      filter: () => true,
      // 弹幕载入前的过滤器，只支持返回布尔值
      beforeEmit: () => true,
      // 弹幕发送前的过滤器，支持返回 Promise
      beforeVisible: () => true,
      // 弹幕显示前的过滤器，支持返回 Promise
      visible: true,
      // 弹幕层是否可见
      emitter: true,
      // 是否开启弹幕发射器
      maxLength: 200,
      // 弹幕输入框最大长度, 范围在[1 ~ 1000]
      lockTime: 5,
      // 输入框锁定时间，范围在[1 ~ 60]
      theme: "dark",
      // 弹幕主题，支持 dark 和 light，只在自定义挂载时生效
      OPACITY: {},
      // 不透明度配置项
      FONT_SIZE: {},
      // 弹幕字号配置项
      MARGIN: {},
      // 显示区域配置项
      SPEED: {},
      // 弹幕速度配置项
      COLOR: []
      // 颜色列表配置项
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
      modes: "array",
      fontSize: "number|string",
      antiOverlap: "boolean",
      synchronousPlayback: "boolean",
      mount: "?htmldivelement|string",
      heatmap: "object|boolean",
      width: "number",
      points: "array",
      filter: "function",
      beforeEmit: "function",
      beforeVisible: "function",
      visible: "boolean",
      emitter: "boolean",
      maxLength: "number",
      lockTime: "number",
      theme: "string",
      OPACITY: "object",
      FONT_SIZE: "object",
      MARGIN: "object",
      SPEED: "object",
      COLOR: "array"
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
    const { clamp } = this.utils;
    const value = this.option.margin[0];
    const { clientHeight } = this.$player;
    if (typeof value === "number") {
      return clamp(value, 0, clientHeight);
    }
    if (typeof value === "string" && value.endsWith("%")) {
      const ratio = Number.parseFloat(value) / 100;
      return clamp(clientHeight * ratio, 0, clientHeight);
    }
    return Danmuku.option.margin[0];
  }
  // 计算下空白边距
  get marginBottom() {
    const { clamp } = this.utils;
    const value = this.option.margin[1];
    const { clientHeight } = this.$player;
    if (typeof value === "number") {
      return clamp(value, 0, clientHeight);
    }
    if (typeof value === "string" && value.endsWith("%")) {
      const ratio = Number.parseFloat(value) / 100;
      return clamp(clientHeight * ratio, 0, clientHeight);
    }
    return Danmuku.option.margin[1];
  }
  // 计算弹幕字体大小
  get fontSize() {
    const { clamp } = this.utils;
    const { clientHeight } = this.$player;
    const fontSize = this.option.fontSize;
    if (typeof fontSize === "number") {
      return Math.round(clamp(fontSize, 12, clientHeight));
    }
    if (typeof fontSize === "string" && fontSize.endsWith("%")) {
      const ratio = Number.parseFloat(fontSize) / 100;
      return Math.round(clamp(clientHeight * ratio, 12, clientHeight));
    }
    return Danmuku.option.fontSize;
  }
  // 获取弹幕DOM节点
  get $ref() {
    const $ref = this.$refs.pop() || document.createElement("div");
    $ref.style.cssText = Danmuku.cssText;
    $ref.dataset.mode = "";
    $ref.dataset.id = "";
    $ref.className = "";
    return $ref;
  }
  // 获取准备好发送的弹幕
  get readys() {
    const { currentTime } = this.art;
    const result = [];
    this.filter("ready", (danmu) => result.push(danmu));
    this.filter("wait", (danmu) => {
      if (currentTime + 0.1 >= danmu.time && danmu.time >= currentTime - 0.1) {
        result.push(danmu);
      }
    });
    return result;
  }
  // 可见的弹幕的数据，用于计算下一个弹幕的top值
  get visibles() {
    const result = [];
    const { clientWidth } = this.$player;
    const clientLeft = this.getLeft(this.$player);
    this.filter("emit", (danmu) => {
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
  // 计算弹幕速度
  get speed() {
    return this.option.synchronousPlayback && this.art.playbackRate ? this.option.speed / Number(this.art.playbackRate) : this.option.speed;
  }
  // 加载弹幕
  async load(danmuku) {
    const { errorHandle } = this.utils;
    let danmus = [];
    const target = danmuku || this.option.danmuku;
    try {
      if (typeof target === "function") {
        danmus = await target();
      } else if (target instanceof Promise) {
        danmus = await target;
      } else if (typeof target === "string") {
        danmus = await bilibiliDanmuParseFromUrl(target);
      } else if (Array.isArray(target)) {
        danmus = target;
      }
      errorHandle(Array.isArray(danmus), "Danmuku need return an array as result");
      if (danmuku === void 0) {
        this.reset();
        this.queue = [];
        this.states = { wait: [], ready: [], emit: [], stop: [] };
        this.$refs = [];
        this.$danmuku.textContent = "";
      }
      for (let index = 0; index < danmus.length; index++) {
        const danmu = danmus[index];
        await this.emit(danmu);
      }
      this.art.emit("artplayerPluginDanmuku:loaded", this.queue);
    } catch (error) {
      this.art.emit("artplayerPluginDanmuku:error", error);
      throw error;
    }
    return this;
  }
  // 把原始弹幕转换到弹幕队列
  async emit(danmu) {
    const { clamp } = this.utils;
    this.validator(danmu, {
      id: "?string",
      // 弹幕唯一标识
      text: "string",
      // 弹幕文本
      mode: "?number",
      // 弹幕模式: 0: 滚动，1: 顶部，2: 底部
      color: "?string",
      // 弹幕颜色
      time: "?number",
      // 弹幕时间
      border: "?boolean",
      // 弹幕是否有边框
      style: "?object"
      // 弹幕额外样式
    });
    if (!danmu.text.trim())
      return this;
    if (danmu.time) {
      danmu.time = clamp(danmu.time, 0, Infinity);
    } else {
      danmu.time = this.art.currentTime + 0.5;
    }
    if (danmu.mode === void 0) {
      danmu.mode = this.option.mode;
    }
    if (danmu.style === void 0) {
      danmu.style = {};
    }
    if (danmu.color === void 0) {
      danmu.color = this.option.color;
    }
    if (![0, 1, 2].includes(danmu.mode))
      return this;
    if (!this.option.filter(danmu))
      return this;
    const item = {
      ...danmu,
      $state: "wait",
      // 弹幕初始状态
      $index: this.index++,
      // 弹幕索引
      $ref: null,
      // 弹幕 DOM 节点
      $restTime: 0,
      // 弹幕剩余时间
      $lastStartTime: 0
      // 弹幕上次开始时间
    };
    this.setState(item, "wait");
    this.queue.push(item);
    return this;
  }
  // 动态配置
  config(option, isInit = false) {
    const { clamp } = this.utils;
    const { $controlsCenter } = this.art.template;
    const changed = Object.keys(option).some(
      (key) => JSON.stringify(this.option[key]) !== JSON.stringify(option[key])
    );
    if (!changed && !isInit)
      return this;
    this.option = Object.assign({}, Danmuku.option, this.option, option);
    this.validator(this.option, Danmuku.scheme);
    this.option.mode = clamp(this.option.mode, 0, 2);
    this.option.speed = clamp(this.option.speed, 1, 10);
    this.option.opacity = clamp(this.option.opacity, 0, 1);
    this.option.lockTime = clamp(this.option.lockTime, 1, 60);
    this.option.maxLength = clamp(this.option.maxLength, 1, 1e3);
    this.option.mount = this.option.mount || $controlsCenter;
    if (option.fontSize) {
      this.reset();
    }
    if (this.option.visible) {
      this.show();
    } else {
      this.hide();
    }
    this.art.emit("artplayerPluginDanmuku:config", this.option);
    return this;
  }
  // 计算DOM的left值，受到旋屏影响
  getLeft($ref) {
    const rect = $ref.getBoundingClientRect();
    return this.isRotate ? rect.top : rect.left;
  }
  // 复杂运算交给 Web Worker 处理
  postMessage(message = {}) {
    return new Promise((resolve) => {
      message.id = Date.now();
      this.worker.postMessage(message);
      this.worker.onmessage = (event) => {
        const { data } = event;
        if (data.id === message.id) {
          resolve(data);
        }
      };
    });
  }
  // 根据状态获取弹幕
  filter(state, callback) {
    const danmus = this.states[state] || [];
    for (let index = 0; index < danmus.length; index++) {
      callback(danmus[index]);
    }
    return danmus;
  }
  // 设置弹幕状态
  setState(danmu, state) {
    this.states[danmu.$state] = this.states[danmu.$state].filter((item) => item !== danmu);
    danmu.$state = state;
    if (danmu.$ref) {
      danmu.$ref.dataset.state = state;
    }
    this.states[state].push(danmu);
  }
  // 重置弹幕到wait状态，回收弹幕DOM节点
  makeWait(danmu) {
    this.setState(danmu, "wait");
    if (danmu.$ref) {
      danmu.$ref.style.cssText = Danmuku.cssText;
      danmu.$ref.style.visibility = "hidden";
      danmu.$ref.style.marginLeft = "0px";
      danmu.$ref.style.transform = "translateX(0px)";
      danmu.$ref.style.transition = "transform 0s linear 0s";
      this.$refs.push(danmu.$ref);
      danmu.$ref = null;
    }
  }
  // 实时更新弹幕
  update() {
    const { setStyles } = this.utils;
    this.timer = window.requestAnimationFrame(async () => {
      if (this.art.playing && !this.isHide) {
        this.filter("emit", (danmu) => {
          const emitTime = (Date.now() - danmu.$lastStartTime) / 1e3;
          danmu.$restTime -= emitTime;
          danmu.$lastStartTime = Date.now();
          if (danmu.$restTime <= 0) {
            this.makeWait(danmu);
          }
        });
        const readys = this.readys;
        for (let index = 0; index < readys.length; index++) {
          const danmu = readys[index];
          const state = await this.option.beforeVisible(danmu);
          if (state) {
            const { clientWidth, clientHeight } = this.$player;
            danmu.$ref = this.$ref;
            danmu.$ref.textContent = danmu.text;
            this.$danmuku.appendChild(danmu.$ref);
            danmu.$ref.style.opacity = this.option.opacity;
            danmu.$ref.style.fontSize = `${this.fontSize}px`;
            danmu.$ref.style.color = danmu.color;
            danmu.$ref.style.border = danmu.border ? `1px solid ${danmu.color}` : null;
            danmu.$ref.style.backgroundColor = danmu.border ? "rgb(0 0 0 / 50%)" : null;
            setStyles(danmu.$ref, danmu.style);
            danmu.$lastStartTime = Date.now();
            danmu.$restTime = this.speed;
            const distance = clientWidth + danmu.$ref.clientWidth;
            const { result: top } = await this.postMessage({
              type: "getDanmuTop",
              target: {
                mode: danmu.mode,
                height: danmu.$ref.clientHeight,
                speed: distance / danmu.$restTime
              },
              // 当前弹幕信息
              visibles: this.visibles,
              // 可见的弹幕的数据
              antiOverlap: this.option.antiOverlap,
              clientWidth,
              clientHeight,
              marginBottom: this.marginBottom,
              marginTop: this.marginTop
            });
            if (danmu.$ref) {
              if (!this.isStop && top !== void 0) {
                this.setState(danmu, "emit");
                danmu.$ref.style.top = `${top}px`;
                danmu.$ref.style.visibility = "visible";
                danmu.$ref.dataset.mode = danmu.mode;
                danmu.$ref.dataset.id = danmu.id || "";
                switch (danmu.mode) {
                  // 滚动的弹幕
                  case 0: {
                    danmu.$ref.style.left = `${clientWidth}px`;
                    danmu.$ref.style.marginLeft = "0px";
                    danmu.$ref.style.transform = `translateX(${-distance}px)`;
                    danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
                    break;
                  }
                  case 1:
                  // falls through
                  case 2:
                    danmu.$ref.style.left = "50%";
                    danmu.$ref.style.marginLeft = `-${danmu.$ref.clientWidth / 2}px`;
                    break;
                }
                this.art.emit("artplayerPluginDanmuku:visible", danmu);
              } else {
                this.setState(danmu, "ready");
                this.$refs.push(danmu.$ref);
                danmu.$ref = null;
              }
            }
          }
        }
      }
      if (!this.isStop) {
        this.update();
      }
    });
    return this;
  }
  // 重置正在显示的弹幕: stop/emit 状态的弹幕
  resize() {
    const { clientWidth } = this.$player;
    this.filter("stop", (danmu) => {
      switch (danmu.mode) {
        // 滚动的弹幕
        case 0:
          danmu.$ref.style.left = `${clientWidth}px`;
          break;
      }
    });
    this.filter("emit", (danmu) => {
      danmu.$lastStartTime = Date.now();
      switch (danmu.mode) {
        // 滚动的弹幕
        case 0: {
          const distance = clientWidth + danmu.$ref.clientWidth;
          danmu.$ref.style.left = `${clientWidth}px`;
          danmu.$ref.style.transform = `translateX(${-distance}px)`;
          danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
          break;
        }
      }
    });
  }
  // 继续弹幕
  continue() {
    const { clientWidth } = this.$player;
    this.filter("stop", (danmu) => {
      this.setState(danmu, "emit");
      danmu.$lastStartTime = Date.now();
      switch (danmu.mode) {
        // 继续滚动的弹幕
        case 0: {
          const distance = clientWidth + danmu.$ref.clientWidth;
          danmu.$ref.style.transform = `translateX(${-distance}px)`;
          danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
          break;
        }
      }
    });
    return this;
  }
  // 暂停弹幕
  suspend() {
    const { clientWidth } = this.$player;
    this.filter("emit", (danmu) => {
      this.setState(danmu, "stop");
      switch (danmu.mode) {
        // 停止滚动的弹幕
        case 0: {
          const translateX = clientWidth - (this.getLeft(danmu.$ref) - this.getLeft(this.$player));
          danmu.$ref.style.transform = `translateX(${-translateX}px)`;
          danmu.$ref.style.transition = "transform 0s linear 0s";
          break;
        }
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
    this.queue.forEach((danmu) => this.makeWait(danmu));
    this.art.emit("artplayerPluginDanmuku:reset");
    return this;
  }
  show() {
    this.isHide = false;
    this.$danmuku.style.opacity = 1;
    this.option.visible = true;
    this.art.emit("artplayerPluginDanmuku:show");
    return this;
  }
  hide() {
    this.isHide = true;
    this.$danmuku.style.opacity = 0;
    this.option.visible = false;
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
const lib = {
  map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  },
  range(start, end, tick) {
    const s = Math.round(start / tick) * tick;
    return Array.from(
      {
        length: Math.floor((end - start) / tick)
      },
      (v, k) => {
        return k * tick + s;
      }
    );
  }
};
function line(pointA, pointB) {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];
  return {
    length: Math.sqrt(lengthX ** 2 + lengthY ** 2),
    angle: Math.atan2(lengthY, lengthX)
  };
}
function heatmap(art, danmuku, option) {
  const { query } = art.constructor.utils;
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
    mounted($heatmap) {
      let $start = null;
      let $stop = null;
      function update(arg = []) {
        $start = null;
        $stop = null;
        $heatmap.innerHTML = "";
        if (!art.duration || art.option.isLive)
          return;
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
        if (typeof option === "object") {
          Object.assign(options, option);
        }
        let points = [];
        if (Array.isArray(arg) && arg.length) {
          points = [...arg];
        } else {
          const gap = art.duration / svg.w;
          for (let x = 0; x <= svg.w; x += options.sampling) {
            const y = danmuku.queue.filter(
              ({ time }) => time > x * gap && time <= (x + options.sampling) * gap
            ).length;
            points.push([x, y]);
          }
        }
        if (points.length === 0)
          return;
        const lastPoint = points[points.length - 1];
        const lastX = lastPoint[0];
        const lastY = lastPoint[1];
        if (lastX !== svg.w) {
          points.push([svg.w, lastY]);
        }
        const yPoints = points.map((point) => point[1]);
        const yMin = Math.min(...yPoints);
        const yMax = Math.max(...yPoints);
        const yMid = (yMin + yMax) / 2;
        for (let i = 0; i < points.length; i++) {
          const point = points[i];
          const y = point[1];
          point[1] = y * (y > yMid ? 1 + options.scale : 1 - options.scale) + options.minHeight;
        }
        const controlPoint = (current, previous, next, reverse) => {
          const p = previous || current;
          const n = next || current;
          const o = line(p, n);
          const flat = lib.map(Math.cos(o.angle) * options.flattening, 0, 1, 1, 0);
          const angle = o.angle * flat + (reverse ? Math.PI : 0);
          const length = o.length * options.smoothing;
          const x = current[0] + Math.cos(angle) * length;
          const y = current[1] + Math.sin(angle) * length;
          return [x, y];
        };
        const bezierCommand = (point, i, a) => {
          const cps = controlPoint(a[i - 1], a[i - 2], point);
          const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
          const close = i === a.length - 1 ? " z" : "";
          return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}${close}`;
        };
        const pointsPositions = points.map((e) => {
          const x = lib.map(e[0], options.xMin, options.xMax, 0, svg.w);
          const y = lib.map(e[1], options.yMin, options.yMax, svg.h, 0);
          return [x, y];
        });
        const pathD = pointsPositions.reduce(
          (acc, e, i, a) => i === 0 ? `M ${a[a.length - 1][0]},${svg.h} L ${e[0]},${svg.h} L ${e[0]},${e[1]}` : `${acc} ${bezierCommand(e, i, a)}`,
          ""
        );
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
      art.on("video:timeupdate", () => {
        if ($start && $stop) {
          $start.setAttribute("offset", `${art.played * 100}%`);
          $stop.setAttribute("offset", `${art.played * 100}%`);
        }
      });
      art.on("setBar", (type, percentage) => {
        if ($start && $stop && type === "played") {
          $start.setAttribute("offset", `${percentage * 100}%`);
          $stop.setAttribute("offset", `${percentage * 100}%`);
        }
      });
      art.on("ready", () => update());
      art.on("resize", () => update());
      art.on("artplayerPluginDanmuku:loaded", () => update());
      art.on("artplayerPluginDanmuku:points", (points) => update(points));
    }
  });
}
const $check_off = '<svg  class="apd-icon apd-check-off" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 32 32" width="32"  height="32" ><path d="M8 6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8zm0-2h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z" fill="#FFFFFF"></path></svg>';
const $check_on = '<svg class="apd-icon apd-check-on" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 32 32" width="32"  height="32" ><path d="m13 18.25-1.8-1.8c-.6-.6-1.65-.6-2.25 0s-.6 1.5 0 2.25l2.85 2.85c.318.318.762.468 1.2.448.438.02.882-.13 1.2-.448l8.85-8.85c.6-.6.6-1.65 0-2.25s-1.65-.6-2.25 0l-7.8 7.8zM8 4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z" fill="#00AEEC"></path></svg>';
const $config = '<svg class="apd-icon apd-config-icon" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24" width="24"  height="24" ><path fill-rule="evenodd" d="m15.645 4.881 1.06-1.473a.998.998 0 1 0-1.622-1.166L13.22 4.835a110.67 110.67 0 0 0-1.1-.007h-.131c-.47 0-.975.004-1.515.012L8.783 2.3A.998.998 0 0 0 7.12 3.408l.988 1.484c-.688.019-1.418.042-2.188.069a4.013 4.013 0 0 0-3.83 3.44c-.165 1.15-.245 2.545-.245 4.185 0 1.965.115 3.67.35 5.116a4.012 4.012 0 0 0 3.763 3.363c1.903.094 3.317.141 5.513.141a.988.988 0 0 0 0-1.975 97.58 97.58 0 0 1-5.416-.139 2.037 2.037 0 0 1-1.91-1.708c-.216-1.324-.325-2.924-.325-4.798 0-1.563.076-2.864.225-3.904.14-.977.96-1.713 1.945-1.747 2.444-.087 4.465-.13 6.063-.131 1.598 0 3.62.044 6.064.13.96.034 1.71.81 1.855 1.814.075.524.113 1.962.141 3.065v.002c.005.183.01.07.014-.038.004-.096.008-.189.011-.081a.987.987 0 1 0 1.974-.069c-.004-.105-.007-.009-.011.09-.002.056-.004.112-.007.135l-.002.01a.574.574 0 0 1-.005-.091v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507-.905-.032-1.752-.058-2.543-.079Zm-3.113 4.703h-1.307v4.643h2.2v.04l.651-1.234c.113-.215.281-.389.482-.509v-.11h.235c.137-.049.283-.074.433-.074h1.553V9.584h-1.264a8.5 8.5 0 0 0 .741-1.405l-1.078-.381c-.24.631-.501 1.23-.806 1.786h-1.503l.686-.305c-.228-.501-.5-.959-.806-1.394l-1.034.348c.294.392.566.839.817 1.35Zm-1.7 5.502h2.16l-.564 1.068h-1.595v-1.068Zm-2.498-1.863.152-1.561h1.96V8.289H7.277v.969h2.048v1.435h-1.84l-.306 3.51h2.254c0 1.155-.043 1.906-.12 2.255-.076.348-.38.523-.925.523-.305 0-.61-.022-.893-.055l.294 1.056.061.005c.282.02.546.039.81.039.991-.065 1.547-.414 1.677-1.046.11-.631.175-1.883.175-3.757H8.334Zm5.09-.8v.85h-1.188v-.85h1.187Zm-1.188-.955h1.187v-.893h-1.187v.893Zm2.322.007v-.893h1.241v.893h-1.241Zm.528 2.757a1.26 1.26 0 0 1 1.087-.627l4.003-.009a1.26 1.26 0 0 1 1.094.63l1.721 2.982c.226.39.225.872-.001 1.263l-1.743 3a1.26 1.26 0 0 1-1.086.628l-4.003.009a1.26 1.26 0 0 1-1.094-.63l-1.722-2.982a1.26 1.26 0 0 1 .002-1.263l1.742-3Zm1.967.858a1.26 1.26 0 0 0-1.08.614l-.903 1.513a1.26 1.26 0 0 0-.002 1.289l.885 1.492c.227.384.64.62 1.086.618l2.192-.005a1.26 1.26 0 0 0 1.08-.615l.904-1.518a1.26 1.26 0 0 0 .001-1.288l-.884-1.489a1.26 1.26 0 0 0-1.086-.616l-2.193.005Zm2.517 2.76a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z" clip-rule="evenodd"></path></svg>';
const $mode_0_off = '<svg class="apd-icon apd-mode-0-off" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 28 28" viewBox="0 0 28 28" width="28"  height="28" ><path d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h11.674A7 7 0 0 1 23 15zM11 9h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2zm-3 2H6V9h2v2zm4 4h-2v-2h2v2zm2-1a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2h-1a1 1 0 0 1-1-1z" fill="#00AEEC"></path><path d="M26.536 18.464a5 5 0 0 0-7.071 0 5 5 0 0 0 0 7.071 5 5 0 1 0 7.071-7.071zm-5.657 5.657a3 3 0 0 1-.586-3.415l4.001 4.001a3 3 0 0 1-3.415-.586zm4.829-.827-4.001-4.001a3.002 3.002 0 0 1 4.001 4.001z" fill="#00AEEC"></path></svg>';
const $mode_0_on = '<svg class="apd-icon apd-mode-0-on" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 28 28" viewBox="0 0 28 28" width="28"  height="28" ><path d="M23 3H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4zM11 9h6a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2zm-3 2H6V9h2v2zm4 4h-2v-2h2v2zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2z" fill="#FFFFFF"></path></svg>';
const $mode_1_off = '<svg class="apd-icon apd-mode-1-off" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 28 28" viewBox="0 0 28 28" width="28"  height="28" ><path d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h11.674A7 7 0 0 1 23 15zm-4-8h2v2h-2V7zM9 9H7V7h2v2zm4 0h-2V7h2v2zm2-2h2v2h-2V7z" fill="#00AEEC"></path><path d="M26.536 18.464a5 5 0 0 0-7.071 0 5 5 0 0 0 0 7.071 5 5 0 1 0 7.071-7.071zm-5.657 5.657a3 3 0 0 1-.586-3.415l4.001 4.001a3 3 0 0 1-3.415-.586zm4.829-.827-4.001-4.001a3.002 3.002 0 0 1 4.001 4.001z" fill="#00AEEC"></path></svg>';
const $mode_1_on = '<svg class="apd-icon apd-mode-1-on" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 28 28" viewBox="0 0 28 28" width="28"  height="28" ><path d="M23 3H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4zM9 9H7V7h2v2zm4 0h-2V7h2v2zm4 0h-2V7h2v2zm4 0h-2V7h2v2z" fill="#FFFFFF"></path></svg>';
const $mode_2_off = '<svg class="apd-icon apd-mode-2-off" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 28 28" viewBox="0 0 28 28" width="28"  height="28" ><path d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h11.674A7 7 0 0 1 23 15zM9 21H7v-2h2v2zm4 0h-2v-2h2v2z" fill="#00AEEC"></path><path d="M26.536 18.464a5 5 0 0 0-7.071 0 5 5 0 0 0 0 7.071 5 5 0 1 0 7.071-7.071zm-5.657 5.657a3 3 0 0 1-.586-3.415l4.001 4.001a3 3 0 0 1-3.415-.586zm4.829-.827-4.001-4.001a3.002 3.002 0 0 1 4.001 4.001z" fill="#00AEEC"></path></svg>';
const $mode_2_on = '<svg class="apd-icon apd-mode-2-on" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 28 28" viewBox="0 0 28 28" width="28"  height="28" ><path d="M23 3H5a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4zM9 21H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" fill="#FFFFFF"></path></svg>';
const $off = '<svg class="apd-icon apd-toggle-off" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24" width="24"  height="24" ><path fill-rule="evenodd" d="m8.085 4.891-.999-1.499a1.008 1.008 0 0 1 1.679-1.118l1.709 2.566c.54-.008 1.045-.012 1.515-.012h.13c.345 0 .707.003 1.088.007l1.862-2.59a1.008 1.008 0 0 1 1.637 1.177l-1.049 1.46c.788.02 1.631.046 2.53.078 1.958.069 3.468 1.6 3.74 3.507.088.613.13 2.158.16 3.276l.001.027c.01.333.017.63.025.856a.987.987 0 0 1-1.974.069c-.008-.23-.016-.539-.025-.881v-.002c-.028-1.103-.066-2.541-.142-3.065-.143-1.004-.895-1.78-1.854-1.813-2.444-.087-4.466-.13-6.064-.131-1.598 0-3.619.044-6.063.13a2.037 2.037 0 0 0-1.945 1.748c-.15 1.04-.225 2.341-.225 3.904 0 1.874.11 3.474.325 4.798.154.949.95 1.66 1.91 1.708a97.58 97.58 0 0 0 5.416.139.988.988 0 0 1 0 1.975c-2.196 0-3.61-.047-5.513-.141A4.012 4.012 0 0 1 2.197 17.7c-.236-1.446-.351-3.151-.351-5.116 0-1.64.08-3.035.245-4.184A4.013 4.013 0 0 1 5.92 4.96c.761-.027 1.483-.05 2.164-.069Zm4.436 4.707h-1.32v4.63h2.222v.848h-2.618v1.078h2.431a5.01 5.01 0 0 1 3.575-3.115V9.598h-1.276a8.59 8.59 0 0 0 .748-1.42l-1.089-.384a14.232 14.232 0 0 1-.814 1.804h-1.518l.693-.308a8.862 8.862 0 0 0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364Zm-4.18 3.564.154-1.485h1.98V8.289h-3.2v.979h2.067v1.43H7.483l-.308 3.454h2.277c0 1.166-.044 1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 1.067.062.004c.285.02.551.04.818.04 1.001-.066 1.562-.418 1.694-1.056.11-.638.176-1.903.176-3.795h-2.2Zm7.458.11v-.858h-1.254v.858H15.8Zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2v.902Zm2.321 0v-.902H15.8v.902h-1.254Zm3.517 10.594a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-.002-1.502a2.5 2.5 0 0 1-2.217-3.657l3.326 3.398a2.49 2.49 0 0 1-1.109.259Zm2.5-2.5c0 .42-.103.815-.286 1.162l-3.328-3.401a2.5 2.5 0 0 1 3.614 2.239Z" clip-rule="evenodd"></path></svg>';
const $on = '<svg class="apd-icon apd-toggle-on" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-pointer="none" viewBox="0 0 24 24" width="24"  height="24" ><path fill-rule="evenodd" d="M11.989 4.828c-.47 0-.975.004-1.515.012l-1.71-2.566a1.008 1.008 0 0 0-1.678 1.118l.999 1.5c-.681.018-1.403.04-2.164.068a4.013 4.013 0 0 0-3.83 3.44c-.165 1.15-.245 2.545-.245 4.185 0 1.965.115 3.67.35 5.116a4.012 4.012 0 0 0 3.763 3.363l.906.046c1.205.063 1.808.095 3.607.095a.988.988 0 0 0 0-1.975c-1.758 0-2.339-.03-3.501-.092l-.915-.047a2.037 2.037 0 0 1-1.91-1.708c-.216-1.324-.325-2.924-.325-4.798 0-1.563.076-2.864.225-3.904.14-.977.96-1.713 1.945-1.747 2.444-.087 4.465-.13 6.063-.131 1.598 0 3.62.044 6.064.13.96.034 1.71.81 1.855 1.814.075.524.113 1.962.141 3.065v.002c.01.342.017.65.025.88a.987.987 0 1 0 1.974-.068c-.008-.226-.016-.523-.025-.856v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507-.9-.032-1.743-.058-2.531-.078l1.05-1.46a1.008 1.008 0 0 0-1.638-1.177l-1.862 2.59c-.38-.004-.744-.007-1.088-.007h-.13Zm.521 4.775h-1.32v4.631h2.222v.847h-2.618v1.078h2.618l.003.678c.36.026.714.163 1.01.407h.11v-1.085h2.694v-1.078h-2.695v-.847H16.8v-4.63h-1.276a8.59 8.59 0 0 0 .748-1.42L15.183 7.8a14.232 14.232 0 0 1-.814 1.804h-1.518l.693-.308a8.862 8.862 0 0 0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364Zm-4.18 3.564.154-1.485h1.98V8.294h-3.2v.98H9.33v1.43H7.472l-.308 3.453h2.277c0 1.166-.044 1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 1.067.062.005c.285.02.551.04.818.04 1.001-.067 1.562-.419 1.694-1.057.11-.638.176-1.903.176-3.795h-2.2Zm7.458.11v-.858h-1.254v.858h1.254Zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2v.902Zm2.321 0v-.902h1.254v.902h-1.254Z" clip-rule="evenodd"></path><path fill="#00AEEC" fill-rule="evenodd" d="M22.846 14.627a1 1 0 0 0-1.412.075l-5.091 5.703-2.216-2.275-.097-.086-.008-.005a1 1 0 0 0-1.322 1.493l2.963 3.041.093.083.007.005c.407.315 1 .27 1.354-.124l5.81-6.505.08-.102.005-.008a1 1 0 0 0-.166-1.295Z" clip-rule="evenodd"></path></svg>';
const $style = '<svg class="apd-icon apd-style-icon" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" data-pointer="none" style="enable-background:new 0 0 22 22" viewBox="0 0 22 22" width="36"  height="24" ><path d="M17 16H5c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1zM6.96 15c.39 0 .74-.24.89-.6l.65-1.6h5l.66 1.6c.15.36.5.6.89.6.69 0 1.15-.71.88-1.34l-3.88-8.97C11.87 4.27 11.46 4 11 4s-.87.27-1.05.69l-3.88 8.97c-.27.63.2 1.34.89 1.34zM11 5.98 12.87 11H9.13L11 5.98z"></path></svg>';
const style = '.artplayer-plugin-danmuku{display:flex;position:relative;z-index:99;align-items:center;justify-content:center;font-size:12px;height:32px;width:100%;color:#fff;font-weight:300;flex-shrink:0;gap:10px}.artplayer-plugin-danmuku .apd-icon{cursor:pointer;opacity:.75;transition:all .2s ease;fill:#fff}.artplayer-plugin-danmuku .apd-icon:hover{opacity:1}.artplayer-plugin-danmuku .apd-config{display:flex;position:relative}.artplayer-plugin-danmuku .apd-config .apd-config-panel{position:absolute;bottom:24px;left:0;width:320px;padding:10px;opacity:0;pointer-events:none}.artplayer-plugin-danmuku .apd-config .apd-config-panel .apd-config-panel-inner{width:100%;border-radius:3px;background-color:#000000d9;padding:10px}.artplayer-plugin-danmuku .apd-config:hover .apd-config-panel{opacity:100;pointer-events:all}.artplayer-plugin-danmuku .apd-config-mode,.artplayer-plugin-danmuku .apd-config-slider,.artplayer-plugin-danmuku .apd-config-other,.artplayer-plugin-danmuku .apd-style-mode{margin-bottom:15px}.artplayer-plugin-danmuku .apd-modes{display:flex;align-items:center;margin-top:5px;gap:20px}.artplayer-plugin-danmuku .apd-modes .apd-mode{cursor:pointer;text-align:center}.artplayer-plugin-danmuku .apd-modes .apd-mode:hover{color:#00a1d6}.artplayer-plugin-danmuku .apd-config-slider{display:flex;align-items:center;gap:12px}.artplayer-plugin-danmuku .apd-config-slider .apd-value{width:32px;text-align:right}.artplayer-plugin-danmuku .apd-slider{position:relative;flex:1;display:flex;height:20px;align-items:center;justify-content:center;cursor:pointer}.artplayer-plugin-danmuku .apd-slider .apd-slider-line{position:relative;height:2px;width:100%;overflow:hidden;border-radius:3px;background-color:#ffffff40}.artplayer-plugin-danmuku .apd-slider .apd-slider-points{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between}.artplayer-plugin-danmuku .apd-slider .apd-slider-points .apd-slider-point{width:2px;height:2px;border-radius:50%;background-color:#ffffff80}.artplayer-plugin-danmuku .apd-slider .apd-slider-progress{width:0%;height:100%;background-color:#00a1d6}.artplayer-plugin-danmuku .apd-slider .apd-slider-dot{position:absolute;transform:translate(-6px);left:0%;width:12px;height:12px;border-radius:50%;background-color:#00a1d6}.artplayer-plugin-danmuku .apd-slider .apd-slider-steps{display:flex;align-items:center;justify-content:space-between;position:absolute;bottom:-12px;width:calc(100% + 32px);color:#777}.artplayer-plugin-danmuku .apd-slider .apd-slider-steps .apd-slider-step{flex-shrink:0;width:36px;text-align:center;scale:.95}.artplayer-plugin-danmuku .apd-config-other{display:flex;align-items:center;gap:20px}.artplayer-plugin-danmuku .apd-config-other .apd-check-off,.artplayer-plugin-danmuku .apd-config-other .apd-check-on{width:16px;height:16px}.artplayer-plugin-danmuku .apd-config-other .apd-other{display:flex;align-items:center;cursor:pointer;gap:2px}.artplayer-plugin-danmuku .apd-config-other .apd-other:hover{color:#00a1d6}.artplayer-plugin-danmuku .apd-emitter{display:flex;flex:1;align-items:center;height:100%;background-color:#ffffff40;border-radius:5px}.artplayer-plugin-danmuku .apd-style{position:relative;display:flex;align-items:center;justify-content:center}.artplayer-plugin-danmuku .apd-style .apd-style-panel{position:absolute;bottom:24px;left:0;width:200px;padding:10px;opacity:0;pointer-events:none}.artplayer-plugin-danmuku .apd-style .apd-style-panel .apd-style-panel-inner{width:100%;border-radius:3px;background-color:#000000d9;padding:10px}.artplayer-plugin-danmuku .apd-style:hover .apd-style-panel{opacity:100;pointer-events:all}.artplayer-plugin-danmuku .apd-colors{display:flex;flex-wrap:wrap;margin-top:5px;gap:8px}.artplayer-plugin-danmuku .apd-colors .apd-color{width:16px;height:16px;border-radius:2px;cursor:pointer}.artplayer-plugin-danmuku .apd-colors .apd-color.apd-active{border:1px solid black;box-shadow:0 0 0 1px #fff}.artplayer-plugin-danmuku .apd-input{outline:none;height:100%;flex:1;min-width:0;width:auto;border:none;line-height:1;color:#fff;background-color:transparent}.artplayer-plugin-danmuku .apd-input::placeholder{color:#ffffff80}.artplayer-plugin-danmuku .apd-send{display:flex;align-items:center;justify-content:center;height:100%;width:60px;flex-shrink:0;cursor:pointer;text-shadow:none;border-top-right-radius:5px;border-bottom-right-radius:5px;background-color:#00a1d6}.artplayer-plugin-danmuku .apd-send.apd-lock{cursor:not-allowed;color:#666;background-color:#e7e7e7}.art-controls-center .apd-emitter{width:260px;flex:none}.art-fullscreen .artplayer-plugin-danmuku,.art-fullscreen-web .artplayer-plugin-danmuku{height:38px;gap:16px}.art-fullscreen .artplayer-plugin-danmuku .apd-config-icon,.art-fullscreen-web .artplayer-plugin-danmuku .apd-config-icon,.art-fullscreen .artplayer-plugin-danmuku .apd-toggle-off,.art-fullscreen-web .artplayer-plugin-danmuku .apd-toggle-off,.art-fullscreen .artplayer-plugin-danmuku .apd-toggle-on,.art-fullscreen-web .artplayer-plugin-danmuku .apd-toggle-on{width:28px;height:28px}.art-fullscreen .artplayer-plugin-danmuku .apd-emitter,.art-fullscreen-web .artplayer-plugin-danmuku .apd-emitter{width:400px;flex:none}.art-video-player>.artplayer-plugin-danmuku{position:absolute;left:0;right:0;bottom:-40px;padding:0 10px}.art-video-player:has(>.artplayer-plugin-danmuku){margin-bottom:40px}[data-danmuku-emitter=false] .apd-emitter{display:none!important}[data-danmuku-emitter=false] .art-controls-center .artplayer-plugin-danmuku{justify-content:flex-end;gap:18px}[data-danmuku-emitter=false].art-fullscreen .art-controls-center .artplayer-plugin-danmuku,[data-danmuku-emitter=false].art-fullscreen-web .art-controls-center .artplayer-plugin-danmuku{gap:24px}[data-danmuku-theme=light]>.artplayer-plugin-danmuku .apd-icon{fill:#333}[data-danmuku-theme=light]>.artplayer-plugin-danmuku .apd-emitter{background-color:#f1f2f3}[data-danmuku-theme=light]>.artplayer-plugin-danmuku .apd-input{color:#000}[data-danmuku-theme=light]>.artplayer-plugin-danmuku .apd-input::placeholder{color:#0000004d}[data-danmuku-visible=false] .apd-toggle-off{display:block}[data-danmuku-visible=false] .apd-toggle-on,[data-danmuku-visible=true] .apd-toggle-off{display:none}[data-danmuku-visible=true] .apd-toggle-on{display:block}[data-danmuku-anti-overlap=false] .apd-anti-overlap .apd-check-on{display:none}[data-danmuku-anti-overlap=false] .apd-anti-overlap .apd-check-off,[data-danmuku-anti-overlap=true] .apd-anti-overlap .apd-check-on{display:block}[data-danmuku-anti-overlap=true] .apd-anti-overlap .apd-check-off,[data-danmuku-sync-video=false] .apd-sync-video .apd-check-on{display:none}[data-danmuku-sync-video=false] .apd-sync-video .apd-check-off,[data-danmuku-sync-video=true] .apd-sync-video .apd-check-on{display:block}[data-danmuku-sync-video=true] .apd-sync-video .apd-check-off{display:none}[data-danmuku-mode0=false] .apd-config-mode .apd-mode-0-off{display:block}[data-danmuku-mode0=false] .apd-config-mode .apd-mode-0-on{display:none}[data-danmuku-mode0=false] .art-danmuku [data-mode="0"]{opacity:0!important}[data-danmuku-mode0=true] .apd-config-mode .apd-mode-0-off{display:none}[data-danmuku-mode0=true] .apd-config-mode .apd-mode-0-on{display:block}[data-danmuku-mode="0"] .apd-style-mode [data-mode="0"]{color:#00a1d6}[data-danmuku-mode="0"] .apd-style-mode [data-mode="0"] path{fill:#00a1d6}[data-danmuku-mode1=false] .apd-config-mode .apd-mode-1-off{display:block}[data-danmuku-mode1=false] .apd-config-mode .apd-mode-1-on{display:none}[data-danmuku-mode1=false] .art-danmuku [data-mode="1"]{opacity:0!important}[data-danmuku-mode1=true] .apd-config-mode .apd-mode-1-off{display:none}[data-danmuku-mode1=true] .apd-config-mode .apd-mode-1-on{display:block}[data-danmuku-mode="1"] .apd-style-mode [data-mode="1"]{color:#00a1d6}[data-danmuku-mode="1"] .apd-style-mode [data-mode="1"] path{fill:#00a1d6}[data-danmuku-mode2=false] .apd-config-mode .apd-mode-2-off{display:block}[data-danmuku-mode2=false] .apd-config-mode .apd-mode-2-on{display:none}[data-danmuku-mode2=false] .art-danmuku [data-mode="2"]{opacity:0!important}[data-danmuku-mode2=true] .apd-config-mode .apd-mode-2-off{display:none}[data-danmuku-mode2=true] .apd-config-mode .apd-mode-2-on{display:block}[data-danmuku-mode="2"] .apd-style-mode [data-mode="2"]{color:#00a1d6}[data-danmuku-mode="2"] .apd-style-mode [data-mode="2"] path{fill:#00a1d6}';
class Setting {
  constructor(art, danmuku) {
    this.art = art;
    this.danmuku = danmuku;
    this.utils = art.constructor.utils;
    const { setStyle } = this.utils;
    const { $controlsCenter } = art.template;
    setStyle($controlsCenter, "display", "flex");
    this.template = {
      $controlsCenter,
      $mount: $controlsCenter,
      $danmuku: null,
      $toggle: null,
      $config: null,
      $configPanel: null,
      $configModes: null,
      $style: null,
      $stylePanel: null,
      $styleModes: null,
      $colors: null,
      $opacitySlider: null,
      $opacityValue: null,
      $marginSlider: null,
      $marginValue: null,
      $fontSizeSlider: null,
      $fontSizeValue: null,
      $speedSlider: null,
      $speedValue: null,
      $input: null,
      $send: null
    };
    this.slider = {
      opacity: null,
      margin: null,
      fontSize: null,
      speed: null
    };
    this.emitting = false;
    this.isLock = false;
    this.timer = null;
    this.createTemplate();
    this.createSliders();
    this.createEvents();
    this.mount(this.option.mount);
    art.on("resize", () => this.resize());
    art.on("fullscreen", (state) => this.onFullscreen(state));
    art.on("fullscreenWeb", (state) => this.onFullscreen(state));
    art.proxy(this.template.$config, "mouseenter", () => {
      this.onMouseEnter({
        $control: this.template.$config,
        $panel: this.template.$configPanel
      });
    });
    art.proxy(this.template.$style, "mouseenter", () => {
      this.onMouseEnter({
        $control: this.template.$style,
        $panel: this.template.$stylePanel
      });
    });
  }
  static get icons() {
    return {
      $on,
      $off,
      $config,
      $style,
      $mode_0_off,
      $mode_0_on,
      $mode_1_off,
      $mode_1_on,
      $mode_2_off,
      $mode_2_on,
      $check_on,
      $check_off
    };
  }
  get option() {
    return this.danmuku.option;
  }
  get outside() {
    return this.template.$mount !== this.template.$controlsCenter;
  }
  get TEMPLATE() {
    const { option } = this;
    return `
            <div class="apd-toggle">
                ${$on}${$off}
            </div>
            <div class="apd-config">
                ${$config}
                <div class="apd-config-panel">
                    <div class="apd-config-panel-inner">
                        <div class="apd-config-mode">
                            按类型屏蔽
                            <div class="apd-modes">
                                <div data-mode="0" class="apd-mode">
                                    ${$mode_0_off}${$mode_0_on}
                                    <div>滚动</div>
                                </div>
                                <div data-mode="1" class="apd-mode">
                                    ${$mode_1_off}${$mode_1_on}
                                    <div>顶部</div>
                                </div>
                                <div data-mode="2" class="apd-mode">
                                    ${$mode_2_off}${$mode_2_on}
                                    <div>底部</div>
                                </div>
                            </div>
                        </div>
                        <div class="apd-config-other">
                            <div class="apd-other apd-anti-overlap">
                                ${$check_on}${$check_off}
                                防止弹幕重叠
                            </div>
                            <div class="apd-other apd-sync-video">
                                ${$check_on}${$check_off}
                                同步视频速度
                            </div>
                        </div>
                        <div class="apd-config-slider apd-config-opacity">
                            不透明度
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                        <div class="apd-config-slider apd-config-margin">
                            显示区域
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                        <div class="apd-config-slider apd-config-fontSize">
                            弹幕字号
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                        <div class="apd-config-slider apd-config-speed">
                            弹幕速度
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="apd-emitter">
                <div class="apd-style">
                    ${$style}
                    <div class="apd-style-panel">
                        <div class="apd-style-panel-inner">
                            <div class="apd-style-mode">
                                模式
                                <div class="apd-modes">
                                    <div data-mode="0" class="apd-mode">
                                        ${$mode_0_on}
                                        <div>滚动</div>
                                    </div>
                                    <div data-mode="1" class="apd-mode">
                                        ${$mode_1_on}
                                        <div>顶部</div>
                                    </div>
                                    <div data-mode="2" class="apd-mode">
                                        ${$mode_2_on}
                                        <div>底部</div>
                                    </div>
                                </div>
                            </div>
                            <div class="apd-style-color">
                                颜色
                                <div class="apd-colors">
                                    ${this.COLOR.map((color) => `<div data-color="${color}" class="apd-color" style="background-color: ${color}"></div>`).join("")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <input class="apd-input" placeholder="发个友善的弹幕见证当下" autocomplete="off" maxLength="${option.maxLength}" />
                <div class="apd-send">发送</div>
            </div>
        `;
  }
  get OPACITY() {
    return {
      min: 0,
      max: 100,
      steps: [],
      ...this.option.OPACITY
    };
  }
  get FONT_SIZE() {
    return {
      min: 12,
      max: 120,
      steps: [],
      ...this.option.FONT_SIZE
    };
  }
  get MARGIN() {
    return {
      min: 0,
      max: 3,
      steps: [
        {
          name: "1/4",
          value: [10, "75%"]
        },
        {
          name: "半屏",
          value: [10, "50%"]
        },
        {
          name: "3/4",
          value: [10, "25%"]
        },
        {
          name: "满屏",
          value: [10, 10]
        }
      ],
      ...this.option.MARGIN
    };
  }
  get SPEED() {
    return {
      min: 0,
      max: 4,
      steps: [
        {
          name: "极慢",
          value: 10
        },
        {
          name: "较慢",
          value: 7.5,
          hide: true
        },
        {
          name: "适中",
          value: 5
        },
        {
          name: "较快",
          value: 2.5,
          hide: true
        },
        {
          name: "极快",
          value: 1
        }
      ],
      ...this.option.SPEED
    };
  }
  get COLOR() {
    return this.option.COLOR.length ? this.option.COLOR : [
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
    ];
  }
  query(selector) {
    const { query } = this.utils;
    const { $danmuku } = this.template;
    return query(selector, $danmuku);
  }
  append(el, target) {
    const { append } = this.utils;
    const children = [...el.children];
    if (children.includes(target))
      return;
    append(el, target);
  }
  setData(key, value) {
    const { $player } = this.art.template;
    const { $mount } = this.template;
    $player.dataset[key] = value;
    if (this.outside) {
      $mount.dataset[key] = value;
    }
  }
  createTemplate() {
    const { createElement, tooltip } = this.utils;
    const $danmuku = createElement("div");
    $danmuku.className = "artplayer-plugin-danmuku";
    $danmuku.innerHTML = this.TEMPLATE;
    this.template.$danmuku = $danmuku;
    this.template.$toggle = this.query(".apd-toggle");
    this.template.$config = this.query(".apd-config");
    this.template.$configPanel = this.query(".apd-config-panel");
    this.template.$configModes = this.query(".apd-config-mode .apd-modes");
    this.template.$style = this.query(".apd-style");
    this.template.$stylePanel = this.query(".apd-style-panel");
    this.template.$styleModes = this.query(".apd-style-mode .apd-modes");
    this.template.$colors = this.query(".apd-colors");
    this.template.$antiOverlap = this.query(".apd-anti-overlap");
    this.template.$syncVideo = this.query(".apd-sync-video");
    this.template.$opacitySlider = this.query(".apd-config-opacity .apd-slider");
    this.template.$opacityValue = this.query(".apd-config-opacity .apd-value");
    this.template.$marginSlider = this.query(".apd-config-margin .apd-slider");
    this.template.$marginValue = this.query(".apd-config-margin .apd-value");
    this.template.$fontSizeSlider = this.query(".apd-config-fontSize .apd-slider");
    this.template.$fontSizeValue = this.query(".apd-config-fontSize .apd-value");
    this.template.$speedSlider = this.query(".apd-config-speed .apd-slider");
    this.template.$speedValue = this.query(".apd-config-speed .apd-value");
    this.template.$input = this.query(".apd-input");
    this.template.$send = this.query(".apd-send");
    const { $toggle } = this.template;
    this.art.on("artplayerPluginDanmuku:show", () => {
      tooltip($toggle, "关闭弹幕");
    });
    this.art.on("artplayerPluginDanmuku:hide", () => {
      tooltip($toggle, "打开弹幕");
    });
  }
  createEvents() {
    const { $toggle, $configModes, $styleModes, $colors, $antiOverlap, $syncVideo, $send, $input } = this.template;
    this.art.proxy($toggle, "click", () => {
      this.danmuku.config({
        visible: !this.option.visible
      });
      this.reset();
    });
    this.art.proxy($configModes, "click", (event) => {
      const $mode = event.target.closest(".apd-mode");
      if (!$mode)
        return;
      const mode = Number($mode.dataset.mode);
      if (this.option.modes.includes(mode)) {
        this.danmuku.config({
          modes: this.option.modes.filter((m) => m !== mode)
        });
      } else {
        this.danmuku.config({
          modes: [...this.option.modes, mode]
        });
      }
      this.reset();
    });
    this.art.proxy($antiOverlap, "click", () => {
      this.danmuku.config({
        antiOverlap: !this.option.antiOverlap
      });
      this.reset();
    });
    this.art.proxy($syncVideo, "click", () => {
      this.danmuku.config({
        synchronousPlayback: !this.option.synchronousPlayback
      });
      this.reset();
    });
    this.art.proxy($styleModes, "click", (event) => {
      const $mode = event.target.closest(".apd-mode");
      if (!$mode)
        return;
      const mode = Number($mode.dataset.mode);
      this.danmuku.config({
        mode
      });
      this.reset();
    });
    this.art.proxy($colors, "click", (event) => {
      const $color = event.target.closest(".apd-color");
      if (!$color)
        return;
      this.danmuku.config({
        color: $color.dataset.color
      });
      this.reset();
    });
    this.art.proxy($send, "click", () => this.emit());
    this.art.proxy($input, "keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.emit();
      }
    });
  }
  createSliders() {
    this.slider.opacity = this.createSlider({
      ...this.OPACITY,
      container: this.template.$opacitySlider,
      findIndex: () => {
        return Math.round(this.option.opacity * 100);
      },
      onChange: (index) => {
        const { $opacityValue } = this.template;
        $opacityValue.textContent = `${index}%`;
        this.danmuku.config({
          opacity: index / 100
        });
      }
    });
    this.slider.margin = this.createSlider({
      ...this.MARGIN,
      container: this.template.$marginSlider,
      findIndex: () => {
        return this.MARGIN.steps.findIndex(
          (item) => item.value[0] === this.option.margin[0] && item.value[1] === this.option.margin[1]
        );
      },
      onChange: (index) => {
        const margin = this.MARGIN.steps[index];
        if (!margin)
          return;
        const { $marginValue } = this.template;
        $marginValue.textContent = margin.name;
        this.danmuku.config({
          margin: margin.value
        });
      }
    });
    this.slider.fontSize = this.createSlider({
      ...this.FONT_SIZE,
      container: this.template.$fontSizeSlider,
      findIndex: () => {
        return this.danmuku.fontSize;
      },
      onChange: (index) => {
        const { $fontSizeValue } = this.template;
        $fontSizeValue.textContent = `${index}px`;
        if (index === this.danmuku.fontSize)
          return;
        this.danmuku.config({
          fontSize: index
        });
      }
    });
    this.slider.speed = this.createSlider({
      ...this.SPEED,
      container: this.template.$speedSlider,
      findIndex: () => {
        return this.SPEED.steps.findIndex((item) => item.value === this.option.speed);
      },
      onChange: (index) => {
        const speed = this.SPEED.steps[index];
        if (!speed)
          return;
        const { $speedValue } = this.template;
        $speedValue.textContent = speed.name;
        this.danmuku.config({
          speed: speed.value
        });
      }
    });
  }
  createSlider({ min, max, container, findIndex, onChange, steps = [] }) {
    const { query, clamp, setStyle } = this.utils;
    setStyle(container, "touch-action", "none");
    container.innerHTML = `
            <div class="apd-slider-line">
                <div class="apd-slider-points">
                    ${steps.map(() => `<div class="apd-slider-point"></div>`).join("")}
                </div>
                <div class="apd-slider-progress"></div>
            </div>
            <div class="apd-slider-dot"></div>
            <div class="apd-slider-steps">
                ${steps.map((step) => step.hide ? "" : `<div class="apd-slider-step">${step.name}</div>`).join("")}
            </div>
        `;
    const $dot = query(".apd-slider-dot", container);
    const $progress = query(".apd-slider-progress", container);
    let isDroging = false;
    function reset(index = findIndex()) {
      if (index < min || index > max)
        return;
      const percentage = (index - min) / (max - min);
      $dot.style.left = `${percentage * 100}%`;
      if (steps.length === 0) {
        $progress.style.width = $dot.style.left;
      }
      onChange(index);
    }
    function updateLeft(event) {
      const { top, height, left, width } = container.getBoundingClientRect();
      if (this.art.isRotate) {
        const value = clamp(event.clientY - top, 0, height);
        const index = Math.round(value / height * (max - min) + min);
        reset(index);
      } else {
        const value = clamp(event.clientX - left, 0, width);
        const index = Math.round(value / width * (max - min) + min);
        reset(index);
      }
    }
    this.art.proxy(container, "click", (event) => {
      updateLeft.call(this, event);
    });
    this.art.proxy(container, "pointerdown", (event) => {
      isDroging = event.button === 0;
    });
    this.art.on("document:pointermove", (event) => {
      if (isDroging) {
        updateLeft.call(this, event);
      }
    });
    this.art.on("document:pointerup", (event) => {
      if (isDroging) {
        isDroging = false;
        updateLeft.call(this, event);
      }
    });
    return { reset };
  }
  onFullscreen(state) {
    const { $danmuku, $controlsCenter, $mount } = this.template;
    if (this.outside) {
      if (state) {
        this.append($controlsCenter, $danmuku);
      } else {
        this.append($mount, $danmuku);
      }
    } else {
      this.append($controlsCenter, $danmuku);
    }
  }
  onMouseEnter({ $control, $panel }) {
    const { $player } = this.art.template;
    const controlRect = $control.getBoundingClientRect();
    const panelRect = $panel.getBoundingClientRect();
    const playerRect = $player.getBoundingClientRect();
    const half = panelRect.width / 2 - controlRect.width / 2;
    const left = playerRect.left - (controlRect.left - half);
    const right = controlRect.right + half - playerRect.right;
    if (left > 0) {
      $panel.style.left = `${-half + left}px`;
    } else if (right > 0) {
      $panel.style.left = `${-half - right}px`;
    } else {
      $panel.style.left = `${-half}px`;
    }
  }
  async emit() {
    const { $input } = this.template;
    const text = $input.value.trim();
    if (!text.length)
      return;
    if (this.isLock)
      return;
    if (this.emitting)
      return;
    const danmu = {
      text,
      mode: this.option.mode,
      color: this.option.color,
      time: this.art.currentTime
    };
    try {
      this.emitting = true;
      const state = await this.option.beforeEmit(danmu);
      this.emitting = false;
      if (state !== true)
        return;
      danmu.border = true;
      delete danmu.time;
      this.danmuku.emit(danmu);
      $input.value = "";
      this.lock();
    } catch (error) {
      console.error("Error emitting danmuku:", error);
      this.emitting = false;
    }
  }
  lock() {
    const { addClass } = this.utils;
    const { $send } = this.template;
    this.isLock = true;
    let time = this.option.lockTime;
    $send.textContent = time;
    addClass($send, "apd-lock");
    const loop = () => {
      this.timer = setTimeout(() => {
        if (time === 0) {
          this.unlock();
        } else {
          time -= 1;
          $send.textContent = time;
          loop();
        }
      }, 1e3);
    };
    loop();
  }
  unlock() {
    const { removeClass } = this.utils;
    const { $send } = this.template;
    clearTimeout(this.timer);
    this.isLock = false;
    $send.textContent = "发送";
    removeClass($send, "apd-lock");
  }
  resize() {
    if (this.outside)
      return;
    if (this.art.fullscreen)
      return;
    if (this.art.fullscreenWeb)
      return;
    const { $player, $controlsCenter } = this.art.template;
    const { $danmuku } = this.template;
    if (this.art.width < this.option.width) {
      this.append($player, $danmuku);
    } else {
      this.append($controlsCenter, $danmuku);
    }
  }
  reset() {
    const { inverseClass, tooltip } = this.utils;
    const { $toggle, $colors } = this.template;
    this.slider.opacity.reset();
    this.slider.margin.reset();
    this.slider.fontSize.reset();
    this.slider.speed.reset();
    this.setData("danmukuVisible", this.option.visible);
    this.setData("danmukuMode", this.option.mode);
    this.setData("danmukuColor", this.option.color);
    this.setData("danmukuMode0", this.option.modes.includes(0));
    this.setData("danmukuMode1", this.option.modes.includes(1));
    this.setData("danmukuMode2", this.option.modes.includes(2));
    this.setData("danmukuAntiOverlap", this.option.antiOverlap);
    this.setData("danmukuSyncVideo", this.option.synchronousPlayback);
    this.setData("danmukuTheme", this.option.theme);
    this.setData("danmukuEmitter", this.option.emitter);
    const colors = $colors.children;
    const $color = Array.from(colors).find((item) => item.dataset.color === this.option.color.toUpperCase());
    $color && inverseClass($color, "apd-active");
    tooltip($toggle, this.option.visible ? "关闭弹幕" : "打开弹幕");
    this.resize();
  }
  mount(target) {
    const { errorHandle } = this.utils;
    const $el = typeof target === "string" ? document.querySelector(target) : target;
    errorHandle($el, `Can not find the mount point: ${target}`);
    this.append($el, this.template.$danmuku);
    this.template.$mount = $el;
    this.reset();
  }
}
if (typeof document !== "undefined") {
  const id = "artplayer-plugin-danmuku";
  let $style2 = document.getElementById(id);
  if (!$style2) {
    $style2 = document.createElement("style");
    $style2.id = id;
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        document.head.appendChild($style2);
      });
    } else {
      (document.head || document.documentElement).appendChild($style2);
    }
  }
  $style2.textContent = style;
}
function artplayerPluginDanmuku(option) {
  return (art) => {
    const danmuku = new Danmuku(art, option);
    const setting = new Setting(art, danmuku);
    if (danmuku.option.heatmap) {
      heatmap(art, danmuku, danmuku.option.heatmap);
    }
    return {
      name: "artplayerPluginDanmuku",
      emit: danmuku.emit.bind(danmuku),
      load: danmuku.load.bind(danmuku),
      config: danmuku.config.bind(danmuku),
      hide: danmuku.hide.bind(danmuku),
      show: danmuku.show.bind(danmuku),
      reset: danmuku.reset.bind(danmuku),
      mount: setting.mount.bind(setting),
      get option() {
        return danmuku.option;
      },
      get isHide() {
        return danmuku.isHide;
      },
      get isStop() {
        return danmuku.isStop;
      }
    };
  };
}
artplayerPluginDanmuku.icons = Setting.icons;
if (typeof window !== "undefined") {
  window.artplayerPluginDanmuku = artplayerPluginDanmuku;
}
export {
  artplayerPluginDanmuku as default
};

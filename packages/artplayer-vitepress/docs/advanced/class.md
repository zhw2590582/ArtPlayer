# 静态属性

这里的 `静态属性` 是指挂载在 `构造函数` 的 `一级属性`，非常少使用

## `instances`

返回全部播放器实例的数组，假如你想同时管理多个播放器的时候，可以用到该属性

<div className="run-code">▶ Run Code</div>

```js
console.info([...Artplayer.instances]);

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info([...Artplayer.instances]);
```

## `version`

返回播放器的版本信息

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.version);
```

## `env`

历史根声明保留此字段，但冻结的 npm 5.4.0 与当前 6.0.0 运行时均未提供，读取返回 undefined，不能用来可靠判断运行环境。

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.env);
```

## `build`

历史根声明保留此字段，但冻结的 npm 5.4.0 与当前 6.0.0 运行时均未在此提供打包时间，读取返回 undefined；需要时应使用自己的发布元信息。

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.build);
```

## `config`

返回共享的媒体接口清单，不是播放器默认选项（默认选项见 Artplayer.option）。

### 媒体接口清单 {#config-contract}

该getter每次返回同一个对象。properties、methods、events、prototypes数组分别列出媒体属性名、可调用方法、原生事件、其他video专用成员。它们是名称清单而非能力保证；代理和浏览器可能只支持其中一部分。

核心在安装原生事件转发时读取config.events，随后转发为video:事件名；之后改数组不会增删已有实例的监听器。调试日志和代理适配器也会使用清单，修改名称不会创建对应的原生方法/属性。根Config保留历史readonly tuple类型，runtime Config准确描述可变字符串数组；修改会影响共享使用者，应保留顺序并还原临时测试修改。

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.config);
```


```ts
import Artplayer from 'artplayer/runtime';
import type { Config } from 'artplayer/runtime';

const config: Config = Artplayer.config;
const nativeNames: string[] = config.events.slice();
const shared: boolean = Artplayer.config === config;
void [nativeNames, shared];
```

## `utils`

返回播放器的工具函数集合

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.utils);
```

:::warning 全部工具函数请参考以下地址：

[artplayer/types/utils.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/utils.d.ts)

:::

### 环境与类型 {#utils-contract}

`Artplayer.utils` 是公开工具集合，不绑定某个播放器。纯文本和数据函数可独立使用；DOM、图片、样式和测量函数需要浏览器及相应节点。不会因为工具来自 Artplayer，就自动在播放器销毁时清理调用者创建的资源。

`isBrowser`、`userAgent`、`isMobile`、`isSafari`、`isIOS`、`isIOS13` 在模块加载时计算，不随之后的窗口或 UA 修改更新。UA 优先取加载前设置的 `globalThis.CUSTOM_USER_AGENT`，否则取 navigator；`isIOS13` 也包含带触摸能力的 Macintosh 判断。这些是兼容性启发式判断，不是某项播放能力或系统版本的保证。

根 `Utils` 保留旧类型签名；`artplayer/runtime` 的 `Utils` 描述实际返回值和更广的 DOM 输入。内部辅助形状 `StyledElement` 只要求 style，`EventPathSource` 要求 target 和可选 composedPath；它们不是 runtime 入口单独导出的命名类型。泛型查询只提供静态类型，不校验节点的实际标签。

### DOM 与样式 {#utils-dom}

| 工具 | 参数、返回值和边界 |
| --- | --- |
| `query(selector, parent?)` / `queryAll(selector, parent?)` | 默认 parent 为 document；返回首个元素或 null / 新数组。查询的是后代，不含 parent 自己；非法选择器仍抛错 |
| `createElement(tag)` | 新建原生 HTML 元素，不挂载 |
| `addClass` / `removeClass` / `hasClass` | 接收节点与单个 class token；前两者返回 undefined，后者返回布尔；保留原生 classList 的参数错误 |
| `append(parent, child)` | 同 realm Element 会被移动；其他值先转字符串再作为 HTML 追加。返回 lastElementChild，若不存在才取 lastChild，因此不保证返回刚追加的文本，空父节点可能返回 null |
| `remove(child)` / `replaceElement(newChild, oldChild)` | 分别返回被移除节点 / 新节点；节点没有父节点时仍会抛错 |
| `siblings(target)` / `inverseClass(target, name)` | 前者返回同父元素的其他元素；后者移除兄弟元素上的类并给目标添加，返回 undefined。要求目标有 parentElement |
| `setStyle(element, key, value)` / `setStyles(element, styles)` | 直接写 style 并返回原元素；setStyles 遍历可枚举字符串属性，包括继承属性。不补单位、不自动清空旧样式 |
| `getStyle(element, key, numberType = true)` | 用 getComputedStyle/getPropertyValue 读取；默认 parseFloat，不能转为数字时为 NaN；传 false 返回原字符串。使用 CSS 属性名，如 `font-size` |
| `setStyleText(id, cssText)` | 更新已有同 id 元素的 textContent；否则创建 style。document 正在加载时延迟到 DOMContentLoaded 挂入 head；无 Promise 或自动释放，调用者应使用独立 id |
| `getRect(element)` | 原样返回 getBoundingClientRect 的 DOMRect，而不只是旧类型里的四个字段 |
| `getIcon(key = '', html = '')` | 每次返回新的 i 元素，带 art-icon 与 art-icon-key 类；使用 append 规则插入内容，元素不会复制 |
| `tooltip(target, message, position = 'top')` | 非移动端设置 aria-label 和 hint--rounded / hint--position 类；移动端不操作。再次调用不会移除旧方向类 |

HTML 字符串不会自动净化。需要显示纯文本时使用 textContent，或先按用途转义；不要把不可信输入直接交给 append/getIcon。

### 事件与测量 {#utils-measure}

| 工具 | 实际行为 |
| --- | --- |
| `getComposedPath(event)` | 有 composedPath 时保留其 receiver 并直接返回原数组；否则沿 target.parentNode 向上遍历，浏览器中补入 window。fallback 不模拟完整 Shadow DOM 路径 |
| `includeFromEvent(event, target)` | 判断目标是否在上述路径中，不是另一次 DOM contains 查询 |
| `isInViewport(element, offset = 0)` | 判断矩形与窗口是否相交，包含边界；不是完全可见、遮挡或 IntersectionObserver 判断，保留历史 offset 算法 |
| `getSafeAreaInsets()` | 挂载临时不可见节点，读取四个 env(safe-area-inset-*) 的数值，不能解析时为0；成功或失败都移除该节点，要求 document.body 可用 |
| `supportsFlex()` | 只检查新建元素能否接受 display:flex，不验证实际布局能力 |

### 字幕、图片与文件 {#utils-resources}

| 工具 | 实际行为与归属 |
| --- | --- |
| `srtToVtt(text)` / `assToVtt(text)` | 同步返回 WebVTT 字符串；前者规范毫秒与部分样式标记，后者提取 Dialogue 的基础时间/文本，不是完整字幕校验器或 ASS 排版引擎 |
| `vttToBlob(text)` | 返回 text/vtt 的 Blob URL，不返回 Blob 对象；调用者在不再使用时 URL.revokeObjectURL |
| `getExt(url)` | 去除查询/片段，trim并转小写，取最后一个点之后的文本；没有点时返回剩余字符串，不检查资源或 MIME |
| `download(url, name)` | 临时创建带 download 的链接、点击并移除；不返回完成通知，不代表浏览器一定保存成功，也不回收传入 URL |
| `loadImg(url, scale?)` | 返回加载完成的 HTMLImageElement。scale 为假值或1时使用原图；其他值通过 canvas/toBlob 再加载缩放图。缩放成功后的 image.src 是调用者拥有的 Blob URL，用完必须回收 |

`loadImg` 不自动设置 crossOrigin，也没有公开取消或超时参数。跨域原图能显示不代表可读 canvas；加载、画布或编码失败会拒绝 Promise。成功后的监听器已清理；缩放中失败会释放已创建的 Blob URL。仅在页面不再使用缩放结果后回收其 src，原图 URL 不属于此函数。

### 数据、错误与调度 {#utils-data}

| 工具 | 实际行为 |
| --- | --- |
| `def(object, key, descriptor)` | Object.defineProperty 本身，返回原对象；根声明保留的字符串 key 重载返回 void 并非运行时结果 |
| `has(object, key)` / `get(object, key)` | 仅检查自有属性 / 获取自有描述符，缺少描述符为 undefined |
| `mergeDeep(...objects)` | 新建顶层对象；遍历 Object.keys，两个非数组对象递归合并。两个数组使用旧 concat 展开规则，可能展开后一个数组中的嵌套数组；不是完全深拷贝，未合并的值会保留引用。不支持循环图合并；__proto__ 作为自有数据写入 |
| `clamp(number, a, b)` | 将数值限制在两端点之间，允许端点反序；NaN 仍为 NaN |
| `secondToTime(seconds)` | 向下取整为 mm:ss，达到一小时后为 hh:mm:ss，小时可超过两位；假值为00:00。不额外校验负数或非有限值 |
| `escape(text)` / `unescape(text)` | 只处理 &、<、>、单引号和双引号对应的五种固定实体；单次替换，unescape 不是通用 HTML 实体解析器 |
| `capitalize(text)` | 只将第一个字符大写，其余不变 |
| `ArtPlayerError(message?, context?)` / `errorHandle(condition, message?)` | 前者是 name 为 ArtPlayerError 的 Error，context 用于支持的 stack capture；后者对假值抛该错误，对真值返回原值 |
| `silencePromise(value)` | 有可调用 catch 时返回 catch 吞掉拒绝后的结果，否则原样返回；按 catch 能力判断而不是 instanceof Promise，不捕获调用 catch 本身的同步错误 |
| `sleep(milliseconds = 0)` | 定时后兑现为 undefined；没有取消方法 |
| `debounce(callback, duration)` | trailing 调用，只保留最后一次参数和调用者 this；忽略旧 context 参数，包装函数返回 undefined |
| `throttle(callback, duration)` | leading 同步调用，等待期内丢弃调用，无 trailing；保留调用者 this，包装函数返回 undefined |

两个包装器不提供 cancel/flush，不随播放器销毁自动取消。throttle 在回调正常返回之后才进入等待期，因此保留同步重入和抛错后再次调用的行为。根类型的旧回调返回值推导不改变这些实际语义。

```ts
import Artplayer from 'artplayer/runtime';
import type { Utils } from 'artplayer/runtime';

const utils: Utils = Artplayer.utils;
const fragment = document.createDocumentFragment();
const missing: HTMLVideoElement | null = utils.query<HTMLVideoElement>('video', fragment);
const div = utils.createElement('div');
const styled: HTMLDivElement = utils.setStyle(div, 'fontSize', '20px');
const width: string = utils.getStyle(div, 'width', false);
const invoke = utils.debounce(function (this: { value: number }, step: number) {
    this.value += step;
}, 20);
const returned: void = invoke.call({ value: 0 }, 1);
void [missing, styled, width, returned];
```


## `scheme`

返回播放器选项的校验方案

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.scheme);
```

## `Emitter`

返回事件分发器的构造函数

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.Emitter);
```

## `validator`

返回选项的校验函数

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.validator);
```

## `kindOf`

返回类型检测的函数工具

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.kindOf);
```

## `html`

返回播放器所需的 `html` 字符串

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.html);
```

这是当前版本的静态基础模板，包含播放器所需的 class 和媒体/控件节点，不是某个实例当前 DOM 的快照。通过 `useSSR: true` 复用预先插入的模板时，应保留完整结构并匹配版本；该选项不会让构造函数在无浏览器环境中运行。实际实例没有 `template.html` 属性，旧根类型为兼容保留的这个成员不能代替静态入口。

## `option`

返回播放器的默认选项

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.option);
```
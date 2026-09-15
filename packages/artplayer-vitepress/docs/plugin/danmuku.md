# 弹幕库

[English guide](../en/plugin/danmuku.md)

本文描述当前重构分支。`/runtime` 类型入口与本轮修复尚未发布到 npm；CDN 默认仍加载已发布版本。

## 演示

👉 [查看完整演示](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js&example=danmuku)

下方 Run Code 使用本站构建的插件与样本。接入自己的应用时，请替换容器和媒体 URL。

## 安装

::: code-group

```bash [npm]
npm install artplayer-plugin-danmuku
```

```bash [yarn]
yarn add artplayer-plugin-danmuku
```

```bash [pnpm]
pnpm add artplayer-plugin-danmuku
```

```html [script]
<script src="path/to/artplayer-plugin-danmuku.js"></script>
```

:::

## CDN

::: code-group

```bash [jsdelivr.net]
https://cdn.jsdelivr.net/npm/artplayer-plugin-danmuku/dist/artplayer-plugin-danmuku.js
```

```bash [unpkg.com]
https://unpkg.com/artplayer-plugin-danmuku/dist/artplayer-plugin-danmuku.js
```

:::

## 弹幕结构

每一个弹幕是一个对象，多个弹幕组成的数组就是弹幕库，通常只需要`text`就可以发送一个弹幕，其余都是非必要参数

```js
{
    text: '', // 弹幕文本
    time: 10, // 弹幕时间, 单位秒，省略时为当前播放器时间加 0.5 秒；显式 0 保留
    mode: 0, // 弹幕模式: 0: 滚动(默认)，1: 顶部，2: 底部
    color: '#FFFFFF', // 弹幕颜色，默认使用配置 color（初始为白色）
    border: false, // 弹幕是否有描边, 默认为 false
    style: {}, // 弹幕自定义样式, 默认为空对象
}
```

## 全部选项

工厂需要一个配置对象。运行时可传 `{}`，每个字段都有默认值；旧版根入口类型仍要求 `danmuku`，旧项目继续传入它即可。准确类型见下方 TypeScript 说明。

```js
{
    danmuku: [], // 弹幕数据
    speed: 5, // 弹幕持续时间，范围在[1 ~ 10]
    margin: [10, '25%'], // 弹幕上下边距，支持像素数字和百分比
    opacity: 1, // 弹幕透明度，范围在[0 ~ 1]
    color: '#FFFFFF', // 默认弹幕颜色，可以被单独弹幕项覆盖
    mode: 0, // 默认弹幕模式: 0: 滚动，1: 顶部，2: 底部
    modes: [0, 1, 2], // 弹幕可见的模式
    fontSize: 25, // 弹幕字体大小，支持像素数字和百分比
    antiOverlap: true, // 弹幕是否防重叠
    synchronousPlayback: false, // 是否同步播放速度
    mount: undefined, // 弹幕发射器挂载点, 默认为播放器控制栏中部
    heatmap: false, // 是否开启热力图
    width: 512, // 当播放器宽度小于此值时，弹幕发射器置于播放器底部
    points: [], // 保留的配置字段；绘制自定义数据请发送 points 事件
    filter: () => true, // 弹幕载入前的过滤器，只支持返回布尔值
    beforeEmit: () => true, // 输入框发送前的过滤器，支持返回 Promise
    beforeVisible: () => true, // 弹幕显示前的过滤器，支持返回 Promise
    visible: true, // 弹幕层是否可见
    emitter: true, // 是否开启弹幕发射器
    maxLength: 200, // 弹幕输入框最大长度, 范围在[1 ~ 1000]
    lockTime: 5, // 输入框锁定时间，范围在[1 ~ 60]
    theme: 'dark', // 弹幕主题，支持 dark 和 light，只在自定义挂载时生效
    OPACITY: {}, // 不透明度配置项
    FONT_SIZE: {}, // 弹幕字号配置项
    MARGIN: {}, // 显示区域配置项
    SPEED: {}, // 弹幕速度配置项
    COLOR: [], // 颜色列表配置项
}
```

`OPACITY`、`FONT_SIZE`、`MARGIN`、`SPEED` 可覆盖滑块的 `min`、`max`、`steps`。
每个 step 可包含 `name`、`value`、`hide`、`show`；MARGIN 的 value 是上下边距数组。
`COLOR` 用 CSS 颜色字符串数组替换调色板，空数组使用内置调色板。

## 生命周期

`filter` 同步执行，不应返回 Promise；`beforeEmit` 可异步，但只有严格返回 `true` 才发送。`beforeVisible` 可以异步。普通函数形式的这三个回调，其 `this` 都是当前配置对象。直接调用 `emit` 不执行 `beforeEmit`，需要业务校验时请在调用前完成。

来自用户输入的弹幕: 

`beforeEmit -> filter -> beforeVisible -> artplayerPluginDanmuku:visible`

来自服务器或直接调用 `emit` 的弹幕:

`filter -> beforeVisible -> artplayerPluginDanmuku:visible`

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
// 保存到数据库
function saveDanmu(danmu) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    })
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',

            // 这是用户在输入框输入弹幕文本，然后点击发送按钮后触发的函数
            // 你可以对弹幕做合法校验，或者做存库处理
            // 当返回true后才表示把弹幕加入到弹幕队列
            async beforeEmit(danmu) {
               const isDirty = (/fuck/i).test(danmu.text);
               if (isDirty) return false;
               const state = await saveDanmu(danmu);
               return state;
            },

            // 这里是所有弹幕的过滤器，包含来自服务端的和来自用户输入的
            // 你可以对弹幕做合法校验
            // 当返回true后才表示把弹幕加入到弹幕队列
            filter(danmu) {
                return danmu.text.length <= 200;
            },

            // 这是弹幕即将显示的时触发的函数
            // 你可以对弹幕做合法校验
            // 当返回true后才表示可以马上发送到播放器里
            async beforeVisible(danmu) {
               return true;
            },
        }),
    ],
});

// 弹幕已经出现在播放器里，你可以访问到弹幕的dom元素里
art.on('artplayerPluginDanmuku:visible', danmu => {
    danmu.$ref.textContent = 'ଘ(੭ˊᵕˋ)੭: ' + danmu.$ref.textContent;
})
```

## 使用弹幕数组

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: [
                {
                    text: '使用数组',
                    time: 1
                },
            ],
        }),
    ],
});
```

## 使用弹幕 XML

弹幕 XML 文件，和 Bilibili 网站的弹幕格式一致

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});
```

## 使用异步返回

也可以直接传入 `Promise<弹幕数组>`，或传入同步返回数组的函数。输入函数没有配置对象作为 `this`。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: function () {
                return new Promise((resolve) => {
                    return resolve([
                        {
                            text: '使用 Promise 异步返回',
                            time: 1
                        },
                    ]);
                });
            },
        }),
    ],
});
```

## `hide/show`

通过方法 `hide` 和 `show` 进行隐藏或者显示弹幕

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: '隐藏弹幕',
            click: function () {
                art.plugins.artplayerPluginDanmuku.hide();
            },
        },
        {
            position: 'right',
            html: '显示弹幕',
            click: function () {
                art.plugins.artplayerPluginDanmuku.show();
            },
        },
    ],
});
```

## `isHide`

通过属性 `isHide` 判断当前弹幕是隐藏或者显示

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: '隐藏弹幕',
            click: function (_, event) {
                if (art.plugins.artplayerPluginDanmuku.isHide) {
                    art.plugins.artplayerPluginDanmuku.show();
                    event.target.innerText = '隐藏弹幕';
                } else {
                    art.plugins.artplayerPluginDanmuku.hide();
                    event.target.innerText = '显示弹幕';
                }
            },
        },
    ],
});
```

## `emit`

通过方法 `emit` 向队列添加一条弹幕。它返回 Promise；完成表示入队处理完成，不代表已经显示。请用 `await` 或 `.catch(...)` 处理拒绝。省略时间时安排在当前播放时间之后 0.5 秒，显示仍受播放状态、过滤器和可用轨道影响。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: '发送弹幕',
            click: function () {
                var text = prompt('请输入弹幕文本', '弹幕测试文本');
                if (!text || !text.trim()) return;
                var color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
                art.plugins.artplayerPluginDanmuku.emit({
                    text: text,
                    color: color,
                    border: true,
                }).catch(console.error);
            },
        },
    ],
});
```

## `config`

通过方法 `config` 同步合并弹幕配置。更改 `danmuku` 不会自动重新加载，之后调用无参数的 `load()` 才会替换队列；无效配置不会覆盖现有配置。需要移动发射器时调用 `mount(target)`；热力图应在初始化时启用，`config({ heatmap: true })` 不会创建热力图。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: '弹幕大小：<input type="range" min="12" max="50" step="1" value="25">',
            style: {
                display: 'flex',
                alignItems: 'center',
            },
            mounted: function ($setting) {
                const $range = $setting.querySelector('input[type=range]');
                $range.addEventListener('change', () => {
                    art.plugins.artplayerPluginDanmuku.config({
                        fontSize: Number($range.value),
                    });
                });
            },
        },
    ],
});
```

## `load`

通过 `load` 重载、切换或追加弹幕库，返回 Promise。无参数 `load()` 在读取配置中的输入成功后替换队列；传入 `load(input)` 则追加。输入读取失败不会清空现有队列，但逐条过滤时发生异常不保证整批回滚。并发追加互不取消，新的替换会取消尚未完成的旧替换。销毁会取消未完成加载；被取消的 Promise 仍正常结束，但不会发出迟到的 loaded/error 事件。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
            emitter: false,
        }),
    ],
    controls: [
        {
            position: 'right',
            html: '重载',
            click: function () {
                // 重新加载当前弹幕库
                art.plugins.artplayerPluginDanmuku.load().catch(console.error);
            },
        },
        {
            position: 'right',
            html: '切换',
            click: function () {
                // 切换到新的弹幕库
                art.plugins.artplayerPluginDanmuku.config({
                    danmuku: '/assets/sample/danmuku-v2.xml',
                });
                art.plugins.artplayerPluginDanmuku.load().catch(console.error);
            },
        },
        {
            position: 'right',
            html: '追加',
            click: function () {
                // 追加新的弹幕库，参数类型和option.danmuku相同
                const target = '/assets/sample/danmuku.xml'
                art.plugins.artplayerPluginDanmuku.load(target).catch(console.error);
            },
        },
    ],
});
```

## `reset`

用于清空当前显示的弹幕并将队列项重置为等待状态。它不删除队列；后续播放仍可按时间显示弹幕。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});

art.on('resize', () => {
    art.plugins.artplayerPluginDanmuku.reset();
});
```

## `mount`

在初始化弹幕插件的时候，是可以指定弹幕发射器的挂载位置的，默认是挂载在控制栏的中部，你也可以把它挂载在播放器以外的地方。
当播放器全屏的时候，发射器会自动回到控制栏的中部。假如你挂载的地方是亮色的话，建议把 `theme` 设置成 `light`，否则会看不清。

退出全屏后会返回配置的挂载点。`mount(target)` 必须传入已存在的元素或选择器，省略参数不会恢复默认位置；它返回 `undefined`。销毁会移除插件面板，应用创建的外部容器由应用清理。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var $danmu = document.createElement('div');
document.querySelector('.artplayer-app').after($danmu);

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
    plugins: [
        artplayerPluginDanmuku({
            mount: $danmu,
            theme: 'dark',
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});

art.on('destroy', () => $danmu.remove());

// 也可以手动挂载
// art.plugins.artplayerPluginDanmuku.mount($danmu);
```

## `option`

用于获取当前弹幕配置，返回实时配置对象。更新配置请调用 `config`，避免直接修改对象而绕过校验和 UI 同步。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});

art.on('ready', () => {
    console.info(art.plugins.artplayerPluginDanmuku.option);
});
```

## 事件

使用 `art.on(name, callback)` 订阅，`art.off(name, callback)` 取消订阅。事件不会向迟到的监听器重放；初始空数组可能在构造期间就完成加载。若需要观察后续加载，先订阅再调用 `load()`。

`loaded` 参数是当前完整队列，包含已追加数据；`error` 也可能来自显示调度。监听错误事件并不能代替处理公开方法的 Promise 拒绝。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});

art.on('artplayerPluginDanmuku:visible', (danmu) => {
    console.info('显示弹幕', danmu);
});

art.on('artplayerPluginDanmuku:loaded', (danmus) => {
    console.info('加载弹幕', danmus.length);
});

art.on('artplayerPluginDanmuku:error', (error) => {
    console.info('弹幕错误', error);
});

art.on('artplayerPluginDanmuku:config', (option) => {
    console.info('配置变化', option);
});

art.on('artplayerPluginDanmuku:stop', () => {
    console.info('弹幕停止');
});

art.on('artplayerPluginDanmuku:start', () => {
    console.info('弹幕开始');
});

art.on('artplayerPluginDanmuku:hide', () => {
    console.info('弹幕隐藏');
});

art.on('artplayerPluginDanmuku:show', () => {
    console.info('弹幕显示');
});

art.on('artplayerPluginDanmuku:reset', () => {
    console.info('弹幕重置');
});

art.on('artplayerPluginDanmuku:destroy', () => {
    console.info('弹幕销毁');
});
```

## `isStop` 与方法返回值

`art.plugins.artplayerPluginDanmuku.isStop` 是实时只读的停止状态，与 `isHide` 不同，也不表示媒体是否准备就绪。
`emit/load` 返回的 Promise 完成后得到内部 Danmuku 对象；`config/hide/show/reset` 同步返回同一个内部对象。它与注册在 `art.plugins` 上的插件对象不是同一个对象。后续命令继续通过注册的插件调用即可。

`beforeEmit` 抛出或拒绝时会在控制台报告错误，输入框可再次尝试发送。
`beforeVisible` 拒绝时，对该项在当前调度轮报告一次 `artplayerPluginDanmuku:error`，其他项继续处理；暂停后恢复、reset 或更换回调后，仍符合时间条件的项可重试。
暂停、seek、隐藏、reset 和销毁会取消尚未完成的显示准备。

## 热力图

初始化时设置 `heatmap: true`，按队列自动采样；直播不绘制热力图。
本轮修复了密集弹幕曲线过高遮挡视频的问题（issue #958），自动曲线会适配到图表底部四分之一区域。显式设置有限的 `yMin/yMax` 或发送自定义 points 时保留原坐标映射。

`heatmap` 也可传配置对象：`xMin`、`xMax`、`yMin`、`yMax`、`scale`、`opacity`、`minHeight`、`sampling`、`smoothing`、`flattening`。
默认分别为 `0`、图表宽度、`0`、`128`、`0.25`、`0.2`、`floor(图表高度 * 0.05)`、`max(1, floor(图表宽度 / 100))`、`0.2`、`0.2`。

绘制自定义数据使用 `art.emit('artplayerPluginDanmuku:points', points)`，每项为 `[x, value]`。默认 x 是图表像素坐标，不是秒。
渲染会修改内层数组的第二项，保留原数据时请复制每一对坐标。配置中的 `points` 字段仅存储，不会自动绘图。
resize 或成功 load 会恢复自动曲线，需要自定义曲线时可在这些事件后重新发送。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [artplayerPluginDanmuku({
        danmuku: [{ text: '热力图示例', time: 1 }],
        heatmap: true,
    })],
});
var points = [[0, 5], [0.25, 12], [0.5, 30], [0.75, 10], [1, 5]];
function drawPoints() {
    var width = art.controls.heatmap.offsetWidth;
    art.emit('artplayerPluginDanmuku:points', points.map(([ratio, value]) => [ratio * width, value]));
}
art.on('ready', drawPoints);
art.on('resize', drawPoints);
art.on('artplayerPluginDanmuku:loaded', drawPoints);
```

## TypeScript

根入口和 `/legacy` 保留 npm 5.3.0 的历史声明形状，其中部分方法返回值与真实运行时不一致。
当前分支新增 `/runtime` 提供准确类型，加载的仍是同一个运行时工厂；该入口尚未发布，不能从旧 CDN 版本导入。

```ts
import Artplayer from 'artplayer';
import danmuku from 'artplayer-plugin-danmuku/runtime';
import type { RuntimeOption, Point, EventMap } from 'artplayer-plugin-danmuku/runtime';

const option: RuntimeOption = { danmuku: [], heatmap: true };
const points: Point[] = [[0, 5], [100, 10]];
const onError = (...[error]: EventMap['artplayerPluginDanmuku:error']) => console.error(error);
const art = new Artplayer({ container: '#player', url: '/video.mp4', plugins: [danmuku(option)] });
art.on('artplayerPluginDanmuku:error', onError);
```

`EventMap` 显式描述事件参数，不会自动扩展核心历史事件声明。工厂仍暴露 `icons` 对象供自定义图标。
包内 `README.md` 和 `ARCHITECTURE.md` 维护模块职责、验证命令及尚未完成的设备和组合验收。

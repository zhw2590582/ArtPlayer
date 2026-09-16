# 基础选项

## 构造与配置归属 {#construction-contract}

`new Artplayer(option, readyCallback?)` 同步构造实例，需要浏览器和 DIV 容器，可以传节点或 CSS 选择器。默认值里虽然有 '#artplayer'，构造输入仍必须提供 container：校验前会用输入值覆盖该默认值。同一容器同时只能归属一个活跃实例。未开启 useSSR 时会替换容器内容；开启后须提前放入版本匹配的 Artplayer.html，它不会启用服务端构造，也不会修补缺失的模板。

每次构造读取一份新的 Artplayer.option，合并输入、校验后再创建子系统。配置校验失败发生在挂载 DOM 和调用 proxy 之前。初始化失败会释放已归属的资源并恢复捕获的容器内容；构造器成功返回不代表媒体、字幕、异步插件或外部 SDK 已就绪。

第二参数才是 ready 回调，不是名为 onReady 的配置项。普通函数的 this 和第一个参数都是播放器实例。该回调在构造插件之后注册，由首次成功处理的 canplay 触发，不等待插件 Promise。允许空 URL，之后再赋值。数字 art.id 与 option.id 不同，后者是可选的播放记忆键。

### 合并与校验 {#option-merge}

- 每次读取 Artplayer.option 都得到独立的嵌套默认配置，修改返回对象不会设置全局默认值。lang 读取当前 navigator.language 并转为小写；moreVideoAttr.preload 使用模块加载时的 Safari 判断。非浏览器读取时 lang 可能为 undefined，但构造仍要求浏览器。
- 合并创建新的顶层对象，两边都存在的对象递归合并；数组沿用 concat/spread 规则，因此数组本身是新的，普通对象成员仍保留身份。函数和 Element 保留引用，这不是完整深拷贝。组件之后可能给共享的条目对象添加元信息。
- 自有可枚举的扩展字段保留，不受 schema 校验。继承字段通常不参与，container 则会再次从输入显式读取，因此 getter 可能执行多次。显式 undefined 可以覆盖必填默认值并导致校验失败，不能当作省略字段。
- Artplayer.scheme 是共享且可修改的校验规则。Artplayer.validator(value, scheme) 校验传入值，成功返回原对象，遇到第一个非法已知字段即抛错；不合并默认值，也不挂载播放器。Artplayer.kindOf 是校验器的类型分类函数，不是媒体能力检测。runtime 类型还提供校验器用于错误路径的可选第三参数。
- art.option 是合并后的实际对象，不是响应式配置入口。一些回调之后仍会读取它，另一些值只在初始化时捕获或创建 UI。播放行为使用对应 setter，UI 使用组件管理器；给配置字段赋新值不会自动重建全部功能。

### 初始媒体值与优先级 {#option-precedence}

moreVideoAttr 通过 art.attr 写入媒体的**属性**，不是调用 setAttribute。值为 undefined 时沿用 attr 的读取分支，不执行写入。之后核心应用真值 muted、volume、poster、autoplay、playsInline 和 theme，再写 CSS 变量及 URL。不能依靠 moreVideoAttr 的字段顺序覆盖后续步骤。

历史音量初始化只写入真值 option.volume 并钳制到 [0,1]，因此 volume:0 会跳过这一步；随后读取的数字 storage 音量还会覆盖配置值。要求初始静音时使用 muted:true，需要覆盖记忆音量时在构造后设置 art.volume。autoplay/muted/playsInline 的 false 不会撤销 moreVideoAttr 已写入的属性。自动播放及行内播放仍受浏览器策略限制。

非空 theme 会先把 '--art-theme' 写入合并后的 cssVar，再应用样式，因此优先于冲突的初始 cssVar 值。poster 使用播放器的背景层。loop 由 ended 回调执行 seek=0 和 play，区别于通过 moreVideoAttr 设置原生 video.loop。

### UI、平台与内容配置 {#option-capabilities}

| 配置 | 实际作用范围 |
| --- | --- |
| isLive | 选择直播 UI，省略普通进度/时间控件和部分点播辅助功能；不会检测协议或安装解码器 |
| flip、playbackRate、aspectRatio | 启用桌面右键菜单及开启 setting 后的设置选项，不是初始翻转、倍速或比例值 |
| setting、settings | 启用设置 UI 并提供条目；关闭面板时管理器仍存在 |
| screenshot、pip、fullscreen、fullscreenWeb、airplay | 请求相应控件；截图按钮只在桌面添加，AirPlay 还检查原生可用性 API。开关不授予权限，也不保证浏览器支持 |
| hotkey | 启用桌面内置快捷键；false 不移除公开管理器，也不禁止手动注册快捷键 |
| gesture | 在移动端点播模式启用视频区域滑动；进度区域单独绑定，false 不会取消该绑定 |
| lock、fastForward、autoOrientation | 安装移动端辅助功能，fastForward 还要求点播模式。之后改变开关不会安装缺失插件 |
| miniProgressBar、autoPlayback | 安装点播辅助功能；播放记忆使用 id 或当前 URL，需要存储，并不代表自动播放权限 |
| autoMini、autoSize | 响应视口事件/普通状态的 resize 路径，不保证初次可见性检测，也不是持续 ResizeObserver |
| mutex | art.play 成功后暂停其他已登记实例；直接调用原生 video.play 不经过这一方法步骤 |
| backdrop、playsInline | 添加初始背景 CSS 类/写入行内播放属性，实际样式和媒体行为由浏览器决定 |
| layers、controls、contextmenu | 初始组件条目，需提供 html，controls 还需要 position。构造时的右键菜单仅在桌面初始化；回调和清理见组件指南 |
| quality | 构造校验要求字符串 html 和 URL。default 决定标签/选中项，不替换 option.url，也不自动加载该地址。初始选择器延后安装，之后选择条目调用 switchQuality |
| highlight | metadata 就绪时渲染 time/text 标记，定位时间钳制到 duration，文字按文本保存，不是章节播放接口 |
| lang、i18n、icons | 初始语言、词典和图标覆盖，回退规则、节点归属及后续更新见对应管理器指南 |

### 嵌套默认值与媒体适配 {#option-nested}

thumbnails 实际默认值为 `{ url: '', number: 60, column: 10, width: 0, height: 0, scale: 1 }`，描述雪碧图，不是视频地址或缩略图生成器。提供的宽高乘以 scale；否则宽度取图片宽度/column，高度按视频比例计算。格子从零开始按行排列，进度交互时才加载。后续 art.thumbnails 赋值直接替换对象，不再执行构造时的默认值合并，需提供所需几何参数；setter 忽略空 URL 和直播模式赋值。

subtitle 实际默认值包括空 url/type/name、空 style、escape:true、encoding:'utf-8' 和原样返回文本的 onVttLoad。部分构造配置与默认值合并；转换、track 就绪、每次调用的覆盖及 Blob URL 归属见字幕管理器指南，构造返回不代表字幕加载完成。

type 是显式 customType 查找键，未提供时用 getExt 从 URL 推导。核心不规范化显式 type，也不按扩展名安装 SDK。匹配的回调在归属的初始化延迟之后收到 (video, url, art)，this===art；其 Promise 失败会被处理，但不定义媒体就绪。适配器负责设置媒体能力、原生事件和资源清理。没有匹配回调时直接设置 video.src。类型里的可选 art.hls/art.flv 字段不会创建这些库。

proxy 在模板挂载期间更早执行，此时 art.template、video/query/proxy getter 和多数管理器尚不可用。必须返回真正的 HTMLVideoElement 或 HTMLCanvasElement；旧类型虽允许 undefined，运行时仍拒绝它和普通对象。返回节点替换模板 video，className 被设置为 art-video。canvas 的媒体属性、方法和事件需由适配器提供，不会自动获得播放能力。

### 构造器 TypeScript 视图 {#option-types}

根入口 Option 保留历史 URL 必填及读取类型；OptionInput 允许省略 URL 和数字组件 HTML。runtime 提供合并后的配置类型和准确回调视图：ProxyHost 刻意限制可用字段，组件回调里的后续管理器可能尚未赋值，PluginHost 也不假设构造自己的过程中 art.plugins 已存在。这些类型描述同一个构造器，不是不同实现。历史宽松类型不绕过运行时校验，例如构造配置 quality 的 html 仍要求字符串。

```ts
import LegacyArtplayer from 'artplayer';
import type { OptionInput as LegacyInput } from 'artplayer';
import Artplayer from 'artplayer/runtime';
import type { OptionInput, ProxyHost } from 'artplayer/runtime';

const input: LegacyInput = { container: '#legacy', controls: [{ name: 'count', html: 42, position: 'left' }] };
new LegacyArtplayer(input);
const options: OptionInput = {
    container: '#player',
    proxy: function (art: ProxyHost) {
        const same: boolean = this === art;
        void same;
        return document.createElement('video');
    },
    plugins: [function (art) {
        const pending = art.plugins;
        void pending;
        return { name: 'example' };
    }],
};
new Artplayer(options, function (art) {
    const same: boolean = this === art;
    void same;
});
```


## `container`

-   Type: `String, Element`
-   Default: `#artplayer`

播放器挂载的 `DOM` 容器

<div className="run-code">▶ Run Code</div>

```js{2}
var art = new Artplayer({
    container: '.artplayer-app', 
    // container: document.querySelector('.artplayer-app'),
    url: '/assets/sample/video.mp4',
});
```

您可能需要初始化容器元素的大小，如:

```css{2-3}
.artplayer-app {
    width: 400px;
    height: 300px;
}
```

或者使用 `aspect-ratio`：

```css{2}
.artplayer-app {
    aspect-ratio: 16/9;
}
```

:::warning 提示

全部选项里，只有 `container` 是必填的

:::

## `url`

-   Type: `String`
-   Default: `''`

视频源地址

<div className="run-code">▶ Run Code</div>

```js{3}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

有时候 `url` 地址没那么快知道，这时候你可以异步设置 `url`

<div className="run-code">▶ Run Code</div>

```js{6}
var art = new Artplayer({
    container: '.artplayer-app',
});

setTimeout(() => {
    art.url = '/assets/sample/video.mp4';
}, 1000);
```

:::warning 提示

默认支持三种视频文件格式：`.mp4`, `.ogg`, `.webm`

如需要播放 `.m3u8` 或者 `.flv` 等其它格式，请参考左侧的 `第三方库`

:::


## `id`

-   Type: `String`
-   Default: `''`

播放器的唯一标识，目前只用于记忆播放 `autoplayback`

<div className="run-code">▶ Run Code</div>

```js{2}
var art = new Artplayer({
    id: 'your-url-id',
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## `onReady`

-   Type: `Function`
-   Default: `undefined`

构造函数接受一个函数作为第二个参数，播放器初始化成功且视频可以播放时触发，和`ready`事件一样

<div className="run-code">▶ Run Code</div>

```js{7-9}
var art = new Artplayer(
    {
        container: '.artplayer-app',
        url: '/assets/sample/video.mp4',
        muted: true,
    },
    function onReady(art) {
        this.play()
    },
);
```

等同于:

```js{7-9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});

art.on('ready', () => {
    art.play();
});
```

:::warning 提示

回调函数里的`this`就是播放器实例，但回调函数假如使用了箭头函数，`this`则不会指向播放器实例

:::

## `poster`

-   Type: `String`
-   Default: `''`

视频的海报，只会出现在播放器初始化且未播放的状态下

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    poster: '/assets/sample/poster.jpg',
});
```

## `theme`

-   Type: `String`
-   Default: `#f00`

播放器主题颜色，目前用于 `进度条` 和 `高亮元素` 上

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    theme: '#ffad00',
});
```

## `volume`

-   Type: `Number`
-   Default: `0.7`

播放器的默认音量

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    volume: 0.5,
});
```

:::warning 提示

播放器会缓存最后一次音量的大小，下次初始化时（如刷新页面）播放器会读取该缓存值

:::

## `isLive`

-   Type: `Boolean`
-   Default: `false`

使用直播模式，会隐藏进度条和播放时间

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    isLive: true,
});
```

## `muted`

-   Type: `Boolean`
-   Default: `false`

是否默认静音

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    muted: true,
});
```

## `autoplay`

-   Type: `Boolean`
-   Default: `false`

是否自动播放

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoplay: true,
    muted: true,
});
```

:::warning 提示

假如希望默认进入页面就能自动播放视频，`muted` 必需为 `true`，更多信息请阅读 [Autoplay Policy Changes](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)

:::

## `autoSize`

-   Type: `Boolean`
-   Default: `false`

播放器的尺寸默认会填充整个 `container` 容器尺寸，所以经常出现黑边，该值能自动调整播放器尺寸以隐藏黑边，类似 `css` 的 `object-fit: cover;`

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
});
```

## `autoMini`

-   Type: `Boolean`
-   Default: `false`

当播放器滚动到浏览器视口以外时，自动进入 `迷你播放` 模式

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoMini: true,
});
```

## `loop`

-   Type: `Boolean`
-   Default: `false`

是否循环播放

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    loop: true,
});
```

## `flip`

-   Type: `Boolean`
-   Default: `false`

是否显示视频翻转功能，目前只出现在 `设置面板` 和 `右键菜单` 里

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    flip: true,
    setting: true,
});
```

## `playbackRate`

-   Type: `Boolean`
-   Default: `false`

是否显示视频播放速度功能，会出现在 `设置面板` 和 `右键菜单` 里

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    playbackRate: true,
    setting: true,
});
```

## `aspectRatio`

-   Type: `Boolean`
-   Default: `false`

是否显示视频长宽比功能，会出现在 `设置面板` 和 `右键菜单` 里

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    aspectRatio: true,
    setting: true,
});
```

## `screenshot`

-   Type: `Boolean`
-   Default: `false`

是否在底部控制栏里显示 `视频截图` 功能

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    screenshot: true,
});
```

:::warning 提示

由于浏览器安全机制，假如视频源地址和网站是跨域的，可能会出现截图失败

:::

## `setting`

-   Type: `Boolean`
-   Default: `false`

是否在底部控制栏里显示 `设置面板` 的开关按钮

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});
```

## `hotkey`

-   Type: `Boolean`
-   Default: `true`

是否使用快捷键

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    hotkey: true,
});
```

| 热键    | 描述          |
| ------- | ------------- |
| `↑`     | 增加音量      |
| `↓`     | 降低音量      |
| `←`     | 视频快进      |
| `→`     | 视频快退      |
| `space` | 切换播放/暂停 |

:::warning 提示

只在播放器获得焦点后（如点击了播放器后），这些快捷键才会生效

:::

## `pip`

-   Type: `Boolean`
-   Default: `false`

是否在底部控制栏里显示 `画中画` 的开关按钮

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    pip: true,
});
```

## `mutex`

-   Type: `Boolean`
-   Default: `true`

假如页面里同时存在多个播放器，是否只能让一个播放器播放

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    mutex: true,
});
```

## `backdrop`

-   Type: `Boolean`
-   Default: `true`

是否开启播放器 UI 的背景虚化效果。开启后，设置面板、右键菜单、音量条等浮层会应用 `backdrop-filter` 毛玻璃效果，看起来更通透，但在部分低性能设备或老旧浏览器上可能会有性能或兼容性问题。

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    backdrop: false, // 关闭毛玻璃效果
});
```

## `fullscreen`

-   Type: `Boolean`
-   Default: `false`

是否在底部控制栏里显示播放器 `窗口全屏` 按钮

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
});
```

## `fullscreenWeb`

-   Type: `Boolean`
-   Default: `false`

是否在底部控制栏里显示播放器 `网页全屏` 按钮

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
});
```

## `subtitleOffset`

-   Type: `Boolean`
-   Default: `false`

字幕时间偏移，范围在 `[-5s, 5s]`，出现在 `设置面板` 里

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitleOffset: true,
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
    setting: true,
});
```

## `miniProgressBar`

-   Type: `Boolean`
-   Default: `false`

迷你进度条，只在播放器失去焦点后且正在播放时出现

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    miniProgressBar: true,
});
```

## `useSSR`

-   Type: `Boolean`
-   Default: `false`

是否使用 `SSR` 挂载模式，假如你希望在播放器挂载前，就提前渲染好播放器所需的 `HTML` 时有用

你可以通过 `Artplayer.html` 访问到播放器所需的 `HTML`

<div className="run-code">▶ Run Code</div>

```js{7}
var $container = document.querySelector('.artplayer-app');
$container.innerHTML = Artplayer.html;

var art = new Artplayer({
    container: $container,
    url: '/assets/sample/video.mp4',
    useSSR: true,
});
```

## `playsInline`

-   Type: `Boolean`
-   Default: `true`

在移动端是否使用 `playsInline` 模式

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    playsInline: true,
});
```

## `layers`

-   Type: `Array`
-   Default: `[]`

初始化自定义的 `层`

<div className="run-code">▶ Run Code</div>

```js{5-23}
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            name: 'potser',
            html: `<img style="width: 100px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '20px',
                right: '20px',
                opacity: '.9',
            },
            click: function (...args) {
                console.info('click', args);
                art.layers.show = false;
            },
            mounted: function (...args) {
                console.info('mounted', args);
            },
        },
    ],
});
```

:::warning `组件配置` 请参考以下地址：

[/component/layers.html](/component/layers.html)

:::

## `settings`

-   Type: `Array`
-   Default: `[]`

初始化自定义的 `设置面板`

<div className="run-code">▶ Run Code</div>

```js{5-34}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'setting01',
            selector: [
                {
                    html: 'setting01-01',
                },
                {
                    html: 'setting01-02',
                },
            ],
            onSelect: function (...args) {
                console.info(args);
            },
        },
        {
            html: 'setting02',
            selector: [
                {
                    html: 'setting02-01',
                },
                {
                    html: 'setting02-02',
                },
            ],
            onSelect: function (...args) {
                console.info(args);
            },
        },
    ],
});
```

:::warning `设置面板` 请参考以下地址

[/component/setting.html](/component/setting.html)

:::

## `contextmenu`

-   Type: `Array`
-   Default: `[]`

初始化自定义的 `右键菜单`

<div className="run-code">▶ Run Code</div>

```js{4-12}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    contextmenu: [
        {
            html: 'your-menu',
            click: function (...args) {
                console.info('click', args);
                art.contextmenu.show = false;
            },
        },
    ],
});
```

:::warning `组件配置` 请参考以下地址：

[/component/contextmenu.html](/component/contextmenu.html)

:::

## `controls`

-   Type: `Array`
-   Default: `[]`

初始化自定义的底部 `控制栏`

<div className="run-code">▶ Run Code</div>

```js{4-16}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            position: 'left',
            html: 'your-control',
            tooltip: 'Your Control',
            style: {
                color: 'green',
            },
            click: function (...args) {
                console.info('click', args);
            },
        },
    ],
});
```

:::warning `组件配置` 请参考以下地址：

[/component/controls.html](/component/controls.html)

:::

## `quality`

-   Type: `Array`
-   Default: `[]`

是否在底部控制栏里显示 `画质选择` 列表

| 属性      | 类型      | 描述     |
| --------- | --------- | -------- |
| `default` | `Boolean` | 默认画质 |
| `html`    | `String`  | 画质名字 |
| `url`     | `String`  | 画质地址 |

<div className="run-code">▶ Run Code</div>

```js{4-14}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    quality: [
        {
            default: true,
            html: 'SD 480P',
            url: '/assets/sample/video.mp4',
        },
        {
            html: 'HD 720P',
            url: '/assets/sample/video.mp4',
        },
    ],
});
```

## `highlight`

-   Type: `Array`
-   Default: `[]`

在进度条上显示 `高亮信息`

| 属性   | 类型     | 描述               |
| ------ | -------- | ------------------ |
| `time` | `Number` | 高亮时间（单位秒） |
| `text` | `String` | 高亮文本           |

<div className="run-code">▶ Run Code</div>

```js{4-25}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    highlight: [
        {
            time: 60,
            text: 'One more chance',
        },
        {
            time: 120,
            text: '谁でもいいはずなのに',
        },
        {
            time: 180,
            text: '夏の想い出がまわる',
        },
        {
            time: 240,
            text: 'こんなとこにあるはずもないのに',
        },
        {
            time: 300,
            text: '－－终わり－－',
        },
    ],
});
```

## `plugins`

-   Type: `Array`
-   Default: `[]`

初始化自定义的 `插件`

<div className="run-code">▶ Run Code</div>

```js{15}
function myPlugin(art) {
    console.info(art);
    return {
        name: 'myPlugin',
        something: 'something',
        doSomething: function () {
            console.info('doSomething');
        },
    };
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [myPlugin],
});
```

## `thumbnails`

-   Type: `Object`
-   Default: `{ url: '', number: 60, column: 10, width: 0, height: 0, scale: 1 }`

在进度条上设置 `预览图`

| 属性     | 类型     | 描述       |
| -------- | -------- | ---------- |
| `url`    | `String` | 预览图地址 |
| `number` | `Number` | 预览图数量 |
| `column` | `Number` | 预览图列数 |
| `width`  | `Number` | 预览图宽度 |
| `height` | `Number` | 预览图高度 |
| `scale`  | `Number` | 预览图缩放 |

<div className="run-code">▶ Run Code</div>

```js{4-8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    thumbnails: {
        url: '/assets/sample/thumbnails.png',
        number: 60,
        column: 10,
    },
});
```

:::warning 在线生成预览图

[artplayer-tool-thumbnail](https://artplayer.org/?libs=./uncompiled/artplayer-tool-thumbnail/index.js&example=thumbnail)

:::

## `subtitle`

-   Type: `Object`
-   Default: `{ url: '', type: '', name: '', style: {}, escape: true, encoding: 'utf-8', onVttLoad: vtt => vtt }`

设置视频的字幕，支持字幕格式：`vtt`, `srt`, `ass`

| 属性        | 类型       | 描述                                |
| ----------- | ---------- | ----------------------------------- |
| `name`      | `String`   | 字幕名字                            |
| `url`       | `String`   | 字幕地址                            |
| `type`      | `String`   | 字幕类型，可选 `vtt`, `srt`, `ass`  |
| `style`     | `Object`   | 字幕样式                            |
| `encoding`  | `String`   | 字幕编码，默认 `utf-8`              |
| `escape`    | `Boolean`  | 是否转义 `html` 标签，默认为 `true` |
| `onVttLoad` | `Function` | 用于修改 `vtt` 文本的函数           |

<div className="run-code">▶ Run Code</div>

```js{4-12}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
        type: 'srt',
        encoding: 'utf-8',
        escape: true,
        style: {
            color: '#03A9F4',
            'font-size': '30px',
        },
    },
});
```

## `moreVideoAttr`

-   Type: `Object`
-   Default: `{'controls': false, 'preload': 'metadata'}`（Safari 中会自动调整为 `preload: 'auto'` 以提升加载体验）

更多视频属性，这些属性将直接写入视频元素里

<div className="run-code">▶ Run Code</div>

```js{4-7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    moreVideoAttr: {
        'webkit-playsinline': true,
        playsInline: true,
    },
});
```

## `icons`

-   Type: `Object`
-   Default: `{}`

用于替换默认图标，支持 `Html` 字符串和 `HTMLElement`

<div className="run-code">▶ Run Code</div>

```js{4-7}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    icons: {
        loading: '<img src="/assets/img/ploading.gif">',
        state: '<img src="/assets/img/state.png">',
    },
});
```

:::warning 全部图标的定义

[artplayer/types/icons.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/icons.d.ts)

:::

## `type`

-   Type: `String`
-   Default: `''`

用于指明视频的格式，需要配合 `customType` 一起使用，默认视频的格式就是视频地址的后缀（如 `.m3u8`, `.mkv`, `.ts`），但有时候视频地地址没有正确的后缀，所以需要特别指明

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.m3u8',
    type: 'm3u8',
});
```

:::warning 后缀的识别

播放器只能解析这种后缀：`/assets/sample/video.m3u8`

但无法解析这种后缀：`/assets/sample/video?type=m3u8`

所以假如你使用了 `customType`，最好同时要指明 `type`

:::

## `customType`

-   Type: `Object`
-   Default: `{}`

通过视频的 `type` 进行匹配，把视频解码权交给第三方程序进行处理，处理的函数能接收三个参数

- `video` : 视频 `DOM` 元素
- `url` : 视频地址
- `art` : 当前实例

<div className="run-code">▶ Run Code</div>

```js{4-8}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.m3u8',
    customType: {
        m3u8: function (video, url, art) {
            //
        },
    },
});
```

## `lang`

-   Type: `String`
-   Default: `navigator.language.toLowerCase()`

默认显示语言，目前支持：`en`, `zh-cn`

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'en',
});
```

:::warning 更多的语言设置

[/start/i18n.html](/start/i18n.html)

:::

## `i18n`

-   Type: `Object`
-   Default: `{}`

自定义 `i18n` 配置，该配置会和自带的 `i18n` 进行深度合并

新增你的语言:

<div className="run-code">▶ Run Code</div>

```js{4-9}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'your-lang',
    i18n: {
        'your-lang': {
            Play: 'Your Play'
        },
    },
});
```

修改现有的语言

<div className="run-code">▶ Run Code</div>

```js{4-11}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    i18n: {
        'zh-cn': {
            Play: 'Your Play'
        },
        'zh-tw': {
            Play: 'Your Play'
        },
    },
});
```

:::warning 更多的语言设置

[/start/i18n.html](/start/i18n.html)

:::

## `lock`

-   Type: `Boolean`
-   Default: `false`

是否在移动端显示一个 `锁定按钮` ，用于隐藏底部 `控制栏`

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lock: true,
});
```

## `gesture`

-   Type: `Boolean`
-   Default: `true`

是否在移动端启用视频元素上的手势事件

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    gesture: false,
});
```

## `fastForward`

-   Type: `Boolean`
-   Default: `false`

是否在移动端添加长按视频快进功能

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fastForward: true,
});
```

## `autoPlayback`

-   Type: `Boolean`
-   Default: `false`

是否使用自动 `回放功能`

<div className="run-code">▶ Run Code</div>

```js{4-5}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    id: 'your-url-id',
    autoPlayback: true,
});
```

:::warning 提示

因为播放器默认使用 `url` 作为 `key` 来缓存播放进度的

但假如你的同一个视频的 `url` 是不同的话，那么你需要使用 `id` 来标识视频的唯一 `key`

:::

## `autoOrientation`

-   Type: `Boolean`
-   Default: `false`

是否在移动端的网页全屏时，根据视频尺寸和视口尺寸，旋转播放器

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoOrientation: true,
});
```

## `airplay`

-   Type: `Boolean`
-   Default: `false`

是否显示 `airplay` 按钮，当前只有部分浏览器支持该功能

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    airplay: true,
});
```

## `cssVar`

-   Type: `Object`
-   Default: `{}`

用于改变内置的css变量

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    cssVar: {
        //
    },
});
```

:::warning cssVar 写法参考

[artplayer/types/cssVar.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/cssVar.d.ts)

:::

## `proxy`

-   Type: `function`
-   Default: `undefined`

函数可以返回一个第三方的 `HTMLCanvasElement` 或者 `HTMLVideoElement`，例如可以代理一个已经存在的 `video` dom元素

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    proxy: () => document.createElement('video')
});
```
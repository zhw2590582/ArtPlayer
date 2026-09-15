# 高级属性

这里的 `高级属性` 是指挂载在 `实例` 的 `二级属性`，比较少用

## `option`

播放器的选项

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info(art.option);
```

:::warning 提示

假如直接修改这个 `option` 对象，播放器不会马上做出响应

:::

## `template`

管理播放器所有的 `DOM` 元素

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info(art.template);
console.info(art.template.$video);
```

:::warning 提示

为了方便区别 `DOM` 元素和普通对象，播放器里的所有 `DOM` 元素都是以 `$` 开头命名的

这是所有 `DOM` 元素的定义：[artplayer/types/template.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/template.d.ts)

:::

`$container` 是调用方提供的 div；`$player` 是里面生成的播放器根节点，二者不是同一个元素。以下字段保存初始化时绑定的节点引用，不是每次读取时重新查询：

| 字段 | 默认选择器或来源 |
| --- | --- |
| `$container` | 传入的 div 容器 |
| `$player` | `.art-video-player` |
| `$video` | `.art-video` |
| `$track` | `track` |
| `$poster` | `.art-poster` |
| `$subtitle` | `.art-subtitle` |
| `$danmuku` | `.art-danmuku` |
| `$bottom` | `.art-bottom` |
| `$progress` | `.art-progress` |
| `$controls` | `.art-controls` |
| `$controlsLeft` | `.art-controls-left` |
| `$controlsCenter` | `.art-controls-center` |
| `$controlsRight` | `.art-controls-right` |
| `$layer` | `.art-layers` |
| `$loading` | `.art-loading` |
| `$notice` | `.art-notice` |
| `$noticeInner` | `.art-notice-inner` |
| `$mask` | `.art-mask` |
| `$state` | `.art-state` |
| `$setting` | `.art-settings` |
| `$info` | `.art-info` |
| `$infoPanel` | `.art-info-panel` |
| `$infoClose` | `.art-info-close` |
| `$contextmenu` | `.art-contextmenus` |

`art.query(selector)` 与 `art.template.query(selector)` 是同一个已绑定函数，可以单独取出调用。查询范围始终是原始 $container 的后代；不会包含容器本身，也不会跟随移到容器外的播放器/媒体节点。找不到时返回 null，非法选择器沿用 querySelector 的异常。`art.video` 返回当前缓存的 `template.$video`，使用代理时可能是 canvas。原 $track 可能随被替换的视频一起脱离 DOM，不应假定所有引用始终连接在容器内。

`template.art` 指回播放器；`$mini` 在创建迷你窗口后才可能存在，默认迷你节点挂在 document.body，不在原容器内。不要通过直接替换字段来重建播放器。`template.init()` 用于初始化：普通模式重写容器 HTML，再绑定节点和代理；重复调用不是受支持的重置界面流程。`template.destroy(removeHtml)` 只处理模板 DOM：true 清空容器内容，false 添加 art-destroy 类；完整资源清理请使用 `art.destroy(removeHtml?)`。

模板字符串应从静态 `Artplayer.html` 读取。旧根声明中的 `art.template.html` 并非实际实例属性，读取通常为 undefined。`useSSR: true` 会保留并查询预先提供的结构，不会补齐缺失节点；模板应与当前播放器版本一致，浏览器端仍需完成实例化。runtime 类型保留可空节点，旧根类型仍保留历史的非空类型；类型断言不能修复不完整的 SSR 模板。

## `events`

管理播放器所有的 `DOM` 事件，实质上是代理了 `addEventListener` 和 `removeEventListener`, 当使用以下方法来处理事件，播放器销毁时也会自动销毁该事件

- `proxy` 方法用于代理 `DOM` 事件
- `hover` 方法用于代理自定义的 `hover` 事件

<div className="run-code">▶ Run Code</div>

```js
var container = document.querySelector('.artplayer-app');

var art = new Artplayer({
    container: container,
    url: '/assets/sample/video.mp4',
});

art.events.proxy(container, 'click', event => {
	console.info('click', event);
});

art.events.hover(container, (event) => {
    console.info('mouseenter', event);
}, (event) => {
    console.info('mouseleave', event);
});
```

:::warning 提示

假如你需要一些 `DOM` 事件只存在于播放器的生命周期上时，强烈建议使用这些函数，以避免造成内存泄漏

:::

事件代理只管理通过它注册的 DOM 监听器，与 `art.on/off` 的播放器事件订阅不同。`art.proxy` 是同一套代理的快捷入口。`proxy(target, name, callback, options?)` 返回清理函数；name 为数组时返回对应清理函数数组。可直接调用清理函数，或传给 `art.events.remove(dispose)` 提前移除。options 沿用原生 capture/once/passive/signal 语义；普通回调的 this 是原生事件目标，不是播放器。

`hover` 分别注册 mouseenter/mouseleave，返回 undefined；它不会产生一个新的播放器 hover 事件。`destroyEvents` 是内部清理函数集合，不要直接修改。`events.destroy()` 会清理当前集合（也包含核心自己的监听器），不等于销毁整个播放器；通常应调用 `art.destroy()`。已销毁播放器上的新代理不会注册监听器。

`bindGlobalEvents({ window, document })` 用于跨文档移动后的全局事件重绑，成功后移除旧绑定，失败时保留原绑定。省略各字段会使用播放器节点所属文档/窗口；跨窗口时请成对提供它们。此方法不迁移 DOM，也不会重绑应用自己添加的监听器。

## `storage`

管理播放器的本地存储

- `name` 属性用于设置缓存的 `key`
- `set` 方法用于设置缓存
- `get` 方法用于获取缓存
- `del` 方法用于删除缓存
- `clear` 方法用于清空缓存

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.storage.set('test', { foo: 'bar' });
const test = art.storage.get('test');
console.info(test);
art.storage.del('test');
art.storage.clear();
```

:::warning 提示

默认所有播放器实例都是共享同一个 `localStorage` 的，而且默认的 `key` 是 `artplayer_settings`

如果你想不同的播放器使用不同的 `localStorage`，你可以修改 `art.storage.name` 即可

:::

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.storage.name = 'your-storage-key';
art.storage.set('test', { foo: 'bar' });
```

`name` 是 localStorage 中存放整份 JSON 数据的键；`set/get/del` 的 key 是该 JSON 对象内的字段。`get()` 返回整份数据，`get(key)` 读取字段。为保持旧行为，空字符串 key（运行时的 0 也一样）会选择整份数据；请使用非空字符串键。set/del/clear 同步返回 undefined。

`clear()` 只移除当前 name 对应的项，不会清空整个站点的 localStorage。修改 name 不会搬迁旧数据。同源实例使用相同 name 时共享持久数据；`settings` 是每个实例自己的异常回退对象，不是持久数据的实时镜像。读取或写入失败时对应操作会回退到它；恢复正常访问不会自动合并回退内容。存储采用 JSON，不能保证保留函数、循环对象等非 JSON 数据。

## `icons`

管理播放器所有的 `svg` 图标

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info(art.icons.loading);
```

:::warning 这是所有图标的定义：

[artplayer/types/icons.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/icons.d.ts)

:::

下列27个默认名称共享相同读取行为：

```text
loading, state, play, pause, check, volume, volumeClose, screenshot, setting, pip, arrowLeft, arrowRight, playbackRate, aspectRatio, config, lock, flip, unlock, fullscreenOff, fullscreenOn, fullscreenWebOff, fullscreenWebOn, switchOn, switchOff, error, close, airplay
```

每次访问都会新建 `<i class="art-icon art-icon-NAME">` 包装节点，两个 `art.icons.play` 不是同一个对象。它不是已经挂到按钮上的图标引用；修改后来读取的包装节点不会修改现有按钮。旧根声明写作 HTMLDivElement，实际包装元素是 i；runtime 使用 HTMLElement。

在构造选项 `icons` 中按名称覆盖默认内容，也可添加自定义名称。字符串作为 HTML 解析，应只使用可信内容；传入 HTMLElement 会把同一个元素移动到新包装内，不会克隆，多次读取可能将它从旧包装移走。需要多个独立副本时优先传入字符串或自行克隆后使用。

名称和内容在初始化时浅拷贝保存；以后修改 `art.option.icons` 不会更换这份映射或已经渲染的界面。属性是只读 getter，默认不参与 Object.keys 枚举。未配置的普通自定义名称返回 undefined，请先检查再挂载。

## `i18n`

管理播放器的 `i18n`

- `get` 方法用于获取 `i18n` 的值
- `update` 方法用于更新 `i18n` 对象

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info(art.i18n.get('Play'));

art.i18n.update({
    'zh-cn': {
        Play: 'Your Play'
    }
});
```

:::warning

使用 `art.i18n.update` 只能更新实例化之后的 `i18n`，假如想在实例化之前更新 `i18n`，请使用基础选项的 `i18n` 来更新

:::

`languages` 保存按语言代码组织的字典，`language` 是当前字典，`art` 指回播放器。`update({ 'zh-cn': { Play: '播放' } })` 深合并字典后调用 `init()`，两者返回 undefined。init 根据 `art.option.lang.toLowerCase()` 选字典；字典的键本身不会转成小写。默认内置简体中文，其余未载入的语言退回原键文本。

`get(key)` 返回当前字典中的非空值，否则返回 key；空字符串翻译也会回退。更新不会自动重绘已经创建的按钮、提示和菜单文字。切换 option.lang 后可调用 init 更新后续查询，但它不是整站界面语言切换 API。以下旧声明中的文本键共享上述查找语义；运行时也能查询应用自己的键：

```text
Context Menu
Lock
Video Info
Close
Video Load Failed
Volume
Progress
Back
Settings
Play
Pause
Rate
Mute
Video Flip
Horizontal
Vertical
Reconnect
Show Setting
Hide Setting
Screenshot
Play Speed
Aspect Ratio
Default
Normal
Open
Switch Video
Switch Subtitle
Fullscreen
Exit Fullscreen
Web Fullscreen
Exit Web Fullscreen
Mini Player
PIP Mode
Exit PIP Mode
PIP Not Supported
Fullscreen Not Supported
Subtitle Offset
Last Seen
Jump Play
AirPlay
AirPlay Not Available
```

## `notice`

管理播放器的提示语，通过 `show` 写入文本或读取显示状态

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.notice.show = 'Video Ready To Play';
})
```

:::warning

如果想马上隐藏 `notice` 的显示：`art.notice.show = '';`

:::

写入字符串或 Error 会显示纯文本并重新开始自动隐藏计时；Error 使用去掉两端空白的 message，普通字符串保留原文本。读取 `notice.show` 得到当前是否显示的布尔值，不是上次写入的文本。写入 false 或空字符串会立即隐藏，但不立即清空文本，也不取消原计时器。

隐藏延时来自本次显示时的 `Artplayer.NOTICE_TIME`。`timer` 是计时器句柄，不是倒计时；`destroy()` 取消计时，不负责隐藏节点或销毁播放器。播放器销毁后不会继续显示新通知。根入口保留旧 getter 类型；需要准确布尔值类型时用 `artplayer/runtime`。

## `layers`

管理播放器的层

- `add` 方法用于动态添加层
- `remove` 方法用于动态删除层
- `update` 方法用于动态更新层
- `show` 属性用于设置是否显示全部层
- `toggle` 方法用于切换是否显示全部层

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.layers.add({
        html: 'Some Text',
    });

	setTimeout(() => {
		art.layers.show = false;
	}, 1000);
});
```

:::warning `组件配置` 请参考以下地址：

[/component/layers.html](/component/layers.html)

:::

## `controls`

管理播放器的控制器

- `add` 方法用于动态添加控制器
- `remove` 方法用于动态删除控制器
- `update` 方法用于动态更新控制器
- `show` 属性用于设置是否显示全部控制器
- `toggle` 方法用于切换是否显示全部控制器

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.controls.add({
        html: 'Some Text',
        position: 'left',
    });

	setTimeout(() => {
		art.controls.show = false;
	}, 1000);
});
```

:::warning `组件配置` 请参考以下地址：

[/component/controls.html](/component/controls.html)

:::

## `contextmenu`

管理播放器的右键菜单

- `add` 方法用于动态添加菜单
- `remove` 方法用于动态删除菜单
- `update` 方法用于动态更新菜单
- `show` 属性用于设置是否显示全部菜单
- `toggle` 方法用于切换是否显示全部菜单

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.contextmenu.add({
        html: 'Some Text',
    });

    art.contextmenu.show = true;
	setTimeout(() => {
		art.contextmenu.show = false;
	}, 1000);
});
```

:::warning `组件配置` 请参考以下地址：

[/component/contextmenu.html](/component/contextmenu.html)

:::

## `subtitle`

管理播放器的字幕功能

### 加载与切换 {#subtitle-contract}

`switch(url, option?)` 将本次选项浅合并到 `art.option.subtitle` 的配置之上，再以第一个参数覆盖 URL。它不会把本次选项写回 `art.option.subtitle`，也不会继承上一次 `switch` 的选项。`subtitle.option` 则保存最近一次开始加载的完整选项，可能对应尚未完成或失败的请求。

| 配置 | 默认值 | 实际作用 |
| --- | --- | --- |
| `url` | `''` | 请求地址；空值不清除已加载的轨道 |
| `name` | `''` | `switch` 成功提交后显示切换提示；轨道 label 仍取 `art.option.subtitle.name` 或 `Artplayer` |
| `type` | `''` | 显式 `vtt`、`srt`、`ass`，否则从 URL 推断；不按响应 MIME 推断 |
| `style` | `{}` | 设置字幕容器 CSS；后续设置不会自动清除旧 CSS |
| `encoding` | `'utf-8'` | `TextDecoder` 解码方式 |
| `escape` | `true` | 渲染读取 `art.option.subtitle.escape`；仅在本次 switch 中传入不会改变这个全局配置 |
| `onVttLoad` | 原样返回文本 | 同步转换 VTT 文本；普通函数的 this 为本次完整选项 |

识别的 SRT/ASS 先转为 WebVTT，再调用 `onVttLoad`，VTT 直接传入该回调；回调必须返回字符串，不等待 Promise。ASS 转换只保留基础文本与时间，不是完整 ASS 排版。未识别的类型仍会先 fetch/解码，但跳过回调并把原地址交给原生 track。

`switch` 返回 `Promise<string | null | undefined>`：成功返回提交的地址（转换后通常为 Blob URL），没有可用原生文本轨时为 null，空地址、被下一次请求替代或销毁取消时为 undefined。Promise 完成不等于原生 cue 已加载；需要在切换前订阅 `subtitleLoad(cues, option)`。`subtitle.url` 的 getter 返回当前 track 的地址，setter 启动异步切换但不能等待结果。

新请求取消旧请求，并阻止迟到结果覆盖当前字幕；销毁也会结算等待中的请求。活动请求的 fetch、解码、转换错误会拒绝直接调用的 Promise，并更新提示；构造和 URL setter 会处理其内部拒绝。原生 track 后续加载失败只更新提示，不会追溯拒绝已经完成的 switch。失败或空 URL 不保证删除旧轨道，因此隐藏字幕请用 `subtitle.show = false`。

### 轨道、渲染和清理 {#subtitle-runtime}

`textTrack` 读取视频的第一个 TextTrack，而不是按语言或 kind 搜索；代理媒体没有该能力时可能为 undefined。`cues` 和 `activeCues` 每次返回新数组，cue 对象本身保持引用；不可用或禁用时为空数组。`SubtitleCue.text` 是字幕文本，`originalStartTime`/`originalEndTime` 是调整偏移时保存的原时间；track 上的可选 `offset` 保存当前偏移。这些元数据不会因读取数组而复制。

`update()` 同步重绘当前活动 cue，不是通用组件的更新方法，也不重新下载字幕。没有活动 cue 时只清空视图；否则先发出 `subtitleBeforeUpdate`，按非空行生成 `.art-subtitle-line[data-group]`，再发出 `subtitleAfterUpdate`。渲染时以播放器配置决定转义；关闭 escape 时，cue 内容会作为可信 HTML 插入。监听器中的切换、重绘或销毁会阻止过期的外层渲染继续提交。

`show`/`toggle()` 控制播放器的 `art-subtitle-show` 类并发出 `subtitle` 布尔事件，不暂停字幕下载或轨道。`style(object)` 和 `style(key, value)` 返回字幕容器节点。管理器的 `name` 为 `subtitle`；`destroyEvent` 是当前 cuechange 监听器的清理函数，不是销毁整个字幕管理器的方法。

底层 `init(fullOption)` 不补齐配置，通常应使用 `switch`；`createTrack(kind, url)` 直接替换原生轨道，不下载转换、不合并选项，返回 undefined。新轨道以 hidden 模式工作，其 load 事件触发 `subtitleLoad`。替换会释放旧监听器；核心创建的 Blob URL 在被替换或播放器销毁时回收，调用者传入的 URL 仍由调用者管理。不要在 switch 刚返回时回收核心返回的 Blob URL。WebKit 原生全屏切换可能重建 track 并重新触发加载，不能把字幕加载视为只发生一次。

根入口保留历史 style 的 void、switch 的 `Promise<string>` 和继承组件 update 声明。需要准确返回值与 `update()` 时使用 `artplayer/runtime`；其 `Subtitle` 是管理器类型，根入口 `Subtitle` 是配置类型。继承成员不表示字幕支持像 layers 一样添加自定义条目。

```ts
import Artplayer from 'artplayer/runtime';
import type { SubtitleCue } from 'artplayer/runtime';

const art = new Artplayer({ container: '.artplayer-app', url: '/assets/sample/video.mp4' });
art.on('subtitleLoad', (cues: SubtitleCue[]) => console.info(cues.length));
const node: HTMLDivElement = art.subtitle.style({ color: 'red' });
const loading: Promise<string | null | undefined> = art.subtitle.switch('/assets/sample/subtitle.srt');
void loading.catch(console.error);
art.subtitle.update();
void node;
```

- `url` 属性设置和返回当前字幕地址
- `style` 方法设置当前字幕的样式
- `switch` 方法设置当前字幕地址和选项
- `textTrack` 获取当前字幕轨
- `activeCues` 获取当前活跃的字幕列表
- `cues` 获取整体的字幕列表

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.subtitle.url = '/assets/sample/subtitle.srt'
    art.subtitle.style({
        color: 'red',
    });
});
```

## `info`

管理播放器的信息面板，常用于查看当前播放器和视频的运行状态，例如版本号、分辨率、时长等。

- 通过 `art.info.show` 控制面板的显示与隐藏
- 触发的事件名为 `info`（详见事件文档）

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.info.show = true;

    setTimeout(() => {
        art.info.show = false;
    }, 3000);
});
```

## `loading`

管理播放器的加载层

- `show` 属性用于设置是否显示加载层
- `toggle` 属性用于切换是否显示加载层

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.loading.show = true;
	setTimeout(() => {
		art.loading.show = false;
	}, 1000);
});
```

## `hotkey`

管理播放器的快捷键功能

- `add` 方法用于添加快捷键
- `remove` 方法用于删除快捷键

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

function hotkeyEvent(event) {
    console.info('click', event);
}

art.on('ready', () => {
    art.hotkey.add('Space', hotkeyEvent);
    setTimeout(() => {
		art.hotkey.remove('Space', hotkeyEvent);
	}, 5000);
});
```

:::warning 提示

只在播放器获得焦点后（如点击了播放器后），这些快捷键才会生效

:::

使用 `KeyboardEvent.code` 字符串，例如 `'Space'`、`'KeyK'`、`'ArrowLeft'`，不要传数字 keyCode。add/remove 都返回 hotkey 管理对象；移除时需使用原回调。同一键可注册多个不同回调，相同回调不会重复加入，回调的 this 为播放器。添加自定义 Space 回调不会替换内置播放/暂停行为。

`keys` 是按 code 保存的回调数组；`art` 指回播放器。桌面构造时自动执行 init，`hotkey: false` 只禁用内置快捷键，不禁用手动添加的回调。移动端默认不初始化键盘监听；已有 init 方法可显式开启，但这不代表已完成真机键盘验收。重复 init 不会累积同一组默认回调或文档订阅。

输入框、文本域、选择框、可编辑区域、组合输入和带修饰键的事件会被排除；按钮/链接的原生激活键和已被播放器控件处理的按键也不会重复触发快捷键。命中回调时阻止原生默认行为，执行后发出 hotkey；随后仍会发出播放器 keydown。

## `mask`

管理播放器的遮罩层

- `show` 属性用于设置是否显示遮罩层
- `toggle` 属性用于切换是否显示遮罩层

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.mask.show = false;
	setTimeout(() => {
		art.mask.show = true;
	}, 1000);
});
```

## `setting`

管理播放器的设置面板

- `add` 方法用于动态添加设置项
- `remove` 方法用于动态删除设置项
- `update` 方法用于动态更新设置项
- `show` 属性用于设置是否显示全部设置项
- `toggle` 方法用于切换是否显示全部设置项

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    subtitleOffset: true,
});

art.on('ready', () => {
    art.setting.show = true;
	setTimeout(() => {
		art.setting.show = false;
	}, 1000);
});
```

:::warning `设置面板` 请参考以下地址

[/component/setting.html](/component/setting.html)

:::

## `plugins`

管理播放器的插件功能，只有一个方法 `add` 用于动态添加插件

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

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

art.on('ready', () => {
    art.plugins.add(myPlugin);
});
```

## 服务的 TypeScript 视图

当前重构分支的 `artplayer/runtime` 为同一运行时提供精确声明，包括布尔 notice.show、EventListener 对象和服务成员；该分支尚未发布。根入口和 legacy 保留旧声明形状。runtime 导出的 `EventRegistry`、`Storage`、`I18n<Host>`、`Hotkey<Host>`、`Notice` 描述服务，`Dictionary/Languages` 描述语言数据。

```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({ container: '#player', url: '/video.mp4', hotkey: false });
const dispose = art.events.proxy(document, 'click', { handleEvent(event) { console.log(event.type); } });
art.events.remove(dispose);
const onSpace = function (this: Artplayer, event: KeyboardEvent) { console.log(this.id, event.code); };
art.hotkey.add('Space', onSpace);
art.hotkey.remove('Space', onSpace);
art.notice.show = 'Ready';
const visible: boolean = art.notice.show;
art.notice.show = false;
art.i18n.update({ en: { Play: 'Start' } });
console.log(visible, art.i18n.get('Play'));
```

## 模板与图标的 TypeScript 视图

当前未发布重构的 `artplayer/runtime` 使用 `Template<Host>`、`Icons` 和媒体能力类型描述可空查询、未知图标和代理媒体。下面与根入口运行的是同一实现：

```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({
    container: '#player', url: '/video.mp4',
    icons: { customMark: '<span aria-hidden="true">*</span>' },
});
const query = art.query;
const player: HTMLDivElement | null = query('.art-video-player');
const icon: HTMLElement | undefined = art.icons.customMark;
if (player && icon) player.append(icon);
console.log(Artplayer.html, art.video === art.template.$video);
```

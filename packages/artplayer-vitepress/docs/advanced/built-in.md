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

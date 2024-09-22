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


## `notice`

管理播放器的提示语，只有一个 `show` 属性用于显示提示语

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
    art.hotkey.add(32, hotkeyEvent);
    setTimeout(() => {
		art.hotkey.remove(32, hotkeyEvent);
	}, 5000);
});
```

:::warning 提示

只在播放器获得焦点后（如点击了播放器后），这些快捷键才会生效

:::

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
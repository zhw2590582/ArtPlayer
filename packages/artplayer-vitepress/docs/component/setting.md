# 设置面板

## 内置

须先打开设置面板，然后自带四个内置项：`flip`, `playbackRate`, `aspectRatio`, `subtitleOffset`

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
	setting: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    subtitleOffset: true,
});
```


## 创建 - 选择列表

| 属性       | 类型                | 描述         |
| ---------- | ------------------- | ------------ |
| `html`     | `String`, `Element` | 元素的 DOM   |
| `icon`     | `String`, `Element` | 元素的图标   |
| `selector` | `Array`             | 元素列表     |
| `onSelect` | `Function`          | 元素点击事件 |
| `width`    | `Number`            | 列表宽度     |
| `tooltip`  | `String`            | 提示文本     |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Subtitle',
            width: 250,
            tooltip: 'Subtitle 01',
            selector: [
                {
                    default: true,
                    html: '<span style="color:red">Subtitle 01</span>',
                    url: '/assets/sample/subtitle.srt?id=1',
                },
                {
                    html: '<span style="color:yellow">Subtitle 02</span>',
                    url: '/assets/sample/subtitle.srt?id=2',
                },
            ],
            onSelect: function (item, $dom, event) {
                console.info(item, $dom, event);
                art.subtitle.url = item.url;
                return item.html;
            },
        },
        {
            html: 'Quality',
            width: 150,
            tooltip: '1080P',
            selector: [
                {
                    default: true,
                    html: '1080P',
                    url: '/assets/sample/video.mp4?id=1080',
                },
                {
                    html: '720P',
                    url: '/assets/sample/video.mp4?id=720',
                },
                {
                    html: '360P',
                    url: '/assets/sample/video.mp4?id=360',
                },
            ],
            onSelect: function (item, $dom, event) {
                console.info(item, $dom, event);
                art.switchQuality(item.url, item.html);
                return item.html;
            },
        },
    ],
});
```

## 创建 - 列表嵌套

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Multi-level',
            selector: [
                {
                    html: 'Setting 01',
                    width: 150,
                    selector: [
                        {
                            html: 'Setting 01 - 01',
                        },
                        {
                            html: 'Setting 01 - 02',
                        },
                    ],
                    onSelect: function (item, $dom, event) {
                        console.info(item, $dom, event);
                        return item.html;
                    },
                },
                {
                    html: 'Setting 02',
                    width: 150,
                    selector: [
                        {
                            html: 'Setting 02 - 01',
                        },
                        {
                            html: 'Setting 02 - 02',
                        },
                    ],
                    onSelect: function (item, $dom, event) {
                        console.info(item, $dom, event);
                        return item.html;
                    },
                },
            ],
        },
    ],
});
```

## 创建 - 切换按钮

| 属性       | 类型                | 描述            |
| ---------- | ------------------- | --------------- |
| `html`     | `String`, `Element` | 元素的 DOM 元素 |
| `icon`     | `String`, `Element` | 元素的图标      |
| `switch`   | `Boolean`           | 按钮默认状态    |
| `onSwitch` | `Function`          | 按钮切换事件    |
| `tooltip`  | `String`            | 提示文本        |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'PIP Mode',
            tooltip: 'Close',
            icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
            switch: false,
            onSwitch: function (item, $dom, event) {
                console.info(item, $dom, event);
                const nextState = !item.switch;
                art.pip = nextState;
                item.tooltip = nextState ? 'Open' : 'Close';
                return nextState;
            },
        },
    ],
});
```

## 创建 - 范围滑块

| 属性       | 类型                | 描述             |
| ---------- | ------------------- | ---------------- |
| `html`     | `String`, `Element` | 元素的 DOM 元素  |
| `icon`     | `String`, `Element` | 元素的图标       |
| `range`    | `Array`             | 默认状态数组     |
| `onRange`  | `Function`          | 完成时触发的事件 |
| `onChange` | `Function`          | 变化时触发的事件 |
| `tooltip`  | `String`            | 提示文本         |

```js
const range = [5, 1, 10, 1];
const value = range[0];
const min = range[1];
const max = range[2];
const step = range[3];
```

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Slider',
            tooltip: '5x',
            icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
            range: [5, 1, 10, 1],
            onChange: function (item, $dom, event) {
                console.info(item, $dom, event);
                return item.range[0] + 'x';
            },
        },
    ],
});
```

## 添加

<div className="run-code">▶ Run Code</div>

```js{9-14}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});

art.setting.show = true;

art.setting.add({
    html: 'Slider',
    tooltip: '5x',
    icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
    range: [5, 1, 10, 1],
});
```

## 删除

<div className="run-code">▶ Run Code</div>

```js{22}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    flip: true,
    settings: [
        {
            name: 'slider',
            html: 'Slider',
            tooltip: '5x',
            icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
            range: [5, 1, 10, 1],
        },
    ],
});

art.setting.show = true;

art.on('ready', () => {
    setTimeout(() => {
        // Delete the setting by name
        art.setting.remove('slider');
    }, 3000);
});
```

## 更新

<div className="run-code">▶ Run Code</div>

```js{21-27}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            name: 'slider',
            html: 'Slider',
            tooltip: '5x',
            icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
            range: [5, 1, 10, 1],
        },
    ],
});

art.setting.show = true;

art.on('ready', () => {
    setTimeout(() => {
        // Update the setting by name
        art.setting.update({
            name: 'slider',
            html: 'PIP Mode',
            tooltip: 'Close',
            icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
            switch: false,
        });
    }, 3000);
});
```
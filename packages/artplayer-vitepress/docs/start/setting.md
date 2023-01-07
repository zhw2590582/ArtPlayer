# 设置面板

需先打开设置面板，播放器默认自带四个设置项：`flip`、`playbackRate`、`aspectRatio`、`subtitleOffset`

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

## 选择列表

| 属性       | 类型                | 描述            |
| ---------- | ------------------- | --------------- |
| `html`     | `String`、`Element` | 元素的 DOM 元素 |
| `icon`     | `String`、`Element` | 元素的图标      |
| `selector` | `Array`             | 元素列表        |
| `onSelect` | `Function`          | 元素点击事件    |
| `width`    | `Number`            | 列表宽度        |
| `default`  | `Boolean`           | 是否默认选中    |
| `tooltip`  | `String`            | 提示文本        |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    settings: [
        {
            html: '选择字幕',
            width: 250,
            tooltip: '字幕 01',
            selector: [
                {
                    default: true,
                    html: '<span style="color:red">字幕 01</span>',
                    url: '/assets/sample/subtitle.srt?id=1',
                },
                {
                    html: '<span style="color:yellow">字幕 02</span>',
                    url: '/assets/sample/subtitle.srt?id=2',
                },
            ],
            onSelect: function (item, $dom, event) {
                console.info(item, $dom, event);
                art.subtitle.url = item.url;

                // 改变提示文本
                return item.html;
            },
        },
        {
            html: '选择画质',
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

                // 改变提示文本
                return item.html;
            },
        },
        {
            html: '多层嵌套',
            selector: [
                {
                    html: '嵌套01',
                    selector: [
                        {
                            html: '嵌套02',
                        },
                        {
                            html: '嵌套02',
                        },
                    ],
                },
                {
                    html: '嵌套01',
                    selector: [
                        {
                            html: '嵌套02',
                        },
                        {
                            html: '嵌套02',
                        },
                    ],
                },
            ],
        },
    ],
});
```


## 切换按钮

| 属性       | 类型                | 描述            |
| ---------- | ------------------- | --------------- |
| `html`     | `String`、`Element` | 元素的 DOM 元素 |
| `icon`     | `String`、`Element` | 元素的图标      |
| `switch`   | `Boolean`           | 按钮默认状态    |
| `onSwitch` | `Function`          | 按钮切换事件    |
| `tooltip`  | `String`            | 提示文本        |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    settings: [
        {
            html: '画中画模式',
            tooltip: '关闭',
            icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
            switch: false,
            onSwitch: function (item, $dom, event) {
                console.info(item, $dom, event);
                const nextState = !item.switch;
                art.pip = nextState;

                // 改变提示文本
                item.tooltip = nextState ? '开启' : '关闭';

                // 改变按钮状态
                return nextState;
            },
        },
        {
            html: '和列表组合',
            width: 200,
            selector: [
                {
                    default: true,
                    html: '设置 01',
                },
                {
                    html: '设置 02',
                },
                {
                    html: '设置 03',
                    switch: false,
                    onSwitch: function (item, $dom, event) {
                        return !item.switch;
                    },
                },
                {
                    html: '设置 04',
                    icon: '',
                    switch: true,
                    onSwitch: function (item, $dom, event) {
                        return !item.switch;
                    },
                },
            ],
            onSelect: function (item) {
                return item.html;
            },
        },
    ],
});
```

## 范围滑块

| 属性       | 类型                | 描述             |
| ---------- | ------------------- | ---------------- |
| `html`     | `String`、`Element` | 元素的 DOM 元素  |
| `icon`     | `String`、`Element` | 元素的图标       |
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
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    settings: [
        {
            html: '滑块',
            tooltip: '5x',
            icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
            range: [5, 1, 10, 1],
            onChange: function (item) {
                // 改变提示文本
                return item.range + 'x';
            },
        },
        {
            html: '和列表组合',
            width: 200,
            selector: [
                {
                    default: true,
                    html: '设置 01',
                },
                {
                    html: '设置 02',
                },
                {
                    html: '设置 03',
                    tooltip: '5x',
                    range: [5, 1, 10, 1],
                    onRange: function (item) {
                        return item.range + 'x';
                    },
                },
                {
                    html: '设置 04',
                    icon: '',
                    tooltip: '5x',
                    range: [5, 1, 10, 1],
                    onRange: function (item) {
                        return item.range + 'x';
                    },
                },
            ],
            onSelect: function (item) {
                return item.html;
            },
        },
    ],
});
```

# 组件配置

这里所说的组件配置主要是指：`layers` , `controls` , `contextmenu` 这三个共用的配置:

| 属性      | 类型                | 描述                       |
| --------- | ------------------- | -------------------------- |
| `disable` | `Boolean`           | 是否禁用组件               |
| `name`    | `String`            | 组件唯一名称，用于标记类名 |
| `index`   | `Number`            | 组件索引，用于显示的优先级 |
| `html`    | `String`, `Element` | 组件的 DOM 元素            |
| `style`   | `Object`            | 组件样式对象               |
| `click`   | `Function`          | 组件点击事件               |
| `mounted` | `Function`          | 组件挂载后触发             |
| `tooltip` | `String`            | 组件的提示文本             |

:::warning 提示

- 当前组件只能添加，并没有销毁的功能
- 通过 `name` 选项可以快速获取组件的 `DOM` 元素
- 通过 `index` 选项可以控制组件出现的顺序

:::

## `layers`

实例化时添加一个层，例如可以添加 `logo` 或者 `广告` 等等

<div className="run-code">▶ Run Code</div>

```js{5-22}
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            name: 'potser',
            html: `<img style="width: 100px" src="${img}">`,
            tooltip: 'Potser Tip',
            style: {
                position: 'absolute',
                top: '50px',
                right: '50px',
            },
            click: function (...args) {
                console.info('click', args);
            },
            mounted: function (...args) {
                console.info('mounted', args);
            },
        },
    ],
});

console.info(art.layers.potser);
```

也可以实例化之后添加一个层

<div className="run-code">▶ Run Code</div>

```js{7-22}
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.layers.add({
    name: 'potser',
    html: `<img style="width: 100px" src="${img}">`,
    tooltip: 'Potser Tip',
    style: {
        position: 'absolute',
        top: '50px',
        right: '50px',
    },
    click: function (...args) {
        console.info('click', args);
    },
    mounted: function (...args) {
        console.info('mounted', args);
    },
});

console.info(art.layers.potser);
```

## `controls`

实例化时添加一个控制器

:::warning controls 还有三个额外的选项

- `position`: `left` 和 `right` 控制控制器出现的左右位置
- `selector`: 选择列表的对象数组
- `onSelect`: 选择列表的元素被点击时触发的函数

:::

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            name: 'your-button',
            index: 10,
            position: 'left',
            html: 'Your Button',
            tooltip: 'Your Button',
            style: {
                color: 'red',
            },
            click: function (...args) {
                console.info('click', args);
            },
            mounted: function (...args) {
                console.info('mounted', args);
            },
        },
        {
            name: 'subtitle',
            position: 'right',
            html: 'Subtitle',
            selector: [
                {
                    default: true,
                    html: '<span style="color:red">subtitle 01</span>',
                },
                {
                    html: '<span style="color:yellow">subtitle 02</span>',
                },
            ],
            onSelect: function (item, $dom) {
                console.info(item, $dom);
                return 'Your ' + item.html;
            },
        },
    ],
});

console.info(art.controls['your-button']);
console.info(art.controls.subtitle);
```

也可以实例化之后添加一个控制器

```js{6-22}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.controls.add({
    name: 'button1',
    index: 10,
    position: 'left',
    html: 'Your Button',
    tooltip: 'Your Button',
    style: {
        color: 'red',
    },
    click: function (...args) {
        console.info('click', args);
    },
    mounted: function (...args) {
        console.info('mounted', args);
    },
});

console.info(art.controls.button1);
```

## `contextmenu`

实例化时添加一个右键菜单

<div className="run-code">▶ Run Code</div>

```js{4-13}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    contextmenu: [
        {
            name: 'your-menu',
            html: 'Your Menu',
            click: function (...args) {
                console.info(args);
                art.contextmenu.show = false;
            },
        },
    ],
});

console.info(art.contextmenu['your-menu']);
```

也可以实例化之后添加一个右键菜单

<div className="run-code">▶ Run Code</div>

```js{6-13}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.contextmenu.add({
    name: 'your-menu',
    html: 'Your Menu',
    click: function (...args) {
        console.info(args);
        art.contextmenu.show = false;
    },
});

console.info(art.contextmenu['your-menu']);
```
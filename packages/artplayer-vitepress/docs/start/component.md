# 组件配置

这里所说的组件配置主要是指：`(layers)层`、`(controls)控制器` 、`(contextmenu)右键菜单`这三个共用的配置:

| 属性      | 类型                | 描述                       |
| --------- | ------------------- | -------------------------- |
| `disable` | `Boolean`           | 是否禁用组件               |
| `name`    | `String`            | 组件唯一名称，用于标记类名 |
| `index`   | `Number`            | 组件索引，用于显示的优先级 |
| `html`    | `String`、`Element` | 组件的 DOM 元素            |
| `style`   | `Object`            | 组件样式对象               |
| `click`   | `Function`          | 组件点击事件               |
| `mounted` | `Function`          | 组件挂载后触发             |
| `tooltip` | `String`            | 组件的提示文本             |

:::warning 提示

- 当前组件只能添加，并没有销毁的功能
- 通过 `name` 选项可以快速获取组件的 `DOM` 元素
- 通过 `index` 选项可以控制组件出现的顺序

:::

## layers

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
            tooltip: '组件提示',
            style: {
                position: 'absolute',
                top: '50px',
                right: '50px',
            },
            click: function (...args) {
                console.info('你点击了组件');
            },
            mounted: function (...args) {
                console.info('组件挂载完成');
            },
        },
    ],
});

console.log(art.layers.potser);
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
    tooltip: '组件提示',
    style: {
        position: 'absolute',
        top: '50px',
        right: '50px',
    },
    click: function (...args) {
        console.info('你点击了组件');
    },
    mounted: function (...args) {
        console.info('组件挂载完成');
    },
})

console.log(art.layers.potser);
```

## controls

实例化时添加一个控制器

:::warning controls 还有三个额外的选项

- `position`: `left` 和 `right` 控制控制器出现的左右位置
- `selector`: 快速创建选择列表的对象数组
- `onSelect`: 选择列表的元素被点击时触发的函数

:::

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            name: 'button1',
            index: 10,
            position: 'left',
            html: '自定义按钮1',
            tooltip: '自定义按钮的提示1',
            style: {
                color: 'red',
            },
            click: function (...args) {
                console.log('你点击了自定义按钮1');
            },
            mounted: function (...args) {
                console.log('自定义按钮挂载完成1');
            },
        },
        {
            name: 'subtitle',
            position: 'right',
            html: '字幕选项',
            selector: [
                {
                    default: true,
                    html: '<span style="color:red">字幕 01</span>',
                },
                {
                    html: '<span style="color:yellow">字幕 02</span>',
                },
            ],
            onSelect: function (item, $dom) {
                console.info(item, $dom);
                return '点击了' + item.html;
            },
        },
    ],
});

console.log(art.controls.button1);
console.log(art.controls.subtitle);
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
    html: '自定义按钮1',
    tooltip: '自定义按钮的提示1',
    style: {
        color: 'red',
    },
    click: function () {
        console.log('你点击了自定义按钮1');
    },
    mounted: function () {
        console.log('自定义按钮挂载完成1');
    },
});

console.log(art.controls.button1);
```

## contextmenu

实例化时添加一个右键菜单

<div className="run-code">▶ Run Code</div>

```js{4-13}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    contextmenu: [
        {
            name: 'menu01',
            html: '自定义菜单',
            click: function () {
                console.info('你点击了自定义菜单');
                art.contextmenu.show = false;
            },
        },
    ],
});

console.log(art.contextmenu.menu01);
```

也可以实例化之后添加一个右键菜单

<div className="run-code">▶ Run Code</div>

```js{6-13}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.contextmenu.add({
    name: 'menu01',
    html: '自定义菜单',
    click: function () {
        console.info('你点击了自定义菜单');
        art.contextmenu.show = false;
    },
});

console.log(art.contextmenu.menu01);
```
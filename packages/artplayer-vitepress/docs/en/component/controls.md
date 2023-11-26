# 控制器

## 配置

| 属性       | 类型                | 描述                                       |
| ---------- | ------------------- | ------------------------------------------ |
| `disable`  | `Boolean`           | 是否禁用组件                               |
| `name`     | `String`            | 组件唯一名称，用于标记类名                 |
| `index`    | `Number`            | 组件索引，用于显示的优先级                 |
| `html`     | `String`, `Element` | 组件的 DOM 元素                            |
| `style`    | `Object`            | 组件样式对象                               |
| `click`    | `Function`          | 组件点击事件                               |
| `mounted`  | `Function`          | 组件挂载后触发                             |
| `tooltip`  | `String`            | 组件的提示文本                             |
| `position` | `String`            | `left` 和 `right` 控制控制器出现的左右位置 |
| `selector` | `Array`             | 选择列表的对象数组                         |
| `onSelect` | `Function`          | 选择列表的元素被点击时触发的函数           |

## 创建

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

// Get the Element of control by name
console.info(art.controls['your-button']);
console.info(art.controls['subtitle']);
```

## 添加

<div className="run-code">▶ Run Code</div>

```js{6-21}
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

// Get the Element of control by name
console.info(art.controls['button1']);
```

## 删除

<div className="run-code">▶ Run Code</div>

```js{21}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            name: 'button1',
            index: 10,
            position: 'right',
            html: 'Your Button',
            tooltip: 'Your Button',
            style: {
                color: 'red',
            },
        }
    ]
});

art.on('ready', () => {
    setTimeout(() => {
        // Delete the control by name
        art.controls.remove('button1');
    }, 3000);
});
```

## 更新

<div className="run-code">▶ Run Code</div>

```js{26-40}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            name: 'button1',
            index: 10,
            position: 'right',
            html: 'Subtitle',
            selector: [
                {
                    default: true,
                    html: 'subtitle 01',
                },
                {
                    html: 'subtitle 02',
                },
            ],
        }
    ]
});

art.on('ready', () => {
    setTimeout(() => {
        // Update the control by name
        art.controls.update({
            name: 'button1',
            index: 10,
            position: 'right',
            html: 'New Subtitle',
            selector: [
                {
                    default: true,
                    html: 'new subtitle 01',
                },
                {
                    html: 'new subtitle 02',
                },
            ],
        });
    }, 3000);
});
```
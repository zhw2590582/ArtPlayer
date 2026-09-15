# 控制器

## 配置

| 属性       | 类型                | 描述                                       |
| ---------- | ------------------- | ------------------------------------------ |
| `disable`  | `Boolean`           | 是否禁用组件                               |
| `name`     | `String`            | 组件唯一名称，用于标记类名                 |
| `index`    | `Number`            | 组件索引，用于显示的优先级                 |
| `html`     | `String`, `Element`, `Number` | 组件的 DOM 元素                            |
| `style`    | `Object`            | 组件样式对象                               |
| `click`    | `Function`          | 组件点击事件                               |
| `mounted`  | `Function`          | 组件挂载后触发                             |
| `beforeUnmount` | `Function` | 显式 remove/update 移除前的回调 |
| `tooltip`  | `String`, `Number`            | 组件的提示文本                             |
| `position` | `String` | 必填：top、left 或 right |
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

## 管理器与选择器行为 {#control-contract}

通用配置、回调、浅合并更新和资源清理见[组件公共行为](./layers#component-contract)。position 必须是 top、left 或 right，分别使用 template.$progress、$controlsLeft、$controlsRight；缺失或其他值会抛错。$parent 是最近一次 add 选择的位置，不代表全部控制器的公共父节点。顶层容器名为 control，类名为 art-control/art-control-NAME；没有 center 配置值。

add/update 返回 undefined。通过 mounted、cache.get(name)?.$ref 或已知名字属性取得节点。setting、thumbnails 是内置条目的可选节点引用，并非设置面板/缩略图数据对象。init 用于安装内置和配置条目，不是可重复调用的重置入口；再次安装可能因重名而失败。isHover 记录鼠标与底部区域的关系；timer 是上次显示时的时间戳，不是定时器句柄。自动隐藏依赖播放 timeupdate、CONTROL_HIDE_TIME、设置面板/输入/鼠标/键盘焦点状态，不能把它当作精确定时器。

selector 只在 left/right 位置生成选择列表。每项的 html 是显示内容、value 是自定义字符串/数字、default 是选中标记；value 不会自动驱动媒体切换。初始按钮内容来自控件的 html，初始 default 只标记列表项，不自动替换按钮内容。列表项与后续按钮内容通过 innerHTML 写入：请用可信字符串；即使历史类型允许 HTMLElement，这里也不会像普通组件 html 那样移动该节点。

点击时先更新各项 default、按钮内容和高亮，再调用 onSelect(item, itemElement, event)，this 为播放器。返回值（含 Promise 结果）会成为按钮的新 innerHTML；undefined 也不会自动回退到原内容。应返回需要显示的文字或 HTML。异步回调只有当前选择且条目仍有效时才更新标签；移除/替换后的结果和较早选择的结果被忽略。错误会记录警告，已更新的选择不自动回退。

controls.check(item) 可使用已绑定条目更新选中状态；无参数不做任何操作，不能传入任意未绑定对象。每项会得到只读、不可枚举的 $control_option（原数组）、$control_item（列表节点）、$control_value（按钮值节点）访问器。同一个条目对象不能同时属于两个活动选择器；旧控件释放后可以复用。controls.selector 是依赖内部托管节点和清理数组的渲染方法，应用应使用 add/update 的 selector 配置。

## TypeScript 控制器示例

```ts
import Artplayer from 'artplayer/runtime';
import type { SelectorItem } from 'artplayer/runtime';

const art = new Artplayer({ container: '#player', url: '/video.mp4' });
const items: SelectorItem[] = [{ html: 'One', value: 1, default: true }, { html: 'Two', value: 2 }];
const result: undefined = art.controls.add({
    name: 'choices', position: 'right', html: 'Choose', selector: items,
    async onSelect(item) { return String(item.html); },
});
art.controls.check(items[1]);
console.log(result, art.controls.cache.get('choices')?.$ref);
art.controls.remove('choices');
```

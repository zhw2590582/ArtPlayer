# 业务层

## 配置

| 属性      | 类型                | 描述                       |
| --------- | ------------------- | -------------------------- |
| `disable` | `Boolean`           | 是否禁用组件               |
| `name`    | `String`            | 组件唯一名称，用于标记类名 |
| `index`   | `Number`            | 组件索引，用于显示的优先级 |
| `html`    | `String`, `Element`, `Number` | 组件的 DOM 元素            |
| `style`   | `Object`            | 组件样式对象               |
| `click`   | `Function`          | 组件点击事件               |
| `mounted` | `Function`          | 组件挂载后触发             |
| `beforeUnmount` | `Function` | 显式 remove/update 移除前的回调 |
| `tooltip` | `String`, `Number`            | 组件的提示文本             |

## 创建

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

// Get the Element of layer by name
console.info(art.layers['potser']);
```

## 添加

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

// Get the Element of layer by name
console.info(art.layers['potser']);
```

## 删除

<div className="run-code">▶ Run Code</div>

```js{21}
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
                top: '50px',
                right: '50px',
            },
        },
    ],
});

art.on('ready', () => {
    setTimeout(() => {
        // Delete the layer by name
        art.layers.remove('potser');
    }, 3000);
});
```

## 更新

<div className="run-code">▶ Run Code</div>

```js{21-29}
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
                top: '50px',
                right: '50px',
            },
        },
    ],
});

art.on('ready', () => {
    setTimeout(() => {
        // Update the layer by name
        art.layers.update({
            name: 'potser',
            html: `<img style="width: 200px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '50px',
                left: '50px',
            },
        });
    }, 3000);
});
```

## 组件公共行为 {#component-contract}

本节适用于 layers、controls 和 contextmenu；设置面板有自己的接口。

- add 接收配置对象或同步工厂 (art) => option。工厂参数是播放器，不能依赖工厂的 this。disable 为真时不创建节点；它不是已有节点的禁用开关。配置会被保留并可能修改，例如假值 html（包括数字 0）被归一为空字符串。
- name 在同一个组件管理器内唯一。重复 add 会抛错，remove 不存在的名字也会抛错；update 不存在的名字会转为 add。省略 name 时使用管理器名称和递增 id。显式 name 同时成为管理器上的节点属性，请避免与 add、cache、show 等已有成员重名。
- index 按升序插入同一个父容器；相同 index 的新节点插在旧节点之前。0 与省略 index 都使用递增 id，而非强制排在最前。不同 controls 位置分别排序。
- html 字符串作为 HTML 插入，请使用可信内容；HTMLElement 会移动而非克隆。非零数字可作为内容。style 是直接赋给节点的样式对象，tooltip 接受字符串或数字，假值不生成提示。
- click 的 this 是播放器，参数是组件管理器与原生事件，不是单个节点；调用前会 preventDefault，但不会自动 stopPropagation。mounted 和 beforeUnmount 的 this 也是播放器，参数是该节点。普通组件回调返回值被忽略，不等待 Promise。
- mounted 在节点插入并写入 cache/名字属性后同步调用。beforeUnmount 在显式 remove 或 update 移除旧节点前同步调用；它抛错时旧条目保留。播放器 destroy 会释放托管资源，但不会逐项调用此钩子。自行创建的订阅、定时器等应有独立、可重复调用的清理函数，同时接到组件钩子与播放器 destroy。
- update 按 name 将新配置浅合并到原配置对象，再 remove/add；会替换 DOM、重新运行 mounted，旧节点引用随之失效。style 等嵌套对象不深合并。beforeUnmount 读到的是合并后的配置；更新中替换钩子时也会使用新钩子。它不是失败时回滚旧节点的事务。

layers.add/update 和 contextmenu.add/update 返回新 HTMLDivElement，禁用或播放器关闭时可能是 undefined；controls.add/update 保留历史的 undefined 返回值。add/remove/update 已绑定，可单独保存后调用；toggle 需要保留管理器接收者。

show 控制整个管理器的 CSS 状态，toggle 取反。每次 show 赋值都会发出 layer、control 或 contextmenu 事件，即使布尔状态相同；它不删除条目。管理器的 art 指向播放器，name 分别是 layer/control/contextmenu，$parent 指向当前添加的父节点，id 是自增计数。cache 是按名字索引的 Map，每项含 $ref、events 清理函数数组及原 option；只作观察，不要直接改动这些字段来替代生命周期方法。

业务层父节点为 template.$layer，生成类名为 art-layer 和 art-layer-NAME。根类型保留 Component/ComponentOption/Selector 的历史形状，并用 ComponentInput 重载补充数字内容；未发布重构的 artplayer/runtime 导出准确的 Component、Controls、`ComponentInput<Host>` 和回调/返回值类型。cache 条目形状由实例推导；内部声明中的 ComponentEntry 并非此入口的命名导出。

## TypeScript 组件示例

```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({ container: '#player', url: '/video.mp4' });
const element: HTMLDivElement | undefined = art.layers.add({
    name: 'counter', html: 1,
    click(manager, event) { console.log(this === art, manager.name, event.type); },
});
if (element) {
    art.layers.update({ name: 'counter', html: 2 });
    art.layers.remove('counter');
}
```

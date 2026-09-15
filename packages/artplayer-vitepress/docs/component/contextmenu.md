# 右键菜单

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

art.contextmenu.show = true;

// Get the Element of contextmenu by name
console.info(art.contextmenu['your-menu']);
```

## 添加

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

art.contextmenu.show = true;

// Get the Element of contextmenu by name
console.info(art.contextmenu['your-menu']);
```

## 删除

<div className="run-code">▶ Run Code</div>

```js{21}
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

art.contextmenu.show = true;

art.on('ready', () => {
    setTimeout(() => {
        // Delete the contextmenu by name
        art.contextmenu.remove('your-menu')
    }, 3000);
});
```

## 更新

<div className="run-code">▶ Run Code</div>

```js{21-24}
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

art.contextmenu.show = true;

art.on('ready', () => {
    setTimeout(() => {
        // Update the contextmenu by name
        art.contextmenu.update({
            name: 'your-menu',
            html: 'Your New Menu',
        })
    }, 3000);
});
```

## 菜单管理与生命周期 {#contextmenu-contract}

配置、回调、返回值、名字冲突及更新/清理规则见[组件公共行为](./layers#component-contract)。父节点为 template.$contextmenu；管理器名称是 contextmenu，条目类名为 art-contextmenu 和 art-contextmenu-NAME。show/toggle 控制整个菜单，不是单项可用状态；点击自定义条目不会自动关闭菜单，可在回调中设置 art.contextmenu.show = false。

桌面初始化安装内置条目和配置条目，并处理右键、键盘、菜单外点击及播放器 blur。移动端不会自动执行这段初始化；直接 add 仍可注册条目，但这不等于已安装完整的桌面右键流程。不要通过重复初始化来刷新菜单，用 add/update/remove 管理条目。

## TypeScript 菜单示例

```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({ container: '#player', url: '/video.mp4' });
const menu: HTMLDivElement | undefined = art.contextmenu.add({
    name: 'custom-menu', html: 'Close menu',
    click() { this.contextmenu.show = false; },
});
if (menu) art.contextmenu.remove('custom-menu');
```

# 设置面板

## 内置

先配置 setting: true，再启用对应选项来安装四个内置项：`flip`, `playbackRate`, `aspectRatio`, `subtitleOffset`

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

## 创建 - 按钮

| 属性       | 类型                | 描述         |
| ---------- | ------------------- | ------------ |
| `html`     | `String`, `Element`, `Number` | 元素的 DOM   |
| `icon`     | `String`, `Element`, `Number` | 元素的图标   |
| `onClick` | `Function`          | 元素点击事件 |
| `width`    | `Number`            | 列表宽度     |
| `tooltip`  | `String`, `Element`, `Number`            | 提示文本     |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Button',
            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
            tooltip: 'tooltip',
			onClick(item, $dom, event) {
                console.info(item, $dom, event);
				return 'new tooltip'
			}
        },
    ],
});
```

## 创建 - 选择列表

| 属性       | 类型                | 描述         |
| ---------- | ------------------- | ------------ |
| `html`     | `String`, `Element`, `Number` | 元素的 DOM   |
| `icon`     | `String`, `Element`, `Number` | 元素的图标   |
| `selector` | `Array`             | 元素列表     |
| `onSelect` | `Function`          | 元素点击事件 |
| `width`    | `Number`            | 列表宽度     |
| `tooltip`  | `String`, `Element`, `Number`            | 提示文本     |

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
| `html`     | `String`, `Element`, `Number` | 元素的 DOM 元素 |
| `icon`     | `String`, `Element`, `Number` | 元素的图标      |
| `switch`   | `Boolean`           | 按钮默认状态    |
| `onSwitch` | `Function`          | 按钮切换事件    |
| `tooltip`  | `String`, `Element`, `Number`            | 提示文本        |

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
            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
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
| `html`     | `String`, `Element`, `Number` | 元素的 DOM 元素  |
| `icon`     | `String`, `Element`, `Number` | 元素的图标       |
| `range`    | `Array`             | 默认状态数组     |
| `onRange`  | `Function`          | 完成时触发的事件 |
| `onChange` | `Function`          | 变化时触发的事件 |
| `tooltip`  | `String`, `Element`, `Number`            | 提示文本         |

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
            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
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
    icon: '<img width="22" height="22" src="/assets/img/state.svg">',
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
            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
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
            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
            range: [5, 1, 10, 1],
        },
    ],
});

art.setting.show = true;

art.on('ready', () => {
    setTimeout(() => {
        // Remove the old interaction field before changing from range to switch
        delete art.setting.find('slider').range;
        // Update the setting by name
        art.setting.update({
            name: 'slider',
            html: 'PIP Mode',
            tooltip: 'Close',
            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
            switch: false,
        });
    }, 3000);
});
```

## 设置项与回调规则 {#setting-contract}

设置面板使用树形项目模型，不套用 controls/layers 的节点注册和 beforeUnmount 规则。开启 setting: true 才会在构造时格式化并渲染面板、安装常规面板事件；四个内置项还分别依赖对应选项。其实际名字为 playback-rate、aspect-ratio、flip、subtitle-offset。

| 字段 | 实际用途 |
| --- | --- |
| name | 整棵树中的唯一名字；省略时生成 setting-N，并写回原对象 |
| html / icon / tooltip | 可信 HTML 字符串、HTMLElement 或数字；渲染后变为关联节点的内容访问器 |
| width | 子菜单请求宽度；0/省略使用 SETTING_WIDTH，实际尺寸受播放器空间限制 |
| value | 自定义字符串/数字，不自动切换媒体；DOM data-value 的历史假值处理会将 0 写成空字符串 |
| default | 选择项标记；初次渲染不自动用选中项替换父项提示 |
| selector | 嵌套设置项数组；非空时点击进入子菜单 |
| switch | 开关初值；需要 onSwitch 返回下一状态，不会自行取反 |
| range | [value, min, max, step]；建议明确提供四项，缺省和钳制遵循原生 range 输入行为 |
| mounted | 延后调用的节点挂载回调，不是构造时同步回调 |
| onClick / onSwitch / onRange / onChange / onSelect | 下表所列的不同交互回调 |

html/icon/tooltip 初次渲染的假值使用空内容或默认图标。之后读取内容访问器得到 innerHTML 字符串；写入 HTMLElement 会移动该元素，字符串按 HTML 解析，写入数字会转成文字。不要把不可信输入直接作为内容。

一项只选择一种交互形态：拥有 onClick 属性优先，其次 range、switch，最后 selector；这是属性是否存在的判断，并非回调或布尔值是否为真。切换类型时不要只给新字段而保留冲突字段；用独立名字的新项目替换，或明确处理原对象的旧字段。普通组件的 disable/index/click/beforeUnmount 不是设置面板的开关、排序和生命周期接口。

| 回调 | 参数和结果 |
| --- | --- |
| mounted | (itemElement, item)，this 为播放器；节点插入后通过零延迟任务调用。移除/替换/销毁会取消尚未执行的任务；返回值不作为 UI 内容，Promise 拒绝会记录警告 |
| onClick | (item, itemElement, event)，结果写入该项 tooltip |
| onSwitch | 同上，结果写入该项 switch；无回调时点击不会自动切换 |
| onChange | 原生 input 事件；有回调时先将输入值写入 item.range[0]，结果写入 tooltip |
| onRange | 原生 change 事件；更新方式同上，适合确认后的变化 |
| onSelect | 写在父项上，接收被点击的叶子项、该叶子节点和事件；先选中并返回父层，再把结果写入父项 tooltip |

所有交互回调的 this 都是播放器，结果支持 Promise。只有该目标最新的操作且相关项目仍有效时才写回结果；删除、替换或销毁后的结果会被忽略。没有返回值也不会自动保留原提示；请明确返回内容或开关状态。错误记录警告，已执行的选中或 range[0] 更新不会自动撤销。修改 range 数组的单个元素不会同步原生输入；给 item.range 重新赋一个完整数组才会更新输入属性。没有对应 onChange/onRange 时，原生输入变化也不会通过该回调路径同步 range[0]。

## 管理方法与节点归属 {#setting-manager}

- find(name) 返回原设置项，未找到为 null。add(item, option?) 返回传入的原对象；默认追加到根列表，第二参数可传树中已有的 selector 数组。设置项对象会增加名字和访问器，不应冻结或跨两个活动播放器共享；同一对象重复出现在树中、重复名字和循环树会被拒绝。
- update(item) 按 name 浅更新原项目并返回该原项目；未找到时调用 add。已渲染条目会重建节点并释放旧监听和子面板，最后回到根列表。常规同步更新失败会尝试恢复原项目、节点、监听和导航状态，并重新抛错；不是对调用方副作用的事务保证。
- remove(name) 删除项目及后代，清理它们的监听/子面板，渲染根列表并返回 undefined。不存在的名字会抛错。删除/更新后旧 DOM 引用不再代表当前节点；应用自己创建的资源仍由应用清理。
- show/toggle 控制面板显示并发出 setting 事件。直接 show = true 不负责创建缺失的控制按钮或格式化尚未启用的面板；通常从构造配置 setting: true 开始。resize() 在面板可见、存在活动列表和设置按钮时重新计算受容器限制的尺寸。
- traverse(callback, option?) 按先父后子的顺序遍历真实对象；默认遍历根树。check(item) 对有父项的已格式化项目更新父提示、同列表及其后代的 default 标记，再回到父层列表；无参数或根项不做操作。
- render(option?) 显示并缓存指定的已格式化列表，默认根列表。format(option?, parent?, parents?, names?) 会验证和绑定树，并把传入列表设为管理器 option；它不是不改变状态的校验函数。通常让 add/update 管理此过程。
- createHeader/createItem 是依赖已格式化项目和已缓存面板的底层渲染入口；inactivate 释放项目树的资源和子面板，但不从所属数组移除该项目。应用需要完整删除时使用 remove，而不是拼接这些底层方法。

管理器 art 是播放器，name 为 setting，$parent 是 template.$setting；id 用于自动命名。option 是实际根数组（构造时由内置项和 settings 合成一个新数组，项目对象仍共享），active 是当前列表或 null，cache 按数组身份映射到面板节点。builtin 每次读取生成一组当前配置的内置项，不是已注册项目的引用；使用 find 获取活动项目，不要通过修改 cache/active 来绕过渲染流程。

| 项目元信息 | 含义 |
| --- | --- |
| $parent | 直接父项；根项为 undefined |
| $parents | 包含直接父项的列表，不是全部祖先链；根项为 undefined |
| $option | 当前项目所属的数组 |
| $events / $formatted | 托管 DOM 清理函数数组 / 已建立格式化绑定；不是“仍然挂载”的标记 |
| $item / $icon / $html / $tooltip | 渲染后的项目与内容节点；未打开的子菜单可能尚无这些节点 |
| $switch / $range | 对应形态的开关节点或原生 range 输入；更新后不要保留旧引用 |

树元信息是只读、不可枚举的访问器。DOM 访问器随渲染绑定；移除后保留对象并不证明其节点仍连接。根声明为兼容保留部分历史错误：find 的缺失返回写成 undefined，add/update/remove 被写成返回管理器，updateStyle(width?) 实际不存在。请使用 resize()，并避免依据旧声明链式调用这些方法。根 Setting 描述设置项，而未发布重构的 artplayer/runtime 导出 Setting 管理器及泛型 SettingItem；两者不是同一种类型。

## TypeScript 准确类型示例

```ts
import Artplayer from 'artplayer/runtime';
import type { SettingItem } from 'artplayer/runtime';

const art = new Artplayer({ container: '#player', url: '/video.mp4', setting: true });
const option: SettingItem<typeof art> = {
    name: 'speed-label', html: 'Label', tooltip: 'Before',
    async onClick(item) { return 'After: ' + item.html; },
};
const added: SettingItem<typeof art> = art.setting.add(option);
const found: SettingItem<typeof art> | null = art.setting.find('speed-label');
if (found) art.setting.update({ name: found.name, html: 'New label' });
console.log(added === option);
art.setting.remove('speed-label');
```

# 编写插件

了解播放器的`属性`、`方法`和`事件`后，就可以编写插件。

## 注册与生命周期 {#plugin-contract}

`plugins` 配置接收工厂函数。工厂被调用时，唯一参数和普通函数的 `this` 都是播放器；箭头函数使用自己的词法 `this`。带配置的插件通常先调用外层函数，得到真正的工厂，如 `plugins: [adsPlugin(options)]`。工厂直接返回的对象会成为注册结果，不会被复制。

同步工厂在 `add` 返回前完成注册，`art.plugins.add(factory)` 返回注册管理器本身。只有与播放器同一 JavaScript realm 的 `Promise` 才会被等待；此时返回的 Promise 最终兑现为管理器，而不是插件结果。普通 thenable 和其他窗口的 Promise 保持原样作为同步结果。需要等待异步插件时，应在构造之后 `await art.plugins.add(factory)`，然后读取对应名称。

构造配置中的工厂按数组顺序启动，但不会逐个等待异步工厂；播放器 `ready` 也不等待它们。构造时前面的工厂执行期间，`art.plugins` 尚未赋值，不应在工厂里依赖它访问前一个插件。同步工厂抛错会使构造或直接 `add` 失败；直接 `add` 的异步拒绝由调用者处理，构造配置中的异步拒绝会记录警告。

名称取第一个真值：结果的 `name`、工厂函数名、`plugin` 加当前注册计数。异步匿名工厂的回退名称使用完成时的计数，因此推荐显式返回稳定的字符串名称。`id` 在调用工厂前递增，失败也占用计数；内置插件也参与计数。`art` 指向宿主；`next(factory, result)` 是直接提交结果的底层方法，不调用工厂、不递增计数、不等待 Promise，通常无需手动调用。

结果以不可写、不可配置、不可枚举的自有属性保存，因此 `Object.keys(art.plugins)` 不会列出插件，重复名称会抛错。不要使用 `art`、`id`、`add`、`next` 等管理器成员名；名称与原型方法冲突可能遮蔽方法。管理器没有通用的移除、替换或自动调用插件 `destroy` 的机制。

插件应自行监听播放器 `destroy`，清理请求、定时器、Worker 和外部资源。异步工厂也要在首次等待之前注册清理逻辑，并在等待结束后检查是否已销毁。销毁后的迟到结果不会注册，也不会被自动清理；已经挂起的 `add` 仍返回其原 Promise，若工厂成功则兑现为管理器。销毁期间或之后的新 `add` 会在执行工厂前抛错。

## TypeScript {#plugin-types}

根入口保留历史 `Plugins.add` 的 Promise 返回声明；它不表示同步运行时变成异步。`artplayer/runtime` 的 `PluginRegistration` 按工厂返回类型区分同步管理器与 Promise；`unknown` 返回值保留二者联合。跨 realm 的 Promise 无法仅靠 TS 类型判定，仍遵守上面的运行时规则。

模块扩展只声明结果类型，不负责安装插件。准确入口的 `Plugins` 也承接根入口已有插件的命名扩展。构造选项的 `PluginFactory` 使用初始化阶段的 `PluginHost`，避免假定工厂执行时实例已完全构造；实例化之后的 `add` 可以使用完整播放器。

```ts
import Artplayer from 'artplayer/runtime';
import type { Plugins } from 'artplayer/runtime';

declare module 'artplayer/runtime' {
    interface Plugins {
        exampleCounter: { name: string; value: number };
    }
}

const art = new Artplayer({ container: '.artplayer-app', url: '/assets/sample/video.mp4' });
const registry: Plugins = art.plugins.add(function (host) {
    const samePlayer: boolean = this === host;
    return { name: 'exampleCounter', value: samePlayer ? 1 : 0 };
});
const value: number = registry.exampleCounter.value;
const pending: Promise<Plugins> = art.plugins.add(async () => ({ name: 'exampleAsync' }));
void pending.catch(console.error);
void value;
```

## 示例

可以在实例化的时候加载插件的函数

<div className="run-code">▶ Run Code</div>

```js{15}
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

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [myPlugin],
});

art.on('ready', () => {
    console.info(art.plugins.myPlugin);
});
```

可以在实例化之后再加载插件的函数

<div className="run-code">▶ Run Code</div>

```js{17}
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

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.plugins.add(myPlugin);

art.on('ready', () => {
    console.info(art.plugins.myPlugin);
});
```

例如我想写一个在视频暂停后，显示一个图片广告的插件

<div className="run-code">▶ Run Code</div>

```js
function adsPlugin(option) {
    return (art) => {
        art.layers.add({
            name: 'ads',
            html: `<img style="width: 100px" src="${option.url}">`,
            style: {
                display: 'none',
                position: 'absolute',
                top: '20px',
                right: '20px',
            },
        });

        function show() {
            art.layers.ads.style.display = 'block';
        }

        function hide() {
            art.layers.ads.style.display = 'none';
        }

        art.controls.add({
            name: 'hide-ads',
            position: 'right',
            html: 'Hide Ads',
            tooltip: 'Hide Ads',
            click: hide,
            style: {
                marginRight: '20px'
            }
        });

        art.controls.add({
            name: 'show-ads',
            position: 'right',
            html: 'Show Ads',
            tooltip: 'Show Ads',
            click: show,
        });

        art.on('play', hide);
        art.on('pause', show);

        return {
            name: 'adsPlugin',
            show,
            hide
        };
    }
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        adsPlugin({
            url: '/assets/sample/layer.png'
        })
    ],
});
```

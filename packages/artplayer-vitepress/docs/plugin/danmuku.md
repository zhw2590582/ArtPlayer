# 弹幕库

## 演示

👉 [查看完整演示](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-danmuku/index.js&example=danmuku)

## 安装

::: code-group

```bash [npm]
npm install artplayer-plugin-danmuku
```

```bash [yarn]
yarn add artplayer-plugin-danmuku
```

```bash [pnpm]
pnpm add artplayer-plugin-danmuku
```

```html [script]
<script src="path/to/artplayer-plugin-danmuku.js"></script>
```

:::

## CDN

::: code-group

```bash [jsdelivr.net]
https://cdn.jsdelivr.net/npm/artplayer-plugin-danmuku/dist/artplayer-plugin-danmuku.js
```

```bash [unpkg.com]
https://unpkg.com/artplayer-plugin-danmuku/dist/artplayer-plugin-danmuku.js
```

:::

## 弹幕结构

每一个弹幕是一个对象，多个弹幕组成的数组就是弹幕库，通常只需要`text`就可以发送一个弹幕，其余都是非必要参数

```js
{
    text: '', // 弹幕文本
    time: 10, // 弹幕时间, 默认为当前播放器时间
    mode: 0, // 弹幕模式: 0: 滚动(默认)，1: 顶部，2: 底部
    color: '#FFFFFF', // 弹幕颜色，默认为白色
    border: false, // 弹幕是否有描边, 默认为 false
    style: {}, // 弹幕自定义样式, 默认为空对象
}
```

## 全部选项

只有`danmuku`是必须的参数，其余都是非必填

```js
{
    danmuku: [], // 弹幕数据
    speed: 5, // 弹幕持续时间，范围在[1 ~ 10]
    margin: [10, '25%'], // 弹幕上下边距，支持像素数字和百分比
    opacity: 1, // 弹幕透明度，范围在[0 ~ 1]
    color: '#FFFFFF', // 默认弹幕颜色，可以被单独弹幕项覆盖
    mode: 0, // 默认弹幕模式: 0: 滚动，1: 顶部，2: 底部
    modes: [0, 1, 2], // 弹幕可见的模式
    fontSize: 25, // 弹幕字体大小，支持像素数字和百分比
    antiOverlap: true, // 弹幕是否防重叠
    synchronousPlayback: false, // 是否同步播放速度
    mount: undefined, // 弹幕发射器挂载点, 默认为播放器控制栏中部
    heatmap: false, // 是否开启热力图
    width: 512, // 当播放器宽度小于此值时，弹幕发射器置于播放器底部
    points: [], // 热力图数据
    filter: () => true, // 弹幕载入前的过滤器，只支持返回布尔值
    beforeEmit: () => true, // 弹幕发送前的过滤器，支持返回 Promise
    beforeVisible: () => true, // 弹幕显示前的过滤器，支持返回 Promise
    visible: true, // 弹幕层是否可见
    emitter: true, // 是否开启弹幕发射器
    maxLength: 200, // 弹幕输入框最大长度, 范围在[1 ~ 1000]
    lockTime: 5, // 输入框锁定时间，范围在[1 ~ 60]
    theme: 'dark', // 弹幕主题，支持 dark 和 light，只在自定义挂载时生效
    OPACITY: {}, // 不透明度配置项
    FONT_SIZE: {}, // 弹幕字号配置项
    MARGIN: {}, // 显示区域配置项
    SPEED: {}, // 弹幕速度配置项
    COLOR: [], // 颜色列表配置项
}
```

## 生命周期

来自用户输入的弹幕: 

`beforeEmit -> filter -> beforeVisible -> artplayerPluginDanmuku:visible`

来自服务器的弹幕: 

`filter -> beforeVisible -> artplayerPluginDanmuku:visible`

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
// 保存到数据库
function saveDanmu(danmu) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    })
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',

            // 这是用户在输入框输入弹幕文本，然后点击发送按钮后触发的函数
            // 你可以对弹幕做合法校验，或者做存库处理
            // 当返回true后才表示把弹幕加入到弹幕队列
            async beforeEmit(danmu) {
               const isDirty = (/fuck/i).test(danmu.text);
               if (isDirty) return false;
               const state = await saveDanmu(danmu);
               return state;
            },

            // 这里是所有弹幕的过滤器，包含来自服务端的和来自用户输入的
            // 你可以对弹幕做合法校验
            // 当返回true后才表示把弹幕加入到弹幕队列
            filter(danmu) {
                return danmu.text.length <= 200;
            },

            // 这是弹幕即将显示的时触发的函数
            // 你可以对弹幕做合法校验
            // 当返回true后才表示可以马上发送到播放器里
            async beforeVisible(danmu) {
               return true;
            },
        }),
    ],
});

// 弹幕已经出现在播放器里，你可以访问到弹幕的dom元素里
art.on('artplayerPluginDanmuku:visible', danmu => {
    danmu.$ref.innerHTML = 'ଘ(੭ˊᵕˋ)੭: ' + danmu.$ref.innerHTML;
})
```

## 使用弹幕数组

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: [
                {
                    text: '使用数组',
                    time: 1
                },
            ],
        }),
    ],
});
```

## 使用弹幕 XML

弹幕 XML 文件，和 Bilibili 网站的弹幕格式一致

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});
```

## 使用异步返回

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: function () {
                return new Promise((resovle) => {
                    return resovle([
                        {
                            text: '使用 Promise 异步返回',
                            time: 1
                        },
                    ]);
                });
            },
        }),
    ],
});
```

## `hide/show`

通过方法 `hide` 和 `show` 进行隐藏或者显示弹幕

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: '隐藏弹幕',
            click: function () {
                art.plugins.artplayerPluginDanmuku.hide();
            },
        },
        {
            position: 'right',
            html: '显示弹幕',
            click: function () {
                art.plugins.artplayerPluginDanmuku.show();
            },
        },
    ],
});
```

## `isHide`

通过属性 `isHide` 判断当前弹幕是隐藏或者显示

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: '隐藏弹幕',
            click: function (_, event) {
                if (art.plugins.artplayerPluginDanmuku.isHide) {
                    art.plugins.artplayerPluginDanmuku.show();
                    event.target.innerText = '隐藏弹幕';
                } else {
                    art.plugins.artplayerPluginDanmuku.hide();
                    event.target.innerText = '显示弹幕';
                }
            },
        },
    ],
});
```

## `emit`

通过方法 `emit` 发送一条实时弹幕

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: '发送弹幕',
            click: function () {
                var text = prompt('请输入弹幕文本', '弹幕测试文本');
                if (!text || !text.trim()) return;
                var color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
                art.plugins.artplayerPluginDanmuku.emit({
                    text: text,
                    color: color,
                    border: true,
                });
            },
        },
    ],
});
```

## `config`

通过方法 `config` 实时改变弹幕配置

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
    controls: [
        {
            position: 'right',
            html: '弹幕大小：<input type="range" min="12" max="50" step="1" value="25">',
            style: {
                display: 'flex',
                alignItems: 'center',
            },
            mounted: function ($setting) {
                const $range = $setting.querySelector('input[type=range]');
                $range.addEventListener('change', () => {
                    art.plugins.artplayerPluginDanmuku.config({
                        fontSize: Number($range.value),
                    });
                });
            },
        },
    ],
});
```

## `load`

通过 load 方法可以重载弹幕库，或者切换新弹幕库，或者追加新的弹幕库

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
            emitter: false,
        }),
    ],
    controls: [
        {
            position: 'right',
            html: '重载',
            click: function () {
                // 重新加载当前弹幕库
                art.plugins.artplayerPluginDanmuku.load();
            },
        },
        {
            position: 'right',
            html: '切换',
            click: function () {
                // 切换到新的弹幕库
                art.plugins.artplayerPluginDanmuku.config({
                    danmuku: '/assets/sample/danmuku-v2.xml',
                });
                art.plugins.artplayerPluginDanmuku.load();
            },
        },
        {
            position: 'right',
            html: '追加',
            click: function () {
                // 追加新的弹幕库，参数类型和option.danmuku相同
                const target = '/assets/sample/danmuku.xml'
                art.plugins.artplayerPluginDanmuku.load(target);
            },
        },
    ],
});
```

## `reset`

用于清空当前显示的弹幕

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});

art.on('resize', () => {
    art.plugins.artplayerPluginDanmuku.reset();
});
```

## `mount`

在初始化弹幕插件的时候，是可以指定弹幕发射器的挂载位置的，默认是挂载在控制栏的中部，你也可以把它挂载在播放器以外的地方。
当播放器全屏的时候，发射器会自动回到控制栏的中部。假如你挂载的地方是亮色的话，建议把 `theme` 设置成 `light`，否则会看不清。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var $danmu = document.querySelector('.artplayer-app');

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreenWeb: true,
    plugins: [
        artplayerPluginDanmuku({
			mount: $danmu,
            theme: 'dark',
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});

// 也可以手动挂载
// art.plugins.artplayerPluginDanmuku.mount($danmu);
```

## `option`

用于获取当前弹幕配置

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});

art.on('ready', () => {
    console.info(art.plugins.artplayerPluginDanmuku.option);
});
```

## 事件

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-danmuku/index.js">
    ▶ Run Code
</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginDanmuku({
            danmuku: '/assets/sample/danmuku.xml',
        }),
    ],
});

art.on('artplayerPluginDanmuku:visible', (danmu) => {
    console.info('显示弹幕', danmu);
});

art.on('artplayerPluginDanmuku:loaded', (danmus) => {
    console.info('加载弹幕', danmus.length);
});

art.on('artplayerPluginDanmuku:error', (error) => {
    console.info('加载错误', error);
});

art.on('artplayerPluginDanmuku:config', (option) => {
    console.info('配置变化', option);
});

art.on('artplayerPluginDanmuku:stop', () => {
    console.info('弹幕停止');
});

art.on('artplayerPluginDanmuku:start', () => {
    console.info('弹幕开始');
});

art.on('artplayerPluginDanmuku:hide', () => {
    console.info('弹幕隐藏');
});

art.on('artplayerPluginDanmuku:show', () => {
    console.info('弹幕显示');
});

art.on('artplayerPluginDanmuku:reset', () => {
    console.info('弹幕重置');
});

art.on('artplayerPluginDanmuku:destroy', () => {
    console.info('弹幕销毁');
});
```

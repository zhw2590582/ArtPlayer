---
title: 高级属性
sidebar_position: 4
slug: /zh-cn/advance
---

:::tip 提示

这页面是对常用属性的一些额外补充，需要深入开发自定义功能时才需要阅读

:::

## id

-   类型: `Number`

播放器实例的一个自增编号

## option

-   类型: `Object`

播放器实例经合并后的参数对象

## isFocus

-   类型: `Boolean`

播放器实例是否获得了焦点，如最后被用户点击过

## isDestroy

-   类型: `Boolean`

播放器实例是否被销毁

## userAgent

-   类型: `Boolean`

等于 `window.navigator.userAgent`

## isMobile

-   类型: `Boolean`

当前环境是否移动设备

## isWechat

-   类型: `Boolean`

当前环境是否微信设备

## whitelist

-   类型: `Object`

管理白名单的对象

## template

-   类型: `Object`

管理播放器 `Html` 的对象

方法 `query` 可以查找当前播放器实例内的dom元素，等同于 `document.querySelector('.artplayer-app').querySelector`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    var $video = art.template.query('.art-video');
    console.info($video);
})
```

## storage

-   类型: `Object`

管理持久化存储的对象

播放器会自动添加一个名为 `artplayer_settings` 的JSON对象到的 `localStorage` 里

| 属性    | 类型       | 描述     |
| ------- | ---------- | -------- |
| `get`   | `Function` | 获取值   |
| `set`   | `Function` | 设置值   |
| `del`   | `Function` | 删除值   |
| `clean` | `Function` | 清空对象 |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.storage.set('your-key', 'your-value');
art.storage.get('your-key');
art.storage.del('your-key');
art.storage.clean();
```

## icons

-   类型: `Object`

管理图标的对象

## i18n

-   类型: `Object`

管理多语言的对象

方法 `get` 可以获取到对应的语言的值

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.i18n.get('Play'))
})
```

方法 `update` 可以动态添加更多语言

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'jp',
});

art.i18n.update({
    'zh-cn': {
        Language: '简体',
    },
    'zh-tw': {
        Language: '繁體',
    },
    en: {
        Language: 'English',
    },
    jp: {
        Language: '日文',
    },
    fr: {
        Language: 'Français',
    },
    ru: {
        Language: 'Russe',
    },
})
```

## player

-   类型: `Object`

管理核心功能的对象，所以属性和方法都代理到播放器实例上了

## subtitle

-   类型: `Object`

管理字幕的对象

方法 `style` 可以动态修改字幕样式

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
        encoding: 'utf-8',
        bilingual: true,
        style: {
            color: '#03A9F4',
            'font-size': '30px',
        },
    },
});

art.on('ready', () => {
    art.seek = 20;
    setTimeout(() => {
        art.subtitle.style({
            color: 'red',
            'font-size': '40px',
        });
    }, 3000);
})
```

方法 `switch` 可以动态修改字幕地址

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
        encoding: 'utf-8',
        bilingual: true,
        style: {
            color: '#03A9F4',
            'font-size': '30px',
        },
    },
});

art.on('ready', () => {
    art.seek = 20;
    setTimeout(() => {
        art.subtitle.switch('/assets/sample/subtitle.srt');
    }, 3000);
})
```

## info

-   类型: `Object`

管理统计信息的对象

## layers

-   类型: `Object`

管理业务层的对象

属性 `show` 可以控制全部图层是否显示

<div className="run-code">▶ Run Code</div>

```js
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            html: `<img style="width: 100px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '20px',
                right: '20px',
                opacity: '.9',
            },
        },
    ],
});

art.on('ready', () => {
    setTimeout(() => {
        art.layers.show = false;
    }, 3000);
})
```

方法 `add` 可以动态添加业务层，更多信息请访问 [自定义组件的使用](/document/zh-cn/Questions/component)

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

var img = '/assets/sample/layer.png';
art.on('ready', () => {
    setTimeout(() => {
        art.layers.add({
            html: `<img style="width: 100px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '20px',
                right: '20px',
                opacity: '.9',
            },
        });
    }, 3000);
})
```

## notice

-   类型: `Object`

管理提示信息的对象

属性 `show` 输出自定义提示信息，默认停留时间为两秒，且新的信息会马上覆盖旧的信息

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.notice.show = '自定义提示信息1';
    art.notice.show = '自定义提示信息2';
})
```

## controls

-   类型: `Object`

管理业务层的对象

属性 `show` 可以控制控制栏是否显示

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    setTimeout(() => {
        art.controls.show = false;
    }, 3000);
})
```

方法 `add` 可以动态添加控制器，更多信息请访问 [自定义组件的使用](/document/zh-cn/Questions/component)

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    setTimeout(() => {
        art.controls.add({
            position: 'right',
            index: 10,
            html: '自定义按钮',
            tooltip: '自定义按钮的提示',
            click: function () {
                console.log('你点击了自定义按钮');
            },
        });
    }, 3000);
})
```

## contextmenu

-   类型: `Object`

管理右键菜单的对象

属性 `show` 可以控制菜单是否显示

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.contextmenu.show = true;
    setTimeout(() => {
        art.contextmenu.show = false;
    }, 3000);
})
```

方法 `add` 可以动态添加菜单项，更多信息请访问 [自定义组件的使用](/document/zh-cn/Questions/component)

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.contextmenu.show = true;
    setTimeout(() => {
        art.contextmenu.add({
            html: '自定义菜单',
            click: function () {
                console.info('你点击了自定义菜单');
                art.contextmenu.show = false;
            },
        });
    }, 3000);
})
```

## loading

-   类型: `Object`

管理提示信息的对象

属性 `show` 可以控制菜单是否加载层

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.loading.show = true;
    setTimeout(() => {
        art.loading.show = false;
    }, 3000);
})
```

## mask

-   类型: `Object`

管理遮罩层的对象

属性 `show` 可以控制遮罩层是否加载层

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.mask.show = true;
    setTimeout(() => {
        art.mask.show = false;
    }, 3000);
})
```

## hotkey

-   类型: `Object`

管理快捷键的对象

方法 `add` 可以动态添加快捷键，第一个参数是 `key code` 数字，第二个参数是回调函数

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.hotkey.add(65, () => {
        console.info('你点击了 A 键')
    })

    art.hotkey.add(66, () => {
        console.info('你点击了 B 键')
    })
})
```

:::tip 提示

只在播放器获得焦点后（如点击了播放器后），该快捷键才会生效

:::

## setting

-   类型: `Object`

管理设置面板的对象

属性 `show` 可以控制设置面板是否显示

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    autoSize: true,
});

art.on('ready', () => {
    art.seek = 20;
    art.setting.show = true;
    setTimeout(() => {
        art.setting.show = false;
    }, 3000);
})
```

方法 `add` 可以动态添加设置项，更多信息请访问 [自定义组件的使用](/document/zh-cn/Questions/component)

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    autoSize: true,
});

art.on('ready', () => {
    art.seek = 20;
    art.setting.show = true;
    art.setting.add({
        html: '自定义设置',
        click: function () {
            console.info('你点击了自定义设置');
            art.setting.show = false;
        },
    });
})
```

## plugins

-   类型: `Object`

管理插件的对象

方法 `add` 可以动态添加插件，更多信息请访问 [自定义插件的使用](/document/zh-cn/Questions/plugin)

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.plugins.add(function myPlugin(art) {
        console.info('myPlugin running...');
        return {
            something: 'something',
            doSomething: function () {
                console.info('Do something here...');
            },
        };
    });
})
```
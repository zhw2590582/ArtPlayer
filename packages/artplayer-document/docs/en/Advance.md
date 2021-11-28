---
title: Advanced property
sidebar_position: 4
slug: /advance
---

:::tip Tip

This page is some additional supplements to the commonly used properties, you need to read in depth to develop custom functions.

:::

## id

-   Type: `Number`

A self-inclusive number of the player instance

## option

-   Type: `Object`

After merged options

## isFocus

-   Type: `Boolean`

Whether the player instance has been focused

## isDestroy

-   Type: `Boolean`

Whether the player instance is destroyed

## userAgent

-   Type: `Boolean`

Equal to `window.navigator.userAgent`

## isMobile

-   Type: `Boolean`

Current environment mobile device

## isWechat

-   Type: `Boolean`

Whether the current environment is WeChat equipment

## whitelist

-   Type: `Object`

Manage the whitelist

## template

-   Type: `Object`

Manage player `HTML`

Method `query` You can find DOM elements in the current player instance, equivalent to `document.querySelector('.artplayer-app').querySelector`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    var $video = art.template.query('.art-video');
    console.info($video);
});
```

## query

-   Type: `Function`

Equal to `art.template.query`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    var $video = art.query('.art-video');
    console.info($video);
});
```

## storage

-   Type: `Object`

Manage persistent storage objects

The player will automatically add a json object called `artplayer_settings` to the `localstorage`

| Property | Type       | Description  |
| -------- | ---------- | ------------ |
| `get`    | `Function` | Get value    |
| `set`    | `Function` | Set value    |
| `del`    | `Function` | Delete value |
| `clean`  | `Function` | Clean value  |

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

-   Type: `Object`

Manage player `icons`

## i18n

-   Type: `Object`

Manage player `i18n`

Method `get` can get the value of the language value

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    console.info(art.i18n.get('Play'));
});
```

Method `update` can add more languages

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
});
```

## player

-   Type: `Object`

Manage the object of the core function

## subtitle

-   Type: `Object`

Management subtitle object

Method `style` can dynamically modify the subtitle style

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
});
```

Methods `switch` can dynamically modify the subtitle url

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
});
```

## info

-   Type: `Object`

Manage video info

## layers

-   Type: `Object`

Manage the object of the layers

Property show can control all layers to display

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
        {
            html: `<img style="width: 100px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '20px',
                left: '20px',
                opacity: '.9',
            },
        },
    ],
});

art.on('ready', () => {
    setTimeout(() => {
        art.layers.show = false;
    }, 3000);
});
```

Method `add` can dynamically add a layer

| Property  | Type                | Description                                                   |
| --------- | ------------------- | ------------------------------------------------------------- |
| `disable` | `Boolean`           | Whether to disable the component                              |
| `name`    | `String`            | The unique name of the component, used to mark the class name |
| `index`   | `Number`            | Component index, priority for display                         |
| `html`    | `String`、`Element` | DOM element of the component                                  |
| `style`   | `Object`            | Component style object                                        |
| `click`   | `Function`          | Component click event                                         |
| `mounted` | `Function`          | Triggered after the component is mounted                      |
| `tooltip` | `String`            | Prompt text of the component                                  |

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
});
```

## notice

-   Type: `Object`

Manage the object of prompt information

Attribute `show` output custom prompt information, the default residence time is two seconds, and the new information will immediately cover the old information

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.notice.show = '自定义提示信息1';
    art.notice.show = '自定义提示信息2';
});
```

## controls

-   Type: `Object`

Manage the object of the control bar

Attribute show can control if the control bar is displayed

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
});
```

Method `add` can dynamically add a control

| Property   | Type                | Description                                                   |
| ---------- | ------------------- | ------------------------------------------------------------- |
| `disable`  | `Boolean`           | Whether to disable the component                              |
| `name`     | `String`            | The unique name of the component, used to mark the class name |
| `index`    | `Number`            | Component index, priority for display                         |
| `html`     | `String`、`Element` | DOM element of the component                                  |
| `style`    | `Object`            | Component style object                                        |
| `click`    | `Function`          | Component click event                                         |
| `mounted`  | `Function`          | Triggered after the component is mounted                      |
| `tooltip`  | `String`            | Prompt text of the component                                  |
| `position` | `String`            | Location at `left` or `right`                                 |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    setTimeout(() => {
        art.controls.add({
            disable: false,
            name: 'button',
            index: 10,
            position: 'right',
            html: 'Custom button1',
            tooltip: 'Custom button1',
            style: {
                color: 'red',
            },
            click: function () {
                console.log('You clicked custom button 1');
            },
            mounted: function () {
                console.log('Custom button mounting is complete 1');
            },
        });
    }, 3000);
});
```

## contextmenu

-   Type: `Object`

Manage the contextmenu

Attribute show can control if the menu is displayed

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
});
```

Method `add` can dynamically add a menu items

| Property  | Type                | Description                                                   |
| --------- | ------------------- | ------------------------------------------------------------- |
| `disable` | `Boolean`           | Whether to disable the component                              |
| `name`    | `String`            | The unique name of the component, used to mark the class name |
| `index`   | `Number`            | Component index, priority for display                         |
| `html`    | `String`、`Element` | DOM element of the component                                  |
| `style`   | `Object`            | Component style object                                        |
| `click`   | `Function`          | Component click event                                         |
| `mounted` | `Function`          | Triggered after the component is mounted                      |
| `tooltip` | `String`            | Prompt text of the component                                  |

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
            html: 'Custom menu',
            click: function () {
                console.info('You clicked the custom menu');
                art.contextmenu.show = false;
            },
        });
    }, 3000);
});
```

## loading

-   Type: `Object`

Manage `loading` icon

Property `show` can control whether the icon in the load is displayed

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
});
```

## mask

-   Type: `Object`

Manage the object of the mask layer

Attributes `show` can control whether the mask layer is display

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
});
```

## hotkey

-   Type: `Object`

Manage hotkey

Methods `add` can dynamically add a hotkey, the first parameter is `key code` number, the second parameter is a callback function

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.hotkey.add(65, () => {
        console.info('You click A');
    });

    art.hotkey.add(66, () => {
        console.info('You click B');
    });
});
```

:::tip Tip

This hotkey will take effect only after the player gets the focus (if you click on the player).

:::

## setting

-   Type: `Object`

Manage the object of the setting panel

Property `show` can control the setting panel to display

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
});
```

Method `add` can dynamically add a setting items

| Property  | Type                | Description                                                   |
| --------- | ------------------- | ------------------------------------------------------------- |
| `disable` | `Boolean`           | Whether to disable the component                              |
| `name`    | `String`            | The unique name of the component, used to mark the class name |
| `index`   | `Number`            | Component index, priority for display                         |
| `html`    | `String`、`Element` | DOM element of the component                                  |
| `style`   | `Object`            | Component style object                                        |
| `click`   | `Function`          | Component click event                                         |
| `mounted` | `Function`          | Triggered after the component is mounted                      |
| `tooltip` | `String`            | Prompt text of the component                                  |

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
        html: 'Custom setting',
        click: function () {
            console.info('You click on custom settings');
            art.setting.show = false;
        },
    });
});
```

## plugins

-   Type: `Object`

Manage plugin

Method `add` can be dynamically add a plugin

<div className="run-code">▶ Run Code</div>

```js
function myPlugin(art) {
    console.info('You can access an instance of a player in the plugin');
    return {
        name: 'myPlugin',
        something: 'Custom export properties',
        doSomething: function () {
            console.info('Custom export method');
        },
    };
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.plugins.add(myPlugin);
    console.info(art.plugins.myPlugin.something);
    console.info(art.plugins.myPlugin.doSomething());
});
```

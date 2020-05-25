## Instance

| propertie   | type       | Description                                      |
| ----------- | ---------- | ------------------------------------------------ |
| `isFocus`   | `Boolean`  | Return the focus state                           |
| `userAgent` | `String`   | The user agent                                   |
| `isMobile`  | `boolean`  | Whether mobile access                            |
| `isDestroy` | `Boolean`  | Return the destroy state                         |
| `option`    | `Object`   | Return the merge option                          |
| `destroy`   | `Function` | Destroy instance, will not remove dom by default |

[Run Code](/Properties.instance)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.log('isFocus', art.isFocus);
console.log('isDestroy', art.isDestroy);
console.log('option', art.option);

setTimeout(function () {
    // remove dom
    art.destroy();

    // keep dom
    // art.destroy(false);
}, 1000);
```

## player

Player core function.

All player properties and methods can be accessed directly through the instance. For example, the following properties are all equal:

```js
art.currentTime === art.player.currentTime;
art.volume === art.player.volume;
art.seek === art.player.seek;
```

| propertie                | type       | Description                                                                                       |
| ------------------------ | ---------- | ------------------------------------------------------------------------------------------------- |
| `aspectRatio`            | `String`   | Set aspect ratio, Currently only accepts three values：`default`, `4:3`, `16:9` and `false`       |
| `aspectRatioReset`       | `Boolean`  | Recalculate the aspect ratio                                                                      |
| `url`                    | `String`   | `Getter` and `Setter` of the video url                                                            |
| `autoSize`               | `Boolean`  | Set auto size                                                                                     |
| `currentTime`            | `Number`   | `Getter` and `Setter` of the current time                                                         |
| `duration`               | `Number`   | `Getter` of the duration                                                                          |
| `flip`                   | `String`   | Set flip, Currently only accepts three values：`normal`, `horizontal`, `vertical` and `false`     |
| `fullscreen`             | `Boolean`  | Enable or disable fullscreen                                                                      |
| `fullscreenToggle`       | `Boolean`  | Toggle fullscreen                                                                                 |
| `fullscreenWeb`          | `Boolean`  | Enable or disable web fullscreen                                                                  |
| `fullscreenWebToggle`    | `Boolean`  | Toggle web fullscreen                                                                             |
| `fullscreenRotate`       | `Boolean`  | Enable or disable web fullscreen on the mobile                                                    |
| `fullscreenRotateToggle` | `Boolean`  | Toggle web fullscreen on the mobile                                                               |
| `loaded`                 | `Number`   | Return the proportion of the load                                                                 |
| `pause`                  | `Boolean`  | Pause playback                                                                                    |
| `pip`                    | `Boolean`  | Enable or disable pip                                                                             |
| `pipToggle`              | `Boolean`  | Toggle pip                                                                                        |
| `mini`                   | `Boolean`  | Enable or disable mini player                                                                     |
| `minToggle`              | `Boolean`  | Toggle mini player                                                                                |
| `playbackRate`           | `String`   | Set playbackRate, Currently only accepts three values：`0.5`, `0.75`, `1.0`, `1.25`, `1.5`, `2.0` |
| `playbackRateReset`      | `Boolean`  | Recalculate the playback rate                                                                     |
| `played`                 | `Number`   | Return the proportion of the played                                                               |
| `playing`                | `Boolean`  | Return to playing state                                                                           |
| `play`                   | `Boolean`  | Start playback                                                                                    |
| `screenshot`             | `Function` | Download a screenshot of current time                                                             |
| `seek`                   | `Number`   | Set the current time                                                                              |
| `forward`                | `Number`   | Video fast forward                                                                                |
| `backward`               | `Number`   | Video fast backward                                                                               |
| `switchQuality`          | `Function` | Switch video quality                                                                              |
| `switchUrl`              | `Function` | Switch video url                                                                                  |
| `toggle`                 | `Boolean`  | Toggle play and pause                                                                             |
| `volume`                 | `Number`   | `Getter` and `Setter` of the current volume                                                       |
| `muted`                  | `Boolean`  | `Getter` and `Setter` of the muted                                                                |
| `light`                  | `Boolean`  | `Getter` and `Setter` of the light mode                                                           |
| `url`                    | `String`   | `Getter` and `Setter` of the video url                                                            |
| `loop`                   | `Arrary`   | `Getter` and `Setter` of the interval loop                                                        |

[Run Code](/Properties.player)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.player.seek = 5;
    art.player.screenshot();
});
```

## storage

The player will automatically add a `localStorage` object named `artplayer_settings`, Now the player will only set and read the `volume` value.

| propertie | type       | Description       |
| --------- | ---------- | ----------------- |
| `get`     | `Function` | Get a storage     |
| `set`     | `Function` | Set a storage     |
| `del`     | `Function` | Delete a storage  |
| `clean`   | `Function` | Clean all storage |

[Run Code](/Properties.storage)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.storage.set('your-key', 'your-value');
console.log(art.storage.get('your-key'));
```

## i18n

The current support i18n has: `en`, `zh-cn`, `zh-tw`

| propertie | type       | Description                     |
| --------- | ---------- | ------------------------------- |
| `get`     | `Function` | Get the a i18n value            |
| `update`  | `Function` | Pass in a parameter for merging |

[Run Code](/Properties.i18n)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    lang: 'jp',
});

console.log(art.i18n.get('Play'));
art.i18n.update({
    'zh-cn': {
        Language: '简体',
    },
    'zh-tw': {
        Language: '繁體',
    },
    jp: {
        Language: '日文',
    },
});
console.log(art.i18n.get('Language'));
```

## hotkey

| propertie | type       | Description  |
| --------- | ---------- | ------------ |
| `add`     | `function` | Add a hotkey |

[Run Code](/Properties.hotkey)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

// Add a hotkey
art.hotkey.add(27, function (event) {
    console.log('You pressed esc button');
});
```

## whitelist

| propertie | type      | Description                           |
| --------- | --------- | ------------------------------------- |
| `state`   | `Boolean` | Whether to enable the UI on the phone |

## notice

-   Type: `Object`

| propertie | type     | Description    |
| --------- | -------- | -------------- |
| `show`    | `setter` | Show a message |

[Run Code](/Properties.notice)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

// auto hide
art.notice.show = 'some message';
```

## events

Agent for managing native events

-   Type: `Object`

| propertie | type       | Description                                                                          |
| --------- | ---------- | ------------------------------------------------------------------------------------ |
| `proxy`   | `Function` | A proxy for `addEventListener` and `removeEventListener` to manage event destruction |
| `hover`   | `Function` | Hover simplified proxy                                                               |
| `loadImg` | `Function` | Determine whether to finish the picture                                              |
| `destroy` | `Function` | Destroy all events                                                                   |

[Run Code](/Properties.events)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

var target = document.querySelector('body');
art.events.proxy(target, 'click', function (e) {
    console.log('body click');
});
```

## layers

Layer manager, and every layer has `show` and `hide` funciton

-   Type: `Object`

| propertie | type       | Description             |
| --------- | ---------- | ----------------------- |
| `add`     | `Function` | Dynamically add a layer |
| `show`    | `setter`   | Show or hide            |

[Run Code](/Properties.layers)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

var layer = '/assets/sample/layer.png';
art.layers.add({
    html: `<img style="width: 100px" src="${layer}">`,
    style: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        opacity: '.9',
    },
});
```

## controls

Controls manager, and every control has `show` setter

-   Type: `Object`

| propertie | type       | Description               |
| --------- | ---------- | ------------------------- |
| `add`     | `Function` | Dynamically add a control |
| `show`    | `setter`   | Show or hide              |

[Run Code](/Properties.controls)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.controls.add({
    name: 'myController',
    position: 'right',
    index: 10,
    html: 'myController',
    tooltip: 'This is my controller',
    click: function () {
        console.log('myController');
    },
});
```

## contextmenu

Contextmenu manager, and every contextmenu has `show` setter

-   Type: `Object`

| propertie | type       | Description                   |
| --------- | ---------- | ----------------------------- |
| `add`     | `Function` | Dynamically add a contextmenu |
| `show`    | `setter`   | Show or hide                  |

[Run Code](/Properties.contextmenu)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.contextmenu.add({
    html: 'Custom menu',
    click: function (contextmenu) {
        console.info('You clicked on the custom menu');
        contextmenu.show = false;
    },
});
```

## subtitle

-   Type: `Object`

| propertie | type       | Description      |
| --------- | ---------- | ---------------- |
| `init`    | `Function` | Init subtitle    |
| `show`    | `setter`   | Show or hide     |
| `switch`  | `Function` | Switch subtitle  |
| `url`     | `getter`   | get subtitle url |

[Run Code](/Properties.subtitle)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    subtitle: {
        url: '/assets/sample/subtitle.srt',
    },
    controls: [
        {
            position: 'right',
            index: 10,
            html: 'subtitle 01',
            click: function () {
                art.subtitle.switch('/assets/sample/subtitle.srt', 'srt subtitle name');
            },
        },
        {
            position: 'right',
            index: 20,
            html: 'subtitle 02',
            click: function () {
                art.subtitle.switch('/assets/sample/subtitle.vtt', 'vtt subtitle name');
            },
        },
    ],
});
```

## loading

-   Type: `Object`

| propertie | type     | Description  |
| --------- | -------- | ------------ |
| `show`    | `setter` | Show or hide |

[Run Code](/Properties.loading)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', function () {
    // Show the loading
    art.loading.show = true;
    setTimeout(function () {
        // Hide the loading
        art.loading.show = false;
    }, 5000);
});
```

## mask

-   Type: `Object`

| propertie | type     | Description  |
| --------- | -------- | ------------ |
| `show`    | `setter` | Show or hide |

[Run Code](/Properties.mask)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', function () {
    // Show the mask
    art.mask.show = true;
    setTimeout(function () {
        // Hide the mask
        art.mask.show = false;
    }, 5000);
});
```

## setting

Setting manager, and every setting has `show` and `hide` funciton

-   Type: `Object`

| propertie | type       | Description               |
| --------- | ---------- | ------------------------- |
| `add`     | `Function` | Dynamically add a setting |
| `show`    | `setter`   | Show or hide              |

[Run Code](/Properties.setting)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});

art.on('ready', function () {
    // Add a setting
    art.setting.add({
        html: 'Your Setting',
        name: 'yourSetting',
    });

    // Show the setting
    art.setting.show = true;
    setTimeout(function () {
        // Hide the setting
        art.setting.show = false;
    }, 5000);
});
```

## plugins

Plugins manager

-   Type: `Object`

| propertie | type       | Description              |
| --------- | ---------- | ------------------------ |
| `add`     | `Function` | Dynamically add a plugin |

[Run Code](/Properties.plugins)

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.plugins.add(function myPlugin(art) {
    // Do something you like here.
    // You can also return an object for external calls.
    console.info('myPlugin running...');
    return {
        // This exposes plugin properties or methods for others to use. Like:
        something: 'something',
        doSomething: function () {
            console.info('Do something here...');
        },
    };
});

// Call plugin from the outside
art.plugins.myPlugin.something === 'something';
art.plugins.myPlugin.doSomething();
```

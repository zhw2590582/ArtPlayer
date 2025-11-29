# Advanced Properties

The `Advanced Properties` here refer to the `secondary properties` attached to the `instance`, which are less commonly used.

## `option`

The player's options.

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info(art.option);
```

:::warning Note

If you directly modify this `option` object, the player will not respond immediately.

:::

## `template`

Manages all `DOM` elements of the player.

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info(art.template);
console.info(art.template.$video);
```

:::warning Note

To easily distinguish between `DOM` elements and regular objects, all `DOM` elements within the player are named with a `$` prefix.

This is the definition of all `DOM` elements: [artplayer/types/template.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/template.d.ts)

:::

## `events`

Manages all `DOM` events for the player. It essentially proxies `addEventListener` and `removeEventListener`. When using the following methods to handle events, the event will be automatically destroyed when the player is destroyed.

- The `proxy` method is used to proxy `DOM` events.
- The `hover` method is used to proxy custom `hover` events.

<div className="run-code">▶ Run Code</div>

```js
var container = document.querySelector('.artplayer-app');

var art = new Artplayer({
    container: container,
    url: '/assets/sample/video.mp4',
});

art.events.proxy(container, 'click', event => {
	console.info('click', event);
});

art.events.hover(container, (event) => {
    console.info('mouseenter', event);
}, (event) => {
    console.info('mouseleave', event);
});
```

:::warning Note

If you need `DOM` events that only exist during the player's lifecycle, it is strongly recommended to use these functions to avoid memory leaks.

:::

## `storage`

Manages the player's local storage.

- The `name` property is used to set the cache `key`.
- The `set` method is used to set a cache value.
- The `get` method is used to get a cache value.
- The `del` method is used to delete a cache value.
- The `clear` method is used to clear all cache.

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.storage.set('test', { foo: 'bar' });
const test = art.storage.get('test');
console.info(test);
art.storage.del('test');
art.storage.clear();
```

:::warning Note

By default, all player instances share the same `localStorage`, and the default `key` is `artplayer_settings`.

If you want different players to use different `localStorage`, you can modify `art.storage.name`.

:::

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.storage.name = 'your-storage-key';
art.storage.set('test', { foo: 'bar' });
```

## `icons`

Manages all `svg` icons for the player.

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info(art.icons.loading);
```

:::warning This is the definition of all icons:

[artplayer/types/icons.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/icons.d.ts)

:::

## `i18n`

Manages the player's `i18n`.

- The `get` method is used to get an `i18n` value.
- The `update` method is used to update the `i18n` object.

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info(art.i18n.get('Play'));

art.i18n.update({
    'zh-cn': {
        Play: 'Your Play'
    }
});
```

:::warning

Using `art.i18n.update` can only update the `i18n` after instantiation. If you want to update the `i18n` before instantiation, please use the `i18n` option in the basic options.

:::

## `notice`

Manages the player's notifications. It only has a `show` property for displaying notifications.

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.notice.show = 'Video Ready To Play';
})
```

:::warning

If you want to hide the `notice` immediately: `art.notice.show = '';`

:::

## `layers`

Manages the player's layers.

- The `add` method is used to dynamically add a layer.
- The `remove` method is used to dynamically remove a layer.
- The `update` method is used to dynamically update a layer.
- The `show` property is used to set whether all layers are visible.
- The `toggle` method is used to toggle the visibility of all layers.

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.layers.add({
        html: 'Some Text',
    });

	setTimeout(() => {
		art.layers.show = false;
	}, 1000);
});
```

:::warning Refer to the following address for `Component Configuration`:

[/component/layers.html](/component/layers.html)

:::

## `controls`

Manages the player's controls.

- The `add` method is used to dynamically add a control.
- The `remove` method is used to dynamically remove a control.

- The `update` method is used to dynamically update controls
- The `show` property is used to set whether to display all controls
- The `toggle` method is used to toggle the display of all controls

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.controls.add({
        html: 'Some Text',
        position: 'left',
    });

	setTimeout(() => {
		art.controls.show = false;
	}, 1000);
});
```

:::warning For `Component Configuration`, please refer to:

[/component/controls.html](/component/controls.html)

:::

## `contextmenu`

Manages the player's context menu

- The `add` method is used to dynamically add menu items
- The `remove` method is used to dynamically remove menu items
- The `update` method is used to dynamically update menu items
- The `show` property is used to set whether to display all menu items
- The `toggle` method is used to toggle the display of all menu items

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.contextmenu.add({
        html: 'Some Text',
    });

    art.contextmenu.show = true;
	setTimeout(() => {
		art.contextmenu.show = false;
	}, 1000);
});
```

:::warning For `Component Configuration`, please refer to:

[/component/contextmenu.html](/component/contextmenu.html)

:::

## `subtitle`

Manages the player's subtitle functionality

- The `url` property sets and returns the current subtitle URL
- The `style` method sets the style of the current subtitle
- The `switch` method sets the current subtitle URL and options
- `textTrack` gets the current text track
- `activeCues` gets the list of currently active cues
- `cues` gets the overall list of cues

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.subtitle.url = '/assets/sample/subtitle.srt'
    art.subtitle.style({
        color: 'red',
    });
});
```

## `info`

Manages the player's information panel, commonly used to view the current status of the player and video, such as version number, resolution, duration, etc.

- Control the panel's visibility via `art.info.show`
- The triggered event is named `info` (see the event documentation for details)

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.info.show = true;

    setTimeout(() => {
        art.info.show = false;
    }, 3000);
});
```

## `loading`

Manages the player's loading layer

- The `show` property is used to set whether to display the loading layer
- The `toggle` property is used to toggle the display of the loading layer

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
	}, 1000);
});
```

## `hotkey`

Manages the player's hotkey functionality

- The `add` method is used to add hotkeys
- The `remove` method is used to remove hotkeys

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

function hotkeyEvent(event) {
    console.info('click', event);
}

art.on('ready', () => {
    art.hotkey.add(32, hotkeyEvent);
    setTimeout(() => {
		art.hotkey.remove(32, hotkeyEvent);
	}, 5000);
});
```

:::warning Note

These hotkeys only take effect after the player gains focus (e.g., after clicking on the player)

:::

## `mask`

Manages the player's mask layer

- The `show` property is used to set whether to display the mask layer
- The `toggle` property is used to toggle the display of the mask layer

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.on('ready', () => {
    art.mask.show = false;
	setTimeout(() => {
		art.mask.show = true;
	}, 1000);
});
```

## `setting`

Manages the player's settings panel

- The `add` method is used to dynamically add settings items
- The `remove` method is used to dynamically remove settings items
- The `update` method is used to dynamically update settings items
- The `show` property is used to set whether to display all settings items
- The `toggle` method is used to toggle the display of all settings items

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    subtitleOffset: true,
});

art.on('ready', () => {
    art.setting.show = true;
	setTimeout(() => {
		art.setting.show = false;
	}, 1000);
});
```

:::warning For the `Settings Panel`, please refer to:

[/component/setting.html](/component/setting.html)

:::

## `plugins`

Manages the player's plugin functionality, with only the `add` method for dynamically adding plugins

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

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

art.on('ready', () => {
    art.plugins.add(myPlugin);
});
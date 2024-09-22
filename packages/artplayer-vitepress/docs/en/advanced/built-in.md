# Advanced Properties

The `advanced properties` here refer to the `secondary attributes` mounted on the `instance`, which are less commonly used

## `option`

Options for the player

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info(art.option);
```

:::warning Reminder

If you directly modify this `option` object, the player will not respond immediately.

:::

## `template`

Manages all of the `DOM` elements of the player

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info(art.template);
console.info(art.template.$video);
```
:::warning Warning

To easily distinguish between `DOM` elements and plain objects, all `DOM` elements in the player are named starting with a `$`

Here is the definition of all `DOM` elements: [artplayer/types/template.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/template.d.ts)

:::

## `events`

Manages all `DOM` events in the player, which is essentially a proxy for `addEventListener` and `removeEventListener`. When using the following methods to handle events, the event will also be automatically destroyed when the player is destroyed.

- The `proxy` method is used to proxy `DOM` events
- The `hover` method is used to proxy custom `hover` events

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
:::warning Warning

If you need some `DOM` events to only exist during the lifecycle of the player, it is strongly recommended to use these functions to avoid causing memory leaks

:::

## `storage`

Manages the local storage of the player

- The `name` attribute is used to set the cache `key`
- The `set` method is used to set the cache
- The `get` method is used to get the cache
- The `del` method is used to delete the cache
- The `clear` method is used to clear the cache

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

:::warning Warning

By default, all player instances share the same `localStorage`, and the default `key` is `artplayer_settings`

If you want different players to use different `localStorage`, you can modify `art.storage.name` accordingly

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

Manage all the `svg` icons of the player

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

Manage the player's `i18n`

- The `get` method is used to retrieve the value of `i18n`
- The `update` method is used to update the `i18n` object

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

Using `art.i18n.update` can only update `i18n` after instantiation. If you want to update `i18n` before instantiation, please use the `i18n` from the basic options for the update.

:::


## `notice`

Manage the player's notices, there's only one `show` property used to display notices.

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

To immediately hide the display of `notice`: `art.notice.show = '';`

:::

## `layers`

Manage the layers of the player

- The `add` method is used for dynamically adding layers
- The `remove` method is used for dynamically removing layers
- The `update` method is used for dynamically updating layers
- The `show` property is used to set whether to display all layers or not
- The `toggle` method is used to toggle the display of all layers

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
:::warning `Component configuration` Please refer to the following address:

[/component/layers.html](/component/layers.html)

:::

## `controls`

Manage the player's controllers

- `add` method is used to dynamically add controllers
- `remove` method is used to dynamically remove controllers
- `update` method is used to dynamically update controllers
- `show` property is used to set whether to display all controllers
- `toggle` method is used to toggle the display of all controllers

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

:::warning `Component Configuration` Please refer to the following address:

[/component/controls.html](/component/controls.html)

:::

## `contextmenu`

Manage the right-click context menu of the player

- The `add` method is used to dynamically add menu items
- The `remove` method is used to dynamically remove menu items
- The `update` method is used to dynamically update menu items
- The `show` attribute is used to set whether to show all menu items
- The `toggle` method is used to switch the visibility of all menu items

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

:::warning `Component Configuration` Please refer to the following address:

[/component/contextmenu.html](/component/contextmenu.html)

:::

## `subtitle`

Manage the subtitle features of the player

- `url` property sets and returns the current subtitle address
- `style` method sets the style of the current subtitle
- `switch` method sets the current subtitle address and options
- `textTrack` Get the current subtitle track
- `activeCues` Get the currently active subtitle list
- `cues` Get the the subtitle list

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

## `loading`

Manage the loading layer of the player

- `show` property is used to set whether to display the loading layer
- The `toggle` attribute is used to toggle the display of the loading layer

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

Manage the hotkey functionality of the player

- The `add` method is used to add a hotkey
- The `remove` method is used to remove a hotkey

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
:::warning Warning

Shortcut keys will only work after the player has gained focus (e.g., after clicking on the player).

:::

## `mask`

Manage the player's mask layer

- `show` property is used to set whether to display the mask layer
- `toggle` property is used to toggle the display of the mask layer

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

Manage the player's settings panel

- `add` method is used to dynamically add a setting item
- `remove` method is used to dynamically remove a setting item
- `update` method is used to dynamically update a setting item
- `show` property is used to set whether to display all the setting items
- `toggle` method is used to toggle whether to display all the setting items


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

:::warning `Settings Panel` Please refer to the following link

[/component/setting.html](/component/setting.html)

:::

## `plugins`

Manage the player's plugin features, with only one method `add` to dynamically add plugins

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
```
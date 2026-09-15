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

Manages all `DOM` events for the player. It essentially proxies `addEventListener` and `removeEventListener`. When using the following methods to handle events, the events will also be automatically destroyed when the player is destroyed.

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

If you need `DOM` events that should only exist during the player's lifecycle, it is strongly recommended to use these functions to avoid memory leaks.

:::

This registry manages DOM listeners registered through it, separately from player subscriptions using `art.on/off`. `art.proxy` is the same proxy shortcut. `proxy(target, name, callback, options?)` returns a disposer, or an array of disposers when name is an array. Call each disposer directly or pass it to `art.events.remove(dispose)` for early removal. Options retain native capture/once/passive/signal behavior; a normal listener's this is the native event target, not the player.

`hover` registers mouseenter/mouseleave and returns undefined; it does not create a new player hover event. `destroyEvents` holds cleanup functions and should not be mutated directly. `events.destroy()` clears the current registry, including core listeners; it does not destroy the player. Normally use `art.destroy()`. New proxies on a destroyed player do not register listeners.

`bindGlobalEvents({ window, document })` rebinds global listeners after a cross-document move. A successful replacement releases the old binding; a failed replacement preserves it. Omitted fields use the player node's document/window. Supply both when moving between windows. This method neither moves DOM nodes nor rebinds listeners your application installed itself.

## `storage`

Manages the player's local storage.

- The `name` property is used to set the cache `key`.
- The `set` method is used to set a cache.
- The `get` method is used to retrieve a cache.
- The `del` method is used to delete a cache.
- The `clear` method is used to clear all caches.

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

`name` is the localStorage key containing the entire JSON record; the key passed to set/get/del selects a field inside it. `get()` returns the full data and `get(key)` reads one field. Historical truthy-key selection means an empty string (and numeric zero at runtime) returns the full data; use nonempty string keys. set/del/clear synchronously return undefined.

`clear()` removes only the current name entry, not all localStorage for the origin. Changing name does not migrate old data. Same-origin instances with the same name share persisted data. `settings` is a per-instance error fallback, not a live mirror of persistence. Failed reads or writes use the corresponding fallback operation; restored access does not merge fallback data automatically. Storage uses JSON and does not preserve functions, circular objects or all other non-JSON values.

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

- The `get` method is used to retrieve an `i18n` value.
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

Using `art.i18n.update` can only update the `i18n` after instantiation. If you want to update `i18n` before instantiation, please use the `i18n` option in the basic settings.

:::

`languages` holds dictionaries by language code, `language` is the selected dictionary, and `art` references the player. `update({ 'zh-cn': { Play: '播放' } })` deep-merges dictionaries and calls `init()`; both return undefined. init selects `art.option.lang.toLowerCase()`, without lowercasing dictionary keys. Simplified Chinese is built in; an unloaded language falls back to the original key text.

`get(key)` returns a nonempty translation or the key itself; an empty translation also falls back. Updating dictionaries does not redraw existing button, tooltip or menu text. After changing option.lang, init updates future lookups; it is not a complete interface-language switch API. These text keys from the historical declarations share the same lookup rules; runtime lookup also accepts application-defined keys:

```text
Context Menu
Lock
Video Info
Close
Video Load Failed
Volume
Progress
Back
Settings
Play
Pause
Rate
Mute
Video Flip
Horizontal
Vertical
Reconnect
Show Setting
Hide Setting
Screenshot
Play Speed
Aspect Ratio
Default
Normal
Open
Switch Video
Switch Subtitle
Fullscreen
Exit Fullscreen
Web Fullscreen
Exit Web Fullscreen
Mini Player
PIP Mode
Exit PIP Mode
PIP Not Supported
Fullscreen Not Supported
Subtitle Offset
Last Seen
Jump Play
AirPlay
AirPlay Not Available
```

## `notice`

Manages the player's notifications. Assign text through `show` or read its visibility state.

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

Assigning a string or Error displays plain text and restarts the hide timer. Errors use their trimmed message; ordinary strings retain their original text. Reading `notice.show` returns a boolean visibility state, not the last assigned text. Assigning false or an empty string hides immediately, without immediately clearing the text or canceling the old timer.

Each display reads its delay from `Artplayer.NOTICE_TIME`. `timer` is a timer handle, not a countdown. `destroy()` cancels the timer without hiding the node or destroying the player. New notices cannot appear after player destruction. The root entry retains the historical getter type; use `artplayer/runtime` for its accurate boolean type.

## `layers`

Manages the player's layers.

- The `add` method is used to dynamically add a layer.
- The `remove` method is used to dynamically remove a layer.
- The `update` method is used to dynamically update a layer.
- The `show` property is used to set whether all layers are displayed.
- The `toggle` method is used to toggle the display of all layers.

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

:::warning For `Component Configuration`, please refer to:

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
    art.hotkey.add('Space', hotkeyEvent);
    setTimeout(() => {
		art.hotkey.remove('Space', hotkeyEvent);
	}, 5000);
});
```

:::warning Note

These hotkeys only take effect after the player gains focus (e.g., after clicking on the player)

:::

Use `KeyboardEvent.code` strings such as `'Space'`, `'KeyK'` and `'ArrowLeft'`, not numeric keyCode values. add/remove return the hotkey manager. Removal requires the original callback. Different callbacks may share a key; the same callback is not added twice. A callback's this is the player. Adding a custom Space callback does not replace built-in play/pause.

`keys` stores callback arrays by code; `art` references the player. Desktop construction calls init automatically. `hotkey: false` disables built-in keys, but manually added callbacks still work. Mobile keyboard listening is opt-in through the existing init method; this is not physical-device acceptance. Repeated init does not duplicate the same default callbacks or document subscription.

Inputs, textareas, selects, editable content, composition and modified key events are excluded. Native activation keys on buttons/links and keys already handled by player controls do not trigger duplicate shortcuts. Matching callbacks prevent the native default action and are followed by the hotkey event; the player keydown event follows as well.

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

:::warning For `Settings Panel`, please refer to

[/component/setting.html](/component/setting.html)

:::

## `plugins`

Manages the player's plugin functionality, with only one method `add` for dynamically adding plugins

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

## TypeScript service views

The current, unpublished refactor's `artplayer/runtime` entry supplies accurate declarations for the same implementation, including boolean notice.show, EventListener objects and service members. Root and legacy entries preserve historical declaration shapes. Runtime exports `EventRegistry`, `Storage`, `I18n<Host>`, `Hotkey<Host>` and `Notice` describe services; `Dictionary/Languages` describe language data.

```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({ container: '#player', url: '/video.mp4', hotkey: false });
const dispose = art.events.proxy(document, 'click', { handleEvent(event) { console.log(event.type); } });
art.events.remove(dispose);
const onSpace = function (this: Artplayer, event: KeyboardEvent) { console.log(this.id, event.code); };
art.hotkey.add('Space', onSpace);
art.hotkey.remove('Space', onSpace);
art.notice.show = 'Ready';
const visible: boolean = art.notice.show;
art.notice.show = false;
art.i18n.update({ en: { Play: 'Start' } });
console.log(visible, art.i18n.get('Play'));
```

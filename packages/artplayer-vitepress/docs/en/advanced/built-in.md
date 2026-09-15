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

`$container` is the div supplied by the caller; `$player` is the generated player root inside it. They are different elements. These fields retain node references bound during initialization rather than performing a new query on every read:

| Field | Default selector or source |
| --- | --- |
| `$container` | Supplied div container |
| `$player` | `.art-video-player` |
| `$video` | `.art-video` |
| `$track` | `track` |
| `$poster` | `.art-poster` |
| `$subtitle` | `.art-subtitle` |
| `$danmuku` | `.art-danmuku` |
| `$bottom` | `.art-bottom` |
| `$progress` | `.art-progress` |
| `$controls` | `.art-controls` |
| `$controlsLeft` | `.art-controls-left` |
| `$controlsCenter` | `.art-controls-center` |
| `$controlsRight` | `.art-controls-right` |
| `$layer` | `.art-layers` |
| `$loading` | `.art-loading` |
| `$notice` | `.art-notice` |
| `$noticeInner` | `.art-notice-inner` |
| `$mask` | `.art-mask` |
| `$state` | `.art-state` |
| `$setting` | `.art-settings` |
| `$info` | `.art-info` |
| `$infoPanel` | `.art-info-panel` |
| `$infoClose` | `.art-info-close` |
| `$contextmenu` | `.art-contextmenus` |

`art.query(selector)` and `art.template.query(selector)` are the same bound function and can be extracted for later calls. Queries always search descendants of the original $container, excluding the container itself. They do not follow player/media nodes moved outside it. Missing matches return null; invalid selectors retain querySelector errors. `art.video` returns the cached `template.$video`, which can be a canvas with a proxy. The original $track can become detached with a replaced video, so stored references need not remain connected inside the container.

`template.art` references the player. Optional `$mini` can appear after creating a mini window; the default mini node is attached to document.body outside the original container. Do not rebuild the player by replacing these fields. `template.init()` initializes the template: ordinary mode replaces container HTML, then binds nodes and the proxy. Repeating it is not a supported interface-reset workflow. `template.destroy(removeHtml)` only handles template DOM: true empties the container, false adds art-destroy. Use `art.destroy(removeHtml?)` for complete resource cleanup.

Read the template string from static `Artplayer.html`. The old root declaration's `art.template.html` is not an actual instance member and normally reads as undefined. `useSSR: true` preserves and queries supplied markup without filling missing nodes. Keep that markup complete and version-matched; instantiation still requires a browser. Runtime types retain nullable nodes while root types retain historical non-null shapes. A type assertion cannot repair incomplete SSR markup.

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

These 27 default names share the same read behavior:

```text
loading, state, play, pause, check, volume, volumeClose, screenshot, setting, pip, arrowLeft, arrowRight, playbackRate, aspectRatio, config, lock, flip, unlock, fullscreenOff, fullscreenOn, fullscreenWebOff, fullscreenWebOn, switchOn, switchOff, error, close, airplay
```

Every read creates a new `<i class="art-icon art-icon-NAME">` wrapper, so two reads of `art.icons.play` are different objects. This is not a reference to the icon already mounted in a button; modifying a later wrapper does not change the existing button. Root declarations retain HTMLDivElement, although the wrapper is an i element; runtime types use HTMLElement.

Supply constructor `icons` options to replace default content or add custom names. Strings are parsed as HTML and should contain trusted markup. An HTMLElement is moved into the new wrapper rather than cloned; a later read may move it out of its previous wrapper. Use strings or your own cloned elements when independent copies are needed.

Names and values are shallow-copied at initialization. Later changes to `art.option.icons` do not replace that mapping or the rendered interface. Properties are read-only getters and are non-enumerable by default. An unconfigured ordinary custom name returns undefined; check it before appending.

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

### Loading and switching {#subtitle-contract}

`switch(url, option?)` shallowly merges this call's options over `art.option.subtitle`, then overrides the URL with its first argument. It does not write the options back to `art.option.subtitle` or inherit options from the previous switch. `subtitle.option` holds the complete options for the most recently started load, which may still be pending or may have failed.

| Option | Default | Behavior |
| --- | --- | --- |
| `url` | `''` | Request URL; an empty value does not clear the existing track |
| `name` | `''` | Switch notice after a successful submission; the track label still uses `art.option.subtitle.name` or `Artplayer` |
| `type` | `''` | Explicit `vtt`, `srt`, or `ass`, otherwise inferred from the URL, not the response MIME type |
| `style` | `{}` | Subtitle container CSS; later assignments do not automatically clear earlier styles |
| `encoding` | `'utf-8'` | TextDecoder encoding |
| `escape` | `true` | Rendering reads `art.option.subtitle.escape`; a switch-only override does not change that setting |
| `onVttLoad` | Return the text unchanged | Synchronously transforms VTT text; an ordinary function receives the complete options as this |

Recognized SRT/ASS is converted to WebVTT before `onVttLoad`; VTT is passed directly to it. The callback must return a string; promises are not awaited. ASS conversion retains basic text and timing, not full ASS layout. Unrecognized types still undergo fetch and decoding, but skip the callback and pass the original URL to the native track.

`switch` returns `Promise<string | null | undefined>`: the submitted URL on success (usually a Blob URL after conversion), null without an available native text track, or undefined for an empty URL, superseded request, or cancellation on destruction. Fulfillment does not mean native cues have loaded. Subscribe to `subtitleLoad(cues, option)` before switching. The `subtitle.url` getter returns the current track URL; its setter starts a switch without exposing a Promise.

A new request cancels its predecessor and prevents late results from replacing current subtitles; destruction also settles pending requests. Active fetch, decoding, or conversion errors reject direct calls and update the notice. Construction and the URL setter observe their internal rejections. A later native track failure only updates the notice; it cannot reject an already fulfilled switch. Errors and empty URLs do not guarantee removal of the old track. Use `subtitle.show = false` to hide subtitles.

### Tracks, rendering, and cleanup {#subtitle-runtime}

`textTrack` reads the video's first TextTrack rather than searching by language or kind; proxy media without that capability may return undefined. `cues` and `activeCues` return fresh arrays containing the original cue objects, or empty arrays when unavailable or disabled. `SubtitleCue.text` contains the caption; `originalStartTime`/`originalEndTime` preserve the original times when adjusting an offset, and the track's optional `offset` holds the current offset. Reading an array does not clone this metadata.

`update()` synchronously redraws active cues. It is not the generic component update method and does not download subtitles again. With no active cues it only clears the view; otherwise it emits `subtitleBeforeUpdate`, creates `.art-subtitle-line[data-group]` elements for nonempty lines, then emits `subtitleAfterUpdate`. Rendering uses the player's escape setting. With escaping disabled, cue contents are inserted as trusted HTML. Switching, redrawing, or destroying inside a listener prevents the stale outer render from committing.

`show`/`toggle()` control the player's `art-subtitle-show` class and emit the boolean `subtitle` event; they do not stop downloads or the track. `style(object)` and `style(key, value)` return the subtitle container. The manager's `name` is `subtitle`. `destroyEvent` cleans up the current cuechange listener; it does not destroy the entire subtitle manager.

Low-level `init(fullOption)` does not fill in missing configuration; normally use `switch`. `createTrack(kind, url)` directly replaces the native track without downloading, converting, or merging options, and returns undefined. The new track uses hidden mode and its load event emits `subtitleLoad`. Replacement releases old listeners. Core-generated Blob URLs are revoked on replacement or player destruction; caller-supplied URLs remain caller-owned. Do not revoke a core-returned Blob URL as soon as switch fulfills. WebKit native fullscreen transitions may recreate the track and trigger another load, so loading is not a one-time event.

The root entry retains historical void style returns, `Promise<string>` switch returns, and the inherited component update declaration. Use `artplayer/runtime` for accurate returns and `update()`. Its `Subtitle` describes the manager; the root `Subtitle` describes configuration. Inherited members do not imply support for adding custom entries as with layers.

```ts
import Artplayer from 'artplayer/runtime';
import type { SubtitleCue } from 'artplayer/runtime';

const art = new Artplayer({ container: '.artplayer-app', url: '/assets/sample/video.mp4' });
art.on('subtitleLoad', (cues: SubtitleCue[]) => console.info(cues.length));
const node: HTMLDivElement = art.subtitle.style({ color: 'red' });
const loading: Promise<string | null | undefined> = art.subtitle.switch('/assets/sample/subtitle.srt');
void loading.catch(console.error);
art.subtitle.update();
void node;
```

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

## TypeScript template and icon views

The unpublished refactor's `artplayer/runtime` uses `Template<Host>`, `Icons` and media-capability types for nullable queries, unknown icons and proxy media. This example uses the same implementation as the root entry:

```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({
    container: '#player', url: '/video.mp4',
    icons: { customMark: '<span aria-hidden="true">*</span>' },
});
const query = art.query;
const player: HTMLDivElement | null = query('.art-video-player');
const icon: HTMLElement | undefined = art.icons.customMark;
if (player && icon) player.append(icon);
console.log(Artplayer.html, art.video === art.template.$video);
```

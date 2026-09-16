# Static Properties

Here, `static properties` refer to the `first-level properties` attached to the `constructor`, which are rarely used.

## `instances`

Returns an array of all player instances. This property can be useful when you need to manage multiple players simultaneously.

<div className="run-code">▶ Run Code</div>

```js
console.info([...Artplayer.instances]);

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info([...Artplayer.instances]);
```

## `version`

Returns the version information of the player.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.version);
```

## `env`

Retained in historical root declarations, but absent at runtime in both the frozen npm 5.4.0 baseline and the current 6.0.0 build. Reading it returns undefined; it is not a reliable environment check.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.env);
```

## `build`

Retained in historical root declarations, but neither the frozen npm 5.4.0 baseline nor the current 6.0.0 runtime provides a build timestamp here. Reading it returns undefined; use your own release metadata when needed.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.build);
```

## `config`

Returns the shared media-surface inventory, not the default player options (those are in Artplayer.option).

### Media surface inventory {#config-contract}

The getter returns the same object each time. Its properties, methods, events, and prototypes arrays describe media property names, callable methods, native events, and additional video-specific surface members. They are inventories, not capability guarantees: proxies and browsers may support only part of the surface.

The core reads config.events when installing native event forwarding, then forwards those events as video:eventName. Changing the array later does not add/remove listeners on existing players. Debug logging and proxy adapters also consume this inventory; editing it does not create the corresponding native methods or properties. The root Config type retains historical readonly tuples; runtime Config accurately exposes mutable string arrays. Mutation affects shared consumers, so preserve order and restore temporary test changes.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.config);
```


```ts
import Artplayer from 'artplayer/runtime';
import type { Config } from 'artplayer/runtime';

const config: Config = Artplayer.config;
const nativeNames: string[] = config.events.slice();
const shared: boolean = Artplayer.config === config;
void [nativeNames, shared];
```

## `utils`

Returns the collection of utility functions for the player.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.utils);
```

:::warning For all utility functions, please refer to the following address:

[artplayer/types/utils.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/utils.d.ts)

:::

### Environment and types {#utils-contract}

`Artplayer.utils` is a public collection, not bound to a player instance. Text and data helpers work independently; DOM, image, style, and measurement helpers require a browser and the relevant nodes. Resources you create through these utilities are not automatically released when a player is destroyed.

`isBrowser`, `userAgent`, `isMobile`, `isSafari`, `isIOS`, and `isIOS13` are calculated at module load, not updated after window or UA changes. The UA uses `globalThis.CUSTOM_USER_AGENT` if set before loading, otherwise navigator. `isIOS13` also recognizes a touch-capable Macintosh. These are compatibility heuristics, not guarantees of media capabilities or OS versions.

The root `Utils` retains historical signatures; `Utils` from `artplayer/runtime` describes actual returns and broader DOM inputs. Internal helper shapes require only style for `StyledElement`, and target plus optional composedPath for `EventPathSource`; neither is a separately named export from the runtime entry. A generic query provides a static type without checking the actual element tag.

### DOM and styles {#utils-dom}

| Utility | Arguments, returns, and boundaries |
| --- | --- |
| `query(selector, parent?)` / `queryAll(selector, parent?)` | Default to document; return the first element or null / a fresh array. Search descendants, excluding the parent itself; invalid selectors still throw |
| `createElement(tag)` | Creates a native HTML element without attaching it |
| `addClass` / `removeClass` / `hasClass` | Accept a node and one class token; the first two return undefined, the last a boolean. Native classList argument errors are preserved |
| `append(parent, child)` | Moves same-realm Elements; other values are stringified and appended as HTML. Returns lastElementChild, falling back to lastChild, so appended text is not necessarily the return value; an empty parent may yield null |
| `remove(child)` / `replaceElement(newChild, oldChild)` | Return the removed node / new node; missing parents still cause errors |
| `siblings(target)` / `inverseClass(target, name)` | Return other elements under the same parent / remove the class from siblings and add it to target, returning undefined. Require parentElement |
| `setStyle(element, key, value)` / `setStyles(element, styles)` | Assign directly to style and return the original element. setStyles includes inherited enumerable string keys; neither adds units nor clears previous styles |
| `getStyle(element, key, numberType = true)` | Reads getComputedStyle/getPropertyValue; defaults to parseFloat, yielding NaN for nonnumeric values. Pass false for the raw string. Use CSS names such as `font-size` |
| `setStyleText(id, cssText)` | Replaces textContent of an existing element with that id, otherwise creates style. While the document is loading, attachment to head waits for DOMContentLoaded. No Promise or automatic disposal; use a dedicated id |
| `getRect(element)` | Returns the original getBoundingClientRect DOMRect, beyond the four fields in the root type |
| `getIcon(key = '', html = '')` | Returns a new i element with art-icon and art-icon-key classes, using append rules for contents; elements are moved, not cloned |
| `tooltip(target, message, position = 'top')` | On desktop, sets aria-label and hint--rounded / hint--position classes; does nothing on mobile. Later calls do not remove earlier direction classes |

HTML strings are not sanitized. Use textContent for plain text or escape for the intended context; do not pass untrusted content directly to append/getIcon.

### Events and measurement {#utils-measure}

| Utility | Behavior |
| --- | --- |
| `getComposedPath(event)` | Calls composedPath with its original receiver and returns its array directly. Otherwise walks target.parentNode and appends window in a browser. The fallback does not reproduce a complete Shadow DOM path |
| `includeFromEvent(event, target)` | Tests membership in that path, rather than performing a separate DOM contains query |
| `isInViewport(element, offset = 0)` | Tests rectangle/window intersection, including boundaries. It does not prove full visibility or lack of occlusion, and retains the historical offset calculation |
| `getSafeAreaInsets()` | Attaches a temporary invisible node and reads numeric env(safe-area-inset-*) values, using zero for unparseable values. Removes the node on success or failure; requires document.body |
| `supportsFlex()` | Only tests whether an element accepts display:flex, not whether layout works correctly |

### Subtitles, images, and files {#utils-resources}

| Utility | Behavior and ownership |
| --- | --- |
| `srtToVtt(text)` / `assToVtt(text)` | Synchronously return WebVTT text. The former normalizes milliseconds and some style markers; the latter extracts basic Dialogue timing/text. Neither is a full subtitle validator or ASS renderer |
| `vttToBlob(text)` | Returns a text/vtt Blob URL, not a Blob. The caller must revoke the URL when finished |
| `getExt(url)` | Removes query/fragment, trims and lowercases, then takes text after the last dot. Without a dot it returns the remaining string; no resource or MIME check |
| `download(url, name)` | Creates, clicks, and removes a temporary download link. No completion result or guarantee the browser saves a file; does not revoke the input URL |
| `loadImg(url, scale?)` | Resolves with a loaded HTMLImageElement. Falsy scale or1 returns the original image; other values use canvas/toBlob and load the scaled result. Its image.src is a caller-owned Blob URL that must be revoked after use |

`loadImg` does not set crossOrigin and has no public cancellation or timeout option. A cross-origin image can display while still making canvas unreadable. Image loading, canvas, or encoding failures reject the Promise. Successful listeners are removed; failure during scaling releases an already created Blob URL. Revoke a scaled result's src only after the page no longer needs it; the original image URL is not owned by this function.

### Data, errors, and scheduling {#utils-data}

| Utility | Behavior |
| --- | --- |
| `def(object, key, descriptor)` | Object.defineProperty itself, returning the original object. The root string-key overload's historical void return is not the runtime result |
| `has(object, key)` / `get(object, key)` | Test own-property presence / retrieve an own descriptor, returning undefined if missing |
| `mergeDeep(...objects)` | Creates a new top-level object using Object.keys. Two non-array objects merge recursively; two arrays use the historical concat/spread rule, which can flatten nested arrays in the latter array. Not a complete deep clone: unmerged values retain references. Cyclic merging is unsupported; __proto__ is stored as own data |
| `clamp(number, a, b)` | Clamps between either ordering of endpoints; NaN remains NaN |
| `secondToTime(seconds)` | Floors to mm:ss, or hh:mm:ss from one hour; hours can exceed two digits. Falsy inputs yield00:00. Does not additionally validate negative or nonfinite inputs |
| `escape(text)` / `unescape(text)` | Only the five fixed entities for ampersand, angle brackets, and single/double quotes, in one pass. unescape is not a general HTML entity parser |
| `capitalize(text)` | Uppercases only the first character |
| `ArtPlayerError(message?, context?)` / `errorHandle(condition, message?)` | Error subclass named ArtPlayerError, with context used for supported stack capture / throw that error for falsy conditions, otherwise return the original value |
| `silencePromise(value)` | If catch is callable, return the result of catching and consuming a rejection; otherwise return the value unchanged. Uses catch capability, not instanceof Promise; synchronous errors thrown by catch itself still propagate |
| `sleep(milliseconds = 0)` | Resolves with undefined after a timer, without cancellation |
| `debounce(callback, duration)` | Trailing call with the last arguments and call receiver. Ignores the historical context argument; wrapper returns undefined |
| `throttle(callback, duration)` | Synchronous leading call, dropping calls during the wait without a trailing call. Preserves the call receiver; wrapper returns undefined |

Neither wrapper offers cancel/flush or automatic cancellation on player destruction. Throttle enters its waiting period only after the callback returns normally, preserving synchronous reentry and another attempt after a thrown error. Historical root return inference does not change this behavior.

```ts
import Artplayer from 'artplayer/runtime';
import type { Utils } from 'artplayer/runtime';

const utils: Utils = Artplayer.utils;
const fragment = document.createDocumentFragment();
const missing: HTMLVideoElement | null = utils.query<HTMLVideoElement>('video', fragment);
const div = utils.createElement('div');
const styled: HTMLDivElement = utils.setStyle(div, 'fontSize', '20px');
const width: string = utils.getStyle(div, 'width', false);
const invoke = utils.debounce(function (this: { value: number }, step: number) {
    this.value += step;
}, 20);
const returned: void = invoke.call({ value: 0 }, 1);
void [missing, styled, width, returned];
```


## `scheme`

Returns the validation schema for player options.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.scheme);
```

## `Emitter`

Returns the constructor of the event emitter.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.Emitter);
```

## `validator`

Returns the validation function for options.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.validator);
```

## `kindOf`

Returns the type detection utility function.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.kindOf);
```

## `html`

Returns the `html` string required by the player.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.html);
```

This is the current version's static base markup, including required classes and media/control nodes, not a snapshot of an instance's current DOM. When reusing preinserted markup through `useSSR: true`, keep its complete structure and version aligned. The option does not make construction work outside a browser. Actual template instances have no `html` member; the historical root type retains that member for compatibility, but it does not replace the static entry.

## `option`

Returns the default options of the player.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.option);
```
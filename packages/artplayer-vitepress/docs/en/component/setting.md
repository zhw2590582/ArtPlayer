# Settings Panel

## Built-in

Enable setting: true and the corresponding options to install these four built-in items: `flip`, `playbackRate`, `aspectRatio`, `subtitleOffset`.

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    subtitleOffset: true,
});
```

## Create - Button

| Property   | Type                | Description          |
| ---------- | ------------------- | -------------------- |
| `html`     | `String`, `Element`, `Number` | The DOM element      |
| `icon`     | `String`, `Element`, `Number` | The icon element     |
| `onClick`  | `Function`          | The click event      |
| `width`    | `Number`            | The list width       |
| `tooltip`  | `String`, `Element`, `Number`            | The tooltip text     |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Button',
            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
            tooltip: 'tooltip',
            onClick(item, $dom, event) {
                console.info(item, $dom, event);
                return 'new tooltip';
            },
        },
    ],
});
```

## Create - Selection List

| Property   | Type                | Description          |
| ---------- | ------------------- | -------------------- |
| `html`     | `String`, `Element`, `Number` | The DOM element      |
| `icon`     | `String`, `Element`, `Number` | The icon element     |
| `selector` | `Array`             | The list of elements |
| `onSelect` | `Function`          | The click event      |
| `width`    | `Number`            | The list width       |
| `tooltip`  | `String`, `Element`, `Number`            | The tooltip text     |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Subtitle',
            width: 250,
            tooltip: 'Subtitle 01',
            selector: [
                {
                    default: true,
                    html: '<span style="color:red">Subtitle 01</span>',
                    url: '/assets/sample/subtitle.srt?id=1',
                },
                {
                    html: '<span style="color:yellow">Subtitle 02</span>',
                    url: '/assets/sample/subtitle.srt?id=2',
                },
            ],
            onSelect: function (item, $dom, event) {
                console.info(item, $dom, event);
                art.subtitle.url = item.url;
                return item.html;
            },
        },
        {
            html: 'Quality',
            width: 150,
            tooltip: '1080P',
            selector: [
                {
                    default: true,
                    html: '1080P',
                    url: '/assets/sample/video.mp4?id=1080',
                },
                {
                    html: '720P',
                    url: '/assets/sample/video.mp4?id=720',
                },
                {
                    html: '360P',
                    url: '/assets/sample/video.mp4?id=360',
                },
            ],
            onSelect: function (item, $dom, event) {
                console.info(item, $dom, event);
                art.switchQuality(item.url, item.html);
                return item.html;
            },
        },
    ],
});
```

## Create - Nested List

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Multi-level',
            selector: [
                {
                    html: 'Setting 01',
                    width: 150,
                    selector: [
                        {
                            html: 'Setting 01 - 01',
                        },
                        {
                            html: 'Setting 01 - 02',
                        },
                    ],
                    onSelect: function (item, $dom, event) {
                        console.info(item, $dom, event);
                        return item.html;
                    },
                },
                {
                    html: 'Setting 02',
                    width: 150,
                    selector: [
                        {
                            html: 'Setting 02 - 01',
                        },
                        {
                            html: 'Setting 02 - 02',
                        },
                    ],
                    onSelect: function (item, $dom, event) {
                        console.info(item, $dom, event);
                        return item.html;
                    },
                },
            ],
        },
    ],
});

```

## Create - Toggle Button

| Property   | Type                | Description                |
| ---------- | ------------------- | -------------------------- |
| `html`     | `String`, `Element`, `Number` | DOM element for the item   |
| `icon`     | `String`, `Element`, `Number` | Icon for the item          |
| `switch`   | `Boolean`           | Default state of the button |
| `onSwitch` | `Function`          | Button toggle event        |
| `tooltip`  | `String`, `Element`, `Number`            | Tooltip text               |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'PIP Mode',
            tooltip: 'Close',
            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
            switch: false,
            onSwitch: function (item, $dom, event) {
                console.info(item, $dom, event);
                const nextState = !item.switch;
                art.pip = nextState;
                item.tooltip = nextState ? 'Open' : 'Close';
                return nextState;
            },
        },
    ],
});
```

## Create - Range Slider

| Property   | Type                | Description                |
| ---------- | ------------------- | -------------------------- |
| `html`     | `String`, `Element`, `Number` | DOM element for the item   |
| `icon`     | `String`, `Element`, `Number` | Icon for the item          |
| `range`    | `Array`             | Default state array        |
| `onRange`  | `Function`          | Event triggered on completion |
| `onChange` | `Function`          | Event triggered on change  |
| `tooltip`  | `String`, `Element`, `Number`            | Tooltip text               |

```js
const range = [5, 1, 10, 1];
const value = range[0];
const min = range[1];
const max = range[2];
const step = range[3];
```

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Slider',
            tooltip: '5x',
            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
            range: [5, 1, 10, 1],
            onChange: function (item, $dom, event) {
                console.info(item, $dom, event);
                return item.range[0] + 'x';
            },
        },
    ],
});
```

## Add

<div className="run-code">▶ Run Code</div>

```js{9-14}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
});

art.setting.show = true;

art.setting.add({
    html: 'Slider',
    tooltip: '5x',
    icon: '<img width="22" height="22" src="/assets/img/state.svg">',
    range: [5, 1, 10, 1],
});
```

## Remove

<div className="run-code">▶ Run Code</div>

```js{22}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    flip: true,
    settings: [
        {
            name: 'slider',
            html: 'Slider',
            tooltip: '5x',
            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
            range: [5, 1, 10, 1],
        },
    ],
});

art.setting.show = true;

art.on('ready', () => {
    setTimeout(() => {
        // Delete the setting by name
        art.setting.remove('slider');
    }, 3000);
});
```

## Update

<div className="run-code">▶ Run Code</div>

```js{21-27}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            name: 'slider',
            html: 'Slider',
            tooltip: '5x',
            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
            range: [5, 1, 10, 1],
        },
    ],
});

art.setting.show = true;

art.on('ready', () => {
    setTimeout(() => {
        // Remove the old interaction field before changing from range to switch
        delete art.setting.find('slider').range;
        // Update the setting by name
        art.setting.update({
            name: 'slider',
            html: 'PIP Mode',
            tooltip: 'Close',
            icon: '<img width="22" height="22" src="/assets/img/state.svg">',
            switch: false,
        });
    }, 3000);
});
```

## Setting items and callback rules {#setting-contract}

Settings use a tree model, not the controls/layers node registry or beforeUnmount rules. Set setting: true to format/render the panel and install its regular events during construction. Each of the four built-in entries also requires its corresponding option. Their actual names are playback-rate, aspect-ratio, flip and subtitle-offset.

| Field | Actual purpose |
| --- | --- |
| name | Unique across the tree; omitted names become setting-N on the original object |
| html / icon / tooltip | Trusted HTML strings, HTMLElement or numbers; rendering installs content accessors tied to nodes |
| width | Requested submenu width; zero/omitted uses SETTING_WIDTH, and actual dimensions are constrained by the player |
| value | Custom string/number data, not automatic media switching; historical falsy handling writes numeric zero as an empty data-value |
| default | Selection flag; initial rendering does not replace the parent's tooltip from the selected entry |
| selector | Nested items; a nonempty array opens a submenu |
| switch | Initial state; onSwitch must return the next state, with no automatic inversion |
| range | [value, min, max, step]; provide all four values, with omitted values and clamping governed by the native range input |
| mounted | Deferred node-mount callback, not a synchronous construction callback |
| onClick / onSwitch / onRange / onChange / onSelect | Distinct interaction callbacks described below |

Falsy html/icon/tooltip during initial rendering use empty content or the default icon. Subsequent reads of content accessors return innerHTML strings. Assigning an HTMLElement moves it; strings are parsed as HTML and numbers become text. Do not insert untrusted content directly.

Each item has one interaction kind, selected by property presence: onClick takes precedence over range, then switch, then selector. This tests whether the property exists, not whether its value is truthy. When changing kinds, do not merely add a new field while retaining conflicting fields: replace with an independently named item or explicitly handle obsolete fields on the original object. Ordinary component disable/index/click/beforeUnmount are not setting availability, ordering or lifecycle APIs.

| Callback | Arguments and result |
| --- | --- |
| mounted | (itemElement, item), with the player as this; scheduled with zero delay after insertion. Removal/replacement/destruction cancels pending work. The result is not UI content; Promise rejections produce a warning |
| onClick | (item, itemElement, event); result becomes that item's tooltip |
| onSwitch | Same arguments; result becomes switch. Without a callback, clicking does not toggle it |
| onChange | Native input event; when installed, writes the input value into item.range[0] before the callback, then writes its result into tooltip |
| onRange | Native change event; same update rules, for committed changes |
| onSelect | Defined on the parent; receives the clicked leaf, its node and event. Selection/navigation to the parent list happens first, then the result becomes the parent tooltip |

All interaction callbacks use the player as this and support Promise results. Only the latest operation for that target writes back while its items remain active. Results after removal, replacement or destruction are ignored. An omitted return does not preserve the old tooltip automatically: return the desired content or switch state. Errors warn without undoing an earlier selection or range[0] update. Mutating one range-array element does not synchronize the native input; assigning a complete new item.range array updates its properties. Without the corresponding onChange/onRange callback, native input changes do not synchronize range[0] through that callback path.

## Manager methods and node ownership {#setting-manager}

- find(name) returns the original item or null. add(item, option?) returns the supplied item; it appends to the root by default, or to an existing selector array passed as the second argument. Items gain names and accessors: do not freeze them or share them between two active players. Duplicate names, repeated object identity and cycles in one tree are rejected.
- update(item) shallow-updates the existing named item and returns that original object; missing names call add. Rendered entries rebuild their nodes and release old listeners/subpanels, then return to the root list. Ordinary synchronous update failures attempt to restore the original item, nodes, listeners and navigation before rethrowing; this is not a transaction covering caller side effects.
- remove(name) removes the item and descendants, cleans their listeners/subpanels, renders the root list and returns undefined. A missing name throws. Old DOM references no longer represent current nodes after removal/update; application-created resources remain application-owned.
- show/toggle change visibility and emit setting. Setting show = true does not create a missing settings button or format an initially disabled panel; normally start with setting: true. resize() recomputes constrained dimensions when the panel is visible and has an active list and settings button.
- traverse(callback, option?) visits actual objects in parent-before-child order, defaulting to the root. check(item) updates a formatted child's parent tooltip and default flags throughout the containing list and its descendants, then returns to the parent's containing list. No argument or a root item is a no-op.
- render(option?) displays/caches a formatted list, defaulting to the root. format(option?, parent?, parents?, names?) validates/binds the tree and assigns the supplied list as the manager's option; it is not read-only validation. Usually let add/update manage this process.
- createHeader/createItem are lower-level renderers requiring formatted items and cached panels. inactivate releases an item's subtree resources and subpanels without removing the item from its array. Use remove for complete removal rather than composing these internal steps.

Manager art references the player, name is setting, $parent is template.$setting and id generates names. option is the root array: construction combines built-ins and settings into a new array while retaining item identities. active is the current list or null; cache maps array identity to panel nodes. Each builtin read creates fresh entries from current options, not references to registered items. Use find for active entries and avoid mutating cache/active to bypass rendering.

| Item metadata | Meaning |
| --- | --- |
| $parent | Direct parent item; undefined at root |
| $parents | List containing the direct parent, not the full ancestor chain; undefined at root |
| $option | Array containing this item |
| $events / $formatted | Managed DOM cleanup array / established tree binding, not a currently-mounted flag |
| $item / $icon / $html / $tooltip | Rendered item/content nodes; unopened submenus may not have these yet |
| $switch / $range | Kind-specific switch node or native range input; do not retain obsolete references across updates |

Tree metadata uses readonly nonenumerable accessors. DOM accessors are installed during rendering; retaining an item after removal does not mean its nodes are connected. Root declarations preserve historical inaccuracies: missing find results are typed undefined, add/update/remove are typed as returning the manager, and updateStyle(width?) does not actually exist. Use resize() and avoid chaining those methods based on old signatures. Root Setting describes an item, while the unpublished refactor's artplayer/runtime exports the Setting manager and generic SettingItem; these are different types.

## TypeScript accurate-type example

```ts
import Artplayer from 'artplayer/runtime';
import type { SettingItem } from 'artplayer/runtime';

const art = new Artplayer({ container: '#player', url: '/video.mp4', setting: true });
const option: SettingItem<typeof art> = {
    name: 'speed-label', html: 'Label', tooltip: 'Before',
    async onClick(item) { return 'After: ' + item.html; },
};
const added: SettingItem<typeof art> = art.setting.add(option);
const found: SettingItem<typeof art> | null = art.setting.find('speed-label');
if (found) art.setting.update({ name: found.name, html: 'New label' });
console.log(added === option);
art.setting.remove('speed-label');
```

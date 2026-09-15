# Controls

## Configuration

| Property   | Type                | Description                                      |
| ---------- | ------------------- | ------------------------------------------------ |
| `disable`  | `Boolean`           | Whether to disable the control                   |
| `name`     | `String`            | Unique name of the control, used for class marking |
| `index`    | `Number`            | Control index, determines display priority       |
| `html`     | `String`, `Element`, `Number` | DOM element of the control                       |
| `style`    | `Object`            | Style object for the control                     |
| `click`    | `Function`          | Click event handler for the control              |
| `mounted`  | `Function`          | Triggered after the control is mounted           |
| `beforeUnmount` | `Function` | Hook before explicit remove/update |
| `tooltip`  | `String`, `Number`            | Tooltip text for the control                     |
| `position` | `String` | Required: top, left or right |
| `selector` | `Array`             | Array of objects for selection list              |
| `onSelect` | `Function`          | Function triggered when a selection list item is clicked |

## Creation

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            name: 'your-button',
            index: 10,
            position: 'left',
            html: 'Your Button',
            tooltip: 'Your Button',
            style: {
                color: 'red',
            },
            click: function (...args) {
                console.info('click', args);
            },
            mounted: function (...args) {
                console.info('mounted', args);
            },
        },
        {
            name: 'subtitle',
            position: 'right',
            html: 'Subtitle',
            selector: [
                {
                    default: true,
                    html: '<span style="color:red">subtitle 01</span>',
                },
                {
                    html: '<span style="color:yellow">subtitle 02</span>',
                },
            ],
            onSelect: function (item, $dom) {
                console.info(item, $dom);
                return 'Your ' + item.html;
            },
        },
    ],
});

// Get the Element of control by name
console.info(art.controls['your-button']);
console.info(art.controls['subtitle']);
```

## Adding

<div className="run-code">▶ Run Code</div>

```js{6-21}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.controls.add({
    name: 'button1',
    index: 10,
    position: 'left',
    html: 'Your Button',
    tooltip: 'Your Button',
    style: {
        color: 'red',
    },
    click: function (...args) {
        console.info('click', args);
    },
    mounted: function (...args) {
        console.info('mounted', args);
    },
});

// Get the Element of control by name
console.info(art.controls['button1']);
```

## Removal

<div className="run-code">▶ Run Code</div>

```js{21}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            name: 'button1',
            index: 10,
            position: 'right',
            html: 'Your Button',
            tooltip: 'Your Button',
            style: {
                color: 'red',
            },
        }
    ]
});

art.on('ready', () => {
    setTimeout(() => {
        // Delete the control by name
        art.controls.remove('button1');
    }, 3000);
});
```

## Updating

<div className="run-code">▶ Run Code</div>

```js{26-40}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            name: 'button1',
            index: 10,
            position: 'right',
            html: 'Subtitle',
            selector: [
                {
                    default: true,
                    html: 'subtitle 01',
                },
                {
                    html: 'subtitle 02',
                },
            ],
        }
    ]
});

art.on('ready', () => {
    setTimeout(() => {
        // Update the control by name
        art.controls.update({
            name: 'button1',
            index: 10,
            position: 'right',
            html: 'New Subtitle',
            selector: [
                {
                    default: true,
                    html: 'new subtitle 01',
                },
                {
                    html: 'new subtitle 02',
                },
            ],
        });
    }, 3000);
});
```

## Manager and selector behavior {#control-contract}

See [shared component behavior](./layers#component-contract) for options, callbacks, shallow updates and cleanup. position must be top, left or right, using template.$progress, $controlsLeft or $controlsRight respectively. Missing/other values throw. $parent records the latest add position, not a shared parent for all controls. The manager name is control; classes are art-control/art-control-NAME. There is no center option.

add/update return undefined. Obtain a node through mounted, cache.get(name)?.$ref or its known name property. setting and thumbnails are optional built-in node references, not the setting manager or thumbnail data. init installs built-in and configured entries; it is not a repeatable reset API and can fail on duplicate names. isHover tracks the pointer's relation to the bottom area. timer is the last-show timestamp, not a timer handle. Automatic hiding depends on playback timeupdate, CONTROL_HIDE_TIME, settings, input, pointer and keyboard focus; it is not an exact timer.

selector creates a list only in left/right positions. Item html is display content, value is custom string/number data, and default is the selection flag; value does not automatically switch media. Initial button content comes from the control's html. Initial default flags mark list items without replacing the button label. List and subsequent button content use innerHTML: use trusted strings. Although historical types allow HTMLElement, this path does not move that element as ordinary component html does.

A click first updates default flags, button content and highlighting, then calls onSelect(item, itemElement, event) with the player as this. Its return value, including a Promise result, becomes the button's new innerHTML. Undefined does not automatically fall back to the previous content; return the intended text or HTML. Async results update the label only while this selection is current and the entry remains active. Results from earlier selections or removed/replaced entries are ignored. Errors produce a warning and do not roll back the selected item.

controls.check(item) updates selection using a bound item. No argument is a no-op; an arbitrary unbound object is not supported. Items receive readonly nonenumerable $control_option (original array), $control_item (list node) and $control_value (button-value node) accessors. One item object cannot belong to two active selectors at once; it can be reused after the old control releases it. controls.selector is a renderer requiring managed nodes and cleanup arrays; applications should use the selector option of add/update.

## TypeScript control example

```ts
import Artplayer from 'artplayer/runtime';
import type { SelectorItem } from 'artplayer/runtime';

const art = new Artplayer({ container: '#player', url: '/video.mp4' });
const items: SelectorItem[] = [{ html: 'One', value: 1, default: true }, { html: 'Two', value: 2 }];
const result: undefined = art.controls.add({
    name: 'choices', position: 'right', html: 'Choose', selector: items,
    async onSelect(item) { return String(item.html); },
});
art.controls.check(items[1]);
console.log(result, art.controls.cache.get('choices')?.$ref);
art.controls.remove('choices');
```

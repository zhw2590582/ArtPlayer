# Context Menu

## Configuration

| Property  | Type                | Description                          |
| --------- | ------------------- | ------------------------------------ |
| `disable` | `Boolean`           | Whether to disable the component     |
| `name`    | `String`            | Unique component name for CSS class  |
| `index`   | `Number`            | Component index for display priority |
| `html`    | `String`, `Element`, `Number` | DOM element of the component         |
| `style`   | `Object`            | Component style object               |
| `click`   | `Function`          | Component click event                |
| `mounted` | `Function`          | Triggered after component mount      |
| `beforeUnmount` | `Function` | Hook before explicit remove/update |
| `tooltip` | `String`, `Number`            | Tooltip text for the component       |

## Creation

<div className="run-code">▶ Run Code</div>

```js{4-13}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    contextmenu: [
        {
            name: 'your-menu',
            html: 'Your Menu',
            click: function (...args) {
                console.info(args);
                art.contextmenu.show = false;
            },
        },
    ],
});

art.contextmenu.show = true;

// Get the Element of contextmenu by name
console.info(art.contextmenu['your-menu']);
```

## Addition

<div className="run-code">▶ Run Code</div>

```js{6-13}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.contextmenu.add({
    name: 'your-menu',
    html: 'Your Menu',
    click: function (...args) {
        console.info(args);
        art.contextmenu.show = false;
    },
});

art.contextmenu.show = true;

// Get the Element of contextmenu by name
console.info(art.contextmenu['your-menu']);
```

## Deletion

<div className="run-code">▶ Run Code</div>

```js{21}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    contextmenu: [
        {
            name: 'your-menu',
            html: 'Your Menu',
            click: function (...args) {
                console.info(args);
                art.contextmenu.show = false;
            },
        },
    ],
});

art.contextmenu.show = true;

art.on('ready', () => {
    setTimeout(() => {
        // Delete the contextmenu by name
        art.contextmenu.remove('your-menu')
    }, 3000);
});
```

## Update

<div className="run-code">▶ Run Code</div>

```js{21-24}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    contextmenu: [
        {
            name: 'your-menu',
            html: 'Your Menu',
            click: function (...args) {
                console.info(args);
                art.contextmenu.show = false;
            },
        },
    ],
});

art.contextmenu.show = true;

art.on('ready', () => {
    setTimeout(() => {
        // Update the contextmenu by name
        art.contextmenu.update({
            name: 'your-menu',
            html: 'Your New Menu',
        })
    }, 3000);
});
```

## Menu management and lifecycle {#contextmenu-contract}

See [shared component behavior](./layers#component-contract) for options, callbacks, return values, name conflicts and update/cleanup rules. The parent is template.$contextmenu; the manager name is contextmenu, with art-contextmenu and art-contextmenu-NAME item classes. show/toggle control the whole menu, not individual availability. Clicking a custom entry does not automatically close it; set art.contextmenu.show = false in your callback when needed.

Desktop initialization installs built-in/configured entries and handles the context-menu event, keyboard, outside clicks and player blur. Mobile does not automatically run that initialization. Direct add can still register entries, but does not install the complete desktop context-menu flow. Use add/update/remove rather than repeating initialization to refresh entries.

## TypeScript menu example

```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({ container: '#player', url: '/video.mp4' });
const menu: HTMLDivElement | undefined = art.contextmenu.add({
    name: 'custom-menu', html: 'Close menu',
    click() { this.contextmenu.show = false; },
});
if (menu) art.contextmenu.remove('custom-menu');
```

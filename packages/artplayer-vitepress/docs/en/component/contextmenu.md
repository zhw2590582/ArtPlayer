# Contextmenu

## Config

| Property  | Type                | Describe                                       |
| --------- | ------------------- | ---------------------------------------------- |
| `disable` | `Boolean`           | Whether to disable the component               |
| `name`    | `String`            | Component unique name, used to mark class name |
| `index`   | `Number`            | Component index, used for display priority     |
| `html`    | `String`, `Element` | DOM element of the component                   |
| `style`   | `Object`            | component style object                         |
| `click`   | `Function`          | Component click event                          |
| `mounted` | `Function`          | Triggered after the component is mounted       |
| `tooltip` | `String`            | Tooltip text for the component                 |

## Init

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

## Add

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

## Remove

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
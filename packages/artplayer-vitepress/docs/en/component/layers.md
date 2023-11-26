# Layer

## Configuration

| Property  | Type                  | Description                  |
| --------- | --------------------- | ---------------------------- |
| `disable` | `Boolean`             | Whether to disable the component |
| `name`    | `String`              | Unique name of the component, used for marking class name |
| `index`   | `Number`              | Component index, used for display priority |
| `html`    | `String`, `Element`   | The DOM element of the component |
| `style`   | `Object`              | Style object for the component |
| `click`   | `Function`            | Click event for the component |
| `mounted` | `Function`            | Triggered after the component is mounted |
| `tooltip` | `String` | Tooltip text for the component |

## Creation

<div className="run-code">▶ Run Code</div>

```js{5-22}
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            name: 'poster',
            html: `<img style="width: 100px" src="${img}">`,
            tooltip: 'Poster Tip',
            style: {
                position: 'absolute',
                top: '50px',
                right: '50px',
            },
            click: function (...args) {
                console.info('click', args);
            },
            mounted: function (...args) {
                console.info('mounted', args);
            },
        },
    ],
});

// Get the Element of layer by name
console.info(art.layers['poster']);
```
## Add

<div className="run-code">▶ Run Code</div>

```js{7-22}
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.layers.add({
    name: 'poster',
    html: `<img style="width: 100px" src="${img}">`,
    tooltip: 'Poster Tip',
    style: {
        position: 'absolute',
        top: '50px',
        right: '50px',
    },
    click: function (...args) {
        console.info('click', args);
    },
    mounted: function (...args) {
        console.info('mounted', args);
    },
});

// Get the Element of layer by name
console.info(art.layers['poster']);
```
## Delete

<div className="run-code">▶ Run Code</div>

```js{21}
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            name: 'poster',
            html: `<img style="width: 100px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '50px',
                right: '50px',
            },
        },
    ],
});

art.on('ready', () => {
    setTimeout(() => {
        // Delete the layer by name
        art.layers.remove('poster');
    }, 3000);
});
```
## Update

<div className="run-code">▶ Run Code</div>

```js{21-29}
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            name: 'poster',
            html: `<img style="width: 100px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '50px',
                right: '50px',
            },
        },
    ],
});

art.on('ready', () => {
    setTimeout(() => {
        // Update the layer by name
        art.layers.update({
            name: 'poster',
            html: `<img style="width: 200px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '50px',
                left: '50px',
            },
        });
    }, 3000);
});
```
# Layer

## Configuration

| Property  | Type                | Description                          |
| --------- | ------------------- | ------------------------------------ |
| `disable` | `Boolean`           | Whether to disable the component     |
| `name`    | `String`            | Unique component name for CSS class  |
| `index`   | `Number`            | Component index for display priority |
| `html`    | `String`, `Element` | Component DOM element                |
| `style`   | `Object`            | Component style object               |
| `click`   | `Function`          | Component click event                |
| `mounted` | `Function`          | Triggered after component mount      |
| `tooltip` | `String`            | Component tooltip text               |

## Creation

<div className="run-code">▶ Run Code</div>

```js{5-22}
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            name: 'potser',
            html: `<img style="width: 100px" src="${img}">`,
            tooltip: 'Potser Tip',
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
console.info(art.layers['potser']);
```

## Addition

<div className="run-code">▶ Run Code</div>

```js{7-22}
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.layers.add({
    name: 'potser',
    html: `<img style="width: 100px" src="${img}">`,
    tooltip: 'Potser Tip',
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
console.info(art.layers['potser']);
```

## Removal

<div className="run-code">▶ Run Code</div>

```js{21}
var img = '/assets/sample/layer.png';
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    layers: [
        {
            name: 'potser',
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
        art.layers.remove('potser');
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
            name: 'potser',
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
            name: 'potser',
            html: `<img style="width: 200px" src="${img}">`,
            style: {
                position: 'absolute',
                top: '50px',
                left: '50px',
            },
        });
    }, 3000);
});
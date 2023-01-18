# Component

The component configuration mentioned here mainly refers to three common configurations: `layers`, `controls` and `contextmenu`:

| Property  | Type                | Describe                                           |
| --------- | ------------------- | -------------------------------------------------- |
| `disable` | `Boolean`           | Whether to disable components                      |
| `name`    | `String`            | Component unique name, used to mark the class name |
| `index`   | `Number`            | Component index, used to display the priority of   |
| `html`    | `String`, `Element` | DOM element of component                           |
| `style`   | `Object`            | Component Style Object                             |
| `click`   | `Function`          | Component click event                              |
| `mounted` | `Function`          | Triggered after the component is mounted           |
| `tooltip` | `String`            | Prompt text for component                          |

:::warning Tip

- The current component can only be added, not destroyed
- Use the 'name' option to quickly obtain the 'DOM' element of a component
- The order in which components appear can be controlled through the 'index' option

:::

## `layers`

Add a layer during instantiation, such as `logo` or `advertisement`

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

console.info(art.layers.potser);
```

You can also add a layer after instantiation

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

console.info(art.layers.potser);
```

## `controls`

Add a control during instantiation

:::warning There are three additional options for controls

- `position`: `left` and `right` positions of control controller
- `selector`: Object array of selection list
- `onSelect`: Function triggered when an element of the selection list is clicked

:::

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

console.info(art.controls['your-button']);
console.info(art.controls.subtitle);
```

You can also add a control after instantiation

```js{6-22}
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

console.info(art.controls.button1);
```

## `contextmenu`

Add a contextmenu during instantiation

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

console.info(art.contextmenu['your-menu']);
```

You can also add a contextmenu after instantiation

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

console.info(art.contextmenu['your-menu']);
```
# Layers

## Configuration

| Property  | Type                | Description                          |
| --------- | ------------------- | ------------------------------------ |
| `disable` | `Boolean`           | Whether to disable the component     |
| `name`    | `String`            | Unique component name for CSS class  |
| `index`   | `Number`            | Component index for display priority |
| `html`    | `String`, `Element`, `Number` | Component DOM element                |
| `style`   | `Object`            | Component style object               |
| `click`   | `Function`          | Component click event                |
| `mounted` | `Function`          | Triggered after component mount      |
| `beforeUnmount` | `Function` | Hook before explicit remove/update |
| `tooltip` | `String`, `Number`            | Component tooltip text               |

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
```

## Shared component behavior {#component-contract}

This section applies to layers, controls and contextmenu. The setting panel has its own API.

- add accepts an option object or a synchronous (art) => option factory. The factory receives the player; do not rely on its this. A truthy disable skips creation, rather than disabling an existing node. Options are retained and may be mutated: falsy html, including numeric 0, is normalized to an empty string.
- Names are unique within a manager. Duplicate add and remove of a missing name throw; update of a missing name calls add. Omitted names use the manager name and incrementing id. A name also becomes a node property on the manager: avoid existing members such as add, cache and show.
- index inserts in ascending order within one parent. A new equal-index entry precedes the old one. Zero and omitted index use the incrementing id, rather than forcing first position. Different control positions have separate ordering.
- html strings are parsed as HTML; use trusted content. An HTMLElement is moved rather than cloned. Nonzero numeric content is accepted. style assigns node styles directly; tooltip accepts strings or numbers, with falsy values omitted.
- click receives the component manager and native event, not the individual node. Its this is the player; preventDefault runs before the callback, but stopPropagation is not automatic. mounted and beforeUnmount also receive the player as this and the node as their argument. Ordinary component callback results are ignored; Promises are not awaited.
- mounted runs synchronously after insertion and cache/name registration. beforeUnmount runs before explicit remove or update removes the old node; if it throws, the old entry remains. Player destruction releases managed resources but does not call this hook for every entry. Own subscriptions and timers need a separate idempotent cleanup function connected to both the component hook and player destroy.
- update shallow-merges into the original option object by name, then removes and adds the entry. It replaces DOM, reruns mounted and invalidates old node references. Nested objects such as style are not deeply merged. beforeUnmount sees the merged options, including a newly supplied hook. Failed replacement does not transactionally restore the old node.

layers.add/update and contextmenu.add/update return the new HTMLDivElement, or possibly undefined when disabled or closing. controls.add/update retain their historical undefined result. add/remove/update are bound and can be extracted; toggle requires its manager receiver.

show controls the manager's CSS state; toggle inverts it. Every show assignment emits layer, control or contextmenu, even if the boolean state is unchanged; it does not remove entries. art references the player, name is layer/control/contextmenu, $parent is the current insertion parent, and id is an incrementing counter. cache is a Map keyed by name, with $ref, an events cleanup array and the original option. Observe these fields rather than mutating them to bypass lifecycle methods.

The layer parent is template.$layer; generated classes are art-layer and art-layer-NAME. Root types retain the historical Component/ComponentOption/Selector shapes, adding numeric content through ComponentInput overloads. The unpublished refactor's artplayer/runtime exports accurate Component, Controls, `ComponentInput<Host>` and callback/return types. Infer cache-entry shapes from the instance; the internal ComponentEntry declaration is not a named export of that entry.

## TypeScript component example

```ts
import Artplayer from 'artplayer/runtime';

const art = new Artplayer({ container: '#player', url: '/video.mp4' });
const element: HTMLDivElement | undefined = art.layers.add({
    name: 'counter', html: 1,
    click(manager, event) { console.log(this === art, manager.name, event.type); },
});
if (element) {
    art.layers.update({ name: 'counter', html: 2 });
    art.layers.remove('counter');
}
```

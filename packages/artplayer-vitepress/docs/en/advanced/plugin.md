# Writing Plugins

Once you are familiar with the player's properties, methods, and events, you can write a plugin.

## Registration and lifecycle {#plugin-contract}

The `plugins` option accepts factory functions. A factory receives the player as its only argument and, for ordinary functions, as `this`; arrow functions retain their lexical `this`. A configurable plugin usually returns this factory from an outer call, such as `plugins: [adsPlugin(options)]`. The returned object is stored directly, without cloning.

A synchronous factory is registered before `add` returns, and `art.plugins.add(factory)` returns the registry itself. Only a `Promise` from the player's JavaScript realm is awaited; the returned Promise then fulfills with the registry, not the plugin result. Plain thenables and promises from another window remain synchronous results. To wait for an asynchronous plugin, call `await art.plugins.add(factory)` after construction, then read its named result.

Factories in the constructor option start in array order without waiting for earlier asynchronous factories. Player `ready` does not wait for them either. During these factory calls, `art.plugins` has not yet been assigned, so a factory must not use it to access an earlier plugin. Synchronous errors fail construction or the direct `add` call. Callers handle rejections from direct `add`; rejections from constructor registrations are logged as warnings.

The name is the first truthy value among the result's `name`, the factory's function name, and `plugin` followed by the current registration counter. An anonymous asynchronous factory uses the counter at completion, so return a stable string name explicitly. `id` increments before invoking a factory, including failed attempts and built-in registrations. `art` references the host. The low-level `next(factory, result)` submits a result directly: it does not invoke the factory, increment the counter, or await promises. Normal plugins do not need it.

Results are stored as non-writable, non-configurable, non-enumerable own properties. `Object.keys(art.plugins)` therefore does not list plugins; duplicate names throw. Avoid registry member names such as `art`, `id`, `add`, and `next`; a name matching a prototype method can shadow it. There is no generic remove/replace operation or automatic call to a result's `destroy` method.

Listen for the player's `destroy` event to release requests, timers, workers, and external resources. An asynchronous factory should register cleanup before its first wait and check for destruction after waiting. Late results are neither registered nor automatically cleaned up. An already pending `add` retains its original Promise and fulfills with the registry if the factory succeeds. New calls during or after destruction throw before invoking the factory.

## TypeScript {#plugin-types}

The root entry retains the historical Promise return declaration for `Plugins.add`; this does not make synchronous execution asynchronous. `PluginRegistration` from `artplayer/runtime` distinguishes the registry from a Promise according to the factory return type, preserving their union for `unknown`. TypeScript cannot determine a Promise's realm; the runtime rules above still apply.

Module augmentation describes a result without installing a plugin. The accurate entry's `Plugins` also carries named augmentations from the root entry. The constructor option's `PluginFactory` uses the construction-phase `PluginHost`, rather than assuming the player is already fully initialized. A post-construction `add` can use the complete player.

```ts
import Artplayer from 'artplayer/runtime';
import type { Plugins } from 'artplayer/runtime';

declare module 'artplayer/runtime' {
    interface Plugins {
        exampleCounter: { name: string; value: number };
    }
}

const art = new Artplayer({ container: '.artplayer-app', url: '/assets/sample/video.mp4' });
const registry: Plugins = art.plugins.add(function (host) {
    const samePlayer: boolean = this === host;
    return { name: 'exampleCounter', value: samePlayer ? 1 : 0 };
});
const value: number = registry.exampleCounter.value;
const pending: Promise<Plugins> = art.plugins.add(async () => ({ name: 'exampleAsync' }));
void pending.catch(console.error);
void value;
```

## Examples

You can load a plugin function during instantiation.

<div className="run-code">▶ Run Code</div>

```js{15}
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

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [myPlugin],
});

art.on('ready', () => {
    console.info(art.plugins.myPlugin);
});
```

You can also load a plugin function after instantiation.

<div className="run-code">▶ Run Code</div>

```js{17}
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

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

art.plugins.add(myPlugin);

art.on('ready', () => {
    console.info(art.plugins.myPlugin);
});
```

For example, let's say I want to write a plugin that displays an image ad when the video is paused.

<div className="run-code">▶ Run Code</div>

```js
function adsPlugin(option) {
    return (art) => {
        art.layers.add({
            name: 'ads',
            html: `<img style="width: 100px" src="${option.url}">`,
            style: {
                display: 'none',
                position: 'absolute',
                top: '20px',
                right: '20px',
            },
        });

        function show() {
            art.layers.ads.style.display = 'block';
        }

        function hide() {
            art.layers.ads.style.display = 'none';
        }

        art.controls.add({
            name: 'hide-ads',
            position: 'right',
            html: 'Hide Ads',
            tooltip: 'Hide Ads',
            click: hide,
            style: {
                marginRight: '20px'
            }
        });

        art.controls.add({
            name: 'show-ads',
            position: 'right',
            html: 'Show Ads',
            tooltip: 'Show Ads',
            click: show,
        });

        art.on('play', hide);
        art.on('pause', show);

        return {
            name: 'adsPlugin',
            show,
            hide
        };
    }
}

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        adsPlugin({
            url: '/assets/sample/layer.png'
        })
    ],
});
```

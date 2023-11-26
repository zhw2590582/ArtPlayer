# Writing Plugins

Once you know the player's `properties`, `methods`, and `events`, writing plugins is very simple.

You can load the plugin functions when instantiated.

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
Here's the translation of the provided text into English while preserving the Markdown formatting:

A function that allows loading plugins after instantiation

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

For example, I want to write a plugin that displays an image advertisement after the video is paused.
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
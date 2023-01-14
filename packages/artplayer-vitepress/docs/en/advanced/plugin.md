# 编写插件

但你已经知道播放器的`属性`, `方法`和`事件`后，再编写插件是非常简单的事

可以在实例化的时候加载插件的函数

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

可以在实例化之后再加载插件的函数

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

例如我想写一个在视频暂停后，显示一个图片广告的插件

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
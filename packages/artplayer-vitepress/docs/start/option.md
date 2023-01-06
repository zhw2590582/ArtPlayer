## container

-   类型: `String、Element`
-   默认: `#artplayer`
-   必填: `是`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    // container: document.querySelector('.artplayer-app'),
    url: '/assets/sample/video.mp4',
});
```

您可能需要初始化容器元素的大小，如:

```css
.artplayer-app {
    width: 400px;
    height: 300px;
}
```

## url

-   类型: `String`
-   默认: `''`

视频源地址，默认支持三种视频文件格式：`.mp4`、`.ogg`、`.webm`

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});
```

## id

## Ready Callback

-   类型: `Function`
-   默认: `undefined`

构造函数接受一个函数作为第二个参数，播放器初始化成功且视频可以播放时触发，和`ready`事件一样

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer(
    {
        container: '.artplayer-app',
        url: '/assets/sample/video.mp4',
        muted: true,
    },
    function () {
        this.play();
    },
);
```

:::tip 提示

回调函数里的`this`就是播放器实例，但回调函数假如使用了箭头函数，`this`则不会指向播放器实例

:::
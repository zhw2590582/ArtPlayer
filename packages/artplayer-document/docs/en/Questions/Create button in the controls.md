---
title: 在控制栏添加按钮
sidebar_position: 2
---

有时你需要在控制栏添加按钮，如开关按钮或者单选按钮等等，你甚至可以使用第三方的样式库如 `bootstrap`

<div className="run-code">▶ Run Code</div>

```js
var time = 0;
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            position: 'right',
            html: '<button type="button">Click Me!</button>',
            click: function (_, event) {
                // 第二个参数是事件对象
                time += 1;
                event.target.innerText = 'You Click ' + time;
            },
        },
    ],
});
```

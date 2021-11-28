---
title: 在控制栏添加列表
sidebar_position: 1
---

有时你需要在控制栏添加列表，那么你可以在添加控件的时候使用 `selector` 和 `onSelect` 属性

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    controls: [
        {
            position: 'right',
            html: 'Subtitle 01',
            selector: [
                {
                    default: true,
                    html: '<span style="color:red">Subtitle 01</span>',
                    url: '/assets/sample/subtitle.srt?id=1',
                },
                {
                    html: '<span style="color:yellow">Subtitle 02</span>',
                    url: '/assets/sample/subtitle.srt?id=2',
                },
            ],
            onSelect: function (item, $dom) {
                art.subtitle.switch(item.url, {
                    name: $dom.innerText,
                });

                return '你点击了 ' + item.html;
            },
        },
    ],
});
```

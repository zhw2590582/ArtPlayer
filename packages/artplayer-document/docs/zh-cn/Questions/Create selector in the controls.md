---
title: 在控制栏添加列表
sidebar_position: 1
---

有时你需要在控制栏自定义下拉列表，那么你可以在添加控件的时候使用 `selector` 和 `onSelect` 属性

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
                    html: '<span>Subtitle 01</span>',
                    url: '/assets/sample/subtitle.srt?id=1',
                },
                {
                    html: '<span>Subtitle 02</span>',
                    url: '/assets/sample/subtitle.srt?id=2',
                },
            ],
            onSelect: function (item) {
                art.subtitle.switch(item.url, {
                    name: item.html,
                });

                // 你可以返回一个字符串，用于替换被选择的文案
                return '你点击了' + item.html;
            },
        },
    ],
});
```

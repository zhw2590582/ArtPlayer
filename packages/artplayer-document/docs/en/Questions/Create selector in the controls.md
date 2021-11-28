---
title: Add select in the controls
sidebar_position: 1
---

Sometimes you need to add a list in the controls, then you can use the `selector` and `onSelect` attribute when adding controls

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

                return 'You click ' + item.html;
            },
        },
    ],
});
```

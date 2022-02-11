---
title: 怎么添加设置面板
sidebar_position: 6
---

设置面板类似于列表选择的集合，而且支持多层嵌套

### 切换字幕

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    settings: [
        {
            html: 'Subtitle',
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
                console.info(item, $dom);

                art.subtitle.url = item.url;
                
                return '你点击了 ' + item.html;
            },
        },
    ],
});
```
---
title: 怎么添加设置面板
sidebar_position: 6
---

设置面板类似于列表选择的集合，而且支持多层嵌套

| 属性       | 类型                | 描述            |
| ---------- | ------------------- | --------------- |
| `html`     | `String`、`Element` | 元素的 DOM 元素 |
| `icon`     | `String`、`Element` | 元素的图标      |
| `selector` | `Array`             | 元素列表        |
| `onSelect` | `Function`          | 元素点击事件    |
| `width`    | `Number`            | 列表宽度        |
| `default`  | `Boolean`           | 是否默认选中    |

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
            html: '选择字幕',
            width: 250,
            selector: [
                {
                    default: true,
                    html: '<span style="color:red">Subtitle 01</span>',
                    url: '/assets/sample/subtitle.srt?id=1',
                    onSelect: onSubtitleSelect,
                },
                {
                    html: '<span style="color:yellow">Subtitle 02</span>',
                    url: '/assets/sample/subtitle.srt?id=2',
                    onSelect: onSubtitleSelect,
                },
            ],
            
        },
        {
            html: '选择画质',
            width: 150,
            selector: [
                {
                    default: true,
                    html: '1080P',
                    url: '/assets/sample/video.mp4?id=1080',
                    onSelect: onQualitySelect,
                },
                {
                    html: '720P',
                    url: '/assets/sample/video.mp4?id=720',
                    onSelect: onQualitySelect,
                },
                {
                    html: '360P',
                    url: '/assets/sample/video.mp4?id=360',
                    onSelect: onQualitySelect,
                },
            ],
        },
        {
            html: '多层嵌套',
            selector: [
                {
                    html: '嵌套01',
                    selector: [
                        {
                            html: '嵌套02',
                        },
                        {
                            html: '嵌套02',
                        },
                    ],
                },
                {
                    html: '嵌套01',
                    selector: [
                        {
                            html: '嵌套02',
                        },
                        {
                            html: '嵌套02',
                        },
                    ],
                },
            ],
        },
    ],
});

function onSubtitleSelect(item, $dom) {
    console.info(item, $dom);
    art.subtitle.url = item.url;
}

function onQualitySelect(item, $dom) {
    console.info(item, $dom);
    art.switchQuality(item.url, item.html);
}
```
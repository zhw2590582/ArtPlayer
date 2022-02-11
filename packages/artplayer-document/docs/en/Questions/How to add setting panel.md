---
title: How to add setting panel
sidebar_position: 6
---

Settings panels are similar to a collection of list selections, and support multi-layer nested

| Property   | Type                | Description              |
| ---------- | ------------------- | ------------------------ |
| `html`     | `String`、`Element` | DOM elements of selector |
| `icon`     | `String`、`Element` | Icon of selector         |
| `selector` | `Array`             | Selector List            |
| `onSelect` | `Function`          | Selector Click event     |
| `width`    | `Number`            | Panel width              |
| `default`  | `Boolean`           | Default selected         |

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
            html: 'Select Subtitle',
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
            html: 'Select Quality',
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
            html: 'Multi-layer nested',
            selector: [
                {
                    html: 'Nested 01',
                    selector: [
                        {
                            html: 'Nested 02',
                        },
                        {
                            html: 'Nested 02',
                        },
                    ],
                },
                {
                    html: 'Nested 01',
                    selector: [
                        {
                            html: 'Nested 02',
                        },
                        {
                            html: 'Nested 02',
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
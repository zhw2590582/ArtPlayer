# 设置面板

You need to open the settings panel first. The player has four settings by default: `flip`, `playbackRate`, `aspectRatio`, `subtitleOffset`

<div className="run-code">▶ Run Code</div>

```js{4}
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
	setting: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    subtitleOffset: true,
});
```

## Selection list

| Property   | Type                | Describe            |
| ---------- | ------------------- | ------------------- |
| `html`     | `String`, `Element` | DOM of element      |
| `icon`     | `String`, `Element` | Icon of element     |
| `selector` | `Array`             | Element list        |
| `onSelect` | `Function`          | Element click event |
| `width`    | `Number`            | List width          |
| `tooltip`  | `String`            | Prompt text         |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Subtitle',
            width: 250,
            tooltip: 'Subtitle 01',
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
            onSelect: function (item, $dom, event) {
                console.info(item, $dom, event);
                art.subtitle.url = item.url;
                return item.html;
            },
        },
        {
            html: 'Quality',
            width: 150,
            tooltip: '1080P',
            selector: [
                {
                    default: true,
                    html: '1080P',
                    url: '/assets/sample/video.mp4?id=1080',
                },
                {
                    html: '720P',
                    url: '/assets/sample/video.mp4?id=720',
                },
                {
                    html: '360P',
                    url: '/assets/sample/video.mp4?id=360',
                },
            ],
            onSelect: function (item, $dom, event) {
                console.info(item, $dom, event);
                art.switchQuality(item.url, item.html);
                return item.html;
            },
        },
    ],
});
```

## List nesting

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Multi-level',
            selector: [
                {
                    html: 'Setting 01',
                    width: 150,
                    selector: [
                        {
                            html: 'Setting 01 - 01',
                        },
                        {
                            html: 'Setting 01 - 02',
                        },
                    ],
                    onSelect: function (item, $dom, event) {
                        console.info(item, $dom, event);
                        return item.html;
                    },
                },
                {
                    html: 'Setting 02',
                    width: 150,
                    selector: [
                        {
                            html: 'Setting 02 - 01',
                        },
                        {
                            html: 'Setting 02 - 02',
                        },
                    ],
                    onSelect: function (item, $dom, event) {
                        console.info(item, $dom, event);
                        return item.html;
                    },
                },
            ],
        },
    ],
});
```

## Toggle button

| Property   | Type                | Describe               |
| ---------- | ------------------- | ---------------------- |
| `html`     | `String`, `Element` | DOM of element         |
| `icon`     | `String`, `Element` | Icon of element        |
| `switch`   | `Boolean`           | Button default state   |
| `onSwitch` | `Function`          | Button switching event |
| `tooltip`  | `String`            | Prompt text            |

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'PIP Mode',
            tooltip: 'Close',
            icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
            switch: false,
            onSwitch: function (item, $dom, event) {
                console.info(item, $dom, event);
                const nextState = !item.switch;
                art.pip = nextState;
                item.tooltip = nextState ? 'Open' : 'Close';
                return nextState;
            },
        },
    ],
});
```

## Range Slider

| Property   | Type                | Describe                       |
| ---------- | ------------------- | ------------------------------ |
| `html`     | `String`, `Element` | DOM of element                 |
| `icon`     | `String`, `Element` | Icon of element                |
| `range`    | `Array`             | Default state array            |
| `onRange`  | `Function`          | Event triggered on completion  |
| `onChange` | `Function`          | Events triggered when changing |
| `tooltip`  | `String`            | Prompt text                    |

```js
const range = [5, 1, 10, 1];
const value = range[0];
const min = range[1];
const max = range[2];
const step = range[3];
```

<div className="run-code">▶ Run Code</div>

```js
var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    setting: true,
    settings: [
        {
            html: 'Slider',
            tooltip: '5x',
            icon: '<img width="22" heigth="22" src="/assets/img/state.svg">',
            range: [5, 1, 10, 1],
            onChange: function (item, $dom, event) {
                console.info(item, $dom, event);
                return item.range + 'x';
            },
        },
    ],
});
```

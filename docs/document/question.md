## Create selector in the controls

Sometimes you need to customize the behavior of the selector, then you can add `selector` and `onSelect` properties when adding a control. At the same time, you can also perform custom operations by listening to the `selector` event

[Run Code](/Question.selector)

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
                    name: 'Subtitle 01',
                    url: '/assets/sample/subtitle.srt?id=1',
                },
                {
                    name: 'Subtitle 02',
                    url: '/assets/sample/subtitle.srt?id=2',
                },
            ],
            onSelect: function (item) {
                art.subtitle.switch(item.url, item.name);
            },
        },
    ],
});

art.on('selector', function (item) {
    console.info(item);
});
```

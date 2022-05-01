---
title: Add button to the controls
sidebar_position: 2
---

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
                // The second parameter is an event object
                time += 1;
                event.target.innerText = 'You Click ' + time;
            },
        },
    ],
});
```

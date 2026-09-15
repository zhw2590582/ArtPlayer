# artplayer-tool-thumbnail

Thumbnail tool for ArtPlayer

Implementation and migration notes: [ARCHITECTURE.md](./ARCHITECTURE.md).

The default constructor preserves published 3.5.31 behavior: fixed `height: 90`,
`delay: 300` before the video event and each frame, and twice that delay before
completion. Numeric height/delay values are clamped to 10-1000. File selection
retains the input value. Existing methods, including `creatCanvas` and
`creatScreenshotDate`, retain their names.

Consumers of the unpublished 4.4 workspace behavior should select it explicitly:

```js
const tool = new ArtplayerToolThumbnail({
  fileInput: document.querySelector('input[type=file]'),
  compatibility: 'workspace-4.4',
})
```

This mode calculates height from the video aspect ratio, emits `video` synchronously,
has no fixed extraction delays and clears the file input value. Class-level
`DEFAULTS` always describes the published policy, including `delay`; it does not
vary by instance. Both modes wait for frame readiness and cancel owned work on
source replacement or destruction.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=./uncompiled/artplayer-tool-thumbnail/index.js&example=tool.thumbnail)

## License

MIT © Harvey Zhao

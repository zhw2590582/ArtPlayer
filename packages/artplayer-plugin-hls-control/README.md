# artplayer-plugin-hls-control

Implementation boundaries and regression commands are documented in [ARCHITECTURE.md](ARCHITECTURE.md).

Hls control plugin for ArtPlayer

Usage, SDK ownership, configuration and TypeScript examples:
[English guide](../artplayer-vitepress/docs/en/plugin/hls-control.md) /
[中文指南](../artplayer-vitepress/docs/plugin/hls-control.md).
The guides describe this refactor branch; its fixes have not yet been published.

## Demo

[https://artplayer.org](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js%0A./uncompiled/artplayer-plugin-hls-control/index.js&example=hls.control)

Installed declaration regression: run
`yarn test:package --include=artplayer-plugin-hls-control` from the repository root.
The isolated tarball consumer checks root/legacy imports, extracted option types,
custom track generics, formatter arguments and invalid calls in five compiler
modes using `test/types/hls-control.ts`. See
[consumer maintenance](../../scripts/consumers/README.md); real HLS playback and
SDK combinations remain separate validation gates.

## License

MIT © Harvey Zhao

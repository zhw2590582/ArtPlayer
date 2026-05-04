# AGENTS.md

## Project Summary

ArtPlayer is a monorepo for a modern HTML5 video player and its ecosystem packages.

- Homepage: `https://artplayer.org`
- Local dev site: `http://localhost:8082`
- API docs: `https://artplayer.org/document`
- Packaging model: workspace monorepo with per-package versioning and per-package build output

The repository contains:

- `packages/artplayer`: the core player
- `packages/artplayer-plugin-*`: UI and playback plugins
- `packages/artplayer-proxy-*`: proxy renderers and playback adapters
- `packages/artplayer-tool-*`: helper tools
- `packages/artplayer-vitepress`: docs site package
- `docs/`: local demo site, examples, compiled assets, generated docs
- `scripts/`: custom build/dev/doc tooling

## Working Style For This Repo

- Verify the real implementation before editing docs or examples.
- Prefer changing the source package first, then regenerate build artifacts only when needed.
- Keep package APIs small and consistent with existing ArtPlayer plugin conventions.
- Preserve the existing visual and API style of sibling packages instead of inventing a new pattern.
- When touching demo examples, make sure the example still works in `http://localhost:8082`.
- Do not hand-edit `dist/`, `docs/compiled/`, or `docs/uncompiled/` unless a build step generated them.

## Primary Commands

Use the repo scripts rather than ad hoc bundler commands.

### Development

```bash
npm run dev
```

Starts the local dev site on port `8082` and interactively selects a package to watch. The selected package is built into:

- `docs/uncompiled/<package>/`

### Production Build

```bash
npm run build
```

Interactive build for one package. Outputs:

- `packages/<name>/dist/*.js|*.legacy.js|*.mjs`
- copied artifacts into `docs/compiled/`

Build all packages:

```bash
npm run build all
```

### Other Project Scripts

```bash
npm run build:i18n
npm run build:ts
npm run build:docs
npm run build:llm
npm run build:test
npm run lint
npm run build:all
```

Notes:

- `npm run lint` targets package source/types plus scripts and TypeScript demo assets.
- `npm run build:all` is expensive; use it when a change truly spans builds/docs/types/lint together.

## Useful Local URLs

- Root demo index: `http://localhost:8082`
- Demo by package/example:
  - `http://localhost:8082/?libs=./uncompiled/<package>/index.js&example=<example>`
- Docs: `http://localhost:8082/document/`

For proxy/plugin work, prefer validating on the local demo page rather than reasoning only from source.

## Repository Layout

### Core package

- `packages/artplayer/src/index.js`: player entry
- `packages/artplayer/src/player/`: playback mixins and player-facing behavior
- `packages/artplayer/src/control/`: bottom controls
- `packages/artplayer/src/setting/`: settings panel
- `packages/artplayer/src/contextmenu/`: context menu items
- `packages/artplayer/src/plugins/`: built-in plugins
- `packages/artplayer/src/utils/`: shared helpers, component base classes, DOM utilities
- `packages/artplayer/types/`: public TS declarations

### Ecosystem packages

Most ecosystem packages follow this pattern:

```text
packages/<package>/
  src/index.js
  src/*.less        # optional
  types/*.d.ts      # optional but preferred for public APIs
  README.md
  package.json
  dist/*
```

### Demo and docs assets

- `docs/assets/example/*.js`: runnable browser examples
- `docs/assets/ts/*.js`: TypeScript demo assets targeted by lint/docs flows
- `docs/uncompiled/`: dev output
- `docs/compiled/`: production-copied output
- `docs/document/`: generated docs content

## Architecture Notes

### Core player

ArtPlayer composes many subsystems during construction. Common integration points:

- `art.template`
- `art.events`
- `art.controls`
- `art.setting`
- `art.contextmenu`
- `art.layers`
- `art.plugins`
- `art.player`

When extending behavior, prefer integrating with these existing systems rather than bypassing them.

### Control and setting components

Controls and setting entries are managed through component registries.

Relevant implementation:

- `packages/artplayer/src/control/index.js`
- `packages/artplayer/src/setting/index.js`
- `packages/artplayer/src/utils/component.js`

Important behavior:

- `art.controls.update(...)` and `art.setting.update(...)` replace existing entries by `name`
- `art.controls.remove(name)` and `art.setting.remove(name)` are the correct cleanup APIs
- selector-style controls rely on `default` flags to determine highlighted items

If a plugin conditionally shows UI, it must also clean that UI up when the condition no longer holds.

### Plugin shape

Standard plugin/export shape:

```js
export default function somePlugin(option = {}) {
  return (art) => {
    return {
      name: 'somePlugin',
    }
  }
}
```

Naming conventions:

- package: `artplayer-plugin-<name>`
- global: `artplayerPlugin<Name>`
- exported function name should match the global naming convention

### Proxy packages

Proxy packages usually return a non-video element or video-like shim and emulate media element behavior for ArtPlayer.

Examples:

- `packages/artplayer-proxy-canvas`
- `packages/artplayer-proxy-mediabunny`

When editing proxy packages:

- keep the HTMLMediaElement-like surface coherent
- keep event ordering stable
- treat `loadedmetadata`, `loadeddata`, `canplay`, `seeked`, `waiting`, and `pause/play` semantics carefully
- ensure UI state is updated and cleaned up when source topology changes

### HLS / adaptive playback controls

The reference implementation for adaptive selector UI is:

- `packages/artplayer-plugin-hls-control/src/index.js`

If adding HLS-like quality/audio selection elsewhere:

- follow the selector format used there
- derive highlighted items from actual current tracks, not only from mode flags
- avoid stale selectors when changing to streams without the same topology

## Build and Artifact Rules

- Always edit `src/` and `types/` first.
- Rebuild package artifacts after source changes that should ship.
- Do not treat `dist/` as source of truth.
- If a change affects demo behavior, also verify the matching file in `docs/assets/example/`.

For package-specific builds, the normal flow is:

1. `npm run dev` and pick the package for fast local iteration
2. validate in `http://localhost:8082`
3. `npm run build` and pick the package when ready to update shippable artifacts

## Documentation Expectations

If a public package API changes, check whether these also need updates:

- the package `README.md`
- `docs/assets/example/<name>.js`
- `types/<name>.d.ts`
- any generated compiled outputs if you built the package

Keep examples realistic and runnable. Prefer local demo URLs or stable public sample streams.

## Code Quality Expectations

- Follow existing plain JavaScript style in the repo.
- Use ASCII unless a file already requires otherwise.
- Match the minimal-comment style of neighboring files.
- Avoid unnecessary abstraction; this codebase generally prefers direct implementation.
- Respect current browser targets:
  - modern build: `es2020`
  - legacy build: `es2015`

## Validation Checklist

For most package changes, validate as many of these as apply:

- source file lint passes
- local demo page loads
- expected events fire once and in the correct order
- controls/settings render correctly
- cleanup works after restart, source switch, or destroy
- package build succeeds

For playback/proxy changes specifically:

- test initial load
- test play/pause
- test seek
- test switching source or track topology
- test whether UI reflects the actual selected track/quality

## Notes Specific To `artplayer-proxy-mediabunny`

This package now depends on modern `mediabunny` and supports HLS through `mediabunny` input handling.

Files to understand first:

- `packages/artplayer-proxy-mediabunny/src/index.js`
- `packages/artplayer-proxy-mediabunny/src/VideoShim.js`
- `packages/artplayer-proxy-mediabunny/src/MediaBunnyEngine.js`
- `packages/artplayer-proxy-mediabunny/src/input.js`
- `packages/artplayer-proxy-mediabunny/src/m3u8.js`

Key expectations:

- HLS source detection should happen in `input.js`
- track selection should use actual pairable audio/video relationships
- selector UI should mirror the behavior of `artplayer-plugin-hls-control`
- selector cleanup is required when a later source no longer supports the same controls
- avoid duplicate readiness events during load and track switches

## When Unsure

Start with the nearest sibling implementation instead of inventing a new pattern:

- control/setting UI: `artplayer-plugin-hls-control`, `artplayer-plugin-dash-control`
- proxy behavior: `artplayer-proxy-canvas`, `artplayer-proxy-mediabunny`
- component lifecycle: `packages/artplayer/src/utils/component.js`

If a change spans source, examples, and packaging, make all three consistent in the same pass.

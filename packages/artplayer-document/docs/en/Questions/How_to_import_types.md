---
title: How to import types
sidebar_position: 4
---

Sometimes you lose `TypeScript` syntax prompt, then you can import types manually


```js
/**
 * @typedef { import("artplayer/types/artplayer") } Artplayer
 */

/**
 * @type {Artplayer} - An Artplayer instance.
 */
const art1 = {};

/**
 * @param {Artplayer}  art2 - An Artplayer instance.
 */
function getInstance(art2) {
  //
}
```
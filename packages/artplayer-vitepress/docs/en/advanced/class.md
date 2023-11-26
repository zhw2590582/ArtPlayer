# Static Properties

Here, `Static Properties` refer to the `first-level properties` mounted on the `constructor`, which are very rarely used.

## `instances`

Returns an array of all player instances. You can use this property when you want to manage multiple players at the same time.

<div className="run-code">▶ Run Code</div>

```js
console.info([...Artplayer.instances]);

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
});

console.info([...Artplayer.instances]);
```

## `version`

Returns the version information of the player.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.version);
```

## `env`

Returns the environment variables of the player.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.env);
```

## `build`

Returns the build time of the player

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.build);
```

## `config`

Returns the default configuration of the video

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.config);
```

## `utils`

Returns a collection of utility functions for the player

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.utils);
```

:::warning For the full list of utility functions, please refer to the following address:

[artplayer/types/utils.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/utils.d.ts)

:::

## `scheme`

Returns the validation scheme for the player options

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.scheme);
```

## `Emitter`

Returns the constructor for the event dispatcher

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.Emitter);
```

## `validator`

Returns the validation function for options

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.validator);
```

## `kindOf`

Returns the function tool for type checking

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.kindOf);
```

## `html`

Returns the `html` string required for the player

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.html);
```

## `option`

Returns the player's default options

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.option);
```
# Static Properties

Here, `Static Properties` refer to the `top-level properties` mounted on the `constructor function`, which are very rarely used.

## `instances`

Returns an array of all player instances. This property can be useful when you need to manage multiple player instances simultaneously.

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

Returns the build time of the player.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.build);
```

## `config`

Returns the default configuration for videos.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.config);
```

## `utils`

Returns the collection of utility functions for the player.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.utils);
```

:::warning For all utility functions, please refer to the following address:

[artplayer/types/utils.d.ts](https://github.com/zhw2590582/ArtPlayer/blob/master/packages/artplayer/types/utils.d.ts)

:::

## `scheme`

Returns the validation schema for player options.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.scheme);
```

## `Emitter`

Returns the constructor function for the event emitter.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.Emitter);
```

## `validator`

Returns the validation function for options.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.validator);
```

## `kindOf`

Returns the utility function for type detection.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.kindOf);
```

## `html`

Returns the `html` string required by the player.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.html);
```

## `option`

Returns the default options for the player.

<div className="run-code">▶ Run Code</div>

```js
console.info(Artplayer.option);
# artplayer-vue

Vue Component for Artplayer, It is recommended to package itself according to actual business needs.

## Demo

[Checkout the demo](https://codesandbox.io/s/thirsty-sunset-3lz7m) from Codesandbox

## Install

Install with `npm`

```bash
$ npm install artplayer-vue
```

Or install with `yarn`

```bash
$ yarn add artplayer-vue
```

## Usage

```js
import ArtplayerComponent from 'artplayer-vue';

// ...
<ArtplayerComponent
    :option="{
        // option, no 'container' property required
    }"
    @getInstance="ins => console.log(ins)" // get the instance
/>;
```

## License

MIT © [Harvey Zack](https://sleepy.im/)

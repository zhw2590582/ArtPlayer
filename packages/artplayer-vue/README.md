# artplayer-vue

Vue Component for Artplayer, It is recommended to package itself according to actual business needs.

## Demo

[Checkout the demo](https://codesandbox.io/s/6z76lm109n) from Codesandbox

## Install

Install with `npm`

```
$ npm install artplayer-vue
```

Or install with `yarn`

```
$ yarn add artplayer-vue
```

## Usage

```js
import ArtplayerComponent from 'artplayer-vue';
import 'artplayer-vue/dist/artplayer-vue.css';

// ...
<ArtplayerComponent
    :option="{
        // option, no 'container' property required
    }"
    @getInstance="ins => console.log(ins)" // get the instance
/>;
```

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)

# ArtPlayer

![version](https://badgen.net/npm/v/artplayer)
![license](https://badgen.net/npm/license/artplayer)
![size](https://badgen.net/bundlephobia/minzip/artplayer)

> ArtPlayer is a modern HTML5 video player

## Status

⚠️ This project is WIP and not ready for production use yet!

## Demo

[Checkout the demo](https://blog.zhw-island.com/ArtPlayer/)

## Introduction

## Install

```
$ npm install --save artplayer
```

```js
import Artplayer from 'artplayer';
import 'artplayer/dist/artplayer.css';
```

OR umd builds are also available

```html
<link rel="stylesheet" href="path/to/artplayer.css" />
<script src="path/to/artplayer.js"></script>
```

Will expose the global variable to `window.Artplayer`.

## Usage

```html
<div class="artplayer-app"></div>
```

```js
var app = new Artplayer({
  container: '.artplayer-app',
  url: 'path/to/video.mp4'
});
```

Note: You need to initialize a size for the container element, like:

```css
.artplayer-app {
  width: 400px;
  height: 300px;
}
```

## Configuration

<table>
    <tr>
        <th>parameter</th>
        <th>description</th>
    </tr>
    <tr>
        <th><code>container</code></th>
        <td>
            Type: <code>string</code>, <code>element</code><br>
            Default: <code>.artplayer</code><br>
            Required: <code>true</code><br><br>
            DOM container of the player
        </td>
    </tr>
    <tr>
        <th><code>url</code></th>
        <td>
            Type: <code>string</code><br>
            Default: <code>''</code><br>
            Required: <code>true</code><br><br>
            Video source url 
        </td>
    </tr>
    <tr>
        <th><code>poster</code></th>
        <td>
            Type: <code>string</code><br>
            Default: <code>''</code><br><br>
            Video poster url 
        </td>
    </tr>
    <tr>
        <th><code>title</code></th>
        <td>
            Type: <code>string</code><br>
            Default: <code>''</code><br><br>
            Video title, will be shown in screenshot file name and pip mode
        </td>
    </tr>
    <tr>
        <th><code>volume</code></th>
        <td>
            Type: <code>number</code><br>
            Default: <code>0.7</code><br><br>
            Default volume, player will cache the last volume, which may be overwritten
        </td>
    </tr>
    <tr>
        <th><code>autoplay</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to play automatically, sometimes it doesn't necessarily succeed<br>
            More info: <a  href="https://developers.google.com/web/updates/2017/09/autoplay-policy-changes">autoplay-policy-changes</a>
        </td>
    </tr>
    <tr>
        <th><code>autoSize</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Keep the original video aspect ratio and automatically zoom
        </td>
    </tr>
    <tr>
        <th><code>loop</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Automatic loop playback
        </td>
    </tr>
    <tr>
        <th><code>playbackRate</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show playback rate controller in the contextmenu
        </td>
    </tr>
    <tr>
        <th><code>aspectRatio</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show aspect ratio controller in the contextmenu
        </td>
    </tr>
    <tr>
        <th><code>screenshot</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show screenshot controller in the bottom
        </td>
    </tr>
    <tr>
        <th><code>setting</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show setting controller in the bottom
        </td>
    </tr>
    <tr>
        <th><code>pip</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show pip controller in the bottom
        </td>
    </tr>
    <tr>
        <th><code>fullscreen</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show window fullscreen controller in the bottom
        </td>
    </tr>
    <tr>
        <th><code>fullscreenWeb</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show web page fullscreen controller in the bottom
        </td>
    </tr>
    <tr>
        <th><code>hotkey</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>true</code><br><br>
            Whether to use hotkey
        </td>
    </tr>
    <tr>
        <th><code>lang</code></th>
        <td>
            Type: <code>string</code><br>
            Default: <code>navigator.language.toLowerCase()</code><br><br>
            Default display language
        </td>
    </tr>
    <tr>
        <th><code>theme</code></th>
        <td>
            Type: <code>string</code><br>
            Default: <code>#f00</code><br><br>
            Default theme color
        </td>
    </tr>
    <tr>
        <th><code>mutex</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>true</code><br><br>
            Player mutually exclusive
        </td>
    </tr>
    <tr>
        <th><code>subtitle</code></th>
        <td>
            Type: <code>object</code><br>
            Default: <code>{}</code><br><br>
            Custom subtitle<br>
            <table>
                <tr>
                    <th><code>url</code></th>
                    <td>
                        Type: <code>string</code><br>
                        Default: <code>''</code><br><br>
                        Subtitle url, support vtt and srt format
                    </td>
                </tr>
                <tr>
                    <th><code>style</code></th>
                    <td>
                        Type: <code>object</code><br>
                        Default: <code>{}</code><br><br>
                        Subtitle style
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <th><code>moreVideoAttr</code></th>
        <td>
            Type: <code>object</code><br>
            Default:<br>
            <code>
            {<br>
                'controls': false,<br>
                'preload': 'auto',<br>
                'webkit-playsinline': true,<br>
                'playsinline': true<br>
            }
            </code><br><br>
            More video Attributes<br>
        </td>
    </tr>  
    <tr>
        <th><code>quality</code></th>
        <td>
            Type: <code>array</code><br>
            Default: <code>[]</code><br><br>
            Custom quality, The type of quality is an object<br>
            <table>
                <tr>
                    <th><code>default</code></th>
                    <td>
                        Type: <code>boolean</code><br>
                        Default: <code>false</code><br><br>
                        Whether the default quality
                    </td>
                </tr>
                <tr>
                    <th><code>name</code></th>
                    <td>
                        Type: <code>string</code><br>
                        Default: <code>''</code><br><br>
                        Quality name
                    </td>
                </tr>
                <tr>
                    <th><code>url</code></th>
                    <td>
                        Type: <code>string</code><br>
                        Default: <code>''</code><br><br>
                        Quality url
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <th><code>highlight</code></th>
        <td>
            Type: <code>array</code><br>
            Default: <code>[]</code><br><br>
            Custom highlight, The type of highlight is an object<br>
            <table>
                <tr>
                    <th><code>time</code></th>
                    <td>
                        Type: <code>number</code><br>
                        Default: <code>0</code><br><br>
                        highlight seconds
                    </td>
                </tr>
                <tr>
                    <th><code>text</code></th>
                    <td>
                        Type: <code>string</code><br>
                        Default: <code>''</code><br><br>
                        highlight text
                    </td>
                </tr>
            </table>
        </td>
    </tr> 
    <tr>
        <th><code>layers</code></th>
        <td>
            Type: <code>array</code><br>
            Default: <code>[]</code><br><br>
            Custom layer, The type of layer is an object<br>
            <table>
                <tr>
                    <th><code>name</code></th>
                    <td>
                        Type: <code>string</code><br>
                        Default: <code>layer${id}</code><br><br>
                        The unique name of the layer, used for the class name
                    </td>
                </tr>
                <tr>
                    <th><code>index</code></th>
                    <td>
                        Type: <code>number</code><br>
                        Default: <code>${id}</code><br><br>
                        The unique index of the layer, used for the priority level
                    </td>
                </tr>
                <tr>
                    <th><code>html</code></th>
                    <td>
                        Type: <code>string</code>, <code>element</code><br>
                        Default: <code>''</code><br><br>
                        The dom element of the layer
                    </td>
                </tr>
                <tr>
                    <th><code>style</code></th>
                    <td>
                        Type: <code>object</code><br>
                        Default: <code>{}</code><br><br>
                        The style object of the layer
                    </td>
                </tr>
                <tr>
                    <th><code>click</code></th>
                    <td>
                        Type: <code>function</code><br>
                        Default: <code>undefined</code><br><br>
                        Click event of the layer
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <th><code>contextmenu</code></th>
        <td>
            Type: <code>array</code><br>
            Default: <code>[]</code><br><br>
            Custom contextmenu, The type of layer is an object<br>
            <table>
                <tr>
                    <th><code>name</code></th>
                    <td>
                        Type: <code>string</code><br>
                        Default: <code>contextmenu${id}</code><br><br>
                        The unique name of the contextmenu, used for the class name
                    </td>
                </tr>
                <tr>
                    <th><code>index</code></th>
                    <td>
                        Type: <code>number</code><br>
                        Default: <code>${id}</code><br><br>
                        The unique index of the contextmenu, used for the priority level
                    </td>
                </tr>
                <tr>
                    <th><code>html</code></th>
                    <td>
                        Type: <code>string</code>, <code>element</code><br>
                        Default: <code>''</code><br><br>
                        The dom element of the contextmenu
                    </td>
                </tr>
                <tr>
                    <th><code>style</code></th>
                    <td>
                        Type: <code>object</code><br>
                        Default: <code>{}</code><br><br>
                        The style object of the contextmenu
                    </td>
                </tr>
                <tr>
                    <th><code>click</code></th>
                    <td>
                        Type: <code>function</code><br>
                        Default: <code>undefined</code><br><br>
                        Click event of the contextmenu
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <th><code>controls</code></th>
        <td>
            Type: <code>array</code><br>
            Default: <code>[]</code><br><br>
            Custom controls, The type of controls is an object<br>
        </td>
    </tr>
</table>

## API

## Ecosystem

| Project                                                                                                       | Description                |
| ------------------------------------------------------------------------------------------------------------- | -------------------------- |
| [artplayer-plugin-danmu](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-plugin-danmu) | Danmu plugin for ArtPlayer |

## Issue

## Contributors

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)

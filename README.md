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
var art = new Artplayer({
  container: '.artplayer-app',
  url: 'path/to/video.mp4'
});
```

## Configuration

<table>
    <tr>
        <th>parameter</th>
        <th>description</th>
        <th>Example</th>
    </tr>
    <tr>
        <th><code>container</code></th>
        <td>
            Type: <code>string</code>, <code>element</code><br>
            Default: <code>.artplayer</code><br>
            Required: <code>true</code><br><br>
            DOM container of the player, you need to initialize a size for the container element
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20%2F%2F%20container%3A%20document.querySelector(%27.artplayer-app%27)%2C%0A%20%20%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>url</code></th>
        <td>
            Type: <code>string</code><br>
            Default: <code>''</code><br>
            Required: <code>true</code><br><br>
            Video source url, Three video file formats are supported: <code>mp4</code>, <code>ogg</code>, <code>webm</code>
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%20%20%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20%2F%2F%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.ogg%27%2C%0A%20%20%2F%2F%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.webm%27%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>poster</code></th>
        <td>
            Type: <code>string</code><br>
            Default: <code>''</code><br><br>
            Video poster image url 
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20poster%3A%20url%20%2B%20%27%2Fimage%2Fone-more-time-one-more-chance-poster.jpg%27%2C%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>title</code></th>
        <td>
            Type: <code>string</code><br>
            Default: <code>''</code><br><br>
            Video title, will be shown in <code>screenshot</code> file name and <code>pip</code> mode
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20title%3A%20%27%E3%80%90%E6%96%B0%E6%B5%B7%E8%AF%9A%E5%8A%A8%E7%94%BB%E3%80%91%E3%80%8E%E7%A7%92%E9%80%9F5%E3%82%BB%E3%83%B3%E3%83%81%E3%83%A1%E3%83%BC%E3%83%88%E3%83%AB%E3%80%8F%27%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>volume</code></th>
        <td>
            Type: <code>number</code><br>
            Default: <code>0.7</code><br><br>
            Default volume, player will cache the last volume, which may be overwritten
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20volume%3A%200.5%2C%0A%7D)%3B">Demo</a>
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
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20autoplay%3A%20true%2C%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>autoSize</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Keep the original video aspect ratio and automatically zoom
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20autoSize%3A%20true%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>loop</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Automatic loop playback
        </td>
        <td>
            <a target="_blank" href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20loop%3A%20true%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>playbackRate</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show playback rate controller in the contextmenu
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20playbackRate%3A%20true%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>aspectRatio</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show aspect ratio controller in the contextmenu
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20aspectRatio%3A%20true%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>screenshot</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show screenshot controller in the bottom
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20screenshot%3A%20true%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>setting</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show setting controller in the bottom
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20setting%3A%20true%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>pip</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show pip controller in the bottom
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20pip%3A%20true%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>fullscreen</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show window fullscreen controller in the bottom
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20fullscreen%3A%20true%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>fullscreenWeb</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>false</code><br><br>
            Whether to show web page fullscreen controller in the bottom
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20fullscreenWeb%3A%20true%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>hotkey</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>true</code><br><br>
            Whether to use hotkey<br>
            <table>
                <tr>
                    <th><code>↑</code></th>
                    <td>Increase volume</td>
                </tr>
                <tr>
                    <th><code>↓</code></th>
                    <td>Decrease volume</td>
                </tr>
                <tr>
                    <th><code>←</code></th>
                    <td>Seek backward</td>
                </tr>
                <tr>
                    <th><code>→</code></th>
                    <td>Seek forward</td>
                </tr>
                <tr>
                    <th><code>space</code></th>
                    <td>Toggle playback</td>
                </tr>
            </table>
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20hotkey%3A%20true%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>mutex</code></th>
        <td>
            Type: <code>boolean</code><br>
            Default: <code>true</code><br><br>
            Player mutually exclusive, only one player can play at a time
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20mutex%3A%20true%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>lang</code></th>
        <td>
            Type: <code>string</code><br>
            Default: <code>navigator.language.toLowerCase()</code><br><br>
            Default display language: <code>en</code>, <code>zh-cn</code>, <code>zh-tw</code>
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20lang%3A%20%27en%27%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>theme</code></th>
        <td>
            Type: <code>string</code><br>
            Default: <code>#f00</code><br><br>
            Default theme color
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20theme%3A%20%27%23ffad00%27%0A%7D)%3B">Demo</a>
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
                        Subtitle url, support <code>vtt</code> and <code>srt</code> format
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
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20subtitle%3A%20%7B%0A%20%20%20%20url%3A%20url%20%2B%20%27%2Fsubtitle%2Fone-more-time-one-more-chance.srt%27%2C%0A%20%20%20%20style%3A%20%7B%0A%20%20%20%20%20%20color%3A%20%27%2303A9F4%27%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>thumbnails</code></th>
        <td>
            Type: <code>object</code><br>
            Default: <code>{}</code><br><br>
            Custom thumbnails in the progress bar with lazy load<br>
            <table>
                <tr>
                    <th><code>url</code></th>
                    <td>
                        Type: <code>string</code><br>
                        Default: <code>''</code><br><br>
                        Thumbnails image url
                    </td>
                </tr>
                <tr>
                    <th><code>number</code></th>
                    <td>
                        Type: <code>number</code><br>
                        Default: <code>60</code><br><br>
                        Thumbnails number
                    </td>
                </tr>
                <tr>
                    <th><code>width</code></th>
                    <td>
                        Type: <code>number</code><br>
                        Default: <code>160</code><br><br>
                        Thumbnails width
                    </td>
                </tr>
                <tr>
                    <th><code>height</code></th>
                    <td>
                        Type: <code>number</code><br>
                        Default: <code>90</code><br><br>
                        Thumbnails height
                    </td>
                </tr>
                <tr>
                    <th><code>column</code></th>
                    <td>
                        Type: <code>number</code><br>
                        Default: <code>10</code><br><br>
                        Thumbnails column
                    </td>
                </tr>
            </table>
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20thumbnails%3A%20%7B%0A%20%20%20%20url%3A%20url%20%2B%20%27%2Fimage%2Fone-more-time-one-more-chance-thumbnails.png%27%2C%0A%20%20%20%20width%3A%20190%2C%0A%20%20%20%20height%3A%20107%0A%20%20%7D%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>moreVideoAttr</code></th>
        <td>
            Type: <code>object</code><br>
            Default: <code>{'controls': false,'preload': 'auto'}</code><br><br>
            More video Attributes, these properties will be written directly to the video element<br>
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20moreVideoAttr%3A%20%7B%0A%20%20%20%20%27webkit-playsinline%27%3A%20true%2C%0A%20%20%20%20%27playsinline%27%3A%20true%0A%20%20%7D%0A%7D)%3B">Demo</a>
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
                        Whether the default quality, if not specified, the first quality will be taken
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
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20quality%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20default%3A%20true%2C%0A%20%20%20%20%20%20name%3A%20%27%E6%A0%87%E6%B8%85%20480P%27%2C%0A%20%20%20%20%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20name%3A%20%27%E9%AB%98%E6%B8%85%20720P%27%2C%0A%20%20%20%20%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-720p.mp4%27%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D)%3B">Demo</a>
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
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20highlight%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20time%3A%2060%2C%0A%20%20%20%20%20%20text%3A%20%27One%20more%20chance%27%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20time%3A%20120%2C%0A%20%20%20%20%20%20text%3A%20%27%E8%B0%81%E3%81%A7%E3%82%82%E3%81%84%E3%81%84%E3%81%AF%E3%81%9A%E3%81%AA%E3%81%AE%E3%81%AB%27%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20time%3A%20180%2C%0A%20%20%20%20%20%20text%3A%20%27%E5%A4%8F%E3%81%AE%E6%83%B3%E3%81%84%E5%87%BA%E3%81%8C%E3%81%BE%E3%82%8F%E3%82%8B%27%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20time%3A%20240%2C%0A%20%20%20%20%20%20text%3A%20%27%E3%81%93%E3%82%93%E3%81%AA%E3%81%A8%E3%81%93%E3%81%AB%E3%81%82%E3%82%8B%E3%81%AF%E3%81%9A%E3%82%82%E3%81%AA%E3%81%84%E3%81%AE%E3%81%AB%27%0A%20%20%20%20%7D%2C%0A%20%20%20%20%7B%0A%20%20%20%20%20%20time%3A%20300%2C%0A%20%20%20%20%20%20text%3A%20%27%EF%BC%8D%EF%BC%8D%E7%BB%88%E3%82%8F%E3%82%8A%EF%BC%8D%EF%BC%8D%27%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D)%3B">Demo</a>
        </td>
    </tr> 
    <tr>
        <th><code>layers</code></th>
        <td>
            Type: <code>array</code><br>
            Default: <code>[]</code><br><br>
            Custom layer, The type of layer is an <code>object</code> or <code>function</code><br>
            <table>
                <tr>
                    <th><code>disable</code></th>
                    <td>
                        Type: <code>boolean</code><br>
                        Default: <code>undefined</code><br><br>
                        Whether to disable the layer
                    </td>
                </tr>
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
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20layers%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20html%3A%20%60%3Cimg%20style%3D%22width%3A%20100px%22%20src%3D%22%24%7Burl%7D%2Fimage%2Fyour-name.png%22%3E%60%2C%0A%20%20%20%20%20%20style%3A%20%7B%0A%20%20%20%20%20%20%20%20%20%20%27position%27%3A%20%27absolute%27%2C%0A%20%20%20%20%20%20%20%20%20%20%27top%27%3A%20%2720px%27%2C%0A%20%20%20%20%20%20%20%20%20%20%27right%27%3A%20%2720px%27%2C%0A%20%20%20%20%20%20%20%20%20%20%27opacity%27%3A%20%27.9%27%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%5D%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>contextmenu</code></th>
        <td>
            Type: <code>array</code><br>
            Default: <code>[]</code><br><br>
            Custom contextmenu, The type of layer is an <code>object</code> or <code>function</code><br>
            <table>
                <tr>
                    <th><code>disable</code></th>
                    <td>
                        Type: <code>boolean</code><br>
                        Default: <code>undefined</code><br><br>
                        Whether to disable the contextmenu
                    </td>
                </tr>
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
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=var%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20contextmenu%3A%20%5B%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20html%3A%20%27%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8F%9C%E5%8D%95%20-%20%E5%A4%A9%E4%BA%AE%E8%AF%B7%E5%85%B3%E7%81%AF%20%CE%A3(%E3%81%A3%20%C2%B0%D0%94%20%C2%B0%3B)%E3%81%A3%27%2C%0A%20%20%20%20%20%20%20%20%20%20click%3A%20function()%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20document.querySelector(%27.video-wrap%27).classList.toggle(%27dark%27)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20this.hide()%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%5D%0A%7D)%3B">Demo</a>
        </td>
    </tr>
    <tr>
        <th><code>controls</code></th>
        <td>
            Type: <code>array</code><br>
            Default: <code>[]</code><br><br>
            Custom controls, The type of controls is an object<br>
            <table>
                <tr>
                    <th><code>option</code></th>
                    <td>
                        Type: <code>object</code><br>
                        Default: <code>undefined</code><br><br>
                        Instantiated an object property<br>
                        <table>
                            <tr>
                                <th><code>disable</code></th>
                                <td>
                                    Type: <code>boolean</code><br>
                                    Default: <code>undefined</code><br><br>
                                    Whether to disable the controller
                                </td>
                            </tr>
                            <tr>
                                <th><code>name</code></th>
                                <td>
                                    Type: <code>string</code><br>
                                    Default: <code>control${id}</code><br><br>
                                    The unique name of the controller, used for the class name
                                </td>
                            </tr>
                            <tr>
                                <th><code>position</code></th>
                                <td>
                                    Type: <code>string</code><br>
                                    Default: <code>undefined</code><br><br>
                                    The position where the controller appears: <code>top</code>, <code>left</code>, <code>right</code>
                                </td>
                            </tr>
                            <tr>
                                <th><code>index</code></th>
                                <td>
                                    Type: <code>number</code><br>
                                    Default: <code>undefined</code><br><br>
                                    The unique index of the controller, used for the priority level
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
        <td>
            <a href="https://blog.zhw-island.com/ArtPlayer/?code=function%20MyController(option)%7B%0A%09this.option%20%3D%20option%3B%0A%7D%0A%0AMyController.prototype.apply%20%3D%20function(art%2C%20dom)%7B%0A%20%20%20%20dom.innerHTML%20%3D%20%27MyController%27%3B%0A%7D%0A%0Avar%20url%20%3D%20%27https%3A%2F%2Fblog.zhw-island.com%2Fassets-cdn%27%3B%0Avar%20art%20%3D%20new%20Artplayer(%7B%0A%20%20container%3A%20%27.artplayer-app%27%2C%0A%20%20url%3A%20url%20%2B%20%27%2Fvideo%2Fone-more-time-one-more-chance-480p.mp4%27%2C%0A%20%20controls%3A%20%5Bnew%20MyController(%7B%0A%20%20%09%20%20name%3A%20%27myController%27%2C%0A%20%20%20%20%20%20disable%3A%20false%2C%0A%20%20%20%20%20%20position%3A%20%27right%27%2C%0A%20%20%20%20%20%20index%3A%2010%0A%20%20%7D)%5D%0A%7D)%3B">Demo</a>
        </td>
    </tr>
</table>

## API

#### Example

```js
var art = new Artplayer({
  container: '.artplayer-app',
  url: 'path/to/video.mp4'
});
```

#### Class static properties and methods

| Parameter                        | Description               |
| -------------------------------- | ------------------------- |
| <code>Artplayer.version</code>   | Version Information       |
| <code>Artplayer.config</code>    | Configuration information |
| <code>Artplayer.utils</code>     | Common utils              |
| <code>Artplayer.DEFAULTS</code>  | Default configuration     |
| <code>Artplayer.instances</code> | Instance collection       |
| <code>Artplayer.use()</code>     | Function to load plugin   |

#### Instance properties and methods

| Method                     | Parameter                              | Description                                           |
| -------------------------- | -------------------------------------- | ----------------------------------------------------- |
| <code>art.init()</code>    |                                        | Initialization instance, in general you don't need it |
| <code>art.destroy()</code> | <code>true</code> / <code>false</code> | Destroy instance, and whether to remove dom           |

#### Listening event

## Ecosystem

| Project                                                                                                       | Description                |
| ------------------------------------------------------------------------------------------------------------- | -------------------------- |
| [artplayer-plugin-danmu](https://github.com/zhw2590582/ArtPlayer/tree/master/packages/artplayer-plugin-danmu) | Danmu plugin for ArtPlayer |

## Issue

## Contributors

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)
